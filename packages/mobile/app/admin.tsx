import { useState, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator,
  Alert, KeyboardAvoidingView, Platform, RefreshControl, Modal, Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft, Lock, Plus, Trophy, Users, Ticket, TrendingUp, Trash2,
  ChevronDown, ChevronUp, Share2, X,
} from "lucide-react-native";
import { BASE_URL } from "../lib/api";

// Mensagem que a administradora envia a quem recebe o código.
// Sem links: só o código e onde o colar dentro da app.
function mensagemDoCodigo(code: string) {
  return [
    "Olá! Tenho um presente para ti 🐾",
    "",
    "O teu código PetsLife:",
    code,
    "",
    "Abre a app PetsLife, vai a Perfil → Código Promocional,",
    "cola o código e está feito.",
  ].join("\n");
}

import { netError } from "../lib/net-error";
import { authFetch } from "../lib/auth-fetch";
import { tr } from "../lib/i18n";

const PURPLE = "#8B5CF6";
const BG = "#F8F6FF";

const BENEFITS = [
  { key: "discount", label: tr("Só desconto / contagem"), hint: tr("Não dá acesso grátis. Serve para contar vendas.") },
  { key: "months3", label: tr("3 meses grátis"), hint: tr("Acesso completo 3 meses.") },
  { key: "year1", label: tr("1 ano grátis"), hint: tr("Acesso completo 12 meses.") },
  { key: "lifetime", label: tr("Vitalício"), hint: tr("Nunca paga.") },
];

function benefitLabel(k?: string) {
  return BENEFITS.find((b) => b.key === k)?.label ?? k ?? "-";
}

function getToken(): string {
  try {
    if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem("bearer_token") : null) ?? "";
    const SecureStore = require("expo-secure-store");
    return SecureStore.getItem("bearer_token") ?? "";
  } catch { return ""; }
}

