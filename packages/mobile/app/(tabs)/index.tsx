import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, Bell, QrCode, Syringe, Calendar, MapPin, AlertCircle, PawPrint } from "lucide-react-native";
import { api } from "../../lib/api";
import { authClient } from "../../lib/auth";
import { AnimalFact } from "../../components/AnimalFact";

export default function HomeScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: petsData, isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => (await api.pets.$get()).json(),
  });
  const { data: subData } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => (await api.subscriptions.me.$get()).json(),
  });
  const { data: appointmentsData } = useQuery({
    queryKey: ["appointments-upcoming"],
    queryFn: async () => (await api.appointments.upcoming.$get()).json(),
  });

  const pets = (petsData as any)?.pets ?? [];
  const sub = (subData as any);
  const appointments = ((appointmentsData as any)?.appointments ?? []).slice(0, 3);
  const isTrial = sub?.isTrial;
  const trialEndsAt = sub?.subscription?.trialEndsAt ? new Date(sub.subscription.trialEndsAt) : null;
  const daysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  // Seed baseado no dia para variar diariamente
  const factSeed = Math.floor(Date.now() / 86400000);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 12 }}>
          <View>
            <Text suppressHighlighting style={{ fontSize: 13, color: "#6B7280" }}>Olá, {session?.user?.name?.split(" ")[0]} 👋</Text>
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "800", color: "#1A1A2E" }}>Os meus animais</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/notifications" as any)}
            style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}>
            <Bell size={20} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        {/* Trial banner */}
        {isTrial && daysLeft > 0 && (
          <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: "#FF6B35", borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
            <AlertCircle size={20} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Trial termina em {daysLeft} dia{daysLeft !== 1 ? "s" : ""}</Text>
              <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>Subscreva para continuar a usar a PetsLife</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/subscription")} style={{ backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "700", fontSize: 12 }}>Ver planos</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Pets list */}
        {isLoading ? (
          <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} />
        ) : pets.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40, paddingHorizontal: 20 }}>
            <View style={{ backgroundColor: "#F5EDE4", borderRadius: 32, padding: 18, marginBottom: 4 }}>
              <PawPrint size={52} color="#8B5E3C" />
            </View>
            <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>Adicione o seu primeiro animal</Text>
            <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 4, textAlign: "center" }}>Crie o perfil do seu pet e comece a organizar a sua saúde.</Text>
            <TouchableOpacity onPress={() => router.push("/add-pet")}
              style={{ backgroundColor: "#FF6B35", borderRadius: 16, paddingHorizontal: 24, paddingVertical: 14, marginTop: 20 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>+ Adicionar animal</Text>
            </TouchableOpacity>

            {/* Dica quando não há animais */}
            <AnimalFact seed={factSeed} style={{ marginTop: 24, width: "100%" }} />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 4 }}>
            {pets.map((pet: any) => (
              <TouchableOpacity key={pet.id} onPress={() => router.push(`/pet/${pet.id}`)}
                style={{ backgroundColor: "#fff", borderRadius: 24, padding: 16, width: 160, borderWidth: 1.5, borderColor: "#F0E8E0", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  {pet.photoUrl ? (
                    <Image source={{ uri: pet.photoUrl }} style={{ width: 64, height: 64, borderRadius: 32 }} />
                  ) : (
                    <Text suppressHighlighting style={{ fontSize: 28 }}>{pet.species === "cat" ? "🐱" : pet.species === "bird" ? "🦜" : pet.species === "rabbit" ? "🐰" : "🐕"}</Text>
                  )}
                </View>
                <Text suppressHighlighting style={{ fontWeight: "700", fontSize: 16, color: "#1A1A2E" }}>{pet.name}</Text>
                <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>{pet.breed ?? pet.species}</Text>
                <View style={{ flexDirection: "row", gap: 6, marginTop: 10 }}>
                  <TouchableOpacity onPress={() => pet.qrCode ? router.push(`/qr/${pet.qrCode}`) : Alert.alert("QR Code", "QR Code ainda não gerado para este animal.")}
                    style={{ flex: 1, backgroundColor: "#FFF9F5", borderRadius: 10, padding: 6, alignItems: "center" }}>
                    <QrCode size={16} color="#FF6B35" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push(`/pet/${pet.id}/health`)}
                    style={{ flex: 1, backgroundColor: "#FFF9F5", borderRadius: 10, padding: 6, alignItems: "center" }}>
                    <Syringe size={16} color="#4ECDC4" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => router.push("/add-pet")}
              style={{ backgroundColor: "#FFF9F5", borderRadius: 24, padding: 16, width: 120, borderWidth: 1.5, borderColor: "#F0E8E0", borderStyle: "dashed", alignItems: "center", justifyContent: "center" }}>
              <Plus size={28} color="#FF6B35" />
              <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "600", fontSize: 12, marginTop: 6, textAlign: "center" }}>Adicionar animal</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Quick actions */}
        <View style={{ padding: 20, paddingTop: 24 }}>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "700", color: "#1A1A2E", marginBottom: 12 }}>Acesso rápido</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {[
              { icon: Syringe, label: "Vacinas", color: "#4ECDC4", bg: "#E8FAF9", route: "/health" as const },
              { icon: Calendar, label: "Agenda", color: "#FF6B35", bg: "#FFF0EB", route: "/health" as const },
              { icon: MapPin, label: "Vets", color: "#06D6A0", bg: "#E6FAF5", route: "/find-vets" as const },
              { icon: QrCode, label: "QR Code", color: "#8B5CF6", bg: "#F3EEFF", route: null as any },
            ].map((item) => (
              <TouchableOpacity key={item.label} onPress={() => {
                if (item.label === "QR Code") {
                  if (pets.length === 0) { Alert.alert("QR Code", "Adicione um animal primeiro."); return; }
                  const qr = pets[0]?.qrCode;
                  if (qr) { router.push(`/qr/${qr}` as any); } else { Alert.alert("QR Code", "QR Code não gerado ainda."); }
                  return;
                }
                router.push(item.route as any);
              }}
                style={{ flex: 1, backgroundColor: item.bg, borderRadius: 16, padding: 12, alignItems: "center", gap: 6 }}>
                <item.icon size={22} color={item.color} />
                <Text suppressHighlighting style={{ fontSize: 11, fontWeight: "600", color: "#1A1A2E" }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dica do dia — aparece sempre */}
        <View style={{ paddingHorizontal: 20, marginBottom: 4 }}>
          <AnimalFact seed={factSeed + 1} compact />
        </View>

        {/* Upcoming appointments */}
        {appointments.length > 0 ? (
          <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 }}>
            <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "700", color: "#1A1A2E", marginBottom: 12 }}>Próximas consultas</Text>
            {appointments.map((apt: any) => (
              <View key={apt.id} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1.5, borderColor: "#F0E8E0", flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF0EB", alignItems: "center", justifyContent: "center" }}>
                  <Calendar size={18} color="#FF6B35" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "600", color: "#1A1A2E", fontSize: 14 }}>{apt.title}</Text>
                  <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>{apt.date} {apt.time ? `• ${apt.time}` : ""}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* Segunda dica quando não há consultas */
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
            <AnimalFact seed={factSeed + 3} style={{ marginBottom: 8 }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
