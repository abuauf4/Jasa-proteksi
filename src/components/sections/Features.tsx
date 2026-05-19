"use client";

import { Zap, ShieldCheck, Award, Clock, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const features = [
  {
    icon: Zap,
    title: "Cepat dan Efisien",
    description: "Lengkapi pengajuan kurang dari 3 menit saja. Bayar dan langsung dapat polis tanpa proses panjang.",
  },
  {
    icon: ShieldCheck,
    title: "Berizin dan Diawasi OJK",
    description: "PT Solusiutama Tekno Broker Asuransi berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) dengan nomor lisensi KEP-060/NB.1/2021.",
  },
  {
    icon: Award,
    title: "Insurtech Initiative of the Year 2025",
    description: "Diakui oleh Insurance Asia Awards atas inovasi kami di sektor asuransi Asia-Pasifik.",
  },
  {
    icon: Clock,
    title: "Premi Terjangkau",
    description: "Harga premi yang kompetitif, plus suka ada diskon dan cashback untuk setiap produk asuransi.",
  },
];

export default function Features() {
  return (
    <section id="fitur" className="bg-[#F5F5F0] overflow-hidden">
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Emotional Storytelling */}
            <AnimatedSection direction="left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-[#2E7D6F]" />
                <span className="text-xs tracking-[0.3em] text-[#2E7D6F] uppercase font-medium">
                  Why Jasa Proteksi
                </span>
              </div>
              <TextReveal
                text="Protection for what truly matters"
                as="h2"
                className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-[#0D0D0D] mb-12 leading-tight"
                delay={0.15}
                staggerDelay={0.04}
              />

              <div>
                {features.map((feature, i) => (
                  <AnimatedSection key={feature.title} delay={i * 0.15} direction="left">
                    <div className="flex gap-5 group mb-10 last:mb-0">
                      <div className="flex-shrink-0">
                        <div className="w-[2px] h-full min-h-[60px] bg-gradient-to-b from-[#2E7D6F] to-[#2E7D6F]/20 relative">
                          <div className="absolute -left-[7px] top-0 w-4 h-4 rounded-full border-2 border-[#2E7D6F] bg-[#F5F5F0]" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold font-[family-name:var(--font-montserrat)] text-[#0D0D0D] mb-1 group-hover:text-[#2E7D6F] transition-colors duration-500">
                          {feature.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              <AnimatedSection delay={0.6} className="mt-10">
                <a
                  href="#model"
                  className="inline-flex items-center gap-2 text-[#2E7D6F] font-medium text-sm tracking-wider group"
                >
                  Explore All Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
                </a>
              </AnimatedSection>
            </AnimatedSection>

            {/* Right - Award/Certification Showcase */}
            <AnimatedSection direction="right" delay={0.25}>
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0A0F1E] to-[#141B30] p-10 min-h-[400px] flex flex-col items-center justify-center border border-white/[0.06]">
                  {/* Award Badge */}
                  <div className="w-24 h-24 rounded-full border-2 border-[#2E7D6F]/30 flex items-center justify-center mb-6">
                    <Award className="w-12 h-12 text-[#2E7D6F]" />
                  </div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-white text-center mb-2">
                    Insurance Asia Awards 2025
                  </h3>
                  <p className="text-[#2E7D6F] text-sm tracking-wider uppercase text-center mb-4">
                    Insurtech Initiative of the Year
                  </p>
                  <p className="text-white/40 text-xs text-center max-w-sm leading-relaxed">
                    Diakui atas kontribusi dan inovasi luar biasa di seluruh industri asuransi wilayah Asia-Pasifik
                  </p>
                  {/* Subtle shine on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-3 -right-3 bg-[#0A0F1E] border border-[#2E7D6F]/30 rounded-lg px-3 py-2">
                  <p className="text-[10px] tracking-[0.2em] text-[#2E7D6F] uppercase font-medium">
                    OJK Licensed
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
