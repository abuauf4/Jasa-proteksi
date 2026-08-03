"use client";

import { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { trackWhatsAppClick } from "@/lib/analytics-events";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6"];

export default function FAQ() {
  const { t } = useLanguage();
  const { ctaWhatsApp } = useSiteSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#EEF3F8] ds-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-4">
            <div className="ds-accent-line" />
          </div>
          <span className="ds-label text-[#0F766E]">{t("faq.label")}</span>
          <h2 className="ds-h2 text-[#172033] mt-3 sm:mt-4">
            {t("faq.heading")}
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqKeys.map((key, i) => (
            <div
              key={key}
              className={`rounded-xl border overflow-hidden transition-all duration-300 bg-white ${
                openIndex === i
                  ? "border-[#0F766E] shadow-sm"
                  : "border-[#DDE4EC] hover:border-[#0F766E]/30"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left min-h-[48px]"
                aria-expanded={openIndex === i}
              >
                <span className="font-semibold text-sm sm:text-base pr-4 text-[#172033]">
                  {t(`faq.items.${key}.q`)}
                </span>
                <span className="flex-shrink-0 transition-transform duration-300">
                  {openIndex === i ? (
                    <Minus className="w-5 h-5 text-[#0F766E]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#0F766E]" />
                  )}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-[#64748B] text-sm leading-[1.7]">
                  {t(`faq.items.${key}.a`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-[#64748B] mb-5 text-sm sm:text-base">
            {t("faq.stillHaveQuestion")}
          </p>
          <a
            href={ctaWhatsApp ? `https://wa.me/${ctaWhatsApp}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ method: "faq_cta" })}
            className="inline-flex items-center gap-2 text-[#0F766E] font-medium text-sm tracking-wider hover:gap-3 transition-all duration-300 min-h-[40px]"
          >
            <MessageCircle className="w-4 h-4" />
            {t("faq.contactUsDirectly")}
          </a>
        </div>
      </div>
    </section>
  );
}
