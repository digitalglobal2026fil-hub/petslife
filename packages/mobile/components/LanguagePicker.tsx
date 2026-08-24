import React from "react";
import {
  View, Text, TouchableOpacity, Modal, FlatList, Pressable, Platform,
} from "react-native";
import { Check } from "lucide-react-native";
import { useLang, LANGUAGES, type LangCode, tr } from "../lib/i18n";

const BG = "#F5ECD7";
const BROWN = "#6B3A2A";
const BORDER = "#E8D5B7";
const CARD = "#FFFFFF";
const GRAY = "#A08060";

/**
 * Folha de escolha de idioma para o ecrã de Perfil.
 * Abre uma folha com as 5 línguas disponíveis.
 */
export function LanguageModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { lang, setLang, t } = useLang();
  const open = visible;
  const setOpen = (v: boolean) => { if (!v) onClose(); };
  return (
      <Modal visible={open} animationType="fade" transparent onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
          onPress={() => setOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={{
              backgroundColor: BG, borderTopLeftRadius: 28, borderTopRightRadius: 28,
              paddingTop: 20, paddingBottom: Platform.OS === "ios" ? 40 : 24,
            }}>
              <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: "900", color: BROWN, textAlign: "center" }}>
                  🌍 {t("Idioma")}
                </Text>
                <Text style={{ color: GRAY, fontSize: 13, textAlign: "center", marginTop: 4 }}>
                  {t("Escolha o seu idioma preferido")}
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
                      onPress={() => { setLang(item.code as LangCode); setOpen(false); }}
                      style={{
                        flex: 1, flexDirection: "row", alignItems: "center", gap: 10,
                        backgroundColor: selected ? BROWN : CARD,
                        borderRadius: 16, padding: 14,
                        borderWidth: 2, borderColor: selected ? BROWN : BORDER,
                      }}>
                      <Text style={{ fontSize: 26 }}>{item.flag}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: "800", color: selected ? "#FFF8F0" : BROWN, fontSize: 13 }}>
                          {item.name}
                        </Text>
                      </View>
                      {selected ? <Check size={16} color="#FFF8F0" /> : null}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
  );
}
