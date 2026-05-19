"use client";

import { useState } from "react";
import { Car, Bike, Plane, PawPrint, Zap, UserCheck, ArrowRight, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import { products } from "@/lib/products";

const categories = ["Semua", "Kendaraan", "Perjalanan", "Hewan", "Personal"];

const iconMap: Record<string, React.ElementType> = {
  "asuransi-mobil": Car,
  "asuransi-motor": Bike,
  "asuransi-perjalanan": Plane,
  "asuransi-hewan-peliharaan": PawPrint,
  "asuransi-motor-listrik": Zap,
  "asuransi-kecelakaan-diri": UserCheck,
};

export default function Portfolio() {
  const [active, setActive] = useState("Semua");

  const filtered = active === "Semua" ? products : products.filter((p) => p.category === active);

  return (
    <section id="model" className="bg-white overflow-hidden">
      <div className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-[#2E7D6F]" />
                <span className="text-xs tracking-[0.3em] text-[#2E7D6F] uppercase font-medium">
                  Our Products
                </span>
              </div>
              <AnimatedSection>
                <TextReveal
                  text="Protection for every moment"
                  as="h2"
                  className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-[#0D0D0D]"
                  delay={0.15}
                />
              </AnimatedSection>
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex gap-1 p-1 rounded-lg bg-gray-50 border border-gray-100 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-4 py-1.5 text-xs font-medium tracking-wider transition-all duration-500 rounded-md ${
                    active === cat
                      ? "bg-[#2E7D6F] text-white"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {filtered.map((product, i) => {
                const IconComponent = iconMap[product.slug] || Shield;
                return (
                  <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="rounded-xl overflow-hidden h-full flex flex-col bg-white border border-gray-100 hover:border-[#2E7D6F]/30 transition-all duration-500 hover:shadow-sm group">
                      {/* Icon Header */}
                      <div className="relative h-[180px] overflow-hidden bg-gradient-to-br from-[#0A0F1E] to-[#141B30] flex items-center justify-center">
                        <div className="text-center">
                          <IconComponent className="w-14 h-14 text-[#2E7D6F]/50 mx-auto mb-3 group-hover:text-[#3A9B8A] transition-colors duration-500" />
                          <span className="text-lg font-bold text-white/30 font-[family-name:var(--font-montserrat)]">
                            {product.name}
                          </span>
                        </div>
                        {/* Discount Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] tracking-wider text-white bg-[#2E7D6F] px-2.5 py-1 rounded font-bold">
                            {product.discount}
                          </span>
                        </div>
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="text-[9px] tracking-wider text-[#2E7D6F] border border-[#2E7D6F]/40 px-2 py-0.5 rounded bg-[#0A0F1E]/60 backdrop-blur-sm">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] text-[#0D0D0D] mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xl font-bold text-[#2E7D6F] font-[family-name:var(--font-montserrat)] mb-3">
                          {product.price}
                        </p>

                        {/* Highlights */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {product.highlights.slice(0, 4).map((h) => (
                            <div key={h.label} className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                              <Shield className="w-3 h-3 text-[#2E7D6F] flex-shrink-0" />
                              <span>{h.value}</span>
                            </div>
                          ))}
                        </div>

                        <p className="text-gray-500 text-xs leading-relaxed mb-5 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="mt-auto">
                          <a
                            href="#kontak"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-[#2E7D6F]/40 text-[#2E7D6F] text-xs font-medium tracking-wider hover:bg-[#2E7D6F] hover:text-white transition-all duration-500 group/btn"
                          >
                            Lihat Detail
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-500" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
