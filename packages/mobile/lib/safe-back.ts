/**
 * Voltar atrás em segurança. Em alguns telemóveis / fluxos o histórico de
 * navegação fica vazio (ex.: ecrã aberto sozinho, ou depois de a app ter
 * sido reaberta) e um `router.back()` normal não faz nada — parece que o
 * botão de voltar "não funciona". Isto garante que, se não houver histórico
 * para voltar, vamos sempre para a área de Saúde em vez de ficar parado.
 */
export function safeBack(router: { back: () => void; canGoBack?: () => boolean; replace: (href: any) => void }, fallback: string = "/(tabs)") {
  if (typeof router.canGoBack === "function" && !router.canGoBack()) {
    router.replace(fallback as any);
    return;
  }
  router.back();
}
