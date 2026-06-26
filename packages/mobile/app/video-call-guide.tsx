import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert, Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ChevronLeft, Video, Calendar, Share2, PhoneCall, CheckCircle2,
  AlertCircle, Wifi, Mic, Camera, Smartphone, HelpCircle
} from "lucide-react-native";

const STEPS = [
  {
    icon: "📅",
    title: "1. Agende a consulta",
    desc: "No ecrã de Consulta Online, carregue no botão + e preencha os dados: nome do vet, especialidade, data e hora.",
    tip: "Confirme a data e hora com o veterinário antes de agendar.",
    color: "#FF6B35",
    bg: "#FFF0EB",
  },
  {
    icon: "🔗",
    title: "2. Receba o link",
    desc: "Após agendar, aparece automaticamente um link de videochamada gratuito. Esse link é único para a sua consulta.",
    tip: "O link fica sempre visível no card da consulta, mesmo depois de fechar a app.",
    color: "#4ECDC4",
    bg: "#E6F7F6",
  },
  {
    icon: "📤",
    title: "3. Partilhe com o vet",
    desc: "Carregue no ícone de partilha ao lado do link e envie ao veterinário por WhatsApp, email ou SMS.",
    tip: "O veterinário não precisa de instalar nada — abre directamente no browser dele.",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    icon: "📱",
    title: "4. Entre na chamada",
    desc: "Na hora marcada, carregue em \"Entrar na chamada\" no card da consulta. Abre o browser com a sala de vídeo.",
    tip: "Entre 2-3 minutos antes para testar o microfone e câmara.",
    color: "#10B981",
    bg: "#D1FAE5",
  },
  {
    icon: "✅",
    title: "5. Consulta concluída",
    desc: "Após terminar, o estado da consulta passa para \"Concluída\" e fica guardada no histórico.",
    tip: "Pode criar novas consultas quantas vezes quiser.",
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
];

const REQUIREMENTS = [
  { icon: Wifi, label: "Wi-Fi ou dados móveis estáveis", ok: true },
  { icon: Camera, label: "Câmara do telemóvel activa", ok: true },
  { icon: Mic, label: "Microfone do telemóvel activo", ok: true },
  { icon: Smartphone, label: "Browser actualizado (Chrome, Safari, etc.)", ok: true },
];

const FAQS = [
  {
    q: "O veterinário precisa de instalar alguma app?",
    a: "Não. O link abre directamente no browser, em qualquer dispositivo. Sem instalações.",
  },
  {
    q: "A videochamada é segura e privada?",
    a: "Sim. Cada sala tem um link único. Só quem tiver o link consegue entrar.",
  },
  {
    q: "O que fazer se a câmara não funcionar?",
    a: "Vá às Definições do telemóvel → Aplicações → Browser → Permissões → ative Câmara e Microfone.",
  },
  {
    q: "Posso usar a videochamada no computador?",
    a: "Sim. Basta abrir o link no browser do computador. Funciona em qualquer dispositivo.",
  },
  {
    q: "O que faço se o link expirar?",
    a: "Cancele a consulta na app e agende uma nova. Será gerado um novo link automaticamente.",
  },
  {
    q: "Há limite de tempo na chamada?",
    a: "Não. Pode falar o tempo que precisar. A duração marcada no agendamento é apenas indicativa.",
  },
];

export default function VideoCallGuideScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  function openJitsiTest() {
    Linking.openURL("https://meet.jit.si/petslife-teste-demo").catch(() =>
      Alert.alert("Erro", "Não foi possível abrir o browser.")
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={styles.headerTitle}>Guia de Videochamada</Text>
          <Text suppressHighlighting style={styles.headerSub}>Como consultar o vet online</Text>
        </View>
        <View style={styles.headerIcon}>
          <Video size={22} color="#FF6B35" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero card */}
        <View style={styles.heroCard}>
          <Text suppressHighlighting style={styles.heroEmoji}>🎥</Text>
          <Text suppressHighlighting style={styles.heroTitle}>Consulta online com o seu vet</Text>
          <Text suppressHighlighting style={styles.heroText}>
            Sem deslocações. Sem esperas. Fale com o veterinário em directo por videochamada, directamente aqui na app — gratuito e sem instalações.
          </Text>
          <TouchableOpacity style={styles.testBtn} onPress={openJitsiTest}>
            <Video size={16} color="#fff" />
            <Text suppressHighlighting style={styles.testBtnText}>Testar videochamada agora</Text>
          </TouchableOpacity>
        </View>

        {/* Requisitos */}
        <Text suppressHighlighting style={styles.sectionTitle}>O que precisa</Text>
        <View style={styles.requirementsCard}>
          {REQUIREMENTS.map((r, i) => (
            <View key={i} style={[styles.requirementRow, i < REQUIREMENTS.length - 1 && styles.requirementBorder]}>
              <View style={styles.requirementIcon}>
                <r.icon size={18} color="#4ECDC4" />
              </View>
              <Text suppressHighlighting style={styles.requirementText}>{r.label}</Text>
              <CheckCircle2 size={18} color="#10B981" />
            </View>
          ))}
        </View>

        {/* Passos */}
        <Text suppressHighlighting style={styles.sectionTitle}>Passo a passo</Text>
        {STEPS.map((step, i) => (
          <View key={i} style={[styles.stepCard, { borderLeftColor: step.color }]}>
            <View style={[styles.stepIconBadge, { backgroundColor: step.bg }]}>
              <Text suppressHighlighting style={styles.stepEmoji}>{step.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text suppressHighlighting style={[styles.stepTitle, { color: step.color }]}>{step.title}</Text>
              <Text suppressHighlighting style={styles.stepDesc}>{step.desc}</Text>
              <View style={[styles.tipBox, { backgroundColor: step.bg }]}>
                <AlertCircle size={13} color={step.color} />
                <Text suppressHighlighting style={[styles.tipText, { color: step.color }]}>{step.tip}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Dica sobre permissões */}
        <View style={styles.permissionsCard}>
          <View style={styles.permissionsHeader}>
            <Camera size={20} color="#8B5CF6" />
            <Text suppressHighlighting style={styles.permissionsTitle}>Permissões do browser</Text>
          </View>
          <Text suppressHighlighting style={styles.permissionsText}>
            Quando entrar na chamada pela primeira vez, o browser vai pedir permissão para aceder à câmara e ao microfone.
          </Text>
          <Text suppressHighlighting style={[styles.permissionsText, { marginTop: 8, fontWeight: "700" }]}>
            Carregue sempre em "Permitir" para a chamada funcionar correctamente.
          </Text>
          {Platform.OS === "android" && (
            <View style={styles.permissionsStep}>
              <Text suppressHighlighting style={styles.permissionsStepText}>
                📱 Android: Definições → Apps → Chrome → Permissões → Câmara e Microfone
              </Text>
            </View>
          )}
          {Platform.OS === "ios" && (
            <View style={styles.permissionsStep}>
              <Text suppressHighlighting style={styles.permissionsStepText}>
                📱 iPhone: Definições → Safari → Câmara e Microfone → Perguntar
              </Text>
            </View>
          )}
        </View>

        {/* FAQ */}
        <Text suppressHighlighting style={styles.sectionTitle}>Perguntas frequentes</Text>
        {FAQS.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={styles.faqCard}
            onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
            activeOpacity={0.8}
          >
            <View style={styles.faqRow}>
              <HelpCircle size={16} color="#FF6B35" style={{ marginTop: 1 }} />
              <Text suppressHighlighting style={styles.faqQuestion}>{faq.q}</Text>
              <Text suppressHighlighting style={styles.faqChevron}>
                {expandedFaq === i ? "▲" : "▼"}
              </Text>
            </View>
            {expandedFaq === i && (
              <Text suppressHighlighting style={styles.faqAnswer}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* CTA final */}
        <View style={styles.ctaCard}>
          <Text suppressHighlighting style={styles.ctaTitle}>Pronta para agendar?</Text>
          <Text suppressHighlighting style={styles.ctaText}>
            Vá ao separador de consultas e carregue no + para marcar a sua primeira consulta online.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push("/(tabs)/consult" as never)}
          >
            <PhoneCall size={16} color="#fff" />
            <Text suppressHighlighting style={styles.ctaBtnText}>Ir para consultas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F6FF" },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 16, gap: 12,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E5E0F5",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#1A1A2E" },
  headerSub: { fontSize: 12, color: "#9CA3AF", marginTop: 1 },
  headerIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "#FFF0EB", alignItems: "center", justifyContent: "center",
  },

  // Hero
  heroCard: {
    backgroundColor: "#1A1A2E", borderRadius: 24, margin: 20, marginTop: 4,
    padding: 24, alignItems: "center",
  },
  heroEmoji: { fontSize: 48, marginBottom: 12 },
  heroTitle: { fontSize: 20, fontWeight: "800", color: "#fff", textAlign: "center", marginBottom: 8 },
  heroText: { fontSize: 14, color: "#CBD5E1", textAlign: "center", lineHeight: 22, marginBottom: 20 },
  testBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#FF6B35", borderRadius: 14, paddingHorizontal: 20, paddingVertical: 13,
  },
  testBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  sectionTitle: {
    fontSize: 17, fontWeight: "800", color: "#1A1A2E",
    marginHorizontal: 20, marginBottom: 12, marginTop: 8,
  },

  // Requirements
  requirementsCard: {
    backgroundColor: "#fff", borderRadius: 18, marginHorizontal: 20,
    marginBottom: 24, borderWidth: 1.5, borderColor: "#E5E0F5", overflow: "hidden",
  },
  requirementRow: {
    flexDirection: "row", alignItems: "center", padding: 14, gap: 12,
  },
  requirementBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F0FF" },
  requirementIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#E6F7F6", alignItems: "center", justifyContent: "center",
  },
  requirementText: { flex: 1, fontSize: 14, color: "#374151", fontWeight: "500" },

  // Steps
  stepCard: {
    flexDirection: "row", alignItems: "flex-start", gap: 14,
    backgroundColor: "#fff", borderRadius: 18, padding: 16,
    marginHorizontal: 20, marginBottom: 12,
    borderLeftWidth: 4, borderWidth: 1, borderColor: "#F3F0FF",
  },
  stepIconBadge: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  stepEmoji: { fontSize: 22 },
  stepTitle: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  stepDesc: { fontSize: 13, color: "#374151", lineHeight: 20, marginBottom: 8 },
  tipBox: {
    flexDirection: "row", alignItems: "flex-start", gap: 6,
    borderRadius: 10, padding: 10,
  },
  tipText: { fontSize: 12, flex: 1, lineHeight: 18, fontWeight: "600" },

  // Permissions
  permissionsCard: {
    backgroundColor: "#F5F3FF", borderRadius: 18, marginHorizontal: 20,
    marginBottom: 24, padding: 18, borderWidth: 1.5, borderColor: "#DDD6FE",
  },
  permissionsHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  permissionsTitle: { fontSize: 15, fontWeight: "800", color: "#5B21B6" },
  permissionsText: { fontSize: 13, color: "#4C1D95", lineHeight: 20 },
  permissionsStep: {
    backgroundColor: "#EDE9FE", borderRadius: 10, padding: 12, marginTop: 10,
  },
  permissionsStepText: { fontSize: 12, color: "#5B21B6", lineHeight: 18 },

  // FAQ
  faqCard: {
    backgroundColor: "#fff", borderRadius: 14, marginHorizontal: 20, marginBottom: 8,
    padding: 16, borderWidth: 1, borderColor: "#F0EEF8",
  },
  faqRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  faqQuestion: { flex: 1, fontSize: 14, fontWeight: "700", color: "#1A1A2E", lineHeight: 20 },
  faqChevron: { fontSize: 11, color: "#9CA3AF", marginTop: 3 },
  faqAnswer: {
    fontSize: 13, color: "#4B5563", lineHeight: 20,
    marginTop: 10, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: "#F3F0FF",
  },

  // CTA
  ctaCard: {
    backgroundColor: "#FF6B35", borderRadius: 24, margin: 20,
    padding: 24, alignItems: "center",
  },
  ctaTitle: { fontSize: 20, fontWeight: "800", color: "#fff", marginBottom: 8 },
  ctaText: { fontSize: 14, color: "#FFE0D0", textAlign: "center", lineHeight: 20, marginBottom: 20 },
  ctaBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14,
  },
  ctaBtnText: { color: "#FF6B35", fontWeight: "800", fontSize: 15 },
});
