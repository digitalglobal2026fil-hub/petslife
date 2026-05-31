import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, Modal, FlatList,
  Pressable, Platform
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLang, LANGUAGES } from "../lib/i18n";

const BG = "#F5ECD7";
const BROWN = "#6B3A2A";
const ORANGE = "#E07A3A";
const BORDER = "#E8D5B7";
const CARD = "#FFFFFF";
const GRAY = "#A08060";

export default function LanguageBar() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <>
      {/* Barra de idioma — topo fixo */}
      <View style={{
        backgroundColor: BROWN,
        paddingTop: insets.top + 2,
        paddingBottom: 6,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo / nome */}
        <Text suppressHighlighting style={{ color: "#FFF8F0", fontWeight: "900", fontSize: 16, letterSpacing: 0.5 }}>
          🐾 PetsLife
        </Text>

        {/* Seletor de idioma */}
        <TouchableOpacity onPress={() => setOpen(true)}
          style={{
            flexDirection: "row", alignItems: "center", gap: 6,
            backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20,
            paddingHorizontal: 12, paddingVertical: 5,
          }}>
          <Text suppressHighlighting style={{ fontSize: 16 }}>{current.flag}</Text>
          <Text suppressHighlighting style={{ color: "#FFF8F0", fontWeight: "700", fontSize: 13 }}>{current.label}</Text>
          <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de seleção */}
      <Modal visible={open} animationType="fade" transparent>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
          onPress={() => setOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={{
              backgroundColor: BG, borderTopLeftRadius: 28, borderTopRightRadius: 28,
              paddingTop: 20, paddingBottom: Platform.OS === "ios" ? 40 : 24,
            }}>
              <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "900", color: BROWN, textAlign: "center" }}>
                  🌍 {t("choose_language")}
                </Text>
                <Text suppressHighlighting style={{ color: GRAY, fontSize: 13, textAlign: "center", marginTop: 4 }}>
                  Escolha o seu idioma preferido
                </Text>
              </View>

              <FlatList
                data={LANGUAGES}
                keyExtractor={(item) => item.code}
                numColumns={2}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
                columnWrapperStyle={{ gap: 10 }}
                renderItem={({ item }) => {
                  const selected = item.code === lang;
                  return (
                    <TouchableOpacity
                      onPress={() => { setLang(item.code); setOpen(false); }}
                      style={{
                        flex: 1, flexDirection: "row", alignItems: "center", gap: 10,
                        backgroundColor: selected ? BROWN : CARD,
                        borderRadius: 16, padding: 14,
                        borderWidth: 2, borderColor: selected ? BROWN : BORDER,
                        shadowColor: BROWN, shadowOpacity: 0.07, shadowRadius: 6, elevation: 0,
                      }}>
                      <Text suppressHighlighting style={{ fontSize: 28 }}>{item.flag}</Text>
                      <View style={{ flex: 1 }}>
                        <Text suppressHighlighting style={{ fontWeight: "800", color: selected ? "#FFF8F0" : BROWN, fontSize: 14 }}>
                          {item.name}
                        </Text>
                        <Text suppressHighlighting style={{ color: selected ? "rgba(255,255,255,0.7)" : GRAY, fontSize: 11 }}>
                          {item.label}
                        </Text>
                      </View>
                      {selected && <Text suppressHighlighting style={{ fontSize: 18 }}>✓</Text>}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
