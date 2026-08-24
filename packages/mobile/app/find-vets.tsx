import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Linking, Alert, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, MapPin, Navigation, Phone, ExternalLink } from "lucide-react-native";
import * as Location from "expo-location";
import { tr } from "../lib/i18n";

// We keep it simple: use geolocation to get coords, then open Google Maps with a nearby vets search
// No paid API needed

interface Coords {
  latitude: number;
  longitude: number;
}

export default function FindVetsScreen() {
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

  function openGoogleMaps(query: string) {
    if (!coords) return;
    const url = Platform.select({
      ios: `maps://?q=${encodeURIComponent(query)}&ll=${coords.latitude},${coords.longitude}&z=14`,
      android: `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.latitude},${coords.longitude},14z`,
      default: `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.latitude},${coords.longitude},14z`,
    });
    Linking.openURL(url!);
  }

  function openGoogleMapsManual(query: string) {
    Linking.openURL(`https://www.google.com/maps/search/${encodeURIComponent(query)}`);
  }

  const SEARCHES = [
    { emoji: "🏥", label: tr("Clínicas Veterinárias"), query: "veterinário clínica veterinária perto de mim" },
    { emoji: "🚑", label: tr("Urgências 24h"), query: "clínica veterinária urgência 24 horas" },
    { emoji: "💊", label: tr("Pet Shops"), query: "pet shop loja animais perto de mim" },
    { emoji: "✂️", label: tr("Grooming / Tosquia"), query: "grooming banho tosquia cão gato perto de mim" },
    { emoji: "🏨", label: tr("Hotéis e Creches"), query: "hotel para cães creche canina perto de mim" },
    { emoji: "🎓", label: tr("Treinadores"), query: "treinador canino adestrador perto de mim" },
    { emoji: "🚶", label: tr("Passeadores e Pet Sitters"), query: "passeador de cães pet sitter perto de mim" },
    { emoji: "🐦", label: tr("Vets de Exóticos"), query: "veterinário animais exóticos aves répteis perto de mim" },
    { emoji: "🐴", label: tr("Vets de Grandes Animais"), query: "veterinário equinos animais de quinta perto de mim" },
    { emoji: "🏡", label: tr("Associações e Canis"), query: "associação animais canil gatil adoção perto de mim" },
    { emoji: "🐟", label: tr("Aquariofilia"), query: "loja aquários peixes aquariofilia perto de mim" },
    { emoji: "🌾", label: tr("Rações e Agro-Lojas"), query: "loja rações agro animais perto de mim" },
    { emoji: "🕊️", label: tr("Serviços Funerários"), query: "crematório animais serviço funerário pet perto de mim" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <View>
          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>{tr("Vets e Outros")}</Text>
          <Text suppressHighlighting style={{ fontSize: 12, color: "#6B7280" }}>{tr("Clínicas, lojas e serviços perto de si")}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 8 }}>
        {/* Location status */}
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

        {/* Search categories */}
        <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginBottom: 12 }}>{tr("Pesquisar perto de si")}</Text>
        <View style={{ gap: 10 }}>
          {SEARCHES.map((s) => (
            <TouchableOpacity key={s.label}
              onPress={() => coords ? openGoogleMaps(s.query) : openGoogleMapsManual(s.query)}
              style={{ backgroundColor: "#fff", borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: "#F0E8E0", flexDirection: "row", alignItems: "center", gap: 14 }}>
              <Text suppressHighlighting style={{ fontSize: 28 }}>{s.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 15 }}>{s.label}</Text>
                <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>{tr("Abrir no Google Maps")}</Text>
              </View>
              <ExternalLink size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency info */}
        <View style={{ backgroundColor: "#FFF0EB", borderRadius: 20, padding: 18, marginTop: 24, borderWidth: 1.5, borderColor: "#FFD5C2" }}>
          <Text suppressHighlighting style={{ fontSize: 15, fontWeight: "700", color: "#FF6B35", marginBottom: 10 }}>{tr("🚨 Urgência Veterinária")}</Text>
          <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 13, lineHeight: 20, marginBottom: 14 }}>
            {tr("Em Portugal, o número de emergência é o")} <Text suppressHighlighting style={{ fontWeight: "700" }}>112</Text>{tr(". Para urgências veterinárias, ligue para a clínica mais próxima ou dirija-se a uma clínica 24h.")}
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL("tel:112")}
            style={{ backgroundColor: "#FF6B35", borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Phone size={18} color="#fff" />
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>{tr("Ligar 112")}</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={{ backgroundColor: "#E8FAF9", borderRadius: 20, padding: 18, marginTop: 16, marginBottom: 24 }}>
          <Text suppressHighlighting style={{ fontSize: 14, fontWeight: "700", color: "#1A1A2E", marginBottom: 8 }}>{tr("💡 Dicas úteis")}</Text>
          {[
            tr("Guarde o contacto do seu veterinário nos favoritos"),
            tr("Procure clínicas 24h perto de casa com antecedência"),
            tr("Mantenha o cartão de vacinação sempre atualizado"),
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
