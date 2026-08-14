import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, Modal, Image, Platform
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import {
  ChevronLeft, Plus, Syringe, Calendar, FileText, X,
  Heart, Weight, Bug, Trash2, Upload, Camera
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../../lib/api";
import { uploadImage } from "../../../lib/upload";
import { netError } from "../../../lib/net-error";

type Tab = "vaccines" | "appointments" | "documents" | "diary" | "deworming" | "weight" | "prescriptions";

const TABS: { key: Tab; label: string; icon: any; color: string }[] = [
  { key: "vaccines",      label: "Vacinas",     icon: Syringe,   color: "#4ECDC4" },
  { key: "appointments",  label: "Consultas",   icon: Calendar,  color: "#FF6B35" },
  { key: "prescriptions", label: "Receitas",    icon: FileText,  color: "#8B5CF6" },
  { key: "documents",     label: "Documentos",  icon: FileText,  color: "#06D6A0" },
  { key: "diary",         label: "Diário",      icon: Heart,     color: "#EF476F" },
  { key: "deworming",     label: "Desparasit.", icon: Bug,       color: "#F59E0B" },
  { key: "weight",        label: "Peso",        icon: Weight,    color: "#3B82F6" },
];

// ─── Upload helper ──────────────────────────────────────────────────────────
async function uploadFile(uri: string, filename: string, mimeType: string): Promise<string> {
  return uploadImage(uri, mimeType ?? "image/jpeg");
}

// ─── Reusable form field ─────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, keyboardType }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: "#1A1A2E", marginBottom: 5 }}>{label}</Text>
      <TextInput
        value={value} onChangeText={onChange} placeholder={placeholder}
        placeholderTextColor="#9CA3AF" keyboardType={keyboardType ?? "default"}
        style={{ backgroundColor: "#FFF9F5", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 14, padding: 12, fontSize: 14, color: "#1A1A2E" }}
      />
    </View>
  );
}

