import { Hono } from "hono";
import { db, sqlClient } from "../database";
import * as schema from "../database/schema";
import { eq } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";
import { verificarSubscricao, validacaoGoogleActiva } from "../lib/google-play";
import { isAdmin } from "../lib/admin";

// Testadores fechados (Play Console) — acesso ilimitado, sem bloqueio de trial/subscrição
const TESTER_EMAILS = [
  "digitalglobal2026fil@gmail.com",
  "videira.xana82@gmail.com",
  "ale.c.cardoso2010@gmail.com",
  "alebtc2121@gmail.com",
  "barbarateresa735@gmail.com",
  "julianasousa2006@gmail.com",
  "marianasousa42@gmail.com",
  "aleclikes@outlook.pt",
  "alessandra100275@gmail.com",
  "amorim2309izabel@gmail.com",
  "marco_reis19@hotmail.com",
  "ricardoabril1977@gmail.com",
  "amordebolo.almada@gmail.com",
  "amordebolo.corroios@gmail.com",
  "ritaraquelbia@gmail.com",
  "wiser.pt@hotmail.com",
  "mdccrds@gmail.com",
];

/**
 * Colunas acrescentadas depois de a tabela já existir em produção.
 * O ALTER TABLE falha se a coluna já lá estiver — o erro é ignorado de propósito.
 * NUNCA correr db:push nesta base de dados.
 */
let columnsReady: Promise<void> | null = null;
function ensureColumns() {
  if (!columnsReady) {
    columnsReady = (async () => {
      for (const col of ["google_purchase_token", "google_product_id"]) {
        try {
          await sqlClient.execute({
            sql: `ALTER TABLE subscriptions ADD COLUMN ${col} TEXT`,
            args: [],
          });
        } catch {
          /* a coluna já existe */
        }
      }
    })();
  }
  return columnsReady;
}

