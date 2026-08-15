import { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authFetch } from "../lib/auth-fetch";

const API_URL = (
  (Constants.expoConfig?.extra?.apiUrl as string) ??
  process.env.EXPO_PUBLIC_API_URL ??
  "http://localhost:4200"
).replace(/\/$/, "");

const READ_KEY = "dg_read_scan_ids";

/**
 * Sino das notificações. Quando há avisos por ler (por exemplo, alguém
 * digitalizou o QR de um animal perdido) o sino abana e mostra um ponto
 * vermelho com a quantidade.
 */
export function NotificationBell({ onPress }: { onPress: () => void }) {
  const swing = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const { data } = useQuery({
    queryKey: ["scan-alerts-badge"],
    refetchInterval: 45_000,
    queryFn: async () => {
      const res = await authFetch(`${API_URL}/api/pet-scans/mine`, {});
      if (!res.ok) return { unread: 0 };
      const json = await res.json();
      const scans: any[] = json?.scans ?? json?.petScans ?? [];
      let read: string[] = [];
      try {
        const raw = await AsyncStorage.getItem(READ_KEY);
        read = raw ? JSON.parse(raw) : [];
      } catch {
        read = [];
      }
      return { unread: scans.filter((s) => s?.id && !read.includes(s.id)).length };
    },
  });

  const unread = data?.unread ?? 0;

  useEffect(() => {
    if (!unread) {
      swing.stopAnimation();
      pulse.stopAnimation();
      swing.setValue(0);
      pulse.setValue(1);
      return;
    }
    const anim = Animated.loop(
      Animated.sequence([
        // toca o sino: abana para os lados
        Animated.timing(swing, { toValue: 1, duration: 110, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(swing, { toValue: -1, duration: 110, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(swing, { toValue: 1, duration: 110, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(swing, { toValue: 0, duration: 110, easing: Easing.linear, useNativeDriver: true }),
        Animated.delay(1400),
      ]),
    );
    const pump = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.35, duration: 520, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 520, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    );
    anim.start();
    pump.start();
    return () => {
      anim.stop();
      pump.stop();
    };
  }, [unread]);

  const rotate = swing.interpolate({ inputRange: [-1, 1], outputRange: ["-16deg", "16deg"] });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Bell size={20} color="#fff" />
      </Animated.View>

      {unread > 0 && (
        <Animated.View
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            minWidth: 18,
            height: 18,
            paddingHorizontal: 4,
            borderRadius: 9,
            backgroundColor: "#EF476F",
            borderWidth: 2,
            borderColor: "#FF6B35",
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scale: pulse }],
          }}
        >
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}>
            {unread > 9 ? "9+" : unread}
          </Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}
