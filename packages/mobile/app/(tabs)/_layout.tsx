import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Heart, ShoppingBag, Users, User, Video } from "lucide-react-native";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

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
          // respect the system nav bar height + extra breathing room
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 6,
          elevation: 12,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Início", tabBarIcon: ({ color, size }) => <Home size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="health"
        options={{ title: "Saúde", tabBarIcon: ({ color, size }) => <Heart size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="consult"
        options={{ title: "Consulta", tabBarIcon: ({ color, size }) => <Video size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="social"
        options={{ title: "Comunidade", tabBarIcon: ({ color, size }) => <Users size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{ title: "Marketplace", tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Perfil", tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }}
      />
      {/* businesses tab hidden — conteúdo fundido no marketplace */}
      <Tabs.Screen
        name="businesses"
        options={{ href: null }}
      />
    </Tabs>
  );
}
