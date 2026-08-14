import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ChevronLeft, Calendar, Clock, Edit2, Trash2, Save, X, MapPin, FileText } from "lucide-react-native";
import Constants from "expo-constants";
import { authClient } from "../../lib/auth";
import { authFetch } from "../../lib/auth-fetch";
import { DateFieldPT } from "../../components/DateFieldPT";

const API_URL = ((Constants.expoConfig?.extra?.apiUrl as string) ?? process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4200").replace(/\/$/, "");

function getToken(): string {
  try {
    if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem("bearer_token") : null) ?? "";
    const SecureStore = require("expo-secure-store");
    return SecureStore.getItem("bearer_token") ?? "";
  } catch { return ""; }
}

// Field outside parent to prevent keyboard dismiss
function Field({ label, value, onChange, placeholder, keyboardType, multiline }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: "#A08060", marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#A08060"
        keyboardType={keyboardType ?? "default"}
        multiline={multiline}
        style={{
          backgroundColor: "#fff",
          borderWidth: 1.5,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 15,
          color: "#6B3A2A",
          minHeight: multiline ? 80 : undefined,
          textAlignVertical: multiline ? "top" : undefined,
        }}
      />
    </View>
  );
}

export default function AppointmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const [apt, setApt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Edit form state at top level so keyboard doesn't dismiss
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch appointment directly by ID
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await authFetch(`${API_URL}/api/appointments/${id}`, {});
        if (res.ok) {
          const data = await res.json();
          const a = data.appointment;
          setApt(a);
          setTitle(a.title ?? "");
          setDate(a.date ?? "");
          setTime(a.time ?? "");
          setLocation(a.location ?? "");
          setNotes(a.notes ?? "");
        }
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, [id, session]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await authFetch(`${API_URL}/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, time, location, notes }),
      });
      if (!res.ok) throw new Error("update failed");
      return res.json();
    },
    onSuccess: (data) => {
      setApt(data.appointment);
      queryClient.invalidateQueries({ queryKey: ["appointments-upcoming"] });
      setEditing(false);
      Alert.alert("Guardado", "Consulta actualizada com sucesso.");
    },
    onError: () => Alert.alert("Erro", "Não foi possível guardar as alterações."),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await authFetch(`${API_URL}/api/appointments/${id}`, {
        method: "DELETE",
        });
      if (!res.ok) throw new Error("delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments-upcoming"] });
      router.back();
    },
    onError: () => Alert.alert("Erro", "Não foi possível eliminar a consulta."),
  });

  const handleDelete = () => {
    Alert.alert(
      "Eliminar consulta",
      "Tem a certeza que quer eliminar esta consulta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteMutation.mutate() },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5ECD7" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E8D5B7", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={20} color="#6B3A2A" />
          </TouchableOpacity>
          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#6B3A2A" }}>Consulta</Text>
        </View>
        {apt && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity onPress={() => setEditing(true)}
              style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#EDD8B8", alignItems: "center", justifyContent: "center" }}>
              <Edit2 size={18} color="#E07A3A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}
              style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center" }}>
              {deleteMutation.isPending ? <ActivityIndicator size="small" color="#EF4444" /> : <Trash2 size={18} color="#EF4444" />}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color="#E07A3A" size="large" style={{ marginTop: 60 }} />
      ) : !apt ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}>
          <Text suppressHighlighting style={{ fontSize: 16, color: "#A08060", textAlign: "center" }}>Consulta não encontrada.</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, backgroundColor: "#E07A3A", borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}>
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700" }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 12 }}>
          {/* Detail card */}
          <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20, borderWidth: 1.5, borderColor: "#E8D5B7" }}>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: "#EDD8B8", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Calendar size={26} color="#E07A3A" />
            </View>

            <Text suppressHighlighting style={{ fontSize: 24, fontWeight: "800", color: "#6B3A2A" }}>{apt.title}</Text>

            {(apt.date || apt.time) && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 }}>
                <Clock size={16} color="#A08060" />
                <Text suppressHighlighting style={{ color: "#A08060", fontSize: 14 }}>
                  {apt.date}{apt.time ? ` às ${apt.time}` : ""}
                </Text>
              </View>
            )}

            {apt.location ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
                <MapPin size={16} color="#A08060" />
                <Text suppressHighlighting style={{ color: "#A08060", fontSize: 14 }}>{apt.location}</Text>
              </View>
            ) : null}

            {apt.notes ? (
              <View style={{ marginTop: 14, backgroundColor: "#F5ECD7", borderRadius: 12, padding: 14, flexDirection: "row", gap: 8 }}>
                <FileText size={16} color="#A08060" style={{ marginTop: 2 }} />
                <Text suppressHighlighting style={{ flex: 1, color: "#A08060", fontSize: 13, lineHeight: 20 }}>{apt.notes}</Text>
              </View>
            ) : null}
          </View>

          {/* CTA buttons */}
          <TouchableOpacity onPress={() => setEditing(true)}
            style={{ backgroundColor: "#E07A3A", borderRadius: 14, paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}>
            <Edit2 size={18} color="#fff" />
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Editar consulta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDelete}
            style={{ borderWidth: 1.5, borderColor: "#FCA5A5", borderRadius: 14, paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}>
            <Trash2 size={18} color="#EF4444" />
            <Text suppressHighlighting style={{ color: "#EF4444", fontWeight: "700", fontSize: 16 }}>Eliminar consulta</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Edit Modal */}
      <Modal visible={editing} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setEditing(false)}>
        <View style={{ flex: 1, backgroundColor: "#F5ECD7", padding: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingTop: Platform.OS === "android" ? 20 : 8 }}>
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "800", color: "#6B3A2A" }}>Editar consulta</Text>
            <TouchableOpacity onPress={() => setEditing(false)}>
              <X size={24} color="#A08060" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Field label="Título" value={title} onChange={setTitle} placeholder="Ex: Consulta anual" />
            <DateFieldPT label="Data" value={date} onChange={setDate} />
            <Field label="Hora (HH:MM)" value={time} onChange={setTime} placeholder="10:30" />
            <Field label="Local / Clínica" value={location} onChange={setLocation} placeholder="Ex: Clínica Vet Lisboa" />
            <Field label="Notas / Motivo" value={notes} onChange={setNotes} placeholder="Descreva o motivo..." multiline />

            <TouchableOpacity
              onPress={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              style={{
                backgroundColor: "#E07A3A", borderRadius: 14, paddingVertical: 16,
                alignItems: "center", marginTop: 8, marginBottom: 40,
                flexDirection: "row", justifyContent: "center", gap: 8,
                opacity: updateMutation.isPending ? 0.7 : 1,
              }}>
              {updateMutation.isPending ? <ActivityIndicator color="#fff" /> : <Save size={18} color="#fff" />}
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Guardar alterações</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
