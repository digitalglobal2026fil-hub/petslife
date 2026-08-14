/**
 * Recuperação automática de sessão expirada.
 *
 * Antes: quando o token guardado no telemóvel expirava, a app respondia 401 a
 * tudo o que exige login (ex.: upload de fotos e documentos) e mostrava
 * "Sessão expirada. Faz login novamente." — mas nada limpava o token nem
 * levava o utilizador ao ecrã de entrada, pelo que ficava preso.
 *
 * Agora qualquer 401 limpa a sessão local e leva ao ecrã de entrada.
 */
import { clearToken } from "./auth";

type Handler = () => void;

let handler: Handler | null = null;
let lastTriggered = 0;

/** Registado uma vez pelo AuthGuard (tem acesso ao router). */
export function onSessionExpired(fn: Handler) {
  handler = fn;
}

export function triggerSessionExpired() {
  // Evitar repetir se vários pedidos falharem ao mesmo tempo
  const now = Date.now();
  if (now - lastTriggered < 3000) return;
  lastTriggered = now;

  clearToken();
  try {
    handler?.();
  } catch {
    // ignorar: o token já foi limpo, o AuthGuard redirecciona no próximo render
  }
}

/** fetch que deteta 401 e dispara a recuperação. */
export const fetchWithSessionCheck: typeof fetch = async (input, init) => {
  const res = await fetch(input as any, init as any);
  if (res.status === 401) triggerSessionExpired();
  return res;
};
