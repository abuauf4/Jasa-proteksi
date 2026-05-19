"use client";

import { Zap, Target, Headphones, Eye, FileCheck, Settings } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const services = [
  {
    icon: Zap,
    title: "Pembelian Cepat",
    description: "Lengkapi pengajuan asuransi kurang dari 3 menit saja. Proses mudah dan cepat tanpa ribet.",
  },
  {
    icon: Target,
    title: "Rekomendasi yang Pas",
    description: "Produk pilihan yang pas buat kebutuhanmu. Personalisasi sesuai gaya hidupmu.",
  },
  {
    icon: Headphones,
    title: "Telesales yang Ramah",
    description: "Tim kami siap membantumu pilih asuransi yang tepat via telepon atau WhatsApp.",
  },
  {
    icon: Eye,
    title: "Selalu Transparan",
    description: "Hanya informasi terpercaya tentang perlindunganmu. Tidak ada biaya tersembunyi.",
  },
  {
    icon: FileCheck,
    title: "Klaim Mudah",
    description: "Klaim dengan sistem reimbursement dan cashless. Bisa dilakukan kapanpun dan dimanapun.",
  },
  {
    icon: Settings,
    title: "Personalisasi Polis",
    description: "Sesuaikan polis dengan kebutuhanmu. Cakupan dan perlindungan jadi lebih relevan.",
  },
];

export default function Services() {
  return (
    <section id="layanan" className="bg-[#0D0D0D] overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] rounded-full blur-[140px]" style={{ backgroundColor: "rgba(46, 125, 111, 0.02)" }} />

      <div className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <AnimatedSection className="text-center mb-20 lg:mb-24">
            <div className="flex justify-center mb-5">
              <div className="w-8 h-[2px] bg-[#2E7D6F]" />
            </div>
            <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">
              Our Services
            </span>
            <TextReveal
              text="Built around your peace of mind"
              as="h2"
              className="text-4xl lg:text-5xl xl:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-5 leading-[1.1]"
              delay={0.15}
              staggerDelay={0.05}
            />
          </AnimatedSection>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.12}>
                <div className="rounded-xl p-9 h-full bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm group hover:border-[#2E7D6F]/20 hover:-translate-y-[1px] transition-all duration-700 relative overflow-hidden">
                  {/* Emerald line at top on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2E7D6F]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Subtle ambient light on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2E7D6F]/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-[#2E7D6F]/[0.07] border border-[#2E7D6F]/10 flex items-center justify-center mb-7 group-hover:bg-[#2E7D6F]/[0.12] group-hover:border-[#2E7D6F]/15 transition-colors duration-700">
                      <service.icon className="w-6 h-6 text-[#2E7D6F]" />
                    </div>
                    <h3 className="text-lg font-semibold font-[family-name:var(--font-montserrat)] text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-white/40 leading-[1.7] text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
