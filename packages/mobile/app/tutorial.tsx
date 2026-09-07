import { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity, Image, Animated, Easing, Dimensions, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PawPrint, ChevronRight, Check } from "lucide-react-native";
import { tr } from "../lib/i18n";
import { kvSet } from "../lib/kv";

/** Chave guardada no telemóvel para o tutorial só aparecer uma vez. */
export const TUTORIAL_KEY = "tutorial_visto_v1";

const { width } = Dimensions.get("window");

type Passo = {
  titulo: string;
  texto: string;
  cor: string;
  fundo: string;
};

const PASSOS: Passo[] = [
  {
    titulo: "Olá! Eu sou o Max 🐾",
    texto: "Bem-vinda à PetsLife! Vou mostrar-lhe a app em menos de um minuto. Carregue na patinha para avançar.",
    cor: "#FF6B35",
    fundo: "#FFF0EB",
  },
  {
    titulo: "A barra de baixo",
    texto: "Tem 5 separadores sempre à mão: Início, Saúde, Álbum, Comunidade e Marketplace. É por aí que se anda na app.",
    cor: "#4ECDC4",
    fundo: "#E6F7F6",
  },
  {
    titulo: "Comece pelo seu animal",
    texto: "No Início, carregue em \"Adicionar animal\" e preencha o nome, a espécie, a raça e a data de nascimento. Pode juntar uma foto — fica logo como foto de perfil dele.",
    cor: "#FF6B35",
    fundo: "#FFF0EB",
  },
  {
    titulo: "Saúde: tudo num sítio",
    texto: "No separador Saúde guarda vacinas, consultas, desparasitações, medicação, peso e documentos. Cada coisa tem o seu botão — e nada se perde.",
    cor: "#10B981",
    fundo: "#D1FAE5",
  },
  {
    titulo: "A Agenda avisa-a",
    texto: "Em Saúde > Agenda tem um calendário do mês com pontinhos nos dias que têm coisas marcadas: azul consulta, verde vacina, laranja desparasitação, vermelho medicação. Carregue num dia para ver o que há.",
    cor: "#3B82F6",
    fundo: "#EAF2FE",
  },
  {
    titulo: "QR Code: se ele se perder",
    texto: "Cada animal tem um QR Code próprio. Imprima-o ou ponha-o na chapa da coleira. Quem o encontrar aponta o telemóvel e vê os seus contactos — e a senhora recebe um aviso por email.",
    cor: "#8B5CF6",
    fundo: "#F3EEFF",
  },
  {
    titulo: "Álbum e Lembranças",
    texto: "No Álbum guarda as fotos e as memórias. E em Lembranças pode fazer uma página bonita para os animais que já partiram, com uma vela que os amigos podem acender.",
    cor: "#EC4899",
    fundo: "#FDF2F8",
  },
  {
    titulo: "Comunidade e Marketplace",
    texto: "Na Comunidade fala com outros donos e publica o que quiser. No Marketplace vê produtos e serviços — e pode anunciar os seus.",
    cor: "#F59E0B",
    fundo: "#FEF3C7",
  },
  {
    titulo: "E se me esquecer de algo?",
    texto: "Não faz mal! Vá a Perfil > Como funciona e tem tudo explicado por escrito, mais as perguntas mais frequentes. Pode rever este tutorial quando quiser.",
    cor: "#06D6A0",
    fundo: "#E6FBF4",
  },
];

export default function Tutorial() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const passo = PASSOS[i];
  const ultimo = i === PASSOS.length - 1;

  // Cãozinho a saltar devagar
  const salto = useRef(new Animated.Value(0)).current;
  // Balão a aparecer em cada passo
  const balao = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(salto, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(salto, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    balao.setValue(0);
    Animated.spring(balao, { toValue: 1, useNativeDriver: true, tension: 60, friction: 9 }).start();
  }, [i]);

  async function terminar() {
    await kvSet(TUTORIAL_KEY, "1");
    router.replace("/(tabs)");
  }

  function avancar() {
    if (ultimo) terminar();
    else setI(i + 1);
  }

  const subir = salto.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const escala = balao.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: passo.fundo }} edges={["top", "bottom"]}>
      {/* Saltar */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 20, paddingTop: 8 }}>
        <TouchableOpacity onPress={terminar} activeOpacity={0.7} style={{ paddingVertical: 8, paddingHorizontal: 14 }}>
          <Text suppressHighlighting style={{ color: "#8B95A5", fontWeight: "700", fontSize: 14 }}>{tr("Saltar")}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
        {/* Balão de fala */}
        <Animated.View style={{ opacity: balao, transform: [{ scale: escala }] }}>
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 28,
              padding: 22,
              borderWidth: 2,
              borderColor: passo.cor + "33",
            }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: passo.cor + "1A", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                <PawPrint size={18} color={passo.cor} />
              </View>
              <Text suppressHighlighting style={{ flex: 1, fontSize: 19, fontWeight: "800", color: "#1A1A2E" }}>
                {tr(passo.titulo)}
              </Text>
            </View>
            <Text suppressHighlighting style={{ fontSize: 15.5, lineHeight: 24, color: "#4B5563" }}>
              {tr(passo.texto)}
            </Text>
          </View>

          {/* Bico do balão a apontar para o cão */}
          <View style={{ alignItems: "center", marginTop: -2 }}>
            <View
              style={{
                width: 22,
                height: 22,
                backgroundColor: "#fff",
                borderRightWidth: 2,
                borderBottomWidth: 2,
                borderColor: passo.cor + "33",
                transform: [{ rotate: "45deg" }],
                marginTop: -11,
              }}
            />
          </View>
        </Animated.View>

        {/* Cãozinho */}
        <Animated.View style={{ alignItems: "center", marginTop: 6, transform: [{ translateY: subir }] }}>
          <Image
            source={require("../assets/mascot-dog.png")}
            style={{ width: Math.min(width * 0.58, 240), height: Math.min(width * 0.58, 240) }}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Patinhas de progresso */}
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
          {PASSOS.map((_, k) => (
            <TouchableOpacity key={k} onPress={() => setI(k)} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
              <PawPrint
                size={k === i ? 22 : 15}
                color={k === i ? passo.cor : "#C9D2DE"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Botão */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 10, paddingTop: 6 }}>
        <TouchableOpacity
          onPress={avancar}
          activeOpacity={0.85}
          style={{
            backgroundColor: passo.cor,
            borderRadius: 20,
            paddingVertical: 17,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}>
          <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 16.5 }}>
            {ultimo ? tr("Começar a usar a app") : tr("Seguinte")}
          </Text>
          {ultimo ? <Check size={20} color="#fff" /> : <ChevronRight size={20} color="#fff" />}
        </TouchableOpacity>
        <Text suppressHighlighting style={{ textAlign: "center", color: "#9AA5B4", fontSize: 12, marginTop: 10 }}>
          {tr("Passo")} {i + 1} {tr("de")} {PASSOS.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}
