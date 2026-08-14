import { useEffect, useRef } from "react";
import { View, Text, Image, Animated, Easing, Dimensions } from "react-native";

const UNIVERSE = require("../assets/universe-bg_1786702261592.png");
const LOGO = require("../assets/digitalglobal-logo.png");

const { width } = Dimensions.get("window");

/**
 * Ecrã de abertura da marca: fundo escuro tipo universo com brilho radiante e
 * o logo Digital Global a entrar (fade + zoom + brilho). Depois de ~2,2s chama
 * onDone() e a app mostra o AppLoading branco com a barra de progresso.
 */
export function BrandIntro({ onDone }: { onDone: () => void }) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.72)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 900, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(textFade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.delay(650),
      Animated.timing(out, { toValue: 0, duration: 420, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start(() => onDone());
  }, []);

  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.25] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] });

  return (
    <Animated.View style={{ flex: 1, backgroundColor: "#05060F", opacity: out }}>
      <Image source={UNIVERSE} style={{ position: "absolute", width: "100%", height: "100%" }} resizeMode="cover" />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* brilho radiante atrás do logo */}
        <Animated.View
          style={{
            position: "absolute",
            width: width * 0.78,
            height: width * 0.78,
            borderRadius: width,
            backgroundColor: "#FF6B35",
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          }}
        />
        <Animated.Image
          source={LOGO}
          style={{ width: width * 0.62, height: width * 0.62, opacity: fade, transform: [{ scale }] }}
          resizeMode="contain"
        />
        <Animated.View style={{ opacity: textFade, alignItems: "center", marginTop: 10 }}>
          <Text
            suppressHighlighting
            style={{ color: "#fff", fontSize: 13, letterSpacing: 4, fontWeight: "700", textTransform: "uppercase" }}
          >
            Digital Global
          </Text>
          <Text suppressHighlighting style={{ color: "#FFB08A", fontSize: 12, marginTop: 6, letterSpacing: 1 }}>
            apresenta PetsLife 🐾
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
