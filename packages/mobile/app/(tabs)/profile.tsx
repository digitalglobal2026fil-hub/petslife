import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { User, Bell, CreditCard, MapPin, LogOut, ChevronRight, Shield, HelpCircle, Gift } from "lucide-react-native";
import { authClient, clearToken } from "../../lib/auth";
import { api } from "../../lib/api";

export default function ProfileScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: subData } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => (await api.subscriptions.me.$get()).json(),
  });

  const sub = (subData as any);
  const isTrial = sub?.isTrial;
  const isActive = sub?.isActive;

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
    { icon: Bell, label: "Notificações", sublabel: "Configurar lembretes", route: null, color: "#4ECDC4" },
    { icon: MapPin, label: "Vets e Lojas", sublabel: "Encontrar perto de mim", route: "/find-vets" as const, color: "#06D6A0" },
    { icon: Shield, label: "Privacidade", sublabel: "Dados e segurança", route: null, color: "#8B5CF6" },
    { icon: HelpCircle, label: "Ajuda e Suporte", sublabel: "FAQ e contacto", route: null, color: "#6B7280" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ padding: 20, alignItems: "center", paddingTop: 30, paddingBottom: 24 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Text suppressHighlighting style={{ color: "#fff", fontSize: 32, fontWeight: "700" }}>{session?.user?.name?.[0]?.toUpperCase() ?? "?"}</Text>
          </View>
          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>{session?.user?.name}</Text>
          <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 13, marginTop: 2 }}>{session?.user?.email}</Text>
          {isTrial && (
            <View style={{ backgroundColor: "#FF6B35", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginTop: 10 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>🎉 Trial ativo</Text>
            </View>
          )}
          {!isTrial && isActive && (
            <View style={{ backgroundColor: "#06D6A0", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginTop: 10 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>⭐ Premium</Text>
            </View>
          )}
        </View>

        {/* Menu */}
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label} onPress={() => item.route ? router.push(item.route as any) : Alert.alert(item.label, "Em breve disponível!")}
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
