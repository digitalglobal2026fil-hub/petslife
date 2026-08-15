import { useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, ActivityIndicator,
  RefreshControl, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft, ShieldAlert, Trash2, Check, Inbox } from "lucide-react-native";
import { authFetch } from "../lib/auth-fetch";
import { API_URL, useIsAdmin, confirmDelete } from "../lib/moderation";

/**
 * Painel de denúncias — só visível à administração.
 * Mostra o conteúdo que os utilizadores denunciaram e permite apagá-lo
 * ou ignorar a denúncia.
 */

const TYPE_LABEL: Record<string, string> = {
  post: "Publicação da comunidade",
  comment: "Comentário",
  listing: "Anúncio do marketplace",
  business: "Negócio / clínica",
  lost_pet: "Animal perdido",
};

const RED = "#EF4444";
const BG = "#FFF7F5";

export default function ReportsScreen() {
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}/api/reports?status=open`);
      const json = await res.json();
      setReports(json?.reports ?? []);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const removeContent = async (r: any) => {
    const ok = await confirmDelete("o conteúdo denunciado");
    if (!ok) return;
    setBusy(r.id);
    try {
      const res = await authFetch(`${API_URL}/api/reports/${r.id}/content`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setReports((prev) => prev.filter((x) => x.id !== r.id));
    } catch {
      Alert.alert("Erro", "Não foi possível apagar. Tente outra vez.");
    } finally {
      setBusy(null);
    }
  };

  const dismiss = async (r: any) => {
    setBusy(r.id);
    try {
      const res = await authFetch(`${API_URL}/api/reports/${r.id}/dismiss`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      setReports((prev) => prev.filter((x) => x.id !== r.id));
    } catch {
      Alert.alert("Erro", "Não foi possível arquivar. Tente outra vez.");
    } finally {
      setBusy(null);
    }
  };

  if (!isAdmin) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 30 }}>
          <ShieldAlert size={48} color={RED} />
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#1A1A2E", marginTop: 14, textAlign: "center" }}>
            Área reservada
          </Text>
          <Text style={{ color: "#6B7280", marginTop: 6, textAlign: "center" }}>
            Este painel é só para a administração da PetsLife.
          </Text>
          <TouchableOpacity onPress={() => router.back()}
            style={{ marginTop: 18, backgroundColor: RED, borderRadius: 14, paddingHorizontal: 22, paddingVertical: 12 }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      <View style={{
        backgroundColor: RED, padding: 20, paddingBottom: 26,
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        flexDirection: "row", alignItems: "center", gap: 12,
      }}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>Denúncias</Text>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 2 }}>
            Conteúdo que os utilizadores assinalaram
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={RED} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 40, gap: 12 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
          }
        >
          {reports.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Inbox size={44} color="#9CA3AF" />
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>
                Sem denúncias
              </Text>
              <Text style={{ color: "#6B7280", marginTop: 4, textAlign: "center" }}>
                Está tudo tranquilo. Quando alguém denunciar conteúdo, aparece aqui.
              </Text>
            </View>
          ) : (
            reports.map((r: any) => (
              <View key={r.id} style={{
                backgroundColor: "#fff", borderRadius: 18, padding: 16,
                borderWidth: 1.5, borderColor: "#FDE0DC",
              }}>
                <View style={{
                  alignSelf: "flex-start", backgroundColor: "#FEF2F2",
                  borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
                }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: RED }}>
                    {TYPE_LABEL[String(r.targetType)] ?? String(r.targetType)}
                  </Text>
                </View>

                <Text style={{ fontWeight: "800", color: "#1A1A2E", fontSize: 15, marginTop: 8 }}>
                  {r.reason || "Sem motivo indicado"}
                </Text>

                {r.preview ? (
                  <Text style={{ color: "#6B7280", fontSize: 13, marginTop: 6, lineHeight: 19 }} numberOfLines={4}>
                    "{r.preview}"
                  </Text>
                ) : null}

                <Text style={{ color: "#9CA3AF", fontSize: 11, marginTop: 8 }}>
                  Denunciado por {r.reporterEmail || "utilizador"} · {String(r.createdAt ?? "").slice(0, 16)}
                </Text>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                  <TouchableOpacity
                    disabled={busy === r.id}
                    onPress={() => removeContent(r)}
                    style={{
                      flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
                      backgroundColor: RED, borderRadius: 12, paddingVertical: 11, opacity: busy === r.id ? 0.5 : 1,
                    }}>
                    <Trash2 size={15} color="#fff" />
                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Apagar conteúdo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={busy === r.id}
                    onPress={() => dismiss(r)}
                    style={{
                      flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
                      backgroundColor: "#F3F4F6", borderRadius: 12, paddingVertical: 11, opacity: busy === r.id ? 0.5 : 1,
                    }}>
                    <Check size={15} color="#374151" />
                    <Text style={{ color: "#374151", fontWeight: "700", fontSize: 13 }}>Está tudo bem</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
