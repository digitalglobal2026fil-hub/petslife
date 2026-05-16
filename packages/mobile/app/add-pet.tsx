import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Camera, Dog, Cat, Bird, Rabbit } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { api } from "../lib/api";

const SPECIES = [
  { key: "dog", label: "Cão", icon: Dog, emoji: "🐕" },
  { key: "cat", label: "Gato", icon: Cat, emoji: "🐱" },
  { key: "bird", label: "Pássaro", icon: Bird, emoji: "🦜" },
  { key: "rabbit", label: "Coelho", icon: Rabbit, emoji: "🐰" },
  { key: "other", label: "Outro", icon: Dog, emoji: "🐾" },
];

const GENDERS = [
  { key: "male", label: "Macho" },
  { key: "female", label: "Fêmea" },
];

const Input = ({ label, value, onChangeText, placeholder, keyboardType, maxLength }: any) => (
  <View style={{ marginBottom: 14 }}>
    <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType ?? "default"}
      maxLength={maxLength}
      placeholderTextColor="#9CA3AF"
      style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 16, padding: 14, fontSize: 15, color: "#1A1A2E" }}
    />
  </View>
);

export default function AddPetScreen() {
  const router = useRouter();
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("male");
  const [birthDate, setBirthDate] = useState("");
  const [microchip, setMicrochip] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  async function pickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert("Permissão necessária", "Permite o acesso à galeria nas definições.");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (result.canceled) return;
    const asset = result.assets[0];
    setPhoto(asset.uri);
    setUploadingPhoto(true);
    try {
      const filename = asset.uri.split("/").pop() ?? "photo.jpg";
      const presignRes = await (api as any).upload.presign.$post({ json: { filename, contentType: asset.mimeType ?? "image/jpeg" } });
      const { presignedUrl, publicUrl } = await presignRes.json();
      const blob = await (await fetch(asset.uri)).blob();
      await fetch(presignedUrl, { method: "PUT", body: blob, headers: { "Content-Type": asset.mimeType ?? "image/jpeg" } });
      setPhotoUrl(publicUrl);
    } catch {
      Alert.alert("Erro", "Não foi possível fazer upload da foto.");
      setPhoto(null);
    } finally {
      setUploadingPhoto(false);
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.pets.$post({
        json: { name, species, breed: breed || undefined, gender, birthDate: birthDate || undefined, microchip: microchip || undefined, notes: notes || undefined, photoUrl: photoUrl || undefined },
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pets"] });
      router.back();
    },
    onError: (e: any) => Alert.alert("Erro", e.message ?? "Não foi possível adicionar o animal."),
  });

  function handleSubmit() {
    if (!name.trim()) return Alert.alert("Erro", "O nome é obrigatório.");
    mutation.mutate();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <ChevronLeft size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <Text suppressHighlighting style={{ fontSize: 20, fontWeight: "800", color: "#1A1A2E" }}>Adicionar Animal</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingTop: 4 }}>
        {/* Photo */}
        <TouchableOpacity onPress={pickPhoto} style={{ alignSelf: "center", width: 100, height: 100, borderRadius: 50, backgroundColor: "#fff", borderWidth: 2, borderColor: "#F0E8E0", borderStyle: photo ? "solid" : "dashed", alignItems: "center", justifyContent: "center", marginBottom: 24, overflow: "hidden" }}>
          {photo ? (
            <>
              <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 50 }} />
              {uploadingPhoto && (
                <View style={{ position: "absolute", backgroundColor: "rgba(0,0,0,0.4)", width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}
            </>
          ) : (
            <>
              <Camera size={28} color="#FF6B35" />
              <Text suppressHighlighting style={{ color: "#FF6B35", fontSize: 11, fontWeight: "600", marginTop: 4 }}>Adicionar foto</Text>
            </>
          )}
        </TouchableOpacity>

        <Input label="Nome *" value={name} onChangeText={setName} placeholder="Ex: Bola, Luna..." />

        {/* Species selector */}
        <View style={{ marginBottom: 14 }}>
          <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 8 }}>Espécie *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {SPECIES.map((s) => (
              <TouchableOpacity key={s.key} onPress={() => setSpecies(s.key)}
                style={{ alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: species === s.key ? "#FF6B35" : "#fff", borderWidth: 1.5, borderColor: species === s.key ? "#FF6B35" : "#F0E8E0", gap: 4 }}>
                <Text suppressHighlighting style={{ fontSize: 22 }}>{s.emoji}</Text>
                <Text suppressHighlighting style={{ fontSize: 12, fontWeight: "600", color: species === s.key ? "#fff" : "#1A1A2E" }}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Gender */}
        <View style={{ marginBottom: 14 }}>
          <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 8 }}>Sexo</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {GENDERS.map((g) => (
              <TouchableOpacity key={g.key} onPress={() => setGender(g.key)}
                style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: gender === g.key ? "#FF6B35" : "#fff", borderWidth: 1.5, borderColor: gender === g.key ? "#FF6B35" : "#F0E8E0", alignItems: "center" }}>
                <Text suppressHighlighting style={{ fontWeight: "600", color: gender === g.key ? "#fff" : "#1A1A2E" }}>{g.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input label="Raça" value={breed} onChangeText={setBreed} placeholder="Ex: Labrador, Siamês..." />
        <Input label="Data de nascimento" value={birthDate} onChangeText={setBirthDate} placeholder="YYYY-MM-DD" />
        <Input label="Nº Microchip" value={microchip} onChangeText={setMicrochip} placeholder="Ex: 620098123456789" keyboardType="numeric" maxLength={20} />

        <View style={{ marginBottom: 14 }}>
          <Text suppressHighlighting style={{ fontSize: 13, fontWeight: "600", color: "#1A1A2E", marginBottom: 6 }}>Notas</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Alergias, condições especiais..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", borderRadius: 16, padding: 14, fontSize: 15, color: "#1A1A2E", minHeight: 90, textAlignVertical: "top" }}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={mutation.isPending}
          style={{ backgroundColor: "#FF6B35", borderRadius: 18, padding: 17, alignItems: "center", marginTop: 8, opacity: mutation.isPending ? 0.7 : 1 }}>
          {mutation.isPending ? <ActivityIndicator color="#fff" /> : <Text suppressHighlighting style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Guardar Animal</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
