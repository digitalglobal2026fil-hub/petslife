import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

interface Props {
  emoji: string;
  title: string;
  subtitle: string;
  bgColor: string;
  accentColor: string;
}

export function CategoryHeader({ emoji, title, subtitle, bgColor, accentColor }: Props) {
  const router = useRouter();
  return (
    <View style={{
      backgroundColor: bgColor,
      paddingTop: 8,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      marginBottom: 4,
    }}>
      {/* Paw prints decorativos */}
      <View style={{ position: "absolute", top: 10, right: 24, opacity: 0.12 }}>
        <Text style={{ fontSize: 48, backgroundColor: "transparent" }}>🐾</Text>
      </View>
      <View style={{ position: "absolute", top: 38, right: 64, opacity: 0.08 }}>
        <Text style={{ fontSize: 28, backgroundColor: "transparent" }}>🐾</Text>
      </View>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          width: 38, height: 38, borderRadius: 19,
          backgroundColor: "rgba(255,255,255,0.9)",
          alignItems: "center", justifyContent: "center",
          marginBottom: 14,
        }}
        activeOpacity={0.8}
      >
        <ChevronLeft size={22} color={accentColor} />
      </TouchableOpacity>

      {/* Emoji + Title */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{
          width: 56, height: 56, borderRadius: 20,
          backgroundColor: "rgba(255,255,255,0.85)",
          alignItems: "center", justifyContent: "center",
          shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 0,
        }}>
          <Text style={{ fontSize: 30, backgroundColor: "transparent" }}>{emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontSize: 24, fontWeight: "900", color: "#1A1A2E", backgroundColor: "transparent" }}>
            {title}
          </Text>
          <Text suppressHighlighting style={{ fontSize: 13, color: "#555", marginTop: 2, backgroundColor: "transparent" }}>
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}
