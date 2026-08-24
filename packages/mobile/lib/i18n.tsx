import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { NativeModules, Platform } from "react-native";
import { T, ORDER } from "./locales/catalog";

/**
 * Tradução da PetsLife.
 *
 * REGRA IMPORTANTE: a chave de tradução é a própria frase em português.
 *   t("Adicionar animal")  ->  "Add pet" / "Añadir mascota" / ...
 *
 * Isto tem duas vantagens grandes:
 *  1. Traduzir um ecrã é só embrulhar as frases em t(), sem inventar nomes.
 *  2. Se faltar uma tradução, aparece o português — nunca um código estranho
 *     tipo "home_title" à frente do utilizador.
 *
 * O idioma é detetado a partir do telemóvel na primeira abertura e pode ser
 * mudado no Perfil. Não usamos nenhuma biblioteca nativa nova de propósito:
 * módulos nativos mal ligados já fizeram a app rebentar no arranque.
 */

export const LANGUAGES = [
  { code: "pt", label: "Português", flag: "🇵🇹", name: "Português (Portugal)" },
  { code: "en", label: "English", flag: "🇬🇧", name: "English" },
  { code: "es", label: "Español", flag: "🇪🇸", name: "Español" },
  { code: "fr", label: "Français", flag: "🇫🇷", name: "Français" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", name: "Deutsch" },
];

export type LangCode = "pt" | "en" | "es" | "fr" | "de";

// Índice de cada idioma dentro do array de traduções ([en, es, de, fr]).
const INDEX: Record<string, number> = {};
ORDER.forEach((code, i) => {
  INDEX[code] = i;
});

const STORE_KEY = "app_lang";

/**
 * Idioma do telemóvel, sem módulos nativos extra.
 * Tenta o Intl (existe no Hermes), depois as definições do Android/iOS.
 */
function detectDeviceLang(): LangCode {
  let raw = "";
  try {
    raw = Intl.DateTimeFormat().resolvedOptions().locale ?? "";
  } catch {
    /* segue para o plano B */
  }
  if (!raw) {
    try {
      if (Platform.OS === "android") {
        raw = (NativeModules as any)?.I18nManager?.localeIdentifier ?? "";
      } else {
        const s = (NativeModules as any)?.SettingsManager?.settings;
        raw = s?.AppleLocale ?? s?.AppleLanguages?.[0] ?? "";
      }
    } catch {
      /* fica vazio */
    }
  }

  const loc = String(raw).toLowerCase().replace("_", "-");
  if (!loc) return "pt";
  if (loc.startsWith("pt")) return "pt";
  if (loc.startsWith("es")) return "es";
  if (loc.startsWith("fr")) return "fr";
  if (loc.startsWith("de")) return "de";
  if (loc.startsWith("en")) return "en";
  // Qualquer outro idioma do mundo cai no inglês, que é o mais provável de
  // ser entendido — nunca em português, que só confundiria.
  return "en";
}

function readStored(): string | null {
  try {
    if (Platform.OS === "web") return localStorage.getItem(STORE_KEY);
  } catch {
    /* ignora */
  }
  return null;
}

async function readStoredAsync(): Promise<string | null> {
  if (Platform.OS === "web") return readStored();
  try {
    const SecureStore = require("expo-secure-store");
    return await SecureStore.getItemAsync(STORE_KEY);
  } catch {
    return null;
  }
}

function writeStored(l: string) {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(STORE_KEY, l);
      return;
    }
    const SecureStore = require("expo-secure-store");
    SecureStore.setItemAsync(STORE_KEY, l).catch(() => {});
  } catch {
    /* ignora */
  }
}

/** Traduz uma frase para um idioma concreto. */
export function translate(pt: string, lang: string): string {
  if (!pt) return pt;
  if (lang === "pt") return pt;
  const i = INDEX[lang];
  if (i === undefined) return pt;
  const row = T[pt];
  if (!row) return pt;
  return row[i] || pt;
}

// Idioma actual guardado ao nível do módulo, para as funções fora de
// componentes React (alertas em lib/, mensagens de erro, etc.).
// É definido logo no arranque para que qualquer constante criada no topo de
// um ficheiro (listas de categorias, etc.) já apanhe o idioma certo.
function initialLang(): LangCode {
  try {
    if (Platform.OS === "web") {
      const w = readStored();
      if (w && LANGUAGES.some((l) => l.code === w)) return w as LangCode;
    } else {
      const SecureStore = require("expo-secure-store");
      const saved = SecureStore.getItem?.(STORE_KEY);
      if (saved && LANGUAGES.some((l) => l.code === saved)) return saved as LangCode;
    }
  } catch {
    /* segue para a detecção automática */
  }
  try {
    return detectDeviceLang();
  } catch {
    return "pt";
  }
}

let currentLang: LangCode = initialLang();

/** Traduzir fora de um componente React. */
export function tr(pt: string): string {
  return translate(pt, currentLang);
}

/** Idioma actual, para quem precisar (formatar datas, por exemplo). */
export function getLang(): LangCode {
  return currentLang;
}

/** Locale para datas e números: pt -> pt-PT, en -> en-GB... */
export function getLocale(): string {
  const map: Record<string, string> = {
    pt: "pt-PT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE",
  };
  return map[currentLang] ?? "pt-PT";
}

type LangContextType = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (pt: string) => string;
  ready: boolean;
};

const LangContext = createContext<LangContextType>({
  lang: "pt",
  setLang: () => {},
  t: (pt) => pt,
  ready: true,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Começa já no idioma do telemóvel para não haver um piscar em português.
  const [lang, setLangState] = useState<LangCode>(() => currentLang);
  const [ready, setReady] = useState(false);

  // Se a pessoa já escolheu um idioma no Perfil, essa escolha manda.
  useEffect(() => {
    (async () => {
      const saved = await readStoredAsync();
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        currentLang = saved as LangCode;
        setLangState(saved as LangCode);
      }
      setReady(true);
    })();
  }, []);

  const setLang = useCallback((l: LangCode) => {
    currentLang = l;
    setLangState(l);
    writeStored(l);
  }, []);

  const t = useCallback((pt: string) => translate(pt, lang), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, ready }), [lang, setLang, t, ready]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Atalho mais curto para os ecrãs: const t = useT(); */
export function useT() {
  return useContext(LangContext).t;
}
