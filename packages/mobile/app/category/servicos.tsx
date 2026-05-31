import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Search, MapPin, Tag } from "lucide-react-native";
import { api } from "../../lib/api";
import { AnimalFact } from "../../components/AnimalFact";
import { CategoryHeader } from "../../components/CategoryHeader";
import { useState, useCallback } from "react";

function ServiceCard({ item, onPress }: { item: any; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{
      backgroundColor: "#fff", borderRadius: 20, marginBottom: 14,
      borderWidth: 1.5, borderColor: "#E0E7FF",
      shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 0,
    }}>
      <View style={{ flexDirection: "row", padding: 16, gap: 14 }}>
        <View style={{ width: 72, height: 72, borderRadius: 18, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={{ width: 72, height: 72, borderRadius: 18 }} />
          ) : (
            <Text style={{ fontSize: 34, backgroundColor: "transparent" }}>🛠️</Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontWeight: "800", color: "#1A1A2E", fontSize: 15 }} numberOfLines={1}>{item.title}</Text>
          {item.price != null && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 }}>
              <Tag size={12} color="#6366F1" />
              <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: "#6366F1" }}>{item.price}€</Text>
            </View>
          )}
          {item.location ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
              <MapPin size={12} color="#9CA3AF" />
              <Text suppressHighlighting style={{ fontSize: 12, color: "#6B7280" }} numberOfLines={1}>{item.location}</Text>
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

export default function ServicosScreen() {
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
    item.category === "services" && (
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      (item.location ?? "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F3FF" }}>
      <CategoryHeader
        emoji="🛠️"
        title="Serviços"
        subtitle="Serviços especializados para o seu pet"
        bgColor="#EEF2FF"
        accentColor="#6366F1"
      />

      {/* Search */}
      <View style={{ marginHorizontal: 20, marginBottom: 16, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, borderWidth: 1.5, borderColor: "#E0E7FF", paddingHorizontal: 14, height: 46 }}>
        <Search size={18} color="#A0A0B0" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Pesquisar serviços..."
          placeholderTextColor="#B0B0C0"
          style={{ flex: 1, marginLeft: 10, fontSize: 15, color: "#1A1A2E" }}
        />
      </View>

      <AnimalFact />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Text style={{ fontSize: 48, backgroundColor: "transparent" }}>🛠️</Text>
            <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>Sem serviços disponíveis</Text>
            <Text suppressHighlighting style={{ fontSize: 14, color: "#6B7280", marginTop: 6, textAlign: "center" }}>Ainda não há serviços publicados nesta categoria.</Text>
          </View>
        ) : (
          filtered.map((item: any) => (
            <ServiceCard key={item.id} item={item} onPress={() => router.push(`/listing/${item.id}`)} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
