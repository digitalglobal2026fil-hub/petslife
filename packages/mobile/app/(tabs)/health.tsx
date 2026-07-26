import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { Syringe, Calendar, FileText, ChevronRight, Heart, PawPrint, Stethoscope, Pill, Siren, Gauge, Video } from "lucide-react-native";
import { api } from "../../lib/api";
import { AnimalFact } from "../../components/AnimalFact";
import { useSubscriptionGate } from "../../lib/useSubscriptionGate";
import { PaywallScreen } from "../../components/PaywallScreen";

const sections = [
  { icon: Syringe,     label: "Vacinas",         sublabel: "Registo e lembretes",      color: "#4ECDC4", bg: "#E8FAF9", route: "/add-vaccine" },
  { icon: Calendar,    label: "Consultas",        sublabel: "Agenda e histórico",        color: "#FF6B35", bg: "#FFF0EB", route: "/add-appointment" },
  { icon: Heart,       label: "Diário de Saúde",  sublabel: "Registo diário",            color: "#EF476F", bg: "#FFF0F3", route: "/add-diary" },
  { icon: FileText,    label: "Documentos",       sublabel: "Receitas e exames",         color: "#8B5CF6", bg: "#F3EEFF", route: "/add-document" },
  { icon: Pill,        label: "Desparasitação",   sublabel: "Controlo interno/externo",  color: "#F59E0B", bg: "#FEF3C7", route: "/add-deworming" },
  { icon: Stethoscope, label: "Peso",             sublabel: "Gráfico de evolução",       color: "#06D6A0", bg: "#E6FAF5", route: "/weight-chart" },
];

function SectionCard({ s, index }: { s: any; index: number }) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: index * 60, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: index * 60, tension: 80, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ width: "47%", opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale }] }}>
      <TouchableOpacity
        onPress={() => router.push(s.route as any)}
        onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, tension: 300, friction: 10 }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start()}
        activeOpacity={1}
        style={{
          backgroundColor: s.bg,
          borderRadius: 24,
          padding: 18,
          gap: 12,
        }}>
        <View style={{
          width: 48, height: 48, borderRadius: 24,
          backgroundColor: "#fff",
          alignItems: "center", justifyContent: "center",
          shadowColor: s.color, shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
          elevation: 0,
        }}>
          <s.icon size={22} color={s.color} />
        </View>
        <View>
          <Text suppressHighlighting style={{ fontWeight: "800", color: "#1A1A2E", fontSize: 14 }}>{s.label}</Text>
          <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 11, marginTop: 2 }}>{s.sublabel}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HealthScreen() {
  const router = useRouter();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const { isLoading: gateLoading, isBlocked } = useSubscriptionGate();

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const { data: petsData, isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => (await api.pets.$get()).json(),
  });
  const pets = (petsData as any)?.pets ?? [];

  if (!gateLoading && isBlocked) {
    return <PaywallScreen featureName="Saúde" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6FF" }} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

        {/* Header */}
        <Animated.View style={{
          opacity: headerAnim,
          backgroundColor: "#4ECDC4",
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 32,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          marginBottom: 8,
        }}>
          <View style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.1)" }} />
          <Text suppressHighlighting style={{ fontSize: 26, fontWeight: "800", color: "#fff" }}>Saúde 🏥</Text>
          <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.8)", marginTop: 4, fontSize: 14 }}>Gerencie a saúde dos seus animais</Text>
        </Animated.View>

        <AnimalFact style={{ marginHorizontal: 20, marginBottom: 8 }} />

        {/* Grid de secções */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: "#1A1A2E", marginBottom: 14 }}>O que quer registar?</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {sections.map((s, index) => (
              <SectionCard key={s.label} s={s} index={index} />
            ))}
          </View>
        </View>

        {/* Ferramentas extra */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: "#1A1A2E", marginBottom: 12 }}>Ferramentas</Text>
          <View style={{ gap: 10 }}>
            {[
              { icon: Video, label: "Consulta Online", sublabel: "Videochamada com o vet", color: "#FF6B35", bg: "#FFF0EB", route: "/consult" },
              { icon: Siren, label: "Primeiros Socorros", sublabel: "Guia de emergências", color: "#FF4757", bg: "#FFF0F2", route: "/first-aid" },
              { icon: Pill, label: "Farmácia Pet", sublabel: "Medicamentos e produtos", color: "#4ECDC4", bg: "#E8FAF9", route: "/pharmacy" },
              { icon: Gauge, label: "Gráfico de Peso", sublabel: "Monitorize a evolução", color: "#06D6A0", bg: "#E6FAF5", route: "/weight-chart" },
            ].map(tool => (
              <TouchableOpacity key={tool.label} onPress={() => router.push(tool.route as any)}
                style={{ backgroundColor: tool.bg, borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: tool.color, shadowOpacity: 0.15, shadowRadius: 6, elevation: 0 }}>
                  <tool.icon size={22} color={tool.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "800", color: "#1A1A2E", fontSize: 14 }}>{tool.label}</Text>
                  <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>{tool.sublabel}</Text>
                </View>
                <View style={{ backgroundColor: tool.color + "20", borderRadius: 10, padding: 8 }}>
                  <Text suppressHighlighting style={{ fontSize: 14 }}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Per-pet quick access */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: "#1A1A2E", marginBottom: 14 }}>Os meus animais</Text>
          {isLoading ? (
            <ActivityIndicator color="#4ECDC4" />
          ) : pets.length === 0 ? (
            <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 24, alignItems: "center" }}>
              <Text suppressHighlighting style={{ fontSize: 40, marginBottom: 8 }}>🐾</Text>
              <Text suppressHighlighting style={{ color: "#6B7280", textAlign: "center", marginBottom: 14 }}>Adicione um animal para gerir a sua saúde</Text>
              <TouchableOpacity onPress={() => router.push("/add-pet")}
                style={{ backgroundColor: "#FF6B35", borderRadius: 16, paddingHorizontal: 22, paddingVertical: 12, shadowColor: "#FF6B35", shadowOpacity: 0.3, shadowRadius: 10, elevation: 0 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800" }}>+ Adicionar animal</Text>
              </TouchableOpacity>
            </View>
          ) : pets.map((pet: any, i: number) => {
            const speciesEmoji = pet.species === "cat" ? "🐱" : pet.species === "bird" ? "🦜" : pet.species === "rabbit" ? "🐰" : "🐕";
            const speciesColor = pet.species === "cat" ? "#8B5CF6" : pet.species === "bird" ? "#06D6A0" : pet.species === "rabbit" ? "#F59E0B" : "#FF6B35";
            return (
              <TouchableOpacity key={pet.id} onPress={() => router.push(`/pet/${pet.id}/health` as any)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: speciesColor,
                  shadowOpacity: 0.08,
                  shadowRadius: 10,
                  elevation: 0,
                }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: speciesColor + "20", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                  <Text suppressHighlighting style={{ fontSize: 24 }}>{speciesEmoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "800", color: "#1A1A2E", fontSize: 15 }}>{pet.name}</Text>
                  <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 12, marginTop: 2 }}>{pet.breed ?? pet.species}</Text>
                </View>
                <View style={{ backgroundColor: speciesColor + "15", borderRadius: 12, padding: 8 }}>
                  <ChevronRight size={18} color={speciesColor} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
