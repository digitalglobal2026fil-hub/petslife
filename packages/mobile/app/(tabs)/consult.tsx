import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput,
  Alert, Linking, ActivityIndicator, Platform
} from "react-native";
import { Video, Calendar, Plus, X } from "lucide-react-native";
import Constants from "expo-constants";

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl ?? process.env.EXPO_PUBLIC_API_URL) as string ?? "http://localhost:5173";

const TOKEN_KEY = "bearer_token";
function getToken(): string {
  if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null) ?? "";
  const SecureStore = require("expo-secure-store");
  return SecureStore.getItem(TOKEN_KEY) ?? "";
}

const SPECIALTIES = ["Geral", "Dermatologia", "Ortopedia", "Oncologia", "Comportamento", "Nutrição", "Outro"];
const DURATIONS = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
];

interface Consultation {
  id: string;
  vetName: string | null;
  specialty: string | null;
  scheduledAt: number | null;
  duration: number;
  status: string;
  roomUrl: string | null;
  notes: string | null;
}

async function fetchConsultations(): Promise<Consultation[]> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/consultations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.consultations ?? [];
}

async function bookConsultation(payload: Record<string, unknown>): Promise<Consultation | null> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/consultations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.consultation ?? null;
}

async function cancelConsultation(id: string): Promise<void> {
  const token = getToken();
  await fetch(`${API_URL}/api/consultations/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    pending:   { label: "Pendente",    color: "#B45309", bg: "#FEF3C7" },
    confirmed: { label: "Confirmada",  color: "#047857", bg: "#D1FAE5" },
    ongoing:   { label: "Em curso",    color: "#1D4ED8", bg: "#DBEAFE" },
    done:      { label: "Concluída",   color: "#6B7280", bg: "#F3F4F6" },
    cancelled: { label: "Cancelada",   color: "#B91C1C", bg: "#FEE2E2" },
  };
  const s = map[status] ?? map.pending;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text suppressHighlighting style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

export default function ConsultScreen() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [vetName, setVetName] = useState("");
  const [vetEmail, setVetEmail] = useState("");
  const [specialty, setSpecialty] = useState("Geral");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await fetchConsultations();
    setConsultations(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleBook = async () => {
    if (!date || !time) {
      Alert.alert("Atenção", "Por favor preencha a data e hora.");
      return;
    }
    setSaving(true);
    const scheduledAt = new Date(`${date}T${time}`).toISOString();
    const result = await bookConsultation({ vetName, vetEmail, specialty, scheduledAt, duration, notes });
    setSaving(false);
    if (result) {
      setShowModal(false);
      resetForm();
      load();
      Alert.alert("Consulta agendada!", "Receberá o link de videochamada em breve.");
    } else {
      Alert.alert("Erro", "Não foi possível agendar. Tente novamente.");
    }
  };

  const handleCancel = (id: string) => {
    Alert.alert("Cancelar consulta", "Tem a certeza?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim, cancelar", style: "destructive",
        onPress: async () => { await cancelConsultation(id); load(); },
      },
    ]);
  };

  const handleJoin = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert("Erro", "Não foi possível abrir a videochamada."));
  };

  const resetForm = () => {
    setVetName(""); setVetEmail(""); setSpecialty("Geral");
    setDate(""); setTime(""); setDuration(30); setNotes("");
  };

  const formatDate = (ts: number | null) => {
    if (!ts) return "—";
    const d = new Date(ts);
    return d.toLocaleString("pt-PT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const upcoming = consultations.filter(c => ["pending", "confirmed", "ongoing"].includes(c.status));
  const past = consultations.filter(c => ["done", "cancelled"].includes(c.status));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text suppressHighlighting style={styles.headerTitle}>Consulta Online</Text>
          <Text suppressHighlighting style={styles.headerSub}>Fale com o seu vet por videochamada</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Info card */}
      <View style={styles.infoCard}>
        <Video size={22} color="#4ECDC4" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text suppressHighlighting style={styles.infoTitle}>Como funciona?</Text>
          <Text suppressHighlighting style={styles.infoText}>
            Agende uma consulta, receba o link de videochamada e entre directamente aqui na app. Sem instalações, sem complicações.
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator color="#FF6B35" size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Upcoming */}
            <Text suppressHighlighting style={styles.sectionTitle}>Próximas consultas</Text>
            {upcoming.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text suppressHighlighting style={styles.emptyEmoji}>📅</Text>
                <Text suppressHighlighting style={styles.emptyTitle}>Nenhuma consulta agendada</Text>
                <Text suppressHighlighting style={styles.emptyText}>Agende a sua primeira consulta online com um veterinário.</Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={() => setShowModal(true)}>
                  <Text suppressHighlighting style={styles.emptyBtnText}>Agendar consulta</Text>
                </TouchableOpacity>
              </View>
            ) : (
              upcoming.map(c => (
                <View key={c.id} style={styles.card}>
                  <View style={styles.cardRow}>
                    <View style={styles.cardIcon}>
                      <Video size={20} color="#FF6B35" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text suppressHighlighting style={styles.cardTitle}>{c.vetName || "Veterinário"}</Text>
                      <Text suppressHighlighting style={styles.cardSub}>{c.specialty} · {c.duration} min</Text>
                    </View>
                    <StatusBadge status={c.status} />
                  </View>
                  <View style={styles.cardMeta}>
                    <Calendar size={14} color="#9CA3AF" />
                    <Text suppressHighlighting style={styles.cardMetaText}>{formatDate(c.scheduledAt)}</Text>
                  </View>
                  {c.notes ? <Text suppressHighlighting style={styles.cardNotes}>{c.notes}</Text> : null}
                  <View style={styles.cardActions}>
                    {c.roomUrl && (
                      <TouchableOpacity style={styles.joinBtn} onPress={() => handleJoin(c.roomUrl!)}>
                        <Video size={16} color="#fff" />
                        <Text suppressHighlighting style={styles.joinBtnText}>Entrar na chamada</Text>
                      </TouchableOpacity>
                    )}
                    {c.status !== "done" && c.status !== "cancelled" && (
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(c.id)}>
                        <X size={14} color="#EF4444" />
                        <Text suppressHighlighting style={styles.cancelBtnText}>Cancelar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}

            {/* Past */}
            {past.length > 0 && (
              <>
                <Text suppressHighlighting style={[styles.sectionTitle, { marginTop: 24 }]}>Histórico</Text>
                {past.map(c => (
                  <View key={c.id} style={[styles.card, { opacity: 0.7 }]}>
                    <View style={styles.cardRow}>
                      <View style={[styles.cardIcon, { backgroundColor: "#F3F4F6" }]}>
                        <Video size={20} color="#9CA3AF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text suppressHighlighting style={styles.cardTitle}>{c.vetName || "Veterinário"}</Text>
                        <Text suppressHighlighting style={styles.cardSub}>{c.specialty} · {c.duration} min</Text>
                      </View>
                      <StatusBadge status={c.status} />
                    </View>
                    <View style={styles.cardMeta}>
                      <Calendar size={14} color="#9CA3AF" />
                      <Text suppressHighlighting style={styles.cardMetaText}>{formatDate(c.scheduledAt)}</Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text suppressHighlighting style={styles.modalTitle}>Agendar consulta</Text>
            <TouchableOpacity onPress={() => { setShowModal(false); resetForm(); }}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text suppressHighlighting style={styles.fieldLabel}>Nome do veterinário (opcional)</Text>
            <TextInput style={styles.input} placeholder="Ex: Dr. António Silva" value={vetName} onChangeText={setVetName} />

            <Text suppressHighlighting style={styles.fieldLabel}>Email do vet (para enviar o link)</Text>
            <TextInput style={styles.input} placeholder="vet@clinica.pt" value={vetEmail} onChangeText={setVetEmail} keyboardType="email-address" autoCapitalize="none" />

            <Text suppressHighlighting style={styles.fieldLabel}>Especialidade</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {SPECIALTIES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, specialty === s && styles.chipActive]}
                  onPress={() => setSpecialty(s)}
                >
                  <Text suppressHighlighting style={[styles.chipText, specialty === s && styles.chipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text suppressHighlighting style={styles.fieldLabel}>Data (AAAA-MM-DD)</Text>
            <TextInput style={styles.input} placeholder="2025-06-15" value={date} onChangeText={setDate} keyboardType="numeric" />

            <Text suppressHighlighting style={styles.fieldLabel}>Hora (HH:MM)</Text>
            <TextInput style={styles.input} placeholder="14:30" value={time} onChangeText={setTime} keyboardType="numeric" />

            <Text suppressHighlighting style={styles.fieldLabel}>Duração</Text>
            <View style={styles.durationRow}>
              {DURATIONS.map(d => (
                <TouchableOpacity
                  key={d.value}
                  style={[styles.durationBtn, duration === d.value && styles.durationBtnActive]}
                  onPress={() => setDuration(d.value)}
                >
                  <Text suppressHighlighting style={[styles.durationText, duration === d.value && styles.durationTextActive]}>{d.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text suppressHighlighting style={styles.fieldLabel}>Motivo / Notas</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              placeholder="Descreva o motivo da consulta..."
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <View style={styles.infoBox}>
              <Text suppressHighlighting style={styles.infoBoxText}>
                💡 Após agendar, receberá um link de videochamada gratuito. Pode entrar directamente aqui na app ou partilhá-lo com o veterinário.
              </Text>
            </View>

            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleBook} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={styles.saveBtnText}>Agendar consulta</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F5" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: "#FFF9F5",
  },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#1A1A2E" },
  headerSub: { fontSize: 13, color: "#9CA3AF", marginTop: 2 },
  addBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: "#FF6B35",
    alignItems: "center", justifyContent: "center",
  },
  infoCard: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: "#E6F7F6", borderRadius: 16, padding: 16, marginHorizontal: 20, marginBottom: 20,
  },
  infoTitle: { fontSize: 13, fontWeight: "700", color: "#1A1A2E", marginBottom: 4 },
  infoText: { fontSize: 12, color: "#6B7280", lineHeight: 18 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginHorizontal: 20, marginBottom: 12 },
  emptyCard: {
    backgroundColor: "#fff", borderRadius: 20, padding: 32, marginHorizontal: 20,
    alignItems: "center", borderWidth: 1, borderColor: "#F0E8E0",
  },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginBottom: 6 },
  emptyText: { fontSize: 13, color: "#9CA3AF", textAlign: "center", marginBottom: 20 },
  emptyBtn: { backgroundColor: "#FF6B35", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginHorizontal: 20, marginBottom: 12,
    borderWidth: 1, borderColor: "#F0E8E0",
  },
  cardRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardIcon: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: "#FFF0EB",
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1A1A2E" },
  cardSub: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  cardMetaText: { fontSize: 12, color: "#9CA3AF" },
  cardNotes: { fontSize: 12, color: "#6B7280", fontStyle: "italic", marginBottom: 10 },
  cardActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  joinBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#FF6B35", borderRadius: 10, paddingVertical: 10, gap: 6,
  },
  joinBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  cancelBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#FCA5A5", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, gap: 4,
  },
  cancelBtnText: { color: "#EF4444", fontWeight: "600", fontSize: 13 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  // Modal
  modal: { flex: 1, backgroundColor: "#FFF9F5", padding: 20 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingTop: 8 },
  modalTitle: { fontSize: 22, fontWeight: "800", color: "#1A1A2E" },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: "#6B7280", marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E5E7EB",
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#1A1A2E", marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#F3F4F6", marginRight: 8, borderWidth: 1.5, borderColor: "transparent",
  },
  chipActive: { backgroundColor: "#FFF0EB", borderColor: "#FF6B35" },
  chipText: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  chipTextActive: { color: "#FF6B35" },
  durationRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  durationBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5,
    borderColor: "#E5E7EB", alignItems: "center", backgroundColor: "#fff",
  },
  durationBtnActive: { borderColor: "#FF6B35", backgroundColor: "#FFF0EB" },
  durationText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  durationTextActive: { color: "#FF6B35" },
  infoBox: { backgroundColor: "#FFF0EB", borderRadius: 12, padding: 14, marginBottom: 24 },
  infoBoxText: { fontSize: 13, color: "#9A3412", lineHeight: 20 },
  saveBtn: { backgroundColor: "#FF6B35", borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 40 },
  saveBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
