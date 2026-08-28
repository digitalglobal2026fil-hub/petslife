import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ChevronLeft, AlertTriangle, ChevronRight, Phone } from "lucide-react-native";
import { Linking } from "react-native";
import { tr } from "../lib/i18n";

const BG = "#FFF9F9";
const DARK = "#1A1A2E";
const GRAY = "#9CA3AF";
const RED = "#EF4444";
const ORANGE = "#FF6B35";
const CARD = "#FFFFFF";

const EMERGENCIES = [
  {
    title: "Dificuldade a respirar", emoji: "😮‍💨", severity: "urgente", color: "#EF4444", bg: "#FEF2F2",
    steps: [
      "Mantenha o animal calmo e imóvel",
      "Verifique se há obstrução na boca — remova com cuidado",
      "Não tape o focinho ou nariz",
      "Coloque o animal em posição lateral se estiver inconsciente",
      "Vá ao veterinário de EMERGÊNCIA IMEDIATAMENTE",
    ],
    doNot: ["Não force a boca se o animal resistir", "Não dê água nem comida", "Não tape as narinas"],
  },
  {
    title: "Intoxicação ou Envenenamento", emoji: "☠️", severity: "urgente", color: "#EF4444", bg: "#FEF2F2",
    steps: [
      "Nunca provoque o vómito nem dê qualquer medicamento ou remédio caseiro sem falar primeiro com um veterinário",
      "Fale com um veterinário de imediato e siga as indicações que lhe der",
      "Se souber o que o animal ingeriu, guarde a embalagem e leve-a consigo",
    ],
    doNot: [
      "Não provoque o vómito",
      "Não dê medicamentos por sua iniciativa",
      "Não dê remédios caseiros",
    ],
  },
  {
    title: "Convulsões", emoji: "⚡", severity: "urgente", color: "#EF4444", bg: "#FEF2F2",
    steps: [
      "Mantenha a calma — NÃO coloque a mão na boca do animal",
      "Afaste objectos perigosos em redor",
      "Proteja a cabeça com uma toalha macia",
      "Marque a hora de início da convulsão",
      "Após parar, cubra com cobertor e vá ao veterinário",
    ],
    doNot: ["Não tente segurar o animal", "Não coloque nada na boca", "Não grite — mantenha silêncio e luz baixa"],
  },
  {
    title: "Hemorragias", emoji: "🩸", severity: "grave", color: "#F97316", bg: "#FFF7ED",
    steps: [
      "Pressione a ferida com uma gaze esterilizada ou um pano limpo",
      "Mantenha a pressão até o sangue parar ou até chegar à clínica",
      "Use luvas se tiver à mão",
    ],
    doNot: [
      "Não levante a gaze para ir vendo — se ensopar, ponha outra por cima",
      "Não use água oxigenada",
      "Não limpe a ferida em excesso",
    ],
  },
  {
    title: "Picada de insecto / Alergia", emoji: "🐝", severity: "grave", color: "#F97316", bg: "#FFF7ED",
    steps: [
      "Remova o ferrão com cartão (não com pinça)",
      "Aplique compressas frias na zona",
      "Observe: inchaço do focinho/cara é emergência!",
      "Sinais graves: dificuldade a respirar, colapso — URGÊNCIA",
      "Contacte o veterinário para antihistamínico adequado",
    ],
    doNot: ["Não esprema o ferrão", "Não aplique calor", "Não dê medicação humana sem orientação"],
  },
  {
    title: "Golpe de calor", emoji: "🌡️", severity: "grave", color: "#F97316", bg: "#FFF7ED",
    steps: [
      "Mova para local fresco e com sombra imediatamente",
      "Molhe o animal com água FRIA (não gelada) — focinho, axilas, pescoço",
      "Ofereça água fresca em pequenas quantidades",
      "Use ventoinha se disponível",
      "Vá ao veterinário — o golpe de calor pode ser fatal",
    ],
    doNot: ["Não use água muito gelada ou gelo", "Não cubra com toalha molhada (retém calor)", "Não force a beber"],
  },
  {
    title: "Engasgos", emoji: "🤢", severity: "grave", color: "#F97316", bg: "#FFF7ED",
    steps: [
      "Abra a boca do animal com cuidado para ver se existe algum objecto visível",
      "Tente retirá-lo com os dedos ou com uma pinça",
      "Se não conseguir alcançar, ou se o animal continuar aflito, não force e procure ajuda de imediato",
    ],
    doNot: [
      "Não force o objecto para baixo",
      "Não insista se não estiver a conseguir — vá ao veterinário",
      "Não dê água nem comida",
    ],
  },
  {
    title: "Queimaduras", emoji: "🔥", severity: "grave", color: "#F97316", bg: "#FFF7ED",
    steps: [
      "Lave a zona afectada com água fria corrente durante pelo menos 10 minutos para aliviar a dor",
      "Cubra com um pano limpo e húmido",
      "Leve o animal ao veterinário",
    ],
    doNot: [
      "Não aplique cremes",
      "Não aplique pasta de dentes",
      "Não use receitas caseiras",
    ],
  },
  {
    title: "Fractura / Osso partido", emoji: "🦴", severity: "moderado", color: "#8B5CF6", bg: "#F3EEFF",
    steps: [
      "Não tente endireitar o osso",
      "Imobilize a zona com improviso (cartão, rolo de jornal, ataduras)",
      "Use uma superfície rígida como maca improvisada",
      "Cubra o animal para evitar choque",
      "Transporte com cuidado ao veterinário",
    ],
    doNot: ["Não massaje a zona", "Não aplique pressão", "Não tente andar com o animal se tiver fractura na pata"],
  },
  {
    title: "Olho vermelho / Ferido", emoji: "👁️", severity: "moderado", color: "#8B5CF6", bg: "#F3EEFF",
    steps: [
      "Não esfregue o olho do animal",
      "Lave com soro fisiológico abundante",
      "Se houver corpo estranho visível e solto, tente remover com gaze húmida",
      "Impeça o animal de coçar o olho",
      "Consulte veterinário para prescrição adequada",
    ],
    doNot: ["Não use colírios humanos sem receita", "Não force abertura do olho", "Não ignore — pode perder visão"],
  },
  {
    title: "Vómitos repetidos", emoji: "🤮", severity: "moderado", color: "#8B5CF6", bg: "#F3EEFF",
    steps: [
      "Retire comida por 12h (para adultos saudáveis)",
      "Ofereça pequenas quantidades de água",
      "Se houver sangue, letargia ou dor abdominal: veterinário urgente",
      "Registe frequência e aspecto do vómito",
      "Mais de 3 vómitos em poucas horas = consulta veterinária",
    ],
    doNot: ["Não dê medicação humana", "Não force comida", "Não ignore vómito com sangue ou bile escura"],
  },
];

