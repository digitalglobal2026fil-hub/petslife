import { useRef, useEffect } from "react";
import { View, Text, Image, Animated, Easing, Dimensions } from "react-native";
import PawIcon from "./PawIcon";
import { tocarAberturaUmaVez } from "../lib/opening-sound";

const LOADING_ART = require("../assets/petslife-loading.png");

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Patinhas de várias cores a atravessar a parte branca do ecrã de abertura.
// Cada uma tem o seu tamanho, cor, atraso e velocidade, para não parecerem
// todas iguais nem a andar em fila.
const PAWS = [
  { color: "#FF6B35", size: 34, top: 0.08, from: -60, to: 1.15, delay: 0, dur: 5200, rot: "-18deg" },
  { color: "#4ECDC4", size: 26, top: 0.16, from: 1.1, to: -0.2, delay: 900, dur: 6400, rot: "22deg" },
  { color: "#8B5CF6", size: 40, top: 0.27, from: -70, to: 1.2, delay: 400, dur: 7000, rot: "8deg" },
  { color: "#EC4899", size: 22, top: 0.37, from: 1.1, to: -0.2, delay: 1800, dur: 5600, rot: "-30deg" },
  { color: "#F59E0B", size: 30, top: 0.52, from: -50, to: 1.15, delay: 1200, dur: 6100, rot: "14deg" },
  { color: "#06D6A0", size: 24, top: 0.63, from: 1.1, to: -0.2, delay: 300, dur: 6800, rot: "-10deg" },
  { color: "#0EA5E9", size: 36, top: 0.74, from: -60, to: 1.2, delay: 2200, dur: 5400, rot: "26deg" },
  { color: "#FF4757", size: 20, top: 0.84, from: 1.1, to: -0.2, delay: 700, dur: 7200, rot: "-22deg" },
  { color: "#A78BFA", size: 28, top: 0.92, from: -40, to: 1.15, delay: 1500, dur: 5900, rot: "6deg" },
];

function FloatingPaw({ paw }: { paw: (typeof PAWS)[number] }) {
  const move = useRef(new Animated.Value(0)).current;
  const wobble = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const atravessar = Animated.loop(
      Animated.timing(move, {
        toValue: 1,
        duration: paw.dur,
        delay: paw.delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const balancar = Animated.loop(
      Animated.sequence([
        Animated.timing(wobble, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(wobble, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    atravessar.start();
    balancar.start();
    return () => {
      atravessar.stop();
      balancar.stop();
    };
  }, []);

  const px = (v: number) => (Math.abs(v) <= 1.5 ? v * SCREEN_W : v);

  const translateX = move.interpolate({
    inputRange: [0, 1],
    outputRange: [px(paw.from), px(paw.to)],
  });
  const translateY = wobble.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const opacity = move.interpolate({
    inputRange: [0, 0.12, 0.88, 1],
    outputRange: [0, 0.55, 0.55, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: SCREEN_H * paw.top,
        left: 0,
        opacity,
        transform: [{ translateX }, { translateY }, { rotate: paw.rot }],
      }}
    >
      <PawIcon size={paw.size} color={paw.color} />
    </Animated.View>
  );
}

/**
 * Full-screen loading state shown while the app checks the session or a
 * screen is still fetching data — replaces the blank white flash with a
 * playful bouncing mascot + "quase lá..." message.
 */
export function AppLoading({ message = "Só um instante..." }: { message?: string }) {
  // Musiquinha de abertura: o módulo garante que só toca uma vez por
  // arranque, mesmo que este ecrã apareça várias vezes.
  useEffect(() => {
    tocarAberturaUmaVez();
  }, []);

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
      {/* Patinhas coloridas a passear pela parte branca, atrás de tudo */}
      {PAWS.map((paw, i) => (
        <FloatingPaw key={i} paw={paw} />
      ))}

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
