import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, FlatList, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, Trash2, Camera, Upload } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../../lib/api";
import { uploadImage } from "../../../lib/upload";

const COLS = 3;
const SIZE = (Dimensions.get("window").width - 40 - (COLS - 1) * 4) / COLS;

async function uploadFile(uri: string, filename: string, mimeType: string): Promise<string> {
  return uploadImage(uri, mimeType ?? "image/jpeg");
}

export default function PetPhotosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["photos", id],
    queryFn: async () => (await (api as any).photos["pet"][":petId"].$get({ param: { petId: id } })).json(),
    enabled: !!id,
  });
  const photos: any[] = (data as any)?.photos ?? [];

  const deleteMutation = useMutation({
    mutationFn: async (photoId: string) => (await (api as any).photos[":id"].$delete({ param: { id: photoId } })).json(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["photos", id] });
      setSelectedPhoto(null);
    },
    onError: (e: any) => Alert.alert("Erro", e.message),
  });

  const addPhoto = async (fromCamera: boolean) => {
    let result;
    if (fromCamera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return Alert.alert("Permissão necessária", "Ative o acesso à câmara.");
      result = await ImagePicker.launchCameraAsync({ quality: 0.85, allowsEditing: true });
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return Alert.alert("Permissão necessária", "Ative o acesso à galeria.");
      result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.85, allowsMultipleSelection: true });
    }
    if (result.canceled) return;

    setUploading(true);
    try {
      const assets = result.assets;
      for (const asset of assets) {
        const filename = asset.uri.split("/").pop() ?? `photo_${Date.now()}.jpg`;
        const url = await uploadFile(asset.uri, filename, asset.mimeType ?? "image/jpeg");
        await (api as any).photos.$post({ json: { petId: id, url, caption: "" } });
      }
      qc.invalidateQueries({ queryKey: ["photos", id] });
    } catch (e: any) {
      Alert.alert("Erro no upload", e.message ?? "Não foi possível carregar a foto.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={20} color="#1A1A2E" />
          </TouchableOpacity>
          <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>Álbum de Fotos 📸</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity onPress={() => addPhoto(true)} disabled={uploading}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFF0EB", borderWidth: 1.5, borderColor: "#FFD5C2", alignItems: "center", justifyContent: "center" }}>
            <Camera size={18} color="#FF6B35" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addPhoto(false)} disabled={uploading}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#E8FAF9", borderWidth: 1.5, borderColor: "#A7F3D0", alignItems: "center", justifyContent: "center" }}>
            <Upload size={18} color="#4ECDC4" />
          </TouchableOpacity>
        </View>
      </View>

      {uploading && (
        <View style={{ backgroundColor: "#FFF0EB", padding: 12, marginHorizontal: 20, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <ActivityIndicator color="#FF6B35" size="small" />
          <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "600" }}>A carregar foto...</Text>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator color="#FF6B35" size="large" style={{ marginTop: 60 }} />
      ) : photos.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 40 }}>
          <Text suppressHighlighting style={{ fontSize: 60, marginBottom: 16 }}>📷</Text>
          <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "700", color: "#1A1A2E", marginBottom: 8 }}>Álbum vazio</Text>
          <Text suppressHighlighting style={{ color: "#9CA3AF", textAlign: "center", lineHeight: 22, marginBottom: 24 }}>
            Adicione fotos do seu animal para criar memórias especiais.
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity onPress={() => addPhoto(true)}
              style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FF6B35", borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12 }}>
              <Camera size={18} color="#fff" />
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700" }}>Câmara</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addPhoto(false)}
              style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12, borderWidth: 1.5, borderColor: "#F0E8E0" }}>
              <Upload size={18} color="#4ECDC4" />
              <Text suppressHighlighting style={{ color: "#1A1A2E", fontWeight: "700" }}>Galeria</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Text suppressHighlighting style={{ color: "#9CA3AF", fontSize: 12, marginHorizontal: 20, marginBottom: 10 }}>
            {photos.length} {photos.length === 1 ? "foto" : "fotos"}
          </Text>
          <FlatList
            data={photos}
            numColumns={COLS}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            columnWrapperStyle={{ gap: 4, marginBottom: 4 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedPhoto(item)} style={{ width: SIZE, height: SIZE, borderRadius: 10, overflow: "hidden" }}>
                <Image source={{ uri: item.url }} style={{ width: SIZE, height: SIZE }} resizeMode="cover" />
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* Foto em grande */}
      {selectedPhoto && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.92)", alignItems: "center", justifyContent: "center" }}>
          <Image source={{ uri: selectedPhoto.url }} style={{ width: "100%", height: "70%", resizeMode: "contain" }} />
          <View style={{ flexDirection: "row", gap: 16, marginTop: 24 }}>
            <TouchableOpacity onPress={() => setSelectedPhoto(null)}
              style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 }}>
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700" }}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert("Eliminar foto?", "Esta ação não pode ser desfeita.", [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => deleteMutation.mutate(selectedPhoto.id) },
              ])}
              style={{ backgroundColor: "#EF4444", borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Trash2 size={16} color="#fff" />
              <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700" }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
