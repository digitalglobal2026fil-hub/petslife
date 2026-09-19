import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Plus, Send, PawPrint, X, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import { api } from "../../lib/api";
import { authClient } from "../../lib/auth";
import { AnimalFact } from "../../components/AnimalFact";
import { useSubscriptionGate } from "../../lib/useSubscriptionGate";
import { PaywallScreen } from "../../components/PaywallScreen";
import { netError } from "../../lib/net-error";
import { ModerationButton } from "../../components/ModerationButton";
import { deleteContent } from "../../lib/moderation";
import { tr } from "../../lib/i18n";

// ─── Janela de comentários ────────────────────────────────────────────────
function CommentsModal({ postId, myId, onClose }: { postId: string | null; myId?: string; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const visible = !!postId;

  const { data, isLoading } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => (await api.posts[":id"].comments.$get({ param: { id: postId! } })).json(),
    enabled: visible,
  });
  const comments = (data as any)?.comments ?? [];

  const sendComment = useMutation({
    mutationFn: async () => (await (api.posts[":id"].comments.$post as any)({ param: { id: postId! }, json: { content: text } })).json(),
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: any) => Alert.alert("Ups", netError(e, tr("Não foi possível enviar o comentário."))),
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => (await (api.posts[":postId"] as any).comments[":commentId"].$delete({ param: { postId: postId!, commentId } })).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: any) => Alert.alert("Ups", netError(e, tr("Não foi possível apagar o comentário."))),
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ maxHeight: "80%" }}>
          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 18, height: 480 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 14 }}>
              <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: "#1A1A2E" }}>{tr("Comentários")}</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10, gap: 12 }}>
              {isLoading ? (
                <ActivityIndicator color="#4ECDC4" style={{ marginTop: 20 }} />
              ) : comments.length === 0 ? (
                <View style={{ alignItems: "center", paddingVertical: 30 }}>
                  <Text suppressHighlighting style={{ fontSize: 34, marginBottom: 6 }}>💬</Text>
                  <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 13 }}>{tr("Seja o primeiro a comentar!")}</Text>
                </View>
              ) : comments.map((cm: any) => (
                <View key={cm.id} style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
                  <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: "#4ECDC4", alignItems: "center", justifyContent: "center" }}>
                    <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>{(cm.userId ?? "?")[0]?.toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: "#F8F6FF", borderRadius: 14, padding: 10 }}>
                    <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 13, lineHeight: 18 }}>{cm.content}</Text>
                    <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 10, marginTop: 4 }}>{cm.createdAt ? new Date(cm.createdAt).toLocaleDateString("pt-PT") : ""}</Text>
                  </View>
                  {!!myId && cm.userId === myId && (
                    <TouchableOpacity onPress={() => deleteComment.mutate(cm.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ padding: 4 }}>
                      <Trash2 size={15} color="#D1D5DB" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingTop: 10, paddingBottom: Math.max(insets.bottom, 16), borderTopWidth: 1, borderTopColor: "#F0E8E0" }}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder={tr("Escreva um comentário...")}
                placeholderTextColor="#9CA3AF"
                multiline
                style={{ flex: 1, backgroundColor: "#F8F6FF", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: "#1A1A2E", maxHeight: 90 }}
              />
              <TouchableOpacity
                onPress={() => text.trim() && sendComment.mutate()}
                disabled={sendComment.isPending || !text.trim()}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#4ECDC4", alignItems: "center", justifyContent: "center", opacity: (sendComment.isPending || !text.trim()) ? 0.5 : 1 }}>
                {sendComment.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Send size={16} color="#fff" />}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default function SocialScreen() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const myId = (session as any)?.user?.id;
  const { isLoading: gateLoading, isBlocked } = useSubscriptionGate();
  const [newPost, setNewPost] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => (await api.posts.$get()).json(),
  });

  const createPost = useMutation({
    mutationFn: async (content: string) => (await api.posts.$post({ json: { content } })).json(),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["posts"] }); setNewPost(""); setShowForm(false); },
    onError: (e: any) => Alert.alert("Ups", netError(e, "Não foi possível publicar.")),
  });

  // "Gosto": alterna entre marcado/desmarcado. Antes o coração tinha sempre
  // a mesma cor e não dizia se já estava marcado — quem tocasse uma segunda
  // vez sem querer estava a RETIRAR o gosto, e via a contagem descer para 0
  // sem entender porquê. Agora usa-se `likedByMe` (vindo do servidor) para
  // pintar o coração a vermelho quando já gostou, e o botão bloqueia-se
  // enquanto o pedido anterior ainda está a decorrer para evitar toques
  // duplos acidentais.
  const likePost = useMutation({
    mutationFn: async (id: string) => (await api.posts[":id"].like.$post({ param: { id } })).json(),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const prev = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], (old: any) => ({
        ...old,
        posts: old?.posts?.map((p: any) => p.id === id
          ? { ...p, likedByMe: !p.likedByMe, likesCount: Math.max(0, (p.likesCount ?? 0) + (p.likedByMe ? -1 : 1)) }
          : p)
      }));
      return { prev };
    },
    onError: (_e, _id, ctx) => queryClient.setQueryData(["posts"], ctx?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const posts = (data as any)?.posts ?? [];

  if (!gateLoading && isBlocked) {
    return <PaywallScreen featureName={tr("Comunidade")} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6FF" }} edges={["top", "left", "right"]}>
      <View style={{
        backgroundColor: "#8B7FD6", padding: 20, paddingTop: 18, paddingBottom: 28,
        borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 16,
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      }}>
        <View style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.1)" }} />
        <View>
          <Text suppressHighlighting style={{ fontSize: 26, fontWeight: "800", color: "#fff" }}>{tr("Comunidade")}</Text>
          <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.85)", marginTop: 2, fontSize: 13 }}>{tr("Partilhe momentos dos seus animais")}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => router.push("/chats" as any)}
            style={{ backgroundColor: "rgba(255,255,255,0.25)", width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
            <MessageCircle size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowForm(!showForm)}
            style={{ backgroundColor: "rgba(255,255,255,0.25)", width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {showForm && (
        <View style={{ marginHorizontal: 20, marginBottom: 12, backgroundColor: "#fff", borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
          <TextInput
            value={newPost}
            onChangeText={setNewPost}
            placeholder={tr("Partilhe um momento com o seu animal... 🐾")}
            multiline
            style={{ fontSize: 14, color: "#1A1A2E", minHeight: 60 }}
          />
          <TouchableOpacity onPress={() => newPost.trim() && createPost.mutate(newPost)}
            disabled={createPost.isPending || !newPost.trim()}
            style={{ backgroundColor: "#FF6B35", borderRadius: 12, padding: 10, alignItems: "center", marginTop: 10, opacity: createPost.isPending ? 0.7 : 1, flexDirection: "row", justifyContent: "center", gap: 8 }}>
            {createPost.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Send size={16} color="#fff" />}
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", backgroundColor: "transparent" }}>{tr("Publicar")}</Text>
          </TouchableOpacity>
        </View>
      )}

      <AnimalFact />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 12 }}>
        {isLoading ? <ActivityIndicator color="#FF6B35" style={{ marginTop: 40 }} /> :
          posts.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <View style={{ backgroundColor: "#F5EDE4", borderRadius: 28, padding: 14, alignSelf: "center" }}>
                <PawPrint size={44} color="#8B5E3C" />
              </View>
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>{tr("Seja o primeiro a partilhar!")}</Text>
              <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 4, textAlign: "center" }}>{tr("Partilhe um momento especial do seu animal")}</Text>
            </View>
          ) : posts.map((post: any) => (
            <View key={post.id} style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center" }}>
                  <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 14, backgroundColor: "transparent" }}>{(post.userId ?? "?")[0]?.toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text suppressHighlighting style={{ fontWeight: "600", color: "#1A1A2E", fontSize: 13 }}>{tr("Utilizador")}</Text>
                  <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 11 }}>{new Date(post.createdAt).toLocaleDateString("pt-PT")}</Text>
                </View>
                <ModerationButton
                  target="post"
                  targetId={String(post.id)}
                  preview={String(post.content ?? "").slice(0, 120)}
                  isOwner={!!myId && post.userId === myId}
                  label={tr("esta publicação")}
                  onDelete={async () => {
                    const ok = await deleteContent("post", String(post.id));
                    if (ok) queryClient.invalidateQueries({ queryKey: ["posts"] });
                  }}
                />
              </View>
              {post.imageUrl && <Image source={{ uri: post.imageUrl }} style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 10 }} resizeMode="cover" />}
              <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 14, lineHeight: 20 }}>{post.content}</Text>
              <View style={{ flexDirection: "row", gap: 16, marginTop: 12 }}>
                <TouchableOpacity
                  onPress={() => !likePost.isPending && likePost.mutate(post.id)}
                  disabled={likePost.isPending}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Heart size={18} color="#EF476F" fill={post.likedByMe ? "#EF476F" : "transparent"} />
                  <Text suppressHighlighting style={{ color: post.likedByMe ? "#EF476F" : "#6B7280", fontSize: 13, fontWeight: post.likedByMe ? "700" : "400" }}>{post.likesCount ?? 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCommentsPostId(post.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <MessageCircle size={18} color="#4ECDC4" />
                  <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 13 }}>{post.commentsCount ?? 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>

      <CommentsModal postId={commentsPostId} myId={myId} onClose={() => setCommentsPostId(null)} />
    </SafeAreaView>
  );
}
