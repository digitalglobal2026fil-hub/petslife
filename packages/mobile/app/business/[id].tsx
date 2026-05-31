import { View, Text, ScrollView, TouchableOpacity, Linking, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Phone, Globe, MapPin, Clock, Star, MessageSquare } from "lucide-react-native";
import { useState } from "react";
import { api } from "../../lib/api";

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showReview, setShowReview] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["business", id],
    queryFn: async () => (await (api as any).businesses[":id"].$get({ param: { id } })).json(),
  });

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: async () => (await (api as any).businesses[":id"].reviews.$post({ param: { id }, json: { rating, comment } })).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", id] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      setComment(""); setShowReview(false);
      Alert.alert("✅ Avaliação enviada!", "Obrigado pelo teu feedback.");
    },
  });

  const b = (data as any)?.business;
  const reviews = (data as any)?.reviews ?? [];

  if (isLoading) return <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5", alignItems: "center", justifyContent: "center" }}><ActivityIndicator color="#8B5E3C" /></SafeAreaView>;
  if (!b) return null;

  let services: any[] = [];
  if (b.services) {
    try { services = JSON.parse(b.services); } catch { /* plain text */ }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ChevronLeft size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E", flex: 1 }} numberOfLines={1}>{b.name}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Header card */}
        <View style={{ backgroundColor: "#8B5E3C", borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>{b.name}</Text>
          <Text style={{ color: "#F5D5BA", fontSize: 13, marginTop: 4, textTransform: "capitalize" }}>{b.type}</Text>
          {b.averageRating > 0 && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={16} color={s <= Math.round(b.averageRating) ? "#FFD700" : "#6B4423"} fill={s <= Math.round(b.averageRating) ? "#FFD700" : "none"} />)}
              <Text style={{ color: "#fff", fontWeight: "700", marginLeft: 4 }}>{b.averageRating.toFixed(1)} ({b.reviewsCount})</Text>
            </View>
          )}
          {b.description && <Text style={{ color: "#F5D5BA", marginTop: 10, fontSize: 14, lineHeight: 20 }}>{b.description}</Text>}
        </View>

        {/* Contactos */}
        <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
          <Text style={{ fontWeight: "700", fontSize: 15, color: "#1A1A2E", marginBottom: 12 }}>Contactos</Text>
          {b.address && <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}><MapPin size={16} color="#8B5E3C" /><Text style={{ color: "#374151", fontSize: 14, flex: 1 }}>{b.address}{b.city ? `, ${b.city}` : ""}</Text></View>}
          {b.schedule && <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}><Clock size={16} color="#8B5E3C" /><Text style={{ color: "#374151", fontSize: 14, flex: 1 }}>{b.schedule}</Text></View>}

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {b.phone && (
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${b.phone}`)}
                style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F0FFF4", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
                <Phone size={15} color="#22C55E" />
                <Text style={{ color: "#22C55E", fontWeight: "700" }}>Ligar</Text>
              </TouchableOpacity>
            )}
            {b.website && (
              <TouchableOpacity onPress={() => Linking.openURL(b.website)}
                style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EFF6FF", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
                <Globe size={15} color="#3B82F6" />
                <Text style={{ color: "#3B82F6", fontWeight: "700" }}>Website</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Marcar Consulta */}
        {(b.bookingUrl || b.bookingPhone) && (
          <TouchableOpacity onPress={() => b.bookingUrl ? Linking.openURL(b.bookingUrl) : Linking.openURL(`tel:${b.bookingPhone}`)}
            style={{ backgroundColor: "#8B5E3C", borderRadius: 16, padding: 16, alignItems: "center", marginBottom: 16 }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>📅 Marcar Consulta</Text>
          </TouchableOpacity>
        )}

        {/* Serviços */}
        {(services.length > 0 || b.services) && (
          <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
            <Text style={{ fontWeight: "700", fontSize: 15, color: "#1A1A2E", marginBottom: 12 }}>Serviços</Text>
            {services.length > 0 ? services.map((s: any, i: number) => (
              <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: i < services.length - 1 ? 1 : 0, borderColor: "#F0E8E0" }}>
                <Text style={{ color: "#374151", fontSize: 14 }}>{s.name || s}</Text>
                {s.price && <Text style={{ color: "#8B5E3C", fontWeight: "700", fontSize: 14 }}>€{s.price}</Text>}
              </View>
            )) : (
              <Text style={{ color: "#6B7280", fontSize: 14, lineHeight: 20 }}>{b.services}</Text>
            )}
          </View>
        )}

        {/* Reviews */}
        <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontWeight: "700", fontSize: 15, color: "#1A1A2E" }}>Avaliações ({reviews.length})</Text>
            <TouchableOpacity onPress={() => setShowReview(!showReview)}
              style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFF0EB", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
              <MessageSquare size={14} color="#8B5E3C" />
              <Text style={{ color: "#8B5E3C", fontWeight: "600", fontSize: 13 }}>Avaliar</Text>
            </TouchableOpacity>
          </View>

          {showReview && (
            <View style={{ backgroundColor: "#FFF9F5", borderRadius: 14, padding: 14, marginBottom: 12 }}>
              <Text style={{ fontWeight: "600", color: "#374151", marginBottom: 8 }}>A tua avaliação</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                {[1,2,3,4,5].map(s => (
                  <TouchableOpacity key={s} onPress={() => setRating(s)}>
                    <Star size={28} color={s <= rating ? "#FFD700" : "#D1D5DB"} fill={s <= rating ? "#FFD700" : "none"} />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput value={comment} onChangeText={setComment} placeholder="Escreve um comentário..." placeholderTextColor="#9CA3AF" multiline
                style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: "#F0E8E0", color: "#1A1A2E", minHeight: 70 }} />
              <TouchableOpacity onPress={() => submitReview()} disabled={isPending}
                style={{ backgroundColor: "#8B5E3C", borderRadius: 12, padding: 12, alignItems: "center", marginTop: 10 }}>
                {isPending ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700" }}>Enviar Avaliação</Text>}
              </TouchableOpacity>
            </View>
          )}

          {reviews.length === 0 ? (
            <Text style={{ color: "#9CA3AF", textAlign: "center", paddingVertical: 12 }}>Ainda sem avaliações. Sê o primeiro!</Text>
          ) : (
            reviews.map((r: any) => (
              <View key={r.id} style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: "#F0E8E0" }}>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} color={s <= r.rating ? "#FFD700" : "#D1D5DB"} fill={s <= r.rating ? "#FFD700" : "none"} />)}
                </View>
                {r.comment && <Text style={{ color: "#374151", fontSize: 13, marginTop: 4 }}>{r.comment}</Text>}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
