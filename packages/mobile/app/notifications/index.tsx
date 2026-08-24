import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, X, Trash2, Check } from "lucide-react-native";
import { api } from "../../lib/api";
import { authFetch } from "../../lib/auth-fetch";
import Constants from "expo-constants";
import { kvSetIds, kvGetIds } from "../../lib/kv";
import { useEffect, useState, useCallback } from "react";
import { tr } from "../../lib/i18n";

const DISMISSED_KEY = "dg_dismissed_notifs";

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

  // Avisos que a utilizadora já apagou. Ficam guardados no telemóvel para não
  // voltarem a aparecer sempre que a lista é recalculada.
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [dismissLoaded, setDismissLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      setDismissed(await kvGetIds(DISMISSED_KEY));
      setDismissLoaded(true);
    })();
  }, []);

  const dismissOne = useCallback(async (id: string) => {
    setDismissed((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      kvSetIds(DISMISSED_KEY, next, 40);
      return next;
    });
  }, []);

  // Ao abrir este ecrã os avisos passam a lidos, para o sino parar de tocar.
  useEffect(() => {
    const scans: any[] = (scansData as any)?.scans ?? (scansData as any)?.petScans ?? [];
    if (!scans.length) return;
    (async () => {
      try {
        await kvSetIds("dg_read_scan_ids", scans.map((s: any) => s.id));
        queryClient.invalidateQueries({ queryKey: ["scan-alerts-badge"] });
      } catch {
        /* ignora */
      }
    })();
  }, [scansData]);

  const loading = loadPets || loadV || loadA || loadDw || loadScans;

  // Apagar um aviso de QR code — guardado no SERVIDOR, para não voltar a
  // aparecer quando a app é fechada e reaberta.
  const dismissScan = useCallback(async (scanId: string) => {
    try {
      await authFetch(`${API_URL}/api/pet-scans/${scanId}/dismiss`, { method: "POST" });
    } catch {
      /* offline — fica escondido localmente e tenta na próxima vez */
    }
    queryClient.invalidateQueries({ queryKey: ["qr-scans-notif"] });
    queryClient.invalidateQueries({ queryKey: ["scan-alerts-badge"] });
  }, [queryClient]);

  // "Já encontrei o meu animal" — fecha todos os avisos daquele animal.
  const markFound = useCallback((petId: string, petName: string) => {
    Alert.alert(
      tr("Já encontrei!"),
      `Confirmar que ${petName || tr("o seu animal")} já está em casa? Os avisos deste animal deixam de aparecer.`,
      [
        { text: tr("Cancelar"), style: "cancel" },
        {
          text: tr("Sim, já está em casa"),
          onPress: async () => {
            try {
              await authFetch(`${API_URL}/api/pet-scans/pet/${petId}/found`, { method: "POST" });
            } catch {
              Alert.alert(tr("Sem ligação"), tr("Não foi possível guardar. Tente outra vez com internet."));
              return;
            }
            queryClient.invalidateQueries({ queryKey: ["qr-scans-notif"] });
            queryClient.invalidateQueries({ queryKey: ["scan-alerts-badge"] });
            Alert.alert(tr("Que alívio!"), tr("Os avisos deste animal foram encerrados. 🐾"));
          },
        },
      ],
    );
  }, [queryClient]);

  // Build notifications list
  const notifications: { id: string; emoji: string; title: string; body: string; time: string; urgency: "high" | "medium" | "low"; url?: string; scanId?: string; petId?: string; petName?: string }[] = [];

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
    if (hasCoords) parts.push(tr("Toca para ver no mapa"));
    notifications.push({
      id: `scan-${sc.id}`,
      emoji: "\ud83d\udea8",
      title: `QR code digitalizado — ${sc.petName || tr("o teu animal")}`,
      body: parts.length ? parts.join(" · ") : tr("Alguém digitalizou o QR code do teu animal."),
      time: when ? when.toLocaleString("pt-PT") : "",
      urgency: "high",
      url: hasCoords ? `https://www.google.com/maps?q=${sc.lat},${sc.lng}` : undefined,
      scanId: sc.id,
      petId: sc.petId,
      petName: sc.petName,
    });
  });

  // Remove os avisos que a utilizadora já apagou
  const visible = notifications.filter((n) => !dismissed.includes(n.id));

  // Animais que TÊM avisos de QR activos neste momento. A caixa verde do
  // "Já encontrei" só aparece para estes — depois de confirmar que o animal
  // voltou, os avisos desaparecem e a caixa desaparece com eles.
  const petsComAviso = pets.filter((p: any) =>
    visible.some((n) => n.scanId && n.petId === p.id),
  );

  // Sort: high first
  visible.sort((a, b) => {
    const ord = { high: 0, medium: 1, low: 2 };
    return ord[a.urgency] - ord[b.urgency];
  });

  const clearAll = () => {
    if (!visible.length) return;
    Alert.alert(
      tr("Limpar notificações"),
      `Apagar as ${visible.length} notificações da lista? Os lembretes de vacinas e consultas continuam guardados na ficha de cada animal.`,
      [
        { text: tr("Cancelar"), style: "cancel" },
        {
          text: tr("Limpar"),
          style: "destructive",
          onPress: async () => {
            const next = [...dismissed, ...visible.map((n) => n.id)];
            setDismissed(next);
            await kvSetIds(DISMISSED_KEY, next, 40);
            // Os avisos de QR code sao apagados tambem no servidor, senao
            // voltavam a aparecer ao reabrir a app.
            for (const n of visible) if (n.scanId) await dismissScan(n.scanId);
            queryClient.invalidateQueries({ queryKey: ["scan-alerts-badge"] });
          },
        },
      ],
    );
  };

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
        <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "800", color: BROWN, flex: 1 }}>{tr("Notificações 🔔")}</Text>
        {visible.length > 0 && (
          <TouchableOpacity
            onPress={clearAll}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: BORDER }}>
            <Trash2 size={15} color={BROWN} />
            <Text suppressHighlighting style={{ color: BROWN, fontWeight: "800", fontSize: 12 }}>{tr("Limpar")}</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading || !dismissLoaded ? (
        <ActivityIndicator color="#E07A3A" size="large" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 10 }}>
          {/* Botão sempre visível: encerra os avisos de QR de um animal que já
              voltou para casa. Antes só aparecia dentro do cartão de aviso,
              por isso quem já tinha limpado os avisos não o encontrava. */}
          {petsComAviso.length > 0 && (
            <View style={{ backgroundColor: "#ECFDF5", borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "#A7F3D0", gap: 10 }}>
              <Text suppressHighlighting style={{ fontWeight: "800", color: "#065F46", fontSize: 13 }}>
                O seu animal já voltou para casa? 🏠
              </Text>
              <Text suppressHighlighting style={{ color: "#047857", fontSize: 12, lineHeight: 18 }}>
                Confirme aqui e os avisos do QR code desse animal deixam de aparecer.
              </Text>
              {pets.map((p: any) => (
                <TouchableOpacity
                  key={`found-${p.id}`}
                  onPress={() => markFound(p.id, p.name ?? "")}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 8,
                    backgroundColor: "#16A34A", borderRadius: 12,
                    paddingHorizontal: 14, paddingVertical: 11, alignSelf: "flex-start",
                  }}>
                  <Check size={16} color="#fff" />
                  <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>
                    {tr("Já encontrei")} {p.name ? `o ${p.name}` : tr("o meu animal")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {visible.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Text suppressHighlighting style={{ fontSize: 60, marginBottom: 16 }}>✅</Text>
              <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: BROWN, marginBottom: 8 }}>{tr("Tudo em dia!")}</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 14, textAlign: "center", lineHeight: 22 }}>
                Os teus animais estão com as vacinas e desparasitações em dia. Continua assim! 🐾
              </Text>
            </View>
          ) : (
            visible.map((n) => {
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
                    {n.petId ? (
                      <TouchableOpacity
                        onPress={() => markFound(n.petId!, n.petName ?? "")}
                        style={{
                          marginTop: 10, alignSelf: "flex-start", flexDirection: "row",
                          alignItems: "center", gap: 6, backgroundColor: "#16A34A",
                          borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9,
                        }}>
                        <Check size={15} color="#fff" />
                        <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>
                          {tr("Já encontrei")} {n.petName ? `o ${n.petName}` : tr("o meu animal")}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => { dismissOne(n.id); if (n.scanId) dismissScan(n.scanId); }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.05)", alignItems: "center", justifyContent: "center" }}>
                    <X size={15} color={GRAY} />
                  </TouchableOpacity>
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
