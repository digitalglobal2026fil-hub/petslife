import { View, Text, ScrollView, TouchableOpacity, TextInput, Linking, Alert, Modal } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ShoppingCart, Search, ChevronLeft, Phone, Globe, Star } from "lucide-react-native";

const BG = "#F0F9FF";
const DARK = "#1A1A2E";
const GRAY = "#9CA3AF";
const BLUE = "#0EA5E9";
const BLUE_BG = "#E0F2FE";
const CARD = "#FFFFFF";

const PRODUCTS = [
  {
    id: "1", category: "Antiparasitários", emoji: "🪲",
    name: "Bravecto Spot-On Cão", brand: "MSD Animal Health",
    description: "Proteção de 3 meses contra pulgas e carraças. Aplicação na pele.",
    price: "28,50€", rating: 4.8, reviews: 342,
    tags: ["Pulgas", "Carraças", "3 meses"],
    color: "#F97316", bg: "#FFF7ED",
    where: [
      { name: "Farmácia Vet Online", url: "https://www.zooplus.pt" },
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "2", category: "Antiparasitários", emoji: "🪲",
    name: "Frontline Combo Gato", brand: "Boehringer",
    description: "Pipeta antiparasitária para gatos. Pulgas, carraças e piolhos.",
    price: "9,90€", rating: 4.5, reviews: 215,
    tags: ["Gatos", "Pulgas", "Mensal"],
    color: "#F97316", bg: "#FFF7ED",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "3", category: "Suplementos", emoji: "💊",
    name: "Nutrolin B Skin & Coat", brand: "Nutrolin",
    description: "Ácidos gordos ómega-3 e ómega-6 para pele e pelagem radiante.",
    price: "22,00€", rating: 4.9, reviews: 128,
    tags: ["Pele", "Pelagem", "Ómega-3"],
    color: "#8B5CF6", bg: "#F3EEFF",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "4", category: "Suplementos", emoji: "💊",
    name: "Vetri-Science Glyco-Flex III", brand: "Vetri-Science",
    description: "Suporte articular avançado para cães com displasia ou artrite.",
    price: "35,00€", rating: 4.7, reviews: 87,
    tags: ["Articulações", "Cão", "Idosos"],
    color: "#8B5CF6", bg: "#F3EEFF",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "5", category: "Higiene", emoji: "🛁",
    name: "Virbac SEBOCALM Champô", brand: "Virbac",
    description: "Champô dermatológico para pele sensível e seca. Sem parabenos.",
    price: "14,90€", rating: 4.6, reviews: 203,
    tags: ["Pele Sensível", "Cão", "Gato"],
    color: "#06D6A0", bg: "#E6FAF5",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "6", category: "Higiene", emoji: "🛁",
    name: "Limpador de Ouvidos Otodine", brand: "ICF",
    description: "Solução de limpeza auricular. Previne infecções e acumulação de cera.",
    price: "8,50€", rating: 4.4, reviews: 156,
    tags: ["Ouvidos", "Prevenção", "Cão/Gato"],
    color: "#06D6A0", bg: "#E6FAF5",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "7", category: "Alimentação Especial", emoji: "🍽️",
    name: "Royal Canin Urinary S/O", brand: "Royal Canin",
    description: "Ração veterinária para gatos com problemas urinários. Dissolve cristais.",
    price: "42,00€", rating: 4.7, reviews: 445,
    tags: ["Urinário", "Veterinário", "Gato"],
    color: "#FF6B35", bg: "#FFF0EB",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "8", category: "Alimentação Especial", emoji: "🍽️",
    name: "Hill's Prescription Diet z/d", brand: "Hill's",
    description: "Dieta hipoalergénica para cães com alergias alimentares diagnosticadas.",
    price: "55,00€", rating: 4.5, reviews: 89,
    tags: ["Alergias", "Veterinário", "Cão"],
    color: "#FF6B35", bg: "#FFF0EB",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "9", category: "Cuidados Dentários", emoji: "🦷",
    name: "Virbac C.E.T. Pasta Dentária", brand: "Virbac",
    description: "Pasta dentária enzimática com sabor a frango. Previne tártaro.",
    price: "11,00€", rating: 4.3, reviews: 312,
    tags: ["Dentes", "Tártaro", "Cão/Gato"],
    color: "#4ECDC4", bg: "#E8FAF9",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
  {
    id: "10", category: "Cuidados Dentários", emoji: "🦷",
    name: "Tropiclean Water Additive", brand: "Tropiclean",
    description: "Adicione 1 capaz à água. Sem escovar — combate placa bacteriana.",
    price: "16,00€", rating: 4.2, reviews: 178,
    tags: ["Dentes", "Fácil", "Sem escova"],
    color: "#4ECDC4", bg: "#E8FAF9",
    where: [
      { name: "Zooplus PT", url: "https://www.zooplus.pt" },
    ],
  },
];

const CATEGORIES = ["Todos", "Antiparasitários", "Suplementos", "Higiene", "Alimentação Especial", "Cuidados Dentários"];

export default function PharmacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selected, setSelected] = useState<typeof PRODUCTS[0] | null>(null);

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Todos" || p.category === category;
    return matchSearch && matchCat;
  });

  const Stars = ({ rating }: { rating: number }) => (
    <View style={{ flexDirection: "row", gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} color="#FBBF24" fill={i <= Math.round(rating) ? "#FBBF24" : "none"} />
      ))}
    </View>
  );

  if (selected) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: selected.bg }} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ backgroundColor: selected.color, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
            <TouchableOpacity onPress={() => setSelected(null)} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}>
              <ChevronLeft size={20} color="#fff" />
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Voltar</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontSize: 56, textAlign: "center" }}>{selected.emoji}</Text>
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "900", color: "#fff", textAlign: "center", marginTop: 8 }}>{selected.name}</Text>
            <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.75)", textAlign: "center", marginTop: 4, fontSize: 13 }}>{selected.brand}</Text>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 12 }}>
              <Stars rating={selected.rating} />
              <Text suppressHighlighting style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>{selected.rating} ({selected.reviews} avaliações)</Text>
            </View>
          </View>

          <View style={{ padding: 20, gap: 16 }}>
            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 10 }}>📋 Descrição</Text>
              <Text suppressHighlighting style={{ color: "#374151", fontSize: 14, lineHeight: 22 }}>{selected.description}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {selected.tags.map(t => (
                  <View key={t} style={{ backgroundColor: selected.bg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1.5, borderColor: selected.color + "40" }}>
                    <Text suppressHighlighting style={{ color: selected.color, fontSize: 12, fontWeight: "700" }}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ backgroundColor: CARD, borderRadius: 20, padding: 18 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "800", color: DARK }}>💰 Preço indicativo</Text>
                <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "900", color: selected.color }}>~{selected.price}</Text>
              </View>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginBottom: 14 }}>Comprar online em lojas certificadas:</Text>
              {selected.where.map(w => (
                <TouchableOpacity key={w.name} onPress={() => Linking.openURL(w.url)}
                  style={{ backgroundColor: BLUE_BG, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8, borderWidth: 1.5, borderColor: BLUE + "30" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Globe size={18} color={BLUE} />
                    <Text suppressHighlighting style={{ color: BLUE, fontWeight: "700", fontSize: 14 }}>{w.name}</Text>
                  </View>
                  <Text suppressHighlighting style={{ color: BLUE, fontWeight: "800", fontSize: 12 }}>Ver →</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ backgroundColor: "#FFFBEB", borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "#FDE68A" }}>
              <Text suppressHighlighting style={{ color: "#92400E", fontSize: 13, lineHeight: 20 }}>
                ⚠️ Consulte sempre o seu veterinário antes de administrar qualquer medicamento ou suplemento ao seu animal.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{ backgroundColor: BLUE, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "900", color: "#fff" }}>Farmácia Veterinária 💊</Text>
            <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>Produtos recomendados para o seu animal</Text>
          </View>
        </View>
        <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 8 }}>
          <Search size={16} color="rgba(255,255,255,0.8)" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Pesquisar produto..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={{ flex: 1, color: "#fff", fontSize: 14 }}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingVertical: 14 }}>
        {CATEGORIES.map(c => (
          <TouchableOpacity key={c} onPress={() => setCategory(c)}
            style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: category === c ? BLUE : CARD, borderWidth: 1.5, borderColor: category === c ? BLUE : "#E5E7EB" }}>
            <Text suppressHighlighting style={{ color: category === c ? "#fff" : GRAY, fontWeight: "700", fontSize: 12 }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Medicacao e assunto serio: aviso claro de que nada aqui dispensa
          um veterinario. Ajuda tambem na aprovacao da Play Store. */}
      <View style={{ backgroundColor: "#FEF3C7", borderWidth: 1.5, borderColor: "#FDE68A", borderRadius: 14, padding: 12, marginHorizontal: 20, marginBottom: 12 }}>
        <Text suppressHighlighting style={{ color: "#92400E", fontSize: 12, lineHeight: 18 }}>
          Informação baseada em fontes veterinárias reconhecidas. Nunca medique o seu
          animal sem indicação de um médico veterinário.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 20) + 60, gap: 10 }}>
        {filtered.map(p => (
          <TouchableOpacity key={p.id} onPress={() => setSelected(p)} activeOpacity={0.85}
            style={{ backgroundColor: CARD, borderRadius: 20, padding: 16, flexDirection: "row", gap: 14, borderWidth: 1.5, borderColor: p.color + "20" }}>
            <View style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: p.bg, alignItems: "center", justifyContent: "center" }}>
              <Text suppressHighlighting style={{ fontSize: 30 }}>{p.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ backgroundColor: p.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginBottom: 5 }}>
                <Text suppressHighlighting style={{ color: p.color, fontSize: 10, fontWeight: "700" }}>{p.category}</Text>
              </View>
              <Text suppressHighlighting style={{ fontWeight: "800", color: DARK, fontSize: 14 }} numberOfLines={1}>{p.name}</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 1 }}>{p.brand}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={10} color="#FBBF24" fill={i <= Math.round(p.rating) ? "#FBBF24" : "none"} />
                  ))}
                  <Text suppressHighlighting style={{ color: GRAY, fontSize: 11, marginLeft: 2 }}>({p.reviews})</Text>
                </View>
                <Text suppressHighlighting style={{ fontWeight: "900", color: p.color, fontSize: 15 }}>~{p.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
