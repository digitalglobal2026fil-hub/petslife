import { useRef, useEffect } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";

const MASCOT_HAPPY = require("../assets/mascot-happy_1784664046237.png");

/**
 * Full-screen loading state shown while the app checks the session or a
 * screen is still fetching data — replaces the blank white flash with a
 * playful bouncing mascot + "quase lá..." message.
 */
export function AppLoading({ message = "Só um instante..." }: { message?: string }) {
  const bounce = useRef(new Animated.Value(0)).current;
  const dots = useRef(new Animated.Value(0)).current;

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
    <View style={{ flex: 1, backgroundColor: "#F8F6FF", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Animated.View style={{ transform: [{ translateY }, { rotate }] }}>
        <Image source={MASCOT_HAPPY} style={{ width: 160, height: 160 }} resizeMode="contain" />
      </Animated.View>
      <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: "#1A1A2E", marginTop: 20 }}>
        {message}
      </Text>
      <Text suppressHighlighting style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
        A preparar tudo com carinho 🐾
      </Text>
    </View>
  );
}
