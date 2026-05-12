"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const galleryItems = [
  { src: "/images/gallery-3.png", category: "Eksterior", title: "Coastal Drive" },
  { src: "/images/gallery-1.png", category: "Interior", title: "Premium Dashboard" },
  { src: "/images/gallery-2.png", category: "Detail", title: "Alloy Wheel" },
  { src: "/images/gallery-4.png", category: "Eksterior", title: "Front Grille" },
  { src: "/images/gallery-6.png", category: "Detail", title: "Leather Stitching" },
  { src: "/images/hero-car.png", category: "Eksterior", title: "Showroom" },
];

const categories = ["Semua", "Eksterior", "Interior", "Detail"];

export default function Gallery() {
  const [active, setActive] = useState("Semua");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === "Semua" ? galleryItems : galleryItems.filter((g) => g.category === active);

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightbox === null) return;
    if (direction === "prev") {
      setLightbox(lightbox === 0 ? filtered.length - 1 : lightbox - 1);
    } else {
      setLightbox(lightbox === filtered.length - 1 ? 0 : lightbox + 1);
    }
  };

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
            text="Galeri Kami"
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4"
            delay={0.1}
          />
        </AnimatedSection>

        {/* Filter */}
        <AnimatedSection delay={0.15} className="flex justify-center mb-10">
          <div className="inline-flex gap-1 p-1 rounded-lg bg-white/5 border border-white/5">
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

        {/* Horizontal Scroll Gallery */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#00001f] to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#00001f] to-transparent z-10 pointer-events-none" />

          <div className="horizontal-scroll py-2">
            {filtered.map((item, i) => {
              const isFirst = i === 0;
              const isLast = i === filtered.length - 1;
              return (
                <motion.div
                  key={item.src}
                  className={`relative group cursor-pointer overflow-hidden rounded-xl ${
                    isFirst || isLast ? "" : ""
                  }`}
                  style={{ width: "380px", height: "280px" }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setLightbox(i)}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="380px"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-[#00001f]/0 group-hover:bg-[#00001f]/60 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <ZoomIn className="w-8 h-8 text-[#c9a84c] mx-auto mb-2" />
                      <p className="text-white font-medium font-[family-name:var(--font-montserrat)]">{item.title}</p>
                      <p className="text-[#c9a84c] text-xs tracking-wider mt-1">{item.category}</p>
                    </div>
                  </div>
                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#00001f]/50 to-transparent pointer-events-none" />
                </motion.div>
              );
            })}
            {/* Duplicate first items for smooth loop feel */}
            {filtered.slice(0, 2).map((item, i) => (
              <div
                key={`dup-${item.src}`}
                className="relative group cursor-pointer overflow-hidden rounded-xl opacity-30"
                style={{ width: "380px", height: "280px" }}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="380px"
                />
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="flex items-center justify-center gap-2 mt-6 text-white/30">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-[10px] tracking-[0.2em] uppercase">Geser untuk melihat lebih banyak</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[70] bg-[#00001f]/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-[#c9a84c] transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation arrows */}
          <button
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-colors"
            onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-colors"
            onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[80vh] w-full" onClick={(e) => e.stopPropagation()}>
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={filtered[lightbox]?.src || ""}
                alt={filtered[lightbox]?.title || ""}
                width={1200}
                height={800}
                className="object-contain max-h-[80vh] w-auto mx-auto rounded-lg"
              />
            </motion.div>
            <div className="flex items-center justify-center gap-3 mt-4">
              <p className="text-white font-[family-name:var(--font-montserrat)]">
                {filtered[lightbox]?.title}
              </p>
              <span className="text-[#c9a84c] text-xs tracking-wider">•</span>
              <p className="text-[#c9a84c] text-xs tracking-wider">
                {lightbox + 1} / {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
