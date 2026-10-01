import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { safeBack } from "../lib/safe-back";

/**
 * Botão circular de voltar, usado nos ecrãs principais (Saúde, Álbum,
 * Comunidade, Mercado, Perfil, Negócios, Consulta Online) que antes não
 * tinham nenhuma forma de voltar visível — a utilizadora reportou que
 * "tudo o que está na barra de baixo não tem o voltar". Como estes ecrãs
 * são o topo da própria secção, "voltar" aqui significa voltar ao Início.
 * Mesmo sendo ecrãs-raiz das abas, ter sempre um botão visível evita a
 * sensação de ficar "preso" sem saber como regressar.
 */
export function HomeBackButton({ fallback = "/(tabs)", color = "#fff" }: { fallback?: string; color?: string }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => safeBack(router, fallback)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: "rgba(255,255,255,0.25)",
        alignItems: "center", justifyContent: "center",
        marginBottom: 10,
      }}
      activeOpacity={0.8}
    >
      <ChevronLeft size={22} color={color} />
    </TouchableOpacity>
  );
}
