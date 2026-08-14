import re
p = 'packages/mobile/app/pet/[id]/index.tsx'
s = open(p).read()

# imports
s = s.replace(
  'import { ChevronLeft, QrCode, Syringe, Calendar, FileText, MapPin, Trash2, PawPrint, Camera, Share2 } from "lucide-react-native";',
  'import { ChevronLeft, QrCode, Syringe, Calendar, FileText, MapPin, Trash2, PawPrint, Camera, Share2 } from "lucide-react-native";\nimport { useState } from "react";\nimport { uploadImage, pickFromGallery, takePhoto } from "../../../lib/upload";'
)

# state + handler, inserted after qc declaration
anchor = '  const qc = useQueryClient();\n'
assert anchor in s
handler = '''  const qc = useQueryClient();
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
'''
s = s.replace(anchor, handler, 1)

# avatar -> tappable
old_avatar = '''          <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: "#fff", shadowColor: "#FF6B35", shadowOpacity: 0.3, shadowRadius: 16, elevation: 0 }}>
            {pet.photoUrl ? (
              <Image source={{ uri: pet.photoUrl }} style={{ width: 110, height: 110, borderRadius: 55 }} />
            ) : (
              <PetIllustration species={pet.species} size={86} />
            )}
          </View>'''
new_avatar = '''          <TouchableOpacity activeOpacity={0.85} onPress={changePhoto} disabled={savingPhoto}
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
          </Text>'''
assert old_avatar in s
s = s.replace(old_avatar, new_avatar)
s = s.replace('color: "#1A1A2E", marginTop: 12 }}>{pet.name}', 'color: "#1A1A2E", marginTop: 6 }}>{pet.name}')

open(p, 'w').write(s)
print("ok")