export const subscriptions = new Hono()
  .use("*", authMiddleware)
  .get("/me", requireAuth, async (c) => {
    const user = c.get("user")!;

    if (user.email && TESTER_EMAILS.includes(user.email.toLowerCase())) {
      return c.json({ subscription: null, isActive: true, isTrial: false, isTester: true }, 200);
    }

    const [sub] = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.userId, user.id));
    if (!sub) {
      // Auto-create trial
      const trialEndsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      const [newSub] = await db.insert(schema.subscriptions).values({
        userId: user.id,
        plan: "trial",
        status: "active",
        trialEndsAt,
      }).returning();
      return c.json({ subscription: newSub, isActive: true, isTrial: true }, 200);
    }
    const now = new Date();
    const isTrial = sub.plan === "trial";
    const isActive = sub.status === "active" && (
      isTrial ? (sub.trialEndsAt ? sub.trialEndsAt > now : false) :
      (sub.currentPeriodEnd ? sub.currentPeriodEnd > now : false)
    );
    return c.json({ subscription: sub, isActive, isTrial }, 200);
  })
  /**
   * Activação manual — só para a administração e para os testadores fechados.
   * Antes qualquer pessoa que chamasse esta rota ficava com subscrição activa
   * sem pagar. As compras a sério passam pelo /google-verify.
   */
  /**
   * Diagnóstico: diz se a validação das compras já está ligada.
   * Abrir no browser: /api/subscriptions/google-status?pin=2776
   */
  .get("/google-status", async (c) => {
    const pin = c.req.query("pin") || "";
    if (pin !== (process.env.ADMIN_PIN || "2776")) return c.json({ error: "PIN errado" }, 403);
    const ligada = validacaoGoogleActiva();
    let conta: string | null = null;
    try {
      const j = JSON.parse(process.env.GOOGLE_PLAY_SERVICE_ACCOUNT || "{}");
      conta = j.client_email || null;
    } catch { conta = "JSON inválido"; }
    return c.json({
      validacaoLigada: ligada,
      contaDeServico: conta,
      pacote: process.env.ANDROID_PACKAGE_NAME || "com.petislife2.app",
      nota: ligada
        ? "As compras são confirmadas junto da Google."
        : "Falta a variável GOOGLE_PLAY_SERVICE_ACCOUNT no Render.",
    }, 200);
  })

  .post("/activate", requireAuth, async (c) => {
    const user = c.get("user")!;
    const emailUtilizador = (user.email || "").toLowerCase();
    if (!isAdmin(user) && !TESTER_EMAILS.includes(emailUtilizador)) {
      return c.json({ error: "As subscrições são feitas pelo Google Play." }, 403);
    }
    const body = await c.req.json();
    const { plan } = body; // monthly or annual
    const now = new Date();
    const periodEnd = plan === "annual"
      ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [existing] = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.userId, user.id));
    if (existing) {
      const [sub] = await db.update(schema.subscriptions).set({
        plan,
        status: "active",
        currentPeriodEnd: periodEnd,
        updatedAt: new Date(),
      }).where(eq(schema.subscriptions.userId, user.id)).returning();
      return c.json({ subscription: sub }, 200);
    }
    const [sub] = await db.insert(schema.subscriptions).values({
      userId: user.id,
      plan,
      status: "active",
      currentPeriodEnd: periodEnd,
    }).returning();
    return c.json({ subscription: sub }, 201);
  })

  /**
   * Compra feita dentro da app pelo Google Play.
   *
   * A app envia o comprovativo (productId + purchaseToken). O servidor pergunta
   * à Google se a compra existe mesmo, se foi paga e até quando é válida, e só
   * depois dá acesso. A data de fim vem da Google, não da app.
   *
   * Enquanto a variável GOOGLE_PLAY_SERVICE_ACCOUNT não estiver no Render, a
   * validação fica desligada e a compra é aceite como antes (não parte nada).
   */
  .post("/google-verify", requireAuth, async (c) => {
    await ensureColumns();
    const user = c.get("user")!;
    const body = await c.req.json().catch(() => ({}) as any);
    const productId = String(body?.productId || "").trim();
    const purchaseToken = String(body?.purchaseToken || "").trim();
    if (!productId || !purchaseToken) {
      return c.json({ error: "productId e purchaseToken obrigatórios" }, 400);
    }

    // Perguntar à Google se esta compra é verdadeira.
    let confirmacao;
    try {
      confirmacao = await verificarSubscricao(purchaseToken);
    } catch (e) {
      console.error("[subscriptions] falha a validar na Google:", e);
      confirmacao = { valida: false, motivo: "Não foi possível confirmar a compra agora." } as const;
    }
    if (!confirmacao.valida) {
      return c.json({ error: confirmacao.motivo || "Compra não confirmada pela Google." }, 402);
    }

    // O plano vem do productId que a Google devolve; só se usa o da app quando
    // a validação está desligada.
    const idReal = (confirmacao as any).productId || productId;
    const plan = idReal === "premium_anual" ? "annual" : "monthly";
    const now = new Date();
    const fimGoogle = (confirmacao as any).expiraEm as Date | undefined;
    const periodEnd = fimGoogle ?? (plan === "annual"
      ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));

    const values = {
      plan,
      status: "active",
      currentPeriodEnd: periodEnd,
      googlePurchaseToken: purchaseToken,
      updatedAt: new Date(),
    };

    const [existing] = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.userId, user.id));
    if (existing) {
      const [sub] = await db.update(schema.subscriptions)
        .set(values)
        .where(eq(schema.subscriptions.userId, user.id))
        .returning();
      return c.json({ subscription: sub, plan, validado: validacaoGoogleActiva() }, 200);
    }
    const [sub] = await db.insert(schema.subscriptions)
      .values({ userId: user.id, ...values })
      .returning();
    return c.json({ subscription: sub, plan, validado: validacaoGoogleActiva() }, 200);
  });
