import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react-native";
import { api } from "../lib/api";
import { netError } from "../lib/net-error";
import { tr } from "../lib/i18n";

const types = [
  { value: "clinica",     label: "🏥 Clínica Veterinária" },
  { value: "petshop",     label: "🐾 Petshop" },
  { value: "tosquiador",  label: "✂️ Tosquiador" },
  { value: "hotel",       label: "🏠 Hotel Animal" },
  { value: "treino",      label: "🎾 Treino/Comportamento" },
  { value: "outro",       label: "📦 Outro" },
];

// FORA do componente — evita que o teclado feche a cada keystroke
function Input({ label, value, onChangeText, placeholder, multiline = false, keyboardType = "default" }: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; multiline?: boolean; keyboardType?: any;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text suppressHighlighting style={{ fontWeight: "600", color: "#374151", marginBottom: 6, fontSize: 14 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        keyboardType={keyboardType}
        style={{
          backgroundColor: "#fff",
          borderRadius: 14,
          padding: 14,
          borderWidth: 1.5,
          borderColor: "#F0E8E0",
          color: "#1A1A2E",
          fontSize: 14,
          minHeight: multiline ? 80 : undefined,
          textAlignVertical: multiline ? "top" : undefined,
        }}
      />
    </View>
  );
}

export default function AddBusinessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [type, setType] = useState("clinica");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [schedule, setSchedule] = useState("");
  const [services, setServices] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await (api as any).businesses.$post({
        json: { name, type, description, phone, website, address, city, bookingUrl, bookingPhone, schedule, services },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text.includes("<") ? "Erro no servidor. Tente novamente." : text);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      Alert.alert(tr("✅ Negócio registado!"), tr("O teu negócio já está visível para todos os utilizadores."));
      router.back();
    },
    onError: (e: any) => Alert.alert("Ups", netError(e, "Não foi possível registar o negócio.")),
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <ChevronLeft size={24} color="#1A1A2E" />
          </TouchableOpacity>
          <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "800", color: "#1A1A2E" }}>{tr("Registar Negócio")}</Text>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: Math.max(insets.bottom, 60) }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Input label={tr("Nome do negócio *")} value={name} onChangeText={setName} placeholder={tr("Ex: Clínica Veterinária Central")} />

          {/* Tipo */}
          <View style={{ marginBottom: 16 }}>
            <Text suppressHighlighting style={{ fontWeight: "600", color: "#374151", marginBottom: 8, fontSize: 14 }}>{tr("Tipo *")}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {types.map(t => (
                <TouchableOpacity key={t.value} onPress={() => setType(t.value)}
                  style={{
                    backgroundColor: type === t.value ? "#8B5E3C" : "#fff",
                    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8,
                    borderWidth: 1.5, borderColor: type === t.value ? "#8B5E3C" : "#F0E8E0",
                  }}>
                  <Text suppressHighlighting style={{ color: type === t.value ? "#fff" : "#6B7280", fontWeight: "600", fontSize: 13 }}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input label={tr("Descrição")} value={description} onChangeText={setDescription} placeholder={tr("Descreve os serviços e especialidades...")} multiline />
          <Input label={tr("Telefone")} value={phone} onChangeText={setPhone} placeholder="+351 912 345 678" keyboardType="phone-pad" />
          <Input label={tr("Website")} value={website} onChangeText={setWebsite} placeholder="https://..." keyboardType="url" />
          <Input label={tr("Morada")} value={address} onChangeText={setAddress} placeholder={tr("Rua, número, código postal")} />
          <Input label={tr("Cidade")} value={city} onChangeText={setCity} placeholder={tr("Ex: Lisboa, Porto, Setúbal...")} />
          <Input label={tr("Link para marcar consulta")} value={bookingUrl} onChangeText={setBookingUrl} placeholder="https://... (opcional)" keyboardType="url" />
          <Input label={tr("Telefone para marcações")} value={bookingPhone} onChangeText={setBookingPhone} placeholder="+351 912 345 678 (opcional)" keyboardType="phone-pad" />
          <Input label={tr("Horário")} value={schedule} onChangeText={setSchedule} placeholder={tr("Ex: Seg-Sex 9h-18h, Sáb 9h-13h")} />
          <Input label={tr("Serviços e preços")} value={services} onChangeText={setServices} placeholder={tr("Ex: Consulta geral €25, Vacina €15, Tosquia €30...")} multiline />

          <TouchableOpacity
            onPress={() => mutate()}
            disabled={isPending || !name.trim()}
            style={{
              backgroundColor: name.trim() ? "#8B5E3C" : "#D1D5DB",
              borderRadius: 16, padding: 16, alignItems: "center",
              marginTop: 8,
            }}>
            {isPending
              ? <ActivityIndicator color="#fff" />
              : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>{tr("Registar Negócio")}</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
