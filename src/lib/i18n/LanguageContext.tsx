"use client";

import React, { createContext, useContext, useState, useCallback, useSyncExternalStore } from "react";
import idTranslations from "./translations/id.json";
import enTranslations from "./translations/en.json";

export type Language = "id" | "en";

type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = { [key: string]: TranslationValue };

const translationsMap: Record<Language, Translations> = {
  id: idTranslations,
  en: enTranslations,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedValue(obj: Translations, keyPath: string): string {
  const keys = keyPath.split(".");
  let current: TranslationValue = obj;

  for (const key of keys) {
    if (typeof current === "object" && current !== null && key in current) {
      current = current[key];
    } else {
      // Fallback to Indonesian
      let fallback: TranslationValue = translationsMap.id;
      for (const k of keys) {
        if (typeof fallback === "object" && fallback !== null && k in fallback) {
          fallback = fallback[k];
        } else {
          return keyPath; // Return key itself as last resort
        }
      }
      return typeof fallback === "string" ? fallback : keyPath;
    }
  }

  return typeof current === "string" ? current : keyPath;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Read initial language from localStorage using lazy initializer
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jasa-proteksi-lang") as Language | null;
      if (saved && (saved === "id" || saved === "en")) {
        return saved;
      }
    }
    return "id";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("jasa-proteksi-lang", lang);
    // Update HTML lang attribute for SEO
    document.documentElement.lang = lang === "id" ? "id" : "en";
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translationsMap[language], key);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
