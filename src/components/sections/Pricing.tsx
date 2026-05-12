"use client";

import { Check, Star } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";

const pricingTiers = [
  {
    name: "Basic",
    dp: "Rp 30 Juta",
    monthly: "Rp 4,5 Juta/bulan",
    features: [
      "DP ringan mulai 10%",
      "Tenor hingga 5 tahun",
      "Asuransi dasar included",
      "Gratis Tanda Jadi",
    ],
    recommended: false,
  },
  {
    name: "Premium",
    dp: "Rp 50 Juta",
    monthly: "Rp 6,2 Juta/bulan",
    features: [
      "DP kompetitif 15%",
      "Tenor hingga 6 tahun",
      "Asuransi all-risk included",
      "Gratis aksesoris senilai 5 Juta",
      "Gratis servis 2 tahun",
    ],
    recommended: true,
  },
  {
    name: "Executive",
    dp: "Rp 80 Juta",
    monthly: "Rp 8,5 Juta/bulan",
    features: [
      "DP eksklusif 25%",
      "Tenor hingga 7 tahun",
      "Asuransi all-risk + ext",
      "Gratis aksesoris senilai 10 Juta",
      "Gratis servis 3 tahun",
      "Priority booking servis",
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
          <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Financing</span>
          <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4">
            Paket Kredit Spesial
          </h2>
        </AnimatedSection>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pricingTiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 0.15}>
              <div
                className={`relative glass-dark rounded-xl p-8 transition-all duration-500 hover:-translate-y-1 ${
                  tier.recommended
                    ? "border-[#c9a84c]/60 shadow-lg shadow-[#c9a84c]/10"
                    : "hover:border-[#c9a84c]/30"
                }`}
              >
                {/* Recommended Badge */}
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-[#c9a84c] text-[#00001f] px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
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
                <a
                  href="#kontak"
                  className={`block text-center py-3 font-semibold tracking-wider text-sm transition-all duration-300 ${
                    tier.recommended
                      ? "bg-[#c9a84c] text-[#00001f] hover:bg-[#dfc06f]"
                      : "border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#00001f]"
                  }`}
                >
                  Hubungi Kami
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Disclaimer */}
        <AnimatedSection delay={0.5} className="mt-10 text-center">
          <p className="text-xs text-white/30">
            *Harga dan cicilan bersifat estimasi. Hubungi kami untuk penawaran yang disesuaikan dengan kebutuhan Anda.
          </p>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
