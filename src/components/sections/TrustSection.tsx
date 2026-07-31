"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Handshake,
  Diamond,
} from "lucide-react";
import Image from "next/image";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import SectionHeader from "@/components/shared/SectionHeader";
import GradientMesh from "@/components/shared/GradientMesh";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Partner logo mapping: slug → logo file in /public/partners/
const PARTNER_LOGO_MAP: Record<string, string> = {
  sinarmas: "/partners/sinarmas.webp",
  aca: "/partners/aca.webp",
  "mega-insurance": "/partners/mega-insurance.webp",
  "zurich-syariah": "/partners/zurich-syariah.webp",
  tugu: "/partners/tugu.webp",
  mag: "/partners/mag.webp",
  "multi-artha-guna": "/partners/mag.webp",
  sahabat: "/partners/sahabat.webp",
  oona: "/partners/oona.webp",
};

// Display dimensions for partner logos (half of source for retina)
const LOGO_DISPLAY_W = 160;
const LOGO_DISPLAY_H = 60;

// Default fallback partners
const defaultPartners = [
  "Sinarmas",
  "ACA",
  "Mega Insurance",
  "Zurich Syariah",
  "Tugu",
  "OONA",
  "MAG",
  "Sahabat",
];

const trustStatements = [
  { labelKey: "secureProcess", icon: Lock },
  { labelKey: "dataProtected", icon: ShieldCheck },
  { labelKey: "trustedPartners", icon: Handshake },
];

const trustBadges = [
  { icon: ShieldCheck, key: "secure" },
];

const secureProcess = [
  { step: "01", key: "select" },
  { step: "02", key: "fill" },
  { step: "03", key: "recommend" },
  { step: "04", key: "consult" },
];

