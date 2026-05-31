import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Search, Plus, Tag, PawPrint, Building2, MapPin, Phone, Star } from "lucide-react-native";
import { useState, useCallback } from "react";
import { api } from "../../lib/api";

// ─── Search input isolated so focus is never lost ───────────────────────────
function SearchInput({ onSearch, placeholder }: { onSearch: (v: string) => void; placeholder: string }) {
  return (
    <View style={{
      marginHorizontal: 20, marginBottom: 12,
      flexDirection: "row", alignItems: "center",
      backgroundColor: "#fff", borderRadius: 14,
      paddingHorizontal: 14, borderWidth: 1.5, borderColor: "#F0E8E0",
    }}>
      <Search size={18} color="#9CA3AF" />
      <TextInput
        onChangeText={onSearch}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        autoCapitalize="none"
        style={{ flex: 1, padding: 12, fontSize: 14, color: "#1A1A2E" }}
      />
    </View>
  );
}

// ─── Business card ───────────────────────────────────────────────────────────
const typeEmoji: Record<string, string> = {
  clinica: "🏥", petshop: "🐾", tosquiador: "✂️",
  hotel: "🏠", treino: "🎾", outro: "📦",
};
const typeLabel: Record<string, string> = {
  clinica: "Clínica", petshop: "Petshop", tosquiador: "Tosquiador",
  hotel: "Hotel Animal", treino: "Treino", outro: "Outro",
};

