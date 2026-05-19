"use client";

import { Zap, ShieldCheck, Award, Clock, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import MagneticButton from "@/components/shared/MagneticButton";

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
    <SectionWrapper id="fitur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text Content */}
          <AnimatedSection direction="left">
            <div className="flex items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Why Jasa Proteksi</span>
            </div>
            <TextReveal
              text="Alasan Jasa Proteksi Pas untuk Kamu"
              as="h2"
              className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] mb-10 leading-tight"
              delay={0.1}
              staggerDelay={0.04}
            />

            <div className="space-y-8">
              {features.map((feature, i) => (
                <AnimatedSection key={feature.title} delay={i * 0.12} direction="left">
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0">
                      <div className="w-[2px] h-full min-h-[60px] bg-gradient-to-b from-[#c9a84c] to-[#c9a84c]/20 relative">
                        <div className="absolute -left-[7px] top-0 w-4 h-4 rounded-full border-2 border-[#c9a84c] bg-background" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold font-[family-name:var(--font-montserrat)] mb-1 group-hover:text-[#c9a84c] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.5} className="mt-10">
              <MagneticButton
                href="#model"
                className="inline-flex items-center gap-2 text-[#c9a84c] font-medium text-sm tracking-wider group hover:gap-3 transition-all duration-300"
              >
                Explore All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </MagneticButton>
            </AnimatedSection>
          </AnimatedSection>

          {/* Right - Award/Certification Showcase */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#c9a84c]/10 to-transparent rounded-2xl group-hover:from-[#c9a84c]/15 transition-all duration-700" />
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a0a2e] to-[#1a1a3e] p-10 min-h-[400px] flex flex-col items-center justify-center border border-[#c9a84c]/20">
                {/* Award Badge */}
                <div className="w-24 h-24 rounded-full bg-[#c9a84c]/10 border-2 border-[#c9a84c]/30 flex items-center justify-center mb-6 animate-glow-pulse">
                  <Award className="w-12 h-12 text-[#c9a84c]" />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-white text-center mb-2">
                  Insurance Asia Awards 2025
                </h3>
                <p className="text-[#c9a84c] text-sm tracking-wider uppercase text-center mb-4">
                  Insurtech Initiative of the Year
                </p>
                <p className="text-white/40 text-xs text-center max-w-sm leading-relaxed">
                  Diakui atas kontribusi dan inovasi luar biasa di seluruh industri asuransi wilayah Asia-Pasifik
                </p>
                {/* Decorative frame */}
                <div className="absolute inset-0 border border-[#c9a84c]/20 rounded-xl pointer-events-none" />
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 glass rounded-lg p-3 animate-glow-pulse">
                <p className="text-[10px] tracking-[0.2em] text-[#c9a84c] uppercase font-medium">OJK Licensed</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </SectionWrapper>
  );
}
