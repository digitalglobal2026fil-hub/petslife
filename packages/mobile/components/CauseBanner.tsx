import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, TouchableOpacity } from "react-native";
import { tr } from "../lib/i18n";

/**
 * Banner fofo sobre a causa animal — aparece sempre no Início, com as
 * patinhas 🐾 no início e no fim do texto a balançar suavemente (daí
 * "rotativo"). Ao tocar, convida a partilhar a app para ajudar a causa.
 */
function PatinhaAnimada({ espelhar }: { espelhar?: boolean }) {
  const balanco = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(balanco, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(balanco, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const sinal = espelhar ? -1 : 1;
  const rotate = balanco.interpolate({ inputRange: [0, 1], outputRange: [`${-14 * sinal}deg`, `${14 * sinal}deg`] });

  return (
    <Animated.Text suppressHighlighting style={{ fontSize: 15, transform: [{ rotate }] }}>
      🐾
    </Animated.Text>
  );
}

export function CauseBanner({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#FDF2F8",
        borderRadius: 18,
        padding: 14,
        marginHorizontal: 20,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: "#F9D5E6",
      }}
    >
      <PatinhaAnimada />
      <Text suppressHighlighting style={{ flex: 1, color: "#9D174D", fontSize: 12.5, lineHeight: 18, fontWeight: "600", textAlign: "center" }}>
        {tr(" Lembre-se: parte da sua subscrição será convertida em ajuda para causa animal. Partilhe, ajude-nos nessa causa! ")}
      </Text>
      <PatinhaAnimada espelhar />
    </TouchableOpacity>
  );
}
