import { useState, useCallback, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator,
  Alert, KeyboardAvoidingView, Platform, Modal, RefreshControl, Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft, Plus, Pill, Stethoscope, Syringe, CalendarClock, Bell, X, Trash2, Check, Clock,
} from "lucide-react-native";
import { BASE_URL } from "../lib/api";
import { netError } from "../lib/net-error";
import { AnimatedPetGroup } from "../components/AnimatedPet";
import { authFetch } from "../lib/auth-fetch";
import { DateFieldPT } from "../components/DateFieldPT";
import { tr } from "../lib/i18n";

const TEAL = "#4ECDC4";
const BG = "#F2FBFA";

const KINDS = [
  { key: "medication", label: "Medicação", icon: Pill, color: "#EF4444" },
  { key: "treatment", label: "Tratamento", icon: Stethoscope, color: "#8B5CF6" },
  { key: "vaccine", label: "Vacina", icon: Syringe, color: "#10B981" },
  { key: "appointment", label: tr("Consulta"), icon: CalendarClock, color: "#3B82F6" },
  { key: "other", label: "Outro", icon: Bell, color: "#6B7280" },
];

const FREQS = [
  { key: "daily", label: "Todos os dias" },
  { key: "weekly", label: "Semanal" },
  { key: "monthly", label: tr("Mensal") },
  { key: "interval", label: "A cada X dias" },
  { key: "once", label: "Uma só vez" },
];

function kindInfo(k?: string) {
  return KINDS.find((x) => x.key === k) ?? KINDS[4];
}

function getToken(): string {
  try {
    if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem("bearer_token") : null) ?? "";
    const SecureStore = require("expo-secure-store");
    return SecureStore.getItem("bearer_token") ?? "";
  } catch { return ""; }
}

