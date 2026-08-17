import React from "react";
import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authClient } from "../lib/auth";
import { StatusBar } from "expo-status-bar";
import { AppLoading } from "../components/AppLoading";
import { BrandIntro } from "../components/BrandIntro";
import { onSessionExpired } from "../lib/session-expired";
import { ensureToken } from "../lib/auth-fetch";
import { useScanAlerts } from "../lib/scan-alerts";
import { ErrorCatcher } from "../components/ErrorCatcher";
import { LangProvider, useLang, tr } from "../lib/i18n";

const queryClient = new QueryClient();

function AuthGuard() {
  const { data: session, isPending } = authClient.useSession();
  const segments = useSegments();
  const router = useRouter();

  // Se algum pedido apanhar um 401, a sessão local é limpa e voltamos ao
  // ecrã de entrada — em vez de ficar preso com "Sessão expirada".
  useEffect(() => {
    onSessionExpired(() => router.replace("/(auth)/sign-in"));
  }, [router]);

  // Recuperar o token Bearer a partir da sessão de cookie, se faltar.
  useEffect(() => {
    if (session) ensureToken().catch(() => {});
  }, [session]);

  // Avisos com som/vibração quando o QR de um animal é digitalizado
  useScanAlerts(Boolean(session));

  useEffect(() => {
    if (isPending) return;
    const inAuth = segments[0] === "(auth)";
    if (!session && !inAuth) router.replace("/(auth)/sign-in");
    if (session && inAuth) router.replace("/(tabs)");
  }, [session, isPending]);

  if (isPending) {
    return <AppLoading message={tr("Só um instante, quase lá...")} />;
  }

  return <Slot />;
}

/** Quando se muda de idioma, remonta a árvore para o texto ser todo relido. */
function LangKeyed({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();
  return <React.Fragment key={lang}>{children}</React.Fragment>;
}

export default function RootLayout() {
  // Ecrã de abertura da marca (universo escuro + logo Digital Global) antes
  // de tudo o resto. Mostra-se uma vez por arranque da app.
  const [introDone, setIntroDone] = useState(false);

  return (
    <ErrorCatcher>
      <LangProvider>
      <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={introDone ? "auto" : "light"} />
        <LangKeyed>
          {introDone ? <AuthGuard /> : <BrandIntro onDone={() => setIntroDone(true)} />}
        </LangKeyed>
      </QueryClientProvider>
      </SafeAreaProvider>
      </LangProvider>
    </ErrorCatcher>
  );
}
