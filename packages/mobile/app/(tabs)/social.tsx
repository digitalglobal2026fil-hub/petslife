import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Plus, Send, PawPrint } from "lucide-react-native";
import { useState } from "react";
import { api } from "../../lib/api";
import { authClient } from "../../lib/auth";
import { AnimalFact } from "../../components/AnimalFact";
import { useSubscriptionGate } from "../../lib/useSubscriptionGate";
import { PaywallScreen } from "../../components/PaywallScreen";

export default function SocialScreen() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { isLoading: gateLoading, isBlocked } = useSubscriptionGate();
  const [newPost, setNewPost] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => (await api.posts.$get()).json(),
  });

  const createPost = useMutation({
    mutationFn: async (content: string) => (await api.posts.$post({ json: { content } })).json(),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["posts"] }); setNewPost(""); setShowForm(false); },
    onError: () => Alert.alert("Erro", "Não foi possível publicar."),
  });

  const likePost = useMutation({
    mutationFn: async (id: string) => (await api.posts[":id"].like.$post({ param: { id } })).json(),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const prev = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], (old: any) => ({
        ...old,
        posts: old?.posts?.map((p: any) => p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p)
      }));
      return { prev };
    },
    onError: (_e, _id, ctx) => queryClient.setQueryData(["posts"], ctx?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const posts = (data as any)?.posts ?? [];

  if (!gateLoading && isBlocked) {
    return <PaywallScreen featureName="Comunidade" />;
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
          <Text suppressHighlighting style={{ fontSize: 26, fontWeight: "800", color: "#fff" }}>Comunidade</Text>
          <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.85)", marginTop: 2, fontSize: 13 }}>Partilhe momentos dos seus animais</Text>
        </View>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}
          style={{ backgroundColor: "rgba(255,255,255,0.25)", width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={{ marginHorizontal: 20, marginBottom: 12, backgroundColor: "#fff", borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
          <TextInput
            value={newPost}
            onChangeText={setNewPost}
            placeholder="Partilhe um momento com o seu animal... 🐾"
            multiline
            style={{ fontSize: 14, color: "#1A1A2E", minHeight: 60 }}
          />
          <TouchableOpacity onPress={() => newPost.trim() && createPost.mutate(newPost)}
            disabled={createPost.isPending || !newPost.trim()}
            style={{ backgroundColor: "#FF6B35", borderRadius: 12, padding: 10, alignItems: "center", marginTop: 10, opacity: createPost.isPending ? 0.7 : 1, flexDirection: "row", justifyContent: "center", gap: 8 }}>
            {createPost.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Send size={16} color="#fff" />}
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", backgroundColor: "transparent" }}>Publicar</Text>
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
              <Text suppressHighlighting style={{ fontSize: 16, fontWeight: "700", color: "#1A1A2E", marginTop: 12 }}>Seja o primeiro a partilhar!</Text>
              <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 4, textAlign: "center" }}>Partilhe um momento especial do seu animal</Text>
            </View>
          ) : posts.map((post: any) => (
            <View key={post.id} style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center" }}>
                  <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 14, backgroundColor: "transparent" }}>{(post.userId ?? "?")[0]?.toUpperCase()}</Text>
                </View>
                <View>
                  <Text suppressHighlighting style={{ fontWeight: "600", color: "#1A1A2E", fontSize: 13 }}>Utilizador</Text>
                  <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 11 }}>{new Date(post.createdAt).toLocaleDateString("pt-PT")}</Text>
                </View>
              </View>
              {post.imageUrl && <Image source={{ uri: post.imageUrl }} style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 10 }} resizeMode="cover" />}
              <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 14, lineHeight: 20 }}>{post.content}</Text>
              <View style={{ flexDirection: "row", gap: 16, marginTop: 12 }}>
                <TouchableOpacity onPress={() => likePost.mutate(post.id)} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Heart size={18} color="#EF476F" />
                  <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 13 }}>{post.likesCount ?? 0}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <MessageCircle size={18} color="#4ECDC4" />
                  <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 13 }}>{post.commentsCount ?? 0}</Text>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
