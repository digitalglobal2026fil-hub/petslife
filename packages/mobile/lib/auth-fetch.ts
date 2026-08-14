/**
 * Pedido autenticado — ÚNICO ponto de autenticação da app.
 *
 * PROBLEMA QUE ISTO RESOLVE
 * A app tinha dois sistemas de login a funcionar em paralelo:
 *  1. o cliente Hono (`lib/api.ts`) autentica por cookie, guardado
 *     automaticamente pelo React Native — funciona sempre;
 *  2. 12 ecrãs (upload de fotos/documentos, chat, lembretes, parceiros,
 *     consultas, peso, perfil...) mandavam `Authorization: Bearer <token>`
 *     lido do SecureStore.
 * O token do ponto 2 só era guardado no momento exacto do sign-in/sign-up. Se
 * faltasse ou tivesse expirado, esses ecrãs recebiam 401 e mostravam
 * "Sessão expirada. Faz login novamente." — enquanto o resto da app continuava
 * a funcionar, o que tornava o problema confuso de diagnosticar.
 *
 * Agora: se o token faltar, é recuperado a partir da sessão de cookie
 * (`getSession` devolve o header `set-auth-token`) antes do pedido seguir.
 */
import { authClient, captureToken, getTokenAsync } from "./auth";
import { triggerSessionExpired } from "./session-expired";

/** Garante um token válido, recuperando-o da sessão de cookie se necessário. */
export async function ensureToken(): Promise<string> {
  const existing = await getTokenAsync();
  if (existing) return existing;

  // Sem token: pedir a sessão. O plugin bearer devolve o header
  // `set-auth-token`, que o captureToken guarda no SecureStore.
  try {
    await authClient.getSession({ fetchOptions: { onSuccess: captureToken } } as any);
  } catch {
    // sem rede — devolve vazio e o pedido segue só com o cookie
  }
  return await getTokenAsync();
}

/** fetch com autenticação e tratamento de sessão expirada. */
export async function authFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await ensureToken();

  const headers: Record<string, string> = {
    ...((init.headers as Record<string, string>) ?? {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    // O cookie pode continuar válido e só o token estar velho: tentar uma vez
    // com um token novo antes de dar a sessão como perdida.
    try {
      await authClient.getSession({ fetchOptions: { onSuccess: captureToken } } as any);
      const fresh = await getTokenAsync();
      if (fresh && fresh !== token) {
        const retry = await fetch(url, {
          ...init,
          headers: { ...headers, Authorization: `Bearer ${fresh}` },
        });
        if (retry.status !== 401) return retry;
      }
    } catch {
      // segue para a recuperação normal
    }
    triggerSessionExpired();
  }

  return res;
}

/** Cabeçalhos JSON autenticados, para quem precisa deles em separado. */
export async function authJsonHeaders(extra: Record<string, string> = {}) {
  const token = await ensureToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}