const headers = () => ({ "Content-Type": "application/json" });

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function RemindersScreen() {
  const router = useRouter();
  const [items, setItems] = useState<any[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // formulário
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("medication");
  const [dosage, setDosage] = useState("");
  const [times, setTimes] = useState<string[]>(["08:00"]);
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [intervalDays, setIntervalDays] = useState("");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await authFetch(`${BASE_URL}/api/reminders`, { headers: headers() });
      const d = await res.json();
      setItems(d.reminders ?? []);
    } catch (e: any) {
      setItems([]);
      Alert.alert(tr("Erro"), netError(e));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setTitle(""); setKind("medication"); setDosage(""); setTimes(["08:00"]);
    setStartDate(todayISO()); setEndDate(""); setFrequency("daily"); setIntervalDays(""); setNotes("");
  }

  async function save() {
    if (!title.trim()) { Alert.alert(tr("Atenção"), tr("Escreve o nome da medicação ou tratamento.")); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) { Alert.alert(tr("Atenção"), tr("Indique a data de início no formato dia/mês/ano.")); return; }
    setSaving(true);
    try {
      const res = await authFetch(`${BASE_URL}/api/reminders`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          title: title.trim(), kind, dosage: dosage || null, notes: notes || null,
          startDate, endDate: endDate || null, times: times.filter(Boolean),
          frequency, intervalDays: frequency === "interval" ? Number(intervalDays) || 1 : null,
        }),
      });
      const d = await res.json();
      if (!res.ok) { Alert.alert(tr("Erro"), d.error || "Não foi possível guardar."); return; }
      setModal(false); resetForm(); await load();
    } catch (e: any) {
      Alert.alert(tr("Erro"), netError(e));
    } finally {
      setSaving(false);
    }
  }

  async function markDone(r: any) {
    try {
      await authFetch(`${BASE_URL}/api/reminders/${r.id}/done`, {
        method: "POST", headers: headers(), body: JSON.stringify({}),
      });
      Alert.alert("Registado", `Dose de "${r.title}" marcada como dada. ✓`);
    } catch (e: any) {
      Alert.alert(tr("Erro"), netError(e));
    }
  }

  async function remove(r: any) {
    Alert.alert(tr("Apagar lembrete"), `Apagar "${r.title}"?`, [
      { text: tr("Cancelar"), style: "cancel" },
      {
        text: tr("Apagar"), style: "destructive", onPress: async () => {
          try {
            await authFetch(`${BASE_URL}/api/reminders/${r.id}`, { method: "DELETE", headers: headers() });
            await load();
          } catch (e: any) { Alert.alert(tr("Erro"), netError(e)); }
        },
      },
    ]);
  }

  function addTime() { setTimes((t) => [...t, "20:00"]); }
  function setTime(i: number, v: string) {
    setTimes((t) => t.map((x, idx) => (idx === i ? v : x)));
  }
  function removeTime(i: number) {
    setTimes((t) => (t.length > 1 ? t.filter((_, idx) => idx !== i) : t));
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{ backgroundColor: TEAL, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#fff" }}>{tr("Lembretes")}</Text>
          <TouchableOpacity onPress={() => { resetForm(); setModal(true); }} style={{ padding: 4 }}>
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.9)", fontSize: 12.5, textAlign: "center", marginTop: 8 }}>
          Medicação, tratamentos, vacinas e consultas
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>

        {items === null && <ActivityIndicator color={TEAL} style={{ marginTop: 30 }} />}

        {items?.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <AnimatedPetGroup size={80} />
            <Text suppressHighlighting style={{ fontWeight: "800", fontSize: 16, color: "#1A1A2E", marginTop: 16 }}>{tr("Sem lembretes")}</Text>
            <Text suppressHighlighting style={{ color: "#9CA3AF", marginTop: 6, textAlign: "center", fontSize: 13.5, lineHeight: 20, paddingHorizontal: 30 }}>
              Cria lembretes para não te esqueceres de dar a medicação ou fazer um tratamento.
            </Text>
            <TouchableOpacity onPress={() => { resetForm(); setModal(true); }} style={{ backgroundColor: TEAL, borderRadius: 15, paddingVertical: 14, paddingHorizontal: 26, marginTop: 20 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 14.5 }}>{tr("Criar primeiro lembrete")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {items?.map((r) => {
          const info = kindInfo(r.kind);
          let hours: string[] = [];
          try { hours = JSON.parse(r.times || "[]"); } catch { hours = []; }
          return (
            <View key={r.id} style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: info.color + "18", alignItems: "center", justifyContent: "center", marginRight: 13 }}>
                  <info.icon size={20} color={info.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "800", fontSize: 15.5, color: "#1A1A2E" }}>{r.title}</Text>
                  <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 12, marginTop: 3 }}>
                    {info.label}{r.dosage ? ` · ${r.dosage}` : ""}
                  </Text>
                  {hours.length > 0 && (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                      {hours.map((h) => (
                        <View key={h} style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: BG, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8 }}>
                          <Clock size={11} color={TEAL} />
                          <Text suppressHighlighting style={{ fontSize: 11.5, fontWeight: "700", color: "#1A1A2E" }}>{h}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <Text suppressHighlighting style={{ color: "#C4C9D4", fontSize: 11, marginTop: 8 }}>
                    {FREQS.find((f) => f.key === r.frequency)?.label ?? r.frequency}
                    {r.endDate ? ` · até ${r.endDate}` : ""}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => remove(r)} style={{ padding: 5 }}>
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => markDone(r)}
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: TEAL + "16", borderRadius: 13, padding: 12, marginTop: 13 }}>
                <Check size={16} color={TEAL} />
                <Text suppressHighlighting style={{ color: TEAL, fontWeight: "800", fontSize: 13 }}>{tr("Já dei / já fiz")}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* MODAL novo lembrete */}
      <Modal visible={modal} animationType="slide" transparent onRequestClose={() => setModal(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView
              style={{ backgroundColor: "#fff", borderTopLeftRadius: 26, borderTopRightRadius: 26, maxHeight: 680 }}
              contentContainerStyle={{ padding: 22, paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled">
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <Text suppressHighlighting style={{ fontSize: 19, fontWeight: "800", color: "#1A1A2E" }}>{tr("Novo lembrete")}</Text>
                <TouchableOpacity onPress={() => setModal(false)}><X size={22} color="#9CA3AF" /></TouchableOpacity>
              </View>

              <Label>{tr("Tipo")}</Label>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
                {KINDS.map((k) => {
                  const sel = kind === k.key;
                  return (
                    <TouchableOpacity
                      key={k.key}
                      onPress={() => setKind(k.key)}
                      style={{
                        flexDirection: "row", alignItems: "center", gap: 6,
                        borderWidth: 1.5, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 13,
                        borderColor: sel ? k.color : "#EDF1F1", backgroundColor: sel ? k.color + "12" : "#FAFCFC",
                      }}>
                      <k.icon size={15} color={sel ? k.color : "#9CA3AF"} />
                      <Text suppressHighlighting style={{ fontWeight: "700", fontSize: 13, color: sel ? k.color : "#6B7280" }}>{k.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Label>{tr("Nome")}</Label>
              <Input value={title} onChangeText={setTitle} placeholder={tr("Ex: Amoxicilina, Pomada, Antipulgas")} />

              <Label>Dose (opcional)</Label>
              <Input value={dosage} onChangeText={setDosage} placeholder={tr("Ex: 1 comprimido, 5ml, 2 gotas")} />

              <Label>{tr("Horas")}</Label>
              {times.map((t, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <TextInput
                    value={t}
                    onChangeText={(v) => setTime(i, v)}
                    placeholder="08:00"
                    placeholderTextColor="#C4C9D4"
                    keyboardType="numbers-and-punctuation"
                    maxLength={5}
                    style={{
                      flex: 1, borderWidth: 1.5, borderColor: "#EDF1F1", borderRadius: 13, padding: 13,
                      fontSize: 16, fontWeight: "700", color: "#1A1A2E", backgroundColor: "#FAFCFC", textAlign: "center", letterSpacing: 2,
                    }}
                  />
                  {times.length > 1 && (
                    <TouchableOpacity onPress={() => removeTime(i)} style={{ padding: 8 }}>
                      <X size={17} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity onPress={addTime} style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, marginBottom: 8 }}>
                <Plus size={15} color={TEAL} />
                <Text suppressHighlighting style={{ color: TEAL, fontWeight: "800", fontSize: 13 }}>{tr("Adicionar outra hora")}</Text>
              </TouchableOpacity>

              <Label>{tr("Frequência")}</Label>
              <View style={{ gap: 7, marginBottom: 16 }}>
                {FREQS.map((f) => {
                  const sel = frequency === f.key;
                  return (
                    <TouchableOpacity
                      key={f.key}
                      onPress={() => setFrequency(f.key)}
                      style={{
                        borderWidth: 1.5, borderRadius: 12, padding: 13,
                        borderColor: sel ? TEAL : "#EDF1F1", backgroundColor: sel ? TEAL + "10" : "#FAFCFC",
                      }}>
                      <Text suppressHighlighting style={{ fontWeight: "700", fontSize: 13.5, color: sel ? "#0F766E" : "#6B7280" }}>{f.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {frequency === "interval" && (
                <>
                  <Label>{tr("A cada quantos dias?")}</Label>
                  <Input value={intervalDays} onChangeText={setIntervalDays} placeholder="Ex: 3" keyboardType="number-pad" />
                </>
              )}

              <Label>{tr("Data de início")}</Label>
              <DateFieldPT label="" value={startDate} onChange={setStartDate} />

              <Label>{tr("Data de fim (opcional)")}</Label>
              <DateFieldPT label="" value={endDate} onChange={setEndDate} showToday={false} />

              <Label>Notas (opcional)</Label>
              <Input value={notes} onChangeText={setNotes} placeholder={tr("Ex: dar com comida")} />

              <TouchableOpacity
                onPress={save}
                disabled={saving}
                style={{ backgroundColor: TEAL, borderRadius: 15, padding: 16, alignItems: "center", marginTop: 12, opacity: saving ? 0.7 : 1 }}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15.5 }}>{tr("Guardar lembrete")}</Text>}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Label({ children }: any) {
  return (
    <Text suppressHighlighting style={{ fontSize: 12.5, fontWeight: "700", color: "#6B7280", marginBottom: 6 }}>{children}</Text>
  );
}

function Input(props: any) {
  return (
    <TextInput
      {...props}
      placeholderTextColor="#C4C9D4"
      style={{
        borderWidth: 1.5, borderColor: "#EDF1F1", borderRadius: 13, padding: 14,
        fontSize: 15, color: "#1A1A2E", backgroundColor: "#FAFCFC", marginBottom: 14,
      }}
    />
  );
}
