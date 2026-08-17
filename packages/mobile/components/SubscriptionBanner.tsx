import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { AlertTriangle, Sparkles } from "lucide-react-native";
import { useSubscriptionGate } from "../lib/useSubscriptionGate";
import { tr } from "../lib/i18n";

/**
 * Shows a warning banner when the trial/subscription is about to expire (<=3 days)
 * or has already expired. Renders nothing when everything is fine.
 * Safe to drop into any screen — checks its own gate state.
 */
export function SubscriptionBanner() {
  const router = useRouter();
  const { isLoading, isBlocked, daysLeft, isTrial, isTester } = useSubscriptionGate();

  if (isLoading) return null;
  // Testadores têm acesso ilimitado: nunca mostrar avisos de trial.
  if (isTester) return null;
  if (!isBlocked && daysLeft > 3) return null;

  if (isBlocked) {
    return (
      <TouchableOpacity
        onPress={() => router.push("/subscription" as any)}
        activeOpacity={0.85}
        style={{
          flexDirection: "row", alignItems: "center", gap: 10,
          backgroundColor: "#FEE2E2", borderRadius: 16, padding: 14,
          marginHorizontal: 20, marginBottom: 16, borderWidth: 1.5, borderColor: "#FCA5A5",
        }}
      >
        <AlertTriangle size={20} color="#DC2626" />
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontWeight: "800", color: "#991B1B", fontSize: 13 }}>
            {isTrial ? "O seu período gratuito terminou" : "A sua subscrição expirou"}
          </Text>
          <Text suppressHighlighting style={{ color: "#B91C1C", fontSize: 12, marginTop: 2 }}>
            Renove agora para desbloquear todas as funcionalidades
          </Text>
        </View>
        <Text suppressHighlighting style={{ color: "#DC2626", fontWeight: "800", fontSize: 12 }}>{tr("Renovar")}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => router.push("/subscription" as any)}
      activeOpacity={0.85}
      style={{
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: "#FFF0EB", borderRadius: 16, padding: 14,
        marginHorizontal: 20, marginBottom: 16, borderWidth: 1.5, borderColor: "#FFD1BC",
      }}
    >
      <Sparkles size={20} color="#FF6B35" />
      <View style={{ flex: 1 }}>
        <Text suppressHighlighting style={{ fontWeight: "800", color: "#9A3412", fontSize: 13 }}>
          {daysLeft === 0 ? "O acesso termina hoje" : daysLeft === 1 ? "Falta 1 dia de acesso" : `Faltam ${daysLeft} dias de acesso`}
        </Text>
        <Text suppressHighlighting style={{ color: "#B45309", fontSize: 12, marginTop: 2 }}>
          {isTrial ? "Escolha um plano para continuar sem interrupções" : "Renove para não perder o acesso"}
        </Text>
      </View>
      <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "800", fontSize: 12 }}>{tr("Ver planos")}</Text>
    </TouchableOpacity>
  );
}
