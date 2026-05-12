"use client";

import { Car, ClipboardCheck, Calculator, Wrench, ArrowRightLeft, Shield } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";

const services = [
  {
    icon: Car,
    title: "Penjualan Mobil Baru",
    description: "Koleksi lengkap model Mitsubishi terbaru dengan harga kompetitif dan promo eksklusif.",
  },
  {
    icon: ClipboardCheck,
    title: "Test Drive",
    description: "Rasakan langsung performa kendaraan impian Anda sebelum memutuskan.",
  },
  {
    icon: Calculator,
    title: "Simulasi Kredit",
    description: "Hitung cicilan fleksibel sesuai kemampuan dengan bunga terbaik.",
  },
  {
    icon: Wrench,
    title: "Servis & Perawatan",
    description: "Teknisi bersertifikat dengan suku cadang original untuk kendaraan Anda.",
  },
  {
    icon: ArrowRightLeft,
    title: "Trade-In",
    description: "Tukar mobil lama Anda dan dapatkan penawaran terbaik untuk mobil baru.",
  },
  {
    icon: Shield,
    title: "Asuransi",
    description: "Perlindungan menyeluruh dengan pilihan asuransi all-risk terpercaya.",
  },
];

export default function Services() {
  return (
    <SectionWrapper id="layanan" dark>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16 lg:mb-20">
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Our Services</span>
          <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4">
            Layanan Eksklusif
          </h2>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 0.1}>
              <div className="glass-dark rounded-xl p-8 group hover:border-[#c9a84c]/30 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                {/* Gold line at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-12 h-12 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center mb-6 group-hover:bg-[#c9a84c]/20 transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-[#c9a84c]" />
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
    </SectionWrapper>
  );
}
