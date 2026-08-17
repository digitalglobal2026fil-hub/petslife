import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, Platform, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { ChevronLeft, MessageCircle, Users } from "lucide-react-native";
import { authClient } from "../lib/auth";
import { netError } from "../lib/net-error";
import { authFetch } from "../lib/auth-fetch";
import { tr } from "../lib/i18n";

const TOKEN_KEY = "bearer_token";
function getToken(): string {
  if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null) ?? "";
  try { const SecureStore = require("expo-secure-store"); return SecureStore.getItem(TOKEN_KEY) ?? ""; } catch { return ""; }
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://petslife.onrender.com";

export default function ChatsListScreen() {
  const { data: sessionData } = authClient.useSession();
  const userId = sessionData?.user?.id || "";

  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setError(null);
      const res = await authFetch(`${API_URL}/api/chats?userId=${encodeURIComponent(userId)}`, {
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      setChats(data.chats || []);
    } catch (e: any) {
      setError(netError(e, "Não foi possível carregar as conversas."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  function timeLabel(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6FF" }} edges={["top", "left", "right"]}>
      <View style={{
        backgroundColor: "#8B7FD6", padding: 20, paddingTop: 16, paddingBottom: 24,
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        flexDirection: "row", alignItems: "center", gap: 12,
      }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>{tr("Mensagens")}</Text>
          <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 2 }}>{tr("As tuas conversas com outros donos")}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#8B7FD6" size="large" style={{ marginTop: 50 }} />
      ) : error ? (
        <View style={{ alignItems: "center", padding: 30 }}>
          <Text suppressHighlighting style={{ color: "#6B7280", textAlign: "center" }}>{error}</Text>
          <TouchableOpacity onPress={() => { setLoading(true); load(); }} style={{ marginTop: 14, backgroundColor: "#8B7FD6", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700" }}>{tr("Tentar outra vez")}</Text>
          </TouchableOpacity>
        </View>
      ) : chats.length === 0 ? (
        <View style={{ alignItems: "center", paddingTop: 60, paddingHorizontal: 30 }}>
          <View style={{ backgroundColor: "#EFEBFF", borderRadius: 32, padding: 18 }}>
            <MessageCircle size={44} color="#8B7FD6" />
          </View>
          <Text suppressHighlighting style={{ fontSize: 17, fontWeight: "800", color: "#1A1A2E", marginTop: 14 }}>{tr("Ainda não tens conversas")}</Text>
          <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 6, textAlign: "center", lineHeight: 20 }}>
            Fala com outros donos a partir da Comunidade, do Marketplace ou dos anúncios de animais perdidos.
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/social")}
            style={{ marginTop: 18, backgroundColor: "#8B7FD6", borderRadius: 14, paddingHorizontal: 22, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Users size={16} color="#fff" />
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700" }}>{tr("Ir para a Comunidade")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#8B7FD6" />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({
                pathname: "/chat",
                params: { chatId: item.id, otherUserName: item.otherUserName, otherUserId: item.otherUserId },
              } as any)}
              style={{ backgroundColor: "#fff", borderRadius: 18, padding: 14, borderWidth: 1.5, borderColor: "#EFEBFF", flexDirection: "row", alignItems: "center", gap: 12 }}>
              {item.otherUserImage ? (
                <Image source={{ uri: item.otherUserImage }} style={{ width: 46, height: 46, borderRadius: 23 }} />
              ) : (
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: "#8B7FD6", alignItems: "center", justifyContent: "center" }}>
                  <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 17, backgroundColor: "transparent" }}>
                    {(item.otherUserName ?? "?")[0]?.toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text suppressHighlighting numberOfLines={1} style={{ fontSize: 15, fontWeight: "700", color: "#1A1A2E" }}>{item.otherUserName}</Text>
                <Text suppressHighlighting numberOfLines={1} style={{ color: "#6B7280", fontSize: 13, marginTop: 2 }}>
                  {item.lastMessage || "Diz olá 👋"}
                </Text>
              </View>
              <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 11 }}>{timeLabel(item.lastMessageAt || item.createdAt)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
