import * as FileSystem from "expo-file-system/legacy";
import Constants from "expo-constants";
import { Platform, Alert } from "react-native";
import { authFetch } from "./auth-fetch";

const API_URL = (
  (Constants.expoConfig?.extra?.apiUrl as string) ??
  process.env.EXPO_PUBLIC_API_URL ??
  "http://localhost:4200"
).replace(/\/$/, "");

/**
 * Compress an image URI using expo-image-manipulator (if available),
 * then upload as base64 to /api/upload/image.
 * Returns the data URL from the server.
 */
export async function uploadImage(
  uri: string,
  mimeType?: string,
  _unused?: string
): Promise<string> {
  // NÃO exigir um token aqui: a sessão da app também é válida por cookie.
  // Antes, se o token não estivesse guardado, isto abortava com
  // "Sessão expirada" mesmo estando a utilizadora com sessão activa.
  console.log("[upload] START uri=", uri?.slice(0, 60));

  let finalUri = uri;
  let finalMime = mimeType ?? "image/jpeg";

  // iOS: ensure file:// prefix
  if (
    Platform.OS === "ios" &&
    finalUri &&
    !finalUri.startsWith("file://") &&
    !finalUri.startsWith("http") &&
    !finalUri.startsWith("data:")
  ) {
    finalUri = "file://" + finalUri;
  }

  // Try to compress — graceful fallback if it fails
  if (Platform.OS !== "web") {
    try {
      const ImageManipulator = require("expo-image-manipulator");
      const compressed = await ImageManipulator.manipulateAsync(
        finalUri,
        [{ resize: { width: 900 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      finalUri = compressed.uri;
      finalMime = "image/jpeg";
      console.log("[upload] Compressed ok:", finalUri.slice(0, 60));
    } catch (compErr) {
      console.warn("[upload] Compress failed, using original:", compErr);
    }
  }

  // Read as base64
  let base64: string;
  try {
    if (Platform.OS === "web") {
      const resp = await fetch(finalUri);
      const blob = await resp.blob();
      base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      const info = await FileSystem.getInfoAsync(finalUri).catch(() => null);
      if (info && !info.exists) {
        throw new Error("Ficheiro não encontrado: " + finalUri.slice(0, 60));
      }
      base64 = await FileSystem.readAsStringAsync(finalUri, {
        encoding: "base64" as any,
      });
    }
  } catch (readErr: any) {
    console.error("[upload] Read error:", readErr?.message);
    throw new Error("Erro ao ler imagem: " + (readErr?.message ?? "desconhecido"));
  }

  console.log("[upload] base64 length:", base64.length, "mime:", finalMime);

  if (!base64 || base64.length < 100) {
    throw new Error("Imagem inválida ou vazia.");
  }

  // POST to server
  let res: Response;
  try {
    res = await authFetch(`${API_URL}/api/upload/image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64, mimeType: finalMime }),
    });
  } catch (netErr: any) {
    console.error("[upload] Network error:", netErr?.message);
    throw new Error("Sem ligação ao servidor. Verifica o teu WiFi.");
  }

  const rawText = await res.text().catch(() => "");

  if (!res.ok) {
    console.error("[upload] Server error:", res.status, rawText.slice(0, 200));
    if (res.status === 401) throw new Error("Sessão expirada. Faz login novamente.");
    if (res.status === 413) throw new Error("Imagem demasiado grande. Tenta uma foto mais pequena.");
    throw new Error(`Upload falhou (${res.status}). Tenta novamente.`);
  }

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error("Resposta inválida do servidor.");
  }

  if (!data.url) throw new Error("URL de imagem não recebida do servidor.");

  console.log("[upload] SUCCESS url:", data.url.slice(0, 60));
  return data.url as string;
}

/**
 * Helper: pick from gallery using ImagePicker.
 * Returns asset or null if cancelled.
 */
export async function pickFromGallery() {
  const ImagePicker = require("expo-image-picker");
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permissão necessária 📷",
      "Precisamos de acesso à galeria para escolher uma foto."
    );
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });
  if (result.canceled || !result.assets?.[0]) return null;
  return result.assets[0];
}

/**
 * Helper: take photo with camera.
 * Returns asset or null if cancelled.
 */
export async function takePhoto(aspect: [number, number] = [1, 1]) {
  const ImagePicker = require("expo-image-picker");
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permissão necessária 📷",
      "Precisamos de acesso à câmara para tirar uma foto."
    );
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect,
    quality: 0.85,
  });
  if (result.canceled || !result.assets?.[0]) return null;
  return result.assets[0];
}
