import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Search, MapPin, Phone, Star } from "lucide-react-native";
import { api } from "../../lib/api";
import { AnimalFact } from "../../components/AnimalFact";
import { CategoryHeader } from "../../components/CategoryHeader";
import { useState, useCallback } from "react";
import { tr } from "../../lib/i18n";

function BusinessCard({ b, onPress }: { b: any; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{
      backgroundColor: "#fff", borderRadius: 20, marginBottom: 14,
      borderWidth: 1.5, borderColor: "#F0E8E0",
      shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 0,
    }}>
      <View style={{ flexDirection: "row", padding: 16, gap: 14 }}>
        <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: "#FFF0EB", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 30, backgroundColor: "transparent" }}>🐾</Text>
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

export default function PetshopsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const handleSearch = useCallback((v: string) => setSearch(v), []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const res = await (api as any).businesses.$get();
      if (!res.ok) throw new Error(tr("Erro"));
      return res.json();
    },
  });

  const businesses: any[] = ((data as any)?.businesses ?? []).filter((b: any) =>
    b.type === "petshop" && (!search || b.name.toLowerCase().includes(search.toLowerCase()) || (b.city ?? "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <CategoryHeader
        emoji="🐾"
        title={tr("Petshops")}
        subtitle={tr("Tudo o que o seu animal precisa")}
        bgColor="#F0FFF4"
        accentColor="#10B981"
      />

      <View style={{ marginHorizontal: 20, marginBottom: 14, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
        <Search size={18} color="#9CA3AF" />
        <TextInput onChangeText={handleSearch} placeholder={tr("Pesquisar petshops...")} placeholderTextColor="#9CA3AF" style={{ flex: 1, padding: 12, fontSize: 14, color: "#1A1A2E" }} />
      </View>

      <AnimalFact seed={3} compact style={{ marginHorizontal: 20, marginBottom: 14 }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}>
        {isLoading ? (
          <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} />
        ) : businesses.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ fontSize: 48, backgroundColor: "transparent" }}>🐾</Text>
            <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>{tr("Sem petshops encontradas")}</Text>
            <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 4, textAlign: "center" }}>{tr("Seja o primeiro a registar uma petshop!")}</Text>
          </View>
        ) : businesses.map((b: any) => (
          <BusinessCard key={b.id} b={b} onPress={() => router.push(`/business/${b.id}` as any)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
