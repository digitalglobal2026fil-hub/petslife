import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, Modal, Image, Platform
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../../lib/api";
import { uploadImage } from "../../../lib/upload";
import { netError } from "../../../lib/net-error";
import { DateFieldPT } from "../../../components/DateFieldPT";
import { pickImageWithChoice } from "../../../lib/pick-image";
import { tr } from "../../../lib/i18n";

const BG = "#F5ECD7";
const BROWN = "#6B3A2A";
const ORANGE = "#E07A3A";
const CARD = "#FFFFFF";
const BORDER = "#E8D5B7";
const GRAY = "#A08060";
const GREEN = "#22A06B";
const GREEN_BG = "#D6F5E3";

const CUTE_PHRASES = [
  "As vacinas são abraços invisíveis! 🤗",
  "Animal saudável, dono feliz! 🌟",
  "Um passo de cada vez para uma vida longa 🐾",
];

function Field({ label, value, onChange, placeholder, keyboardType }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value} onChangeText={onChange} placeholder={placeholder}
        placeholderTextColor={GRAY} keyboardType={keyboardType ?? "default"}
        style={{ backgroundColor: BG, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, padding: 13, fontSize: 14, color: BROWN }}
      />
    </View>
  );
}

async function pickAndUpload(setter: (u: string) => void, setLoading: (b: boolean) => void) {
  try {
    const asset = await pickImageWithChoice({ title: "Foto da vacina", allowCamera: false, quality: 0.8 });
    if (!asset) return;
    setLoading(true);
    const url = await uploadImage(asset.uri, asset.mimeType);
    setter(url);
  } catch (e: any) {
    Alert.alert(tr("Erro no upload"), e.message ?? "Tente novamente");
  } finally {
    setLoading(false);
  }
}

async function cameraAndUpload(setter: (u: string) => void, setLoading: (b: boolean) => void) {
  try {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert(tr("Permissão necessária"), tr("Ative o acesso à câmara nas definições."));
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (res.canceled || !res.assets?.[0]) return;
    setLoading(true);
    const url = await uploadImage(res.assets[0].uri, res.assets[0].mimeType ?? "image/jpeg");
    setter(url);
  } catch (e: any) {
    Alert.alert(tr("Erro no upload"), e.message ?? "Tente novamente");
  } finally {
    setLoading(false);
  }
}

