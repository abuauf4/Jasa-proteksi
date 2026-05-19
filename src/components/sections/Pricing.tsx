"use client";

import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

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
    <section id="promo" className="section-padding relative overflow-hidden bg-[#0D0D0D] text-white">
      {/* Ambient glow */}
      <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] rounded-full blur-[140px]" style={{ backgroundColor: "rgba(46, 125, 111, 0.02)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-24 lg:mb-28">
          <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">Coverage</span>
          <TextReveal
            text="Choose your peace of mind"
            as="h2"
            className="text-4xl lg:text-5xl xl:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-6 leading-[1.1]"
            delay={0.1}
            staggerDelay={0.05}
          />
        </AnimatedSection>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-9">
          {pricingTiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 0.1}>
              <motion.div
                className={`relative h-full rounded-xl p-10 transition-all duration-800 card-lift ${
                  tier.recommended
                    ? "bg-[#0A0F1E]/80 border border-[#2E7D6F]/40 shadow-lg shadow-[#2E7D6F]/8 gradient-border"
                    : "bg-[#0A0F1E]/50 border border-white/[0.04] hover:border-[#2E7D6F]/15"
                }`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Recommended Badge */}
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1.5 bg-[#2E7D6F] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      <Star className="w-3 h-3 fill-white" />
                      Recommended
                    </div>
                  </div>
                )}

                {/* Tier Name */}
                <h3 className="text-base font-semibold font-[family-name:var(--font-montserrat)] text-white/60 tracking-wider mb-5">
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mb-9">
                  <p className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-montserrat)] text-[#2E7D6F] mb-1.5">
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
                  Hubungi Kami
                </a>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Disclaimer */}
        <AnimatedSection delay={0.5} className="mt-12 text-center">
          <p className="text-xs text-white/15">
            Premi bersifat estimasi. Hubungi tim kami untuk penawaran terperinci.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
