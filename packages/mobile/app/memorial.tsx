import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert,
  TextInput, Modal, KeyboardAvoidingView, Platform, Linking,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft, Plus, Trash2, MessageCircle, Camera, Send, X, Flame, Play, Heart,
} from "lucide-react-native";
import Constants from "expo-constants";
import { authFetch } from "../lib/auth-fetch";
import { pickImageWithChoice } from "../lib/pick-image";
import { uploadImage } from "../lib/upload";
import DateFieldPT from "../components/DateFieldPT";
import { tr } from "../lib/i18n";

const API_URL = ((Constants.expoConfig?.extra?.apiUrl as string) ?? process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4200").replace(/\/$/, "");

const BG = "#F6F4FF";
const ROXO = "#8B5CF6";
const ROXO_BG = "#F3EEFF";
const ROXO_BORDA = "#DDD3FB";
const DARK = "#1A1A2E";
const GRAY = "#9CA3AF";

type Memorial = {
  id: string;
  petName: string;
  species?: string | null;
  photoUrl?: string | null;
  photos?: string[] | null;
  videoUrl?: string | null;
  message?: string | null;
  birthDate?: string | null;
  deathDate?: string | null;
  candles?: number | null;
  commentsCount?: number | null;
  userName?: string | null;
  minhaVela?: boolean;
  souAutor?: boolean;
  createdAt?: number | string | null;
};

const ESPECIES = [
  { key: "dog", label: tr("Cão") },
  { key: "cat", label: tr("Gato") },
  { key: "bird", label: tr("Ave") },
  { key: "rabbit", label: tr("Coelho") },
  { key: "other", label: tr("Outro") },
];

function anos(m: Memorial): string {
  const a = m.birthDate?.slice(0, 4);
  const b = m.deathDate?.slice(0, 4);
  if (a && b) return `${a} — ${b}`;
  if (b) return `† ${b}`;
  return "";
}

export default function MemorialScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();

  const [form, setForm] = useState(false);
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [message, setMessage] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [comentarios, setComentarios] = useState<Memorial | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["memorials"],
    queryFn: async () => {
      const res = await authFetch(`${API_URL}/api/memorials`, {});
      if (!res.ok) return { memorials: [] };
      return (await res.json()) as { memorials: Memorial[] };
    },
  });

  const lista: Memorial[] = data?.memorials ?? [];

  async function juntarFoto() {
    if (photos.length >= 4) {
      Alert.alert(tr("Lembranças"), tr("Pode juntar até 4 fotos."));
      return;
    }
    const picked = await pickImageWithChoice({ title: tr("Foto da lembrança"), quality: 0.85 });
    if (!picked) return;
    setUploading(true);
    try {
      const url = await uploadImage(picked.uri, picked.mimeType);
      setPhotos((v) => [...v, url]);
    } catch (e: any) {
      Alert.alert(tr("Erro ao carregar foto"), e?.message ?? tr("Tente novamente."));
    } finally {
      setUploading(false);
    }
  }

  function limpar() {
    setPetName(""); setSpecies("dog"); setMessage("");
    setBirthDate(""); setDeathDate(""); setVideoUrl(""); setPhotos([]);
  }

  async function publicar() {
    if (!petName.trim()) {
      Alert.alert(tr("Lembranças"), tr("Escreva o nome do seu animal."));
      return;
    }
    setSaving(true);
    try {
      const res = await authFetch(`${API_URL}/api/memorials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petName: petName.trim(),
          species,
          message: message.trim() || null,
          birthDate: birthDate || null,
          deathDate: deathDate || null,
          videoUrl: videoUrl.trim() || null,
          photos,
        }),
      });
      if (!res.ok) throw new Error(tr("Não foi possível publicar."));
      limpar();
      setForm(false);
      qc.invalidateQueries({ queryKey: ["memorials"] });
    } catch (e: any) {
      Alert.alert(tr("Erro"), e?.message ?? tr("Tente novamente."));
    } finally {
      setSaving(false);
    }
  }

  async function vela(m: Memorial) {
    // Actualiza já no ecrã, confirma a seguir.
    qc.setQueryData(["memorials"], (velho: any) => {
      if (!velho?.memorials) return velho;
      return {
        ...velho,
        memorials: velho.memorials.map((x: Memorial) =>
          x.id === m.id
            ? { ...x, minhaVela: !x.minhaVela, candles: (x.candles ?? 0) + (x.minhaVela ? -1 : 1) }
            : x
        ),
      };
    });
    try {
      await authFetch(`${API_URL}/api/memorials/${m.id}/candle`, { method: "POST" });
    } catch {
      /* o refrescar seguinte repõe a verdade */
    }
    qc.invalidateQueries({ queryKey: ["memorials"] });
  }

  function apagar(m: Memorial) {
    Alert.alert(
      tr("Apagar lembrança"),
      tr("Tem a certeza? Não dá para voltar atrás."),
      [
        { text: tr("Cancelar"), style: "cancel" },
        {
          text: tr("Apagar"), style: "destructive",
          onPress: async () => {
            await authFetch(`${API_URL}/api/memorials/${m.id}`, { method: "DELETE" });
            qc.invalidateQueries({ queryKey: ["memorials"] });
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      {/* Cabeçalho */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: ROXO_BORDA, alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={19} color={DARK} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontSize: 19, fontWeight: "800", color: DARK }}>{tr("Lembranças")}</Text>
          <Text suppressHighlighting style={{ fontSize: 12, color: GRAY, marginTop: 1 }}>
            {tr("Para os que já partiram, mas nunca nos deixam")}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setForm(true)}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: ROXO, alignItems: "center", justifyContent: "center" }}>
          <Plus size={19} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator color={ROXO} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 16, paddingBottom: insets.bottom + 30 }}>
          {lista.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Flame size={52} color={ROXO} />
              <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: DARK, marginTop: 16, marginBottom: 8 }}>
                {tr("Ainda não há lembranças")}
              </Text>
              <Text suppressHighlighting style={{ color: GRAY, textAlign: "center", lineHeight: 22, paddingHorizontal: 20 }}>
                {tr("Este é um cantinho para recordar os animais que já partiram. Junte as fotos, um vídeo e umas palavras de despedida.")}
              </Text>
              <TouchableOpacity onPress={() => setForm(true)}
                style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: ROXO, borderRadius: 16, paddingHorizontal: 22, paddingVertical: 13, marginTop: 22 }}>
                <Plus size={17} color="#fff" />
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 14.5 }}>{tr("Criar lembrança")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            lista.map((m) => (
              <View key={m.id} style={{ backgroundColor: "#fff", borderRadius: 20, borderWidth: 1.5, borderColor: ROXO_BORDA, overflow: "hidden" }}>
                {m.photoUrl ? (
                  <Image source={{ uri: m.photoUrl }} style={{ width: "100%", height: 220 }} resizeMode="cover" />
                ) : null}

                <View style={{ padding: 16, gap: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Heart size={16} color={ROXO} />
                    <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: DARK }}>{m.petName}</Text>
                  </View>

                  {anos(m) ? (
                    <Text suppressHighlighting style={{ color: ROXO, fontSize: 13, fontWeight: "700" }}>{anos(m)}</Text>
                  ) : null}

                  {m.message ? (
                    <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14.5, lineHeight: 22, fontStyle: "italic" }}>
                      "{m.message}"
                    </Text>
                  ) : null}

                  {/* Fotos extra */}
                  {m.photos && m.photos.length > 1 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                      {m.photos.slice(1).map((f, i) => (
                        <Image key={i} source={{ uri: f }} style={{ width: 92, height: 92, borderRadius: 12 }} resizeMode="cover" />
                      ))}
                    </ScrollView>
                  ) : null}

                  {/* Vídeo (link) */}
                  {m.videoUrl ? (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(m.videoUrl!).catch(() => Alert.alert(tr("Erro"), tr("Não foi possível abrir o vídeo.")))}
                      style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: ROXO_BG, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, marginTop: 2 }}>
                      <Play size={15} color={ROXO} />
                      <Text suppressHighlighting style={{ color: ROXO, fontWeight: "800", fontSize: 13 }}>{tr("Ver vídeo")}</Text>
                    </TouchableOpacity>
                  ) : null}

                  <Text suppressHighlighting style={{ color: GRAY, fontSize: 11, marginTop: 2 }}>
                    {m.userName ? `${tr("Publicado por")} ${m.userName}` : ""}
                  </Text>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                    <TouchableOpacity onPress={() => vela(m)} activeOpacity={0.75}
                      style={{
                        flexDirection: "row", alignItems: "center", gap: 7,
                        backgroundColor: m.minhaVela ? "#FEF3C7" : "#FAFAFA",
                        borderWidth: 1.5, borderColor: m.minhaVela ? "#F59E0B" : "#EFEAF8",
                        borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9,
                      }}>
                      <Flame size={15} color={m.minhaVela ? "#F59E0B" : GRAY} />
                      <Text suppressHighlighting style={{ color: m.minhaVela ? "#B45309" : GRAY, fontWeight: "800", fontSize: 12 }}>
                        {tr("Acender vela")}{m.candles ? ` (${m.candles})` : ""}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setComentarios(m)}
                      style={{ flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: ROXO_BG, borderWidth: 1.5, borderColor: ROXO_BORDA, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 }}>
                      <MessageCircle size={15} color={ROXO} />
                      <Text suppressHighlighting style={{ color: ROXO, fontWeight: "800", fontSize: 12 }}>
                        {tr("Mensagens")}{m.commentsCount ? ` (${m.commentsCount})` : ""}
                      </Text>
                    </TouchableOpacity>

                    {m.souAutor && (
                      <TouchableOpacity onPress={() => apagar(m)}
                        style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "#FEF2F2", borderWidth: 1.5, borderColor: "#FECACA", alignItems: "center", justifyContent: "center" }}>
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Criar lembrança */}
      <Modal visible={form} animationType="slide" onRequestClose={() => setForm(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 20 }}>
              <TouchableOpacity onPress={() => setForm(false)}
                style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: ROXO_BORDA, alignItems: "center", justifyContent: "center" }}>
                <X size={19} color={DARK} />
              </TouchableOpacity>
              <Text suppressHighlighting style={{ fontSize: 19, fontWeight: "800", color: DARK }}>{tr("Nova lembrança")}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 14, paddingBottom: 40 }}>
              {/* Fotos */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {photos.map((f, i) => (
                  <View key={i}>
                    <Image source={{ uri: f }} style={{ width: 90, height: 90, borderRadius: 14 }} resizeMode="cover" />
                    <TouchableOpacity onPress={() => setPhotos((v) => v.filter((_, k) => k !== i))}
                      style={{ position: "absolute", top: -6, right: -6, width: 24, height: 24, borderRadius: 12, backgroundColor: "#EF4444", alignItems: "center", justifyContent: "center" }}>
                      <X size={13} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                {photos.length < 4 && (
                  <TouchableOpacity onPress={juntarFoto} disabled={uploading}
                    style={{ width: 90, height: 90, borderRadius: 14, backgroundColor: ROXO_BG, borderWidth: 2, borderColor: ROXO_BORDA, borderStyle: "dashed", alignItems: "center", justifyContent: "center" }}>
                    {uploading ? <ActivityIndicator color={ROXO} /> : <Camera size={24} color={ROXO} />}
                  </TouchableOpacity>
                )}
              </View>
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 11.5, marginTop: -6 }}>
                {tr("Até 4 fotos. A primeira fica como foto principal.")}
              </Text>

              <TextInput value={petName} onChangeText={setPetName} placeholder={tr("Nome do seu animal")}
                placeholderTextColor={GRAY}
                style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1.5, borderColor: ROXO_BORDA, padding: 14, fontSize: 15, color: DARK }} />

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
                {ESPECIES.map((e) => {
                  const sel = species === e.key;
                  return (
                    <TouchableOpacity key={e.key} onPress={() => setSpecies(e.key)}
                      style={{
                        borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9,
                        borderColor: sel ? ROXO : ROXO_BORDA, backgroundColor: sel ? ROXO_BG : "#fff",
                      }}>
                      <Text suppressHighlighting style={{ fontWeight: "700", fontSize: 13, color: sel ? ROXO : "#6B7280" }}>{e.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <DateFieldPT label={tr("Nasceu em (opcional)")} value={birthDate} onChange={setBirthDate} showToday={false} color={ROXO} />
              <DateFieldPT label={tr("Partiu em (opcional)")} value={deathDate} onChange={setDeathDate} color={ROXO} />

              <TextInput value={message} onChangeText={setMessage} placeholder={tr("Umas palavras de despedida...")}
                placeholderTextColor={GRAY} multiline
                style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1.5, borderColor: ROXO_BORDA, padding: 14, fontSize: 15, color: DARK, minHeight: 120, textAlignVertical: "top" }} />

              <TextInput value={videoUrl} onChangeText={setVideoUrl} placeholder={tr("Link de um vídeo (opcional)")}
                placeholderTextColor={GRAY} autoCapitalize="none" keyboardType="url"
                style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1.5, borderColor: ROXO_BORDA, padding: 14, fontSize: 15, color: DARK }} />
              <Text suppressHighlighting style={{ color: GRAY, fontSize: 11.5, marginTop: -8, lineHeight: 17 }}>
                {tr("Para vídeos, cole aqui o link do YouTube ou do Google Fotos. Vídeos guardados na app ficariam demasiado pesados.")}
              </Text>

              <TouchableOpacity onPress={publicar} disabled={saving || uploading}
                style={{ backgroundColor: ROXO, borderRadius: 14, padding: 16, alignItems: "center", opacity: saving || uploading ? 0.6 : 1 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
                  {saving ? tr("A publicar...") : tr("Publicar lembrança")}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      <MensagensModal
        memorial={comentarios}
        onClose={() => { setComentarios(null); qc.invalidateQueries({ queryKey: ["memorials"] }); }}
      />
    </SafeAreaView>
  );
}

function MensagensModal({ memorial, onClose }: { memorial: Memorial | null; onClose: () => void }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const insets = useSafeAreaInsets();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["memorial-comments", memorial?.id],
    enabled: !!memorial,
    queryFn: async () => {
      const res = await authFetch(`${API_URL}/api/memorials/${memorial!.id}/comments`, {});
      if (!res.ok) return { comments: [] };
      return (await res.json()) as { comments: any[] };
    },
  });

  async function enviar() {
    if (!texto.trim() || !memorial) return;
    setEnviando(true);
    try {
      const res = await authFetch(`${API_URL}/api/memorials/${memorial.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: texto.trim() }),
      });
      if (!res.ok) throw new Error(tr("Não foi possível enviar."));
      setTexto("");
      refetch();
    } catch (e: any) {
      Alert.alert(tr("Erro"), e?.message ?? tr("Tente novamente."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal visible={!!memorial} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 20 }}>
            <TouchableOpacity onPress={onClose}
              style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: ROXO_BORDA, alignItems: "center", justifyContent: "center" }}>
              <X size={19} color={DARK} />
            </TouchableOpacity>
            <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: DARK }}>
              {memorial?.petName ?? ""}
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 12 }}>
            {isLoading ? (
              <ActivityIndicator color={ROXO} />
            ) : (data?.comments ?? []).length === 0 ? (
              <Text suppressHighlighting style={{ color: GRAY, textAlign: "center", marginTop: 30, lineHeight: 21 }}>
                {tr("Ainda não há mensagens. Deixe umas palavras de carinho.")}
              </Text>
            ) : (
              (data?.comments ?? []).map((c: any) => (
                <View key={c.id} style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1.5, borderColor: ROXO_BORDA, padding: 14 }}>
                  <Text suppressHighlighting style={{ fontWeight: "800", fontSize: 13, color: ROXO, marginBottom: 4 }}>
                    {c.userName ?? tr("Utilizador")}
                  </Text>
                  <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14, lineHeight: 20 }}>{c.content}</Text>
                </View>
              ))
            )}
          </ScrollView>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 16, paddingBottom: insets.bottom + 16, backgroundColor: "#fff", borderTopWidth: 1.5, borderTopColor: ROXO_BORDA }}>
            <TextInput value={texto} onChangeText={setTexto} placeholder={tr("Escreva uma mensagem...")}
              placeholderTextColor={GRAY}
              style={{ flex: 1, backgroundColor: BG, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14.5, color: DARK }} />
            <TouchableOpacity onPress={enviar} disabled={enviando || !texto.trim()}
              style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: ROXO, alignItems: "center", justifyContent: "center", opacity: enviando || !texto.trim() ? 0.5 : 1 }}>
              <Send size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