export default function AdminScreen() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // modais
  const [newPartner, setNewPartner] = useState(false);
  const [pName, setPName] = useState("");
  const [pCode, setPCode] = useState("");
  const [pBenefit, setPBenefit] = useState("lifetime");
  const [pNotes, setPNotes] = useState("");

  const [newCodeFor, setNewCodeFor] = useState<any>(null);
  const [cCode, setCCode] = useState("");
  const [cBenefit, setCBenefit] = useState("discount");
  const [cLabel, setCLabel] = useState("");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    "x-admin-pin": pin,
  });

  async function login() {
    if (pin.length < 4) return;
    setLoading(true);
    try {
      const res = await authFetch(`${BASE_URL}/api/partners/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const d = await res.json();
      if (!res.ok) {
        Alert.alert(tr("Acesso negado"), d.error || tr("PIN incorrecto."));
        return;
      }
      setAuthed(true);
      await load();
    } catch (e: any) {
      Alert.alert(tr("Erro"), netError(e));
    } finally {
      setLoading(false);
    }
  }

  const load = useCallback(async () => {
    try {
      const res = await authFetch(`${BASE_URL}/api/partners/admin/dashboard`, { headers: authHeaders() });
      const d = await res.json();
      if (res.ok) setData(d);
      else Alert.alert(tr("Erro"), d.error || tr("Não foi possível carregar."));
    } catch (e: any) {
      Alert.alert(tr("Erro"), netError(e));
    }
  }, [pin]);

  async function createPartner() {
    if (!pName.trim()) { Alert.alert(tr("Atenção"), tr("Escreve o nome do parceiro.")); return; }
    try {
      const res = await authFetch(`${BASE_URL}/api/partners/admin/partners`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: pName.trim(), mainCode: pCode.trim() || undefined, partnerBenefit: pBenefit, notes: pNotes || undefined }),
      });
      const d = await res.json();
      if (!res.ok) { Alert.alert(tr("Erro"), d.error || tr("Falhou.")); return; }
      setNewPartner(false); setPName(""); setPCode(""); setPNotes(""); setPBenefit("lifetime");
      await load();
      Alert.alert("Parceiro criado", `Código do parceiro: ${d.partner.mainCode}\n\nEle usa este código para ter o acesso dele.`);
    } catch (e: any) {
      Alert.alert(tr("Erro"), netError(e));
    }
  }

  async function createCode() {
    if (!newCodeFor) return;
    try {
      const res = await authFetch(`${BASE_URL}/api/partners/admin/partners/${newCodeFor.id}/codes`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ code: cCode.trim() || undefined, benefit: cBenefit, label: cLabel || undefined }),
      });
      const d = await res.json();
      if (!res.ok) { Alert.alert(tr("Erro"), d.error || tr("Falhou.")); return; }
      setNewCodeFor(null); setCCode(""); setCLabel(""); setCBenefit("discount");
      await load();
      Alert.alert(tr("Código criado"), `${d.code.code}\n\nO parceiro dá este código aos seguidores dele.`);
    } catch (e: any) {
      Alert.alert(tr("Erro"), netError(e));
    }
  }

  async function deleteCode(id: string, code: string) {
    Alert.alert(tr("Apagar código"), `Apagar o código ${code}? Os resgates já feitos mantêm-se.`, [
      { text: tr("Cancelar"), style: "cancel" },
      {
        text: tr("Apagar"), style: "destructive", onPress: async () => {
          try {
            await authFetch(`${BASE_URL}/api/partners/admin/codes/${id}`, { method: "DELETE", headers: authHeaders() });
            await load();
          } catch (e: any) { Alert.alert(tr("Erro"), netError(e)); }
        },
      },
    ]);
  }

  async function deletePartner(id: string, name: string) {
    Alert.alert(tr("Apagar parceiro"), `Apagar ${name} e todos os códigos dele?`, [
      { text: tr("Cancelar"), style: "cancel" },
      {
        text: tr("Apagar"), style: "destructive", onPress: async () => {
          try {
            await authFetch(`${BASE_URL}/api/partners/admin/partners/${id}`, { method: "DELETE", headers: authHeaders() });
            await load();
          } catch (e: any) { Alert.alert(tr("Erro"), netError(e)); }
        },
      },
    ]);
  }

  // ---------- ECRÃ DO PIN ----------
  if (!authed) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1A1A2E" }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 18 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 34, paddingBottom: 60 }}>
            <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: "rgba(139,92,246,0.2)", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
              <Lock size={34} color={PURPLE} />
            </View>
            <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "800", color: "#fff", marginBottom: 8 }}>{tr("Área reservada")}</Text>
            <Text suppressHighlighting style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center", marginBottom: 28, lineHeight: 20 }}>
              Introduz o teu PIN para ver os parceiros e o desempenho de cada um.
            </Text>
            <TextInput
              value={pin}
              onChangeText={setPin}
              placeholder="• • • •"
              placeholderTextColor="#4B5563"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
              style={{
                width: "100%", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 16,
                borderWidth: 1.5, borderColor: "rgba(139,92,246,0.4)", padding: 18,
                color: "#fff", fontSize: 26, fontWeight: "800", textAlign: "center", letterSpacing: 10, marginBottom: 18,
              }}
            />
            <TouchableOpacity
              onPress={login}
              disabled={loading}
              style={{ width: "100%", backgroundColor: PURPLE, borderRadius: 16, padding: 17, alignItems: "center", opacity: loading ? 0.7 : 1 }}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>{tr("Entrar")}</Text>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ---------- PAINEL ----------
  const totals = data?.totals ?? { partners: 0, codes: 0, redemptions: 0, last30Days: 0 };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{ backgroundColor: PURPLE, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 26, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#fff" }}>{tr("Parceiros")}</Text>
          <TouchableOpacity onPress={() => setNewPartner(true)} style={{ padding: 4 }}>
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Totais */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 18 }}>
          {[
            { icon: Users, label: tr("Parceiros"), value: totals.partners },
            { icon: Ticket, label: tr("Códigos"), value: totals.codes },
            { icon: TrendingUp, label: tr("Resgates"), value: totals.redemptions },
            { icon: Trophy, label: tr("30 dias"), value: totals.last30Days },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 14, padding: 10, alignItems: "center" }}>
              <s.icon size={15} color="#fff" />
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 17, marginTop: 3 }}>{s.value}</Text>
              <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.8)", fontSize: 9.5 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>

        {!data && <ActivityIndicator color={PURPLE} style={{ marginTop: 30 }} />}

        {data?.partners?.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 50 }}>
            <Users size={40} color="#D1D5DB" />
            <Text suppressHighlighting style={{ color: "#9CA3AF", marginTop: 12, textAlign: "center", fontSize: 14, lineHeight: 20 }}>
              Ainda não tens parceiros.{"\n"}Toca no + para criar o primeiro.
            </Text>
          </View>
        )}

        {data?.partners?.map((p: any, i: number) => {
          const open = expanded === p.id;
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
          return (
            <View key={p.id} style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12 }}>
              <TouchableOpacity onPress={() => setExpanded(open ? null : p.id)} activeOpacity={0.8}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      {medal && p.totalRedemptions > 0 && <Text suppressHighlighting style={{ fontSize: 15 }}>{medal}</Text>}
                      <Text suppressHighlighting style={{ fontWeight: "800", fontSize: 15.5, color: "#1A1A2E" }}>{p.name}</Text>
                    </View>
                    <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 12, marginTop: 3 }}>
                      Código dele: {p.mainCode} · {benefitLabel(p.partnerBenefit)}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end", marginRight: 8 }}>
                    <Text suppressHighlighting style={{ fontWeight: "800", fontSize: 21, color: PURPLE }}>{p.totalRedemptions}</Text>
                    <Text suppressHighlighting style={{ color: "#B0BAC9", fontSize: 10 }}>resgates</Text>
                  </View>
                  {open ? <ChevronUp size={19} color="#D1D5DB" /> : <ChevronDown size={19} color="#D1D5DB" />}
                </View>
              </TouchableOpacity>

              {open && (
                <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: "#F1F1F6", paddingTop: 14 }}>
                  <Text suppressHighlighting style={{ fontSize: 11.5, color: "#9CA3AF", marginBottom: 8, fontWeight: "700" }}>
                    ÚLTIMOS 30 DIAS: {p.last30Days} · CÓDIGOS: {p.codesCount}
                  </Text>

                  {p.codes?.map((cc: any) => (
                    <View key={cc.id} style={{ backgroundColor: "#F8F6FF", borderRadius: 13, padding: 12, marginBottom: 8 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 1 }}>
                          <Text suppressHighlighting style={{ fontWeight: "800", fontSize: 14.5, color: "#1A1A2E", letterSpacing: 1 }}>{cc.code}</Text>
                          <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 11, marginTop: 2 }}>
                            {cc.kind === "main" ? tr("Código do parceiro") : benefitLabel(cc.benefit)}
                            {cc.label ? ` · ${cc.label}` : ""}
                            {cc.maxUses != null ? ` · máx ${cc.maxUses}` : ` · ${tr("ilimitado")}`}
                          </Text>
                        </View>
                        <Text suppressHighlighting style={{ fontWeight: "800", color: PURPLE, fontSize: 15, marginRight: 10 }}>{cc.redemptions}</Text>
                        <TouchableOpacity
                          onPress={() => Share.share({ message: mensagemDoCodigo(cc.code) })}
                          style={{ padding: 6 }}>
                          <Share2 size={15} color="#9CA3AF" />
                        </TouchableOpacity>
                        {cc.kind !== "main" && (
                          <TouchableOpacity onPress={() => deleteCode(cc.id, cc.code)} style={{ padding: 6 }}>
                            <Trash2 size={15} color="#EF4444" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => { setNewCodeFor(p); setCCode(""); setCBenefit("discount"); setCLabel(""); }}
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: PURPLE + "14", borderRadius: 13, padding: 12, marginTop: 4 }}>
                    <Plus size={16} color={PURPLE} />
                    <Text suppressHighlighting style={{ color: PURPLE, fontWeight: "800", fontSize: 13 }}>{tr("Novo código para dar aos seguidores")}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => deletePartner(p.id, p.name)} style={{ alignItems: "center", paddingTop: 12 }}>
                    <Text suppressHighlighting style={{ color: "#EF4444", fontSize: 12, fontWeight: "700" }}>{tr("Apagar parceiro")}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {/* Resgates recentes */}
        {data?.recent?.length > 0 && (
          <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginTop: 6 }}>
            <Text suppressHighlighting style={{ fontWeight: "800", fontSize: 14.5, color: "#1A1A2E", marginBottom: 12 }}>{tr("Resgates recentes")}</Text>
            {data.recent.slice(0, 15).map((r: any) => (
              <View key={r.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F6F6FA" }}>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontSize: 13, color: "#1A1A2E", fontWeight: "600" }} numberOfLines={1}>{r.userEmail ?? "utilizador"}</Text>
                  <Text suppressHighlighting style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>
                    {r.code} · {benefitLabel(r.benefit)}
                  </Text>
                </View>
                <Text suppressHighlighting style={{ fontSize: 10.5, color: "#B0BAC9" }}>
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString("pt-PT") : ""}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* MODAL: novo parceiro */}
      <Modal visible={newPartner} animationType="slide" transparent onRequestClose={() => setNewPartner(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView style={{ backgroundColor: "#fff", borderTopLeftRadius: 26, borderTopRightRadius: 26, maxHeight: 620 }} contentContainerStyle={{ padding: 22, paddingBottom: 40 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <Text suppressHighlighting style={{ fontSize: 19, fontWeight: "800", color: "#1A1A2E" }}>{tr("Novo parceiro")}</Text>
                <TouchableOpacity onPress={() => setNewPartner(false)}><X size={22} color="#9CA3AF" /></TouchableOpacity>
              </View>

              <Field label={tr("Nome do parceiro")} value={pName} onChange={setPName} placeholder={tr("Ex: Influencer João")} />
              <Field label={tr("Código dele (opcional)")} value={pCode} onChange={(t: string) => setPCode(t.toUpperCase())} placeholder={tr("Ex: JOAO — deixa vazio para gerar")} upper />
              <Text suppressHighlighting style={{ fontSize: 12.5, fontWeight: "700", color: "#6B7280", marginBottom: 8, marginTop: 4 }}>{tr("O que o PARCEIRO recebe")}</Text>
              <BenefitPicker value={pBenefit} onChange={setPBenefit} />
              <Field label={tr("Notas (opcional)")} value={pNotes} onChange={setPNotes} placeholder={tr("Ex: 40k seguidores Instagram")} />

              <TouchableOpacity onPress={createPartner} style={{ backgroundColor: PURPLE, borderRadius: 15, padding: 16, alignItems: "center", marginTop: 10 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15.5 }}>{tr("Criar parceiro")}</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* MODAL: novo código */}
      <Modal visible={!!newCodeFor} animationType="slide" transparent onRequestClose={() => setNewCodeFor(null)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView style={{ backgroundColor: "#fff", borderTopLeftRadius: 26, borderTopRightRadius: 26, maxHeight: 600 }} contentContainerStyle={{ padding: 22, paddingBottom: 40 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <Text suppressHighlighting style={{ fontSize: 19, fontWeight: "800", color: "#1A1A2E" }}>{tr("Novo código")}</Text>
                <TouchableOpacity onPress={() => setNewCodeFor(null)}><X size={22} color="#9CA3AF" /></TouchableOpacity>
              </View>
              <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 18 }}>
                Para {newCodeFor?.name} distribuir aos seguidores dele.
              </Text>

              <Field label={tr("Código (opcional)")} value={cCode} onChange={(t: string) => setCCode(t.toUpperCase())} placeholder={tr("Ex: JOAO10 — vazio para gerar")} upper />
              <Text suppressHighlighting style={{ fontSize: 12.5, fontWeight: "700", color: "#6B7280", marginBottom: 8, marginTop: 4 }}>{tr("O que QUEM USA recebe")}</Text>
              <BenefitPicker value={cBenefit} onChange={setCBenefit} />
              <Field label={tr("Nota (opcional)")} value={cLabel} onChange={setCLabel} placeholder={tr("Ex: story de Agosto")} />

              <TouchableOpacity onPress={createCode} style={{ backgroundColor: PURPLE, borderRadius: 15, padding: 16, alignItems: "center", marginTop: 10 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15.5 }}>{tr("Criar código")}</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, placeholder, upper }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={{ fontSize: 12.5, fontWeight: "700", color: "#6B7280", marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#C4C9D4"
        autoCapitalize={upper ? "characters" : "sentences"}
        autoCorrect={false}
        style={{
          borderWidth: 1.5, borderColor: "#EDEBF7", borderRadius: 13, padding: 14,
          fontSize: 15, color: "#1A1A2E", backgroundColor: "#FBFAFF",
          letterSpacing: upper ? 1.5 : 0, fontWeight: upper ? "700" : "400",
        }}
      />
    </View>
  );
}

function BenefitPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View style={{ marginBottom: 14, gap: 7 }}>
      {BENEFITS.map((b) => {
        const sel = value === b.key;
        return (
          <TouchableOpacity
            key={b.key}
            onPress={() => onChange(b.key)}
            activeOpacity={0.8}
            style={{
              borderWidth: 1.5, borderRadius: 13, padding: 13,
              borderColor: sel ? PURPLE : "#EDEBF7",
              backgroundColor: sel ? PURPLE + "0F" : "#FBFAFF",
            }}>
            <Text suppressHighlighting style={{ fontWeight: "800", fontSize: 14, color: sel ? PURPLE : "#1A1A2E" }}>{b.label}</Text>
            <Text suppressHighlighting style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>{b.hint}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
