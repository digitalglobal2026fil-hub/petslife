import { useEffect, useRef } from "react";
import { AppState, Platform, Vibration } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { authFetch } from "./auth-fetch";

const API_URL = (
  (Constants.expoConfig?.extra?.apiUrl as string) ??
  process.env.EXPO_PUBLIC_API_URL ??
  "http://localhost:4200"
).replace(/\/$/, "");

const SEEN_KEY = "dg_seen_scan_ids";

let notificationsReady = false;

async function setupNotifications() {
  if (notificationsReady) return null;
  try {
    const Notifications = require("expo-notifications");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("qr-alerts", {
        name: "Avisos do QR Code",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 400, 200, 400],
        lightColor: "#FF6B35",
        sound: "default",
      });
    }
    const perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) await Notifications.requestPermissionsAsync();
    notificationsReady = true;
    return Notifications;
  } catch (e) {
    console.warn("[scan-alerts] notifications indisponíveis", e);
    return null;
  }
}

async function notify(title: string, body: string) {
  Vibration.vibrate([0, 400, 200, 400]);
  const Notifications = await setupNotifications();
  if (!Notifications) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: "default", priority: "max", data: { type: "qr-scan" } },
      trigger: null,
    });
  } catch (e) {
    console.warn("[scan-alerts] falha a mostrar notificação", e);
  }
}

/**
 * Verifica periodicamente se o QR code de algum animal foi digitalizado e
 * dispara uma notificação com som e vibração quando aparece um registo novo.
 */
export function useScanAlerts(enabled: boolean) {
  const seen = useRef<Set<string> | null>(null);
  const primed = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    let stopped = false;

    const load = async () => {
      if (seen.current) return;
      try {
        const raw = await AsyncStorage.getItem(SEEN_KEY);
        seen.current = new Set<string>(raw ? JSON.parse(raw) : []);
        primed.current = Boolean(raw);
      } catch {
        seen.current = new Set<string>();
      }
    };

    const check = async () => {
      if (stopped) return;
      await load();
      try {
        const res = await authFetch(`${API_URL}/api/pet-scans/mine`, {});
        if (!res.ok) return;
        const data = await res.json();
        const scans: any[] = data?.scans ?? data?.petScans ?? [];
        const fresh = scans.filter((s) => s?.id && !seen.current!.has(s.id));
        if (fresh.length && primed.current) {
          const s = fresh[0];
          await notify(
            "🐾 QR code digitalizado!",
            `Alguém encontrou ${s.petName ?? "o seu animal"}${s.finderName ? ` — ${s.finderName}` : ""}. Abra a app para ver a localização.`,
          );
        }
        for (const s of fresh) seen.current!.add(s.id);
        primed.current = true;
        await AsyncStorage.setItem(SEEN_KEY, JSON.stringify([...seen.current!].slice(-200)));
      } catch {
        /* offline — tenta outra vez mais tarde */
      }
    };

    setupNotifications();
    check();
    const timer = setInterval(check, 60_000);
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") check();
    });

    return () => {
      stopped = true;
      clearInterval(timer);
      sub.remove();
    };
  }, [enabled]);
}