export default function TrustSection() {
  const { t } = useLanguage();
  // Fetch partners from database
  const [partners, setPartners] = useState<{ name: string; slug: string }[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await fetch(`/api/partners?active=true`);
        if (res.ok) {
          const data = await res.json();
          if (data.partners && data.partners.length > 0) {
            setPartners(data.partners.map((p: { name: string; slug: string }) => ({ name: p.name, slug: p.slug })));
          } else {
            setPartners(defaultPartners.map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-") })));
          }
        } else {
          setPartners(defaultPartners.map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-") })));
        }
      } catch {
        setPartners(defaultPartners.map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-") })));
      } finally {
        setPartnersLoading(false);
      }
    }
    fetchPartners();
  }, []);

  return (
    <section id="trust-legal" className="relative overflow-hidden bg-[#F0FDFA]">
      {/* Gradient Mesh */}
      <GradientMesh variant="emerald-depth" />
      {/* Top divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#10B981]/20 to-transparent" />

      <div className="relative z-10">
        {/* ════════════════════════════════════════════
            PART 1: PARTNER LOGOS + MARQUEE + TRUST BADGES (merged)
            Single section with all partner-related content.
            Marquee kept as-is per client request.
        ════════════════════════════════════════════ */}
        <div className="ds-section">
          <div className="ds-container safe-px">
            {/* Section Header */}
            <SectionHeader
              label={t("trust.label")}
              heading={t("trust.heading")}
              subheading={t("trust.subheading")}
              accent="emerald"
              headingColor="text-[#0F172A]"
              subheadingColor="text-[#64748B]"
            />

            {/* Partner Logos - Cards with real logos */}
            <AnimatedSection delay={0.2}>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {partnersLoading ? (
                  // Loading skeleton - same grid structure
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#10B981]/10 p-4 sm:p-6 flex items-center justify-center">
                      <div className="h-8 sm:h-10 w-24 sm:w-32 bg-[#E2E8F0] rounded animate-pulse" />
                    </div>
                  ))
                ) : (
                  partners.map((partner, i) => {
                    const logoSrc = PARTNER_LOGO_MAP[partner.slug];
                    return (
                      <AnimatedSection key={partner.slug} delay={i * 0.08} duration={0.6}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#10B981]/10 p-4 sm:p-6 flex items-center justify-center hover:shadow-md hover:-translate-y-1 hover:border-[#10B981]/25 transition-all duration-300 min-h-[80px]">
                          {logoSrc ? (
                            <Image
                              src={logoSrc}
                              alt={`Logo ${partner.name}`}
                              width={LOGO_DISPLAY_W}
                              height={LOGO_DISPLAY_H}
                              className="h-auto w-auto max-w-full max-h-[60px] object-contain"
                            />
                          ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-3 h-3 rounded-full bg-[#10B981]/20" />
                              <span className="text-[11px] sm:text-sm font-semibold tracking-wider text-[#334155] uppercase ">
                                {partner.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </AnimatedSection>
                    );
                  })
                )}
              </div>
            </AnimatedSection>

            {/* Partner Marquee — kept as-is per client request */}
            {!partnersLoading && partners.length > 0 && (
              <AnimatedSection delay={0.4} className="mt-10 lg:mt-14">
                <div className="border-y border-[#10B981]/15 py-5 overflow-hidden">
                  <div className="animate-marquee whitespace-nowrap">
                    {Array(6).fill(null).map((_, i) => (
                      <span key={i} className="inline-flex items-center gap-6 mx-6">
                        {partners.map((partner, j) => (
                          <span key={`${i}-${j}`} className="inline-flex items-center gap-2.5">
                            <span className="text-sm font-bold  tracking-[0.15em] text-[#10B981]/[0.35] uppercase">
                              {partner.name.replace("Asuransi ", "")}
                            </span>
                            <Diamond className="w-1.5 h-1.5 text-[#10B981]/50" />
                          </span>
                        ))}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Trust Badges — merged here (was its own sub-section before) */}
            <AnimatedSection delay={0.3} className="mt-12 lg:mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
                {/* Left: Trust Badge single card */}
                <div className="md:order-1">
                  {trustBadges.map((badge, i) => {
                    const IconComponent = badge.icon;
                    return (
                      <AnimatedSection key={badge.key} delay={i * 0.1}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#10B981]/10 ds-card hover:shadow-md hover:-translate-y-1 hover:border-[#10B981]/25 transition-all duration-300 h-full">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-[#10B981]/[0.08] border border-[#10B981]/10 flex items-center justify-center mb-4 group-hover:bg-[#10B981]/[0.15] transition-colors duration-300">
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#10B981]" />
                          </div>
                          <h3 className="text-lg font-semibold  text-[#0F172A] mb-2">
                            {t(`trust.badges.${badge.key}.title`)}
                          </h3>
                          <p className="text-[#64748B] text-sm leading-[1.7]">
                            {t(`trust.badges.${badge.key}.desc`)}
                          </p>
                        </div>
                      </AnimatedSection>
                    );
                  })}
                </div>

                {/* Right: Claim Statistics header + 3 statement cards in compact layout */}
                <div className="md:order-2">
                  <div className="text-left md:text-left mb-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-[2px] bg-[#10B981] rounded-sm" />
                      <span className="ds-label text-[#10B981]">{t("trust.provenLabel")}</span>
                    </div>
                    <TextReveal
                      text={t("trust.provenHeading")}
                      as="h3"
                      className="text-xl sm:text-2xl font-bold  text-[#0F172A] leading-tight"
                      delay={0.1}
                      staggerDelay={0.04}
                    />
                  </div>

                  <div className="space-y-3">
                    {trustStatements.map((statement, i) => {
                      const IconComponent = statement.icon;
                      return (
                        <AnimatedSection key={statement.labelKey} delay={i * 0.12} duration={1}>
                          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 sm:p-5 hover:shadow-md hover:border-[#10B981]/20 transition-all duration-300">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="w-10 h-10 rounded-lg bg-[#10B981]/[0.08] border border-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B981]" />
                              </div>
                              <p className="text-sm font-semibold  text-[#0F172A] leading-relaxed">
                                {t(`trust.trustStatements.${statement.labelKey}`)}
                              </p>
                            </div>
                          </div>
                        </AnimatedSection>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider" />

        {/* ════════════════════════════════════════════
            PART 2: SECURE PROCESS + GUARANTEE (merged)
            Process steps on left, guarantee card moved up as inline CTA.
        ════════════════════════════════════════════ */}
        <div className="ds-section bg-[#D1FAE5]/20">
          <div className="ds-container safe-px">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 xl:gap-24 items-center">
              {/* Left - Heading + Process Steps */}
              <AnimatedSection direction="left">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-[2px] bg-[#10B981] rounded-sm" />
                  <span className="ds-label text-[#10B981]">{t("trust.secureLabel")}</span>
                </div>
                <TextReveal
                  text={t("trust.secureHeading")}
                  as="h3"
                  className="ds-h3 font-bold  text-[#0F172A] mb-4 sm:mb-5"
                  delay={0.1}
                  staggerDelay={0.04}
                />
                <p className="ds-body text-[#64748B] mb-6 sm:mb-8 max-w-md">
                  {t("trust.secureDesc")}
                </p>
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-[#10B981]" />
                  <span className="text-[#64748B] text-sm tracking-wider">
                    {t("trust.sslEncrypted")}
                  </span>
                </div>
              </AnimatedSection>

              {/* Right - Process Steps (slightly tighter spacing) */}
              <div className="space-y-3 sm:space-y-4">
                {secureProcess.map((step, i) => (
                  <AnimatedSection key={step.step} delay={i * 0.1} direction="right">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#10B981]/10 p-4 sm:p-6 flex gap-4 sm:gap-5 hover:shadow-md hover:-translate-y-1 hover:border-[#10B981]/25 transition-all duration-300 group">
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#10B981]/[0.08] border border-[#10B981]/10 flex items-center justify-center group-hover:bg-[#10B981]/[0.15] transition-colors duration-300">
                          <span className="text-sm font-bold  text-[#10B981]">
                            {step.step}
                          </span>
                        </div>
                      </div>
                      {/* Content */}
                      <div>
                        <h4 className="text-base font-semibold  text-[#0F172A] mb-1.5">
                          {t(`trust.process.${step.key}.title`)}
                        </h4>
                        <p className="text-[#64748B] text-sm leading-[1.7]">
                          {t(`trust.process.${step.key}.desc`)}
                        </p>
                      </div>
                      {/* Check icon - hidden on mobile to prevent overflow */}
                      <div className="hidden sm:flex flex-shrink-0 ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <CheckCircle2 className="w-5 h-5 text-[#10B981]/40" />
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Customer Protection Guarantee — kept inline as closing CTA */}
            <AnimatedSection delay={0.5} className="mt-10 lg:mt-14">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#10B981]/10 ds-card hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-7">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                      <Handshake className="w-7 h-7 text-[#10B981]" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-lg font-semibold  text-[#0F172A] mb-2">
                      {t("trust.guaranteeTitle")}
                    </h4>
                    <p className="text-[#64748B] text-sm leading-[1.7] max-w-xl">
                      {t("trust.guaranteeDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#10B981]/15 to-transparent" />
    </section>
  );
}
