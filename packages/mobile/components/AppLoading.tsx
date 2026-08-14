import { useRef, useEffect } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";

const LOADING_ART = require("../assets/petslife-loading.png");

/**
 * Full-screen loading state shown while the app checks the session or a
 * screen is still fetching data — replaces the blank white flash with a
 * playful bouncing mascot + "quase lá..." message.
 */
export function AppLoading({ message = "Só um instante..." }: { message?: string }) {
  const bounce = useRef(new Animated.Value(0)).current;
  const dots = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Progress bar: fast to 70%, then slow crawl to 95% (never "finishes"
    // on its own — the screen unmounts when loading is actually done).
    Animated.sequence([
      Animated.timing(progress, { toValue: 0.7, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(progress, { toValue: 0.95, duration: 4000, easing: Easing.out(Easing.quad), useNativeDriver: false }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1, duration: 550, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 550, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(dots, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(dots, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const rotate = bounce.interpolate({ inputRange: [0, 1], outputRange: ["-3deg", "3deg"] });

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Animated.View style={{ transform: [{ translateY }, { rotate }] }}>
        <Image source={LOADING_ART} style={{ width: 250, height: 285 }} resizeMode="contain" />
      </Animated.View>
      <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: "#1A1A2E", marginTop: 20 }}>
        {message}
      </Text>
      <Text suppressHighlighting style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
        A preparar tudo com carinho 🐾
      </Text>

      {/* Progress bar */}
      <View
        style={{
          width: 200,
          height: 8,
          borderRadius: 999,
          backgroundColor: "#E9E4FB",
          marginTop: 22,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height: "100%",
            borderRadius: 999,
            backgroundColor: "#7C5CFF",
            width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
          }}
        />
      </View>

      {/* Marca */}
      <Text
        suppressHighlighting
        style={{ marginTop: 18, fontSize: 11, letterSpacing: 3, fontWeight: "800", color: "#7C5CFF", textTransform: "uppercase" }}
      >
        DigitalGlobal
      </Text>
    </View>
  );
}
