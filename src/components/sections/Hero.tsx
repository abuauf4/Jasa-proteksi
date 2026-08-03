"use client";

import { useState, useEffect } from "react";
import { Search, ArrowRight, ShieldCheck, Zap, MessageCircle } from "lucide-react";
import Image from "next/image";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSiteSettings, useHeroData } from "@/lib/ServerDataContext";
import { trackWhatsAppClick } from "@/lib/analytics-events";

export default function Hero() {
  const { t } = useLanguage();
  const { settings, loading: settingsLoading, ctaWhatsApp } = useSiteSettings();
  const { heroData, heroLoading } = useHeroData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dataReady = mounted && !heroLoading && !settingsLoading;

  // Use DB data when available, translation fallbacks otherwise
  const heading = heroData?.tagline || t("hero.heading");
  const tagline = heroData?.subtext || t("hero.tagline");
  const primaryCtaText = heroData?.ctaText || t("hero.primaryCta");
  const bgImage = heroData?.backgroundImage || "/hero-car-bg.webp";

  const whatsappLink = ctaWhatsApp
    ? `https://wa.me/${ctaWhatsApp}`
    : "/produk/asuransi-mobil";

  const benefits = [
    { icon: ShieldCheck, text: t("hero.benefitAllRisk") },
    { icon: Zap, text: t("hero.benefitEasy") },
    { icon: MessageCircle, text: t("hero.benefitConsult") },
  ];

  return (
    <section
      id="beranda"
      className="relative bg-white pt-[68px] lg:pt-[72px]"
      style={{ visibility: dataReady ? "visible" : "hidden" }}
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8">
        {/* ═══════ Mobile-first: Single column ═══════ */}
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16">
          {/* ── Left: Text Content ── */}
          <div className="py-10 sm:py-14 lg:py-20 xl:py-24">
            {/* 1. Badge */}
            <AnimatedSection delay={0.1}>
              <span className="inline-block rounded-full bg-[#F0FDFA] px-3.5 py-1.5 text-[12px] font-semibold text-[#0F766E]">
                {t("hero.label")}
              </span>
            </AnimatedSection>

            {/* 2. Heading — left aligned, max 2-3 lines */}
            <AnimatedSection delay={0.2} className="mt-5 sm:mt-6">
              <h1 className="text-[28px] font-bold leading-[1.15] tracking-tight text-[#0B1F3A] sm:text-[32px] sm:leading-[1.15] lg:text-[56px] lg:leading-[1.1] xl:text-[60px]">
                {heading.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h1>
            </AnimatedSection>

            {/* 3. Shield Info */}
            <AnimatedSection delay={0.3} className="mt-4 sm:mt-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#F0FDFA]">
                  <ShieldCheck className="h-4 w-4 text-[#0F766E]" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold leading-tight text-[#0B1F3A]">
                    {t("hero.coverageType")}
                  </p>
                  <p className="text-[13px] leading-tight text-[#64748B]">
                    {t("hero.coverageDesc")}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* 4. Description — max 3 lines */}
            <AnimatedSection delay={0.35} className="mt-4 sm:mt-5">
              <p className="text-[16px] leading-[1.65] text-[#475569] sm:text-[17px] lg:max-w-md">
                {tagline}
              </p>
            </AnimatedSection>

            {/* 5. CTA Buttons */}
            <AnimatedSection delay={0.4} className="mt-7 sm:mt-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                {/* Primary — teal */}
                <a
                  href="/produk/asuransi-mobil"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0F766E] px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[#0D6B63] sm:w-auto"
                >
                  <Search className="h-4 w-4" />
                  {primaryCtaText}
                </a>
                {/* Secondary — outline */}
                <a
                  href={whatsappLink}
                  target={ctaWhatsApp ? "_blank" : undefined}
                  rel={ctaWhatsApp ? "noopener noreferrer" : undefined}
                  onClick={() => trackWhatsAppClick({ method: "hero_cta" })}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#0F766E] px-6 py-3.5 text-[16px] font-semibold text-[#0F766E] transition-colors hover:bg-[#F0FDFA] sm:w-auto"
                >
                  {t("hero.secondaryCta")}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </AnimatedSection>

            {/* 6. Social proof */}
            <AnimatedSection delay={0.5} className="mt-6 sm:mt-7">
              <p className="text-[14px] text-[#94A3B8]">
                {t("hero.socialProof")}
              </p>
            </AnimatedSection>
          </div>

          {/* ── Right: Car Image Card (desktop) / Below CTA (mobile) ── */}
          <div className="mt-8 lg:mt-0">
            <AnimatedSection delay={0.5} direction="right">
              <div className="relative overflow-hidden rounded-[24px] bg-[#F8FAFC] shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[4/3]">
                  <Image
                    src={bgImage}
                    alt="Asuransi kendaraan mobil - Jasa Proteksi"
                    fill
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* 7. Benefits — below car image */}
            <AnimatedSection delay={0.6} className="mt-5 sm:mt-6">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {benefits.map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-3 py-4 text-center shadow-[0_1px_8px_rgba(0,0,0,0.04)] sm:py-5"
                  >
                    <Icon className="h-5 w-5 text-[#0F766E]" />
                    <span className="text-[12px] font-medium leading-tight text-[#334155] sm:text-[13px]">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
