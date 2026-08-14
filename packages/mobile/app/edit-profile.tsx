import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ChevronLeft, User, Phone, MapPin, Mail, Save, Camera } from "lucide-react-native";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../lib/upload";
import { authFetch } from "../lib/auth-fetch";

const API_URL = ((Constants.expoConfig?.extra?.apiUrl as string) ?? process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4200").replace(/\/$/, "");

function getToken(): string {
  try {
    if (Platform.OS === "web") return (typeof localStorage !== "undefined" ? localStorage.getItem("bearer_token") : null) ?? "";
    const SecureStore = require("expo-secure-store");
    return SecureStore.getItem("bearer_token") ?? "";
  } catch { return ""; }
}

// Campo reutilizável
function Field({ label, icon: Icon, value, onChangeText, placeholder, keyboardType, autoCapitalize }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "700", color: "#A08060", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, borderWidth: 1.5, borderColor: "#E8D5B7", paddingHorizontal: 14, paddingVertical: 12 }}>
        <Icon size={18} color="#C4B5A0" style={{ marginRight: 10 }} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#C4B5A0"
          keyboardType={keyboardType ?? "default"}
          autoCapitalize={autoCapitalize ?? "sentences"}
          style={{ flex: 1, fontSize: 15, color: "#6B3A2A" }}
        />
      </View>
    </View>
  );
}

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const res = await authFetch(`${API_URL}/api/users/me`, {});
        if (res.ok) {
          const data = await res.json();
          setName(data.user?.name ?? "");
          setEmail(data.user?.email ?? "");
          setPhone(data.user?.phone ?? "");
          setAddress(data.user?.address ?? "");
          setCity(data.user?.city ?? "");
          setPhotoUrl(data.user?.photoUrl ?? null);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  async function doUploadPhoto(asset: ImagePicker.ImagePickerAsset) {
    setUploadingPhoto(true);
    try {
      console.log("[edit-profile] A fazer upload:", asset.uri, asset.mimeType);
      const url = await uploadImage(asset.uri, asset.mimeType ?? "image/jpeg");
      console.log("[edit-profile] Upload ok:", url?.slice(0, 60));
      setPhotoUrl(url);
      const token = getToken();
      const saveRes = await authFetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: url }),
      });
      if (!saveRes.ok) {
        const txt = await saveRes.text().catch(() => "");
        console.warn("[edit-profile] Guardar foto falhou:", saveRes.status, txt);
      }
    } catch (e: any) {
      console.error("[edit-profile] Erro upload:", e?.message);
      Alert.alert("Erro ao carregar foto 😿", e?.message ?? "Tente novamente.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function pickPhoto() {
    Alert.alert("Alterar foto 📸", "Escolhe uma opção:", [
      {
        text: "📷 Tirar foto",
        onPress: async () => {
          try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              Alert.alert("Permissão necessária", "Precisamos de acesso à câmara.");
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (result.canceled || !result.assets?.[0]) return;
            await doUploadPhoto(result.assets[0]);
          } catch (e: any) {
            console.error("[edit-profile] Camera err:", e?.message);
            Alert.alert("Erro", "Não foi possível abrir a câmara.");
          }
        },
      },
      {
        text: "🖼️ Escolher da galeria",
        onPress: async () => {
          try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              Alert.alert("Permissão necessária", "Precisamos de acesso à galeria.");
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (result.canceled || !result.assets?.[0]) return;
            await doUploadPhoto(result.assets[0]);
          } catch (e: any) {
            console.error("[edit-profile] Gallery err:", e?.message);
            Alert.alert("Erro", "Não foi possível abrir a galeria.");
          }
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  async function save() {
    if (!name.trim()) return Alert.alert("Erro", "O nome é obrigatório.");
    setSaving(true);
    try {
      const token = getToken();
      const res = await authFetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
          city: city.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("Erro ao guardar");
      Alert.alert("✅ Guardado", "Perfil atualizado com sucesso!", [{ text: "OK", onPress: () => router.back() }]);
    } catch {
      Alert.alert("Erro", "Não foi possível guardar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5ECD7" }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 12 }}>
          <TouchableOpacity onPress={() => router.back()}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E8D5B7", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={20} color="#6B3A2A" />
          </TouchableOpacity>
          <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: "#6B3A2A" }}>Editar Perfil</Text>
          <TouchableOpacity onPress={save} disabled={saving}
            style={{ backgroundColor: "#E07A3A", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 6 }}>
            {saving ? <ActivityIndicator color="#fff" size="small" /> : <Save size={16} color="#fff" />}
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Guardar</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#E07A3A" style={{ marginTop: 60 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
            {/* Avatar with change photo button */}
            <View style={{ alignItems: "center", marginBottom: 28 }}>
              <TouchableOpacity onPress={pickPhoto} disabled={uploadingPhoto} style={{ position: "relative" }}>
                {photoUrl ? (
                  <Image
                    source={{ uri: photoUrl }}
                    style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: "#E8D5B7" }}
                  />
                ) : (
                  <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: "#6B3A2A", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#E8D5B7" }}>
                    <Text suppressHighlighting style={{ color: "#fff", fontSize: 36, fontWeight: "700" }}>{name[0]?.toUpperCase() ?? "?"}</Text>
                  </View>
                )}
                {/* Camera badge */}
                <View style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: 14,
                  backgroundColor: "#E07A3A", borderWidth: 2, borderColor: "#F5ECD7",
                  alignItems: "center", justifyContent: "center",
                }}>
                  {uploadingPhoto
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Camera size={14} color="#fff" />
                  }
                </View>
              </TouchableOpacity>
              <Text suppressHighlighting style={{ fontSize: 12, color: "#A08060", marginTop: 8 }}>
                Toque para alterar a foto
              </Text>
            </View>

            <Field label="Nome completo" icon={User} value={name} onChangeText={setName} placeholder="O seu nome" />
            <Field label="Email" icon={Mail} value={email} onChangeText={() => {}} placeholder="email@exemplo.com" keyboardType="email-address" autoCapitalize="none" />
            <Text suppressHighlighting style={{ fontSize: 11, color: "#A08060", marginTop: -10, marginBottom: 16, marginLeft: 2 }}>O email não pode ser alterado aqui</Text>
            <Field label="Telefone" icon={Phone} value={phone} onChangeText={setPhone} placeholder="+351 912 345 678" keyboardType="phone-pad" autoCapitalize="none" />
            <Field label="Morada" icon={MapPin} value={address} onChangeText={setAddress} placeholder="Rua, número, andar" />
            <Field label="Cidade" icon={MapPin} value={city} onChangeText={setCity} placeholder="Lisboa, Porto..." />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
