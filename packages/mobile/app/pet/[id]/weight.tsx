import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, TextInput, Modal
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../../lib/api";
import { netError } from "../../../lib/net-error";
import { DateFieldPT } from "../../../components/DateFieldPT";
import { tr } from "../../../lib/i18n";

const BG = "#F5ECD7";
const BROWN = "#6B3A2A";
const ORANGE = "#E07A3A";
const CARD = "#FFFFFF";
const BORDER = "#E8D5B7";
const GRAY = "#A08060";
const COLOR = "#3B82F6";
const COLOR_BG = "#EFF6FF";

function Field({ label, value, onChange, placeholder, keyboardType }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: BROWN, marginBottom: 6 }}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={GRAY}
        keyboardType={keyboardType ?? "default"}
        style={{ backgroundColor: BG, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, padding: 13, fontSize: 14, color: BROWN }} />
    </View>
  );
}

export default function WeightPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);

  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["weight-logs", id],
    queryFn: async () => (await (api as any)["weight-logs"]["pet"][":petId"].$get({ param: { petId: id! } })).json(),
    enabled: !!id,
  });
  const logs = (data as any)?.weightLogs ?? [];

  const add = useMutation({
    mutationFn: async () => {
      if (!weight.trim()) throw new Error("O peso é obrigatório");
      const w = parseFloat(weight);
      if (isNaN(w) || w <= 0) throw new Error("Introduza um peso válido");
      const res = await (api as any)["weight-logs"].$post({ json: {
        petId: id, weight: w, date: date || new Date().toISOString().split("T")[0], notes: notes || undefined,
      }});
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["weight-logs", id] });
      setModal(false);
      setWeight(""); setDate(""); setNotes("");
    },
    onError: (e: any) => Alert.alert("Ups", netError(e)),
  });

  const del = (wid: string) => Alert.alert("Eliminar registo?", "", [
    { text: tr("Cancelar"), style: "cancel" },
    { text: tr("Eliminar"), style: "destructive", onPress: async () => {
      await (api as any)["weight-logs"][":id"].$delete({ param: { id: wid } });
      qc.invalidateQueries({ queryKey: ["weight-logs", id] });
    }},
  ]);

  // Simple trend indicator
  const trend = logs.length >= 2 ? (logs[0].weight > logs[1].weight ? "📈" : logs[0].weight < logs[1].weight ? "📉" : "➡️") : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: CARD, borderWidth: 1.5, borderColor: BORDER, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text suppressHighlighting style={{ fontSize: 24 }}>⚖️</Text>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "900", color: BROWN }}>{tr("Peso")}</Text>
        </View>
        <TouchableOpacity onPress={() => setModal(true)}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLOR, alignItems: "center", justifyContent: "center" }}>
          <Text suppressHighlighting style={{ color: "#fff", fontSize: 22, fontWeight: "700", lineHeight: 26 }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Botao grande e visivel para registar peso (o "+" do cabecalho passava
          despercebido). */}
      <TouchableOpacity onPress={() => setModal(true)} activeOpacity={0.85}
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLOR, marginHorizontal: 20, marginBottom: 14, borderRadius: 16, paddingVertical: 14 }}>
        <Text suppressHighlighting style={{ color: "#fff", fontSize: 20, fontWeight: "800", lineHeight: 22 }}>+</Text>
        <Text suppressHighlighting style={{ color: "#fff", fontSize: 15.5, fontWeight: "800" }}>{tr("Registar peso")}</Text>
      </TouchableOpacity>

      <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: COLOR_BG, borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "#BFDBFE" }}>
        <Text suppressHighlighting style={{ color: COLOR, fontWeight: "700", fontSize: 13, textAlign: "center" }}>
          Manter o peso ideal é sinal de saúde e felicidade! 🐾💙
        </Text>
      </View>

      {/* Latest weight card */}
      {logs.length > 0 && (
        <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: CARD, borderRadius: 20, padding: 20, borderWidth: 1.5, borderColor: COLOR, alignItems: "center" }}>
          <Text suppressHighlighting style={{ color: GRAY, fontSize: 13, fontWeight: "600" }}>{tr("Peso atual")}</Text>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 4 }}>
            <Text suppressHighlighting style={{ color: COLOR, fontSize: 42, fontWeight: "900" }}>{logs[0].weight}</Text>
            <Text suppressHighlighting style={{ color: GRAY, fontSize: 18, fontWeight: "700" }}>kg</Text>
            {trend && <Text suppressHighlighting style={{ fontSize: 24 }}>{trend}</Text>}
          </View>
          <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 4 }}>{logs[0].date}</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40 }}>
        {isLoading ? <ActivityIndicator color={COLOR} style={{ marginTop: 40 }} /> :
          logs.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 50 }}>
              <Text suppressHighlighting style={{ fontSize: 60 }}>⚖️</Text>
              <Text suppressHighlighting style={{ color: BROWN, fontSize: 18, fontWeight: "800", marginTop: 16 }}>{tr("Sem registos de peso")}</Text>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 13, textAlign: "center", marginTop: 8, paddingHorizontal: 30, lineHeight: 20 }}>
                Registe o peso regularmente para acompanhar o crescimento saudável do seu bichinho! 📏
              </Text>
              <TouchableOpacity onPress={() => setModal(true)}
                style={{ backgroundColor: COLOR, borderRadius: 18, paddingHorizontal: 28, paddingVertical: 14, marginTop: 24 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{tr("+ Registar peso")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text suppressHighlighting style={{ fontSize: 14, fontWeight: "800", color: BROWN, marginBottom: 12 }}>{tr("Histórico")}</Text>
              {logs.map((l: any, i: number) => (
                <View key={l.id} style={{ backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: BORDER, flexDirection: "row", alignItems: "center" }}>
                  <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: COLOR_BG, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <Text suppressHighlighting style={{ color: COLOR, fontWeight: "900", fontSize: 14 }}>{l.weight}kg</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text suppressHighlighting style={{ color: BROWN, fontWeight: "700", fontSize: 15 }}>{l.weight} kg</Text>
                    <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, marginTop: 2 }}>📅 {l.date}</Text>
                    {l.notes && <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, fontStyle: "italic" }}>"{l.notes}"</Text>}
                  </View>
                  {i > 0 && logs[i - 1] && (
                    <Text suppressHighlighting style={{ color: GRAY, fontSize: 11, marginRight: 8 }}>
                      {l.weight > logs[i - 1].weight ? "📈" : l.weight < logs[i - 1].weight ? "📉" : "➡️"}
                      {" "}{Math.abs(l.weight - logs[i - 1].weight).toFixed(1)}kg
                    </Text>
                  )}
                  <TouchableOpacity onPress={() => del(l.id)} style={{ padding: 6 }}>
                    <Text suppressHighlighting style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )
        }
      </ScrollView>

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 16 }}>
            <TouchableOpacity onPress={() => setModal(false)}>
              <Text suppressHighlighting style={{ color: ORANGE, fontWeight: "700", fontSize: 15 }}>{tr("Cancelar")}</Text>
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontWeight: "900", color: BROWN, fontSize: 16 }}>{tr("⚖️ Registar Peso")}</Text>
            <TouchableOpacity onPress={() => add.mutate()} disabled={add.isPending}>
              {add.isPending ? <ActivityIndicator color={COLOR} /> :
                <Text suppressHighlighting style={{ color: COLOR, fontWeight: "800", fontSize: 15 }}>{tr("Guardar")}</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <Field label="Peso (kg) *" value={weight} onChange={setWeight} placeholder="Ex: 4.5" keyboardType="decimal-pad" />
            <DateFieldPT label={tr("Data")} value={date} onChange={setDate} />
            <Field label={tr("Notas")} value={notes} onChange={setNotes} placeholder={tr("Observações...")} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
