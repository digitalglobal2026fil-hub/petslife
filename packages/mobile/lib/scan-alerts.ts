import { useEffect, useRef } from "react";
import { Alert, AppState, Linking, Vibration } from "react-native";
import { kvGetIds, kvSetIds, kvHas } from "./kv";
import Constants from "expo-constants";
import { authFetch } from "./auth-fetch";

const API_URL = (
  (Constants.expoConfig?.extra?.apiUrl as string) ??
  process.env.EXPO_PUBLIC_API_URL ??
  "http://localhost:4200"
).replace(/\/$/, "");

const SEEN_KEY = "dg_seen_scan_ids";

/**
 * Avisa o dono quando o QR code de um animal é digitalizado.
 *
 * NOTA: não usamos expo-notifications aqui de propósito. Esse pacote arrasta o
 * Firebase Messaging e, sem um ficheiro google-services.json, a app rebenta
 * logo no arranque. O aviso fiável chega por email (enviado pelo servidor) e
 * aqui dentro da app mostramos um alerta com vibração.
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
        const ids = await kvGetIds(SEEN_KEY);
        seen.current = new Set<string>(ids);
        primed.current = await kvHas(SEEN_KEY);
      } catch {
        seen.current = new Set<string>();
      }
    };

    const announce = (scan: any) => {
      try {
        Vibration.vibrate([0, 400, 200, 400]);
      } catch {
        /* alguns aparelhos não têm vibração */
      }
      const nome = scan?.petName ?? "o seu animal";
      const quem = scan?.finderName ? `\n\nEncontrado por: ${scan.finderName}` : "";
      const tel = scan?.finderPhone ? `\nTelefone: ${scan.finderPhone}` : "";
      const temMapa = scan?.lat && scan?.lng;
      const botoes: any[] = [{ text: "Fechar", style: "cancel" }];
      if (temMapa) {
        botoes.push({
          text: "Ver no mapa",
          onPress: () =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${scan.lat},${scan.lng}`,
            ).catch(() => {}),
        });
      }
      Alert.alert(
        "QR code digitalizado!",
        `Alguém encontrou ${nome}.${quem}${tel}`,
        botoes,
      );
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
        if (fresh.length && primed.current) announce(fresh[0]);
        for (const s of fresh) seen.current!.add(s.id);
        primed.current = true;
        await kvSetIds(SEEN_KEY, [...seen.current!]);
      } catch {
        /* offline — tenta outra vez mais tarde */
      }
    };

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
