import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CheckCircle, ArrowLeft, Star } from "lucide-react-native";
import { tr } from "../lib/i18n";
import { api } from "../lib/api";
import {
  SKU_MONTHLY,
  SKU_ANNUAL,
  fetchPlans,
  buy,
  onPurchase,
  finish,
  isBillingAvailable,
  type StorePlan,
} from "../lib/billing";

const MASCOT_HAPPY = require("../assets/mascot-happy_1784664046237.png");

// Preços de reserva: aparecem enquanto a loja não responde (ou se a loja
// não estiver disponível). Os preços reais vêm sempre do Google Play.
const FALLBACK_ANNUAL = "€19.99";
const FALLBACK_MONTHLY = "€3.99";

const features = [
  "Animais ilimitados",
  "QR Code anti-perda",
  "Boletim digital de vacinas",
  "Álbum de fotos ilimitado",
  "Comunidade de donos",
  tr("Marketplace"),
  "Lembretes inteligentes",
  "Suporte prioritário",
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [plans, setPlans] = useState<StorePlan[]>([]);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const annual = plans.find((p) => p.sku === SKU_ANNUAL);
  const monthly = plans.find((p) => p.sku === SKU_MONTHLY);

  useEffect(() => {
    let alive = true;
    fetchPlans()
      .then((p) => {
        if (alive) setPlans(p);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Confirmação da compra: a Google avisa por evento, não na resposta do botão.
  useEffect(() => {
    const stop = onPurchase(
      async (p) => {
        try {
          const plan = p.productId === SKU_ANNUAL ? "annual" : "monthly";
          await (api as any)["subscriptions"]["google-verify"].$post({
            json: {
              plan,
              productId: p.productId,
              purchaseToken: p.purchaseToken,
              packageName: p.packageName,
            },
          });
          await finish(p, false);
          setBusy(false);
          busyRef.current = false;
          Alert.alert(tr("Subscrição activa"), tr("Obrigado! Já tem acesso completo ao PetsLife."), [
            { text: "OK", onPress: () => router.back() },
          ]);
        } catch {
          setBusy(false);
          busyRef.current = false;
          Alert.alert(
            tr("Pagamento recebido"),
            tr("O pagamento foi aceite mas não conseguimos confirmar agora. Abra a app outra vez dentro de alguns minutos.")
          );
        }
      },
      (msg) => {
        setBusy(false);
        busyRef.current = false;
        if (msg) Alert.alert(tr("Não foi possível concluir"), msg);
      }
    );
    return stop;
  }, [router]);

  async function subscribe(sku: string, offerToken: string | null) {
    if (busyRef.current) return;
    if (!isBillingAvailable()) {
      Alert.alert(
        tr("Pagamentos indisponíveis"),
        tr("Instale a app pela Google Play para poder subscrever.")
      );
      return;
    }
    busyRef.current = true;
    setBusy(true);
    const ok = await buy(sku, offerToken);
    if (!ok) {
      busyRef.current = false;
      setBusy(false);
      Alert.alert(
        tr("Pagamentos indisponíveis"),
        tr("Não foi possível abrir o pagamento da Google Play. Tente outra vez dentro de alguns minutos.")
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={18} color="#1A1A2E" />
          </TouchableOpacity>
          <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "800", color: "#1A1A2E" }}>{tr("Planos PetsLife")}</Text>
        </View>

        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Image source={MASCOT_HAPPY} style={{ width: 160, height: 160 }} resizeMode="contain" />
          <Text suppressHighlighting style={{ fontSize: 24, fontWeight: "800", color: "#1A1A2E", marginTop: 8 }}>{tr("Cuide do seu animal")}</Text>
          <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 4, textAlign: "center", paddingHorizontal: 40 }}>{tr("Acesso completo a todas as funcionalidades. Cancele quando quiser.")}</Text>
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
          <TouchableOpacity disabled={busy} onPress={() => subscribe(SKU_ANNUAL, annual?.offerToken ?? null)}
            style={{ backgroundColor: "#FF6B35", borderRadius: 24, padding: 20, overflow: "hidden", opacity: busy ? 0.7 : 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>{tr("Anual")}</Text>
              <View style={{ backgroundColor: "#FFE66D", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Star size={12} color="#1A1A2E" fill="#1A1A2E" />
                <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 11, fontWeight: "700" }}>{tr("MELHOR VALOR")}</Text>
              </View>
            </View>
            <Text suppressHighlighting style={{ color: "#fff", fontSize: 36, fontWeight: "800" }}>{annual?.price || FALLBACK_ANNUAL}<Text suppressHighlighting style={{ fontSize: 16, fontWeight: "400", opacity: 0.8 }}>{tr("/ano")}</Text></Text>
            <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 }}>{tr("€1.67/mês • Poupa 58%!")}</Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 14, alignItems: "center", marginTop: 16 }}>
              {busy ? <ActivityIndicator color="#FF6B35" /> : <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "800", fontSize: 15 }}>{tr("Começar 3 dias grátis")}</Text>}
            </View>
          </TouchableOpacity>

          {/* Monthly */}
          <TouchableOpacity disabled={busy} onPress={() => subscribe(SKU_MONTHLY, monthly?.offerToken ?? null)}
            style={{ backgroundColor: "#fff", borderRadius: 24, padding: 20, borderWidth: 1.5, borderColor: "#F0E8E0", opacity: busy ? 0.7 : 1 }}>
            <Text suppressHighlighting style={{ color: "#1A1A2E", fontWeight: "700", fontSize: 16, marginBottom: 4 }}>{tr("Mensal")}</Text>
            <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 32, fontWeight: "800" }}>{monthly?.price || FALLBACK_MONTHLY}<Text suppressHighlighting style={{ fontSize: 16, fontWeight: "400", color: "#6B7280" }}>{tr("/mês")}</Text></Text>
            <View style={{ backgroundColor: "#FF6B35", borderRadius: 16, padding: 14, alignItems: "center", marginTop: 16 }}>
              {busy ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{tr("Começar 3 dias grátis")}</Text>}
            </View>
          </TouchableOpacity>

          <Text suppressHighlighting style={{ textAlign: "center", color: "#9CA3AF", fontSize: 12, marginTop: 4 }}>{tr("Cancele quando quiser. Sem compromisso.")}</Text>
          <Text suppressHighlighting style={{ textAlign: "center", color: "#9CA3AF", fontSize: 11, marginTop: 2 }}>{tr("Pagamento processado pela Google Play. Pode cancelar na Play Store a qualquer momento.")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
