import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Lock, Sparkles, Image as ImageIcon, ArrowRight } from "lucide-react-native";
import { useSubscriptionGate } from "../lib/useSubscriptionGate";
import { tr } from "../lib/i18n";

const MASCOT_LOCK = require("../assets/mascot-lock_1784664046237.png");

const PERKS = [
  "Boletim de vacinas e agenda de consultas",
  "Consulta veterinária online por videochamada",
  "Guias de primeiros socorros, raças e treino",
  "Marketplace de clínicas e produtos",
  "Comunidade e chat com outros donos",
  "QR Code do seu animal para caso se perca",
];

/**
 * Full-screen paywall shown instead of gated tab content when the trial
 * or subscription has expired. The Álbum tab remains accessible elsewhere.
 */
export function PaywallScreen({ featureName }: { featureName?: string }) {
  const router = useRouter();
  const { isTrial } = useSubscriptionGate();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6FF" }} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 16, alignItems: "center" }} showsVerticalScrollIndicator={false}>
        <View style={{
          width: 96, height: 96, borderRadius: 48, backgroundColor: "#FFF0EB",
          alignItems: "center", justifyContent: "center", marginBottom: 16, marginTop: 8,
        }}>
          <Lock size={40} color="#FF6B35" />
        </View>

        <Image source={MASCOT_LOCK} style={{ width: 220, height: 220, marginBottom: 8 }} resizeMode="contain" />

        <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "800", color: "#1A1A2E", textAlign: "center", marginBottom: 8 }}>
          {isTrial ? "O seu período gratuito terminou" : "A sua subscrição expirou"}
        </Text>
        <Text suppressHighlighting style={{ fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 21, marginBottom: 8, paddingHorizontal: 8 }}>
          {featureName
            ? `Para continuar a usar "${featureName}" e todas as outras funcionalidades, escolha um plano.`
            : "Para continuar a usar todas as funcionalidades da PetsLife, escolha um plano."}
        </Text>

        <View style={{
          flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#E6F7F6",
          borderRadius: 14, padding: 12, marginBottom: 24, marginTop: 4,
        }}>
          <ImageIcon size={18} color="#4ECDC4" />
          <Text suppressHighlighting style={{ fontSize: 12, color: "#0F766E", fontWeight: "600", flex: 1 }}>
            O Álbum de fotos continua disponível gratuitamente
          </Text>
        </View>

        <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18, width: "100%", marginBottom: 24, borderWidth: 1.5, borderColor: "#E5E0F5" }}>
          <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "800", color: "#1A1A2E", marginBottom: 12 }}>
            Ao renovar, desbloqueia:
          </Text>
          {PERKS.map((perk, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: i < PERKS.length - 1 ? 10 : 0 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#FFF0EB", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={11} color="#FF6B35" />
              </View>
              <Text suppressHighlighting style={{ fontSize: 13, color: "#374151", flex: 1 }}>{perk}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.push("/subscription" as any)}
          style={{
            flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
            backgroundColor: "#FF6B35", borderRadius: 16, paddingVertical: 16, width: "100%",
          }}
        >
          <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{tr("Ver planos e renovar")}</Text>
          <ArrowRight size={18} color="#fff" />
        </TouchableOpacity>

        <Text suppressHighlighting style={{ fontSize: 11, color: "#B0BAC9", textAlign: "center", marginTop: 14, marginBottom: 20 }}>
          Planos a partir de €3.99/mês · Cancele quando quiser
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