const severityLabel: Record<string, { label: string; color: string }> = {
  urgente: { label: "🚨 URGENTE", color: "#EF4444" },
  grave: { label: "⚠️ GRAVE", color: "#F97316" },
  moderado: { label: "⚕️ MODERADO", color: "#8B5CF6" },
};

export default function FirstAidScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<typeof EMERGENCIES[0] | null>(null);

  if (selected) {
    const sv = severityLabel[selected.severity];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: selected.bg }} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ backgroundColor: selected.color, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
            <TouchableOpacity onPress={() => setSelected(null)} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <ChevronLeft size={20} color="#fff" />
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>{tr("Voltar")}</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontSize: 56, textAlign: "center" }}>{selected.emoji}</Text>
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "900", color: "#fff", textAlign: "center", marginTop: 8 }}>{tr(selected.title)}</Text>
            <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, alignSelf: "center", marginTop: 10 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>{tr(sv.label)}</Text>
            </View>
          </View>

          <View style={{ padding: 20, gap: 16 }}>
            {/* Passos */}
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 14 }}>{tr("✅ O que fazer")}</Text>
              {selected.steps.map((s, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: selected.color, alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                    <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>{i + 1}</Text>
                  </View>
                  <Text suppressHighlighting style={{ flex: 1, color: "#374151", fontSize: 14, lineHeight: 22 }}>{tr(s)}</Text>
                </View>
              ))}
            </View>

            {/* Não fazer */}
            <View style={{ backgroundColor: "#FEF2F2", borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: "#FCA5A5" }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: RED, marginBottom: 12 }}>{tr("❌ Não fazer")}</Text>
              {selected.doNot.map((d, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                  <Text suppressHighlighting style={{ fontSize: 16, marginTop: 1 }}>🚫</Text>
                  <Text suppressHighlighting style={{ flex: 1, color: "#991B1B", fontSize: 14, lineHeight: 20 }}>{tr(d)}</Text>
                </View>
              ))}
            </View>

            {/* Emergência */}
            <TouchableOpacity onPress={() => Linking.openURL("tel:213420000")}
              style={{ backgroundColor: RED, borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Phone size={20} color="#fff" />
              <View>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{tr("Ligar ao Veterinário")}</Text>
                <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>213 420 000 — Linha Vet 24h</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const urgentes = EMERGENCIES.filter(e => e.severity === "urgente");
  const graves = EMERGENCIES.filter(e => e.severity === "grave");
  const moderados = EMERGENCIES.filter(e => e.severity === "moderado");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{ backgroundColor: RED, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "900", color: "#fff" }}>{tr("Primeiros Socorros 🩺")}</Text>
            <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>{tr("Guia de emergência para animais")}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={18} color="#fff" />
          <Text suppressHighlighting style={{ flex: 1, color: "#fff", fontSize: 12, lineHeight: 18 }}>
            {tr("Em caso de emergência grave, contacte sempre um veterinário. Este guia é de apoio, baseado em fontes veterinárias reconhecidas — não substitui cuidados médicos.")}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: Math.max(insets.bottom, 20) + 60, gap: 8 }}>
        {/* Ligar emergência */}
        <TouchableOpacity onPress={() => Linking.openURL("tel:213420000")}
          style={{ backgroundColor: RED, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <Phone size={18} color="#fff" />
          <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>{tr("🚨 Ligar Vet Emergência 24h")}</Text>
        </TouchableOpacity>

        {[
          { label: "🚨 Emergências Urgentes", items: urgentes, color: "#EF4444" },
          { label: "⚠️ Situações Graves", items: graves, color: "#F97316" },
          { label: "⚕️ Situações Moderadas", items: moderados, color: "#8B5CF6" },
        ].map(section => (
          <View key={section.label}>
            <Text suppressHighlighting style={{ fontSize: 14, fontWeight: "800", color: section.color, marginTop: 12, marginBottom: 8 }}>{tr(section.label)}</Text>
            {section.items.map(e => (
              <TouchableOpacity key={e.title} onPress={() => setSelected(e)} activeOpacity={0.85}
                style={{ backgroundColor: CARD, borderRadius: 18, padding: 16, marginBottom: 8, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderColor: e.color + "25" }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: e.bg, alignItems: "center", justifyContent: "center" }}>
                  <Text suppressHighlighting style={{ fontSize: 28 }}>{e.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "800", color: DARK, fontSize: 15 }}>{tr(e.title)}</Text>
                  <View style={{ backgroundColor: e.bg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 5 }}>
                    <Text suppressHighlighting style={{ color: e.color, fontSize: 11, fontWeight: "700" }}>{tr(severityLabel[e.severity].label)}</Text>
                  </View>
                </View>
                <ChevronRight size={18} color={GRAY} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
