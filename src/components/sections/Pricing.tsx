"use client";

import { Check, Star } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import SpotlightCard from "@/components/shared/SpotlightCard";
import MagneticButton from "@/components/shared/MagneticButton";

const pricingTiers = [
  {
    name: "Basic",
    dp: "Premi Mulai Rp 50rb",
    monthly: "Perjalanan & Kecelakaan Diri",
    features: [
      "Perlindungan dasar",
      "Klaim reimbursement",
      "Proses cepat di bawah 3 menit",
      "Polis digital instan",
    ],
    recommended: false,
  },
  {
    name: "Premium",
    dp: "Premi Mulai Rp 300rb",
    monthly: "Kendaraan & Hewan Peliharaan",
    features: [
      "Perlindungan komprehensif",
      "Klaim cashless & reimbursement",
      "Diskon hingga 25% + cashback",
      "Personalisasi polis",
      "Telesales support 24/7",
    ],
    recommended: true,
  },
  {
    name: "Complete",
    dp: "Perlindungan Menyeluruh",
    monthly: "Semua produk dalam satu paket",
    features: [
      "All-in-one protection",
      "Klaim cashless & reimbursement",
      "Diskon khusus bundling",
      "Prioritas layanan klaim",
      "Personal advisor dedicated",
      "Gratis konsultasi asuransi",
    ],
    recommended: false,
  },
];

export default function Pricing() {
  return (
    <SectionWrapper id="promo" dark>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16 lg:mb-20">
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Coverage</span>
          <TextReveal
            text="Pilih Paket Perlindunganmu"
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4"
            delay={0.1}
          />
        </AnimatedSection>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pricingTiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 0.15}>
              <SpotlightCard className="h-full" spotlightColor="rgba(201, 168, 76, 0.06)">
                <div
                  className={`relative h-full rounded-xl p-8 transition-all duration-500 card-lift ${
                    tier.recommended
                      ? "glass-dark border-[#c9a84c]/60 shadow-lg shadow-[#c9a84c]/10 gradient-border"
                      : "glass-dark hover:border-[#c9a84c]/30"
                  }`}
                >
                  {/* Recommended Badge */}
                  {tier.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="flex items-center gap-1 bg-[#c9a84c] text-[#00001f] px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase animate-glow-pulse">
                        <Star className="w-3 h-3 fill-[#00001f]" />
                        Recommended
                      </div>
                    </div>
                  )}

                  {/* Tier Name */}
                  <h3 className="text-lg font-semibold font-[family-name:var(--font-montserrat)] text-white/70 tracking-wider mb-4">
                    {tier.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-8">
                    <p className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-[#c9a84c] mb-1">
                      {tier.dp}
                    </p>
                    <p className="text-sm text-white/40">{tier.monthly}</p>
                  </div>

                  {/* Divider */}
                  <div className="gold-line mb-8" />

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <MagneticButton
                    href="#kontak"
                    className={`block text-center py-3 font-semibold tracking-wider text-sm transition-all duration-300 shine-button w-full ${
                      tier.recommended
                        ? "bg-[#c9a84c] text-[#00001f] hover:bg-[#dfc06f]"
                        : "border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#00001f]"
                    }`}
                  >
                    Hubungi Kami
                  </MagneticButton>
                </div>
              </SpotlightCard>
            </AnimatedSection>
          ))}
        </div>

        {/* Disclaimer */}
        <AnimatedSection delay={0.5} className="mt-10 text-center">
          <p className="text-xs text-white/30">
            Premi bersifat estimasi. Hubungi tim kami untuk penawaran terperinci.
          </p>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
