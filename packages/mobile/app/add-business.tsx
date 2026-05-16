import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react-native";
import { api } from "../lib/api";

const types = [
  { value: "clinica", label: "🏥 Clínica Veterinária" },
  { value: "petshop", label: "🐾 Petshop" },
  { value: "tosquiador", label: "✂️ Tosquiador" },
  { value: "hotel", label: "🏠 Hotel Animal" },
  { value: "treino", label: "🎾 Treino/Comportamento" },
  { value: "outro", label: "📦 Outro" },
];

export default function AddBusinessScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "", type: "clinica", description: "", phone: "",
    website: "", address: "", city: "", bookingUrl: "", bookingPhone: "",
    schedule: "", services: "",
  });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const body: any = { ...form };
      if (form.services) {
        try { body.services = form.services; } catch { body.services = form.services; }
      }
      return (await (api as any).businesses.$post({ json: body })).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      Alert.alert("✅ Negócio registado!", "O teu negócio já está visível para todos os utilizadores.");
      router.back();
    },
    onError: () => Alert.alert("Erro", "Não foi possível registar o negócio."),
  });

  const Input = ({ label, field, placeholder, multiline = false, keyboardType = "default" }: any) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "600", color: "#374151", marginBottom: 6, fontSize: 14 }}>{label}</Text>
      <TextInput
        value={(form as any)[field]}
        onChangeText={(v) => update(field, v)}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        keyboardType={keyboardType}
        style={{ backgroundColor: "#fff", borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: "#F0E8E0", color: "#1A1A2E", fontSize: 14, minHeight: multiline ? 80 : undefined }}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ChevronLeft size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#1A1A2E" }}>Registar Negócio</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Input label="Nome do negócio *" field="name" placeholder="Ex: Clínica Veterinária Central" />

        {/* Tipo */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: "600", color: "#374151", marginBottom: 8, fontSize: 14 }}>Tipo *</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {types.map(t => (
              <TouchableOpacity key={t.value} onPress={() => update("type", t.value)}
                style={{ backgroundColor: form.type === t.value ? "#8B5E3C" : "#fff", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1.5, borderColor: form.type === t.value ? "#8B5E3C" : "#F0E8E0" }}>
                <Text style={{ color: form.type === t.value ? "#fff" : "#6B7280", fontWeight: "600", fontSize: 13 }}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input label="Descrição" field="description" placeholder="Descreve os serviços e especialidades..." multiline />
        <Input label="Telefone" field="phone" placeholder="+351 912 345 678" keyboardType="phone-pad" />
        <Input label="Website" field="website" placeholder="https://..." keyboardType="url" />
        <Input label="Morada" field="address" placeholder="Rua, número, código postal" />
        <Input label="Cidade" field="city" placeholder="Ex: Lisboa, Porto, Setúbal..." />
        <Input label="Link para marcar consulta" field="bookingUrl" placeholder="https://... (opcional)" keyboardType="url" />
        <Input label="Telefone para marcações" field="bookingPhone" placeholder="+351 912 345 678 (opcional)" keyboardType="phone-pad" />
        <Input label="Horário" field="schedule" placeholder="Ex: Seg-Sex 9h-18h, Sáb 9h-13h" />
        <Input label="Serviços e preços" field="services" placeholder="Ex: Consulta geral €25, Vacina €15, Tosquia €30..." multiline />

        <TouchableOpacity onPress={() => mutate()} disabled={isPending || !form.name}
          style={{ backgroundColor: form.name ? "#8B5E3C" : "#D1D5DB", borderRadius: 16, padding: 16, alignItems: "center", marginTop: 8, marginBottom: 40 }}>
          {isPending ? <ActivityIndicator color="#fff" /> :
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Registar Negócio</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
