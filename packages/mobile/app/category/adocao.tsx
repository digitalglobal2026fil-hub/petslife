import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Search, MapPin, Heart } from "lucide-react-native";
import { api } from "../../lib/api";
import { AnimalFact } from "../../components/AnimalFact";
import { CategoryHeader } from "../../components/CategoryHeader";
import { useState, useCallback } from "react";

function AdoptionCard({ item, onPress }: { item: any; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{
      backgroundColor: "#fff", borderRadius: 20, marginBottom: 14,
      borderWidth: 1.5, borderColor: "#FEE2E2",
      shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 0,
    }}>
      <View style={{ flexDirection: "row", padding: 16, gap: 14 }}>
        <View style={{ width: 72, height: 72, borderRadius: 18, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={{ width: 72, height: 72, borderRadius: 18 }} />
          ) : (
            <Text style={{ fontSize: 34, backgroundColor: "transparent" }}>🐾</Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text suppressHighlighting style={{ fontWeight: "800", color: "#1A1A2E", fontSize: 15, flex: 1 }} numberOfLines={1}>{item.title}</Text>
            <Heart size={16} color="#EF4444" fill="#EF4444" style={{ marginLeft: 8 }} />
          </View>
          {item.location ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 }}>
              <MapPin size={12} color="#9CA3AF" />
              <Text suppressHighlighting style={{ fontSize: 12, color: "#6B7280" }} numberOfLines={1}>{item.location}</Text>
            </View>
          ) : null}
          {item.breed ? (
            <View style={{ marginTop: 6 }}>
              <View style={{ backgroundColor: "#FEF2F2", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: "flex-start" }}>
                <Text suppressHighlighting style={{ fontSize: 11, color: "#EF4444", fontWeight: "700" }}>{item.breed}</Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
      {item.description ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
          <Text suppressHighlighting style={{ fontSize: 13, color: "#6B7280", lineHeight: 19 }} numberOfLines={2}>{item.description}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export default function AdocaoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["marketplace"],
    queryFn: async () => {
      const res = await (api as any).marketplace.$get();
      if (!res.ok) throw new Error("Erro");
      return res.json();
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const allListings: any[] = (data as any)?.listings ?? [];
  const filtered = allListings.filter((item: any) =>
    item.category === "adoption" && (
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase()) ||
      (item.breed ?? "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF5F5" }}>
      <CategoryHeader
        emoji="❤️"
        title="Adoção"
        subtitle="Animais à espera de um lar amoroso"
        bgColor="#FFF1F2"
        accentColor="#EF4444"
      />

      {/* Search */}
      <View style={{ marginHorizontal: 20, marginBottom: 16, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, borderWidth: 1.5, borderColor: "#FEE2E2", paddingHorizontal: 14, height: 46 }}>
        <Search size={18} color="#A0A0B0" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Pesquisar animais..."
          placeholderTextColor="#B0B0C0"
          style={{ flex: 1, marginLeft: 10, fontSize: 15, color: "#1A1A2E" }}
        />
      </View>

      <AnimalFact />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#EF4444" style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Text style={{ fontSize: 48, backgroundColor: "transparent" }}>🐾</Text>
            <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>Sem animais para adoção</Text>
            <Text suppressHighlighting style={{ fontSize: 14, color: "#6B7280", marginTop: 6, textAlign: "center" }}>Nenhum animal disponível para adoção neste momento.</Text>
          </View>
        ) : (
          filtered.map((item: any) => (
            <AdoptionCard key={item.id} item={item} onPress={() => router.push(`/listing/${item.id}`)} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
