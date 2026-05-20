"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  const toggle = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/[0.08] text-white/60 hover:text-[#2E7D6F] hover:border-[#2E7D6F]/30 transition-all duration-500 text-[11px] font-medium tracking-wider ${className}`}
      aria-label={`Switch to ${language === "id" ? "English" : "Bahasa Indonesia"}`}
    >
      <Globe className="w-3.5 h-3.5" />
      <span className="uppercase">{language === "id" ? "EN" : "ID"}</span>
    </button>
  );
}
