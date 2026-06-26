import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react-native";

const BG = "#F8F6FF";
const PURPLE = "#8B5CF6";
const PURPLE_BG = "#F3EEFF";
const CARD = "#FFFFFF";
const GRAY = "#9CA3AF";
const DARK = "#1A1A2E";

const BREEDS = [
  {
    name: "Labrador Retriever", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Canadá", life: "10–12 anos", weight: "25–36 kg",
    personality: ["Amigável", "Activo", "Leal", "Paciente"],
    health: ["Displasia da anca", "Obesidade", "Problemas oculares"],
    care: "Necessita de exercício diário intenso. Alimentação controlada para evitar obesidade. Escovagem semanal.",
    ideal: "Famílias com crianças, casas com jardim",
    color: "#FF6B35", bg: "#FFF0EB",
  },
  {
    name: "Golden Retriever", species: "dog", emoji: "🐕‍🦺", size: "Grande",
    origin: "Escócia", life: "10–12 anos", weight: "25–34 kg",
    personality: ["Carinhoso", "Inteligente", "Tolerante", "Brincalhão"],
    health: ["Cancro", "Displasia da anca", "Otites"],
    care: "Escovagem 2-3x/semana. Exercício diário. Banhos mensais. Verifique ouvidos regularmente.",
    ideal: "Famílias, crianças, idosos",
    color: "#F59E0B", bg: "#FEF3C7",
  },
  {
    name: "Bulldog Francês", species: "dog", emoji: "🐶", size: "Pequeno",
    origin: "França", life: "10–12 anos", weight: "8–14 kg",
    personality: ["Divertido", "Afectuoso", "Adaptável", "Calmo"],
    health: ["Problemas respiratórios", "Doenças de pele", "Displasia da anca"],
    care: "Evitar calor extremo. Limpar pregas da pele regularmente. Exercício moderado.",
    ideal: "Apartamentos, solteiros, casais",
    color: "#4ECDC4", bg: "#E8FAF9",
  },
  {
    name: "Pastor Alemão", species: "dog", emoji: "🐕", size: "Grande",
    origin: "Alemanha", life: "9–13 anos", weight: "22–40 kg",
    personality: ["Corajoso", "Leal", "Inteligente", "Versátil"],
    health: ["Displasia da anca", "Degeneração da coluna", "Alergias"],
    care: "Exercício vigoroso diário. Estimulação mental necessária. Escovagem 2-3x/semana.",
    ideal: "Donos activos, casas com espaço",
    color: "#6B7280", bg: "#F3F4F6",
  },
  {
    name: "Poodle", species: "dog", emoji: "🐩", size: "Variável",
    origin: "Alemanha/França", life: "12–15 anos", weight: "2–32 kg",
    personality: ["Inteligente", "Activo", "Instinto", "Fiel"],
    health: ["Problemas oculares", "Displasia da anca", "Alergias cutâneas"],
    care: "Tosquia a cada 6-8 semanas. Exercício diário. Excelente para alérgicos (pouca queda de pelo).",
    ideal: "Qualquer família, alérgicos",
    color: "#EC4899", bg: "#FDF2F8",
  },
  {
    name: "Persa", species: "cat", emoji: "🐱", size: "Médio",
    origin: "Irão", life: "12–17 anos", weight: "3–7 kg",
    personality: ["Tranquilo", "Carinhoso", "Reservado", "Elegante"],
    health: ["Problemas respiratórios", "Doenças renais", "Olhos"],
    care: "Escovagem diária obrigatória. Limpeza dos olhos regularmente. Dieta de qualidade.",
    ideal: "Casas tranquilas, pessoas calmas",
    color: "#8B5CF6", bg: "#F3EEFF",
  },
  {
    name: "Maine Coon", species: "cat", emoji: "🐈", size: "Grande",
    origin: "EUA", life: "12–15 anos", weight: "4–10 kg",
    personality: ["Sociável", "Inteligente", "Brincalhão", "Leal"],
    health: ["Miocardiopatia", "Displasia da anca", "Doença renal"],
    care: "Escovagem 2x/semana. Muito activo — precisa de estímulo. Adora água!",
    ideal: "Famílias, crianças, outros animais",
    color: "#06D6A0", bg: "#E6FAF5",
  },
  {
    name: "Siamês", species: "cat", emoji: "🐈‍⬛", size: "Médio",
    origin: "Tailândia", life: "12–20 anos", weight: "3–6 kg",
    personality: ["Vocal", "Curioso", "Social", "Inteligente"],
    health: ["Problemas dentários", "Amiloidose", "Asma"],
    care: "Muito interactivo — precisa de atenção. Escovagem semanal. Estimulação mental importante.",
    ideal: "Donos presentes, apreciam gatos comunicativos",
    color: "#F97316", bg: "#FFF7ED",
  },
  {
    name: "Canário", species: "bird", emoji: "🐤", size: "Pequeno",
    origin: "Ilhas Canárias", life: "10–15 anos", weight: "20–30 g",
    personality: ["Musical", "Activo", "Tímido", "Alegre"],
    health: ["Acarose", "Infecções respiratórias", "Obesidade"],
    care: "Gaiola espaçosa. Água fresca diária. Dieta variada com frutas e vegetais. Sem correntes de ar.",
    ideal: "Qualquer lar, iniciantes",
    color: "#FBBF24", bg: "#FFFBEB",
  },
  {
    name: "Papagaio Cinzento", species: "bird", emoji: "🦜", size: "Médio",
    origin: "África", life: "40–60 anos", weight: "400–600 g",
    personality: ["Inteligente", "Mimado", "Sensível", "Comunicativo"],
    health: ["Doenças do fígado", "Infecções respiratórias", "Autofagia"],
    care: "Muito inteligente — estimulação mental diária. Dieta rica e variada. Interação constante necessária.",
    ideal: "Donos experientes, muito tempo disponível",
    color: "#6B7280", bg: "#F3F4F6",
  },
  {
    name: "Coelho Anão", species: "rabbit", emoji: "🐰", size: "Pequeno",
    origin: "Europa", life: "8–12 anos", weight: "1–2 kg",
    personality: ["Curioso", "Afectuoso", "Activo", "Social"],
    health: ["Problemas dentários", "GI stasis", "Myxomatose"],
    care: "Feno fresco ilimitado. Espaço para correr. Vacinação anual. Esterilização recomendada.",
    ideal: "Apartamentos, crianças maiores",
    color: "#F472B6", bg: "#FDF2F8",
  },
];

