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
    description: "Produk pilihan yang pas banget buat kebutuhanmu. Personalisasi sesuai gaya hidupmu.",
  },
  {
    icon: Headphones,
    title: "Telesales yang Ramah",
    description: "Tenang saja, tim kami siap untuk membantumu pilih asuransi yang tepat via telepon atau WhatsApp.",
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
    description: "Sesuaikan polis dengan kebutuhan dan preferensimu. Cakupan dan perlindungan jadi lebih relevan.",
  },
];

export default function Services() {
  return (
    <section id="layanan" className="bg-[#0D0D0D] overflow-hidden relative">
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <AnimatedSection className="text-center mb-16 lg:mb-20">
            <div className="flex justify-center mb-4">
              <div className="w-8 h-[2px] bg-[#2E7D6F]" />
            </div>
            <span className="text-xs tracking-[0.3em] text-[#2E7D6F] uppercase font-medium">
              Our Services
            </span>
            <TextReveal
              text="Built around your peace of mind"
              as="h2"
              className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4"
              delay={0.15}
            />
          </AnimatedSection>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.15}>
                <div className="rounded-xl p-8 h-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm group hover:border-[#2E7D6F]/25 hover:-translate-y-[1px] transition-all duration-500 relative overflow-hidden">
                  {/* Emerald line at top on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2E7D6F]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="w-12 h-12 rounded-lg bg-[#2E7D6F]/10 flex items-center justify-center mb-6 group-hover:bg-[#2E7D6F]/20 transition-colors duration-500">
                    <service.icon className="w-6 h-6 text-[#2E7D6F]" />
                  </div>
                  <h3 className="text-xl font-semibold font-[family-name:var(--font-montserrat)] text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
