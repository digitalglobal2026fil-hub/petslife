import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, Modal, Image, Linking
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../../lib/api";
import { uploadImage } from "../../../lib/upload";

const BG = "#F5ECD7";
const BROWN = "#6B3A2A";
const ORANGE = "#E07A3A";
const CARD = "#FFFFFF";
const BORDER = "#E8D5B7";
const GRAY = "#A08060";
const COLOR = "#5B7FE8";
const COLOR_BG = "#DDE8FF";

const TIPOS_DOC = ["passaporte", "seguro", "exame", "raio-x", "análises", "outro"];

function Campo({ label, value, onChange, placeholder }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 6 }}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={GRAY}
        style={{ backgroundColor: BG, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, padding: 13, fontSize: 14, color: BROWN }} />
    </View>
  );
}

async function escolherFoto(setter: (u: string) => void, setCarregando: (b: boolean) => void) {
  try {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") { Alert.alert("Permissão necessária", "Ative o acesso à galeria."); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true });
    if (res.canceled || !res.assets?.[0]) return;
    setCarregando(true);
    const url = await uploadImage(res.assets[0].uri, res.assets[0].mimeType ?? "image/jpeg");
    setter(url);
  } catch (e: any) { Alert.alert("Erro no upload", e.message ?? "Tente novamente"); }
  finally { setCarregando(false); }
}

async function tirarFoto(setter: (u: string) => void, setCarregando: (b: boolean) => void) {
  try {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") { Alert.alert("Permissão necessária", "Ative o acesso à câmara."); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (res.canceled || !res.assets?.[0]) return;
    setCarregando(true);
    const url = await uploadImage(res.assets[0].uri, res.assets[0].mimeType ?? "image/jpeg");
    setter(url);
  } catch (e: any) { Alert.alert("Erro no upload", e.message ?? "Tente novamente"); }
  finally { setCarregando(false); }
}

const tipoEmoji: Record<string, string> = {
  passaporte: "🛂", seguro: "🛡️", exame: "🔬", "raio-x": "🩻", análises: "🧪", outro: "📄"
};

