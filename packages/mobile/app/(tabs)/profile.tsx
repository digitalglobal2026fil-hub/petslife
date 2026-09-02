import { View, Text, ScrollView, TouchableOpacity, Alert, Image, Animated, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useRef, useEffect, useState } from "react";
import { Camera, Bell, CreditCard, MapPin, LogOut, ChevronRight, Shield, HelpCircle, Gift, Edit2, Sparkles, Lock, Pill, ShieldAlert, Globe, Music, Volume2, VolumeX } from "lucide-react-native";
import { authClient, clearToken } from "../../lib/auth";
import { api } from "../../lib/api";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { authFetch } from "../../lib/auth-fetch";
import { LanguageModal } from "../../components/LanguagePicker";
import { useLang, LANGUAGES, tr } from "../../lib/i18n";
import { somAberturaLigado, definirSomAbertura, experimentarAbertura } from "../../lib/opening-sound";

const API_URL = ((Constants.expoConfig?.extra?.apiUrl as string) ?? process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4200").replace(/\/$/, "");

function getToken(): string {
  try {
    if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem("bearer_token") : null) ?? "";
    const SecureStore = require("expo-secure-store");
    return SecureStore.getItem("bearer_token") ?? "";
  } catch { return ""; }
}

function MenuItem({ item, index }: { item: any; index: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, delay: index * 50, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={item.onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 300, friction: 10 }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start()}
        activeOpacity={1}
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 0,
        }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.color + "18", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
          <item.icon size={20} color={item.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontWeight: "700", color: "#1A1A2E", fontSize: 14 }}>{item.label}</Text>
          <Text suppressHighlighting style={{ color: "#B0BAC9", fontSize: 12, marginTop: 1 }}>{item.sublabel}</Text>
        </View>
        <ChevronRight size={18} color="#D1D5DB" />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const avatarScale = useRef(new Animated.Value(0.8)).current;

  const { data: subData } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => (await api.subscriptions.me.$get()).json(),
  });
  // Denúncias por tratar (só a administração recebe um número > 0)
  const { data: reportData } = useQuery({
    queryKey: ["reports-count"],
    refetchInterval: 60000,
    queryFn: async () => {
      try {
        const res = await authFetch(`${API_URL}/api/reports/count`, {});
        if (!res.ok) return { count: 0 };
        return res.json();
      } catch { return { count: 0 }; }
    },
  });
  const reportCount = Number((reportData as any)?.count ?? 0);

  const { data: meData } = useQuery({
    queryKey: ["user-me"],
    queryFn: async () => {
      const token = getToken();
      const res = await authFetch(`${API_URL}/api/users/me`, {});
      if (!res.ok) return null;
      return res.json();
    },
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(avatarScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const sub = (subData as any);
  const isTrial = sub?.isTrial;
  const isActive = sub?.isActive;
  const photoUrl = (meData as any)?.user?.photoUrl ?? null;
  const userName = (meData as any)?.user?.name ?? session?.user?.name ?? "";
  const userEmail = (meData as any)?.user?.email ?? session?.user?.email ?? "";

  async function handleSignOut() {
    Alert.alert(tr("Sair"), tr("Tem a certeza que quer sair?"), [
      { text: tr("Cancelar"), style: "cancel" },
      {
        text: tr("Sair"), style: "destructive", onPress: async () => {
          // Limpar o token PRIMEIRO: garante que a sessão local termina
          // mesmo que o servidor esteja em baixo ou sem rede.
          clearToken();
          try {
            await authClient.signOut();
          } catch {
            // Sem rede/servidor em baixo: a sessão local já foi limpa.
          }
          // Forçar a ida para o ecrã de entrada (o redirect do index
          // só corre no arranque da app).
          router.replace("/(auth)/sign-in" as any);
        }
      }
    ]);
  }

  const [somLigado, setSomLigado] = useState(true);
  useEffect(() => { somAberturaLigado().then(setSomLigado); }, []);
  async function alternarSom() {
    const novo = !somLigado;
    setSomLigado(novo);
    await definirSomAbertura(novo);
    if (novo) experimentarAbertura();
  }

  const [langOpen, setLangOpen] = useState(false);
  const { lang, t } = useLang();
  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  const menuItems = [
    { icon: somLigado ? Volume2 : VolumeX, label: tr("Som de abertura"), sublabel: somLigado ? tr("Ligado — toca ao abrir a app") : tr("Desligado"), color: "#F59E0B", onPress: alternarSom },
    { icon: Globe, label: t("Idioma"), sublabel: `${currentLang.flag}  ${currentLang.name}`, color: "#3B82F6", onPress: () => setLangOpen(true) },
    { icon: CreditCard, label: tr("Subscrição"), sublabel: isTrial ? tr("Trial ativo") : isActive ? tr("Premium ativo") : tr("Inativo"), color: "#FF6B35", onPress: () => router.push("/subscription") },
    { icon: Gift, label: tr("Código Promocional"), sublabel: tr("Tens um código especial?"), color: "#10B981", onPress: () => router.push("/promo-code" as any) },
    { icon: Pill, label: tr("Lembretes"), sublabel: tr("Medicação, tratamentos e vacinas"), color: "#4ECDC4", onPress: () => router.push("/reminders" as any) },
    { icon: MapPin, label: tr("Vets e Outros"), sublabel: tr("Clínicas, lojas e serviços"), color: "#06D6A0", onPress: () => router.push("/find-vets") },
    { icon: Shield, label: tr("Privacidade"), sublabel: tr("Política de privacidade"), color: "#8B5CF6", onPress: () => Linking.openURL(`${API_URL}/privacy`).catch(() => Alert.alert(tr("Erro"), tr("Não foi possível abrir a política de privacidade."))) },
    { icon: HelpCircle, label: tr("Ajuda e Suporte"), sublabel: tr("Contacte-nos por email"), color: "#6B7280", onPress: () => Linking.openURL("mailto:support@petslife.app?subject=Suporte%20PetsLife").catch(() => Alert.alert(tr("Erro"), tr("Não foi possível abrir o email."))) },
  ];

  // Área de administração — só aparece nas contas de administração
  const ADMIN_EMAILS = ["digitalglobal2026fil@gmail.com", "aleclikes@outlook.pt"];
  if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    menuItems.push({
      icon: ShieldAlert, label: tr("Denúncias"),
      sublabel: reportCount > 0
        ? `${reportCount} ${reportCount === 1 ? tr("denúncia por ver") : tr("denúncias por ver")}`
        : tr("Conteúdo assinalado pelos utilizadores"),
      color: "#EF4444", onPress: () => router.push("/reports" as any),
      badge: reportCount,
    } as any);
    menuItems.push({
      icon: Lock, label: tr("Gestão de Parceiros"), sublabel: tr("Códigos e desempenho (PIN)"),
      color: "#8B5CF6", onPress: () => router.push("/admin" as any),
    });
  }

  const statusColor = isTrial ? "#FF6B35" : isActive ? "#06D6A0" : "#9CA3AF";
  const statusLabel = isTrial ? tr("🎉 Trial ativo") : isActive ? tr("⭐ Premium") : tr("Sem plano");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6FF" }} edges={["top", "left", "right"]}>
      <LanguageModal visible={langOpen} onClose={() => setLangOpen(false)} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

        {/* Header com gradiente */}
        <Animated.View style={{
          opacity: headerAnim,
          backgroundColor: "#8B5CF6",
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 60,
          borderBottomLeftRadius: 36,
          borderBottomRightRadius: 36,
        }}>
          <View style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.08)" }} />
          <Text suppressHighlighting style={{ fontSize: 24, fontWeight: "800", color: "#fff", textAlign: "center" }}>{tr("Perfil")}</Text>
        </Animated.View>

        {/* Avatar flutuante sobre o header */}
        <Animated.View style={{
          transform: [{ scale: avatarScale }],
          alignItems: "center",
          marginTop: -50,
          marginBottom: 20,
        }}>
          <TouchableOpacity onPress={() => router.push("/edit-profile" as any)} activeOpacity={0.85} style={{ position: "relative" }}>
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: "#fff" }} />
            ) : (
              <View style={{
                width: 100, height: 100, borderRadius: 50,
                backgroundColor: "#FF6B35",
                alignItems: "center", justifyContent: "center",
                borderWidth: 4, borderColor: "#fff",
                shadowColor: "#FF6B35", shadowOpacity: 0.3, shadowRadius: 12, elevation: 0,
              }}>
                <Text suppressHighlighting style={{ color: "#fff", fontSize: 38, fontWeight: "800" }}>
                  {userName?.[0]?.toUpperCase() ?? "?"}
                </Text>
              </View>
            )}
            <View style={{
              position: "absolute", bottom: 2, right: 2,
              width: 30, height: 30, borderRadius: 15,
              backgroundColor: "#FF6B35", borderWidth: 2.5, borderColor: "#fff",
              alignItems: "center", justifyContent: "center",
            }}>
              <Camera size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text suppressHighlighting style={{ fontSize: 22, fontWeight: "800", color: "#1A1A2E", marginTop: 12 }}>{userName}</Text>
          <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 13, marginTop: 2 }}>{userEmail}</Text>

          {/* Status badge */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: statusColor + "20", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginTop: 10 }}>
            <Sparkles size={13} color={statusColor} />
            <Text suppressHighlighting style={{ color: statusColor, fontSize: 13, fontWeight: "700" }}>{statusLabel}</Text>
          </View>

          {/* Editar perfil */}
          <TouchableOpacity
            onPress={() => router.push("/edit-profile" as any)}
            activeOpacity={0.8}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12, backgroundColor: "#F5F3FF", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Edit2 size={14} color="#8B5CF6" />
            <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "700", color: "#8B5CF6" }}>{tr("Editar perfil")}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Menu */}
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          {menuItems.map((item, index) => (
            <MenuItem key={item.label} item={item} index={index} />
          ))}

          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.85}
            style={{
              backgroundColor: "#FFF0F3",
              borderRadius: 20,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
            }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#EF476F20", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
              <LogOut size={20} color="#EF476F" />
            </View>
            <Text suppressHighlighting style={{ fontWeight: "700", color: "#EF476F", fontSize: 14, flex: 1 }}>{tr("Sair da conta")}</Text>
          </TouchableOpacity>

          {/* Aviso honesto sobre a origem dos conteúdos. Não afirma que a app
              foi certificada por ninguém — a Google chumba alegações dessas
              sem prova. Quando houver a revisão da veterinária, troca-se pelo
              nome e cédula profissional dela. */}
          <View style={{ backgroundColor: "#F0FDF4", borderRadius: 14, borderWidth: 1.5, borderColor: "#BBF7D0", padding: 14, marginTop: 18, gap: 6 }}>
            <Text suppressHighlighting style={{ color: "#065F46", fontWeight: "800", fontSize: 12 }}>
              {tr("Sobre os nossos conteúdos")}
            </Text>
            <Text suppressHighlighting style={{ color: "#047857", fontSize: 12, lineHeight: 18 }}>
              Os guias da PetsLife são baseados em fontes veterinárias reconhecidas.
            </Text>
            <Text suppressHighlighting style={{ color: "#047857", fontSize: 12, lineHeight: 18 }}>
              A PetsLife não substitui a consulta veterinária. Em caso de urgência,
              procure sempre um médico veterinário.
            </Text>
          </View>

          <Text style={{ textAlign: "center", color: "#9CA3AF", fontSize: 12, marginTop: 18, marginBottom: 4 }}>
            PetsLife v{Constants.expoConfig?.version ?? "?"} (build {String(Constants.expoConfig?.android?.versionCode ?? "?")})
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
