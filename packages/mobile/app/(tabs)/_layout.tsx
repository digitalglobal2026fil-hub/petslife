import { Tabs } from "expo-router";
import { Home, Heart, ShoppingBag, Users, User, Video } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#F0E8E0",
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="index"     options={{ title: "Início",    tabBarIcon: ({ color, size }) => <Home      size={size} color={color} /> }} />
      <Tabs.Screen name="health"    options={{ title: "Saúde",     tabBarIcon: ({ color, size }) => <Heart     size={size} color={color} /> }} />
      <Tabs.Screen name="consult"   options={{ title: "Consulta",  tabBarIcon: ({ color, size }) => <Video     size={size} color={color} /> }} />
      <Tabs.Screen name="social"    options={{ title: "Comunidade",tabBarIcon: ({ color, size }) => <Users     size={size} color={color} /> }} />
      <Tabs.Screen name="marketplace" options={{ title: "Loja",   tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} /> }} />
      <Tabs.Screen name="profile"   options={{ title: "Perfil",    tabBarIcon: ({ color, size }) => <User      size={size} color={color} /> }} />
    </Tabs>
  );
}
