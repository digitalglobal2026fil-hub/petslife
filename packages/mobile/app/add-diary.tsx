import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronDown, Heart } from "lucide-react-native";
import { api } from "../lib/api";

const ACCENT = "#EF476F";

type Category = "sintoma" | "comportamento" | "medicacao" | "alimentacao" | "peso" | "outro";

const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: "sintoma",        label: "Sintoma",        emoji: "🤒" },
  { key: "comportamento",  label: "Comportamento",  emoji: "🐾" },
  { key: "medicacao",      label: "Medicação",      emoji: "💊" },
  { key: "alimentacao",    label: "Alimentação",    emoji: "🍖" },
  { key: "peso",           label: "Peso",           emoji: "⚖️" },
  { key: "outro",          label: "Outro",          emoji: "📝" },
];

function todayString() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function Field({ label, value, onChange, placeholder, multiline }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 5 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        style={{
          backgroundColor: "#FFF9F5",
          borderWidth: 1.5,
          borderColor: "#F0E8E0",
          borderRadius: 14,
          padding: 12,
          fontSize: 14,
          color: "#1A1A2E",
          minHeight: multiline ? 100 : undefined,
          textAlignVertical: multiline ? "top" : undefined,
        }}
      />
    </View>
  );
}

export default function AddDiaryScreen() {
  const router = useRouter();
  const qc = useQueryClient();

  const [petId, setPetId] = useState<string | null>(null);
  const [petPickerOpen, setPetPickerOpen] = useState(false);
  const [category, setCategory] = useState<Category>("outro");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayString());
  const [description, setDescription] = useState("");

  const { data: petsData, isLoading: loadPets } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => (await api.pets.$get()).json(),
  });
  const pets = (petsData as any)?.pets ?? [];
  const selectedPet = pets.find((p: any) => p.id === petId);

  const save = useMutation({
    mutationFn: async () => {
      const [dd, mm, yyyy] = date.split("/");
      const isoDate = `${yyyy}-${mm}-${dd}`;
      return (await (api as any)["health-logs"].$post({
        json: { petId, type: category, title, description: description || undefined, date: isoDate },
      })).json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health-logs"] });
      Alert.alert("✅ Registo guardado!", "Entrada no diário adicionada.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: (e: any) => Alert.alert("Erro", e.message),
  });

  const handleSave = () => {
    if (!petId) { Alert.alert("Selecione um animal", "Escolha a qual animal pertence este registo."); return; }
    if (!title.trim()) { Alert.alert("Campo obrigatório", "Insira um título para o registo."); return; }
    save.mutate();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 20, paddingBottom: 16 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}
        >
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>Diário de Saúde ❤️</Text>
          <Text style={{ color: "#6B7280", fontSize: 12 }}>Registe sintomas, comportamentos e mais</Text>
        </View>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFF0F3", alignItems: "center", justifyContent: "center" }}>
          <Heart size={22} color={ACCENT} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>

        {/* Pet picker */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 6 }}>Animal *</Text>
          {loadPets ? <ActivityIndicator color={ACCENT} /> : (
            <TouchableOpacity
              onPress={() => setPetPickerOpen(!petPickerOpen)}
              style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: petId ? ACCENT : "#F0E8E0", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 14, color: selectedPet ? "#1A1A2E" : "#9CA3AF", fontWeight: selectedPet ? "600" : "400" }}>
                {selectedPet
                  ? `${selectedPet.species === "cat" ? "🐱" : selectedPet.species === "bird" ? "🦜" : "🐕"} ${selectedPet.name}`
                  : "Selecionar animal..."}
              </Text>
              <ChevronDown size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          {petPickerOpen && (
            <View style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 14, marginTop: 4, overflow: "hidden" }}>
              {pets.length === 0 ? (
                <TouchableOpacity onPress={() => router.replace("/add-pet")} style={{ padding: 14, alignItems: "center" }}>
                  <Text style={{ color: ACCENT, fontWeight: "600" }}>+ Adicionar animal primeiro</Text>
                </TouchableOpacity>
              ) : pets.map((p: any) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => { setPetId(p.id); setPetPickerOpen(false); }}
                  style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "#F9F5F0" }}
                >
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

        {/* Category chips */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 10 }}>Categoria *</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((c) => {
              const active = category === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => setCategory(c.key)}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 6,
                    paddingHorizontal: 14, paddingVertical: 9,
                    borderRadius: 20,
                    backgroundColor: active ? ACCENT : "#fff",
                    borderWidth: 1.5,
                    borderColor: active ? ACCENT : "#F0E8E0",
                  }}
                >
                  <Text style={{ fontSize: 15 }}>{c.emoji}</Text>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: active ? "#fff" : "#1A1A2E" }}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Fields */}
        <Field label="Título *" value={title} onChange={setTitle} placeholder="Ex: Tosse persistente" />
        <Field label="Data (DD/MM/AAAA)" value={date} onChange={setDate} placeholder="DD/MM/AAAA" />
        <Field label="Descrição" value={description} onChange={setDescription} placeholder="Descreve o que observaste..." multiline />

        {/* Save */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={save.isPending}
          style={{
            backgroundColor: ACCENT,
            borderRadius: 18, padding: 16, alignItems: "center", marginTop: 8,
            opacity: save.isPending ? 0.7 : 1,
            shadowColor: ACCENT, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
          }}
        >
          {save.isPending
            ? <ActivityIndicator color="#fff" />
            : <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>💾 Guardar Registo</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
