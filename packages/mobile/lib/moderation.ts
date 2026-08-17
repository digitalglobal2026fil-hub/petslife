import { Alert } from "react-native";
import { authClient } from "./auth";
import Constants from "expo-constants";
import { authFetch } from "./auth-fetch";
import { tr } from "./i18n";

/**
 * Moderação de conteúdo.
 *
 * - isAdminUser: diz se a conta ligada é uma das contas de administração.
 *   Os botões de apagar conteúdo de outras pessoas só aparecem para estas.
 * - confirmDelete: pergunta sempre antes de apagar, para não apagar sem querer.
 * - reportContent: envia uma denúncia para o painel da administradora.
 */

export const ADMIN_EMAILS = [
  "digitalglobal2026fil@gmail.com",
  "aleclikes@outlook.pt",
];

export const API_URL = (
  (Constants.expoConfig?.extra?.apiUrl as string) ??
  process.env.EXPO_PUBLIC_API_URL ??
  "http://localhost:4200"
).replace(/\/$/, "");

export function isAdminEmail(email?: string | null): boolean {
  const e = email?.toLowerCase().trim();
  return !!e && ADMIN_EMAILS.includes(e);
}

/** Hook simples: a conta ligada é administradora? */
export function useIsAdmin(): boolean {
  const { data: session } = authClient.useSession();
  return isAdminEmail(session?.user?.email);
}

/** Confirmação antes de apagar. Devolve true se a pessoa confirmar. */
export function confirmDelete(what: string): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      tr("Apagar"),
      `Apagar ${what}? Esta acção não pode ser desfeita.`,
      [
        { text: tr("Cancelar"), style: "cancel", onPress: () => resolve(false) },
        { text: tr("Apagar"), style: "destructive", onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

export type ReportTarget = "post" | "comment" | "listing" | "business" | "lost_pet";

const REASONS = [
  "Conteúdo ofensivo ou obsceno",
  "Não tem nada a ver com animais",
  "Anúncio falso ou enganador",
  "Já não existe / encerrou",
  "Maus-tratos a animais",
];

/**
 * Mostra o menu de motivos e envia a denúncia.
 */
export function reportContent(target: ReportTarget, targetId: string, preview?: string) {
  const send = async (reason: string) => {
    try {
      const res = await authFetch(`${API_URL}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: target, targetId, reason, preview: preview ?? "" }),
      });
      if (!res.ok) throw new Error();
      Alert.alert(
        tr("Obrigado"),
        tr("A denúncia foi enviada. A equipa vai analisar e tomar as medidas necessárias."),
      );
    } catch {
      Alert.alert(tr("Sem ligação"), "Não foi possível enviar a denúncia. Tente novamente mais tarde.");
    }
  };

  const buttons: any[] = REASONS.map((r) => ({ text: r, onPress: () => send(r) }));
  buttons.push({ text: tr("Cancelar"), style: "cancel" });

  Alert.alert(tr("Denunciar conteúdo"), tr("Qual é o motivo?"), buttons, { cancelable: true });
}

/**
 * Apaga conteúdo. Funciona para o dono do conteúdo e para a administração
 * (o servidor é que decide; se não houver permissão devolve 403).
 */
export async function deleteContent(
  target: ReportTarget,
  targetId: string,
  extra?: { postId?: string },
): Promise<boolean> {
  const path =
    target === "post" ? `/api/posts/${targetId}`
    : target === "comment" ? `/api/posts/${extra?.postId}/comments/${targetId}`
    : target === "listing" ? `/api/marketplace/${targetId}`
    : target === "business" ? `/api/businesses/${targetId}`
    : `/api/lost-pets/${targetId}`;

  try {
    const res = await authFetch(`${API_URL}${path}`, { method: "DELETE" });
    if (res.status === 403) {
      Alert.alert(tr("Sem permissão"), tr("Só o autor do conteúdo ou a administração podem apagar."));
      return false;
    }
    if (!res.ok) throw new Error();
    return true;
  } catch {
    Alert.alert(tr("Erro"), "Não foi possível apagar. Verifique a ligação à internet e tente outra vez.");
    return false;
  }
}
