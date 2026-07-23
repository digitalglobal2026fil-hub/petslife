import { useRef, useEffect } from "react";
import { Image, Animated } from "react-native";

const PET_IMAGES: Record<string, any> = {
  dog: require("../assets/pet-dog.png"),
  cat: require("../assets/pet-cat.png"),
  bird: require("../assets/pet-bird.png"),
  rabbit: require("../assets/pet-rabbit.png"),
  hamster: require("../assets/pet-hamster.png"),
  turtle: require("../assets/pet-turtle.png"),
};

function normalizeSpecies(species?: string): string {
  const s = (species ?? "").toLowerCase();
  if (s === "cat" || s === "gato") return "cat";
  if (s === "bird" || s === "pássaro" || s === "passaro") return "bird";
  if (s === "rabbit" || s === "coelho") return "rabbit";
  if (s === "hamster") return "hamster";
  if (s === "turtle" || s === "tartaruga" || s === "reptile" || s === "réptil") return "turtle";
  return "dog";
}

/**
 * Cute illustrated pet icon (dog, cat, bird, rabbit, hamster, turtle) with a
 * subtle idle "wiggle" animation (gentle rotate + scale pulse) so it feels
 * alive without needing real animated assets.
 */
export function PetIllustration({ species, size = 64 }: { species?: string; size?: number }) {
  const wiggle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wiggle, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: -1, duration: 1400, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const rotate = wiggle.interpolate({ inputRange: [-1, 1], outputRange: ["-4deg", "4deg"] });
  const key = normalizeSpecies(species);

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Image source={PET_IMAGES[key]} style={{ width: size, height: size }} resizeMode="contain" />
    </Animated.View>
  );
}
