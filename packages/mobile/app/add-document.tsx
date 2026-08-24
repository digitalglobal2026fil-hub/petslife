import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, Image
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronDown, Upload, Camera, FileText } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { confirmUsePhoto } from "../lib/pick-image";
import { api } from "../lib/api";
import { uploadImage } from "../lib/upload";
import { netError } from "../lib/net-error";
import { tr } from "../lib/i18n";

async function uploadFile(uri: string, filename: string, mimeType: string): Promise<string> {
  // Usa base64 upload que funciona no Android/iOS
  return uploadImage(uri, mimeType ?? "image/jpeg");
}

function Field({ label, value, onChange, placeholder, multiline }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 5 }}>{label}</Text>
      <TextInput
        value={value} onChangeText={onChange} placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
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

const DOC_TYPES = [
  { k: "passaporte", l: "🛂 Passaporte" },
  { k: "licenca", l: "📜 Licença" },
  { k: "exame", l: "🔬 Exame" },
  { k: "seguro", l: "🛡️ Seguro" },
  { k: "caderneta", l: "📋 Caderneta" },
  { k: "receita", l: "💊 Receita" },
  { k: "outro", l: "📄 Outro" },
];

export default function AddDocumentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isPrescription = mode === "prescription";

  const [petId, setPetId] = useState<string | null>(null);
  const [petPickerOpen, setPetPickerOpen] = useState(false);
  const [docType, setDocType] = useState(isPrescription ? "receita" : "outro");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: petsData, isLoading: loadPets } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => (await api.pets.$get()).json(),
  });
  const pets = (petsData as any)?.pets ?? [];
  const selectedPet = pets.find((p: any) => p.id === petId);

  const save = useMutation({
    mutationFn: async () =>
      (await api.documents.$post({ json: { petId, type: docType, title, url: url ?? "", notes: notes || undefined } })).json(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      Alert.alert("✅ Documento guardado!", tr("Documento adicionado com sucesso."), [{ text: tr("OK"), onPress: () => router.back() }]);
    },
    onError: (e: any) => Alert.alert("Ups", netError(e)),
  });

  const pickFile = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.9 });
    if (!res.canceled && res.assets[0] && (await confirmUsePhoto())) upload(res.assets[0]);
  };
  const pickCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") { Alert.alert(tr("Permissão necessária"), tr("Ative o acesso à câmara nas definições.")); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.9 });
    if (!res.canceled && res.assets[0] && (await confirmUsePhoto())) upload(res.assets[0]);
  };
  const upload = async (a: any) => {
    setUploading(true);
    try {
      const u = await uploadFile(a.uri, a.fileName ?? `doc_${Date.now()}.jpg`, a.mimeType ?? "image/jpeg");
      setUrl(u);
    } catch (e: any) { Alert.alert(tr("Erro no upload"), e.message); }
    finally { setUploading(false); }
  };

  const handleSave = () => {
    if (!petId) { Alert.alert(tr("Selecione um animal")); return; }
    if (!title.trim()) { Alert.alert(tr("Campo obrigatório"), tr("Insira o título do documento.")); return; }
    if (!url) { Alert.alert(tr("Ficheiro necessário"), tr("Por favor adicione uma foto ou ficheiro do documento.")); return; }
    save.mutate();
  };

  const color = isPrescription ? "#8B5CF6" : "#06D6A0";
  const bgColor = isPrescription ? "#F3EEFF" : "#E6FAF5";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 20, paddingBottom: 16 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>
            {isPrescription ? tr("Nova Receita 💊") : tr("Novo Documento 📄")}
          </Text>
          <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12 }}>
            {isPrescription ? tr("Tire foto ou carregue a receita médica") : tr("Passaporte, exames, licenças...")}
          </Text>
        </View>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: bgColor, alignItems: "center", justifyContent: "center" }}>
          <FileText size={22} color={color} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 40) }}>

        {/* Pet picker */}
        <View style={{ marginBottom: 20 }}>
          <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 6 }}>{tr("Animal *")}</Text>
          {loadPets ? <ActivityIndicator color="#FF6B35" /> : (
            <TouchableOpacity onPress={() => setPetPickerOpen(!petPickerOpen)}
              style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: petId ? color : "#F0E8E0", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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

        {/* Type selector (only for documents, not prescription) */}
        {!isPrescription && (
          <>
            <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 8 }}>{tr("Tipo de documento")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 , paddingBottom: Math.max(insets.bottom, 24) }}>
              {DOC_TYPES.filter(t => t.k !== "receita").map((t) => (
                <TouchableOpacity key={t.k} onPress={() => setDocType(t.k)}
                  style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: docType === t.k ? color : "#fff", borderWidth: 1.5, borderColor: docType === t.k ? color : "#F0E8E0" }}>
                  <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: docType === t.k ? "#fff" : "#6B7280" }}>{tr(t.l)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        <Field label={isPrescription ? tr("Medicamento / Título *") : tr("Título / Nome *")} value={title} onChange={setTitle}
          placeholder={isPrescription ? tr("Ex: Antibiótico, Anti-inflamatório...") : tr("Ex: Passaporte Europeu, Licença Municipal...")} />
        <Field label={isPrescription ? tr("Posologia / Notas") : tr("Notas")} value={notes} onChange={setNotes}
          placeholder={isPrescription ? tr("Ex: 1 comp. 2x por dia durante 7 dias...") : tr("Observações...")} multiline />

        {/* Upload zone */}
        <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: "#1A1A2E", marginBottom: 8 }}>
          {isPrescription ? tr("Foto / Scan da receita *") : tr("Foto / Scan do documento *")}
        </Text>

        {url ? (
          <View style={{ marginBottom: 14 }}>
            <Image source={{ uri: url }} style={{ width: "100%", height: 220, borderRadius: 16, resizeMode: "cover" }} />
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <TouchableOpacity onPress={pickCamera} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: bgColor, borderRadius: 12, padding: 10 }}>
                <Camera size={16} color={color} />
                <Text suppressHighlighting style={{ color, fontWeight: "600", fontSize: 12 }}>{tr("Nova foto")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={pickFile} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: bgColor, borderRadius: 12, padding: 10 }}>
                <Upload size={16} color={color} />
                <Text suppressHighlighting style={{ color, fontWeight: "600", fontSize: 12 }}>{tr("Outro ficheiro")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : uploading ? (
          <View style={{ height: 120, alignItems: "center", justifyContent: "center", backgroundColor: bgColor, borderRadius: 16, marginBottom: 14 }}>
            <ActivityIndicator color={color} />
            <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 12, marginTop: 8 }}>{tr("A fazer upload...")}</Text>
          </View>
        ) : (
          <View style={{ marginBottom: 14 }}>
            {/* Camera — prominent */}
            <TouchableOpacity onPress={pickCamera}
              style={{ backgroundColor: color, borderRadius: 16, padding: 18, alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Camera size={28} color="#fff" />
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{tr("📸 Tirar foto agora")}</Text>
              <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{tr("Use a câmara para fotografar o documento")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickFile}
              style={{ borderWidth: 1.5, borderColor: color, borderRadius: 16, borderStyle: "dashed", padding: 14, alignItems: "center", gap: 6, backgroundColor: bgColor }}>
              <Upload size={20} color={color} />
              <Text suppressHighlighting style={{ color, fontWeight: "700", fontSize: 13 }}>{tr("Escolher da galeria / ficheiros")}</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={handleSave} disabled={save.isPending}
          style={{ backgroundColor: color, borderRadius: 18, padding: 16, alignItems: "center", marginTop: 8, opacity: save.isPending ? 0.7 : 1, shadowColor: color, shadowOpacity: 0.3, shadowRadius: 12, elevation: 0 }}>
          {save.isPending ? <ActivityIndicator color="#fff" /> : (
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
              💾 {isPrescription ? tr("Guardar Receita") : tr("Guardar Documento")}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
