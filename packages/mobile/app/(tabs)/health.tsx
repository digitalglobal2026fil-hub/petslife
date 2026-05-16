import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Syringe, Calendar, FileText, ChevronRight, Heart, PawPrint } from "lucide-react-native";
import { api } from "../../lib/api";

type SectionKey = "vaccines" | "appointments" | "diary" | "documents";

const sections: { icon: any; label: string; color: string; bg: string; route: string }[] = [
  { icon: Syringe,  label: "Vacinas",        color: "#4ECDC4", bg: "#E8FAF9", route: "/add-vaccine" },
  { icon: Calendar, label: "Consultas",       color: "#FF6B35", bg: "#FFF0EB", route: "/add-appointment" },
  { icon: Heart,    label: "Diário de Saúde", color: "#EF476F", bg: "#FFF0F3", route: "/add-diary" },
  { icon: FileText, label: "Documentos",      color: "#8B5CF6", bg: "#F3EEFF", route: "/add-document" },
];

export default function HealthScreen() {
  const router = useRouter();

  const { data: petsData, isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => (await api.pets.$get()).json(),
  });
  const pets = (petsData as any)?.pets ?? [];

  function handleSection(route: string) {
    router.push(route as any);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, paddingBottom: 12 }}>
          <Text suppressHighlighting style={{ fontSize: 26, fontWeight: "800", color: "#1A1A2E" }}>Saúde 🏥</Text>
          <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 4 }}>Gerencie a saúde dos seus animais</Text>
        </View>

        {/* Quick nav */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {sections.map((s) => (
              <TouchableOpacity key={s.label} onPress={() => handleSection(s.route)}
                style={{ width: "47%", backgroundColor: s.bg, borderRadius: 20, padding: 16, gap: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={20} color={s.color} />
                </View>
                <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 14 }}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Per-pet quick access */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "700", color: "#1A1A2E", marginBottom: 12 }}>Os meus animais</Text>
          {isLoading ? <ActivityIndicator color="#FF6B35" /> : pets.length === 0 ? (
            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 1.5, borderColor: "#F0E8E0" }}>
              <PawPrint size={28} color="#8B5E3C" />
              <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 8, textAlign: "center" }}>Adicione um animal para gerir a sua saúde</Text>
              <TouchableOpacity onPress={() => router.push("/add-pet")}
                style={{ backgroundColor: "#FF6B35", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, marginTop: 12 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700" }}>+ Adicionar animal</Text>
              </TouchableOpacity>
            </View>
          ) : pets.map((pet: any) => (
            <TouchableOpacity key={pet.id} onPress={() => router.push(`/pet/${pet.id}/health` as any)}
              style={{ backgroundColor: "#fff", borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: "#F0E8E0", flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                <Text suppressHighlighting style={{ fontSize: 22 }}>{pet.species === "cat" ? "🐱" : pet.species === "bird" ? "🦜" : "🐕"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 15 }}>{pet.name}</Text>
                <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>{pet.breed ?? pet.species}</Text>
              </View>
              <ChevronRight size={18} color="#C4B5A0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
