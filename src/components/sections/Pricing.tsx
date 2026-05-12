"use client";

import { Check, Star } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";

const pricingTiers = [
  {
    name: "DP Ringan",
    dp: "DP mulai 10%",
    monthly: "Cicilan mulai Rp 4,5jt/bulan",
    features: [
      "DP ringan mulai 10%",
      "Tenor hingga 5 tahun",
      "Proses kredit cepat 1-3 hari",
      "Gratis Tanda Jadi",
    ],
    recommended: false,
  },
  {
    name: "Bunga Special",
    dp: "Bunga 0% hingga 2 tahun",
    monthly: "Tenor hingga 7 tahun",
    features: [
      "Bunga 0% hingga 2 tahun",
      "Tenor hingga 7 tahun",
      "Cicilan ringan & fleksibel",
      "Gratis aksesoris senilai jutaan",
      "Gratis servis berkala 1 tahun",
    ],
    recommended: true,
  },
  {
    name: "SMART CASH",
    dp: "Cashback spesial",
    monthly: "Free accessories & bonus",
    features: [
      "Cashback hingga jutaan rupiah",
      "Free aksesoris original",
      "Pembelian cash dengan harga special",
      "Gratis kartu member VIP",
      "Prioritas booking servis",
      "Diskon servis berkala",
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
            Simulasi kredit bersifat estimasi. Hubungi dealer untuk penawaran terperinci.
          </p>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
