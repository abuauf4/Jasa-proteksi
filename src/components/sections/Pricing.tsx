"use client";

import { Check, Star } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const tierConfig = [
  { key: "basic" as const, featureCount: 4, recommended: false },
  { key: "premium" as const, featureCount: 5, recommended: true },
  { key: "complete" as const, featureCount: 6, recommended: false },
];

export default function Pricing() {
  const { t } = useLanguage();

  const pricingTiers = tierConfig.map(({ key, featureCount, recommended }) => ({
    key,
    name: t(`pricing.tiers.${key}.name`),
    dp: t(`pricing.tiers.${key}.price`),
    monthly: t(`pricing.tiers.${key}.subtitle`),
    features: Array.from({ length: featureCount }, (_, j) => t(`pricing.tiers.${key}.features.${j}`)),
    recommended,
  }));
  return (
    <section id="promo" className="section-padding relative overflow-hidden bg-[#0D0D0D] text-white">
      {/* Ambient glow */}
      <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] rounded-full blur-[140px]" style={{ backgroundColor: "rgba(46, 125, 111, 0.02)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-24 lg:mb-28">
          <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">{t("pricing.label")}</span>
          <TextReveal
            text={t("pricing.heading")}
            as="h2"
            className="text-4xl lg:text-5xl xl:text-6xl font-bold  text-white mt-6 leading-[1.1]"
            delay={0.1}
            staggerDelay={0.05}
          />
        </AnimatedSection>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-9">
          {pricingTiers.map((tier, i) => (
            <AnimatedSection key={tier.key} delay={i * 0.1}>
              <div
                className={`relative h-full rounded-xl p-10 transition-all duration-500 hover:-translate-y-1 ${
                  tier.recommended
                    ? "bg-[#0A0F1E]/80 border border-[#2E7D6F]/40 shadow-lg shadow-[#2E7D6F]/8 gradient-border"
                    : "bg-[#0A0F1E]/50 border border-white/[0.04] hover:border-[#2E7D6F]/15"
                }`}
              >
                {/* Recommended Badge */}
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1.5 bg-[#2E7D6F] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      <Star className="w-3 h-3 fill-white" />
                      {t("pricing.recommended")}
                    </div>
                  </div>
                )}

                {/* Tier Name */}
                <h3 className="text-base font-semibold  text-white/60 tracking-wider mb-5">
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mb-9">
                  <p className="text-2xl lg:text-3xl font-bold  text-[#2E7D6F] mb-1.5">
                    {tier.dp}
                  </p>
                  <p className="text-sm text-white/35">{tier.monthly}</p>
                </div>

                {/* Divider */}
                <div className="accent-line mb-9" />

                {/* Features */}
                <ul className="space-y-4 mb-9">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#2E7D6F] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-white/50 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#kontak"
                  className={`block text-center py-3.5 font-semibold tracking-wider text-sm transition-all duration-800 shine-button rounded-lg ${
                    tier.recommended
                      ? "bg-[#2E7D6F] text-white hover:bg-[#3A9B8A]"
                      : "border border-[#2E7D6F]/30 text-[#2E7D6F] hover:bg-[#2E7D6F] hover:text-white"
                  }`}
                >
                  {t("pricing.contactUs")}
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Disclaimer */}
        <AnimatedSection delay={0.5} className="mt-12 text-center">
          <p className="text-xs text-white/15">
            {t("pricing.disclaimer")}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
