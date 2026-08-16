import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

/**
 * Escolha de imagem com opção clara entre "foto inteira" e "recortar".
 *
 * Antes a app abria sempre o ecrã de recorte do Android e muita gente não
 * percebia que estava a cortar a imagem — ficavam com metade do documento.
 * Agora aparece um menu com três opções e o recorte só acontece se for
 * escolhido de propósito.
 */

export type PickedImage = {
  uri: string;
  mimeType: string;
};

type Options = {
  /** Título do menu. */
  title?: string;
  /** Permitir tirar foto com a câmara. Por omissão sim. */
  allowCamera?: boolean;
  /** Proporção do recorte, quando a pessoa escolher recortar. */
  aspect?: [number, number];
  /** Qualidade da imagem (0 a 1). */
  quality?: number;
  /** Incluir PDFs e outros ficheiros além de imagens. */
  allowAllMedia?: boolean;
  /** Mostrar o passo "Usar esta foto?" no fim. Por omissão sim. */
  confirm?: boolean;
};

function toPicked(result: ImagePicker.ImagePickerResult): PickedImage | null {
  if (result.canceled || !result.assets?.length) return null;
  const asset = result.assets[0];
  return { uri: asset.uri, mimeType: asset.mimeType ?? "image/jpeg" };
}

async function fromLibrary(edit: boolean, o: Options): Promise<PickedImage | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert("Permissão necessária", "Permita o acesso à galeria nas definições do telemóvel.");
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: o.allowAllMedia
      ? ImagePicker.MediaTypeOptions.All
      : ImagePicker.MediaTypeOptions.Images,
    allowsEditing: edit,
    ...(edit && o.aspect ? { aspect: o.aspect } : {}),
    quality: o.quality ?? 0.85,
  });
  return toPicked(result);
}

async function fromCamera(o: Options): Promise<PickedImage | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    Alert.alert("Permissão necessária", "Permita o acesso à câmara nas definições do telemóvel.");
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({ quality: o.quality ?? 0.85 });
  return toPicked(result);
}

/**
 * Depois de escolher a foto pergunta se é para usar.
 *
 * O ecrã preto de recorte é do próprio Android e não dá para lhe acrescentar
 * botões. Muita gente não percebia onde carregar para a foto seguir para o
 * álbum ou para a foto de perfil — este passo resolve isso com um "Usar esta
 * foto" bem claro, e ainda deixa escolher outra sem sair do sítio.
 */
function confirmPicked(img: PickedImage, o: Options): Promise<PickedImage | null> {
  return new Promise((resolve) => {
    Alert.alert(
      "Usar esta foto?",
      "Carregue em «Usar esta foto» para a guardar. Se não for esta, pode escolher outra.",
      [
        { text: "Escolher outra", onPress: () => pickImageWithChoice(o).then(resolve) },
        { text: "Cancelar", style: "cancel", onPress: () => resolve(null) },
        { text: "Usar esta foto", onPress: () => resolve(img) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });
}

/** Aplica o passo de confirmação, se estiver ligado. */
function finish(
  img: PickedImage | null,
  o: Options,
  resolve: (v: PickedImage | null) => void,
) {
  if (!img) return resolve(null);
  if (o.confirm === false) return resolve(img);
  confirmPicked(img, o).then(resolve);
}

/**
 * Mostra o menu e devolve a imagem escolhida (ou null se desistir).
 */
export function pickImageWithChoice(o: Options = {}): Promise<PickedImage | null> {
  return new Promise((resolve) => {
    const buttons: any[] = [];

    if (o.allowCamera !== false) {
      buttons.push({
        text: "Tirar foto agora",
        onPress: () => fromCamera(o).then((r) => finish(r, o, resolve)).catch(() => resolve(null)),
      });
    }

    buttons.push({
      text: "Usar foto da galeria (sem cortar)",
      onPress: () => fromLibrary(false, o).then((r) => finish(r, o, resolve)).catch(() => resolve(null)),
    });

    buttons.push({
      text: "Cortar foto antes de usar",
      onPress: () => fromLibrary(true, o).then((r) => finish(r, o, resolve)).catch(() => resolve(null)),
    });

    buttons.push({ text: "Cancelar", style: "cancel", onPress: () => resolve(null) });

    Alert.alert(
      o.title ?? "Adicionar imagem",
      "Escolha «imagem inteira» para guardar a foto tal como está, sem cortar nada.",
      buttons,
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });
}
