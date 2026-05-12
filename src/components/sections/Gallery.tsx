"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, X } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";

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

  return (
    <SectionWrapper id="galeri" dark>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Gallery</span>
          <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4">
            Galeri Kami
          </h2>
        </AnimatedSection>

        {/* Filter */}
        <AnimatedSection delay={0.15} className="flex justify-center mb-12">
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

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => {
            const isPortrait = item.src.includes("gallery-2") || item.src.includes("gallery-6");
            return (
              <AnimatedSection key={item.src} delay={i * 0.1}>
                <div
                  className={`relative group cursor-pointer overflow-hidden rounded-lg ${
                    isPortrait ? "row-span-2" : ""
                  }`}
                  onClick={() => setLightbox(i)}
                >
                  <div className={`relative ${isPortrait ? "h-[500px]" : "h-64"} lg:${isPortrait ? "h-[580px]" : "h-72"}`}>
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-[#00001f]/0 group-hover:bg-[#00001f]/60 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <ZoomIn className="w-8 h-8 text-[#c9a84c] mx-auto mb-2" />
                      <p className="text-white font-medium font-[family-name:var(--font-montserrat)]">{item.title}</p>
                      <p className="text-[#c9a84c] text-xs tracking-wider mt-1">{item.category}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
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
          <div className="relative max-w-5xl max-h-[80vh] w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filtered[lightbox]?.src || ""}
              alt={filtered[lightbox]?.title || ""}
              width={1200}
              height={800}
              className="object-contain max-h-[80vh] w-auto mx-auto rounded-lg"
            />
            <p className="text-center text-white font-[family-name:var(--font-montserrat)] mt-4">
              {filtered[lightbox]?.title}
            </p>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
