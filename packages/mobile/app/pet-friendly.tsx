import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Linking, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Navigation, ExternalLink } from "lucide-react-native";
import * as Location from "expo-location";
import { tr } from "../lib/i18n";

interface Coords {
  latitude: number;
  longitude: number;
}

export default function PetFriendlyScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function getLocation() {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError(tr("Permissão de localização negada. Active nas definições do telemóvel."));
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch (e) {
      setError(tr("Não foi possível obter a sua localização."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLocation();
  }, []);

  function openMaps(query: string) {
    if (!coords) {
      Linking.openURL(`https://www.google.com/maps/search/${encodeURIComponent(query)}`);
      return;
    }
    const url = Platform.select({
      ios: `maps://?q=${encodeURIComponent(query)}&ll=${coords.latitude},${coords.longitude}&z=13`,
      android: `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.latitude},${coords.longitude},13z`,
      default: `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.latitude},${coords.longitude},13z`,
    });
    Linking.openURL(url!);
  }

  const PLACES = [
    { emoji: "☕", label: tr("Cafés e Esplanadas"), desc: tr("Tomar café com ele ao lado"), query: "café esplanada pet friendly aceita cães perto de mim" },
    { emoji: "🍽️", label: tr("Restaurantes"), desc: tr("Almoçar sem o deixar em casa"), query: "restaurante pet friendly aceita cães perto de mim" },
    { emoji: "🏖️", label: tr("Praias para Cães"), desc: tr("Praias onde ele pode entrar"), query: "praia para cães pet friendly perto de mim" },
    { emoji: "🌳", label: tr("Parques Caninos"), desc: tr("Correr à solta e brincar"), query: "parque canino parque para cães perto de mim" },
    { emoji: "🏨", label: tr("Hotéis e Alojamentos"), desc: tr("Dormir fora com ele"), query: "hotel alojamento pet friendly aceita animais perto de mim" },
    { emoji: "⛺", label: tr("Campismo e Caravanismo"), desc: tr("Férias ao ar livre"), query: "parque de campismo pet friendly aceita cães perto de mim" },
    { emoji: "🛍️", label: tr("Lojas e Centros Comerciais"), desc: tr("Onde ele pode entrar consigo"), query: "loja centro comercial pet friendly aceita animais perto de mim" },
    { emoji: "🚕", label: tr("Táxis e Transportes"), desc: tr("Viajar com animais"), query: "táxi transporte de animais pet taxi perto de mim" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>{tr("Pet Friendly")}</Text>
          <Text suppressHighlighting style={{ fontSize: 12, color: "#6B7280" }}>{tr("Locais onde ele é bem-vindo")}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 40 }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: "#F0E8E0", marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: coords ? "#E6FAF5" : "#FFF0EB", alignItems: "center", justifyContent: "center" }}>
            {loading ? <ActivityIndicator color="#FF6B35" size="small" /> : <Navigation size={22} color={coords ? "#06D6A0" : "#FF6B35"} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 14 }}>
              {loading ? tr("A obter localização...") : coords ? tr("Localização obtida ✓") : tr("Localização indisponível")}
            </Text>
            {coords && (
              <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>{coords.latitude.toFixed(4)}°, {coords.longitude.toFixed(4)}°</Text>
            )}
            {error && <Text suppressHighlighting style={{ color: "#FF6B35", fontSize: 12 }}>{error}</Text>}
          </View>
          {!loading && !coords && (
            <TouchableOpacity onPress={getLocation}
              style={{ backgroundColor: "#FF6B35", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>{tr("Tentar")}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginBottom: 12 }}>{tr("Onde pode ir com ele")}</Text>
        <View style={{ gap: 10 }}>
          {PLACES.map((p) => (
            <TouchableOpacity key={p.label} onPress={() => openMaps(p.query)}
              style={{ backgroundColor: "#fff", borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: "#F0E8E0", flexDirection: "row", alignItems: "center", gap: 14 }}>
              <Text suppressHighlighting style={{ fontSize: 28 }}>{p.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 15 }}>{p.label}</Text>
                <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>{p.desc}</Text>
              </View>
              <ExternalLink size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ backgroundColor: "#E8FAF9", borderRadius: 20, padding: 18, marginTop: 20 }}>
          <Text suppressHighlighting style={{ fontSize: 14, fontWeight: "700", color: "#1A1A2E", marginBottom: 8 }}>{tr("💡 Antes de ir")}</Text>
          {[
            tr("Ligue antes a confirmar — as regras mudam com frequência"),
            tr("Leve trela, saquinhos e uma tigela de água"),
            tr("Em esplanadas, escolha uma mesa de canto para ele ficar calmo"),
            tr("Nas praias, verifique se há restrições no verão"),
          ].map((tip, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 8, marginTop: i > 0 ? 6 : 0 }}>
              <Text suppressHighlighting style={{ color: "#4ECDC4", fontWeight: "700" }}>•</Text>
              <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 13, lineHeight: 20, flex: 1 }}>{tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
