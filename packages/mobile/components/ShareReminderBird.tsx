import { useEffect, useRef } from "react";
import { View, Text, Image, Animated, Easing, TouchableOpacity, Dimensions } from "react-native";
import { Share2, X } from "lucide-react-native";
import { tr } from "../lib/i18n";
import { TEXTO_LEMBRETE_PARTILHA } from "../lib/share-reminder";

const { width: SCREEN_W } = Dimensions.get("window");
const PASSARINHO = require("../assets/mascot-bird.png");

/**
 * O passarinho com a bandeirola — lembrete de partilha/apoio à causa
 * animal. Entra a voar desde a borda do ecrã, fica um pouco parado a
 * abanar a bandeirola, e volta a sair a voar. Usado tanto no banner do
 * Início como no aviso ao sair da app (variant="modal").
 */
export function ShareReminderBird({ onClose, onShare, variant = "banner" }: {
  onClose: () => void;
  onShare: () => void;
  variant?: "banner" | "modal";
}) {
  const voo = useRef(new Animated.Value(0)).current; // 0 = fora (direita), 1 = dentro
  const bandeirola = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(voo, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    const abanar = Animated.loop(
      Animated.sequence([
        Animated.timing(bandeirola, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(bandeirola, { toValue: 0, duration: 500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    abanar.start();
    return () => abanar.stop();
  }, []);

  function fecharComAnimacao(depois: () => void) {
    Animated.timing(voo, { toValue: 0, duration: 500, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => depois());
  }

  const translateX = voo.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_W * 0.5, 0] });
  const opacity = voo;
  const rotBandeirola = bandeirola.interpolate({ inputRange: [0, 1], outputRange: ["-8deg", "8deg"] });

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateX }],
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#EAF7F0",
        borderRadius: 18,
        padding: 14,
        marginHorizontal: variant === "banner" ? 20 : 0,
        marginBottom: variant === "banner" ? 16 : 0,
        borderWidth: 1.5,
        borderColor: "#A7E8C4",
      }}
    >
      <View style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
        <Image source={PASSARINHO} style={{ width: 44, height: 44 }} resizeMode="contain" />
        {/* Bandeirola pequena a abanar junto ao passarinho */}
        <Animated.View
          style={{
            position: "absolute", right: -6, top: 2,
            transform: [{ rotate: rotBandeirola }],
          }}
        >
          <Text suppressHighlighting style={{ fontSize: 16 }}>🚩</Text>
        </Animated.View>
      </View>

      <View style={{ flex: 1 }}>
        <Text suppressHighlighting style={{ color: "#065F46", fontSize: 12.5, lineHeight: 18, fontWeight: "600" }}>
          {tr(TEXTO_LEMBRETE_PARTILHA)}
        </Text>
        <TouchableOpacity
          onPress={onShare}
          activeOpacity={0.85}
          style={{
            marginTop: 8, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6,
            backgroundColor: "#16A34A", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7,
          }}
        >
          <Share2 size={14} color="#fff" />
          <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>{tr("Partilhar a PetsLife")}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => fecharComAnimacao(onClose)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{ padding: 4 }}
      >
        <X size={16} color="#4B9E77" />
      </TouchableOpacity>
    </Animated.View>
  );
}