const FILTERS = ["Todos", "Cão 🐕", "Gato 🐱", "Ave 🦜", "Coelho 🐰"];
const filterMap: Record<string, string> = { "Cão 🐕": "dog", "Gato 🐱": "cat", "Ave 🦜": "bird", "Coelho 🐰": "rabbit" };

export default function BreedGuideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState<typeof BREEDS[0] | null>(null);

  const filtered = BREEDS.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Todos" || b.species === filterMap[filter];
    return matchSearch && matchFilter;
  });

  if (selected) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: selected.bg }} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Header */}
          <View style={{ backgroundColor: selected.color, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
            <TouchableOpacity onPress={() => setSelected(null)} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}>
              <ChevronLeft size={20} color="#fff" />
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Voltar</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontSize: 64, textAlign: "center" }}>{selected.emoji}</Text>
            <Text suppressHighlighting style={{ fontSize: 26, fontWeight: "900", color: "#fff", textAlign: "center", marginTop: 8 }}>{selected.name}</Text>
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>📏 {selected.size}</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>⏳ {selected.life}</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>⚖️ {selected.weight}</Text>
              </View>
              <View style={{ backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>🌍 {selected.origin}</Text>
              </View>
            </View>
          </View>

          <View style={{ padding: 20, gap: 16 }}>
            {/* Personalidade */}
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 12 }}>✨ Personalidade</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {selected.personality.map(p => (
                  <View key={p} style={{ backgroundColor: selected.bg, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5, borderColor: selected.color + "40" }}>
                    <Text suppressHighlighting style={{ color: selected.color, fontWeight: "700", fontSize: 13 }}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Cuidados */}
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 10 }}>🛁 Cuidados</Text>
              <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14, lineHeight: 22 }}>{selected.care}</Text>
            </View>

            {/* Saúde */}
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 12 }}>⚕️ Atenção à Saúde</Text>
              {selected.health.map(h => (
                <View key={h} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" }} />
                  <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14 }}>{h}</Text>
                </View>
              ))}
            </View>

            {/* Ideal para */}
            <View style={{ backgroundColor: selected.bg, borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: selected.color + "30" }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 8 }}>🏠 Ideal para</Text>
              <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14, lineHeight: 20 }}>{selected.ideal}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ backgroundColor: PURPLE, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "900", color: "#fff" }}>Guia de Raças 📖</Text>
            <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>{BREEDS.length} raças disponíveis</Text>
          </View>
        </View>
        <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 8 }}>
          <Search size={16} color="rgba(255,255,255,0.8)" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Pesquisar raça..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={{ flex: 1, color: "#fff", fontSize: 14 }}
          />
        </View>
      </View>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingVertical: 14 }}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: filter === f ? PURPLE : CARD, borderWidth: 1.5, borderColor: filter === f ? PURPLE : "#E5E7EB" }}>
            <Text suppressHighlighting style={{ color: filter === f ? "#fff" : GRAY, fontWeight: "700", fontSize: 13 }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 20) + 60, gap: 12 }}>
        {filtered.map(b => (
          <TouchableOpacity key={b.name} onPress={() => setSelected(b)} activeOpacity={0.85}
            style={{ backgroundColor: CARD, borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1.5, borderColor: b.color + "25" }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: b.bg, alignItems: "center", justifyContent: "center" }}>
              <Text suppressHighlighting style={{ fontSize: 32 }}>{b.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK }}>{b.name}</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 2 }}>{b.size} · {b.life}</Text>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {b.personality.slice(0, 2).map(p => (
                  <View key={p} style={{ backgroundColor: b.bg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text suppressHighlighting style={{ color: b.color, fontSize: 11, fontWeight: "700" }}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
            <ChevronRight size={18} color={GRAY} />
          </TouchableOpacity>
        ))}
        {filtered.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text suppressHighlighting style={{ fontSize: 48 }}>🔍</Text>
            <Text suppressHighlighting style={{ color: DARK, fontWeight: "700", fontSize: 16, marginTop: 12 }}>Nenhuma raça encontrada</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
