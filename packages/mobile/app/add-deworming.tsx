import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, Image, KeyboardAvoidingView, Platform
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronDown, Upload, Camera, Bug } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { confirmUsePhoto } from "../lib/pick-image";
import { api } from "../lib/api";
import { uploadImage } from "../lib/upload";
import { netError } from "../lib/net-error";
import { DateFieldPT } from "../components/DateFieldPT";
import { safeBack } from "../lib/safe-back";
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
          backgroundColor: "#FFFBEB", borderWidth: 1.5, borderColor: "#FDE68A",
          borderRadius: 14, padding: 12, fontSize: 14, color: "#1A1A2E",
          minHeight: multiline ? 80 : undefined, textAlignVertical: multiline ? "top" : undefined
        }}
      />
    </View>
  );
}

export default function AddDewormingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();

  const [petId, setPetId] = useState<string | null>(null);
  const [petPickerOpen, setPetPickerOpen] = useState(false);
  const [dwType, setDwType] = useState("internal");
  const [product, setProduct] = useState("");
  const [date, setDate] = useState("");
  const [next, setNext] = useState("");
  const [vet, setVet] = useState("");
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
      const today = new Date().toISOString().split("T")[0];
      const res = await (api as any).dewormings.$post({
        json: {
          petId,
          product,
          type: dwType,
          date: date.trim() || today,
          nextDate: next.trim() || undefined,
          veterinarian: vet.trim() || undefined,
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
      qc.invalidateQueries({ queryKey: ["dewormings"] });
      qc.invalidateQueries({ queryKey: ["all-dewormings-notif"] });
      Alert.alert("✅ Desparasitação guardada!", tr("Registo adicionado com sucesso."), [{ text: tr("OK"), onPress: () => safeBack(router) }]);
    },
    onError: (e: any) => Alert.alert("Ups", netError(e, tr("Não foi possível guardar o registo."))),
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
      const url = await uploadFile(a.uri, a.fileName ?? `deworming_${Date.now()}.jpg`, a.mimeType ?? "image/jpeg");
      setDocUrl(url);
    } catch (e: any) { Alert.alert(tr("Erro no upload"), e.message); }
    finally { setUploading(false); }
  };

  const handleSave = () => {
    if (!petId) { Alert.alert(tr("Selecione um animal"), tr("Escolha a qual animal pertence este registo.")); return; }
    if (!product.trim()) { Alert.alert(tr("Campo obrigatório"), tr("Insira o nome do produto.")); return; }
    save.mutate();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFBEB" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 20, paddingBottom: 16 }}>
        <TouchableOpacity onPress={() => safeBack(router)}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#FDE68A", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>{tr("Nova Desparasitação 🪱")}</Text>
          <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>{tr("Controlo interno e externo")}</Text>
        </View>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" }}>
          <Bug size={22} color="#F59E0B" />
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
          {loadPets ? <ActivityIndicator color="#F59E0B" /> : (
            <TouchableOpacity onPress={() => setPetPickerOpen(!petPickerOpen)}
              style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: petId ? "#F59E0B" : "#FDE68A", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text suppressHighlighting style={{ fontSize: 14, color: selectedPet ? "#1A1A2E" : "#9CA3AF", fontWeight: selectedPet ? "600" : "400" }}>
                {selectedPet ? `${selectedPet.species === "cat" ? "🐱" : selectedPet.species === "bird" ? "🦜" : "🐕"} ${selectedPet.name}` : tr("Selecionar animal...")}
              </Text>
              <ChevronDown size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          {petPickerOpen && (
            <View style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#FDE68A", borderRadius: 14, marginTop: 4, overflow: "hidden" }}>
              {pets.length === 0 ? (
                <TouchableOpacity onPress={() => router.replace("/add-pet")} style={{ padding: 14, alignItems: "center" }}>
                  <Text suppressHighlighting style={{ color: "#F59E0B", fontWeight: "600" }}>{tr("+ Adicionar animal primeiro")}</Text>
                </TouchableOpacity>
              ) : pets.map((p: any) => (
                <TouchableOpacity key={p.id} onPress={() => { setPetId(p.id); setPetPickerOpen(false); }}
                  style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "#FEF3C7" }}>
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

        {/* Tipo */}
        <View style={{ marginBottom: 14 }}>
          <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 6 }}>{tr("Tipo")}</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[{ k: "internal", l: tr("Interna") }, { k: "external", l: tr("Externa") }, { k: "both", l: tr("Ambas") }].map((t) => (
              <TouchableOpacity key={t.k} onPress={() => setDwType(t.k)}
                style={{ flex: 1, paddingVertical: 10, borderRadius: 14, backgroundColor: dwType === t.k ? "#F59E0B" : "#fff", borderWidth: 1.5, borderColor: dwType === t.k ? "#F59E0B" : "#FDE68A", alignItems: "center" }}>
                <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: dwType === t.k ? "#fff" : "#6B7280" }}>{t.l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form */}
        <Field label={tr("Produto *")} value={product} onChange={setProduct} placeholder={tr("Ex: Frontline, Milbemax, Advocate...")} />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <DateFieldPT label={tr("Data de aplicação")} value={date} onChange={setDate} />
          </View>
          <View style={{ flex: 1 }}>
            <DateFieldPT label={tr("Próxima aplicação")} value={next} onChange={setNext} />
          </View>
        </View>

        <Field label={tr("Médico veterinário")} value={vet} onChange={setVet} placeholder={tr("Nome do veterinário")} />
        <Field label={tr("Notas")} value={notes} onChange={setNotes} placeholder={tr("Observações...")} multiline />

        {/* Upload */}
        <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 8 }}>{tr("Comprovativo / Foto")}</Text>
        {docUrl ? (
          <View style={{ marginBottom: 14 }}>
            <Image source={{ uri: docUrl }} style={{ width: "100%", height: 180, borderRadius: 14, resizeMode: "cover" }} />
            <TouchableOpacity onPress={() => setDocUrl(null)} style={{ marginTop: 6, alignSelf: "center" }}>
              <Text suppressHighlighting style={{ color: "#EF4444", fontSize: 12, fontWeight: "600" }}>{tr("Remover imagem")}</Text>
            </TouchableOpacity>
          </View>
        ) : uploading ? (
          <View style={{ height: 80, alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <ActivityIndicator color="#F59E0B" />
            <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 6 }}>{tr("A fazer upload...")}</Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
            <TouchableOpacity onPress={pickFile}
              style={{ flex: 1, borderWidth: 1.5, borderColor: "#F59E0B", borderRadius: 14, borderStyle: "dashed", padding: 16, alignItems: "center", gap: 6, backgroundColor: "#FFFBEB" }}>
              <Upload size={22} color="#F59E0B" />
              <Text suppressHighlighting style={{ fontSize: 12, color: "#F59E0B", fontWeight: "700" }}>{tr("Escolher ficheiro")}</Text>
              <Text suppressHighlighting style={{ fontSize: 10, color: "#9CA3AF" }}>{tr("PDF, imagem...")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickCamera}
              style={{ flex: 1, borderWidth: 1.5, borderColor: "#F59E0B", borderRadius: 14, borderStyle: "dashed", padding: 16, alignItems: "center", gap: 6, backgroundColor: "#FFFBEB" }}>
              <Camera size={22} color="#F59E0B" />
              <Text suppressHighlighting style={{ fontSize: 12, color: "#F59E0B", fontWeight: "700" }}>{tr("Tirar foto")}</Text>
              <Text suppressHighlighting style={{ fontSize: 10, color: "#9CA3AF" }}>{tr("Câmara direta")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Save */}
        <TouchableOpacity onPress={handleSave} disabled={save.isPending}
          style={{ backgroundColor: "#F59E0B", borderRadius: 18, padding: 16, alignItems: "center", marginTop: 8, opacity: save.isPending ? 0.7 : 1, shadowColor: "#F59E0B", shadowOpacity: 0.3, shadowRadius: 12, elevation: 0 }}>
          {save.isPending ? <ActivityIndicator color="#fff" /> : (
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>{tr("💾 Guardar Desparasitação")}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
