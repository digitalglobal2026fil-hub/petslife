import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, RefreshControl, Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Phone, Star, Tag, PawPrint, ChevronLeft } from "lucide-react-native";
import { useState, useCallback } from "react";
import { api } from "../../lib/api";

const BG = "#F5ECD7";
const BROWN = "#6B3A2A";
const BROWN2 = "#8B5E3C";
const ORANGE = "#E07A3A";
const CARD = "#FFFFFF";
const BORDER = "#E8D5B7";
const GRAY = "#A08060";
const ICON_BG = "#EDD8B8";

// ── Cute animal phrases per category ─────────────────────────────────────────
const CAT_PHRASES: Record<string, string[]> = {
  "biz-clinica":    ["🏥 A saúde do teu pet em boas mãos!", "🐾 Vets que amam animais tanto como tu!"],
  "biz-petshop":    ["🛍️ Petshops cheinhos de amor e ração!", "🐾 Porque o teu pet merece o melhor!"],
  "biz-hotel":      ["🏠 Hotéis onde os pets são VIPs!", "😴 O teu bichinho vai dormir feliz!"],
  "biz-tosquiador": ["✂️ Beleza começa pelo pelo!", "💅 Grooming com muito amor e carinho!"],
  "biz-treino":     ["🎾 Truques novos todos os dias!", "🐕 Um pet treinado é um pet feliz!"],
  "biz-outro":      ["📦 Outros serviços com muito carinho!", "🐾 Patinhas ao serviço do teu pet!"],
  "biz-todos":      ["🔍 Todos os negócios pet numa só app!", "🐾 Encontra o que o teu bichinho precisa!"],
  "list-adoption":  ["🏠 Adoptar é a decisão mais bonita do mundo!", "💛 Há uma vida à tua espera!"],
  "list-products":  ["🛍️ Produtos com muito amor no pacote!", "🐾 Tudo o que o teu pet desejava!"],
  "list-services":  ["✂️ Serviços de qualidade de quem ama animais!", "💕 Profissionais apaixonados por pets!"],
  "list-lost":      ["🔎 Juntos encontramos todos!", "💙 Cada animal perdido é uma família incompleta."],
  "list-todos":     ["📋 Todos os anúncios num só lugar!", "🐾 O mercado mais fofo de Portugal!"],
};

const CAT_INFO: Record<string, { label: string; emoji: string; color: string }> = {
  "biz-clinica":    { label: "Clínicas",     emoji: "🏥", color: "#FEE2E2" },
  "biz-petshop":    { label: "Petshops",     emoji: "🐾", color: "#D1FAE5" },
  "biz-hotel":      { label: "Hotéis",       emoji: "🏠", color: "#DBEAFE" },
  "biz-tosquiador": { label: "Tosquiadores", emoji: "✂️", color: "#F3E8FF" },
  "biz-treino":     { label: "Treino",       emoji: "🎾", color: "#FEF3C7" },
  "biz-outro":      { label: "Outros",       emoji: "📦", color: ICON_BG },
  "biz-todos":      { label: "Todos os Negócios", emoji: "🏪", color: ICON_BG },
  "list-adoption":  { label: "Adoção",       emoji: "🏠", color: "#D1FAE5" },
  "list-products":  { label: "Produtos",     emoji: "🛍️", color: "#DBEAFE" },
  "list-services":  { label: "Serviços",     emoji: "✂️", color: "#F3E8FF" },
  "list-lost":      { label: "Perdidos",     emoji: "🔎", color: "#FEE2E2" },
  "list-todos":     { label: "Todos os Anúncios", emoji: "📋", color: ICON_BG },
};

const typeEmoji: Record<string, string> = {
  clinica: "🏥", petshop: "🐾", tosquiador: "✂️",
  hotel: "🏠", treino: "🎾", outro: "📦",
};

