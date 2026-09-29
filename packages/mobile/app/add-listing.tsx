import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Tag, Package, Camera, X } from "lucide-react-native";
import { api } from "../lib/api";
import { netError } from "../lib/net-error";
import { tr } from "../lib/i18n";
import { safeBack } from "../lib/safe-back";
import { pickImageWithChoice } from "../lib/pick-image";
import { uploadImage } from "../lib/upload";

const CATEGORIES = [
  { key: "adoption", label: tr("Adoção"), emoji: "🏠" },
  { key: "products", label: "Produtos", emoji: "🛍️" },
  { key: "services", label: tr("Serviços"), emoji: "✂️" },
  { key: "lost", label: tr("Animal Perdido"), emoji: "🔍" },
];

// Fora do componente para evitar que o teclado feche a cada keystroke
function Field({ label, value, onChangeText, placeholder, keyboardType, multiline }: any) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType ?? "default"}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        placeholderTextColor="#9CA3AF"
        style={{
          backgroundColor: "#fff",
          borderWidth: 1.5,
          borderColor: "#F0E8E0",
          borderRadius: 16,
          padding: 14,
          fontSize: 15,
          color: "#1A1A2E",
          minHeight: multiline ? 100 : undefined,
          textAlignVertical: multiline ? "top" : undefined,
        }}
      />
    </View>
  );
}

export default function AddListingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("adoption");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  async function pickPhoto() {
    const picked = await pickImageWithChoice({ title: tr("Foto do anúncio") });
    if (!picked) return;
    setPhoto(picked.uri);
    setUploadingPhoto(true);
    try {
      const url = await uploadImage(picked.uri, picked.mimeType);
      setPhotoUrl(url);
    } catch (e: any) {
      Alert.alert(tr("Erro ao carregar foto"), e?.message ?? tr("Tente novamente."));
      setPhoto(null);
    } finally {
      setUploadingPhoto(false);
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.marketplace.$post({
        json: {
          title,
          description,
          category,
          // price notNull no schema — enviar 0 se vazio
          price: price ? parseFloat(price.replace(",", ".")) : 0,
          location: location || undefined,
          contact: contact || undefined,
          imageUrl: photoUrl || undefined,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text.includes("<") ? tr("Erro no servidor. Tente novamente.") : text);
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["marketplace"] });
      Alert.alert("Sucesso!", tr("O seu anúncio foi publicado."), [{ text: tr("OK"), onPress: () => safeBack(router, "/(tabs)/marketplace") }]);
    },
    onError: (e: any) => Alert.alert("Ups", netError(e, tr("Não foi possível publicar o anúncio."))),
  });

  function handleSubmit() {
    if (!title.trim()) return Alert.alert(tr("Erro"), tr("O título é obrigatório."));
    if (!description.trim()) return Alert.alert(tr("Erro"), tr("A descrição é obrigatória."));
    if (uploadingPhoto) return Alert.alert(tr("Aguarde"), tr("A foto ainda está a carregar."));
    mutation.mutate();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12 }}>
          <TouchableOpacity onPress={() => safeBack(router, "/(tabs)/marketplace")}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
            <ChevronLeft size={20} color="#1A1A2E" />
          </TouchableOpacity>
          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>{tr("Novo Anúncio")}</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingTop: 4 , paddingBottom: Math.max(insets.bottom, 24) }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category selector */}
          <View style={{ marginBottom: 18 }}>
            <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 8 }}>{tr("Categoria *")}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity key={c.key} onPress={() => setCategory(c.key)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: category === c.key ? "#FF6B35" : "#fff", borderWidth: 1.5, borderColor: category === c.key ? "#FF6B35" : "#F0E8E0" }}>
                  <Text suppressHighlighting style={{ fontSize: 16 }}>{c.emoji}</Text>
                  <Text suppressHighlighting style={{ fontWeight: "600", fontSize: 13, color: category === c.key ? "#fff" : "#1A1A2E" }}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Field label={tr("Título *")} value={title} onChangeText={setTitle} placeholder={tr("Ex: Cachorro Labrador para adopção")} />
          <Field label={tr("Descrição *")} value={description} onChangeText={setDescription} placeholder={tr("Descreva o animal, produto ou serviço com detalhe...")} multiline />

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
            <View style={{ flex: 1 }}>
              <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>{tr("Preço (€)")}</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="0,00"
                keyboardType="decimal-pad"
                placeholderTextColor="#9CA3AF"
                style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 16, padding: 14, fontSize: 15, color: "#1A1A2E" }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>{tr("Localização")}</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder={tr("Ex: Lisboa")}
                placeholderTextColor="#9CA3AF"
                style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 16, padding: 14, fontSize: 15, color: "#1A1A2E" }}
              />
            </View>
          </View>

          <Field label={tr("Contacto")} value={contact} onChangeText={setContact} placeholder={tr("Email ou telefone")} />

          <View style={{ marginBottom: 18 }}>
            <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 8 }}>{tr("Foto")}</Text>
            {photo ? (
              <View style={{ alignSelf: "flex-start" }}>
                <Image source={{ uri: photo }} style={{ width: 110, height: 110, borderRadius: 16 }} />
                {uploadingPhoto ? (
                  <View style={{ position: "absolute", width: 110, height: 110, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" }}>
                    <ActivityIndicator color="#fff" />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => { setPhoto(null); setPhotoUrl(null); }}
                    style={{ position: "absolute", top: -8, right: -8, width: 26, height: 26, borderRadius: 13, backgroundColor: "#1A1A2E", alignItems: "center", justifyContent: "center" }}>
                    <X size={15} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity onPress={pickPhoto} activeOpacity={0.8}
                style={{ width: 110, height: 110, borderRadius: 16, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", borderStyle: "dashed", alignItems: "center", justifyContent: "center" }}>
                <Camera size={24} color="#FF6B35" />
                <Text suppressHighlighting style={{ color: "#FF6B35", fontSize: 11, fontWeight: "600", marginTop: 6 }}>{tr("Adicionar foto")}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Info banner */}
          <View style={{ backgroundColor: "#E8FAF9", borderRadius: 16, padding: 14, marginBottom: 20, flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
            <Package size={18} color="#4ECDC4" style={{ marginTop: 2 }} />
            <Text suppressHighlighting style={{ color: "#1A1A2E", fontSize: 13, lineHeight: 20, flex: 1 }}>
              O seu anúncio será visível para toda a comunidade PetsLife. Certifique-se de que as informações são corretas.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={mutation.isPending}
            style={{ backgroundColor: "#FF6B35", borderRadius: 18, padding: 17, alignItems: "center", marginBottom: 24, opacity: mutation.isPending ? 0.7 : 1 }}>
            {mutation.isPending ? <ActivityIndicator color="#fff" /> : (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Tag size={18} color="#fff" />
                <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>{tr("Publicar Anúncio")}</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
