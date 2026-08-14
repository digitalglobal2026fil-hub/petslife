import { createAuthClient } from "better-auth/react";
import { Platform } from "react-native";
import Constants from "expo-constants";

const TOKEN_KEY = "bearer_token";
const isWeb = Platform.OS === "web";

function getToken(): string {
  if (isWeb) return localStorage.getItem(TOKEN_KEY) ?? "";
  const SecureStore = require("expo-secure-store");
  return SecureStore.getItem(TOKEN_KEY) ?? "";
}

function setToken(token: string) {
  if (isWeb) return localStorage.setItem(TOKEN_KEY, token);
  const SecureStore = require("expo-secure-store");
  SecureStore.setItem(TOKEN_KEY, token);
}

function removeToken() {
  if (isWeb) return localStorage.removeItem(TOKEN_KEY);
  const SecureStore = require("expo-secure-store");
  // Escrever vazio é SÍNCRONO: o token deixa de ser válido imediatamente.
  // (deleteItemAsync é assíncrono e getToken lê de forma síncrona, pelo que
  // sem isto o token antigo ainda podia ser lido logo após o logout.)
  try { SecureStore.setItem(TOKEN_KEY, ""); } catch {}
  try { SecureStore.deleteItemAsync(TOKEN_KEY); } catch {}
}

export const baseURL =
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL;

export const authClient = createAuthClient({
  baseURL,
  basePath: "/api/auth",
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => getToken(),
    },
  },
});

export function captureToken(ctx: { response: Response }) {
  const token = ctx.response.headers.get("set-auth-token");
  if (token) setToken(token);
}

export function clearToken() {
  removeToken();
}

// Async version for upload.ts compatibility
export async function getTokenAsync(): Promise<string> {
  return getToken();
}
