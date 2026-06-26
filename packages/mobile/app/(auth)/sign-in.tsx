import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { authClient, captureToken } from "../../lib/auth";
import { Eye, EyeOff, ArrowRight } from "lucide-react-native";

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const pawBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(formAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // Paw bounce loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pawBounce, { toValue: -8, duration: 800, useNativeDriver: true }),
        Animated.timing(pawBounce, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  async function handleSignIn() {
    if (!email || !password) return Alert.alert("Erro", "Preencha todos os campos.");
    setLoading(true);
    try {
      const res = await authClient.signIn.email({ email, password }, { onSuccess: captureToken });
      if (res.error) {
        const msg = res.error.message || res.error.statusText || JSON.stringify(res.error);
        throw new Error(msg);
      }
      router.replace("/(tabs)");
    } catch (e: any) {
      const msg = e.message && e.message !== "undefined" ? e.message : "Email ou password incorretos.";
      Alert.alert("Erro ao entrar", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6FF" }} edges={["top", "left", "right"]}>
      {/* Decorações de fundo */}
      <View style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "#FF6B3515" }} />
      <View style={{ position: "absolute", top: 100, left: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: "#4ECDC415" }} />
      <View style={{ position: "absolute", bottom: 100, right: -30, width: 160, height: 160, borderRadius: 80, backgroundColor: "#8B5CF615" }} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24, paddingBottom: Math.max(insets.bottom, 24) }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo animado */}
          <Animated.View style={{
            alignItems: "center",
            marginBottom: 40,
            opacity: logoAnim,
            transform: [{ translateY: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
          }}>
            <Animated.View style={{
              transform: [{ translateY: pawBounce }],
              backgroundColor: "#FF6B35",
              borderRadius: 36,
              padding: 20,
              shadowColor: "#FF6B35",
              shadowOpacity: 0.35,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 8 },
              elevation: 0,
            }}>
              <Text suppressHighlighting style={{ fontSize: 42 }}>🐾</Text>
            </Animated.View>
            <Text suppressHighlighting style={{ fontSize: 36, fontWeight: "800", color: "#FF6B35", marginTop: 14, letterSpacing: -0.5 }}>
              PetsLife
            </Text>
            <Text suppressHighlighting style={{ color: "#9CA3AF", marginTop: 4, fontSize: 14, fontWeight: "500" }}>
              A vida do seu animal, organizada.
            </Text>
          </Animated.View>

          {/* Formulário */}
          <Animated.View style={{
            opacity: formAnim,
            transform: [{ translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            gap: 16,
          }}>
            {/* Email */}
            <View>
              <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: "#1A1A2E", marginBottom: 8, marginLeft: 4 }}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="o.seu@email.com"
                placeholderTextColor="#C4B5A0"
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 2,
                  borderColor: focusedField === "email" ? "#FF6B35" : "#F0E8E0",
                  borderRadius: 18,
                  padding: 16,
                  fontSize: 15,
                  color: "#1A1A2E",
                  shadowColor: focusedField === "email" ? "#FF6B35" : "transparent",
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                  elevation: 0,
                }}
              />
            </View>

            {/* Password */}
            <View>
              <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: "#1A1A2E", marginBottom: 8, marginLeft: 4 }}>Password</Text>
              <View style={{
                backgroundColor: "#fff",
                borderWidth: 2,
                borderColor: focusedField === "password" ? "#FF6B35" : "#F0E8E0",
                borderRadius: 18,
                flexDirection: "row",
                alignItems: "center",
              }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#C4B5A0"
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  style={{ flex: 1, padding: 16, fontSize: 15, color: "#1A1A2E" }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 16 }}>
                  {showPassword ? <EyeOff size={20} color="#C4B5A0" /> : <Eye size={20} color="#C4B5A0" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Esqueceu */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              activeOpacity={0.7}
              style={{ alignItems: "flex-end" }}
            >
              <Text suppressHighlighting style={{ color: "#FF6B35", fontSize: 13, fontWeight: "700" }}>
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>

            {/* Botão entrar */}
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.88}
              style={{
                backgroundColor: "#FF6B35",
                borderRadius: 20,
                padding: 18,
                alignItems: "center",
                marginTop: 4,
                opacity: loading ? 0.7 : 1,
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
                shadowColor: "#FF6B35",
                shadowOpacity: 0.4,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 6 },
                elevation: 0,
              }}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <>
                  <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Entrar</Text>
                  <ArrowRight size={18} color="#fff" />
                </>
              }
            </TouchableOpacity>

            {/* Divisor */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 4 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: "#F0E8E0" }} />
              <Text suppressHighlighting style={{ color: "#C4B5A0", fontSize: 13 }}>ou</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: "#F0E8E0" }} />
            </View>

            {/* Registo */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-up")}
              activeOpacity={0.8}
              style={{
                alignItems: "center",
                paddingVertical: 16,
                backgroundColor: "#fff",
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "#F0E8E0",
              }}
            >
              <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 14 }}>
                Não tem conta?{" "}
                <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "800" }}>
                  Registe-se grátis
                </Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
