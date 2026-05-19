"use client";

import { useState } from "react";
import { Shield, Plane, PawPrint, Zap, UserCheck, Award, ZoomIn } from "lucide-react";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const galleryItems = [
  { icon: Shield, category: "Kendaraan", title: "Asuransi Mobil & Motor", color: "from-[#141B30]/60 to-[#0A0F1E]/30" },
  { icon: Plane, category: "Perjalanan", title: "Perlindungan Perjalanan", color: "from-[#141B30]/60 to-[#0A0F1E]/30" },
  { icon: PawPrint, category: "Hewan", title: "Asuransi Hewan Peliharaan", color: "from-[#141B30]/60 to-[#0A0F1E]/30" },
  { icon: Zap, category: "Kendaraan", title: "Asuransi Motor Listrik", color: "from-[#141B30]/60 to-[#0A0F1E]/30" },
  { icon: UserCheck, category: "Personal", title: "Asuransi Kecelakaan Diri", color: "from-[#141B30]/60 to-[#0A0F1E]/30" },
  { icon: Award, category: "Penghargaan", title: "Insurance Asia Awards 2025", color: "from-[#2E7D6F]/15 to-[#2E7D6F]/5" },
];

const categories = ["Semua", "Kendaraan", "Perjalanan", "Hewan", "Personal", "Penghargaan"];

export default function Gallery() {
  const [active, setActive] = useState("Semua");

  const filtered = active === "Semua" ? galleryItems : galleryItems.filter((g) => g.category === active);

  return (
    <SectionWrapper id="galeri" className="bg-[#0D0D0D]" dark>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-4">
            <div className="accent-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#2E7D6F] uppercase font-medium">Gallery</span>
          <TextReveal
            text="Produk & Penghargaan"
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4"
            delay={0.1}
          />
        </AnimatedSection>

        {/* Filter */}
        <AnimatedSection delay={0.15} className="flex justify-center mb-10">
          <div className="inline-flex gap-1 p-1 rounded-lg bg-white/5 border border-white/5 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 text-sm font-medium tracking-wider transition-all duration-300 rounded-md ${
                  active === cat ? "bg-[#2E7D6F] text-[#0D0D0D]" : "text-white/60 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              style={{ height: "280px" }}
              whileHover={{ scale: 1.01 }}
              transition-hover={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} bg-[#0A0F1E]`} />

              {/* Decorative grid - emerald lines */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full" style={{
                  backgroundImage: "linear-gradient(rgba(46,125,111,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(46,125,111,0.3) 1px, transparent 1px)",
                  backgroundSize: "30px 30px"
                }} />
              </div>

              {/* Icon & Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <item.icon className="w-16 h-16 text-[#2E7D6F]/30 mx-auto mb-4 group-hover:text-[#2E7D6F]/60 transition-colors duration-500" />
                  <p className="text-white font-medium font-[family-name:var(--font-montserrat)] text-lg group-hover:text-[#2E7D6F] transition-colors duration-500">{item.title}</p>
                  <p className="text-[#2E7D6F] text-xs tracking-wider mt-1">{item.category}</p>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#0D0D0D]/0 group-hover:bg-[#0D0D0D]/30 transition-all duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ZoomIn className="w-8 h-8 text-[#2E7D6F]" />
                </div>
              </div>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0D0D0D]/50 to-transparent pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
