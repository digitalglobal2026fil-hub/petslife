import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, Modal, Image
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
const COLOR = "#D97706";
const COLOR_BG = "#FEF3C7";

function Field({ label, value, onChange, placeholder }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 6 }}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={GRAY}
        style={{ backgroundColor: BG, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, padding: 13, fontSize: 14, color: BROWN }} />
    </View>
  );
}

async function pickAndUpload(setter: (u: string) => void, setLoading: (b: boolean) => void) {
  try {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") { Alert.alert("Permissão necessária", "Ative o acesso à galeria."); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true });
    if (res.canceled || !res.assets?.[0]) return;
    setLoading(true);
    const url = await uploadImage(res.assets[0].uri, res.assets[0].mimeType ?? "image/jpeg");
    setter(url);
  } catch (e: any) { Alert.alert("Erro no upload", e.message ?? "Tente novamente"); }
  finally { setLoading(false); }
}

async function cameraAndUpload(setter: (u: string) => void, setLoading: (b: boolean) => void) {
  try {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") { Alert.alert("Permissão necessária", "Ative o acesso à câmara."); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (res.canceled || !res.assets?.[0]) return;
    setLoading(true);
    const url = await uploadImage(res.assets[0].uri, res.assets[0].mimeType ?? "image/jpeg");
    setter(url);
  } catch (e: any) { Alert.alert("Erro no upload", e.message ?? "Tente novamente"); }
  finally { setLoading(false); }
}

