import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Camera, Bell, CreditCard, MapPin, LogOut, ChevronRight, Shield, HelpCircle, Gift, Edit2 } from "lucide-react-native";
import { authClient, clearToken } from "../../lib/auth";
import { api } from "../../lib/api";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { AnimalFact } from "../../components/AnimalFact";

const API_URL = ((Constants.expoConfig?.extra?.apiUrl as string) ?? process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4200").replace(/\/$/, "");

function getToken(): string {
  try {
    if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem("bearer_token") : null) ?? "";
    const SecureStore = require("expo-secure-store");
    return SecureStore.getItem("bearer_token") ?? "";
  } catch { return ""; }
}

export default function ProfileScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: subData } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => (await api.subscriptions.me.$get()).json(),
  });
  const { data: meData, refetch: refetchMe } = useQuery({
    queryKey: ["user-me"],
    queryFn: async () => {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return null;
      return res.json();
    },
  });

  const sub = (subData as any);
  const isTrial = sub?.isTrial;
  const isActive = sub?.isActive;
  const photoUrl = (meData as any)?.user?.photoUrl ?? null;
  const userName = (meData as any)?.user?.name ?? session?.user?.name ?? "";
  const userEmail = (meData as any)?.user?.email ?? session?.user?.email ?? "";

  async function handleSignOut() {
    Alert.alert("Sair", "Tem a certeza que quer sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair", style: "destructive", onPress: async () => {
          await authClient.signOut();
          clearToken();
        }
      }
    ]);
  }

  const menuItems = [
    { icon: CreditCard, label: "Subscrição", sublabel: isTrial ? "Trial ativo" : isActive ? "Premium ativo" : "Inativo", route: "/subscription" as const, color: "#FF6B35" },
    { icon: Gift, label: "Código Promocional", sublabel: "Tens um código especial?", route: "/promo-code" as const, color: "#10B981" },
    { icon: Bell, label: "Notificações", sublabel: "Vacinas e consultas", route: "/notifications" as any, color: "#4ECDC4" },
    { icon: MapPin, label: "Vets e Lojas", sublabel: "Encontrar perto de mim", route: "/find-vets" as const, color: "#06D6A0" },
    { icon: Shield, label: "Privacidade", sublabel: "Dados e segurança", route: null, color: "#8B5CF6" },
    { icon: HelpCircle, label: "Ajuda e Suporte", sublabel: "FAQ e contacto", route: null, color: "#6B7280" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <AnimalFact />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ padding: 20, alignItems: "center", paddingTop: 30, paddingBottom: 24 }}>
          {/* Foto clicável */}
          <TouchableOpacity
            onPress={() => router.push("/edit-profile" as any)}
            style={{ position: "relative", marginBottom: 12 }}
            activeOpacity={0.85}
          >
            {photoUrl ? (
              <Image
                source={{ uri: photoUrl }}
                style={{ width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: "#F0E8E0" }}
              />
            ) : (
              <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#F0E8E0" }}>
                <Text suppressHighlighting style={{ color: "#fff", fontSize: 32, fontWeight: "700", backgroundColor: "transparent" }}>
                  {userName?.[0]?.toUpperCase() ?? "?"}
                </Text>
              </View>
            )}
            {/* Badge câmara */}
            <View style={{
              position: "absolute", bottom: 0, right: 0,
              width: 26, height: 26, borderRadius: 13,
              backgroundColor: "#FF6B35", borderWidth: 2, borderColor: "#FFF9F5",
              alignItems: "center", justifyContent: "center",
            }}>
              <Camera size={13} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>{userName}</Text>
          <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 13, marginTop: 2 }}>{userEmail}</Text>

          {/* Badges */}
          {isTrial && (
            <View style={{ backgroundColor: "#FF6B35", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginTop: 10 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontSize: 12, fontWeight: "700", backgroundColor: "transparent" }}>🎉 Trial ativo</Text>
            </View>
          )}
          {!isTrial && isActive && (
            <View style={{ backgroundColor: "#06D6A0", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginTop: 10 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontSize: 12, fontWeight: "700", backgroundColor: "transparent" }}>⭐ Premium</Text>
            </View>
          )}

          {/* Editar perfil */}
          <TouchableOpacity
            onPress={() => router.push("/edit-profile" as any)}
            activeOpacity={0.8}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12, backgroundColor: "#F5EDE4", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 7 }}
          >
            <Edit2 size={14} color="#8B5E3C" />
            <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#8B5E3C" }}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label}
              onPress={() => item.route ? router.push(item.route as any) : Alert.alert(item.label, "Em breve disponível!")}
              style={{ backgroundColor: "#fff", borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#F0E8E0" }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: `${item.color}15`, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                <item.icon size={20} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text suppressHighlighting style={{ fontWeight: "600", color: "#1A1A2E", fontSize: 14 }}>{item.label}</Text>
                <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 12 }}>{item.sublabel}</Text>
              </View>
              <ChevronRight size={18} color="#C4B5A0" />
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={handleSignOut}
            style={{ backgroundColor: "#FFF0F3", borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#FECDD3", marginTop: 8, marginBottom: 30 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#EF476F15", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
              <LogOut size={20} color="#EF476F" />
            </View>
            <Text suppressHighlighting style={{ fontWeight: "600", color: "#EF476F", fontSize: 14, flex: 1 }}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
