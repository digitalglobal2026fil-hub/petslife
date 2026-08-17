import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useEffect } from "react";
import { Animated, View } from "react-native";
import { Home, Heart, ShoppingBag, Users, User, Image as ImageIcon } from "lucide-react-native";
import { tr } from "../../lib/i18n";

function AnimatedTabIcon({ Icon, color, focused }: { Icon: any; color: string; focused: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, { toValue: 1.25, useNativeDriver: true, tension: 200, friction: 8 }),
          Animated.spring(translateY, { toValue: -3, useNativeDriver: true, tension: 200, friction: 8 }),
        ]),
        Animated.parallel([
          Animated.spring(scale, { toValue: 1.15, useNativeDriver: true, tension: 200, friction: 8 }),
          Animated.spring(translateY, { toValue: -2, useNativeDriver: true, tension: 200, friction: 8 }),
        ]),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 8 }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 200, friction: 8 }),
      ]).start();
    }
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY }], alignItems: "center", justifyContent: "center" }}>
      {focused && (
        <View style={{
          position: "absolute",
          top: -6, left: -10, right: -10, bottom: -6,
          backgroundColor: color + "18",
          borderRadius: 12,
        }} />
      )}
      <Icon size={22} color={color} />
    </Animated.View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#B0BAC9",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: 64 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8) + 4,
          paddingTop: 8,
          elevation: 0,
          shadowColor: "#FF6B35",
          shadowOpacity: 0.08,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -4 },
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 2,
          letterSpacing: 0.2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: tr("Início"),
          tabBarIcon: ({ color, focused }) => <AnimatedTabIcon Icon={Home} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: tr("Saúde"),
          tabBarIcon: ({ color, focused }) => <AnimatedTabIcon Icon={Heart} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="photos"
        options={{
          title: tr("Álbum"),
          tabBarIcon: ({ color, focused }) => <AnimatedTabIcon Icon={ImageIcon} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: tr("Comunidade"),
          tabBarIcon: ({ color, focused }) => <AnimatedTabIcon Icon={Users} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Loja",
          tabBarIcon: ({ color, focused }) => <AnimatedTabIcon Icon={ShoppingBag} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: tr("Perfil"),
          tabBarIcon: ({ color, focused }) => <AnimatedTabIcon Icon={User} color={color} focused={focused} />,
        }}
      />
      {/* tabs ocultas */}
      <Tabs.Screen name="businesses" options={{ href: null }} />
      <Tabs.Screen name="consult" options={{ href: null }} />
    </Tabs>
  );
}