// ─── Upload button ────────────────────────────────────────────────────────────
function UploadButton({ label, url, onUpload, loading }: { label: string; url: string | null; onUpload: (uri: string, name: string, mime: string) => void; loading?: boolean }) {
  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.8 });
    if (!res.canceled && res.assets[0]) {
      const a = res.assets[0];
      const mime = a.mimeType ?? "image/jpeg";
      const name = a.fileName ?? `upload_${Date.now()}.jpg`;
      onUpload(a.uri, name, mime);
    }
  };
  const camera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permissão necessária", "Ative o acesso à câmara nas definições."); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled && res.assets[0]) {
      const a = res.assets[0];
      const mime = a.mimeType ?? "image/jpeg";
      const name = a.fileName ?? `photo_${Date.now()}.jpg`;
      onUpload(a.uri, name, mime);
    }
  };
  return (
    <View style={{ marginBottom: 12 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: "#1A1A2E", marginBottom: 5 }}>{label}</Text>
      {url ? (
        <View style={{ alignItems: "center" }}>
          <Image source={{ uri: url }} style={{ width: "100%", height: 120, borderRadius: 12, resizeMode: "cover" }} />
          <TouchableOpacity onPress={pick} style={{ marginTop: 6 }}>
            <Text suppressHighlighting style={{ color: "#FF6B35", fontSize: 12, fontWeight: "600" }}>Trocar ficheiro</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <ActivityIndicator color="#FF6B35" style={{ marginVertical: 8 }} />
      ) : (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity onPress={pick}
            style={{ flex: 1, borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 14, borderStyle: "dashed", padding: 12, alignItems: "center", gap: 4 }}>
            <Upload size={18} color="#FF6B35" />
            <Text suppressHighlighting style={{ fontSize: 11, color: "#FF6B35", fontWeight: "600" }}>Escolher ficheiro</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={camera}
            style={{ flex: 1, borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 14, borderStyle: "dashed", padding: 12, alignItems: "center", gap: 4 }}>
            <Camera size={18} color="#FF6B35" />
            <Text suppressHighlighting style={{ fontSize: 11, color: "#FF6B35", fontWeight: "600" }}>Tirar foto</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ emoji, text, onAdd }: { emoji: string; text: string; onAdd: () => void }) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 40 }}>
      <Text suppressHighlighting style={{ fontSize: 44 }}>{emoji}</Text>
      <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 8, textAlign: "center", paddingHorizontal: 20 }}>{text}</Text>
      <TouchableOpacity onPress={onAdd}
        style={{ backgroundColor: "#FF6B35", borderRadius: 14, paddingHorizontal: 20, paddingVertical: 10, marginTop: 16 }}>
        <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700" }}>+ Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function PetHealthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, tab: tabParam } = useLocalSearchParams<{ id: string; tab?: string }>();
  const qc = useQueryClient();
  const validTabs: Tab[] = ["vaccines","appointments","documents","diary","deworming","weight","prescriptions"];
  const [tab, setTab] = useState<Tab>((validTabs.includes(tabParam as Tab) ? tabParam : "vaccines") as Tab);
  const [modal, setModal] = useState<Tab | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // ── Vaccine form ──
  const [vName, setVName] = useState("");
  const [vDate, setVDate] = useState("");
  const [vNext, setVNext] = useState("");
  const [vVet, setVVet] = useState("");
  const [vClinic, setVClinic] = useState("");
  const [vBatch, setVBatch] = useState("");
  const [vNotes, setVNotes] = useState("");
  const [vDocUrl, setVDocUrl] = useState<string | null>(null);

  // ── Appointment form ──
  const [aTitle, setATitle] = useState("");
  const [aDate, setADate] = useState("");
  const [aTime, setATime] = useState("");
  const [aVet, setAVet] = useState("");
  const [aClinic, setAClinic] = useState("");
  const [aNotes, setANotes] = useState("");
  const [aType, setAType] = useState("consulta");

  // ── Document form ──
  const [dTitle, setDTitle] = useState("");
  const [dType, setDType] = useState("outro");
  const [dNotes, setDNotes] = useState("");
  const [dUrl, setDUrl] = useState<string | null>(null);

  // ── Prescription form (uses documents table with type=receita) ──
  const [pTitle, setPTitle] = useState("");
  const [pNotes, setPNotes] = useState("");
  const [pUrl, setPUrl] = useState<string | null>(null);

  // ── Diary form ──
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryDesc, setDiaryDesc] = useState("");
  const [diaryDate, setDiaryDate] = useState("");
  const [diaryType, setDiaryType] = useState("outro");

  // ── Deworming form ──
  const [dwProduct, setDwProduct] = useState("");
  const [dwDate, setDwDate] = useState("");
  const [dwNext, setDwNext] = useState("");
  const [dwType, setDwType] = useState("internal");
  const [dwNotes, setDwNotes] = useState("");
  const [dwDocUrl, setDwDocUrl] = useState<string | null>(null);

  // ── Weight form ──
  const [wWeight, setWWeight] = useState("");
  const [wDate, setWDate] = useState("");
  const [wNotes, setWNotes] = useState("");

  // ── Queries ──
  const { data: vaccinesData, isLoading: loadV } = useQuery({
    queryKey: ["vaccines", id],
    queryFn: async () => (await api.vaccines["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const { data: apptData, isLoading: loadA } = useQuery({
    queryKey: ["appointments", id],
    queryFn: async () => (await api.appointments["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const { data: docsData, isLoading: loadD } = useQuery({
    queryKey: ["documents", id],
    queryFn: async () => (await api.documents["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const { data: logsData, isLoading: loadL } = useQuery({
    queryKey: ["health-logs", id],
    queryFn: async () => (await (api as any)["health-logs"]["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const { data: dewData, isLoading: loadDw } = useQuery({
    queryKey: ["dewormings", id],
    queryFn: async () => (await (api as any).dewormings["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const { data: weightData, isLoading: loadW } = useQuery({
    queryKey: ["weight-logs", id],
    queryFn: async () => (await (api as any)["weight-logs"]["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });

  const vaccines = (vaccinesData as any)?.vaccines ?? [];
  const appointments = (apptData as any)?.appointments ?? [];
  const allDocs = (docsData as any)?.documents ?? [];
  const docs = allDocs.filter((d: any) => d.type !== "receita");
  const prescriptions = allDocs.filter((d: any) => d.type === "receita");
  const diaryLogs = (logsData as any)?.logs ?? [];
  const dewormings = (dewData as any)?.dewormings ?? [];
  const weightLogs = (weightData as any)?.weightLogs ?? [];

  // ── Mutations ──
  const reset = useCallback((keys: string[]) => {
    if (keys.includes("v")) { setVName(""); setVDate(""); setVNext(""); setVVet(""); setVClinic(""); setVBatch(""); setVNotes(""); setVDocUrl(null); }
    if (keys.includes("a")) { setATitle(""); setADate(""); setATime(""); setAVet(""); setAClinic(""); setANotes(""); setAType("consulta"); }
    if (keys.includes("d")) { setDTitle(""); setDType("outro"); setDNotes(""); setDUrl(null); }
    if (keys.includes("p")) { setPTitle(""); setPNotes(""); setPUrl(null); }
    if (keys.includes("diary")) { setDiaryTitle(""); setDiaryDesc(""); setDiaryDate(""); setDiaryType("outro"); }
    if (keys.includes("dw")) { setDwProduct(""); setDwDate(""); setDwNext(""); setDwType("internal"); setDwNotes(""); setDwDocUrl(null); }
    if (keys.includes("w")) { setWWeight(""); setWDate(""); setWNotes(""); }
  }, []);

  const addVaccine = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const res = await api.vaccines.$post({ json: { petId: id, name: vName, date: vDate || today, nextDate: vNext || undefined, veterinarian: vVet || undefined, clinic: vClinic || undefined, batch: vBatch || undefined, notes: vNotes || undefined, documentUrl: vDocUrl || undefined } });
      if (!res.ok) { const t = await res.text(); throw new Error(t.includes("<") ? "Erro no servidor" : t); }
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["vaccines", id] }); setModal(null); reset(["v"]); },
    onError: (e: any) => Alert.alert("Ups", netError(e)),
  });

  const addAppt = useMutation({
    mutationFn: async () => (await api.appointments.$post({ json: { petId: id, title: aTitle, type: aType, date: aDate, time: aTime || undefined, veterinarian: aVet || undefined, clinic: aClinic || undefined, notes: aNotes || undefined } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["appointments", id] }); setModal(null); reset(["a"]); },
    onError: (e: any) => Alert.alert("Ups", netError(e)),
  });

  const addDoc = useMutation({
    mutationFn: async (type: string) => (await api.documents.$post({ json: { petId: id, type, title: type === "receita" ? pTitle : dTitle, url: (type === "receita" ? pUrl : dUrl) ?? "", notes: type === "receita" ? pNotes || undefined : dNotes || undefined } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["documents", id] }); setModal(null); reset(["d", "p"]); },
    onError: (e: any) => Alert.alert("Ups", netError(e)),
  });

  const addDiary = useMutation({
    mutationFn: async () => (await (api as any)["health-logs"].$post({ json: { petId: id, type: diaryType, title: diaryTitle, description: diaryDesc || undefined, date: diaryDate || new Date().toISOString().slice(0, 10) } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["health-logs", id] }); setModal(null); reset(["diary"]); },
    onError: (e: any) => Alert.alert("Ups", netError(e)),
  });

  const addDeworming = useMutation({
    mutationFn: async () => (await (api as any).dewormings.$post({ json: { petId: id, product: dwProduct, date: dwDate, nextDate: dwNext || undefined, type: dwType, notes: dwNotes || undefined, documentUrl: dwDocUrl || undefined } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["dewormings", id] }); setModal(null); reset(["dw"]); },
    onError: (e: any) => Alert.alert("Ups", netError(e)),
  });

  const addWeight = useMutation({
    mutationFn: async () => (await (api as any)["weight-logs"].$post({ json: { petId: id, weight: parseFloat(wWeight), date: wDate || new Date().toISOString().slice(0, 10), notes: wNotes || undefined } })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["weight-logs", id] }); setModal(null); reset(["w"]); },
    onError: (e: any) => Alert.alert("Ups", netError(e)),
  });

  const deleteVaccine = (vid: string) => Alert.alert("Eliminar vacina?", "Esta ação não pode ser desfeita.", [
    { text: "Cancelar", style: "cancel" },
    { text: "Eliminar", style: "destructive", onPress: async () => { await (api as any).vaccines[":id"].$delete({ param: { id: vid } }); qc.invalidateQueries({ queryKey: ["vaccines", id] }); } },
  ]);
  const deleteDoc = (did: string) => Alert.alert("Eliminar?", "", [
    { text: "Cancelar", style: "cancel" },
    { text: "Eliminar", style: "destructive", onPress: async () => { await (api as any).documents[":id"].$delete({ param: { id: did } }); qc.invalidateQueries({ queryKey: ["documents", id] }); } },
  ]);
  const deleteDiary = (lid: string) => Alert.alert("Eliminar entrada?", "", [
    { text: "Cancelar", style: "cancel" },
    { text: "Eliminar", style: "destructive", onPress: async () => { await (api as any)["health-logs"][":id"].$delete({ param: { id: lid } }); qc.invalidateQueries({ queryKey: ["health-logs", id] }); } },
  ]);
  const deleteDeworming = (did: string) => Alert.alert("Eliminar?", "", [
    { text: "Cancelar", style: "cancel" },
    { text: "Eliminar", style: "destructive", onPress: async () => { await (api as any).dewormings[":id"].$delete({ param: { id: did } }); qc.invalidateQueries({ queryKey: ["dewormings", id] }); } },
  ]);
  const deleteWeight = (wid: string) => Alert.alert("Eliminar?", "", [
    { text: "Cancelar", style: "cancel" },
    { text: "Eliminar", style: "destructive", onPress: async () => { await (api as any)["weight-logs"][":id"].$delete({ param: { id: wid } }); qc.invalidateQueries({ queryKey: ["weight-logs", id] }); } },
  ]);

  const handleUpload = async (setter: (u: string) => void, uri: string, name: string, mime: string) => {
    setUploadingDoc(true);
    try {
      const url = await uploadFile(uri, name, mime);
      setter(url);
    } catch (e: any) {
      Alert.alert("Erro no upload", e.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const activeTab = TABS.find(t => t.key === tab)!;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#1A1A2E" }}>Saúde</Text>
        <TouchableOpacity onPress={() => setModal(tab)}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center" }}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab bar — horizontal scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}>
        {TABS.map((t) => (
          <TouchableOpacity key={t.key} onPress={() => setTab(t.key)}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: tab === t.key ? t.color : "#fff", borderWidth: 1.5, borderColor: tab === t.key ? t.color : "#F0E8E0" }}>
            <t.icon size={13} color={tab === t.key ? "#fff" : "#6B7280"} />
            <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: tab === t.key ? "#fff" : "#6B7280" }}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 0 , paddingBottom: Math.max(insets.bottom, 24) }}>

        {/* ── VACCINES ── */}
        {tab === "vaccines" && (
          loadV ? <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} /> :
          vaccines.length === 0 ? <EmptyState emoji="💉" text="Nenhuma vacina registada. Adicione a caderneta de vacinação do seu animal." onAdd={() => setModal("vaccines")} /> :
          vaccines.map((v: any) => (
            <View key={v.id} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#E8FAF9", alignItems: "center", justifyContent: "center" }}>
                  <Syringe size={20} color="#4ECDC4" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 15 }}>{v.name}</Text>
                  {v.date && <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>Administrada: {v.date}</Text>}
                  {v.veterinarian && <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>Dr(a). {v.veterinarian}{v.clinic ? ` — ${v.clinic}` : ""}</Text>}
                  {v.batch && <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>Lote: {v.batch}</Text>}
                  {v.nextDate && (
                    <View style={{ backgroundColor: "#FFF0EB", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 6 }}>
                      <Text suppressHighlighting style={{ color: "#FF6B35", fontSize: 11, fontWeight: "600" }}>📅 Próxima: {v.nextDate}</Text>
                    </View>
                  )}
                  {v.notes && <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 4, fontStyle: "italic" }}>{v.notes}</Text>}
                </View>
                <TouchableOpacity onPress={() => deleteVaccine(v.id)} style={{ padding: 4 }}>
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              {v.documentUrl && (
                <Image source={{ uri: v.documentUrl }} style={{ width: "100%", height: 120, borderRadius: 10, marginTop: 10, resizeMode: "cover" }} />
              )}
            </View>
          ))
        )}

        {/* ── APPOINTMENTS ── */}
        {tab === "appointments" && (
          loadA ? <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} /> :
          appointments.length === 0 ? <EmptyState emoji="📅" text="Nenhuma consulta registada." onAdd={() => setModal("appointments")} /> :
          appointments.map((a: any) => (
            <View key={a.id} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: "#F0E8E0", flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFF0EB", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={20} color="#FF6B35" />
              </View>
              <View style={{ flex: 1 }}>
                <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 15 }}>{a.title}</Text>
                <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>{a.date}{a.time ? ` às ${a.time}` : ""}</Text>
                {a.veterinarian && <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>Dr(a). {a.veterinarian}{a.clinic ? ` — ${a.clinic}` : ""}</Text>}
                {a.notes && <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 4, fontStyle: "italic" }}>{a.notes}</Text>}
                <View style={{ backgroundColor: "#F3EEFF", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 6 }}>
                  <Text suppressHighlighting style={{ color: "#8B5CF6", fontSize: 11, fontWeight: "600" }}>{a.type}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        {/* ── PRESCRIPTIONS ── */}
        {tab === "prescriptions" && (
          loadD ? <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} /> :
          prescriptions.length === 0 ? <EmptyState emoji="💊" text="Nenhuma receita médica. Tire uma foto ou faça upload da receita." onAdd={() => setModal("prescriptions")} /> :
          prescriptions.map((d: any) => (
            <View key={d.id} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#F3EEFF", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={20} color="#8B5CF6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 15 }}>{d.title}</Text>
                  {d.notes && <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>{d.notes}</Text>}
                </View>
                <TouchableOpacity onPress={() => deleteDoc(d.id)} style={{ padding: 4 }}>
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              {d.url && (
                <Image source={{ uri: d.url }} style={{ width: "100%", height: 160, borderRadius: 10, marginTop: 10, resizeMode: "cover" }} />
              )}
            </View>
          ))
        )}

        {/* ── DOCUMENTS ── */}
        {tab === "documents" && (
          loadD ? <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} /> :
          docs.length === 0 ? <EmptyState emoji="📄" text="Nenhum documento. Adicione passaporte, licenças, exames ou outros documentos." onAdd={() => setModal("documents")} /> :
          docs.map((d: any) => (
            <View key={d.id} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#E6FAF5", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={20} color="#06D6A0" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 15 }}>{d.title}</Text>
                  <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>{d.type}</Text>
                  {d.notes && <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>{d.notes}</Text>}
                </View>
                <TouchableOpacity onPress={() => deleteDoc(d.id)} style={{ padding: 4 }}>
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              {d.url && (
                <Image source={{ uri: d.url }} style={{ width: "100%", height: 160, borderRadius: 10, marginTop: 10, resizeMode: "cover" }} />
              )}
            </View>
          ))
        )}

        {/* ── DIARY ── */}
        {tab === "diary" && (
          loadL ? <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} /> :
          diaryLogs.length === 0 ? <EmptyState emoji="📓" text="Nenhuma entrada no diário de saúde. Registe sintomas, comportamentos, medicações e mais." onAdd={() => setModal("diary")} /> :
          diaryLogs.map((l: any) => (
            <View key={l.id} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: "#F0E8E0", flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFF0F3", alignItems: "center", justifyContent: "center" }}>
                <Heart size={20} color="#EF476F" />
              </View>
              <View style={{ flex: 1 }}>
                <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 15 }}>{l.title}</Text>
                <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>{l.date} · {l.type}</Text>
                {l.description && <Text suppressHighlighting style={{ color: "#374151", fontSize: 13, marginTop: 4 }}>{l.description}</Text>}
              </View>
              <TouchableOpacity onPress={() => deleteDiary(l.id)} style={{ padding: 4 }}>
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* ── DEWORMING ── */}
        {tab === "deworming" && (
          loadDw ? <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} /> :
          dewormings.length === 0 ? <EmptyState emoji="🐛" text="Nenhuma desparasitação registada." onAdd={() => setModal("deworming")} /> :
          dewormings.map((d: any) => (
            <View key={d.id} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFFBEB", alignItems: "center", justifyContent: "center" }}>
                  <Bug size={20} color="#F59E0B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 15 }}>{d.product}</Text>
                  <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>{d.date} · {d.type === "internal" ? "Interna" : d.type === "external" ? "Externa" : "Interna + Externa"}</Text>
                  {d.nextDate && (
                    <View style={{ backgroundColor: "#FFF0EB", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 6 }}>
                      <Text suppressHighlighting style={{ color: "#FF6B35", fontSize: 11, fontWeight: "600" }}>📅 Próxima: {d.nextDate}</Text>
                    </View>
                  )}
                  {d.notes && <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 4, fontStyle: "italic" }}>{d.notes}</Text>}
                </View>
                <TouchableOpacity onPress={() => deleteDeworming(d.id)} style={{ padding: 4 }}>
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              {d.documentUrl && (
                <Image source={{ uri: d.documentUrl }} style={{ width: "100%", height: 120, borderRadius: 10, marginTop: 10, resizeMode: "cover" }} />
              )}
            </View>
          ))
        )}

        {/* ── WEIGHT ── */}
        {tab === "weight" && (
          loadW ? <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} /> :
          weightLogs.length === 0 ? <EmptyState emoji="⚖️" text="Nenhum peso registado. Acompanhe o crescimento do seu animal." onAdd={() => setModal("weight")} /> : (
            <>
              {/* Latest weight highlight */}
              {weightLogs.length > 0 && (
                <View style={{ backgroundColor: "#EFF6FF", borderRadius: 20, padding: 20, marginBottom: 16, alignItems: "center" }}>
                  <Text suppressHighlighting style={{ color: "#3B82F6", fontSize: 13, fontWeight: "600" }}>Peso atual</Text>
                  <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 36, fontWeight: "800", marginTop: 4 }}>{weightLogs[weightLogs.length - 1].weight} kg</Text>
                  <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>{weightLogs[weightLogs.length - 1].date}</Text>
                </View>
              )}
              {[...weightLogs].reverse().map((w: any) => (
                <View key={w.id} style={{ backgroundColor: "#fff", borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1.5, borderColor: "#F0E8E0", flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" }}>
                    <Weight size={20} color="#3B82F6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 16 }}>{w.weight} kg</Text>
                    <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>{w.date}</Text>
                    {w.notes && <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, fontStyle: "italic" }}>{w.notes}</Text>}
                  </View>
                  <TouchableOpacity onPress={() => deleteWeight(w.id)} style={{ padding: 4 }}>
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )
        )}

      </ScrollView>

      {/* ════════════════════════ MODALS ════════════════════════ */}

      {/* Add Vaccine */}
      <Modal visible={modal === "vaccines"} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" }}>
          <ScrollView style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28 }} contentContainerStyle={{ padding: 24 , paddingBottom: Math.max(insets.bottom, 24) }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#1A1A2E" }}>Nova Vacina</Text>
              <TouchableOpacity onPress={() => setModal(null)}><X size={22} color="#6B7280" /></TouchableOpacity>
            </View>
            <Field label="Nome da vacina *" value={vName} onChange={setVName} placeholder="Ex: Raiva, Parvovírus, Esgana..." />
            <Field label="Data de administração" value={vDate} onChange={setVDate} placeholder="YYYY-MM-DD" />
            <Field label="Próxima dose" value={vNext} onChange={setVNext} placeholder="YYYY-MM-DD" />
            <Field label="Veterinário" value={vVet} onChange={setVVet} placeholder="Nome do médico veterinário" />
            <Field label="Clínica" value={vClinic} onChange={setVClinic} placeholder="Nome da clínica" />
            <Field label="Número de lote" value={vBatch} onChange={setVBatch} placeholder="Ex: AB12345" />
            <Field label="Notas" value={vNotes} onChange={setVNotes} placeholder="Observações..." />
            <UploadButton label="Caderneta / Comprovativo (foto ou PDF)" url={vDocUrl} loading={uploadingDoc}
              onUpload={(uri, name, mime) => handleUpload(setVDocUrl, uri, name, mime)} />
            <TouchableOpacity onPress={() => { if (!vName.trim()) { Alert.alert("Erro", "Nome é obrigatório"); return; } addVaccine.mutate(); }}
              disabled={addVaccine.isPending}
              style={{ backgroundColor: "#4ECDC4", borderRadius: 16, padding: 15, alignItems: "center", marginTop: 8, opacity: addVaccine.isPending ? 0.7 : 1 }}>
              {addVaccine.isPending ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Guardar Vacina</Text>}
            </TouchableOpacity>
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* Add Appointment */}
      <Modal visible={modal === "appointments"} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" }}>
          <ScrollView style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28 }} contentContainerStyle={{ padding: 24 , paddingBottom: Math.max(insets.bottom, 24) }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#1A1A2E" }}>Nova Consulta</Text>
              <TouchableOpacity onPress={() => setModal(null)}><X size={22} color="#6B7280" /></TouchableOpacity>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>Tipo</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 , paddingBottom: Math.max(insets.bottom, 24) }}>
                {["consulta", "vacina", "exame", "cirurgia", "outro"].map((t) => (
                  <TouchableOpacity key={t} onPress={() => setAType(t)}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: aType === t ? "#FF6B35" : "#FFF9F5", borderWidth: 1.5, borderColor: aType === t ? "#FF6B35" : "#F0E8E0" }}>
                    <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: aType === t ? "#fff" : "#6B7280" }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <Field label="Motivo *" value={aTitle} onChange={setATitle} placeholder="Ex: Check-up anual, Vacinação..." />
            <Field label="Data" value={aDate} onChange={setADate} placeholder="YYYY-MM-DD" />
            <Field label="Hora" value={aTime} onChange={setATime} placeholder="HH:MM" />
            <Field label="Veterinário" value={aVet} onChange={setAVet} placeholder="Nome do médico veterinário" />
            <Field label="Clínica / Hospital" value={aClinic} onChange={setAClinic} placeholder="Nome da clínica" />
            <Field label="Notas" value={aNotes} onChange={setANotes} placeholder="Observações..." />
            <TouchableOpacity onPress={() => { if (!aTitle.trim()) { Alert.alert("Erro", "Motivo é obrigatório"); return; } addAppt.mutate(); }}
              disabled={addAppt.isPending}
              style={{ backgroundColor: "#FF6B35", borderRadius: 16, padding: 15, alignItems: "center", marginTop: 8, opacity: addAppt.isPending ? 0.7 : 1 }}>
              {addAppt.isPending ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Guardar Consulta</Text>}
            </TouchableOpacity>
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* Add Prescription */}
      <Modal visible={modal === "prescriptions"} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" }}>
          <ScrollView style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28 }} contentContainerStyle={{ padding: 24 , paddingBottom: Math.max(insets.bottom, 24) }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#1A1A2E" }}>Nova Receita Médica</Text>
              <TouchableOpacity onPress={() => setModal(null)}><X size={22} color="#6B7280" /></TouchableOpacity>
            </View>
            <Field label="Título / Medicamento *" value={pTitle} onChange={setPTitle} placeholder="Ex: Antibiótico, Anti-inflamatório..." />
            <Field label="Notas / Posologia" value={pNotes} onChange={setPNotes} placeholder="Ex: 1 comprimido de manhã e à noite..." />
            <UploadButton label="Foto / Scan da receita" url={pUrl} loading={uploadingDoc}
              onUpload={(uri, name, mime) => handleUpload(setPUrl, uri, name, mime)} />
            <TouchableOpacity onPress={() => { if (!pTitle.trim()) { Alert.alert("Erro", "Título é obrigatório"); return; } if (!pUrl) { Alert.alert("Erro", "Por favor adicione uma foto ou ficheiro da receita"); return; } addDoc.mutate("receita"); }}
              disabled={addDoc.isPending}
              style={{ backgroundColor: "#8B5CF6", borderRadius: 16, padding: 15, alignItems: "center", marginTop: 8, opacity: addDoc.isPending ? 0.7 : 1 }}>
              {addDoc.isPending ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Guardar Receita</Text>}
            </TouchableOpacity>
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* Add Document */}
      <Modal visible={modal === "documents"} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" }}>
          <ScrollView style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28 }} contentContainerStyle={{ padding: 24 , paddingBottom: Math.max(insets.bottom, 24) }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#1A1A2E" }}>Novo Documento</Text>
              <TouchableOpacity onPress={() => setModal(null)}><X size={22} color="#6B7280" /></TouchableOpacity>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>Tipo de documento</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 , paddingBottom: Math.max(insets.bottom, 24) }}>
                {["passaporte", "licença", "exame", "seguro", "caderneta", "outro"].map((t) => (
                  <TouchableOpacity key={t} onPress={() => setDType(t)}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: dType === t ? "#06D6A0" : "#FFF9F5", borderWidth: 1.5, borderColor: dType === t ? "#06D6A0" : "#F0E8E0" }}>
                    <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: dType === t ? "#fff" : "#6B7280" }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <Field label="Título / Nome *" value={dTitle} onChange={setDTitle} placeholder="Ex: Passaporte Europeu, Licença Municipal..." />
            <Field label="Notas" value={dNotes} onChange={setDNotes} placeholder="Observações..." />
            <UploadButton label="Foto / Scan do documento" url={dUrl} loading={uploadingDoc}
              onUpload={(uri, name, mime) => handleUpload(setDUrl, uri, name, mime)} />
            <TouchableOpacity onPress={() => { if (!dTitle.trim()) { Alert.alert("Erro", "Título é obrigatório"); return; } if (!dUrl) { Alert.alert("Erro", "Por favor adicione uma foto ou ficheiro"); return; } addDoc.mutate(dType); }}
              disabled={addDoc.isPending}
              style={{ backgroundColor: "#06D6A0", borderRadius: 16, padding: 15, alignItems: "center", marginTop: 8, opacity: addDoc.isPending ? 0.7 : 1 }}>
              {addDoc.isPending ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Guardar Documento</Text>}
            </TouchableOpacity>
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* Add Diary Entry */}
      <Modal visible={modal === "diary"} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" }}>
          <ScrollView style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28 }} contentContainerStyle={{ padding: 24 , paddingBottom: Math.max(insets.bottom, 24) }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#1A1A2E" }}>Entrada no Diário</Text>
              <TouchableOpacity onPress={() => setModal(null)}><X size={22} color="#6B7280" /></TouchableOpacity>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 , paddingBottom: Math.max(insets.bottom, 24) }}>
                {["sintoma", "comportamento", "medicacao", "alimentacao", "peso", "outro"].map((t) => (
                  <TouchableOpacity key={t} onPress={() => setDiaryType(t)}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: diaryType === t ? "#EF476F" : "#FFF9F5", borderWidth: 1.5, borderColor: diaryType === t ? "#EF476F" : "#F0E8E0" }}>
                    <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: diaryType === t ? "#fff" : "#6B7280" }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <Field label="Título *" value={diaryTitle} onChange={setDiaryTitle} placeholder="Ex: Vómito após refeição, Letargia..." />
            <Field label="Data" value={diaryDate} onChange={setDiaryDate} placeholder={`YYYY-MM-DD (hoje: ${new Date().toISOString().slice(0, 10)})`} />
            <View style={{ marginBottom: 12 }}>
              <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: "#1A1A2E", marginBottom: 5 }}>Descrição</Text>
              <TextInput value={diaryDesc} onChangeText={setDiaryDesc} placeholder="Descreva em detalhe o que observou..." placeholderTextColor="#9CA3AF" multiline numberOfLines={4}
                style={{ backgroundColor: "#FFF9F5", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 14, padding: 12, fontSize: 14, color: "#1A1A2E", minHeight: 100, textAlignVertical: "top" }} />
            </View>
            <TouchableOpacity onPress={() => { if (!diaryTitle.trim()) { Alert.alert("Erro", "Título é obrigatório"); return; } addDiary.mutate(); }}
              disabled={addDiary.isPending}
              style={{ backgroundColor: "#EF476F", borderRadius: 16, padding: 15, alignItems: "center", marginTop: 8, opacity: addDiary.isPending ? 0.7 : 1 }}>
              {addDiary.isPending ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Guardar Entrada</Text>}
            </TouchableOpacity>
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* Add Deworming */}
      <Modal visible={modal === "deworming"} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" }}>
          <ScrollView style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28 }} contentContainerStyle={{ padding: 24 , paddingBottom: Math.max(insets.bottom, 24) }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#1A1A2E" }}>Nova Desparasitação</Text>
              <TouchableOpacity onPress={() => setModal(null)}><X size={22} color="#6B7280" /></TouchableOpacity>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>Tipo</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[{ k: "internal", l: "Interna" }, { k: "external", l: "Externa" }, { k: "both", l: "Ambas" }].map((t) => (
                  <TouchableOpacity key={t.k} onPress={() => setDwType(t.k)}
                    style={{ flex: 1, paddingVertical: 10, borderRadius: 14, backgroundColor: dwType === t.k ? "#F59E0B" : "#FFF9F5", borderWidth: 1.5, borderColor: dwType === t.k ? "#F59E0B" : "#F0E8E0", alignItems: "center" }}>
                    <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: dwType === t.k ? "#fff" : "#6B7280" }}>{t.l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Field label="Produto *" value={dwProduct} onChange={setDwProduct} placeholder="Ex: Frontline, Milbemax, Advocate..." />
            <Field label="Data de aplicação" value={dwDate} onChange={setDwDate} placeholder="YYYY-MM-DD" />
            <Field label="Próxima aplicação" value={dwNext} onChange={setDwNext} placeholder="YYYY-MM-DD" />
            <Field label="Notas" value={dwNotes} onChange={setDwNotes} placeholder="Observações..." />
            <UploadButton label="Comprovativo / Foto" url={dwDocUrl} loading={uploadingDoc}
              onUpload={(uri, name, mime) => handleUpload(setDwDocUrl, uri, name, mime)} />
            <TouchableOpacity onPress={() => { if (!dwProduct.trim()) { Alert.alert("Erro", "Produto é obrigatório"); return; } addDeworming.mutate(); }}
              disabled={addDeworming.isPending}
              style={{ backgroundColor: "#F59E0B", borderRadius: 16, padding: 15, alignItems: "center", marginTop: 8, opacity: addDeworming.isPending ? 0.7 : 1 }}>
              {addDeworming.isPending ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Guardar Desparasitação</Text>}
            </TouchableOpacity>
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* Add Weight */}
      <Modal visible={modal === "weight"} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" }}>
          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#1A1A2E" }}>Registar Peso</Text>
              <TouchableOpacity onPress={() => setModal(null)}><X size={22} color="#6B7280" /></TouchableOpacity>
            </View>
            <Field label="Peso (kg) *" value={wWeight} onChange={setWWeight} placeholder="Ex: 4.5" keyboardType="decimal-pad" />
            <Field label="Data" value={wDate} onChange={setWDate} placeholder={`YYYY-MM-DD (hoje: ${new Date().toISOString().slice(0, 10)})`} />
            <Field label="Notas" value={wNotes} onChange={setWNotes} placeholder="Observações..." />
            <TouchableOpacity onPress={() => { if (!wWeight || isNaN(parseFloat(wWeight))) { Alert.alert("Erro", "Insira um peso válido"); return; } addWeight.mutate(); }}
              disabled={addWeight.isPending}
              style={{ backgroundColor: "#3B82F6", borderRadius: 16, padding: 15, alignItems: "center", marginTop: 8, opacity: addWeight.isPending ? 0.7 : 1 }}>
              {addWeight.isPending ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Guardar Peso</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
