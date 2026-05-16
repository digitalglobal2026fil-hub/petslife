import { View, Text, TouchableOpacity, Share, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Share2, Globe } from "lucide-react-native";

// Simple QR code display using a QR API service
export default function QRCodeScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(code ?? "")}`;
  const petProfileUrl = `https://petslife.app/pet/${code}`;

  async function handleShare() {
    try {
      await Share.share({
        message: `Encontrei este animal! Aceda ao perfil em: ${petProfileUrl}`,
        url: petProfileUrl,
      });
    } catch (e) {
      Alert.alert("Erro ao partilhar");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>QR Code do Animal</Text>
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 28, padding: 28, borderWidth: 2, borderColor: "#F0E8E0", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 20, elevation: 4, alignItems: "center" }}>
          {/* QR code via free API */}
          <View style={{ width: 220, height: 220, backgroundColor: "#F9F5F0", borderRadius: 16, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {/* Using Image component to load QR from API */}
            <QRImage url={qrUrl} />
          </View>

          <View style={{ width: 220, height: 2, backgroundColor: "#F0E8E0", marginVertical: 20 }} />

          <Text suppressHighlighting style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 4 }}>Código de identificação</Text>
          <Text suppressHighlighting style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace", textAlign: "center", letterSpacing: 1 }}>{code?.slice(0, 8).toUpperCase()}...</Text>
        </View>

        <Text suppressHighlighting style={{ color: "#6B7280", textAlign: "center", marginTop: 24, lineHeight: 22, paddingHorizontal: 20 }}>
          Se o seu animal se perder, quem o encontrar pode ler este código para aceder ao seu perfil e contactá-lo.
        </Text>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 28, width: "100%" }}>
          <TouchableOpacity onPress={handleShare}
            style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#FF6B35", borderRadius: 18, paddingVertical: 15 }}>
            <Share2 size={18} color="#fff" />
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Partilhar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(petProfileUrl)}
            style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fff", borderRadius: 18, paddingVertical: 15, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
            <Globe size={18} color="#4ECDC4" />
            <Text suppressHighlighting style={{ color: "#1A1A2E", fontWeight: "700", fontSize: 15 }}>Ver Online</Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: "#E8FAF9", borderRadius: 16, padding: 14, marginTop: 16, flexDirection: "row", alignItems: "flex-start", gap: 10, width: "100%" }}>
          <Text suppressHighlighting style={{ fontSize: 20 }}>💡</Text>
          <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 13, lineHeight: 20, flex: 1 }}>
            Imprima este QR code e coloque na coleira do seu animal para máxima segurança.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Sub-component to load QR image
import { Image } from "react-native";

function QRImage({ url }: { url: string }) {
  return (
    <Image
      source={{ uri: url }}
      style={{ width: 200, height: 200 }}
      resizeMode="contain"
    />
  );
}
