import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, FlatList, Dimensions } from "react-native";
const MASCOT_HAPPY = require("../../assets/mascot-happy_1784664046237.png");
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Camera, ChevronRight, Image as ImageIcon } from "lucide-react-native";
import { api } from "../../lib/api";
import { useLang, tr } from "../../lib/i18n";
import { AnimalFact } from "../../components/AnimalFact";
import { PetIllustration } from "../../components/PetIllustration";

// Álbum usa um tom azul médio, diferente das outras páginas
const BG = "#F0F6FF";
const BROWN = "#1E3A5F";
const ORANGE = "#4A7FC9";
const CARD = "#FFFFFF";
const BORDER = "#DCE8FA";
const GRAY = "#7B93B3";
const ICON_BG = "#E0EDFF";

const THUMB_SIZE = (Dimensions.get("window").width - 40 - 8) / 3;

function petEmoji(species: string) {
  if (species === "cat") return "🐱";
  if (species === "bird") return "🦜";
  if (species === "rabbit") return "🐰";
  return "🐕";
}

function PetAlbumCard({ pet }: { pet: any }) {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["photos", pet.id],
    queryFn: async () => (await (api as any).photos["pet"][":petId"].$get({ param: { petId: pet.id } })).json(),
    enabled: !!pet.id,
  });
  const photos: any[] = (data as any)?.photos ?? [];
  const preview = photos.slice(0, 3);
  const count = photos.length;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/pet/${pet.id}/photos` as any)}
      activeOpacity={0.85}
      style={{
        backgroundColor: CARD,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: BORDER,
        marginBottom: 14,
        overflow: "hidden",
        shadowColor: BROWN,
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 0,
      }}
    >
      {/* Preview strip */}
      <View style={{ flexDirection: "row", height: 110 }}>
        {preview.length === 0 ? (
          <View style={{ flex: 1, backgroundColor: ICON_BG, alignItems: "center", justifyContent: "center" }}>
            <Camera size={32} color={ORANGE} style={{ marginBottom: 4 }} />
            <Text suppressHighlighting style={{ color: GRAY, fontSize: 12, fontWeight: "600" }}>{tr("Sem fotos ainda")}</Text>
          </View>
        ) : (
          preview.map((p: any, i: number) => (
            <Image
              key={p.id}
              source={{ uri: p.url }}
              style={{ flex: 1, marginLeft: i > 0 ? 2 : 0 }}
              resizeMode="cover"
            />
          ))
        )}
        {count > 3 && (
          <View style={{ position: "absolute", right: 8, bottom: 8, backgroundColor: "rgba(107,58,42,0.75)", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>+{count - 3}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: ICON_BG, alignItems: "center", justifyContent: "center" }}>
          <PetIllustration species={pet.species} size={32} />
        </View>
        <View style={{ flex: 1 }}>
          <Text suppressHighlighting style={{ fontSize: 15, fontWeight: "800", color: BROWN }}>{pet.name}</Text>
          <Text suppressHighlighting style={{ fontSize: 12, color: GRAY, marginTop: 1 }}>
            {count === 0 ? "Sem fotos" : `${count} foto${count !== 1 ? "s" : ""}`}
          </Text>
        </View>
        <ChevronRight size={18} color={GRAY} />
      </View>
    </TouchableOpacity>
  );
}

export default function PhotosTabScreen() {
  const router = useRouter();
  const { t } = useLang();

  const { data: petsData, isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => (await api.pets.$get()).json(),
  });
  const pets: any[] = (petsData as any)?.pets ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{
        backgroundColor: ORANGE, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28,
        borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 8,
      }}>
        <View style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.1)" }} />
        <Text suppressHighlighting style={{ fontSize: 26, fontWeight: "900", color: "#fff" }}>{tr("Álbum")}</Text>
        <Text suppressHighlighting style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 2 }}>{tr("As memórias dos teus animais")}</Text>
      </View>

      {/* Curiosidade animal */}
      <AnimalFact seed={11} style={{ marginHorizontal: 20, marginBottom: 12 }} compact />

      {isLoading ? (
        <ActivityIndicator color={ORANGE} size="large" style={{ marginTop: 60 }} />
      ) : pets.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 40 }}>
          <Image source={MASCOT_HAPPY} style={{ width: 180, height: 180, marginBottom: 8 }} resizeMode="contain" />
          <Text suppressHighlighting style={{ fontSize: 18, fontWeight: "800", color: BROWN, marginBottom: 8 }}>{tr("Sem animais")}</Text>
          <Text suppressHighlighting style={{ color: GRAY, fontSize: 14, textAlign: "center", lineHeight: 22 }}>
            Adiciona o teu primeiro animal para começar a criar memórias!
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/add-pet" as any)}
            style={{ marginTop: 24, backgroundColor: BROWN, borderRadius: 16, paddingHorizontal: 24, paddingVertical: 14 }}
          >
            <Text suppressHighlighting style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{tr("Adicionar animal")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        >
          {pets.map((pet: any) => (
            <PetAlbumCard key={pet.id} pet={pet} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
