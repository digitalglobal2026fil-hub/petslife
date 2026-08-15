import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react-native";
import { api } from "../../lib/api";
import { authFetch } from "../../lib/auth-fetch";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const API_URL = ((Constants.expoConfig?.extra?.apiUrl as string) ?? process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4200").replace(/\/$/, "");

const BG = "#F5ECD7";
const BROWN = "#6B3A2A";
const BORDER = "#E8D5B7";
const GRAY = "#A08060";
const CARD = "#FFFFFF";

function daysUntil(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function daysSince(dateStr: string): number {
  return -daysUntil(dateStr);
}

export default function NotificationsScreen() {
  const router = useRouter();

  const { data: petsData, isLoading: loadPets } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => (await api.pets.$get()).json(),
  });

  const pets: any[] = (petsData as any)?.pets ?? [];

  // Collect all notifications from pets data
  const { data: allVaccines, isLoading: loadV } = useQuery({
    queryKey: ["all-vaccines-notif", pets.map((p: any) => p.id).join(",")],
    queryFn: async () => {
      if (!pets.length) return [];
      const results = await Promise.all(
        pets.map(async (pet: any) => {
          try {
            const res = await api.vaccines["pet"][":petId"].$get({ param: { petId: pet.id } });
            const data = await res.json() as any;
            return (data.vaccines ?? []).map((v: any) => ({ ...v, petName: pet.name, petEmoji: pet.species === "cat" ? "🐱" : pet.species === "bird" ? "🦜" : pet.species === "rabbit" ? "🐰" : "🐕" }));
          } catch { return []; }
        })
      );
      return results.flat();
    },
    enabled: !loadPets && pets.length > 0,
  });

  const { data: allAppts, isLoading: loadA } = useQuery({
    queryKey: ["all-appointments-notif", pets.map((p: any) => p.id).join(",")],
    queryFn: async () => {
      if (!pets.length) return [];
      const results = await Promise.all(
        pets.map(async (pet: any) => {
          try {
            const res = await api.appointments["pet"][":petId"].$get({ param: { petId: pet.id } });
            const data = await res.json() as any;
            return (data.appointments ?? []).map((a: any) => ({ ...a, petName: pet.name, petEmoji: pet.species === "cat" ? "🐱" : pet.species === "bird" ? "🦜" : pet.species === "rabbit" ? "🐰" : "🐕" }));
          } catch { return []; }
        })
      );
      return results.flat();
    },
    enabled: !loadPets && pets.length > 0,
  });

  const { data: allDewormings, isLoading: loadDw } = useQuery({
    queryKey: ["all-dewormings-notif", pets.map((p: any) => p.id).join(",")],
    queryFn: async () => {
      if (!pets.length) return [];
      const results = await Promise.all(
        pets.map(async (pet: any) => {
          try {
            const res = await (api as any).dewormings["pet"][":petId"].$get({ param: { petId: pet.id } });
            const data = await res.json() as any;
            return (data.dewormings ?? []).map((d: any) => ({ ...d, petName: pet.name, petEmoji: pet.species === "cat" ? "🐱" : pet.species === "bird" ? "🦜" : pet.species === "rabbit" ? "🐰" : "🐕" }));
          } catch { return []; }
        })
      );
      return results.flat();
    },
    enabled: !loadPets && pets.length > 0,
  });

  const { data: scansData, isLoading: loadScans } = useQuery({
    queryKey: ["qr-scans-notif"],
    queryFn: async () => {
      try {
        const res = await authFetch(`${API_URL}/api/pet-scans/mine`, {});
        if (!res.ok) return { scans: [] };
        return (await res.json()) as any;
      } catch {
        return { scans: [] };
      }
    },
  });

  const queryClient = useQueryClient();

  // Ao abrir este ecrã os avisos passam a lidos, para o sino parar de tocar.
  useEffect(() => {
    const scans: any[] = (scansData as any)?.scans ?? (scansData as any)?.petScans ?? [];
    if (!scans.length) return;
    (async () => {
      try {
        await AsyncStorage.setItem(
          "dg_read_scan_ids",
          JSON.stringify(scans.map((s) => s.id).slice(-200)),
        );
        queryClient.invalidateQueries({ queryKey: ["scan-alerts-badge"] });
      } catch {
        /* ignora */
      }
    })();
  }, [scansData]);

  const loading = loadPets || loadV || loadA || loadDw || loadScans;

  // Build notifications list
  const notifications: { id: string; emoji: string; title: string; body: string; time: string; urgency: "high" | "medium" | "low"; url?: string }[] = [];

  // Vaccines overdue / upcoming
  (allVaccines ?? []).forEach((v: any) => {
    if (v.nextDate) {
      const days = daysUntil(v.nextDate);
      if (days < 0) {
        notifications.push({
          id: `v-overdue-${v.id}`,
          emoji: "💉",
          title: `Vacina em atraso — ${v.petName} ${v.petEmoji}`,
          body: `A vacina "${v.name}" está ${Math.abs(days)} dia${Math.abs(days) !== 1 ? "s" : ""} em atraso.`,
          time: `Desde ${new Date(v.nextDate).toLocaleDateString("pt-PT")}`,
          urgency: "high",
        });
      } else if (days <= 30) {
        notifications.push({
          id: `v-soon-${v.id}`,
          emoji: "💉",
          title: `Vacina em breve — ${v.petName} ${v.petEmoji}`,
          body: `A vacina "${v.name}" é em ${days} dia${days !== 1 ? "s" : ""}.`,
          time: new Date(v.nextDate).toLocaleDateString("pt-PT"),
          urgency: days <= 7 ? "high" : "medium",
        });
      }
    }
  });

  // Appointments upcoming
  (allAppts ?? []).forEach((a: any) => {
    if (a.date) {
      const days = daysUntil(a.date);
      if (days >= 0 && days <= 7) {
        notifications.push({
          id: `a-${a.id}`,
          emoji: "📅",
          title: `Consulta ${days === 0 ? "hoje" : `em ${days} dia${days !== 1 ? "s" : ""}`} — ${a.petName} ${a.petEmoji}`,
          body: a.title + (a.time ? ` às ${a.time}` : ""),
          time: new Date(a.date).toLocaleDateString("pt-PT"),
          urgency: days === 0 ? "high" : "medium",
        });
      }
    }
  });

  // Dewormings overdue / upcoming
  (allDewormings ?? []).forEach((d: any) => {
    if (d.nextDate) {
      const days = daysUntil(d.nextDate);
      if (days < 0) {
        notifications.push({
          id: `dw-overdue-${d.id}`,
          emoji: "🪱",
          title: `Desparasitação em atraso — ${d.petName} ${d.petEmoji}`,
          body: `A desparasitação de ${d.petName} está ${Math.abs(days)} dia${Math.abs(days) !== 1 ? "s" : ""} em atraso!`,
          time: `Desde ${new Date(d.nextDate).toLocaleDateString("pt-PT")}`,
          urgency: "high",
        });
      } else if (days <= 14) {
        notifications.push({
          id: `dw-soon-${d.id}`,
          emoji: "🪱",
          title: `Desparasitação em breve — ${d.petName} ${d.petEmoji}`,
          body: `Está na altura de desparasitar o ${d.petName} (em ${days} dia${days !== 1 ? "s" : ""}).`,
          time: new Date(d.nextDate).toLocaleDateString("pt-PT"),
          urgency: "medium",
        });
      }
    }
  });

  // QR code digitalizado — alguém encontrou o animal
  ((scansData as any)?.scans ?? []).forEach((sc: any) => {
    const when = sc.createdAt ? new Date(sc.createdAt) : null;
    const hasCoords = sc.lat != null && sc.lng != null;
    const parts: string[] = [];
    if (sc.finderName) parts.push(`Quem encontrou: ${sc.finderName}`);
    if (sc.finderPhone) parts.push(`Tel: ${sc.finderPhone}`);
    if (sc.message) parts.push(`"${sc.message}"`);
    if (sc.address) parts.push(sc.address);
    if (hasCoords) parts.push("Toca para ver no mapa");
    notifications.push({
      id: `scan-${sc.id}`,
      emoji: "\ud83d\udea8",
      title: `QR code digitalizado — ${sc.petName || "o teu animal"}`,
      body: parts.length ? parts.join(" · ") : "Alguém digitalizou o QR code do teu animal.",
      time: when ? when.toLocaleString("pt-PT") : "",
      urgency: "high",
      url: hasCoords ? `https://www.google.com/maps?q=${sc.lat},${sc.lng}` : undefined,
    });
  });

  // Sort: high first
  notifications.sort((a, b) => {
    const ord = { high: 0, medium: 1, low: 2 };
    return ord[a.urgency] - ord[b.urgency];
  });

  const urgencyStyle = (u: "high" | "medium" | "low") => {
    if (u === "high") return { bg: "#FEF3C7", border: "#FDE68A", dot: "#F59E0B" };
    if (u === "medium") return { bg: "#EDF7FF", border: "#BAE6FD", dot: "#0EA5E9" };
    return { bg: CARD, border: BORDER, dot: GRAY };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: BORDER, alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={20} color={BROWN} />
        </TouchableOpacity>
        <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "800", color: BROWN }}>Notificações 🔔</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#E07A3A" size="large" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 10 }}>
          {notifications.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Text suppressHighlighting style={{ fontSize: 60, marginBottom: 16 }}>✅</Text>
              <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: BROWN, marginBottom: 8 }}>Tudo em dia!</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 14, textAlign: "center", lineHeight: 22 }}>
                Os teus animais estão com as vacinas e desparasitações em dia. Continua assim! 🐾
              </Text>
            </View>
          ) : (
            notifications.map((n) => {
              const style = urgencyStyle(n.urgency);
              return (
                <TouchableOpacity key={n.id} activeOpacity={n.url ? 0.7 : 1}
                  onPress={() => { if (n.url) Linking.openURL(n.url); }}
                  style={{ backgroundColor: style.bg, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "flex-start", gap: 12, borderWidth: 1.5, borderColor: style.border }}>
                  <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: CARD, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: style.border }}>
                    <Text suppressHighlighting style={{ fontSize: 22 }}>{n.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: style.dot }} />
                      <Text suppressHighlighting style={{ fontWeight: "800", color: BROWN, fontSize: 13, flex: 1 }}>{n.title}</Text>
                    </View>
                    <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, lineHeight: 18 }}>{n.body}</Text>
                    <Text suppressHighlighting style={{ color: GRAY, fontSize: 11, marginTop: 5, opacity: 0.7 }}>{n.time}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          <View style={{ alignItems: "center", paddingTop: 16, paddingBottom: 20 }}>
            <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, textAlign: "center" }}>
              As notificações são geradas a partir dos dados de saúde dos teus animais 🐾
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
