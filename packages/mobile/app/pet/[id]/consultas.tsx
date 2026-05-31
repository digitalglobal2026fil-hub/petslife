import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

function Campo({ label, value, onChange, placeholder, keyboardType }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 6 }}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={GRAY}
        keyboardType={keyboardType ?? "default"}
        style={{ backgroundColor: BG, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, padding: 13, fontSize: 14, color: BROWN }} />
    </View>
  );
}

const TIPOS = ["consulta", "cirurgia", "exame", "urgência", "outro"];

export default function ConsultasPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [vet, setVet] = useState("");
  const [clinica, setClinica] = useState("");
  const [notas, setNotas] = useState("");
  const [tipo, setTipo] = useState("consulta");

  const { data: res, isLoading } = useQuery({
    queryKey: ["appointments", id],
    queryFn: async () => (await api.appointments["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const consultas = (res as any)?.appointments ?? [];

  const adicionar = useMutation({
    mutationFn: async () => {
      if (!titulo.trim()) throw new Error("O título é obrigatório");
      if (!data.trim()) throw new Error("A data é obrigatória");
      const r = await api.appointments.$post({ json: {
        petId: id, title: titulo, type: tipo, date: data,
        time: hora || undefined, veterinarian: vet || undefined,
        clinic: clinica || undefined, notes: notas || undefined,
      }});
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments", id] });
      setModal(false);
      setTitulo(""); setData(""); setHora(""); setVet(""); setClinica(""); setNotas(""); setTipo("consulta");
    },
    onError: (e: any) => Alert.alert("Erro", e.message),
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: CARD, borderWidth: 1.5, borderColor: BORDER, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text suppressHighlighting style={{ fontSize: 24 }}>📅</Text>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "900", color: BROWN }}>Consultas</Text>
        </View>
        <TouchableOpacity onPress={() => setModal(true)}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ color: "#fff", fontSize: 22, fontWeight: "700", lineHeight: 26 }}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: "#FFE8D0", borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "#FFCA99" }}>
        <Text suppressHighlighting style={{ color: ORANGE, fontWeight: "700", fontSize: 13, textAlign: "center" }}>
          Consultas em dia, bichinho a sorrir! 😸🐾
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40 }}>
        {isLoading ? <ActivityIndicator color={ORANGE} style={{ marginTop: 40 }} /> :
          consultas.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 50 }}>
              <Text suppressHighlighting style={{ fontSize: 60 }}>📅</Text>
              <Text suppressHighlighting style={{ color: BROWN, fontSize: 18, fontWeight: "800", marginTop: 16 }}>Sem consultas</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 13, textAlign: "center", marginTop: 8, paddingHorizontal: 30, lineHeight: 20 }}>
                Registe as consultas do seu bichinho aqui! Cada visita ao veterinário é um ato de amor 🩺
              </Text>
              <TouchableOpacity onPress={() => setModal(true)}
                style={{ backgroundColor: ORANGE, borderRadius: 18, paddingHorizontal: 28, paddingVertical: 14, marginTop: 24 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>+ Adicionar consulta</Text>
              </TouchableOpacity>
            </View>
          ) : consultas.map((c: any) => (
            <View key={c.id} style={{ backgroundColor: CARD, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: BORDER }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: "#FFE8D0", alignItems: "center", justifyContent: "center" }}>
                  <Text suppressHighlighting style={{ fontSize: 22 }}>📅</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "800", color: BROWN, fontSize: 16 }}>{c.title}</Text>
                  <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 3 }}>
                    🗓️ {c.date}{c.time ? ` às ${c.time}` : ""}
                  </Text>
                  {c.veterinarian && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 2 }}>👨‍⚕️ Dr(a). {c.veterinarian}{c.clinic ? ` — ${c.clinic}` : ""}</Text>}
                  {c.notes && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 4, fontStyle: "italic" }}>"{c.notes}"</Text>}
                  <View style={{ backgroundColor: "#FFE8D0", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 6, borderWidth: 1, borderColor: "#FFCA99" }}>
                    <Text suppressHighlighting style={{ color: ORANGE, fontSize: 11, fontWeight: "700" }}>{c.type}</Text>
                  </View>
                </View>
              </View>
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
            <Text suppressHighlighting style={{ fontWeight: "900", color: BROWN, fontSize: 16 }}>📅 Nova Consulta</Text>
            <TouchableOpacity onPress={() => adicionar.mutate()} disabled={adicionar.isPending}>
              {adicionar.isPending ? <ActivityIndicator color={ORANGE} /> :
                <Text suppressHighlighting style={{ color: ORANGE, fontWeight: "800", fontSize: 15 }}>Guardar</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <Campo label="Título *" value={titulo} onChange={setTitulo} placeholder="Ex: Consulta de rotina..." />
            <Campo label="Data *" value={data} onChange={setData} placeholder="AAAA-MM-DD" />
            <Campo label="Hora" value={hora} onChange={setHora} placeholder="Ex: 14:30" />
            <Campo label="Veterinário" value={vet} onChange={setVet} placeholder="Nome do veterinário" />
            <Campo label="Clínica" value={clinica} onChange={setClinica} placeholder="Nome da clínica" />
            <Campo label="Notas" value={notas} onChange={setNotas} placeholder="Observações..." />

            <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 8 }}>Tipo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 14 }}>
              {TIPOS.map((t) => (
                <TouchableOpacity key={t} onPress={() => setTipo(t)}
                  style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: tipo === t ? ORANGE : BORDER, backgroundColor: tipo === t ? "#FFE8D0" : CARD }}>
                  <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: tipo === t ? ORANGE : GRAY }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
