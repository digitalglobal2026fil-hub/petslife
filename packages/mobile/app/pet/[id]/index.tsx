import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Share } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, QrCode, Syringe, Calendar, FileText, MapPin, Trash2, PawPrint, Camera, Share2 } from "lucide-react-native";
import { useState } from "react";
import { uploadImage, pickFromGallery, takePhoto } from "../../../lib/upload";
import { api } from "../../../lib/api";
import { PetIllustration } from "../../../components/PetIllustration";
import { netError } from "../../../lib/net-error";

export default function PetDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [savingPhoto, setSavingPhoto] = useState(false);

  async function savePhoto(uri: string | null) {
    try {
      setSavingPhoto(true);
      let url: string | null = null;
      if (uri) url = await uploadImage(uri);
      await api.pets[":id"].$put({ param: { id }, json: { photoUrl: url } } as any);
      await qc.invalidateQueries({ queryKey: ["pet", id] });
      await qc.invalidateQueries({ queryKey: ["pets"] });
    } catch (e: any) {
      Alert.alert("Ups", netError(e, "Não foi possível guardar a foto."));
    } finally {
      setSavingPhoto(false);
    }
  }

  function changePhoto() {
    const opts: any[] = [
      { text: "Tirar foto", onPress: async () => { const r = await takePhoto([1, 1]); if (r?.uri) savePhoto(r.uri); } },
      { text: "Escolher da galeria", onPress: async () => { const r = await pickFromGallery(); if (r?.uri) savePhoto(r.uri); } },
    ];
    if (pet?.photoUrl) opts.push({ text: "Remover foto", style: "destructive", onPress: () => savePhoto(null) });
    opts.push({ text: "Cancelar", style: "cancel" });
    Alert.alert("Foto de perfil", "Escolha a foto do " + (pet?.name ?? "animal") + ":", opts);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => (await api.pets[":id"].$get({ param: { id } })).json(),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => (await api.pets[":id"].$delete({ param: { id } })).json(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pets"] });
      router.back();
    },
    onError: (e: any) => Alert.alert("Ups", netError(e, "Não foi possível eliminar.")),
  });

  function confirmDelete() {
    Alert.alert("Eliminar animal", "Tem a certeza? Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteMutation.mutate() },
    ]);
  }

  async function sharePet() {
    if (!pet) return;
    const link = pet.qrCode ? `https://petslife.onrender.com/pet/${pet.qrCode}` : null;
    const linhas = [
      `Este é o ${pet.name}! 🐾`,
      pet.breed ? `${pet.breed}${age ? ` • ${age}` : ""}` : null,
      pet.microchip ? `Microchip: ${pet.microchip}` : null,
      link ? `\nPerfil completo: ${link}` : null,
      "\nPartilhado com a app PetsLife",
    ].filter(Boolean);
    try {
      await Share.share({ message: linhas.join("\n"), title: pet.name, ...(link ? { url: link } : {}) });
    } catch (e: any) {
      Alert.alert("Ups", netError(e, "Não foi possível partilhar."));
    }
  }

  const pet = (data as any)?.pet;
  const speciesEmoji = pet?.species === "cat" ? "🐱" : pet?.species === "bird" ? "🦜" : pet?.species === "rabbit" ? "🐰" : "🐕";

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#FF6B35" size="large" />
      </SafeAreaView>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5", alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#F5EDE4", borderRadius: 24, padding: 12 }}>
          <PawPrint size={36} color="#8B5E3C" />
        </View>
        <Text suppressHighlighting style={{ color: "#6B7280", marginTop: 8 }}>Animal não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text suppressHighlighting style={{ color: "#FF6B35", fontWeight: "600" }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const age = pet.birthDate
    ? `${Math.floor((Date.now() - new Date(pet.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} anos`
    : null;

  const quickActions = [
    {
      icon: QrCode, label: "QR Code", color: "#8B5CF6", bg: "#F3EEFF",
      onPress: () => {
        if (pet.qrCode) {
          router.push(`/qr/${pet.qrCode}`);
        } else {
          Alert.alert("QR Code", "Este animal ainda não tem QR Code gerado. Tente novamente em breve.");
        }
      },
    },
    {
      icon: Syringe, label: "Saúde", color: "#4ECDC4", bg: "#E8FAF9",
      onPress: () => router.push(`/pet/${id}/health`),
    },
    {
      icon: Camera, label: "Álbum", color: "#FF6B35", bg: "#FFF0EB",
      onPress: () => router.push(`/pet/${id}/photos` as any),
    },
    {
      icon: MapPin, label: "Vets e Outros", color: "#06D6A0", bg: "#E6FAF5",
      onPress: () => router.push("/find-vets"),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F5" }} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#F0E8E0", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={20} color="#1A1A2E" />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity
              onPress={sharePet}
              style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#F3EEFF", borderWidth: 1.5, borderColor: "#E4D9FF", alignItems: "center", justifyContent: "center" }}>
              <Share2 size={18} color="#8B5CF6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmDelete}
              style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFF0EB", borderWidth: 1.5, borderColor: "#FFD5C2", alignItems: "center", justifyContent: "center" }}>
              <Trash2 size={18} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pet hero */}
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <TouchableOpacity activeOpacity={0.85} onPress={changePhoto} disabled={savingPhoto}
            style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: "#fff", shadowColor: "#FF6B35", shadowOpacity: 0.3, shadowRadius: 16, elevation: 0 }}>
            {savingPhoto ? (
              <ActivityIndicator color="#fff" />
            ) : pet.photoUrl ? (
              <Image source={{ uri: pet.photoUrl }} style={{ width: 110, height: 110, borderRadius: 55 }} />
            ) : (
              <PetIllustration species={pet.species} size={86} />
            )}
            <View style={{ position: "absolute", bottom: -2, right: -2, width: 34, height: 34, borderRadius: 17, backgroundColor: "#fff", borderWidth: 2, borderColor: "#FFD5C2", alignItems: "center", justifyContent: "center" }}>
              <Camera size={16} color="#FF6B35" />
            </View>
          </TouchableOpacity>
          <Text suppressHighlighting style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8 }}>
            {savingPhoto ? "A guardar foto..." : "Toque na foto para mudar"}
          </Text>
          <Text suppressHighlighting style={{ fontSize: 26, fontWeight: "800", color: "#1A1A2E", marginTop: 6 }}>{pet.name}</Text>
          <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 14, marginTop: 2 }}>{pet.breed ?? pet.species}{age ? ` • ${age}` : ""}</Text>
          {pet.microchip && (
            <View style={{ backgroundColor: "#F3EEFF", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, marginTop: 8 }}>
              <Text suppressHighlighting style={{ color: "#8B5CF6", fontSize: 11, fontWeight: "600" }}>Microchip: {pet.microchip}</Text>
            </View>
          )}
        </View>

        {/* Quick actions */}
        <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 10, marginBottom: 24 }}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              style={{ flex: 1, backgroundColor: item.bg, borderRadius: 16, paddingVertical: 14, alignItems: "center", gap: 6 }}>
              <item.icon size={20} color={item.color} />
              <Text suppressHighlighting style={{ fontSize: 10, fontWeight: "700", color: "#1A1A2E" }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info card */}
        <View style={{ marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: "#F0E8E0", marginBottom: 20 }}>
          <Text suppressHighlighting style={{ fontSize: 15, fontWeight: "700", color: "#1A1A2E", marginBottom: 14 }}>Informações</Text>
          {[
            { label: "Espécie", value: pet.species },
            { label: "Raça", value: pet.breed },
            { label: "Sexo", value: pet.gender === "male" ? "Macho" : pet.gender === "female" ? "Fêmea" : pet.gender },
            { label: "Nascimento", value: pet.birthDate ? new Date(pet.birthDate).toLocaleDateString("pt-PT") : null },
            { label: "Microchip", value: pet.microchip },
          ].filter((r) => r.value).map((row) => (
            <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F9F5F0" }}>
              <Text suppressHighlighting style={{ color: "#6B7280", fontSize: 14 }}>{row.label}</Text>
              <Text suppressHighlighting style={{ color: "#1A1A2E", fontWeight: "600", fontSize: 14 }}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Notes */}
        {pet.notes && (
          <View style={{ marginHorizontal: 20, backgroundColor: "#FFF9F5", borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: "#F0E8E0", marginBottom: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <FileText size={16} color="#FF6B35" />
              <Text suppressHighlighting style={{ fontSize: 14, fontWeight: "700", color: "#1A1A2E" }}>Notas</Text>
            </View>
            <Text suppressHighlighting style={{ color: "#6B7280", lineHeight: 22 }}>{pet.notes}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
