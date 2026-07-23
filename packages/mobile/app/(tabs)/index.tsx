import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { Plus, Bell, QrCode, Syringe, Calendar, MapPin, AlertCircle, PawPrint, Sparkles, Siren, Dog, Dumbbell, Pill, Search as SearchIcon, Gauge } from "lucide-react-native";
import { api } from "../../lib/api";
import { authClient } from "../../lib/auth";
import { AnimalFact } from "../../components/AnimalFact";
import { useSubscriptionGate } from "../../lib/useSubscriptionGate";
import { PaywallScreen } from "../../components/PaywallScreen";
import { SubscriptionBanner } from "../../components/SubscriptionBanner";
import { PetIllustration } from "../../components/PetIllustration";

function PetCard({ pet, index, onPress }: { pet: any; index: number; onPress: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 100, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: index * 100, tension: 80, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const speciesColor = pet.species === "cat" ? "#8B5CF6" : pet.species === "bird" ? "#06D6A0" : pet.species === "rabbit" ? "#F59E0B" : "#FF6B35";
  const speciesBg = pet.species === "cat" ? "#F3EEFF" : pet.species === "bird" ? "#E6FAF5" : pet.species === "rabbit" ? "#FEF3C7" : "#FFF0EB";

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity onPress={onPress}
        style={{
          backgroundColor: "#fff",
          borderRadius: 28,
          padding: 18,
          width: 165,
          borderWidth: 0,
          shadowColor: speciesColor,
          shadowOpacity: 0.15,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 0,
        }}>
        {/* Species color accent top */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: speciesColor, borderTopLeftRadius: 28, borderTopRightRadius: 28 }} />

        <View style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: speciesBg, alignItems: "center", justifyContent: "center", marginBottom: 12, marginTop: 6 }}>
          {pet.photoUrl ? (
            <Image source={{ uri: pet.photoUrl }} style={{ width: 68, height: 68, borderRadius: 34 }} />
          ) : (
            <PetIllustration species={pet.species} size={48} />
          )}
        </View>
        <Text suppressHighlighting style={{ fontWeight: "800", fontSize: 16, color: "#1A1A2E" }}>{pet.name}</Text>
        <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>{pet.breed ?? pet.species}</Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
          <View style={{ flex: 1, backgroundColor: speciesBg, borderRadius: 12, padding: 7, alignItems: "center" }}>
            <QrCode size={15} color={speciesColor} />
          </View>
          <View style={{ flex: 1, backgroundColor: "#E8FAF9", borderRadius: 12, padding: 7, alignItems: "center" }}>
            <Syringe size={15} color="#4ECDC4" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function QuickActionCard({ item, index }: { item: any; index: number }) {
  const scale = useRef(new Animated.Value(1)).current;

  function onPressIn() {
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, tension: 300, friction: 10 }).start();
  }
  function onPressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
  }

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={item.onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={{ backgroundColor: item.bg, borderRadius: 20, padding: 14, alignItems: "center", gap: 8 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: item.color, shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 0 }}>
          <item.icon size={22} color={item.color} />
        </View>
        <Text suppressHighlighting style={{ fontSize: 11, fontWeight: "700", color: "#1A1A2E", textAlign: "center" }}>{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const { isLoading: gateLoading, isBlocked } = useSubscriptionGate();

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

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const pets = (petsData as any)?.pets ?? [];
  const sub = (subData as any);
  const appointments = ((appointmentsData as any)?.appointments ?? []).slice(0, 3);
  const isTrial = sub?.isTrial;
  const trialEndsAt = sub?.subscription?.trialEndsAt ? new Date(sub.subscription.trialEndsAt) : null;
  const daysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
  const factSeed = Math.floor(Date.now() / 86400000);
  const firstName = session?.user?.name?.split(" ")[0];

  const quickActions = [
    { icon: Syringe, label: "Vacinas", color: "#4ECDC4", bg: "#E8FAF9", onPress: () => router.push("/health" as any) },
    { icon: Calendar, label: "Agenda", color: "#FF6B35", bg: "#FFF0EB", onPress: () => router.push("/health" as any) },
    { icon: MapPin, label: "Vets", color: "#06D6A0", bg: "#E6FAF5", onPress: () => router.push("/find-vets" as any) },
    {
      icon: QrCode, label: "QR Code", color: "#8B5CF6", bg: "#F3EEFF", onPress: () => {
        if (pets.length === 0) { Alert.alert("QR Code", "Adicione um animal primeiro."); return; }
        const qr = pets[0]?.qrCode;
        if (qr) { router.push(`/qr/${qr}` as any); } else { Alert.alert("QR Code", "QR Code não gerado ainda."); }
      }
    },
  ];

  const extraActions = [
    { icon: Siren, label: "Primeiros Socorros", color: "#FF4757", bg: "#FFF0F2", onPress: () => router.push("/first-aid" as any) },
    { icon: Dog, label: "Guia de Raças", color: "#8B5CF6", bg: "#F3EEFF", onPress: () => router.push("/breed-guide" as any) },
    { icon: Dumbbell, label: "Treino", color: "#FF6B35", bg: "#FFF0EB", onPress: () => router.push("/training-guide" as any) },
    { icon: Pill, label: "Farmácia", color: "#4ECDC4", bg: "#E8FAF9", onPress: () => router.push("/pharmacy" as any) },
    { icon: SearchIcon, label: "Perdidos", color: "#06D6A0", bg: "#E6FAF5", onPress: () => router.push("/lost-pets" as any) },
    { icon: Gauge, label: "Peso", color: "#F59E0B", bg: "#FEF3C7", onPress: () => router.push("/weight-chart" as any) },
  ];

  if (!gateLoading && isBlocked) {
    return <PaywallScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6FF" }} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

        {/* Header com gradiente simulado */}
        <Animated.View style={{
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          backgroundColor: "#FF6B35",
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 32,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          marginBottom: -16,
        }}>
          {/* Decorações */}
          <View style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.08)" }} />
          <View style={{ position: "absolute", top: 20, right: 60, width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(255,255,255,0.06)" }} />

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text suppressHighlighting style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: "500" }}>Olá, {firstName} 👋</Text>
              <Text suppressHighlighting style={{ fontSize: 24, fontWeight: "800", color: "#fff", marginTop: 2 }}>Os meus animais</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/notifications" as any)}
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
              <Bell size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Aviso de expiração do trial/subscrição */}
        <View style={{ marginTop: 28 }}>
          <SubscriptionBanner />
        </View>

        {/* Pets list */}
        <View style={{ marginTop: 28, paddingHorizontal: 20, marginBottom: 8 }}>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: "#1A1A2E", marginBottom: 14 }}>Os meus pets</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator color="#FF6B35" style={{ marginTop: 20 }} />
        ) : pets.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 32, paddingHorizontal: 20 }}>
            <View style={{ backgroundColor: "#FFF0EB", borderRadius: 40, padding: 22, marginBottom: 4 }}>
              <Text suppressHighlighting style={{ fontSize: 56 }}>🐾</Text>
            </View>
            <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#1A1A2E", marginTop: 14 }}>Adicione o seu primeiro animal</Text>
            <Text suppressHighlighting style={{ color: "#9CA3AF", marginTop: 6, textAlign: "center", lineHeight: 20 }}>Crie o perfil do seu pet e comece a organizar a sua saúde.</Text>
            <TouchableOpacity onPress={() => router.push("/add-pet")}
              style={{ backgroundColor: "#FF6B35", borderRadius: 20, paddingHorizontal: 28, paddingVertical: 15, marginTop: 20, shadowColor: "#FF6B35", shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 0 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>+ Adicionar animal</Text>
            </TouchableOpacity>
            <AnimalFact seed={factSeed} style={{ marginTop: 24, width: "100%" }} />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingBottom: 8 }}>
            {pets.map((pet: any, index: number) => (
              <PetCard key={pet.id} pet={pet} index={index} onPress={() => router.push(`/pet/${pet.id}` as any)} />
            ))}
            <TouchableOpacity onPress={() => router.push("/add-pet")}
              style={{ backgroundColor: "#fff", borderRadius: 28, padding: 18, width: 120, borderWidth: 2, borderColor: "#FF6B35", borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFF0EB", alignItems: "center", justifyContent: "center" }}>
                <Plus size={24} color="#FF6B35" />
              </View>
              <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "700", fontSize: 12, textAlign: "center" }}>Adicionar</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Quick actions */}
        <View style={{ padding: 20, paddingTop: 24 }}>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: "#1A1A2E", marginBottom: 14 }}>Acesso rápido</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {quickActions.map((item, index) => (
              <QuickActionCard key={item.label} item={item} index={index} />
            ))}
          </View>
        </View>

        {/* Extra quick actions row */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: "#1A1A2E", marginBottom: 12 }}>Explorar</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {extraActions.map(item => (
              <TouchableOpacity key={item.label} onPress={item.onPress}
                style={{ backgroundColor: item.bg, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 8, minWidth: "30%" }}>
                <item.icon size={18} color={item.color} />
                <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: item.color, flexShrink: 1 }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dica do dia */}
        <View style={{ paddingHorizontal: 20, marginBottom: 4 }}>
          <AnimalFact seed={factSeed + 1} compact />
        </View>

        {/* Upcoming appointments */}
        {appointments.length > 0 ? (
          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: "#1A1A2E", marginBottom: 12 }}>Próximas consultas</Text>
            {appointments.map((apt: any) => (
              <View key={apt.id} style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 0 }}>
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: "#FFF0EB", alignItems: "center", justifyContent: "center" }}>
                  <Calendar size={20} color="#FF6B35" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 14 }}>{apt.title}</Text>
                  <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>{apt.date} {apt.time ? `• ${apt.time}` : ""}</Text>
                </View>
                <View style={{ backgroundColor: "#FFF0EB", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text suppressHighlighting style={{ color: "#FF6B35", fontSize: 11, fontWeight: "700" }}>Em breve</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
            <AnimalFact seed={factSeed + 3} style={{ marginBottom: 8 }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
