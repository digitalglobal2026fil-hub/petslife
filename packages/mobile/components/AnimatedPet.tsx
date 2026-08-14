import { useRef, useEffect } from "react";
import { Image, Animated, Easing, View } from "react-native";

const MASCOTS: Record<string, any> = {
  dog: require("../assets/mascot-dog.png"),
  cat: require("../assets/mascot-cat.png"),
  bird: require("../assets/mascot-bird.png"),
  rabbit: require("../assets/mascot-rabbit.png"),
  hamster: require("../assets/mascot-hamster.png"),
  lizard: require("../assets/mascot-lizard.png"),
};

export function normalizeSpecies(species?: string): keyof typeof MASCOTS {
  const s = (species ?? "").toLowerCase().trim();
  if (["cat", "gato", "gata", "gatinho"].includes(s)) return "cat";
  if (["bird", "pássaro", "passaro", "ave", "papagaio", "periquito", "canário", "canario"].includes(s)) return "bird";
  if (["rabbit", "coelho", "coelha"].includes(s)) return "rabbit";
  if (["hamster", "roedor", "porquinho", "porquinho-da-índia", "cobaia"].includes(s)) return "hamster";
  if (["turtle", "tartaruga", "reptile", "réptil", "reptil", "lizard", "lagarto", "iguana", "cobra"].includes(s))
    return "lizard";
  return "dog";
}

type Props = {
  species?: string;
  size?: number;
  /** false para parar a animação (ex: listas longas) */
  animate?: boolean;
};

/**
 * Mascote ilustrada com animação própria de cada espécie:
 *  - cão: abana a cauda (balanço lateral) e "senta/levanta" (squash)
 *  - gato: respira devagar e inclina a cabeça
 *  - pássaro: bate as asas e flutua (voa)
 *  - coelho: salta
 *  - hamster: vibra rápido (fofinho a mexer-se)
 *  - lagarto: rasteja lentamente de um lado para o outro
 */
export function AnimatedPet({ species, size = 96, animate = true }: Props) {
  const kind = normalizeSpecies(species);
  const a = useRef(new Animated.Value(0)).current; // ciclo principal
  const b = useRef(new Animated.Value(0)).current; // ciclo secundário

  useEffect(() => {
    if (!animate) return;

    const cfg: Record<string, { d1: number; d2: number }> = {
      dog: { d1: 420, d2: 1800 },
      cat: { d1: 1700, d2: 2600 },
      bird: { d1: 300, d2: 1500 },
      rabbit: { d1: 520, d2: 2200 },
      hamster: { d1: 180, d2: 1400 },
      lizard: { d1: 1500, d2: 2400 },
    };
    const { d1, d2 } = cfg[kind];

    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 1, duration: d1, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(a, { toValue: 0, duration: d1, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(b, { toValue: 1, duration: d2, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(b, { toValue: 0, duration: d2, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop1.start();
    loop2.start();
    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [kind, animate]);

  let transform: any[] = [];

  switch (kind) {
    case "dog":
      // abanar: rotação rápida pequena + subida/descida lenta (sentar)
      transform = [
        { rotate: a.interpolate({ inputRange: [0, 1], outputRange: ["-5deg", "5deg"] }) },
        { translateY: b.interpolate({ inputRange: [0, 1], outputRange: [0, 5] }) },
        { scaleY: b.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] }) },
      ];
      break;
    case "cat":
      // respirar + inclinar a cabeça
      transform = [
        { scale: a.interpolate({ inputRange: [0, 1], outputRange: [1, 1.045] }) },
        { rotate: b.interpolate({ inputRange: [0, 1], outputRange: ["-6deg", "6deg"] }) },
      ];
      break;
    case "bird":
      // voar: bater asas (scaleX) + flutuar para cima e baixo
      transform = [
        { scaleX: a.interpolate({ inputRange: [0, 1], outputRange: [1, 0.78] }) },
        { translateY: b.interpolate({ inputRange: [0, 1], outputRange: [4, -12] }) },
        { rotate: b.interpolate({ inputRange: [0, 1], outputRange: ["-4deg", "4deg"] }) },
      ];
      break;
    case "rabbit":
      // saltar
      transform = [
        { translateY: a.interpolate({ inputRange: [0, 1], outputRange: [0, -18] }) },
        { scaleY: a.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.06] }) },
        { translateX: b.interpolate({ inputRange: [0, 1], outputRange: [-6, 6] }) },
      ];
      break;
    case "hamster":
      // vibrar rápido
      transform = [
        { translateX: a.interpolate({ inputRange: [0, 1], outputRange: [-2.5, 2.5] }) },
        { scale: b.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) },
      ];
      break;
    case "lizard":
      // rastejar de um lado para o outro
      transform = [
        { translateX: b.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] }) },
        { rotate: a.interpolate({ inputRange: [0, 1], outputRange: ["-3deg", "3deg"] }) },
      ];
      break;
  }

  return (
    <Animated.View style={{ transform, width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Image source={MASCOTS[kind]} style={{ width: size, height: size }} resizeMode="contain" />
    </Animated.View>
  );
}

/** Grupo de mascotes (ex: ecrãs vazios) — cada uma com a sua animação */
export function AnimatedPetGroup({ size = 72 }: { size?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: -8 }}>
      <AnimatedPet species="cat" size={size * 0.85} />
      <AnimatedPet species="dog" size={size} />
      <AnimatedPet species="bird" size={size * 0.75} />
    </View>
  );
}
