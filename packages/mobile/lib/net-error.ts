/**
 * Converte erros técnicos em mensagens que a utilizadora entende.
 * Antes mostrava só "Erro" ou "Network request failed".
 */
export function netError(e: any, fallback = "Algo não correu bem. Tenta outra vez."): string {
  const msg = String(e?.message ?? e ?? "").toLowerCase();

  if (!msg) return fallback;

  if (msg.includes("network request failed") || msg.includes("failed to fetch") || msg.includes("networkerror")) {
    return "Sem ligação à internet. Verifica o Wi-Fi ou os dados móveis e tenta outra vez.";
  }
  if (msg.includes("timeout") || msg.includes("timed out") || msg.includes("aborted")) {
    return "O servidor está a demorar a responder. Tenta novamente dentro de alguns segundos.";
  }
  if (msg.includes("unauthorized") || msg.includes("401")) {
    return "A tua sessão expirou. Fecha e volta a entrar na app.";
  }
  if (msg.includes("403")) return "Não tens permissão para isto.";
  if (msg.includes("404")) return "Não encontrámos o que procuravas.";
  if (msg.includes("500") || msg.includes("502") || msg.includes("503")) {
    return "O servidor está temporariamente indisponível. Tenta dentro de um minuto.";
  }
  if (msg.includes("json") || msg.includes("unexpected token")) {
    return "Resposta inválida do servidor. Tenta outra vez.";
  }

  return e?.message ?? fallback;
}
