import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Search, Plus, Phone, Globe, MapPin, Star, Stethoscope, Store, Scissors, Home, Dumbbell } from "lucide-react-native";
import { useState, useCallback } from "react";
import { api } from "../../lib/api";
import { useSubscriptionGate } from "../../lib/useSubscriptionGate";
import { PaywallScreen } from "../../components/PaywallScreen";

const categories = ["Todos", "Clínica", "Petshop", "Tosquiador", "Hotel", "Treino", "Outro"];

const typeIcon = (type: string) => {
  switch (type) {
    case "clinica": return <Stethoscope size={20} color="#8B5E3C" />;
    case "petshop": return <Store size={20} color="#8B5E3C" />;
    case "tosquiador": return <Scissors size={20} color="#8B5E3C" />;
    case "hotel": return <Home size={20} color="#8B5E3C" />;
    case "treino": return <Dumbbell size={20} color="#8B5E3C" />;
    default: return <Store size={20} color="#8B5E3C" />;
  }
};

function SearchInput({ onSearch }: { onSearch: (v: string) => void }) {
  return (
    <View style={{ marginHorizontal: 20, marginBottom: 12, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
      <Search size={18} color="#9CA3AF" />
      <TextInput
        onChangeText={onSearch}
        placeholder="Pesquisar negócios..."
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        autoCapitalize="none"
        style={{ flex: 1, padding: 12, fontSize: 14, color: "#1A1A2E" }}
      />
    </View>
  );
}

export default function BusinessesScreen() {
  const router = useRouter();
  const { isLoading: gateLoading, isBlocked } = useSubscriptionGate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const handleSearch = useCallback((v: string) => setSearch(v), []);

  const { data, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => (await (api as any).businesses.$get()).json(),
  });

  const businesses = ((data as any)?.businesses ?? []).filter((b: any) => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || (b.city && b.city.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === "Todos" || b.type === category.toLowerCase();
    return matchSearch && matchCat;
  });

  if (!gateLoading && isBlocked) {
    return <PaywallScreen featureName="Negócios" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF6FA" }} edges={["top", "left", "right"]}>
      <View style={{
        backgroundColor: "#D6699E", padding: 20, paddingTop: 18, paddingBottom: 28,
        borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 16,
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      }}>
        <View style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.12)" }} />
        <Text suppressHighlighting style={{ fontSize: 26, fontWeight: "800", color: "#fff" }}>Negócios</Text>
        <TouchableOpacity onPress={() => router.push("/add-business")}
          style={{ backgroundColor: "rgba(255,255,255,0.25)", width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <SearchInput onSearch={handleSearch} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginBottom: 16 }}>
        {categories.map((c) => (
          <TouchableOpacity key={c} onPress={() => setCategory(c)}
            style={{ backgroundColor: category === c ? "#8B5E3C" : "#fff", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: category === c ? "#8B5E3C" : "#F0E8E0" }}>
            <Text suppressHighlighting style={{ color: category === c ? "#fff" : "#6B7280", fontWeight: "600", fontSize: 13 }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}>
        {isLoading ? <ActivityIndicator color="#8B5E3C" style={{ marginTop: 40 }} /> :
          businesses.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Text suppressHighlighting style={{ fontSize: 48 }}>🏪</Text>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>Sem negócios ainda</Text>
              <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 4, textAlign: "center" }}>Regista a tua clínica ou petshop!</Text>
              <TouchableOpacity onPress={() => router.push("/add-business")}
                style={{ backgroundColor: "#8B5E3C", borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700" }}>+ Registar Negócio</Text>
              </TouchableOpacity>
            </View>
          ) : (
            businesses.map((b: any) => (
              <TouchableOpacity key={b.id} onPress={() => router.push(`/business/${b.id}`)}
                style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View style={{ backgroundColor: "#FFF0EB", borderRadius: 14, padding: 12 }}>
                    {typeIcon(b.type)}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text suppressHighlighting style={{ fontWeight: "700", fontSize: 15, color: "#1A1A2E" }}>{b.name}</Text>
                    <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 2, textTransform: "capitalize" }}>{b.type}</Text>
                    {b.city && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                        <MapPin size={11} color="#9CA3AF" />
                        <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 11 }}>{b.city}</Text>
                      </View>
                    )}
                  </View>
                  {b.averageRating > 0 && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFF8F0", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 }}>
                      <Star size={12} color="#FF6B35" fill="#FF6B35" />
                      <Text suppressHighlighting style={{ fontWeight: "700", fontSize: 12, color: "#FF6B35" }}>{b.averageRating.toFixed(1)}</Text>
                    </View>
                  )}
                </View>
                {b.description && (
                  <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 13, marginTop: 8 }} numberOfLines={2}>{b.description}</Text>
                )}
                <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                  {b.phone && (
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${b.phone}`)}
                      style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F0FFF4", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
                      <Phone size={14} color="#22C55E" />
                      <Text suppressHighlighting style={{ color: "#22C55E", fontWeight: "600", fontSize: 13 }}>Ligar</Text>
                    </TouchableOpacity>
                  )}
                  {b.website && (
                    <TouchableOpacity onPress={() => Linking.openURL(b.website)}
                      style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EFF6FF", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
                      <Globe size={14} color="#3B82F6" />
                      <Text suppressHighlighting style={{ color: "#3B82F6", fontWeight: "600", fontSize: 13 }}>Website</Text>
                    </TouchableOpacity>
                  )}
                  {(b.bookingUrl || b.bookingPhone) && (
                    <TouchableOpacity onPress={() => b.bookingUrl ? Linking.openURL(b.bookingUrl) : Linking.openURL(`tel:${b.bookingPhone}`)}
                      style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#8B5E3C", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
                      <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Marcar Consulta</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
      </ScrollView>
    </SafeAreaView>
  );
}
