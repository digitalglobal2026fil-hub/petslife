import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Animated } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { authClient, captureToken } from "../../lib/auth";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react-native";
import { netError } from "../../lib/net-error";

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(formAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  async function handleSignUp() {
    if (!name || !email || !password) return Alert.alert("Erro", "Preencha todos os campos.");
    if (password.length < 8) return Alert.alert("Erro", "A password deve ter pelo menos 8 caracteres.");
    setLoading(true);
    try {
      const res = await authClient.signUp.email({ name, email, password }, { onSuccess: captureToken });
      if (res.error) throw new Error(res.error.message);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Ups", netError(e, "Não foi possível criar conta."));
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (field: string) => ({
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: focusedField === field ? "#FF6B35" : "#F0E8E0",
    borderRadius: 18,
    padding: 16,
    fontSize: 15,
    color: "#1A1A2E",
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6FF" }} edges={["top", "left", "right"]}>
      {/* Decorações */}
      <View style={{ position: "absolute", top: -40, left: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: "#4ECDC415" }} />
      <View style={{ position: "absolute", top: 80, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: "#FF6B3512" }} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24, paddingBottom: Math.max(insets.bottom, 24) }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <Animated.View style={{
            alignItems: "center",
            marginBottom: 32,
            opacity: logoAnim,
            transform: [{ translateY: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          }}>
            <View style={{
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
            </View>
            <Text suppressHighlighting style={{ fontSize: 30, fontWeight: "800", color: "#1A1A2E", marginTop: 14 }}>
              Criar conta
            </Text>
            {/* Badge trial */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FFF0EB", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginTop: 10 }}>
              <Sparkles size={14} color="#FF6B35" />
              <Text suppressHighlighting style={{ color: "#FF6B35", fontSize: 13, fontWeight: "700" }}>3 dias grátis • Sem cartão</Text>
            </View>
          </Animated.View>

          <Animated.View style={{
            opacity: formAnim,
            transform: [{ translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            gap: 14,
          }}>
            <View>
              <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: "#1A1A2E", marginBottom: 8, marginLeft: 4 }}>Nome</Text>
              <TextInput
                value={name} onChangeText={setName} placeholder="O seu nome"
                placeholderTextColor="#C4B5A0"
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("name")}
              />
            </View>
            <View>
              <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: "#1A1A2E", marginBottom: 8, marginLeft: 4 }}>Email</Text>
              <TextInput
                value={email} onChangeText={setEmail} placeholder="o.seu@email.com"
                placeholderTextColor="#C4B5A0"
                keyboardType="email-address" autoCapitalize="none"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("email")}
              />
            </View>
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
                  placeholder="Mínimo 8 caracteres"
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

            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.88}
              style={{
                backgroundColor: "#FF6B35",
                borderRadius: 20,
                padding: 18,
                alignItems: "center",
                marginTop: 8,
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
                  <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Começar grátis</Text>
                  <ArrowRight size={18} color="#fff" />
                </>
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={{ alignItems: "center", paddingVertical: 14 }}
            >
              <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 14 }}>
                Já tem conta?{" "}
                <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "800" }}>
                  Entrar
                </Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
