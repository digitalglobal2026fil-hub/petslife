import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Image, Keyboard } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Search, MapPin, Heart, Plus, X } from "lucide-react-native";
import { api } from "../../lib/api";
import { AnimalFact } from "../../components/AnimalFact";
import { CategoryHeader } from "../../components/CategoryHeader";
import { useState, useCallback } from "react";
import { tr } from "../../lib/i18n";

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
      if (!res.ok) throw new Error(tr("Erro"));
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
        title={tr("Adoção")}
        subtitle={tr("Animais à espera de um lar amoroso")}
        bgColor="#FFF1F2"
        accentColor="#EF4444"
      />

      {/* Botão para publicar um animal para adoção — antes não havia forma
          de o fazer a partir desta página. */}
      <TouchableOpacity
        onPress={() => router.push("/add-listing" as any)}
        activeOpacity={0.85}
        style={{ marginHorizontal: 20, marginBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#EF4444", borderRadius: 16, paddingVertical: 14 }}>
        <Plus size={19} color="#fff" />
        <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
          {tr("Colocar animal para adoção")}
        </Text>
      </TouchableOpacity>

      {/* Pesquisa: filtra à medida que se escreve e tem botão próprio, para
          quem prefere carregar em vez de esperar. */}
      <View style={{ marginHorizontal: 20, marginBottom: 16, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, borderWidth: 1.5, borderColor: "#FEE2E2", paddingHorizontal: 14, height: 46 }}>
          <Search size={18} color="#A0A0B0" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={tr("Pesquisar animais...")}
            placeholderTextColor="#B0B0C0"
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
            style={{ flex: 1, marginLeft: 10, fontSize: 15, color: "#1A1A2E" }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(""); Keyboard.dismiss(); }} style={{ padding: 4 }}>
              <X size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          activeOpacity={0.85}
          style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: "#EF4444", alignItems: "center", justifyContent: "center" }}>
          <Search size={19} color="#fff" />
        </TouchableOpacity>
      </View>

      <AnimalFact />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#EF4444" style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Text style={{ fontSize: 48, backgroundColor: "transparent" }}>🐾</Text>
            <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>{tr("Sem animais para adoção")}</Text>
            <Text suppressHighlighting style={{ fontSize: 14, color: "#6B7280", marginTop: 6, textAlign: "center", paddingHorizontal: 20, lineHeight: 20 }}>
              {search
                ? tr("Não encontrámos nada com essa procura. Tente outra palavra.")
                : tr("Ainda não há animais para adoção. Carregue no botão acima para publicar o primeiro.")}
            </Text>
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
