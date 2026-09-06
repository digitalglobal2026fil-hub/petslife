/**
 * Validação real das compras junto dos servidores da Google.
 *
 * COMO FUNCIONA
 * A app envia o comprovativo da compra (purchaseToken). Antes de dar acesso,
 * o servidor pergunta à Google se aquela compra existe mesmo, se foi paga e
 * até quando é válida. Assim ninguém consegue enganar a app.
 *
 * O QUE É PRECISO NO RENDER
 *   GOOGLE_PLAY_SERVICE_ACCOUNT  → o conteúdo completo do ficheiro .json da
 *                                  conta de serviço do Google Cloud
 *   ANDROID_PACKAGE_NAME         → opcional (por omissão com.petislife2.app)
 *
 * Se a variável não estiver definida, a validação fica desligada e o servidor
 * continua a funcionar como antes (aceita a compra sem confirmar). Assim nada
 * deixa de funcionar enquanto a chave não for criada.
 *
 * Não precisa de bibliotecas novas: o token OAuth é assinado com o módulo
 * `node:crypto` que já vem com o Bun.
 */
import { createSign } from "node:crypto";

const PACOTE = process.env.ANDROID_PACKAGE_NAME || "com.petislife2.app";
const AMBITO = "https://www.googleapis.com/auth/androidpublisher";

export function validacaoGoogleActiva(): boolean {
  return !!process.env.GOOGLE_PLAY_SERVICE_ACCOUNT;
}

type Conta = { client_email: string; private_key: string };

function lerConta(): Conta | null {
  const bruto = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT;
  if (!bruto) return null;
  try {
    const j = JSON.parse(bruto);
    if (!j.client_email || !j.private_key) return null;
    // Quando se cola o JSON numa variável de ambiente, as quebras de linha da
    // chave podem vir escritas como \n literal.
    return { client_email: j.client_email, private_key: String(j.private_key).replace(/\\n/g, "\n") };
  } catch {
    return null;
  }
}

function base64url(s: string | Buffer): string {
  return Buffer.from(s).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

let cacheToken: { valor: string; expira: number } | null = null;

/** Pede à Google um token de acesso (válido 1 hora, guardado em memória). */
async function obterAccessToken(): Promise<string | null> {
  if (cacheToken && cacheToken.expira > Date.now() + 60_000) return cacheToken.valor;

  const conta = lerConta();
  if (!conta) return null;

  const agora = Math.floor(Date.now() / 1000);
  const cabecalho = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const corpo = base64url(JSON.stringify({
    iss: conta.client_email,
    scope: AMBITO,
    aud: "https://oauth2.googleapis.com/token",
    iat: agora,
    exp: agora + 3600,
  }));

  let assinatura: string;
  try {
    const sign = createSign("RSA-SHA256");
    sign.update(`${cabecalho}.${corpo}`);
    sign.end();
    assinatura = base64url(sign.sign(conta.private_key));
  } catch (e) {
    console.error("[google-play] chave privada inválida:", e);
    return null;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${cabecalho}.${corpo}.${assinatura}`,
    }).toString(),
  });

  if (!res.ok) {
    console.error("[google-play] não foi possível obter token:", res.status, await res.text().catch(() => ""));
    return null;
  }
  const j: any = await res.json();
  if (!j?.access_token) return null;
  cacheToken = { valor: j.access_token, expira: Date.now() + (Number(j.expires_in || 3600) - 120) * 1000 };
  return j.access_token;
}

export type ResultadoCompra = {
  /** true = a Google confirmou que a compra é boa */
  valida: boolean;
  /** até quando a subscrição está paga */
  expiraEm?: Date;
  /** compra ainda a decorrer (pode estar em período de tolerância) */
  estado?: string;
  /** id do produto tal como a Google o devolve */
  productId?: string;
  /** motivo, quando não é válida */
  motivo?: string;
  /** true quando a validação está desligada (falta a chave no Render) */
  desligada?: boolean;
};

/**
 * Confirma uma subscrição comprada no Google Play.
 * Usa a API subscriptionsv2, que é a actual.
 */
export async function verificarSubscricao(purchaseToken: string): Promise<ResultadoCompra> {
  if (!validacaoGoogleActiva()) return { valida: true, desligada: true };

  const token = await obterAccessToken();
  if (!token) return { valida: false, motivo: "Não foi possível falar com a Google." };

  const url =
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(PACOTE)}` +
    `/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 404 || res.status === 400) {
    return { valida: false, motivo: "A Google não reconhece esta compra." };
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("[google-play] erro a validar:", res.status, txt);
    return { valida: false, motivo: "A Google não respondeu como esperado." };
  }

  const j: any = await res.json();
  const estado = String(j?.subscriptionState || "");
  const linha = Array.isArray(j?.lineItems) && j.lineItems.length > 0 ? j.lineItems[0] : null;
  const productId = linha?.productId ? String(linha.productId) : undefined;
  const fim = linha?.expiryTime ? new Date(linha.expiryTime) : undefined;

  const bons = [
    "SUBSCRIPTION_STATE_ACTIVE",
    "SUBSCRIPTION_STATE_IN_GRACE_PERIOD",
    "SUBSCRIPTION_STATE_CANCELED", // cancelada mas paga até ao fim do período
  ];

  if (!bons.includes(estado)) {
    return { valida: false, estado, productId, motivo: "Esta subscrição não está activa." };
  }
  if (fim && fim.getTime() < Date.now()) {
    return { valida: false, estado, productId, motivo: "Esta subscrição já expirou." };
  }

  return { valida: true, expiraEm: fim, estado, productId };
}
