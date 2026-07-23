import { View, Text, Platform } from "react-native";
import { useMemo } from "react";
import { PetIllustration } from "./PetIllustration";

const BROWN = "#6B3A2A";
const BROWN2 = "#8B5E3C";
const CARD = "#FFFFFF";
const BORDER = "#E8D5B7";
// Fundo neutro para o círculo do ícone — não usa a cor bege antiga para não se misturar com a ilustração
const ICON_CIRCLE_BG = "#FFFFFF";

// speciesKey aponta para uma das ilustrações disponíveis (dog, cat, bird, rabbit, hamster, turtle).
// Quando não há ilustração para o animal, speciesKey fica undefined e usamos o emoji como reserva.
export const ANIMAL_FACTS = [
  { fact: "Os cães reconhecem o teu humor pela voz e cheiro!", emoji: "🐕", animal: "Cão", speciesKey: "dog" },
  { fact: "Os gatos passam 70% da vida a dormir. Que vida boa! 😴", emoji: "🐱", animal: "Gato", speciesKey: "cat" },
  { fact: "Os coelhos ronronam de felicidade, tal como os gatos!", emoji: "🐰", animal: "Coelho", speciesKey: "rabbit" },
  { fact: "Os papagaios podem viver mais de 80 anos!", emoji: "🦜", animal: "Papagaio", speciesKey: "bird" },
  { fact: "Os cães têm 18 músculos só nas orelhas para expressar emoções!", emoji: "🐶", animal: "Cão", speciesKey: "dog" },
  { fact: "Animais de estimação reduzem o stress em até 37%!", emoji: "🐾", animal: "Curioso", speciesKey: undefined },
  { fact: "Os gatos têm 32 músculos em cada orelha!", emoji: "🐈", animal: "Gato", speciesKey: "cat" },
  { fact: "Os cães sonham enquanto dormem — provavelmente contigo! 💛", emoji: "🐕", animal: "Cão", speciesKey: "dog" },
  { fact: "Os peixinhos dourados têm memória de 3 meses, não 3 segundos!", emoji: "🐠", animal: "Peixe", speciesKey: undefined },
  { fact: "Os golfinhos têm nomes uns para os outros — chamam-se!", emoji: "🐬", animal: "Golfinho", speciesKey: undefined },
  { fact: "Os elefantes são os únicos animais que não conseguem saltar!", emoji: "🐘", animal: "Elefante", speciesKey: undefined },
  { fact: "Os polvos têm três corações e sangue azul!", emoji: "🐙", animal: "Polvo", speciesKey: undefined },
  { fact: "Os coalas dormem até 22 horas por dia! 😴", emoji: "🐨", animal: "Coala", speciesKey: undefined },
  { fact: "As vacas têm melhores amigos e ficam stressadas quando separadas!", emoji: "🐄", animal: "Vaca", speciesKey: undefined },
  { fact: "Os ratos riem quando fazem cócegas — em ultrassons!", emoji: "🐭", animal: "Rato", speciesKey: undefined },
  { fact: "Os pinguins formam casais para toda a vida e oferecem pedras!", emoji: "🐧", animal: "Pinguim", speciesKey: undefined },
  { fact: "Os caracóis podem dormir até 3 anos de seguida!", emoji: "🐌", animal: "Caracol", speciesKey: undefined },
  { fact: "Os hamsters corriam 8km por noite na natureza!", emoji: "🐹", animal: "Hamster", speciesKey: "hamster" },
  { fact: "Os cães inclinam a cabeça para te perceber melhor! 🥺", emoji: "🐕", animal: "Cão", speciesKey: "dog" },
  { fact: "Os gatos ronronam a 25-50 Hz — frequência que cura ossos!", emoji: "🐱", animal: "Gato", speciesKey: "cat" },
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

function FactIcon({ fact, size }: { fact: typeof ANIMAL_FACTS[0]; size: number }) {
  if (fact.speciesKey) {
    return (
      <View style={{
        width: size, height: size, borderRadius: size / 2, backgroundColor: ICON_CIRCLE_BG,
        alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: BORDER,
      }}>
        <PetIllustration species={fact.speciesKey} size={size * 0.8} />
      </View>
    );
  }
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2, backgroundColor: ICON_CIRCLE_BG,
      alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: BORDER,
    }}>
      <Text suppressHighlighting style={{ fontSize: size * 0.5, backgroundColor: "transparent" }}>{fact.emoji}</Text>
    </View>
  );
}

export function AnimalFact({ seed, style, compact }: AnimalFactProps) {
  const fact = useMemo(() => getRandomFact(seed), [seed]);

  if (compact) {
    return (
      <View style={[{
        backgroundColor: "#FFF8EF",
        borderRadius: 14,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderWidth: 1,
        borderColor: BORDER,
      }, style]}>
        <FactIcon fact={fact} size={56} />
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
      <FactIcon fact={fact} size={76} />
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
