import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Gift, ArrowLeft, CheckCircle, BadgePercent, Infinity as InfinityIcon, CalendarCheck } from "lucide-react-native";
import { api, BASE_URL } from "../lib/api";
import { AnimatedPet } from "../components/AnimatedPet";
import { netError } from "../lib/net-error";
import { authFetch } from "../lib/auth-fetch";
import { tr } from "../lib/i18n";

const BENEFIT_INFO: Record<string, { title: string; desc: string; icon: any; color: string }> = {
  lifetime: { title: tr("Acesso vitalício"), desc: tr("Acesso completo para sempre. Nunca pagas nada."), icon: InfinityIcon, color: "#8B5CF6" },
  year1: { title: tr("1 ano grátis"), desc: tr("Acesso completo durante 12 meses, sem pagar."), icon: CalendarCheck, color: "#10B981" },
  months3: { title: tr("3 meses grátis"), desc: tr("Acesso completo durante 3 meses, sem pagar."), icon: CalendarCheck, color: "#06B6D4" },
  discount: { title: tr("Desconto especial"), desc: tr("Preço reduzido na tua subscrição."), icon: BadgePercent, color: "#FF6B35" },
  none: { title: tr("Código de parceiro"), desc: tr("Código registado com sucesso."), icon: Gift, color: "#FF6B35" },
};

export default function PromoCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [success, setSuccess] = useState<{ benefit: string; message: string } | null>(null);

  async function getToken(): Promise<string> {
    try {
      if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem("bearer_token") : null) ?? "";
      const SecureStore = require("expo-secure-store");
      return SecureStore.getItem("bearer_token") ?? "";
    } catch { return ""; }
  }

  // Mostra o que o código dá, antes de resgatar
  async function check() {
    const c = code.trim().toUpperCase();
    if (!c) return;
    setChecking(true);
    setPreview(null);
    try {
      const res = await authFetch(`${BASE_URL}/api/partners/check/${encodeURIComponent(c)}`);
      const data = await res.json();
      if (data.valid) setPreview(data);
      else Alert.alert(tr("Código inválido"), data.error || tr("Este código não existe."));
    } catch (e: any) {
      Alert.alert(tr("Sem ligação"), netError(e));
    } finally {
      setChecking(false);
    }
  }

  async function redeem() {
    const c = code.trim().toUpperCase();
    if (!c) {
      Alert.alert(tr("Atenção"), tr("Introduz um código primeiro."));
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const res = await authFetch(`${BASE_URL}/api/partners/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: c }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        Alert.alert(tr("Erro"), data.error || tr("Não foi possível aplicar o código."));
      } else {
        setSuccess({ benefit: data.benefit, message: data.message });
      }
    } catch (e: any) {
      Alert.alert(tr("Sem ligação"), netError(e));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    const info = BENEFIT_INFO[success.benefit] ?? BENEFIT_INFO.none;
    return (
      <View style={styles.successContainer}>
        <AnimatedPet species="dog" size={130} />
        <CheckCircle size={44} color={info.color} style={{ marginTop: 8 }} />
        <Text suppressHighlighting style={styles.successTitle}>{info.title}</Text>
        <Text suppressHighlighting style={styles.successText}>{success.message}</Text>
        <TouchableOpacity style={[styles.btn, { backgroundColor: info.color }]} onPress={() => router.replace("/(tabs)")}>
          <Text suppressHighlighting style={styles.btnText}>{tr("Ir para a app")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#FF6B35" />
        </TouchableOpacity>

        <AnimatedPet species="cat" size={110} />

        <Text suppressHighlighting style={styles.title}>{tr("Código de Parceiro")}</Text>
        <Text suppressHighlighting style={styles.subtitle}>
          Recebeste um código de um parceiro ou influencer? Introduz aqui para activar o teu benefício.
        </Text>

        <TextInput
          style={styles.input}
          placeholder={tr("Ex: JOAO10")}
          placeholderTextColor="#9CA3AF"
          value={code}
          onChangeText={t => { setCode(t.toUpperCase()); setPreview(null); }}
          onBlur={check}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        {checking && <ActivityIndicator color="#FF6B35" style={{ marginBottom: 14 }} />}

        {preview && (() => {
          const info = BENEFIT_INFO[preview.benefit] ?? BENEFIT_INFO.none;
          return (
            <View style={[styles.previewCard, { borderColor: info.color + "44", backgroundColor: info.color + "0D" }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <info.icon size={22} color={info.color} />
                <Text suppressHighlighting style={{ fontWeight: "800", color: info.color, fontSize: 15 }}>{info.title}</Text>
              </View>
              <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 13, marginTop: 6, lineHeight: 19 }}>{info.desc}</Text>
              {preview.partnerName && (
                <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 12, marginTop: 8 }}>
                  Código de {preview.partnerName}
                </Text>
              )}
            </View>
          );
        })()}

        <TouchableOpacity style={styles.btn} onPress={redeem} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text suppressHighlighting style={styles.btnText}>{tr("Activar código")}</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28, paddingTop: 80, paddingBottom: 40, alignItems: "center", flexGrow: 1,
  },
  back: { position: "absolute", top: 52, left: 20, padding: 8, zIndex: 5 },
  title: { fontSize: 25, fontWeight: "800", color: "#1F2937", marginTop: 10, marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 14.5, color: "#6B7280", textAlign: "center", lineHeight: 21, marginBottom: 28 },
  input: {
    width: "100%", borderWidth: 2, borderColor: "#FF6B35",
    borderRadius: 14, padding: 16, fontSize: 20, fontWeight: "800",
    color: "#1F2937", textAlign: "center", letterSpacing: 3, marginBottom: 18,
  },
  previewCard: { width: "100%", borderWidth: 1.5, borderRadius: 16, padding: 16, marginBottom: 18 },
  btn: {
    width: "100%", backgroundColor: "#FF6B35",
    borderRadius: 14, padding: 16, alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  successContainer: {
    flex: 1, backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center", paddingHorizontal: 32,
  },
  successTitle: { fontSize: 26, fontWeight: "800", color: "#1F2937", marginTop: 16, marginBottom: 12, textAlign: "center" },
  successText: { fontSize: 15.5, color: "#6B7280", textAlign: "center", lineHeight: 23, marginBottom: 34 },
});
