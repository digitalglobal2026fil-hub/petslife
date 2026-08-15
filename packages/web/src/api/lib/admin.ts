/**
 * Contas com poderes de moderação na app.
 *
 * Só estes emails podem apagar conteúdo que não é deles (anúncios do
 * marketplace, negócios/clínicas, publicações e comentários da comunidade,
 * animais perdidos) e ver a lista de denúncias.
 */
export const ADMIN_EMAILS = [
  "digitalglobal2026fil@gmail.com",
  "aleclikes@outlook.pt",
];

export function isAdmin(user: { email?: string | null } | null | undefined): boolean {
  const email = user?.email?.toLowerCase().trim();
  return !!email && ADMIN_EMAILS.includes(email);
}
