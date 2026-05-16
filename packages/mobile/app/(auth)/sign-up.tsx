import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { authClient, captureToken } from "../../lib/auth";
import { PawPrint } from "lucide-react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!name || !email || !password) return Alert.alert("Erro", "Preencha todos os campos.");
    if (password.length < 8) return Alert.alert("Erro", "A password deve ter pelo menos 8 caracteres.");
    setLoading(true);
    try {
      const res = await authClient.signUp.email({ name, email, password }, { onSuccess: captureToken });
      if (res.error) throw new Error(res.error.message);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Erro", e.message ?? "Não foi possível criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View style={{ backgroundColor: "#F5EDE4", borderRadius: 28, padding: 16 }}>
              <PawPrint size={48} color="#8B5E3C" />
            </View>
            <Text suppressHighlighting style={{ fontSize: 28, fontWeight: "800", color: "#FF6B35", marginTop: 8, backgroundColor: "transparent" }}>
              Criar conta
            </Text>
            <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 4, fontSize: 14, textAlign: "center", backgroundColor: "transparent" }}>
              3 dias grátis, sem cartão. Cancele quando quiser.
            </Text>
          </View>

          <View style={{ gap: 14 }}>
            <View>
              <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>Nome</Text>
              <TextInput
                value={name} onChangeText={setName} placeholder="O seu nome"
                style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 16, padding: 14, fontSize: 15, color: "#1A1A2E" }}
              />
            </View>
            <View>
              <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>Email</Text>
              <TextInput
                value={email} onChangeText={setEmail} placeholder="o.seu@email.com"
                keyboardType="email-address" autoCapitalize="none"
                style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 16, padding: 14, fontSize: 15, color: "#1A1A2E" }}
              />
            </View>
            <View>
              <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>Password</Text>
              <TextInput
                value={password} onChangeText={setPassword} placeholder="Mínimo 8 caracteres"
                secureTextEntry
                style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 16, padding: 14, fontSize: 15, color: "#1A1A2E" }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.85}
              style={{ backgroundColor: "#FF6B35", borderRadius: 16, padding: 16, alignItems: "center", marginTop: 8, opacity: loading ? 0.7 : 1 }}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 16, backgroundColor: "transparent" }}>Criar conta grátis</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={{ alignItems: "center", marginTop: 4, paddingVertical: 8 }}
            >
              <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 14, backgroundColor: "transparent" }}>
                Já tem conta?{" "}
                <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "700", backgroundColor: "transparent" }}>
                  Entrar
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
