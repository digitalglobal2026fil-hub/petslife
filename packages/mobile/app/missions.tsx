import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert,
  TextInput, Modal, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, Trash2, MessageCircle, HeartHandshake, Camera, Send, X, MapPin } from "lucide-react-native";
import Constants from "expo-constants";
import { authFetch } from "../lib/auth-fetch";
import { pickImageWithChoice } from "../lib/pick-image";
import { uploadImage } from "../lib/upload";

const API_URL = ((Constants.expoConfig?.extra?.apiUrl as string) ?? process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4200").replace(/\/$/, "");

const BG = "#FFF9F5";
const PINK = "#EC4899";
const PINK_BG = "#FDF2F8";
const PINK_BORDER = "#FBCFE8";
const DARK = "#1A1A2E";
const GRAY = "#9CA3AF";

type Mission = {
  id: string;
  title: string;
  content?: string | null;
  imageUrl?: string | null;
  location?: string | null;
  authorName?: string | null;
  commentsCount?: number | null;
  createdAt?: number | string | null;
};

function formatDate(v: any): string {
  if (!v) return "";
  const d = new Date(typeof v === "number" ? v : v);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" });
}

export default function MissionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();

  const [composer, setComposer] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openComments, setOpenComments] = useState<Mission | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      const res = await authFetch(`${API_URL}/api/missions`, {});
      if (!res.ok) return { missions: [], canPost: false };
      return (await res.json()) as { missions: Mission[]; canPost: boolean };
    },
  });

  const missions: Mission[] = data?.missions ?? [];
  const canPost = !!data?.canPost;

  async function pickPhoto() {
    const picked = await pickImageWithChoice({ title: "Foto da missão", quality: 0.85 });
    if (!picked) return;
    setUploading(true);
    try {
      const url = await uploadImage(picked.uri, picked.mimeType);
      setImageUrl(url);
    } catch (e: any) {
      Alert.alert("Erro ao carregar foto", e?.message ?? "Tente novamente.");
    } finally {
      setUploading(false);
    }
  }

  async function publish() {
    if (!title.trim()) return Alert.alert("Falta o título", "Escreva um título para a missão.");
    setSaving(true);
    try {
      const res = await authFetch(`${API_URL}/api/missions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim() || undefined,
          location: location.trim() || undefined,
          imageUrl: imageUrl || undefined,
        }),
      });
      if (!res.ok) {
        const t = await res.json().catch(() => ({} as any));
        throw new Error(t?.message ?? "Não foi possível publicar.");
      }
      setComposer(false);
      setTitle(""); setContent(""); setLocation(""); setImageUrl(null);
      qc.invalidateQueries({ queryKey: ["missions"] });
    } catch (e: any) {
      Alert.alert("Ups", e?.message ?? "Não foi possível publicar.");
    } finally {
      setSaving(false);
    }
  }

  function removeMission(m: Mission) {
    Alert.alert("Apagar missão", `Apagar "${m.title}" e todos os comentários?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar", style: "destructive",
        onPress: async () => {
          try {
            const res = await authFetch(`${API_URL}/api/missions/${m.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Sem permissão ou sem ligação.");
            qc.invalidateQueries({ queryKey: ["missions"] });
          } catch (e: any) {
            Alert.alert("Ups", e?.message ?? "Não foi possível apagar.");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      {/* Cabeçalho */}
      <View style={{ backgroundColor: PINK_BG, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1.5, borderBottomColor: PINK_BORDER }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: PINK_BORDER, alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={20} color={PINK} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: DARK }}>Nossas Missões</Text>
            <Text suppressHighlighting style={{ fontSize: 12, color: "#9D174D", marginTop: 2 }}>
              Trabalho social da PetsLife 🐾
            </Text>
          </View>
          {canPost && (
            <TouchableOpacity onPress={() => setComposer(true)}
              style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: PINK, borderRadius: 19, height: 38, paddingHorizontal: 14 }}>
              <Plus size={16} color="#fff" />
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Publicar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator color={PINK} size="large" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
          {missions.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <HeartHandshake size={54} color={PINK} />
              <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: DARK, marginTop: 16, marginBottom: 8 }}>
                Ainda não há missões
              </Text>
              <Text suppressHighlighting style={{ color: GRAY, textAlign: "center", lineHeight: 22 }}>
                {canPost
                  ? "Carregue em «Publicar» para partilhar o primeiro trabalho social da PetsLife."
                  : "Em breve vamos partilhar aqui os trabalhos sociais que fazemos pelos animais."}
              </Text>
            </View>
          ) : (
            missions.map((m) => (
              <View key={m.id} style={{ backgroundColor: "#fff", borderRadius: 18, borderWidth: 1.5, borderColor: "#F0E8E0", overflow: "hidden" }}>
                {m.imageUrl ? (
                  <Image source={{ uri: m.imageUrl }} style={{ width: "100%", height: 210 }} resizeMode="cover" />
                ) : null}
                <View style={{ padding: 16, gap: 8 }}>
                  <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: DARK }}>{m.title}</Text>
                  {m.location ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                      <MapPin size={13} color={PINK} />
                      <Text suppressHighlighting style={{ color: PINK, fontSize: 12, fontWeight: "700" }}>{m.location}</Text>
                    </View>
                  ) : null}
                  {m.content ? (
                    <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14, lineHeight: 21 }}>{m.content}</Text>
                  ) : null}
                  <Text suppressHighlighting style={{ color: GRAY, fontSize: 11 }}>
                    {formatDate(m.createdAt)}{m.authorName ? ` · ${m.authorName}` : ""}
                  </Text>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <TouchableOpacity onPress={() => setOpenComments(m)}
                      style={{ flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: PINK_BG, borderWidth: 1.5, borderColor: PINK_BORDER, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 }}>
                      <MessageCircle size={15} color={PINK} />
                      <Text suppressHighlighting style={{ color: PINK, fontWeight: "800", fontSize: 12 }}>
                        Comentários{m.commentsCount ? ` (${m.commentsCount})` : ""}
                      </Text>
                    </TouchableOpacity>
                    {canPost && (
                      <TouchableOpacity onPress={() => removeMission(m)}
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

      {/* Publicar (só administração) */}
      <Modal visible={composer} animationType="slide" onRequestClose={() => setComposer(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 20 }}>
              <TouchableOpacity onPress={() => setComposer(false)}
                style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}>
                <X size={19} color={DARK} />
              </TouchableOpacity>
              <Text suppressHighlighting style={{ fontSize: 19, fontWeight: "800", color: DARK }}>Nova missão</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 14 }}>
              <TouchableOpacity onPress={pickPhoto} disabled={uploading}
                style={{ height: 170, borderRadius: 16, backgroundColor: PINK_BG, borderWidth: 2, borderColor: PINK_BORDER, borderStyle: "dashed", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {uploading ? (
                  <ActivityIndicator color={PINK} />
                ) : imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                ) : (
                  <>
                    <Camera size={30} color={PINK} />
                    <Text suppressHighlighting style={{ color: PINK, fontWeight: "800", marginTop: 8 }}>Adicionar foto</Text>
                  </>
                )}
              </TouchableOpacity>

              <TextInput value={title} onChangeText={setTitle} placeholder="Título da missão"
                placeholderTextColor={GRAY}
                style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1.5, borderColor: "#F0E8E0", padding: 14, fontSize: 15, color: DARK }} />

              <TextInput value={location} onChangeText={setLocation} placeholder="Local (opcional)"
                placeholderTextColor={GRAY}
                style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1.5, borderColor: "#F0E8E0", padding: 14, fontSize: 15, color: DARK }} />

              <TextInput value={content} onChangeText={setContent} placeholder="Conte a história desta missão..."
                placeholderTextColor={GRAY} multiline
                style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1.5, borderColor: "#F0E8E0", padding: 14, fontSize: 15, color: DARK, minHeight: 130, textAlignVertical: "top" }} />

              <TouchableOpacity onPress={publish} disabled={saving || uploading}
                style={{ backgroundColor: PINK, borderRadius: 14, padding: 16, alignItems: "center", opacity: saving || uploading ? 0.6 : 1 }}>
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
                  {saving ? "A publicar..." : "Publicar missão"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Comentários */}
      <CommentsModal mission={openComments} onClose={() => { setOpenComments(null); qc.invalidateQueries({ queryKey: ["missions"] }); }} canModerate={canPost} />
    </SafeAreaView>
  );
}

function CommentsModal({ mission, onClose, canModerate }: { mission: Mission | null; onClose: () => void; canModerate: boolean }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const qc = useQueryClient();
  const missionId = mission?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["mission-comments", missionId],
    queryFn: async () => {
      const res = await authFetch(`${API_URL}/api/missions/${missionId}/comments`, {});
      if (!res.ok) return { comments: [] };
      return (await res.json()) as any;
    },
    enabled: !!missionId,
  });

  const comments: any[] = data?.comments ?? [];

  async function send() {
    const content = text.trim();
    if (!content || !missionId) return;
    setSending(true);
    try {
      const res = await authFetch(`${API_URL}/api/missions/${missionId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Não foi possível comentar.");
      setText("");
      qc.invalidateQueries({ queryKey: ["mission-comments", missionId] });
    } catch (e: any) {
      Alert.alert("Ups", e?.message ?? "Não foi possível comentar.");
    } finally {
      setSending(false);
    }
  }

  function removeComment(c: any) {
    Alert.alert("Apagar comentário", "Tem a certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar", style: "destructive",
        onPress: async () => {
          try {
            const res = await authFetch(`${API_URL}/api/missions/${missionId}/comments/${c.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Sem permissão.");
            qc.invalidateQueries({ queryKey: ["mission-comments", missionId] });
          } catch (e: any) {
            Alert.alert("Ups", e?.message ?? "Não foi possível apagar.");
          }
        },
      },
    ]);
  }

  return (
    <Modal visible={!!mission} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 20 }}>
            <TouchableOpacity onPress={onClose}
              style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}>
              <X size={19} color={DARK} />
            </TouchableOpacity>
            <Text suppressHighlighting numberOfLines={1} style={{ fontSize: 17, fontWeight: "800", color: DARK, flex: 1 }}>
              {mission?.title ?? "Comentários"}
            </Text>
          </View>

          {isLoading ? (
            <ActivityIndicator color={PINK} style={{ marginTop: 30 }} />
          ) : (
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 10 }}>
              {comments.length === 0 ? (
                <Text suppressHighlighting style={{ color: GRAY, textAlign: "center", marginTop: 30 }}>
                  Ainda não há comentários. Seja a primeira pessoa a comentar 🐾
                </Text>
              ) : comments.map((c) => (
                <View key={c.id} style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1.5, borderColor: "#F0E8E0", padding: 14 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text suppressHighlighting style={{ fontWeight: "800", color: DARK, fontSize: 13 }}>{c.userName ?? "Utilizador"}</Text>
                    <TouchableOpacity onPress={() => removeComment(c)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Trash2 size={14} color={canModerate ? "#EF4444" : GRAY} />
                    </TouchableOpacity>
                  </View>
                  <Text suppressHighlighting style={{ color: "#4B5563", fontSize: 14, lineHeight: 20, marginTop: 4 }}>{c.content}</Text>
                  <Text suppressHighlighting style={{ color: GRAY, fontSize: 11, marginTop: 5 }}>{formatDate(c.createdAt)}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 16, borderTopWidth: 1.5, borderTopColor: "#F0E8E0", backgroundColor: "#fff" }}>
            <TextInput value={text} onChangeText={setText} placeholder="Escreva um comentário..."
              placeholderTextColor={GRAY}
              style={{ flex: 1, backgroundColor: BG, borderRadius: 14, borderWidth: 1.5, borderColor: "#F0E8E0", paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: DARK }} />
            <TouchableOpacity onPress={send} disabled={sending || !text.trim()}
              style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: PINK, alignItems: "center", justifyContent: "center", opacity: sending || !text.trim() ? 0.5 : 1 }}>
              <Send size={19} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
