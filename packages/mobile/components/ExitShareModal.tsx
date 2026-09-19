import { Modal, View } from "react-native";
import { ShareReminderBird } from "./ShareReminderBird";

/**
 * Aviso do passarinho mostrado quando a utilizadora tenta saír da app
 * (botão de voltar do telemóvel, no ecrã Início). Depois de fechar (com a
 * cruz ou depois de partilhar) a app sai mesmo — isto é só um lembrete, não
 * um bloqueio.
 */
export function ExitShareModal({ visible, onClose, onShare }: {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", paddingHorizontal: 20 }}>
        <ShareReminderBird variant="modal" onClose={onClose} onShare={onShare} />
      </View>
    </Modal>
  );
}