function SearchInput({ onSearch, placeholder }: { onSearch: (v: string) => void; placeholder: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: CARD, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1.5, borderColor: BORDER, marginBottom: 14 }}>
      <Search size={18} color={GRAY} />
      <TextInput onChangeText={onSearch} placeholder={placeholder} placeholderTextColor={GRAY}
        autoCorrect={false} autoCapitalize="none"
        style={{ flex: 1, padding: 12, fontSize: 14, color: BROWN }} />
    </View>
  );
}

function BusinessCard({ b, onPress }: { b: any; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}
      style={{ backgroundColor: CARD, borderRadius: 20, marginBottom: 14, borderWidth: 1.5, borderColor: BORDER, shadowColor: BROWN, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
      <View style={{ flexDirection: "row", padding: 16, gap: 14 }}>
        <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: ICON_BG, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 30 }}>{typeEmoji[b.type] ?? "📦"}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "800", color: BROWN, fontSize: 15, flex: 1 }} numberOfLines={1}>{b.name}</Text>
            {b.averageRating > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginLeft: 8 }}>
                <Star size={13} color="#F59E0B" fill="#F59E0B" />
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#92400E" }}>{b.averageRating.toFixed(1)}</Text>
              </View>
            )}
          </View>
          {b.city ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 }}>
              <MapPin size={12} color={GRAY} />
              <Text style={{ fontSize: 12, color: GRAY }} numberOfLines={1}>{b.city}</Text>
            </View>
          ) : null}
          {b.phone ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
              <Phone size={12} color={GRAY} />
              <Text style={{ fontSize: 12, color: GRAY }}>{b.phone}</Text>
            </View>
          ) : null}
        </View>
      </View>
      {b.description ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
          <Text style={{ fontSize: 13, color: GRAY, lineHeight: 19 }} numberOfLines={2}>{b.description}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

function ListingCard({ l, onPress }: { l: any; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}
      style={{ width: "47%", backgroundColor: CARD, borderRadius: 20, overflow: "hidden", borderWidth: 1.5, borderColor: BORDER, marginBottom: 12 }}>
      <View style={{ height: 100, backgroundColor: ICON_BG, alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: BG, borderRadius: 20, padding: 10 }}>
          <PawPrint size={32} color={BROWN2} />
        </View>
      </View>
      <View style={{ padding: 12 }}>
        <Text style={{ fontWeight: "700", color: BROWN, fontSize: 13 }} numberOfLines={1}>{l.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <Text style={{ color: ORANGE, fontWeight: "800", fontSize: 15 }}>
            {l.price === 0 ? "Grátis" : `€${Number(l.price).toFixed(2)}`}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Tag size={11} color={GRAY} />
            <Text style={{ color: GRAY, fontSize: 11 }}>{l.category}</Text>
          </View>
        </View>
        {l.location ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 }}>
            <MapPin size={10} color={GRAY} />
            <Text style={{ fontSize: 10, color: GRAY }} numberOfLines={1}>{l.location}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default function MarketplaceCategory() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const handleSearch = useCallback((v: string) => setSearch(v), []);

  const isBiz = slug?.startsWith("biz-");
  const catKey = slug?.replace(/^(biz|list)-/, "");
  const info = CAT_INFO[slug] ?? { label: slug, emoji: "📋", color: ICON_BG };
  const phrases = CAT_PHRASES[slug] ?? ["🐾 O teu pet merece o melhor!"];
  const phrase = phrases[Math.floor(Date.now() / 60000) % phrases.length];

  const bizQuery = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const res = await (api as any).businesses.$get();
      if (!res.ok) throw new Error("Erro");
      return res.json();
    },
    enabled: isBiz,
  });

  const listQuery = useQuery({
    queryKey: ["marketplace"],
    queryFn: async () => {
      const res = await api.marketplace.$get();
      if (!res.ok) throw new Error("Erro");
      return res.json();
    },
    enabled: !isBiz,
  });

  const businesses: any[] = (bizQuery.data as any)?.businesses ?? [];
  const listings: any[] = (listQuery.data as any)?.listings ?? [];

  const filteredBiz = businesses.filter((b) => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || (b.city ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = catKey === "todos" || b.type === catKey;
    return matchSearch && matchCat;
  });

  const filteredList = listings.filter((l) => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = catKey === "todos" || l.category === catKey;
    return matchSearch && matchCat;
  });

  const isLoading = isBiz ? bizQuery.isLoading : listQuery.isLoading;
  const refetch = isBiz ? bizQuery.refetch : listQuery.refetch;

  const emptyPhrases = [
    "🐾 Ainda vazio, mas cheio de potencial!",
    "😸 Nenhum resultado... por enquanto!",
    "🐶 Nada aqui ainda — sê o primeiro!",
    "🌟 Este espaço está à tua espera!",
  ];
  const emptyPhrase = emptyPhrases[Math.floor(Math.random() * emptyPhrases.length)];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["left", "right", "bottom"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: CARD, borderWidth: 1.5, borderColor: BORDER, alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={20} color={BROWN} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: "900", color: BROWN }}>{info.emoji} {info.label}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push(isBiz ? "/add-business" : "/add-listing")}
          style={{ backgroundColor: isBiz ? BROWN2 : ORANGE, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 }}>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Phrase banner */}
      <View style={{ marginHorizontal: 20, marginBottom: 14, backgroundColor: info.color, borderRadius: 16, padding: 12, borderWidth: 1.5, borderColor: BORDER }}>
        <Text style={{ color: BROWN2, fontSize: 13, fontWeight: "600", textAlign: "center", fontStyle: "italic" }}>{phrase}</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20 }}>
        <SearchInput onSearch={handleSearch} placeholder={isBiz ? "Pesquisar por nome ou cidade..." : "Pesquisar anúncios..."} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}>

        {isLoading ? (
          <View style={{ alignItems: "center", paddingVertical: 60 }}>
            <ActivityIndicator color={ORANGE} size="large" />
            <Text style={{ color: GRAY, marginTop: 12, fontSize: 13 }}>🐾 A carregar...</Text>
          </View>
        ) : isBiz ? (
          filteredBiz.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 50 }}>
              <Text style={{ fontSize: 56 }}>🏪</Text>
              <Text style={{ fontSize: 16, fontWeight: "800", color: BROWN, marginTop: 14, textAlign: "center" }}>{emptyPhrase}</Text>
              <Text style={{ color: GRAY, marginTop: 6, textAlign: "center", fontSize: 13 }}>
                {businesses.length === 0 ? "Sê o primeiro a registar um negócio aqui!" : "Tenta outra pesquisa"}
              </Text>
              {businesses.length === 0 && (
                <TouchableOpacity onPress={() => router.push("/add-business")}
                  style={{ backgroundColor: BROWN2, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16 }}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>+ Registar Negócio</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : filteredBiz.map((b: any) => (
            <BusinessCard key={b.id} b={b} onPress={() => router.push(`/business/${b.id}` as any)} />
          ))
        ) : (
          filteredList.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 50 }}>
              <Text style={{ fontSize: 56 }}>🛒</Text>
              <Text style={{ fontSize: 16, fontWeight: "800", color: BROWN, marginTop: 14, textAlign: "center" }}>{emptyPhrase}</Text>
              <Text style={{ color: GRAY, marginTop: 6, textAlign: "center", fontSize: 13 }}>
                {listings.length === 0 ? "Publica o primeiro anúncio!" : "Tenta outra pesquisa"}
              </Text>
              {listings.length === 0 && (
                <TouchableOpacity onPress={() => router.push("/add-listing")}
                  style={{ backgroundColor: ORANGE, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16 }}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>+ Publicar Anúncio</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {filteredList.map((l: any) => (
                <ListingCard key={l.id} l={l} onPress={() => router.push(`/listing/${l.id}` as any)} />
              ))}
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
