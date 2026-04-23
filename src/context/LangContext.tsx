"use client";

import translations from "../assets/translation.json";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Types
type Lang = "en" | "ta";
type TranslationKey = keyof typeof translations.en;

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const STORAGE_KEY = "tamilinai_lang";

// Context
const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;

    if (saved === "en" || saved === "ta") {
      setTimeout(() => setLangState(saved), 0);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: TranslationKey): string =>
    translations[lang][key] || translations["en"][key] || key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

// Hook 
export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}