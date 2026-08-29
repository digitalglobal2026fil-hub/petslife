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
import { netError } from "../../../lib/net-error";
import { pickImageWithChoice } from "../../../lib/pick-image";
import { tr } from "../../../lib/i18n";
import { Share2, Printer } from "lucide-react-native";
import { shareImage, printImage } from "../../../lib/share-image";

const BG = "#F5ECD7";
const BROWN = "#6B3A2A";
const ORANGE = "#E07A3A";
const CARD = "#FFFFFF";
const BORDER = "#E8D5B7";
const GRAY = "#A08060";
const COLOR = "#8B5CF6";
const COLOR_BG = "#F3EEFF";

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
    const asset = await pickImageWithChoice({ title: "Foto da receita", allowCamera: false, quality: 0.8 });
    if (!asset) return;
    setCarregando(true);
    const url = await uploadImage(asset.uri, asset.mimeType);
    setter(url);
  } catch (e: any) { Alert.alert(tr("Erro no upload"), e.message ?? "Tente novamente"); }
  finally { setCarregando(false); }
}

async function tirarFoto(setter: (u: string) => void, setCarregando: (b: boolean) => void) {
  try {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") { Alert.alert(tr("Permissão necessária"), tr("Ative o acesso à câmara nas definições.")); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (res.canceled || !res.assets?.[0]) return;
    setCarregando(true);
    const url = await uploadImage(res.assets[0].uri, res.assets[0].mimeType ?? "image/jpeg");
    setter(url);
  } catch (e: any) { Alert.alert(tr("Erro no upload"), e.message ?? "Tente novamente"); }
  finally { setCarregando(false); }
}

