import { Alert, Platform, Share } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

/**
 * Partilhar e imprimir imagens da app (fotos dos animais, documentos,
 * caderneta de vacinas, QR code, cartaz de animal perdido).
 *
 * A impressão usa o menu normal do Android/iOS — a pessoa escolhe a
 * impressora ou "Guardar como PDF".
 */

function isRemote(uri: string) {
  return /^https?:\/\//i.test(uri);
}

function extOf(uri: string) {
  const m = uri.split("?")[0].match(/\.(jpe?g|png|webp|heic|pdf)$/i);
  return m ? m[1].toLowerCase() : "jpg";
}

/** Descarrega a imagem para um ficheiro local, se for preciso. */
async function toLocalFile(uri: string, name = "petslife"): Promise<string> {
  if (!isRemote(uri)) return uri;
  const dir = (FileSystem as any).cacheDirectory ?? "";
  const target = `${dir}${name}-${Date.now()}.${extOf(uri)}`;
  const res = await FileSystem.downloadAsync(uri, target);
  return res.uri;
}

/** Converte a imagem em data URL base64 (necessário para imprimir). */
async function toDataUrl(uri: string): Promise<string> {
  if (uri.startsWith("data:")) return uri;
  const local = await toLocalFile(uri);
  const b64 = await FileSystem.readAsStringAsync(local, { encoding: "base64" as any });
  const ext = extOf(local);
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${b64}`;
}

/** Partilhar uma imagem por WhatsApp, email, redes sociais, etc. */
export async function shareImage(uri?: string | null, message?: string) {
  try {
    if (!uri) {
      Alert.alert("Sem imagem", "Não há imagem para partilhar.");
      return;
    }
    if (uri.startsWith("data:")) {
      // Guardar o base64 num ficheiro para poder ser partilhado
      const b64 = uri.split(",")[1] ?? "";
      const dir = (FileSystem as any).cacheDirectory ?? "";
      const path = `${dir}petslife-${Date.now()}.png`;
      await FileSystem.writeAsStringAsync(path, b64, { encoding: "base64" as any });
      uri = path;
    }
    const local = await toLocalFile(uri);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(local, {
        dialogTitle: message ?? "Partilhar imagem",
        mimeType: extOf(local) === "png" ? "image/png" : "image/jpeg",
      });
      return;
    }
    await Share.share(Platform.OS === "ios" ? { url: local, message } : { message: message ?? local });
  } catch (e: any) {
    Alert.alert("Não foi possível partilhar", e?.message ?? "Tente novamente.");
  }
}

/** Imprimir uma imagem (ou guardar em PDF) usando o menu do sistema. */
export async function printImage(uri?: string | null, title?: string) {
  try {
    if (!uri) {
      Alert.alert("Sem imagem", "Não há imagem para imprimir.");
      return;
    }
    const dataUrl = await toDataUrl(uri);
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" />
      <style>
        @page { margin: 24px; }
        body { margin: 0; font-family: -apple-system, Roboto, sans-serif; text-align: center; }
        h1 { font-size: 20px; color: #6B3A2A; margin: 0 0 12px; }
        img { max-width: 100%; max-height: 88vh; object-fit: contain; }
        .rodape { margin-top: 14px; font-size: 11px; color: #999; }
      </style></head>
      <body>
        ${title ? `<h1>${title}</h1>` : ""}
        <img src="${dataUrl}" />
        <div class="rodape">PetsLife</div>
      </body></html>`;
    await Print.printAsync({ html });
  } catch (e: any) {
    Alert.alert("Não foi possível imprimir", e?.message ?? "Tente novamente.");
  }
}

/** Imprimir várias imagens de uma vez (ex: caderneta de vacinas, documentos). */
export async function printImages(uris: (string | null | undefined)[], title?: string) {
  try {
    const valid = uris.filter(Boolean) as string[];
    if (!valid.length) {
      Alert.alert("Sem imagens", "Não há imagens para imprimir.");
      return;
    }
    const dataUrls: string[] = [];
    for (const u of valid) {
      try {
        dataUrls.push(await toDataUrl(u));
      } catch {}
    }
    if (!dataUrls.length) {
      Alert.alert("Sem imagens", "Não foi possível preparar as imagens.");
      return;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" />
      <style>
        @page { margin: 24px; }
        body { margin: 0; font-family: -apple-system, Roboto, sans-serif; text-align: center; }
        h1 { font-size: 20px; color: #6B3A2A; margin: 0 0 12px; }
        .pag { page-break-after: always; }
        img { max-width: 100%; max-height: 88vh; object-fit: contain; }
        .rodape { font-size: 11px; color: #999; margin-top: 10px; }
      </style></head>
      <body>
        ${title ? `<h1>${title}</h1>` : ""}
        ${dataUrls.map((d) => `<div class="pag"><img src="${d}" /><div class="rodape">PetsLife</div></div>`).join("")}
      </body></html>`;
    await Print.printAsync({ html });
  } catch (e: any) {
    Alert.alert("Não foi possível imprimir", e?.message ?? "Tente novamente.");
  }
}