function BusinessCard({ b, onPress }: { b: any; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: "#fff", borderRadius: 20, marginBottom: 14,
        borderWidth: 1.5, borderColor: "#F0E8E0",
        shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 0,
      }}>
      <View style={{ flexDirection: "row", padding: 16, gap: 14 }}>
        {/* Icon */}
        <View style={{
          width: 64, height: 64, borderRadius: 18,
          backgroundColor: "#FFF0EB", alignItems: "center", justifyContent: "center",
        }}>
          <Text style={{ fontSize: 30, backgroundColor: "transparent" }}>{typeEmoji[b.type] ?? "📦"}</Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "800", color: "#1A1A2E", fontSize: 15, flex: 1 }} numberOfLines={1}>{b.name}</Text>
            {b.averageRating > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginLeft: 8 }}>
                <Star size={13} color="#F59E0B" fill="#F59E0B" />
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#92400E" }}>{b.averageRating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          <View style={{
            alignSelf: "flex-start", backgroundColor: "#FFF0EB",
            borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4,
          }}>
            <Text style={{ fontSize: 11, fontWeight: "700", color: "#8B5E3C" }}>{typeLabel[b.type] ?? b.type}</Text>
          </View>

          {b.city ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 }}>
              <MapPin size={12} color="#9CA3AF" />
              <Text style={{ fontSize: 12, color: "#6B7280" }} numberOfLines={1}>{b.city}</Text>
            </View>
          ) : null}

          {b.phone ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
              <Phone size={12} color="#9CA3AF" />
              <Text style={{ fontSize: 12, color: "#6B7280" }}>{b.phone}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {b.description ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
          <Text style={{ fontSize: 13, color: "#6B7280", lineHeight: 19 }} numberOfLines={2}>{b.description}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

// ─── Listing card ────────────────────────────────────────────────────────────
function ListingCard({ l, onPress }: { l: any; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        width: "47%", backgroundColor: "#fff", borderRadius: 20,
        overflow: "hidden", borderWidth: 1.5, borderColor: "#F0E8E0",
      }}>
      <View style={{ height: 100, backgroundColor: "#FFF0EB", alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#F5EDE4", borderRadius: 20, padding: 10 }}>
          <PawPrint size={32} color="#8B5E3C" />
        </View>
      </View>
      <View style={{ padding: 12 }}>
        <Text style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 13 }} numberOfLines={1}>{l.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <Text style={{ color: "#FF6B35", fontWeight: "800", fontSize: 15 }}>
            {l.price === 0 ? "Grátis" : `€${Number(l.price).toFixed(2)}`}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Tag size={11} color="#9CA3AF" />
            <Text style={{ color: "#9CA3AF", fontSize: 11 }}>{l.category}</Text>
          </View>
        </View>
        {l.location ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 }}>
            <MapPin size={10} color="#9CA3AF" />
            <Text style={{ fontSize: 10, color: "#9CA3AF" }} numberOfLines={1}>{l.location}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

// ─── Business categories ──────────────────────────────────────────────────────
const BIZ_CATS = [
  { key: "todos",      label: "Todos",       emoji: "🔍", route: null },
  { key: "clinica",    label: "Clínicas",    emoji: "🏥", route: "/category/clinicas" },
  { key: "petshop",    label: "Petshops",    emoji: "🐾", route: "/category/petshops" },
  { key: "hotel",      label: "Hotéis",      emoji: "🏨", route: "/category/hoteis" },
  { key: "tosquiador", label: "Tosquiadores",emoji: "✂️", route: "/category/tosquiadores" },
  { key: "treino",     label: "Treino",      emoji: "🎯", route: "/category/treino" },
  { key: "outro",      label: "Outro",       emoji: "📦", route: null },
];

// ─── Listing categories ────────────────────────────────────────────────────────
const LIST_CATS = [
  { key: "todos",     label: "Todos",          emoji: "🔍", route: null },
  { key: "adoption",  label: "Adoção",         emoji: "❤️", route: "/category/adocao" },
  { key: "products",  label: "Produtos",       emoji: "🛍️", route: null },
  { key: "services",  label: "Serviços",       emoji: "🛠️", route: "/category/servicos" },
  { key: "lost",      label: "Animal Perdido", emoji: "🔍", route: "/category/perdidos" },
];

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function MarketplaceScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<"businesses" | "listings">("businesses");
  const [search, setSearch] = useState("");
  const [bizCat, setBizCat] = useState("todos");
  const [listCat, setListCat] = useState("todos");

  const handleSearch = useCallback((v: string) => setSearch(v), []);

  // Businesses query
  const bizQuery = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const res = await (api as any).businesses.$get();
      if (!res.ok) throw new Error("Erro ao carregar negócios");
      return res.json();
    },
  });

  // Listings query
  const listQuery = useQuery({
    queryKey: ["marketplace"],
    queryFn: async () => {
      const res = await api.marketplace.$get();
      if (!res.ok) throw new Error("Erro ao carregar anúncios");
      return res.json();
    },
  });

  const businesses: any[] = (bizQuery.data as any)?.businesses ?? [];
  const listings: any[] = (listQuery.data as any)?.listings ?? [];

  const filteredBiz = businesses.filter((b) => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || (b.city ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = bizCat === "todos" || b.type === bizCat;
    return matchSearch && matchCat;
  });

  const filteredList = listings.filter((l) => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = listCat === "todos" || l.category === listCat;
    return matchSearch && matchCat;
  });

  const isLoading = tab === "businesses" ? bizQuery.isLoading : listQuery.isLoading;
  const refetch = tab === "businesses" ? bizQuery.refetch : listQuery.refetch;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ padding: 20, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 26, fontWeight: "800", color: "#1A1A2E" }}>Marketplace 🛍️</Text>
        <TouchableOpacity
          onPress={() => router.push(tab === "businesses" ? "/add-business" : "/add-listing")}
          style={{
            backgroundColor: tab === "businesses" ? "#8B5E3C" : "#FF6B35",
            width: 40, height: 40, borderRadius: 20,
            alignItems: "center", justifyContent: "center",
          }}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab switcher */}
      <View style={{
        flexDirection: "row", marginHorizontal: 20, marginBottom: 14,
        backgroundColor: "#F0E8E0", borderRadius: 16, padding: 4,
      }}>
        <TouchableOpacity
          onPress={() => { setTab("businesses"); setSearch(""); }}
          style={{
            flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
            gap: 6, paddingVertical: 10, borderRadius: 13,
            backgroundColor: tab === "businesses" ? "#fff" : "transparent",
            shadowColor: tab === "businesses" ? "#000" : "transparent",
            shadowOpacity: 0, shadowRadius: 0, elevation: 0,
          }}>
          <Building2 size={16} color={tab === "businesses" ? "#8B5E3C" : "#9CA3AF"} />
          <Text style={{ fontWeight: "700", fontSize: 14, color: tab === "businesses" ? "#8B5E3C" : "#9CA3AF" }}>Negócios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { setTab("listings"); setSearch(""); }}
          style={{
            flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
            gap: 6, paddingVertical: 10, borderRadius: 13,
            backgroundColor: tab === "listings" ? "#fff" : "transparent",
            shadowColor: tab === "listings" ? "#000" : "transparent",
            shadowOpacity: 0, shadowRadius: 0, elevation: 0,
          }}>
          <Tag size={16} color={tab === "listings" ? "#FF6B35" : "#9CA3AF"} />
          <Text style={{ fontWeight: "700", fontSize: 14, color: tab === "listings" ? "#FF6B35" : "#9CA3AF" }}>Anúncios</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <SearchInput
        onSearch={handleSearch}
        placeholder={tab === "businesses" ? "Pesquisar negócios, cidade..." : "Pesquisar anúncios..."}
      />

      {/* Category pills */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginBottom: 14 }}
      >
        {(tab === "businesses" ? BIZ_CATS : LIST_CATS).map((c) => {
          const active = tab === "businesses" ? bizCat === c.key : listCat === c.key;
          const activeColor = tab === "businesses" ? "#8B5E3C" : "#FF6B35";
          return (
            <TouchableOpacity
              key={c.key}
              onPress={() => {
                if (c.route && c.key !== "todos") {
                  router.push(c.route as any);
                } else {
                  tab === "businesses" ? setBizCat(c.key) : setListCat(c.key);
                }
              }}
              style={{
                flexDirection: "row", alignItems: "center", gap: 5,
                backgroundColor: active ? activeColor : "#fff",
                borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
                borderWidth: 1.5, borderColor: active ? activeColor : "#F0E8E0",
              }}>
              <Text style={{ fontSize: 14, backgroundColor: "transparent" }}>{c.emoji}</Text>
              <Text suppressHighlighting style={{ color: active ? "#fff" : "#6B7280", fontWeight: "600", fontSize: 13, backgroundColor: "transparent" }}>{c.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
      >
        {isLoading ? (
          <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} />
        ) : tab === "businesses" ? (
          filteredBiz.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Text style={{ fontSize: 48, backgroundColor: "transparent" }}>🏪</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>
                {businesses.length === 0 ? "Ainda sem negócios" : "Sem resultados"}
              </Text>
              <Text style={{ color: "#6B7280", marginTop: 4, textAlign: "center" }}>
                {businesses.length === 0
                  ? "Seja o primeiro a registar o seu negócio!"
                  : "Tente outra pesquisa ou categoria"}
              </Text>
              {businesses.length === 0 && (
                <TouchableOpacity onPress={() => router.push("/add-business")}
                  style={{ backgroundColor: "#8B5E3C", borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16 }}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>+ Registar Negócio</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredBiz.map((b: any) => (
              <BusinessCard
                key={b.id}
                b={b}
                onPress={() => router.push(`/business/${b.id}` as any)}
              />
            ))
          )
        ) : (
          filteredList.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Text style={{ fontSize: 48, backgroundColor: "transparent" }}>🛒</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>
                {listings.length === 0 ? "Sem anúncios ainda" : "Sem resultados"}
              </Text>
              <Text style={{ color: "#6B7280", marginTop: 4, textAlign: "center" }}>
                {listings.length === 0
                  ? "Seja o primeiro a publicar um anúncio!"
                  : "Tente outra pesquisa ou categoria"}
              </Text>
              {listings.length === 0 && (
                <TouchableOpacity onPress={() => router.push("/add-listing")}
                  style={{ backgroundColor: "#FF6B35", borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16 }}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>+ Publicar Anúncio</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {filteredList.map((l: any) => (
                <ListingCard
                  key={l.id}
                  l={l}
                  onPress={() => router.push(`/listing/${l.id}` as any)}
                />
              ))}
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
