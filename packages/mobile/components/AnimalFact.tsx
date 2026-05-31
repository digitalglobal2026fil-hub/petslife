import { View, Text, Platform } from "react-native";
import { useMemo } from "react";

const BROWN = "#6B3A2A";
const BROWN2 = "#8B5E3C";
const CARD = "#FFFFFF";
const BORDER = "#E8D5B7";
const ICON_BG = "#EDD8B8";

export const ANIMAL_FACTS = [
  { fact: "Os cães reconhecem o teu humor pela voz e cheiro!", emoji: "🐕", animal: "Cão" },
  { fact: "Os gatos passam 70% da vida a dormir. Que vida boa! 😴", emoji: "🐱", animal: "Gato" },
  { fact: "Os coelhos ronronam de felicidade, tal como os gatos!", emoji: "🐰", animal: "Coelho" },
  { fact: "Os papagaios podem viver mais de 80 anos!", emoji: "🦜", animal: "Papagaio" },
  { fact: "Os cães têm 18 músculos só nas orelhas para expressar emoções!", emoji: "🐶", animal: "Cão" },
  { fact: "Animais de estimação reduzem o stress em até 37%!", emoji: "🐾", animal: "Curioso" },
  { fact: "Os gatos têm 32 músculos em cada orelha!", emoji: "🐈", animal: "Gato" },
  { fact: "Os cães sonham enquanto dormem — provavelmente contigo! 💛", emoji: "🐕", animal: "Cão" },
  { fact: "Os peixinhos dourados têm memória de 3 meses, não 3 segundos!", emoji: "🐠", animal: "Peixe" },
  { fact: "Os golfinhos têm nomes uns para os outros — chamam-se!", emoji: "🐬", animal: "Golfinho" },
  { fact: "Os elefantes são os únicos animais que não conseguem saltar!", emoji: "🐘", animal: "Elefante" },
  { fact: "Os polvos têm três corações e sangue azul!", emoji: "🐙", animal: "Polvo" },
  { fact: "Os coalas dormem até 22 horas por dia! 😴", emoji: "🐨", animal: "Coala" },
  { fact: "As vacas têm melhores amigos e ficam stressadas quando separadas!", emoji: "🐄", animal: "Vaca" },
  { fact: "Os ratos riem quando fazem cócegas — em ultrassons!", emoji: "🐭", animal: "Rato" },
  { fact: "Os pinguins formam casais para toda a vida e oferecem pedras!", emoji: "🐧", animal: "Pinguim" },
  { fact: "Os caracóis podem dormir até 3 anos de seguida!", emoji: "🐌", animal: "Caracol" },
  { fact: "Os hamsters corriam 8km por noite na natureza!", emoji: "🐹", animal: "Hamster" },
  { fact: "Os cães inclinam a cabeça para te perceber melhor! 🥺", emoji: "🐕", animal: "Cão" },
  { fact: "Os gatos ronronam a 25-50 Hz — frequência que cura ossos!", emoji: "🐱", animal: "Gato" },
];

// Pick a fact based on a seed (changes every 5 minutes or per page)
export function getRandomFact(seed?: number): typeof ANIMAL_FACTS[0] {
  const s = seed ?? Math.floor(Date.now() / 300000);
  return ANIMAL_FACTS[s % ANIMAL_FACTS.length];
}

interface AnimalFactProps {
  seed?: number;
  style?: any;
  compact?: boolean;
}

export function AnimalFact({ seed, style, compact }: AnimalFactProps) {
  const fact = useMemo(() => getRandomFact(seed), [seed]);

  if (compact) {
    return (
      <View style={[{
        backgroundColor: ICON_BG,
        borderRadius: 14,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: BORDER,
      }, style]}>
        <Text suppressHighlighting style={{ fontSize: 26, backgroundColor: "transparent" }}>{fact.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontSize: 10, fontWeight: "700", color: BROWN2, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2, backgroundColor: "transparent" }}>
            Sabia que... 🌟
          </Text>
          <Text suppressHighlighting style={{ fontSize: 12, color: BROWN, fontStyle: "italic", lineHeight: 17, fontWeight: "600", backgroundColor: "transparent" }}>
            {fact.fact}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[{
      backgroundColor: CARD,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1.5,
      borderColor: BORDER,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      shadowColor: BROWN,
      shadowOpacity: Platform.OS === "ios" ? 0.06 : 0,
      shadowRadius: 8,
      elevation: 0,
    }, style]}>
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: ICON_BG, alignItems: "center", justifyContent: "center" }}>
        <Text suppressHighlighting style={{ fontSize: 28, backgroundColor: "transparent" }}>{fact.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text suppressHighlighting style={{ fontSize: 11, fontWeight: "800", color: BROWN2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4, backgroundColor: "transparent" }}>
          🌟 Sabia que...
        </Text>
        <Text suppressHighlighting style={{ fontSize: 13, color: BROWN, fontStyle: "italic", lineHeight: 19, fontWeight: "600", backgroundColor: "transparent" }}>
          {fact.fact}
        </Text>
        <Text suppressHighlighting style={{ fontSize: 10, color: "#C4A882", marginTop: 4, fontWeight: "600", backgroundColor: "transparent" }}>— {fact.animal}</Text>
      </View>
    </View>
  );
}
