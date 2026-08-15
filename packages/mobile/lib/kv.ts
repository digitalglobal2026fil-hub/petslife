import * as SecureStore from "expo-secure-store";

/**
 * Guarda pequenas preferências locais (listas de ids já vistos, etc.).
 *
 * IMPORTANTE: NÃO usar @react-native-async-storage/async-storage neste
 * projecto. Esse pacote não está instalado nem ligado ao lado nativo do
 * Android — o código compilava, mas ao arrancar a app chamava um módulo
 * nativo inexistente (RNCAsyncStorage) e o Android matava a app antes do
 * primeiro ecrã ("abre e fecha"). O expo-secure-store já está instalado e
 * ligado (é o que guarda a sessão), por isso é o armazenamento seguro aqui.
 *
 * Limite prático do SecureStore: ~2 KB por valor. Guardamos apenas listas
 * curtas de ids, por isso cortamos a lista antes de gravar.
 */

function safeKey(key: string) {
  // O SecureStore só aceita letras, números, ".", "-" e "_".
  return key.replace(/[^A-Za-z0-9._-]/g, "_");
}

export async function kvGet(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(safeKey(key));
  } catch {
    return null;
  }
}

export async function kvSet(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(safeKey(key), value);
  } catch {
    /* sem espaço ou sem permissão — não vale a pena rebentar por isto */
  }
}

/** Lê uma lista de ids guardada em JSON. Devolve sempre um array. */
export async function kvGetIds(key: string): Promise<string[]> {
  const raw = await kvGet(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Grava uma lista de ids, ficando apenas com os mais recentes. */
export async function kvSetIds(key: string, ids: string[], keep = 40): Promise<void> {
  await kvSet(key, JSON.stringify(ids.slice(-keep)));
}

/** Indica se a chave já alguma vez foi escrita. */
export async function kvHas(key: string): Promise<boolean> {
  return (await kvGet(key)) !== null;
}
