import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, Image, KeyboardAvoidingView, Platform
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronDown, Upload, Camera, Syringe } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { confirmUsePhoto } from "../lib/pick-image";
import { api } from "../lib/api";
import { uploadImage } from "../lib/upload";
import { netError } from "../lib/net-error";
import { DateFieldPT } from "../components/DateFieldPT";
import { tr } from "../lib/i18n";

async function uploadFile(uri: string, filename: string, mimeType: string): Promise<string> {
  return uploadImage(uri, mimeType ?? "image/jpeg");
}

function Field({ label, value, onChange, placeholder, keyboardType, multiline }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 5 }}>{label}</Text>
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

export default function AddVaccineScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();

  const [petId, setPetId] = useState<string | null>(null);
  const [petPickerOpen, setPetPickerOpen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [next, setNext] = useState("");
  const [vet, setVet] = useState("");
  const [clinic, setClinic] = useState("");
  const [batch, setBatch] = useState("");
  const [notes, setNotes] = useState("");
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: petsData, isLoading: loadPets } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => (await api.pets.$get()).json(),
  });
  const pets = (petsData as any)?.pets ?? [];
  const selectedPet = pets.find((p: any) => p.id === petId);

  const save = useMutation({
    mutationFn: async () => {
      // date is notNull in schema — send today if empty
      const today = new Date().toISOString().split("T")[0];
      const res = await api.vaccines.$post({
        json: {
          petId,
          name,
          date: date.trim() || today,
          nextDate: next.trim() || undefined,
          veterinarian: vet.trim() || undefined,
          clinic: clinic.trim() || undefined,
          batch: batch.trim() || undefined,
          notes: notes.trim() || undefined,
          documentUrl: docUrl || undefined,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text.includes("<") ? tr("Erro no servidor. Tente novamente.") : text);
      }
      return res.json();
    },
    onSuccess: () => {
      // invalidate all vaccines queries (pet health screen uses ["vaccines", petId])
      qc.invalidateQueries({ queryKey: ["vaccines"] });
      qc.invalidateQueries({ queryKey: ["health-logs"] });
      Alert.alert("✅ Vacina guardada!", tr("Vacina adicionada com sucesso."), [{ text: tr("OK"), onPress: () => router.back() }]);
    },
    onError: (e: any) => Alert.alert("Ups", netError(e, tr("Não foi possível guardar a vacina."))),
  });

  const pickFile = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.85 });
    if (!res.canceled && res.assets[0] && (await confirmUsePhoto())) upload(res.assets[0]);
  };
  const pickCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") { Alert.alert(tr("Permissão necessária"), tr("Ative o acesso à câmara.")); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (!res.canceled && res.assets[0] && (await confirmUsePhoto())) upload(res.assets[0]);
  };
  const upload = async (a: any) => {
    setUploading(true);
    try {
      const url = await uploadFile(a.uri, a.fileName ?? `vaccine_${Date.now()}.jpg`, a.mimeType ?? "image/jpeg");
      setDocUrl(url);
    } catch (e: any) { Alert.alert(tr("Erro no upload"), e.message); }
    finally { setUploading(false); }
  };

  const handleSave = () => {
    if (!petId) { Alert.alert(tr("Selecione um animal"), tr("Escolha a qual animal pertence esta vacina.")); return; }
    if (!name.trim()) { Alert.alert(tr("Campo obrigatório"), tr("Insira o nome da vacina.")); return; }
    save.mutate();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 20, paddingBottom: 16 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>{tr("Nova Vacina 💉")}</Text>
          <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>{tr("Registe a caderneta de vacinação")}</Text>
        </View>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#E8FAF9", alignItems: "center", justifyContent: "center" }}>
          <Syringe size={22} color="#4ECDC4" />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 40) }}>

        {/* Pet picker */}
        <View style={{ marginBottom: 20 }}>
          <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 6 }}>{tr("Animal *")}</Text>
          {loadPets ? <ActivityIndicator color="#FF6B35" /> : (
            <TouchableOpacity onPress={() => setPetPickerOpen(!petPickerOpen)}
              style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: petId ? "#4ECDC4" : "#F0E8E0", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text suppressHighlighting style={{ fontSize: 14, color: selectedPet ? "#1A1A2E" : "#9CA3AF", fontWeight: selectedPet ? "600" : "400" }}>
                {selectedPet ? `${selectedPet.species === "cat" ? "🐱" : selectedPet.species === "bird" ? "🦜" : "🐕"} ${selectedPet.name}` : tr("Selecionar animal...")}
              </Text>
              <ChevronDown size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          {petPickerOpen && (
            <View style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 14, marginTop: 4, overflow: "hidden" }}>
              {pets.length === 0 ? (
                <TouchableOpacity onPress={() => router.replace("/add-pet")} style={{ padding: 14, alignItems: "center" }}>
                  <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "600" }}>{tr("+ Adicionar animal primeiro")}</Text>
                </TouchableOpacity>
              ) : pets.map((p: any) => (
                <TouchableOpacity key={p.id} onPress={() => { setPetId(p.id); setPetPickerOpen(false); }}
                  style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "#F9F5F0" }}>
                  <Text suppressHighlighting style={{ fontSize: 20 }}>{p.species === "cat" ? "🐱" : p.species === "bird" ? "🦜" : "🐕"}</Text>
                  <View>
                    <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E" }}>{p.name}</Text>
                    <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>{p.breed ?? p.species}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Form */}
        <Field label={tr("Nome da vacina *")} value={name} onChange={setName} placeholder={tr("Ex: Raiva, Parvovírus, Esgana, Leucemia...")} />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <DateFieldPT label={tr("Data de administração")} value={date} onChange={setDate} />
          </View>
          <View style={{ flex: 1 }}>
            <DateFieldPT label={tr("Próxima dose")} value={next} onChange={setNext} />
          </View>
        </View>

        <Field label={tr("Médico veterinário")} value={vet} onChange={setVet} placeholder={tr("Nome do veterinário")} />
        <Field label={tr("Clínica / Hospital")} value={clinic} onChange={setClinic} placeholder={tr("Nome da clínica")} />
        <Field label={tr("Número de lote")} value={batch} onChange={setBatch} placeholder={tr("Ex: AB12345")} />
        <Field label={tr("Notas")} value={notes} onChange={setNotes} placeholder={tr("Reações, observações...")} multiline />

        {/* Upload */}
        <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 8 }}>{tr("Caderneta / Comprovativo")}</Text>
        {docUrl ? (
          <View style={{ marginBottom: 14 }}>
            <Image source={{ uri: docUrl }} style={{ width: "100%", height: 180, borderRadius: 14, resizeMode: "cover" }} />
            <TouchableOpacity onPress={() => setDocUrl(null)} style={{ marginTop: 6, alignSelf: "center" }}>
              <Text suppressHighlighting style={{ color: "#EF4444", fontSize: 12, fontWeight: "600" }}>{tr("Remover imagem")}</Text>
            </TouchableOpacity>
          </View>
        ) : uploading ? (
          <View style={{ height: 80, alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <ActivityIndicator color="#4ECDC4" />
            <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 6 }}>{tr("A fazer upload...")}</Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
            <TouchableOpacity onPress={pickFile}
              style={{ flex: 1, borderWidth: 1.5, borderColor: "#4ECDC4", borderRadius: 14, borderStyle: "dashed", padding: 16, alignItems: "center", gap: 6, backgroundColor: "#F0FFFE" }}>
              <Upload size={22} color="#4ECDC4" />
              <Text suppressHighlighting style={{ fontSize: 12, color: "#4ECDC4", fontWeight: "700" }}>{tr("Escolher ficheiro")}</Text>
              <Text suppressHighlighting style={{ fontSize: 10, color: "#9CA3AF" }}>{tr("PDF, imagem...")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickCamera}
              style={{ flex: 1, borderWidth: 1.5, borderColor: "#4ECDC4", borderRadius: 14, borderStyle: "dashed", padding: 16, alignItems: "center", gap: 6, backgroundColor: "#F0FFFE" }}>
              <Camera size={22} color="#4ECDC4" />
              <Text suppressHighlighting style={{ fontSize: 12, color: "#4ECDC4", fontWeight: "700" }}>{tr("Tirar foto")}</Text>
              <Text suppressHighlighting style={{ fontSize: 10, color: "#9CA3AF" }}>{tr("Câmara direta")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Save */}
        <TouchableOpacity onPress={handleSave} disabled={save.isPending}
          style={{ backgroundColor: "#4ECDC4", borderRadius: 18, padding: 16, alignItems: "center", marginTop: 8, opacity: save.isPending ? 0.7 : 1, shadowColor: "#4ECDC4", shadowOpacity: 0.3, shadowRadius: 12, elevation: 0 }}>
          {save.isPending ? <ActivityIndicator color="#fff" /> : (
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>{tr("💾 Guardar Vacina")}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
