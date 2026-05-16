import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from "react-native";
import { useRouter } from "expo-router";
import { Gift, ArrowLeft, CheckCircle } from "lucide-react-native";
import { api } from "../src/api";

export default function PromoCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function redeem() {
    if (!code.trim()) {
      Alert.alert("Atenção", "Introduz um código primeiro.");
      return;
    }
    setLoading(true);
    try {
      const res = await (api as any).post("/promo-codes/redeem", { code: code.trim() });
      if (res.error) {
        Alert.alert("Erro", res.error);
      } else {
        setSuccess(true);
      }
    } catch (e: any) {
      Alert.alert("Erro", e?.message || "Código inválido");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <View style={styles.successContainer}>
        <CheckCircle size={72} color="#FF6B35" />
        <Text style={styles.successTitle}>Código aplicado!</Text>
        <Text style={styles.successText}>Tens acesso vitalício à PetsLife. Obrigado! 🐾</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.btnText}>Ir para a app</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <ArrowLeft size={22} color="#FF6B35" />
      </TouchableOpacity>

      <View style={styles.iconWrap}>
        <Gift size={52} color="#FF6B35" />
      </View>

      <Text style={styles.title}>Código Promocional</Text>
      <Text style={styles.subtitle}>
        Tens um código especial? Introduz aqui para ativar acesso vitalício gratuito.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: PETS-AB123"
        placeholderTextColor="#9CA3AF"
        value={code}
        onChangeText={t => setCode(t.toUpperCase())}
        autoCapitalize="characters"
        autoCorrect={false}
      />

      <TouchableOpacity style={styles.btn} onPress={redeem} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>Ativar código</Text>
        }
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#fff",
    paddingHorizontal: 28, paddingTop: 80, alignItems: "center",
  },
  back: { position: "absolute", top: 52, left: 20, padding: 8 },
  iconWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#FFF3EE", alignItems: "center", justifyContent: "center",
    marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: "700", color: "#1F2937", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 15, color: "#6B7280", textAlign: "center", lineHeight: 22, marginBottom: 32 },
  input: {
    width: "100%", borderWidth: 2, borderColor: "#FF6B35",
    borderRadius: 14, padding: 16, fontSize: 20, fontWeight: "700",
    color: "#1F2937", textAlign: "center", letterSpacing: 3, marginBottom: 20,
  },
  btn: {
    width: "100%", backgroundColor: "#FF6B35",
    borderRadius: 14, padding: 16, alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  successContainer: {
    flex: 1, backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center", paddingHorizontal: 32,
  },
  successTitle: { fontSize: 28, fontWeight: "700", color: "#1F2937", marginTop: 24, marginBottom: 12 },
  successText: { fontSize: 16, color: "#6B7280", textAlign: "center", lineHeight: 24, marginBottom: 36 },
});
