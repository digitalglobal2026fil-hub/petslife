import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { baseURL } from "../../lib/auth";

const BG = "#F5ECD7";
const BROWN = "#6B3A2A";
const ORANGE = "#E07A3A";
const CARD = "#FFFFFF";
const BORDER = "#E8D5B7";
const GRAY = "#A08060";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email) return Alert.alert("Erro", "Introduz o teu email.");
    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/api/auth/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Origin": baseURL },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          redirectTo: `${baseURL}/reset-password`,
        }),
      });
      // Sempre mostra sucesso (segurança — não revelamos se o email existe)
      setSent(true);
    } catch (e: any) {
      Alert.alert("Erro", "Sem ligação ao servidor. Verifica o teu WiFi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24, paddingBottom: Math.max(insets.bottom, 24) }} keyboardShouldPersistTaps="handled">

          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <View style={{ backgroundColor: BROWN, borderRadius: 36, width: 90, height: 90, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Text suppressHighlighting style={{ fontSize: 48 }}>🔑</Text>
            </View>
            <Text suppressHighlighting style={{ fontSize: 28, fontWeight: "900", color: BROWN }}>Recuperar password</Text>
            <Text suppressHighlighting style={{ color: GRAY, marginTop: 6, fontSize: 13, textAlign: "center", fontWeight: "600" }}>
              Enviamos um link para o teu email.
            </Text>
          </View>

          {sent ? (
            <View style={{ backgroundColor: "#F0FFF4", borderRadius: 20, padding: 28, borderWidth: 1.5, borderColor: "#9AE6B4", alignItems: "center" }}>
              <Text suppressHighlighting style={{ fontSize: 40, marginBottom: 12 }}>✉️</Text>
              <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "900", color: "#276749", textAlign: "center" }}>Email enviado!</Text>
              <Text suppressHighlighting style={{ color: "#276749", marginTop: 8, fontSize: 13, textAlign: "center", fontWeight: "600" }}>
                Verifica a tua caixa de entrada e segue as instruções para redefinir a tua password.
              </Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}
                style={{ marginTop: 24, backgroundColor: BROWN, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "900", fontSize: 15 }}>Voltar ao login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ backgroundColor: CARD, borderRadius: 28, padding: 24, borderWidth: 1.5, borderColor: BORDER }}>
              <View style={{ gap: 14 }}>
                <View>
                  <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: GRAY, marginBottom: 8 }}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="o.teu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#C4A882"
                    style={{ backgroundColor: BG, borderWidth: 1.5, borderColor: BORDER, borderRadius: 16, padding: 14, fontSize: 15, color: BROWN, fontWeight: "600" }}
                  />
                </View>
                <TouchableOpacity onPress={handleSubmit} disabled={loading}
                  style={{ backgroundColor: BROWN, borderRadius: 18, padding: 18, alignItems: "center", marginTop: 8 }}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>Enviar link</Text>}
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={() => router.back()} style={{ alignItems: "center", marginTop: 20, paddingVertical: 8 }}>
            <Text suppressHighlighting style={{ color: GRAY, fontSize: 14, fontWeight: "600" }}>
              ← <Text suppressHighlighting style={{ color: BROWN, fontWeight: "900" }}>Voltar ao login</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
