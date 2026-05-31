import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, Modal
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../../lib/api";

const BG = "#F5ECD7";
const BROWN = "#6B3A2A";
const ORANGE = "#E07A3A";
const CARD = "#FFFFFF";
const BORDER = "#E8D5B7";
const GRAY = "#A08060";
const COLOR = "#EF476F";
const COLOR_BG = "#FFE4EC";

const TIPOS = [
  { key: "outro", emoji: "📝", label: "Nota" },
  { key: "sintoma", emoji: "🤒", label: "Sintoma" },
  { key: "comportamento", emoji: "🐾", label: "Comportamento" },
  { key: "alimentacao", emoji: "🍖", label: "Alimentação" },
  { key: "brincadeira", emoji: "🎾", label: "Brincadeira" },
];

function Campo({ label, value, onChange, placeholder, multiline }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 6 }}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={GRAY}
        multiline={multiline} numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? "top" : "center"}
        style={{ backgroundColor: BG, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, padding: 13, fontSize: 14, color: BROWN, minHeight: multiline ? 100 : undefined }} />
    </View>
  );
}

export default function DiarioPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [tipo, setTipo] = useState("outro");

  const { data: res, isLoading } = useQuery({
    queryKey: ["health-logs", id],
    queryFn: async () => (await (api as any)["health-logs"]["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const entradas = (res as any)?.logs ?? [];

  const adicionar = useMutation({
    mutationFn: async () => {
      if (!titulo.trim()) throw new Error("O título é obrigatório");
      const r = await (api as any)["health-logs"].$post({ json: {
        petId: id, type: tipo, title: titulo,
        description: descricao || undefined,
        date: data || new Date().toISOString().slice(0, 10),
      }});
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health-logs", id] });
      setModal(false);
      setTitulo(""); setDescricao(""); setData(""); setTipo("outro");
    },
    onError: (e: any) => Alert.alert("Erro", e.message),
  });

  const eliminar = (lid: string) => Alert.alert("Eliminar entrada?", "", [
    { text: "Cancelar", style: "cancel" },
    { text: "Eliminar", style: "destructive", onPress: async () => {
      await (api as any)["health-logs"][":id"].$delete({ param: { id: lid } });
      qc.invalidateQueries({ queryKey: ["health-logs", id] });
    }},
  ]);

  const tipoInfo = (t: string) => TIPOS.find((x) => x.key === t) ?? TIPOS[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: CARD, borderWidth: 1.5, borderColor: BORDER, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text suppressHighlighting style={{ fontSize: 24 }}>📓</Text>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "900", color: BROWN }}>Diário de Saúde</Text>
        </View>
        <TouchableOpacity onPress={() => setModal(true)}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLOR, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ color: "#fff", fontSize: 22, fontWeight: "700", lineHeight: 26 }}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: COLOR_BG, borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "#FFB3C6" }}>
        <Text suppressHighlighting style={{ color: COLOR, fontWeight: "700", fontSize: 13, textAlign: "center" }}>
          Cada momento especial merece ser recordado! 🩷📖
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40 }}>
        {isLoading ? <ActivityIndicator color={COLOR} style={{ marginTop: 40 }} /> :
          entradas.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 50 }}>
              <Text suppressHighlighting style={{ fontSize: 60 }}>📓</Text>
              <Text suppressHighlighting style={{ color: BROWN, fontSize: 18, fontWeight: "800", marginTop: 16 }}>Diário vazio</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 13, textAlign: "center", marginTop: 8, paddingHorizontal: 30, lineHeight: 20 }}>
                Registe os momentos, sintomas e aventuras do seu bichinho! Cada entrada é uma memória 🐾💕
              </Text>
              <TouchableOpacity onPress={() => setModal(true)}
                style={{ backgroundColor: COLOR, borderRadius: 18, paddingHorizontal: 28, paddingVertical: 14, marginTop: 24 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>+ Primeira entrada</Text>
              </TouchableOpacity>
            </View>
          ) : entradas.map((e: any) => {
            const t = tipoInfo(e.type);
            return (
              <View key={e.id} style={{ backgroundColor: CARD, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: BORDER }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                  <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: COLOR_BG, alignItems: "center", justifyContent: "center" }}>
                    <Text suppressHighlighting style={{ fontSize: 22 }}>{t.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text suppressHighlighting style={{ fontWeight: "800", color: BROWN, fontSize: 16 }}>{e.title}</Text>
                    {e.date && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 3 }}>📅 {e.date}</Text>}
                    <View style={{ backgroundColor: COLOR_BG, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 4, borderWidth: 1, borderColor: "#FFB3C6" }}>
                      <Text suppressHighlighting style={{ color: COLOR, fontSize: 11, fontWeight: "700" }}>{t.emoji} {t.label}</Text>
                    </View>
                    {e.description && <Text suppressHighlighting style={{ color: GRAY, fontSize: 13, marginTop: 8, lineHeight: 20 }}>{e.description}</Text>}
                  </View>
                  <TouchableOpacity onPress={() => eliminar(e.id)} style={{ padding: 6 }}>
                    <Text suppressHighlighting style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        }
      </ScrollView>

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 16 }}>
            <TouchableOpacity onPress={() => setModal(false)}>
              <Text suppressHighlighting style={{ color: "#EF4444", fontWeight: "700", fontSize: 15 }}>Cancelar</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontWeight: "900", color: BROWN, fontSize: 16 }}>📓 Nova Entrada</Text>
            <TouchableOpacity onPress={() => adicionar.mutate()} disabled={adicionar.isPending}>
              {adicionar.isPending ? <ActivityIndicator color={COLOR} /> :
                <Text suppressHighlighting style={{ color: COLOR, fontWeight: "800", fontSize: 15 }}>Guardar</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 8 }}>Tipo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 , paddingBottom: Math.max(insets.bottom, 24) }}>
              {TIPOS.map((t) => (
                <TouchableOpacity key={t.key} onPress={() => setTipo(t.key)}
                  style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 2, borderColor: tipo === t.key ? COLOR : BORDER, backgroundColor: tipo === t.key ? COLOR_BG : CARD, alignItems: "center", gap: 4 }}>
                  <Text suppressHighlighting style={{ fontSize: 20 }}>{t.emoji}</Text>
                  <Text suppressHighlighting style={{ fontSize: 11, fontWeight: "700", color: tipo === t.key ? COLOR : GRAY }}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Campo label="Título *" value={titulo} onChange={setTitulo} placeholder="Ex: Brincou muito hoje! 🎉" />
            <Campo label="Data" value={data} onChange={setData} placeholder="AAAA-MM-DD (hoje por omissão)" />
            <Campo label="Descrição" value={descricao} onChange={setDescricao} placeholder="Conta tudo sobre o teu bichinho... 🐾" multiline />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
