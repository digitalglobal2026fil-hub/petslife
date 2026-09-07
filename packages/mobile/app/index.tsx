import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth";
import { ActivityIndicator, View } from "react-native";
import { kvGet } from "../lib/kv";
import { TUTORIAL_KEY } from "./tutorial";

export default function Index() {
  const { data: session, isPending } = authClient.useSession();
  // null = ainda a ler do telemóvel; true/false = já sabemos
  const [tutorialVisto, setTutorialVisto] = useState<boolean | null>(null);

  useEffect(() => {
    let vivo = true;
    kvGet(TUTORIAL_KEY)
      .then((v) => {
        if (vivo) setTutorialVisto(v === "1");
      })
      .catch(() => {
        if (vivo) setTutorialVisto(true); // se falhar, não incomoda a utilizadora
      });
    return () => {
      vivo = false;
    };
  }, []);

  // Aguarda a sessão carregar antes de redirecionar
  if (isPending || tutorialVisto === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF9F5" }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Primeira vez que entra depois de ter conta: mostra o tutorial do cãozinho
  if (!tutorialVisto) {
    return <Redirect href="/tutorial" />;
  }

  return <Redirect href="/(tabs)" />;
}
