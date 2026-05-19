"use client";

import { useState } from "react";
import { Shield, Plane, PawPrint, Zap, UserCheck, Award, ZoomIn } from "lucide-react";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const galleryItems = [
  { icon: Shield, category: "Kendaraan", title: "Asuransi Mobil & Motor", color: "from-blue-900/40 to-blue-800/20" },
  { icon: Plane, category: "Perjalanan", title: "Perlindungan Perjalanan", color: "from-cyan-900/40 to-cyan-800/20" },
  { icon: PawPrint, category: "Hewan", title: "Asuransi Hewan Peliharaan", color: "from-amber-900/40 to-amber-800/20" },
  { icon: Zap, category: "Kendaraan", title: "Asuransi Motor Listrik", color: "from-green-900/40 to-green-800/20" },
  { icon: UserCheck, category: "Personal", title: "Asuransi Kecelakaan Diri", color: "from-purple-900/40 to-purple-800/20" },
  { icon: Award, category: "Penghargaan", title: "Insurance Asia Awards 2025", color: "from-[#c9a84c]/20 to-[#c9a84c]/5" },
];

const categories = ["Semua", "Kendaraan", "Perjalanan", "Hewan", "Personal", "Penghargaan"];

export default function Gallery() {
  const [active, setActive] = useState("Semua");

  const filtered = active === "Semua" ? galleryItems : galleryItems.filter((g) => g.category === active);

  return (
    <SectionWrapper id="galeri" dark>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Gallery</span>
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
                  active === cat ? "bg-[#c9a84c] text-[#00001f]" : "text-white/60 hover:text-white"
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
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              style={{ height: "280px" }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} bg-[#0a0a2e]`} />
              
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full" style={{
                  backgroundImage: "linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)",
                  backgroundSize: "30px 30px"
                }} />
              </div>

              {/* Icon & Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <item.icon className="w-16 h-16 text-[#c9a84c]/30 mx-auto mb-4 group-hover:text-[#c9a84c]/60 transition-colors duration-500" />
                  <p className="text-white font-medium font-[family-name:var(--font-montserrat)] text-lg group-hover:text-[#c9a84c] transition-colors duration-300">{item.title}</p>
                  <p className="text-[#c9a84c] text-xs tracking-wider mt-1">{item.category}</p>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#00001f]/0 group-hover:bg-[#00001f]/30 transition-all duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-8 h-8 text-[#c9a84c]" />
                </div>
              </div>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#00001f]/50 to-transparent pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
