import { createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "./en.json";
import tr from "./tr.json";

export type Language = "en" | "tr";

const LANGUAGE_KEY = "@insectaid_language";

const translations: Record<Language, typeof en> = { en, tr };

export function t(lang: Language, path: string, vars?: Record<string, string | number>): string {
  const keys = path.split(".");
  let value: any = translations[lang];
  for (const key of keys) {
    if (value === undefined || value === null) return path;
    value = value[key];
  }
  if (typeof value !== "string") return path;
  if (vars) {
    return Object.entries(vars).reduce(
      (str, [k, v]) => str.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v)),
      value
    );
  }
  return value;
}

export function tArray(lang: Language, path: string): string[] {
  const keys = path.split(".");
  let value: any = translations[lang];
  for (const key of keys) {
    if (value === undefined || value === null) return [];
    value = value[key];
  }
  if (Array.isArray(value)) return value;
  return [];
}

export async function loadLanguage(): Promise<Language> {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (saved === "en" || saved === "tr") return saved;
    return "en";
  } catch {
    return "en";
  }
}

export async function saveLanguage(lang: Language): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    console.error("Failed to save language");
  }
}

export interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
  tArray: (path: string) => string[];
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
