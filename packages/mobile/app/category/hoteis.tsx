import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Search, MapPin, Phone, Star } from "lucide-react-native";
import { api } from "../../lib/api";
import { AnimalFact } from "../../components/AnimalFact";
import { CategoryHeader } from "../../components/CategoryHeader";
import { useState, useCallback } from "react";

function BusinessCard({ b, onPress }: { b: any; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{
      backgroundColor: "#fff", borderRadius: 20, marginBottom: 14,
      borderWidth: 1.5, borderColor: "#E8F0FE",
      shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    }}>
      <View style={{ flexDirection: "row", padding: 16, gap: 14 }}>
        <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 30, backgroundColor: "transparent" }}>🏨</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text suppressHighlighting style={{ fontWeight: "800", color: "#1A1A2E", fontSize: 15, flex: 1 }} numberOfLines={1}>{b.name}</Text>
            {b.averageRating > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginLeft: 8 }}>
                <Star size={13} color="#F59E0B" fill="#F59E0B" />
                <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: "#92400E" }}>{b.averageRating.toFixed(1)}</Text>
              </View>
            )}
          </View>
          {b.city ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 }}>
              <MapPin size={12} color="#9CA3AF" />
              <Text suppressHighlighting style={{ fontSize: 12, color: "#6B7280" }} numberOfLines={1}>{b.city}</Text>
            </View>
          ) : null}
          {b.phone ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
              <Phone size={12} color="#9CA3AF" />
              <Text suppressHighlighting style={{ fontSize: 12, color: "#6B7280" }}>{b.phone}</Text>
            </View>
          ) : null}
        </View>
      </View>
      {b.description ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
          <Text suppressHighlighting style={{ fontSize: 13, color: "#6B7280", lineHeight: 19 }} numberOfLines={2}>{b.description}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export default function HoteisScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const res = await (api as any).businesses.$get();
      if (!res.ok) throw new Error("Erro");
      return res.json();
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const allBiz: any[] = (data as any)?.businesses ?? [];
  const filtered = allBiz.filter((b: any) => b.type === "hotel" &&
    (b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.city?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6FF" }}>
      <CategoryHeader
        emoji="🏨"
        title="Hotéis para Animais"
        subtitle="Hospedagem confortável para o seu pet"
        bgColor="#EEF2FF"
        accentColor="#4F46E5"
      />

      {/* Search */}
      <View style={{ marginHorizontal: 20, marginBottom: 16, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, borderWidth: 1.5, borderColor: "#E8F0FE", paddingHorizontal: 14, height: 46 }}>
        <Search size={18} color="#A0A0B0" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Pesquisar hotéis..."
          placeholderTextColor="#B0B0C0"
          style={{ flex: 1, marginLeft: 10, fontSize: 15, color: "#1A1A2E" }}
        />
      </View>

      <AnimalFact />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Text style={{ fontSize: 48, backgroundColor: "transparent" }}>🏨</Text>
            <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>Sem hotéis disponíveis</Text>
            <Text suppressHighlighting style={{ fontSize: 14, color: "#6B7280", marginTop: 6, textAlign: "center" }}>Ainda não há hotéis registados nesta área.</Text>
          </View>
        ) : (
          filtered.map((b: any) => (
            <BusinessCard key={b.id} b={b} onPress={() => router.push(`/business/${b.id}`)} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
