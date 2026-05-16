import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Search, Plus, Tag, PawPrint } from "lucide-react-native";
import { useState, useRef, useCallback } from "react";
import { api } from "../../lib/api";

const categories = ["Todos", "Alimentação", "Brinquedos", "Acessórios", "Serviços", "Outro"];

// Separate search input to prevent full re-render on every keystroke
function SearchInput({ onSearch }: { onSearch: (v: string) => void }) {
  return (
    <View style={{ marginHorizontal: 20, marginBottom: 12, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
      <Search size={18} color="#9CA3AF" />
      <TextInput
        onChangeText={onSearch}
        placeholder="Pesquisar produtos..."
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        autoCapitalize="none"
        style={{ flex: 1, padding: 12, fontSize: 14, color: "#1A1A2E" }}
      />
    </View>
  );
}

export default function MarketplaceScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const handleSearch = useCallback((v: string) => setSearch(v), []);

  const { data, isLoading } = useQuery({
    queryKey: ["marketplace"],
    queryFn: async () => (await api.marketplace.$get()).json(),
  });

  const listings = ((data as any)?.listings ?? []).filter((l: any) => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Todos" || l.category === category.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <View style={{ padding: 20, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text suppressHighlighting style={{ fontSize: 26, fontWeight: "800", color: "#1A1A2E" }}>Marketplace 🛍️</Text>
        <TouchableOpacity onPress={() => router.push("/add-listing")}
          style={{ backgroundColor: "#FF6B35", width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search — isolated component to prevent losing focus on re-render */}
      <SearchInput onSearch={handleSearch} />

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginBottom: 16 }}>
        {categories.map((c) => (
          <TouchableOpacity key={c} onPress={() => setCategory(c)}
            style={{ backgroundColor: category === c ? "#FF6B35" : "#fff", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: category === c ? "#FF6B35" : "#F0E8E0" }}>
            <Text suppressHighlighting style={{ color: category === c ? "#fff" : "#6B7280", fontWeight: "600", fontSize: 13 }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}>
        {isLoading ? <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} /> :
          listings.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Text suppressHighlighting style={{ fontSize: 48 }}>🛒</Text>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>Sem anúncios ainda</Text>
              <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 4, textAlign: "center" }}>Seja o primeiro a publicar um produto!</Text>
              <TouchableOpacity onPress={() => router.push("/add-listing")}
                style={{ backgroundColor: "#FF6B35", borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700" }}>+ Publicar anúncio</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {listings.map((l: any) => (
                <TouchableOpacity key={l.id} style={{ width: "47%", backgroundColor: "#fff", borderRadius: 20, overflow: "hidden", borderWidth: 1.5, borderColor: "#F0E8E0" }}>
                  <View style={{ height: 100, backgroundColor: "#FFF0EB", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ backgroundColor: "#F5EDE4", borderRadius: 20, padding: 10 }}>
                      <PawPrint size={32} color="#8B5E3C" />
                    </View>
                  </View>
                  <View style={{ padding: 12 }}>
                    <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 13 }} numberOfLines={1}>{l.title}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                      <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "800", fontSize: 15 }}>€{l.price.toFixed(2)}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Tag size={11} color="#9CA3AF" />
                        <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 11 }}>{l.category}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}
