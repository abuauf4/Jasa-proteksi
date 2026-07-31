"use client";

import { Search, Phone, UserCheck } from "lucide-react";
import Image from "next/image";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import CTAButton from "@/components/shared/CTAButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { trackEvent } from "@/lib/conversion";

const trustBadgeConfig = [
  { icon: UserCheck, key: "advisor" },
];

export default function CTASection() {
  const { t } = useLanguage();
  const { settings, loading, ctaWhatsApp } = useSiteSettings();

  const trustBadges = trustBadgeConfig.map(({ icon, key }) => ({
    icon,
    label: t(`cta.badges.${key}`),
    key,
  }));

  return (
    <section className="relative ds-section overflow-hidden">
      {/* Background — Teal gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D9488] to-[#047857]" />
      {/* Background image with overlay */}
      <Image
        src="/cta-handshake.webp"
        alt=""
        fill
        loading="lazy"
        className="object-cover object-center opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D9488]/85 to-[#047857]/85" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 dot-pattern opacity-[0.04]" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center safe-px">
        <AnimatedSection>
          <TextReveal
            text={t("cta.heading")}
            as="h2"
            className="ds-h2 font-bold  text-white mb-5 sm:mb-7"
            delay={0.1}
            staggerDelay={0.04}
          />
          <p className="ds-body-lg text-white/80 mb-9 sm:mb-12 max-w-xl mx-auto">
            {t("cta.subheading")}
          </p>
        </AnimatedSection>

        {/* CTA Buttons */}
        <AnimatedSection delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center mb-10 sm:mb-14">
            <CTAButton
              variant="lg"
              color="white"
              href="/produk/asuransi-mobil"
              icon={<Search className="w-4 h-4" />}
            >
              {t("cta.cekHarga")}
            </CTAButton>
            <CTAButton
              variant="lg"
              color="orange"
              href={ctaWhatsApp ? `https://wa.me/${ctaWhatsApp}` : "/produk/asuransi-mobil"}
              target={ctaWhatsApp ? "_blank" : undefined}
              rel={ctaWhatsApp ? "noopener noreferrer" : undefined}
              onClick={() => trackEvent("whatsapp_click", { method: "cta_section" })}
              icon={<Phone className="w-4 h-4" />}
            >
              {t("cta.chatWhatsApp")}
            </CTAButton>
          </div>
        </AnimatedSection>

        {/* Trust Badges */}
        <AnimatedSection delay={0.3}>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {trustBadges.map((badge) => (
              <div key={badge.key} className="flex items-center gap-2.5">
                <badge.icon className="w-4 h-4 text-white/70" />
                <span className="text-white/70 text-sm tracking-wider">{badge.label}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
