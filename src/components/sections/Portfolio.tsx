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
      <div className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-[2px] bg-[#c9a84c]" />
                <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Our Products</span>
              </div>
              <AnimatedSection>
                <TextReveal
                  text="Pilih Produk Asuransimu"
                  as="h2"
                  className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-[#1a1a2e]"
                  delay={0.1}
                />
              </AnimatedSection>
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex gap-1 p-1 rounded-lg bg-gray-100 border border-gray-200 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-4 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 rounded-md ${
                    active === cat
                      ? "bg-[#c9a84c] text-white"
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <div className="rounded-xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-lg border border-gray-200 hover:border-[#c9a84c]/40 bg-white group">
                      {/* Icon Header */}
                      <div className="relative h-[180px] overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#2a2a4e] flex items-center justify-center">
                        <div className="text-center">
                          <IconComponent className="w-14 h-14 text-[#c9a84c]/50 mx-auto mb-3 group-hover:text-[#c9a84c] transition-colors duration-300" />
                          <span className="text-lg font-bold text-white/30 font-[family-name:var(--font-montserrat)]">{product.name}</span>
                        </div>
                        {/* Discount Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] tracking-wider text-[#00001f] bg-[#c9a84c] px-2.5 py-1 rounded font-bold">
                            {product.discount}
                          </span>
                        </div>
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="text-[9px] tracking-wider text-white border border-white/20 px-2 py-0.5 rounded bg-[#00001f]/60 backdrop-blur-sm">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] text-[#1a1a2e] mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xl font-bold text-[#c9a84c] font-[family-name:var(--font-montserrat)] mb-3">
                          {product.price}
                        </p>

                        {/* Highlights - compact */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {product.highlights.slice(0, 4).map((h) => (
                            <div key={h.label} className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                              <Shield className="w-3 h-3 text-[#c9a84c] flex-shrink-0" />
                              <span>{h.value}</span>
                            </div>
                          ))}
                        </div>

                        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="mt-auto">
                          <a
                            href="#kontak"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-medium tracking-wider hover:bg-[#c9a84c] hover:text-white transition-all duration-300 group/btn"
                          >
                            Lihat Detail
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
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
