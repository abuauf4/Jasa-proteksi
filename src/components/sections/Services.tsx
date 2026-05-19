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

      <div className="py-28 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <AnimatedSection className="text-center mb-24 lg:mb-32">
            <div className="flex justify-center mb-6">
              <div className="w-8 h-[2px] bg-[#2E7D6F]" />
            </div>
            <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">
              Our Services
            </span>
            <TextReveal
              text="Built around your peace of mind"
              as="h2"
              className="text-4xl lg:text-5xl xl:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-6 leading-[1.1]"
              delay={0.15}
              staggerDelay={0.05}
            />
          </AnimatedSection>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.1}>
                <div className="glass-card premium-top-line soft-glow-hover rounded-xl p-10 h-full group hover:-translate-y-[2px] transition-all duration-800">
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-[#2E7D6F]/[0.07] border border-[#2E7D6F]/10 flex items-center justify-center mb-8 group-hover:bg-[#2E7D6F]/[0.12] group-hover:border-[#2E7D6F]/15 transition-colors duration-800">
                      <service.icon className="w-6 h-6 text-[#2E7D6F]" />
                    </div>
                    <h3 className="text-lg font-semibold font-[family-name:var(--font-montserrat)] text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-white/40 leading-[1.8] text-sm">
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
