import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Heart, ShoppingBag, Users, User, Video, Image as ImageIcon } from "lucide-react-native";

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
          height: 60 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8) + 4,
          paddingTop: 6,
          elevation: 0,
          shadowColor: "transparent",
          shadowOpacity: 0,
          shadowRadius: 0,
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
        name="photos"
        options={{ title: "Álbum", tabBarIcon: ({ color, size }) => <ImageIcon size={size} color={color} /> }}
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
      {/* tabs ocultas */}
      <Tabs.Screen name="businesses" options={{ href: null }} />
      <Tabs.Screen name="consult" options={{ href: null }} />
    </Tabs>
  );
}
