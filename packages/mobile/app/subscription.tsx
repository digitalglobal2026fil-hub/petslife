import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CheckCircle, ArrowLeft, Star, PawPrint } from "lucide-react-native";

const MONTHLY_LINK = "https://buy.stripe.com/cNi3cugz46Xs2pQ1Oo4sE02";
const ANNUAL_LINK = "https://buy.stripe.com/eVq4gyfv081w3tU9gQ4sE03";

const features = [
  "Animais ilimitados",
  "QR Code anti-perda",
  "Boletim digital de vacinas",
  "Álbum de fotos ilimitado",
  "Comunidade de donos",
  "Marketplace",
  "Lembretes inteligentes",
  "Suporte prioritário",
];

export default function SubscriptionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={18} color="#1A1A2E" />
          </TouchableOpacity>
          <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "800", color: "#1A1A2E" }}>Planos PetsLife</Text>
        </View>

        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <View style={{ backgroundColor: "#F5EDE4", borderRadius: 28, padding: 14, alignSelf: "center", marginBottom: 4 }}>
            <PawPrint size={44} color="#8B5E3C" />
          </View>
          <Text suppressHighlighting style={{ fontSize: 24, fontWeight: "800", color: "#1A1A2E", marginTop: 8 }}>Cuide do seu animal</Text>
          <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 4, textAlign: "center", paddingHorizontal: 40 }}>Acesso completo a todas as funcionalidades. Cancele quando quiser.</Text>
        </View>

        {/* Features */}
        <View style={{ marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
          {features.map((f) => (
            <View key={f} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <CheckCircle size={18} color="#06D6A0" />
              <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 14, fontWeight: "500" }}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={{ paddingHorizontal: 20, gap: 12, paddingBottom: 30 }}>
          {/* Annual - highlighted */}
          <TouchableOpacity onPress={() => Linking.openURL(ANNUAL_LINK)}
            style={{ backgroundColor: "#FF6B35", borderRadius: 24, padding: 20, overflow: "hidden" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Anual</Text>
              <View style={{ backgroundColor: "#FFE66D", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Star size={12} color="#1A1A2E" fill="#1A1A2E" />
                <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 11, fontWeight: "700" }}>MELHOR VALOR</Text>
              </View>
            </View>
            <Text suppressHighlighting style={{ color: "#fff", fontSize: 36, fontWeight: "800" }}>€19.99<Text suppressHighlighting style={{ fontSize: 16, fontWeight: "400", opacity: 0.8 }}>/ano</Text></Text>
            <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 }}>€1.67/mês • Poupa 58%!</Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 14, alignItems: "center", marginTop: 16 }}>
              <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "800", fontSize: 15 }}>Começar 3 dias grátis</Text>
            </View>
          </TouchableOpacity>

          {/* Monthly */}
          <TouchableOpacity onPress={() => Linking.openURL(MONTHLY_LINK)}
            style={{ backgroundColor: "#fff", borderRadius: 24, padding: 20, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
            <Text suppressHighlighting style={{ color: "#1A1A2E", fontWeight: "700", fontSize: 16, marginBottom: 4 }}>Mensal</Text>
            <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 32, fontWeight: "800" }}>€3.99<Text suppressHighlighting style={{ fontSize: 16, fontWeight: "400", color: "#6B7280" }}>/mês</Text></Text>
            <View style={{ backgroundColor: "#FF6B35", borderRadius: 16, padding: 14, alignItems: "center", marginTop: 16 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Começar 3 dias grátis</Text>
            </View>
          </TouchableOpacity>

          <Text suppressHighlighting style={{ textAlign: "center", color: "#9CA3AF", fontSize: 12, marginTop: 4 }}>Cancele quando quiser. Sem compromisso.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
