"use client";

import { Car, Bike, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTAButton from "@/components/shared/CTAButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const protections = [
  {
    key: "mobil",
    icon: Car,
    href: "/produk/asuransi-mobil",
    available: true,
  },
  {
    key: "motor",
    icon: Bike,
    href: "#",
    available: false,
  },
];

export default function ProtectionChoices() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#F8FAFC] ds-section">
      <div className="ds-container">
        <SectionHeader
          label={t("protectionChoices.label")}
          heading={t("protectionChoices.heading")}
          subheading={t("protectionChoices.subheading")}
          accent="primary"
          headingColor="text-[#172033]"
          subheadingColor="text-[#64748B]"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6 max-w-3xl mx-auto">
          {protections.map(({ key, icon: Icon, href, available }) => {
            return (
              <div
                key={key}
                className={`relative ds-card group flex flex-col justify-between min-h-[220px] sm:min-h-[240px] transition-all duration-300 ${
                  available
                    ? "hover:shadow-lg hover:border-[#0F766E]/30 cursor-pointer"
                    : "opacity-70 cursor-not-allowed"
                }`}
                onClick={available ? undefined : undefined}
                role={available ? "link" : undefined}
                tabIndex={available ? 0 : -1}
                aria-label={t(`protectionChoices.items.${key}.title`)}
              >
                {/* Icon */}
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#0F766E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#172033] mb-2">
                    {t(`protectionChoices.items.${key}.title`)}
                  </h3>
                  <p className="ds-body text-[#64748B]">
                    {t(`protectionChoices.items.${key}.desc`)}
                  </p>
                </div>

                {/* CTA area */}
                <div className="mt-6">
                  {available ? (
                    <CTAButton
                      variant="sm"
                      color="teal"
                      href={href}
                      trailingIcon={
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      }
                    >
                      {t("protectionChoices.cekHarga")}
                    </CTAButton>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] bg-[#F1F5F9] px-3 py-1.5 rounded-full">
                      {t("protectionChoices.comingSoon")}
                    </span>
                  )}
                </div>

                {/* Coming soon overlay for unavailable */}
                {!available && (
                  <div className="absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-[1px]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
