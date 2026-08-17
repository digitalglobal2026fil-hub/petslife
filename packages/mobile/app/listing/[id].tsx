import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, MapPin, Phone, Tag, PawPrint, Trash2 } from "lucide-react-native";
import { api } from "../../lib/api";
import { tr } from "../../lib/i18n";

const catEmoji: Record<string, string> = {
  adoption: "🏠", products: "🛍️", services: "✂️", lost: "🔎",
};

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const res = await api.marketplace[":id"].$get({ param: { id } });
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  const l = (data as any)?.listing;

  if (isLoading) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5", alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color="#FF6B35" />
    </SafeAreaView>
  );
  if (!l) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#1A1A2E", flex: 1 }} numberOfLines={1}>{l.title}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={{ height: 180, backgroundColor: "#FFF0EB", borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Text suppressHighlighting style={{ fontSize: 60 }}>{catEmoji[l.category] ?? "🐾"}</Text>
        </View>

        {/* Price + category */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Text suppressHighlighting style={{ fontSize: 28, fontWeight: "800", color: "#FF6B35" }}>
            {l.price === 0 ? "Grátis" : `€${Number(l.price).toFixed(2)}`}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FFF0EB", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
            <Tag size={14} color="#8B5E3C" />
            <Text suppressHighlighting style={{ color: "#8B5E3C", fontWeight: "700", fontSize: 13, textTransform: "capitalize" }}>{l.category}</Text>
          </View>
        </View>

        {/* Description */}
        {l.description ? (
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
            <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", marginBottom: 8 }}>{tr("Descrição")}</Text>
            <Text suppressHighlighting style={{ color: "#374151", lineHeight: 22, fontSize: 14 }}>{l.description}</Text>
          </View>
        ) : null}

        {/* Location */}
        {l.location ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 16, padding: 14, marginBottom: 14, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
            <MapPin size={16} color="#FF6B35" />
            <Text suppressHighlighting style={{ color: "#374151", fontSize: 14 }}>{l.location}</Text>
          </View>
        ) : null}

        {/* Contact */}
        {l.contact ? (
          <TouchableOpacity
            onPress={() => {
              const c = l.contact;
              if (c.includes("@")) Linking.openURL(`mailto:${c}`);
              else Linking.openURL(`tel:${c}`);
            }}
            style={{ flexDirection: "row", gap: 10, backgroundColor: "#FF6B35", borderRadius: 16, padding: 16, alignItems: "center", justifyContent: "center" }}>
            <Phone size={18} color="#fff" />
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Contactar: {l.contact}</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ backgroundColor: "#F0E8E0", borderRadius: 16, padding: 16, alignItems: "center" }}>
            <Text suppressHighlighting style={{ color: "#6B7280" }}>{tr("Sem contacto disponível")}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
