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

// IMPORTANT: honoClient.api is a Proxy that dynamically resolves routes
// (api.pets, api.businesses, etc.) on property access. Spreading it with
// {...honoClient.api} only copies real enumerable own properties, which the
// Proxy doesn't have — this silently produced an object with NONE of the
// route methods, causing "Cannot read property '$post' of undefined" in
// production for every screen that calls api.<resource>.$post/$get.
// Export the proxy directly instead of spreading it.
export const api = honoClient.api;