export default function VaccinesPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [vet, setVet] = useState("");
  const [clinic, setClinic] = useState("");
  const [batch, setBatch] = useState("");
  const [notes, setNotes] = useState("");
  const [docUrl, setDocUrl] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["vaccines", id],
    queryFn: async () => (await api.vaccines["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const vaccines = (data as any)?.vaccines ?? [];

  const add = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("O nome da vacina é obrigatório");
      const today = new Date().toISOString().split("T")[0];
      const res = await api.vaccines.$post({ json: {
        petId: id, name, date: date || today,
        nextDate: nextDate || undefined, veterinarian: vet || undefined,
        clinic: clinic || undefined, batch: batch || undefined,
        notes: notes || undefined, documentUrl: docUrl || undefined,
      }});
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vaccines", id] });
      setModal(false);
      setName(""); setDate(""); setNextDate(""); setVet(""); setClinic(""); setBatch(""); setNotes(""); setDocUrl(null);
    },
    onError: (e: any) => Alert.alert("Ups", netError(e)),
  });

  const del = (vid: string) => Alert.alert("Eliminar vacina?", tr("Esta ação não pode ser desfeita."), [
    { text: tr("Cancelar"), style: "cancel" },
    { text: tr("Eliminar"), style: "destructive", onPress: async () => {
      await (api as any).vaccines[":id"].$delete({ param: { id: vid } });
      qc.invalidateQueries({ queryKey: ["vaccines", id] });
    }},
  ]);

  const phrase = CUTE_PHRASES[Math.floor(Math.random() * CUTE_PHRASES.length)];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: CARD, borderWidth: 1.5, borderColor: BORDER, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text suppressHighlighting style={{ fontSize: 24 }}>💉</Text>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "900", color: BROWN }}>{tr("Vacinas")}</Text>
        </View>
        <TouchableOpacity onPress={() => setModal(true)}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: GREEN, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ color: "#fff", fontSize: 22, fontWeight: "700", lineHeight: 26 }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Cute phrase banner */}
      <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: GREEN_BG, borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "#B2EDD5" }}>
        <Text suppressHighlighting style={{ color: GREEN, fontWeight: "700", fontSize: 13, textAlign: "center" }}>{phrase}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40 }}>
        {isLoading ? (
          <ActivityIndicator color={GREEN} style={{ marginTop: 40 }} />
        ) : vaccines.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 50 }}>
            <Text suppressHighlighting style={{ fontSize: 60 }}>💉</Text>
            <Text suppressHighlighting style={{ color: BROWN, fontSize: 18, fontWeight: "800", marginTop: 16, textAlign: "center" }}>{tr("Sem vacinas ainda")}</Text>
            <Text suppressHighlighting style={{ color: GRAY, fontSize: 13, textAlign: "center", marginTop: 8, paddingHorizontal: 30, lineHeight: 20 }}>
              Registe a caderneta de vacinação do seu bichinho! Cada vacina é um ato de amor 🐾
            </Text>
            <TouchableOpacity onPress={() => setModal(true)}
              style={{ backgroundColor: GREEN, borderRadius: 18, paddingHorizontal: 28, paddingVertical: 14, marginTop: 24 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{tr("+ Adicionar vacina")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          vaccines.map((v: any) => (
            <View key={v.id} style={{ backgroundColor: CARD, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: BORDER, shadowColor: BROWN, shadowOpacity: 0.07, shadowRadius: 8, elevation: 0 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: GREEN_BG, alignItems: "center", justifyContent: "center" }}>
                  <Text suppressHighlighting style={{ fontSize: 22 }}>💉</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "800", color: BROWN, fontSize: 16 }}>{v.name}</Text>
                  {v.date && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 3 }}>📅 Administrada: {v.date}</Text>}
                  {v.veterinarian && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 2 }}>👨‍⚕️ Dr(a). {v.veterinarian}{v.clinic ? ` — ${v.clinic}` : ""}</Text>}
                  {v.batch && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12 }}>🔖 Lote: {v.batch}</Text>}
                  {v.nextDate && (
                    <View style={{ backgroundColor: "#FFF3CD", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginTop: 8, borderWidth: 1, borderColor: "#FFD700" }}>
                      <Text suppressHighlighting style={{ color: "#B8860B", fontSize: 12, fontWeight: "700" }}>⏰ Próxima: {v.nextDate}</Text>
                    </View>
                  )}
                  {v.notes && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 6, fontStyle: "italic" }}>"{v.notes}"</Text>}
                </View>
                <TouchableOpacity onPress={() => del(v.id)} style={{ padding: 6 }}>
                  <Text suppressHighlighting style={{ fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
              {v.documentUrl && (
                <Image source={{ uri: v.documentUrl }} style={{ width: "100%", height: 140, borderRadius: 12, marginTop: 12, resizeMode: "cover" }} />
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 16 }}>
            <TouchableOpacity onPress={() => setModal(false)}>
              <Text suppressHighlighting style={{ color: ORANGE, fontWeight: "700", fontSize: 15 }}>{tr("Cancelar")}</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontWeight: "900", color: BROWN, fontSize: 16 }}>{tr("💉 Nova Vacina")}</Text>
            <TouchableOpacity onPress={() => add.mutate()} disabled={add.isPending}>
              {add.isPending ? <ActivityIndicator color={GREEN} /> :
                <Text suppressHighlighting style={{ color: GREEN, fontWeight: "800", fontSize: 15 }}>{tr("Guardar")}</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <Field label={tr("Nome da vacina *")} value={name} onChange={setName} placeholder={tr("Ex: Raiva, Parvovírus...")} />
            <DateFieldPT label={tr("Data de administração")} value={date} onChange={setDate} />
            <DateFieldPT label={tr("Próxima dose")} value={nextDate} onChange={setNextDate} />
            <Field label={tr("Veterinário")} value={vet} onChange={setVet} placeholder={tr("Nome do veterinário")} />
            <Field label={tr("Clínica")} value={clinic} onChange={setClinic} placeholder={tr("Nome da clínica")} />
            <Field label={tr("Número de lote")} value={batch} onChange={setBatch} placeholder={tr("Lote da vacina")} />
            <Field label={tr("Notas")} value={notes} onChange={setNotes} placeholder={tr("Observações...")} />

            <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 8 }}>📎 Comprovativo (opcional)</Text>
            {docUrl ? (
              <View>
                <Image source={{ uri: docUrl }} style={{ width: "100%", height: 150, borderRadius: 14, resizeMode: "cover" }} />
                <TouchableOpacity onPress={() => setDocUrl(null)} style={{ marginTop: 6, alignItems: "center" }}>
                  <Text suppressHighlighting style={{ color: "#EF4444", fontWeight: "600", fontSize: 13 }}>{tr("Remover")}</Text>
                </TouchableOpacity>
              </View>
            ) : uploading ? (
              <View style={{ alignItems: "center", padding: 20 }}>
                <ActivityIndicator color={GREEN} />
                <Text suppressHighlighting style={{ color: GRAY, marginTop: 8, fontSize: 12 }}>{tr("A carregar...")}</Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity onPress={() => pickAndUpload(setDocUrl, setUploading)}
                  style={{ flex: 1, borderWidth: 2, borderColor: BORDER, borderRadius: 14, borderStyle: "dashed", padding: 16, alignItems: "center", gap: 6, backgroundColor: CARD }}>
                  <Text suppressHighlighting style={{ fontSize: 24 }}>🖼️</Text>
                  <Text suppressHighlighting style={{ fontSize: 12, color: ORANGE, fontWeight: "700" }}>{tr("Galeria")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cameraAndUpload(setDocUrl, setUploading)}
                  style={{ flex: 1, borderWidth: 2, borderColor: BORDER, borderRadius: 14, borderStyle: "dashed", padding: 16, alignItems: "center", gap: 6, backgroundColor: CARD }}>
                  <Text suppressHighlighting style={{ fontSize: 24 }}>📷</Text>
                  <Text suppressHighlighting style={{ fontSize: 12, color: ORANGE, fontWeight: "700" }}>{tr("Câmara")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
