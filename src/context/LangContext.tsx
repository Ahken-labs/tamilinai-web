"use client";

import translations from "../assets/translation.json";
import { createContext, useContext, useState, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Lang = "en" | "ta";
type TranslationKey = keyof typeof translations.en;

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const LangContext = createContext<LangContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: TranslationKey): string =>
    translations[lang][key] || translations["en"][key] || key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}