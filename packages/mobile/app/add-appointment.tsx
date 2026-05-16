import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, KeyboardAvoidingView, Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronDown, Calendar } from "lucide-react-native";
import { api } from "../lib/api";

function Field({ label, value, onChange, placeholder, keyboardType, multiline }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 5 }}>{label}</Text>
      <TextInput
        value={value} onChangeText={onChange} placeholder={placeholder}
        placeholderTextColor="#9CA3AF" keyboardType={keyboardType ?? "default"}
        multiline={multiline} numberOfLines={multiline ? 3 : 1}
        style={{
          backgroundColor: "#FFF9F5", borderWidth: 1.5, borderColor: "#F0E8E0",
          borderRadius: 14, padding: 12, fontSize: 14, color: "#1A1A2E",
          minHeight: multiline ? 80 : undefined, textAlignVertical: multiline ? "top" : undefined
        }}
      />
    </View>
  );
}

const TYPES = [
  { k: "consulta", l: "🩺 Consulta", c: "#FF6B35" },
  { k: "vacina", l: "💉 Vacina", c: "#4ECDC4" },
  { k: "exame", l: "🔬 Exame", c: "#3B82F6" },
  { k: "cirurgia", l: "🏥 Cirurgia", c: "#EF476F" },
  { k: "outro", l: "📋 Outro", c: "#8B5CF6" },
];

export default function AddAppointmentScreen() {
  const router = useRouter();
  const qc = useQueryClient();

  const [petId, setPetId] = useState<string | null>(null);
  const [petPickerOpen, setPetPickerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("consulta");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [vet, setVet] = useState("");
  const [clinic, setClinic] = useState("");
  const [notes, setNotes] = useState("");

  const { data: petsData, isLoading: loadPets } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => (await api.pets.$get()).json(),
  });
  const pets = (petsData as any)?.pets ?? [];
  const selectedPet = pets.find((p: any) => p.id === petId);

  const save = useMutation({
    mutationFn: async () =>
      (await api.appointments.$post({ json: { petId, title, type, date, time: time || undefined, veterinarian: vet || undefined, clinic: clinic || undefined, notes: notes || undefined } })).json(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      qc.invalidateQueries({ queryKey: ["appointments-upcoming"] });
      Alert.alert("✅ Consulta guardada!", "Consulta adicionada com sucesso.", [{ text: "OK", onPress: () => router.back() }]);
    },
    onError: (e: any) => Alert.alert("Erro", e.message),
  });

  const handleSave = () => {
    if (!petId) { Alert.alert("Selecione um animal", "Escolha a qual animal pertence esta consulta."); return; }
    if (!title.trim()) { Alert.alert("Campo obrigatório", "Insira o motivo da consulta."); return; }
    if (!date.trim()) { Alert.alert("Campo obrigatório", "Insira a data da consulta."); return; }
    save.mutate();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 20, paddingBottom: 16 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>Nova Consulta 📅</Text>
          <Text style={{ color: "#6B7280", fontSize: 12 }}>Agende ou registe uma consulta</Text>
        </View>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFF0EB", alignItems: "center", justifyContent: "center" }}>
          <Calendar size={22} color="#FF6B35" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>

        {/* Pet picker */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 6 }}>Animal *</Text>
          {loadPets ? <ActivityIndicator color="#FF6B35" /> : (
            <TouchableOpacity onPress={() => setPetPickerOpen(!petPickerOpen)}
              style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: petId ? "#FF6B35" : "#F0E8E0", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: selectedPet ? "#1A1A2E" : "#9CA3AF", fontWeight: selectedPet ? "600" : "400" }}>
                {selectedPet ? `${selectedPet.species === "cat" ? "🐱" : selectedPet.species === "bird" ? "🦜" : "🐕"} ${selectedPet.name}` : "Selecionar animal..."}
              </Text>
              <ChevronDown size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          {petPickerOpen && (
            <View style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 14, marginTop: 4, overflow: "hidden" }}>
              {pets.length === 0 ? (
                <TouchableOpacity onPress={() => router.replace("/add-pet")} style={{ padding: 14, alignItems: "center" }}>
                  <Text style={{ color: "#FF6B35", fontWeight: "600" }}>+ Adicionar animal primeiro</Text>
                </TouchableOpacity>
              ) : pets.map((p: any) => (
                <TouchableOpacity key={p.id} onPress={() => { setPetId(p.id); setPetPickerOpen(false); }}
                  style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "#F9F5F0" }}>
                  <Text style={{ fontSize: 20 }}>{p.species === "cat" ? "🐱" : p.species === "bird" ? "🦜" : "🐕"}</Text>
                  <View>
                    <Text style={{ fontWeight: "700", color: "#1A1A2E" }}>{p.name}</Text>
                    <Text style={{ color: "#6B7280", fontSize: 12 }}>{p.breed ?? p.species}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Type selector */}
        <Text style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 8 }}>Tipo de consulta</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
          {TYPES.map((t) => (
            <TouchableOpacity key={t.k} onPress={() => setType(t.k)}
              style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: type === t.k ? t.c : "#fff", borderWidth: 1.5, borderColor: type === t.k ? t.c : "#F0E8E0" }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: type === t.k ? "#fff" : "#6B7280" }}>{t.l}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Field label="Motivo / Título *" value={title} onChange={setTitle} placeholder="Ex: Check-up anual, Vacinação anual..." />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Field label="Data *" value={date} onChange={setDate} placeholder="AAAA-MM-DD" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Hora" value={time} onChange={setTime} placeholder="HH:MM" />
          </View>
        </View>

        <Field label="Médico veterinário" value={vet} onChange={setVet} placeholder="Nome do veterinário" />
        <Field label="Clínica / Hospital" value={clinic} onChange={setClinic} placeholder="Nome da clínica" />
        <Field label="Notas / Resultados" value={notes} onChange={setNotes} placeholder="Observações, diagnóstico, tratamento..." multiline />

        <TouchableOpacity onPress={handleSave} disabled={save.isPending}
          style={{ backgroundColor: "#FF6B35", borderRadius: 18, padding: 16, alignItems: "center", marginTop: 8, opacity: save.isPending ? 0.7 : 1, shadowColor: "#FF6B35", shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 }}>
          {save.isPending ? <ActivityIndicator color="#fff" /> : (
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>💾 Guardar Consulta</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
