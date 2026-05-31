import { hc } from "hono/client";
import Constants from "expo-constants";
import { Platform } from "react-native";
import type { AppType } from "@template/web";

const TOKEN_KEY = "bearer_token";

function getToken(): string {
  if (Platform.OS === "web") {
    return (typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null) ?? "";
  }
  try {
    const SecureStore = require("expo-secure-store");
    return SecureStore.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export const BASE_URL = (
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  "http://localhost:4200"
).replace(/\/$/, "");

// Typed Hono client for known endpoints
const honoClient = hc<AppType>(BASE_URL + "/");

// Generic fetch helper
const apiFetch = {
  get: async (path: string) => {
    const url = `${BASE_URL}/api${path}`;
    const token = getToken();
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return { data };
  },

  post: async (path: string, body: unknown) => {
    const url = `${BASE_URL}/api${path}`;
    const token = getToken();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return { data };
  },
};

// Export combined API — Hono typed client routes + generic helpers
export const api = {
  ...honoClient.api,
  get: apiFetch.get,
  post: apiFetch.post,
} as typeof honoClient.api & typeof apiFetch;