export default function ReceitasPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [notas, setNotas] = useState("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["documents", id],
    queryFn: async () => (await api.documents["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const receitas = ((data as any)?.documents ?? []).filter((d: any) => d.type === "receita");

  const adicionar = useMutation({
    mutationFn: async () => {
      if (!titulo.trim()) throw new Error("O título é obrigatório");
      const r = await api.documents.$post({ json: {
        petId: id, type: "receita", title: titulo,
        url: fotoUrl ?? "", notes: notas || undefined,
      }});
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents", id] });
      setModal(false);
      setTitulo(""); setNotas(""); setFotoUrl(null);
    },
    onError: (e: any) => Alert.alert("Ups", netError(e)),
  });

  const eliminar = (did: string) => Alert.alert("Eliminar receita?", "", [
    { text: tr("Cancelar"), style: "cancel" },
    { text: tr("Eliminar"), style: "destructive", onPress: async () => {
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
          <Text suppressHighlighting style={{ fontSize: 24 }}>💊</Text>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "900", color: BROWN }}>{tr("Receitas")}</Text>
        </View>
        <TouchableOpacity onPress={() => setModal(true)}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLOR, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ color: "#fff", fontSize: 22, fontWeight: "700", lineHeight: 26 }}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: COLOR_BG, borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "#D8B4FE" }}>
        <Text suppressHighlighting style={{ color: COLOR, fontWeight: "700", fontSize: 13, textAlign: "center" }}>
          Guarde todas as receitas do seu bichinho num só lugar! 💜🐾
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40 }}>
        {isLoading ? <ActivityIndicator color={COLOR} style={{ marginTop: 40 }} /> :
          receitas.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 50 }}>
              <Text suppressHighlighting style={{ fontSize: 60 }}>💊</Text>
              <Text suppressHighlighting style={{ color: BROWN, fontSize: 18, fontWeight: "800", marginTop: 16 }}>{tr("Sem receitas")}</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 13, textAlign: "center", marginTop: 8, paddingHorizontal: 30, lineHeight: 20 }}>
                Tire uma foto às receitas do veterinário para as ter sempre à mão! 📱
              </Text>
              <TouchableOpacity onPress={() => setModal(true)}
                style={{ backgroundColor: COLOR, borderRadius: 18, paddingHorizontal: 28, paddingVertical: 14, marginTop: 24 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{tr("+ Adicionar receita")}</Text>
              </TouchableOpacity>
            </View>
          ) : receitas.map((r: any) => (
            <View key={r.id} style={{ backgroundColor: CARD, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: BORDER }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: COLOR_BG, alignItems: "center", justifyContent: "center" }}>
                  <Text suppressHighlighting style={{ fontSize: 22 }}>💊</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "800", color: BROWN, fontSize: 16 }}>{r.title}</Text>
                  {r.notes && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 3, fontStyle: "italic" }}>"{r.notes}"</Text>}
                </View>
                <TouchableOpacity onPress={() => eliminar(r.id)} style={{ padding: 6 }}>
                  <Text suppressHighlighting style={{ fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
              {r.url && r.url.startsWith("data:") && (
                <Image source={{ uri: r.url }} style={{ width: "100%", height: 180, borderRadius: 12, marginTop: 12, resizeMode: "cover" }} />
              )}
              {r.url && (
                <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                  <TouchableOpacity onPress={() => shareImage(r.url, r.title)}
                    style={{ flex: 1, backgroundColor: "#22C55E", borderRadius: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Share2 size={15} color="#fff" />
                    <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>{tr("Partilhar")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => printImage(r.url, r.title)}
                    style={{ flex: 1, backgroundColor: "#3B82F6", borderRadius: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Printer size={15} color="#fff" />
                    <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>{tr("Imprimir")}</Text>
                  </TouchableOpacity>
                </View>
              )}

            </View>
          ))
        }
      </ScrollView>

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 16 }}>
            <TouchableOpacity onPress={() => setModal(false)}>
              <Text suppressHighlighting style={{ color: "#EF4444", fontWeight: "700", fontSize: 15 }}>{tr("Cancelar")}</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontWeight: "900", color: BROWN, fontSize: 16 }}>{tr("💊 Nova Receita")}</Text>
            <TouchableOpacity onPress={() => adicionar.mutate()} disabled={adicionar.isPending}>
              {adicionar.isPending ? <ActivityIndicator color={COLOR} /> :
                <Text suppressHighlighting style={{ color: COLOR, fontWeight: "800", fontSize: 15 }}>{tr("Guardar")}</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <Campo label={tr("Título *")} value={titulo} onChange={setTitulo} placeholder={tr("Ex: Antibiótico, Vermífugo...")} />
            <Campo label={tr("Notas")} value={notas} onChange={setNotas} placeholder={tr("Dosagem, instruções...")} />

            <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 8 }}>{tr("📷 Foto da receita")}</Text>
            {fotoUrl ? (
              <View>
                <Image source={{ uri: fotoUrl }} style={{ width: "100%", height: 200, borderRadius: 14, resizeMode: "cover" }} />
                <TouchableOpacity onPress={() => setFotoUrl(null)} style={{ marginTop: 8, alignItems: "center" }}>
                  <Text suppressHighlighting style={{ color: "#EF4444", fontWeight: "600", fontSize: 13 }}>{tr("Remover foto")}</Text>
                </TouchableOpacity>
              </View>
            ) : carregando ? (
              <View style={{ alignItems: "center", padding: 30 }}>
                <ActivityIndicator color={COLOR} size="large" />
                <Text suppressHighlighting style={{ color: GRAY, marginTop: 10, fontSize: 13 }}>{tr("A carregar foto... 📤")}</Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity onPress={() => escolherFoto(setFotoUrl, setCarregando)}
                  style={{ flex: 1, borderWidth: 2, borderColor: COLOR, borderRadius: 16, borderStyle: "dashed", padding: 20, alignItems: "center", gap: 8, backgroundColor: COLOR_BG }}>
                  <Text suppressHighlighting style={{ fontSize: 30 }}>🖼️</Text>
                  <Text suppressHighlighting style={{ fontSize: 13, color: COLOR, fontWeight: "700" }}>{tr("Galeria")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => tirarFoto(setFotoUrl, setCarregando)}
                  style={{ flex: 1, borderWidth: 2, borderColor: COLOR, borderRadius: 16, borderStyle: "dashed", padding: 20, alignItems: "center", gap: 8, backgroundColor: COLOR_BG }}>
                  <Text suppressHighlighting style={{ fontSize: 30 }}>📷</Text>
                  <Text suppressHighlighting style={{ fontSize: 13, color: COLOR, fontWeight: "700" }}>{tr("Câmara")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
