import { TouchableOpacity, Alert } from "react-native";
import { MoreVertical } from "lucide-react-native";
import { useIsAdmin, confirmDelete, reportContent, type ReportTarget } from "../lib/moderation";

/**
 * Botão de três pontos que aparece nos conteúdos da comunidade, marketplace,
 * negócios e animais perdidos.
 *
 * - Qualquer pessoa vê "Denunciar".
 * - A opção "Apagar" só aparece a quem é dono do conteúdo ou às contas de
 *   administração (a utilizadora). Mais ninguém a vê.
 */
export function ModerationButton({
  target,
  targetId,
  preview,
  isOwner,
  onDelete,
  color = "#9CA3AF",
  size = 18,
  label,
}: {
  target: ReportTarget;
  targetId: string;
  preview?: string;
  /** O conteúdo é da própria pessoa? */
  isOwner?: boolean;
  /** Chamado quando a pessoa confirma que quer apagar. */
  onDelete: () => void | Promise<void>;
  color?: string;
  size?: number;
  /** Nome do que vai ser apagado, ex.: "este anúncio". */
  label?: string;
}) {
  const isAdmin = useIsAdmin();
  const canDelete = isAdmin || !!isOwner;

  const open = () => {
    const buttons: any[] = [
      {
        text: "Denunciar",
        onPress: () => reportContent(target, targetId, preview),
      },
    ];

    if (canDelete) {
      buttons.unshift({
        text: isAdmin && !isOwner ? "Apagar (administração)" : "Apagar",
        style: "destructive",
        onPress: async () => {
          const ok = await confirmDelete(label ?? "este conteúdo");
          if (ok) await onDelete();
        },
      });
    }

    buttons.push({ text: "Cancelar", style: "cancel" });

    Alert.alert("Opções", undefined, buttons, { cancelable: true });
  };

  return (
    <TouchableOpacity
      onPress={open}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MoreVertical size={size} color={color} />
    </TouchableOpacity>
  );
}