export default function DocumentosPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("outro");
  const [notas, setNotas] = useState("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["documents", id],
    queryFn: async () => (await api.documents["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const documentos = ((data as any)?.documents ?? []).filter((d: any) => d.type !== "receita");

  const adicionar = useMutation({
    mutationFn: async () => {
      if (!titulo.trim()) throw new Error("O título é obrigatório");
      const r = await api.documents.$post({ json: {
        petId: id, type: tipo, title: titulo,
        url: fotoUrl ?? "", notes: notas || undefined,
      }});
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents", id] });
      setModal(false);
      setTitulo(""); setTipo("outro"); setNotas(""); setFotoUrl(null);
    },
    onError: (e: any) => Alert.alert("Erro", e.message),
  });

  const eliminar = (did: string) => Alert.alert("Eliminar documento?", "", [
    { text: "Cancelar", style: "cancel" },
    { text: "Eliminar", style: "destructive", onPress: async () => {
      await (api as any).documents[":id"].$delete({ param: { id: did } });
      qc.invalidateQueries({ queryKey: ["documents", id] });
    }},
  ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: CARD, borderWidth: 1.5, borderColor: BORDER, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text suppressHighlighting style={{ fontSize: 24 }}>📄</Text>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "900", color: BROWN }}>Documentos</Text>
        </View>
        <TouchableOpacity onPress={() => setModal(true)}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLOR, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ color: "#fff", fontSize: 22, fontWeight: "700", lineHeight: 26 }}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: COLOR_BG, borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "#A5B4FC" }}>
        <Text suppressHighlighting style={{ color: COLOR, fontWeight: "700", fontSize: 13, textAlign: "center" }}>
          Todos os documentos do seu bichinho organizadinhos! 📁🐾
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40 }}>
        {isLoading ? <ActivityIndicator color={COLOR} style={{ marginTop: 40 }} /> :
          documentos.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 50 }}>
              <Text suppressHighlighting style={{ fontSize: 60 }}>📄</Text>
              <Text suppressHighlighting style={{ color: BROWN, fontSize: 18, fontWeight: "800", marginTop: 16 }}>Sem documentos</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 13, textAlign: "center", marginTop: 8, paddingHorizontal: 30, lineHeight: 20 }}>
                Guarde o passaporte, seguros, exames e mais do seu animal! Tudo organizado 📂✨
              </Text>
              <TouchableOpacity onPress={() => setModal(true)}
                style={{ backgroundColor: COLOR, borderRadius: 18, paddingHorizontal: 28, paddingVertical: 14, marginTop: 24 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>+ Adicionar documento</Text>
              </TouchableOpacity>
            </View>
          ) : documentos.map((d: any) => (
            <View key={d.id} style={{ backgroundColor: CARD, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: BORDER }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: COLOR_BG, alignItems: "center", justifyContent: "center" }}>
                  <Text suppressHighlighting style={{ fontSize: 22 }}>{tipoEmoji[d.type] ?? "📄"}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "800", color: BROWN, fontSize: 16 }}>{d.title}</Text>
                  <View style={{ backgroundColor: COLOR_BG, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 4, borderWidth: 1, borderColor: "#A5B4FC" }}>
                    <Text suppressHighlighting style={{ color: COLOR, fontSize: 11, fontWeight: "700" }}>{tipoEmoji[d.type] ?? "📄"} {d.type}</Text>
                  </View>
                  {d.notes && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 4, fontStyle: "italic" }}>"{d.notes}"</Text>}
                </View>
                <TouchableOpacity onPress={() => eliminar(d.id)} style={{ padding: 6 }}>
                  <Text suppressHighlighting style={{ fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
              {d.url && d.url.startsWith("data:") && (
                <Image source={{ uri: d.url }} style={{ width: "100%", height: 160, borderRadius: 12, marginTop: 12, resizeMode: "cover" }} />
              )}
            </View>
          ))
        }
      </ScrollView>

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 16 }}>
            <TouchableOpacity onPress={() => setModal(false)}>
              <Text suppressHighlighting style={{ color: "#EF4444", fontWeight: "700", fontSize: 15 }}>Cancelar</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontWeight: "900", color: BROWN, fontSize: 16 }}>📄 Novo Documento</Text>
            <TouchableOpacity onPress={() => adicionar.mutate()} disabled={adicionar.isPending}>
              {adicionar.isPending ? <ActivityIndicator color={COLOR} /> :
                <Text suppressHighlighting style={{ color: COLOR, fontWeight: "800", fontSize: 15 }}>Guardar</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <Campo label="Título *" value={titulo} onChange={setTitulo} placeholder="Ex: Passaporte Europeu..." />
            <Campo label="Notas" value={notas} onChange={setNotas} placeholder="Observações..." />

            <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 8 }}>Tipo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 , paddingBottom: Math.max(insets.bottom, 24) }}>
              {TIPOS_DOC.map((t) => (
                <TouchableOpacity key={t} onPress={() => setTipo(t)}
                  style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 2, borderColor: tipo === t ? COLOR : BORDER, backgroundColor: tipo === t ? COLOR_BG : CARD, alignItems: "center", gap: 4 }}>
                  <Text suppressHighlighting style={{ fontSize: 20 }}>{tipoEmoji[t] ?? "📄"}</Text>
                  <Text suppressHighlighting style={{ fontSize: 11, fontWeight: "700", color: tipo === t ? COLOR : GRAY }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 8 }}>📷 Foto / Scan do documento</Text>
            {fotoUrl ? (
              <View>
                <Image source={{ uri: fotoUrl }} style={{ width: "100%", height: 200, borderRadius: 14, resizeMode: "cover" }} />
                <TouchableOpacity onPress={() => setFotoUrl(null)} style={{ marginTop: 8, alignItems: "center" }}>
                  <Text suppressHighlighting style={{ color: "#EF4444", fontWeight: "600", fontSize: 13 }}>Remover foto</Text>
                </TouchableOpacity>
              </View>
            ) : carregando ? (
              <View style={{ alignItems: "center", padding: 30 }}>
                <ActivityIndicator color={COLOR} size="large" />
                <Text suppressHighlighting style={{ color: GRAY, marginTop: 10, fontSize: 13 }}>A carregar... 📤</Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity onPress={() => escolherFoto(setFotoUrl, setCarregando)}
                  style={{ flex: 1, borderWidth: 2, borderColor: COLOR, borderRadius: 16, borderStyle: "dashed", padding: 20, alignItems: "center", gap: 8, backgroundColor: COLOR_BG }}>
                  <Text suppressHighlighting style={{ fontSize: 30 }}>🖼️</Text>
                  <Text suppressHighlighting style={{ fontSize: 13, color: COLOR, fontWeight: "700" }}>Galeria</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => tirarFoto(setFotoUrl, setCarregando)}
                  style={{ flex: 1, borderWidth: 2, borderColor: COLOR, borderRadius: 16, borderStyle: "dashed", padding: 20, alignItems: "center", gap: 8, backgroundColor: COLOR_BG }}>
                  <Text suppressHighlighting style={{ fontSize: 30 }}>📷</Text>
                  <Text suppressHighlighting style={{ fontSize: 13, color: COLOR, fontWeight: "700" }}>Câmara</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
