import { Redirect } from "expo-router";
import { authClient } from "../lib/auth";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { data: session, isPending } = authClient.useSession();

  // Aguarda a sessão carregar antes de redirecionar
  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF9F5" }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href="/(tabs)" />;
}