export default function DewormingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [product, setProduct] = useState("");
  const [date, setDate] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [type, setType] = useState("internal");
  const [notes, setNotes] = useState("");
  const [docUrl, setDocUrl] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["dewormings", id],
    queryFn: async () => (await (api as any).dewormings["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const dewormings = (data as any)?.dewormings ?? [];

  const add = useMutation({
    mutationFn: async () => {
      if (!product.trim()) throw new Error("O produto é obrigatório");
      const res = await (api as any).dewormings.$post({ json: {
        petId: id, product, date: date || new Date().toISOString().split("T")[0],
        nextDate: nextDate || undefined, type, notes: notes || undefined, documentUrl: docUrl || undefined,
      }});
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dewormings", id] });
      setModal(false);
      setProduct(""); setDate(""); setNextDate(""); setType("internal"); setNotes(""); setDocUrl(null);
    },
    onError: (e: any) => Alert.alert("Erro", e.message),
  });

  const del = (did: string) => Alert.alert("Eliminar?", "", [
    { text: "Cancelar", style: "cancel" },
    { text: "Eliminar", style: "destructive", onPress: async () => {
      await (api as any).dewormings[":id"].$delete({ param: { id: did } });
      qc.invalidateQueries({ queryKey: ["dewormings", id] });
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
          <Text suppressHighlighting style={{ fontSize: 24 }}>🪱</Text>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "900", color: BROWN }}>Desparasitação</Text>
        </View>
        <TouchableOpacity onPress={() => setModal(true)}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLOR, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ color: "#fff", fontSize: 22, fontWeight: "700", lineHeight: 26 }}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: COLOR_BG, borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "#F59E0B" }}>
        <Text suppressHighlighting style={{ color: COLOR, fontWeight: "700", fontSize: 13, textAlign: "center" }}>
          Proteger o seu bichinho é o maior ato de amor! 🐾✨
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40 }}>
        {isLoading ? <ActivityIndicator color={COLOR} style={{ marginTop: 40 }} /> :
          dewormings.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 50 }}>
              <Text suppressHighlighting style={{ fontSize: 60 }}>🪱</Text>
              <Text suppressHighlighting style={{ color: BROWN, fontSize: 18, fontWeight: "800", marginTop: 16 }}>Sem registos</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 13, textAlign: "center", marginTop: 8, paddingHorizontal: 30, lineHeight: 20 }}>
                Registe as desparasitações internas e externas do seu animal! 🛡️
              </Text>
              <TouchableOpacity onPress={() => setModal(true)}
                style={{ backgroundColor: COLOR, borderRadius: 18, paddingHorizontal: 28, paddingVertical: 14, marginTop: 24 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>+ Adicionar registo</Text>
              </TouchableOpacity>
            </View>
          ) : dewormings.map((d: any) => (
            <View key={d.id} style={{ backgroundColor: CARD, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: BORDER }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: COLOR_BG, alignItems: "center", justifyContent: "center" }}>
                  <Text suppressHighlighting style={{ fontSize: 22 }}>🪱</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "800", color: BROWN, fontSize: 16 }}>{d.product}</Text>
                  <View style={{ backgroundColor: COLOR_BG, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 4, borderWidth: 1, borderColor: "#F59E0B" }}>
                    <Text suppressHighlighting style={{ color: COLOR, fontSize: 11, fontWeight: "700" }}>{d.type === "internal" ? "Interna" : d.type === "external" ? "Externa" : "Ambas"}</Text>
                  </View>
                  {d.date && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 6 }}>📅 Aplicada: {d.date}</Text>}
                  {d.nextDate && <Text suppressHighlighting style={{ color: COLOR, fontSize: 12, fontWeight: "700" }}>⏰ Próxima: {d.nextDate}</Text>}
                  {d.notes && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 4, fontStyle: "italic" }}>"{d.notes}"</Text>}
                </View>
                <TouchableOpacity onPress={() => del(d.id)} style={{ padding: 6 }}>
                  <Text suppressHighlighting style={{ fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
              {d.documentUrl && <Image source={{ uri: d.documentUrl }} style={{ width: "100%", height: 140, borderRadius: 12, marginTop: 12, resizeMode: "cover" }} />}
            </View>
          ))
        }
      </ScrollView>

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 16 }}>
            <TouchableOpacity onPress={() => setModal(false)}>
              <Text suppressHighlighting style={{ color: ORANGE, fontWeight: "700", fontSize: 15 }}>Cancelar</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontWeight: "900", color: BROWN, fontSize: 16 }}>🪱 Nova Desparasitação</Text>
            <TouchableOpacity onPress={() => add.mutate()} disabled={add.isPending}>
              {add.isPending ? <ActivityIndicator color={COLOR} /> :
                <Text suppressHighlighting style={{ color: COLOR, fontWeight: "800", fontSize: 15 }}>Guardar</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <Field label="Produto *" value={product} onChange={setProduct} placeholder="Ex: Stronghold, Advantage..." />
            <Field label="Data de aplicação" value={date} onChange={setDate} placeholder="AAAA-MM-DD" />
            <Field label="Próxima aplicação" value={nextDate} onChange={setNextDate} placeholder="AAAA-MM-DD" />

            <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 8 }}>Tipo</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
              {["internal", "external", "both"].map((t) => (
                <TouchableOpacity key={t} onPress={() => setType(t)}
                  style={{ flex: 1, padding: 10, borderRadius: 12, borderWidth: 2, borderColor: type === t ? COLOR : BORDER, backgroundColor: type === t ? COLOR_BG : CARD, alignItems: "center" }}>
                  <Text suppressHighlighting style={{ fontSize: 11, fontWeight: "700", color: type === t ? COLOR : GRAY }}>
                    {t === "internal" ? "Interna" : t === "external" ? "Externa" : "Ambas"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Field label="Notas" value={notes} onChange={setNotes} placeholder="Observações..." />

            <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 8 }}>📎 Comprovativo</Text>
            {docUrl ? (
              <View>
                <Image source={{ uri: docUrl }} style={{ width: "100%", height: 150, borderRadius: 14, resizeMode: "cover" }} />
                <TouchableOpacity onPress={() => setDocUrl(null)} style={{ marginTop: 6, alignItems: "center" }}>
                  <Text suppressHighlighting style={{ color: "#EF4444", fontWeight: "600", fontSize: 13 }}>Remover</Text>
                </TouchableOpacity>
              </View>
            ) : uploading ? (
              <View style={{ alignItems: "center", padding: 20 }}>
                <ActivityIndicator color={COLOR} />
                <Text suppressHighlighting style={{ color: GRAY, marginTop: 8, fontSize: 12 }}>A carregar...</Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity onPress={() => pickAndUpload(setDocUrl, setUploading)}
                  style={{ flex: 1, borderWidth: 2, borderColor: BORDER, borderRadius: 14, borderStyle: "dashed", padding: 16, alignItems: "center", gap: 6, backgroundColor: CARD }}>
                  <Text suppressHighlighting style={{ fontSize: 24 }}>🖼️</Text>
                  <Text suppressHighlighting style={{ fontSize: 12, color: ORANGE, fontWeight: "700" }}>Galeria</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cameraAndUpload(setDocUrl, setUploading)}
                  style={{ flex: 1, borderWidth: 2, borderColor: BORDER, borderRadius: 14, borderStyle: "dashed", padding: 16, alignItems: "center", gap: 6, backgroundColor: CARD }}>
                  <Text suppressHighlighting style={{ fontSize: 24 }}>📷</Text>
                  <Text suppressHighlighting style={{ fontSize: 12, color: ORANGE, fontWeight: "700" }}>Câmara</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
