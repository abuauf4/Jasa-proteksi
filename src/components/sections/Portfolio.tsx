"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Cog, Users, Gauge, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionPattern from "@/components/shared/SectionPattern";
import GradientMesh from "@/components/shared/GradientMesh";
import FloatingParticles from "@/components/shared/FloatingParticles";
import MagneticButton from "@/components/shared/MagneticButton";
import SpotlightCard from "@/components/shared/SpotlightCard";
import { cars } from "@/lib/cars";

const categories = ["Semua", "SUV", "MPV", "Pickup"];

export default function Portfolio() {
  const [active, setActive] = useState("Semua");
  const [selectedCar, setSelectedCar] = useState<typeof cars[0] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = active === "Semua" ? cars : cars.filter((c) => c.category === active);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 340;
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  return (
    <section id="model" className="snap-section bg-[#00001f] overflow-hidden">
      <SectionPattern pattern="art-deco-fan" />
      <GradientMesh variant="deep-ocean" />
      <FloatingParticles count={15} />

      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="gold-line" />
                <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Our Models</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-white">
                Pilih Kendaraan Anda
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex gap-1 p-1 rounded-lg bg-white/5 border border-white/5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActive(cat); setSelectedCar(null); }}
                  className={`px-4 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 rounded-md ${
                    active === cat
                      ? "bg-[#c9a84c] text-[#00001f]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - Split Layout */}
          <div className="flex gap-6 items-stretch" style={{ height: "calc(100dvh - 200px)", minHeight: "400px" }}>
            {/* Left - Car List (Horizontal Scroll) */}
            <div className="flex-1 relative">
              {/* Scroll buttons */}
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 backdrop-blur-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 backdrop-blur-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Car Cards - Horizontal Scroll */}
              <div
                ref={scrollRef}
                className="horizontal-scroll h-full pb-2"
                style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
              >
                {filtered.map((car, i) => (
                  <motion.div
                    key={car.slug}
                    className="w-[280px] sm:w-[300px] h-full flex-shrink-0"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <SpotlightCard className="h-full" spotlightColor="rgba(201, 168, 76, 0.06)">
                      <div
                        className={`glass-dark rounded-xl overflow-hidden h-full flex flex-col cursor-pointer transition-all duration-500 ${
                          selectedCar?.slug === car.slug
                            ? "border-[#c9a84c]/60 ring-1 ring-[#c9a84c]/30"
                            : "border-white/5 hover:border-[#c9a84c]/30"
                        }`}
                        onClick={() => setSelectedCar(selectedCar?.slug === car.slug ? null : car)}
                      >
                        {/* Image */}
                        <div className="relative h-[45%] overflow-hidden bg-[#0a0a2e]">
                          <Image
                            src={car.image}
                            alt={car.name}
                            fill
                            className="object-contain p-3 group-hover:scale-110 transition-transform duration-700"
                            sizes="300px"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="text-[9px] tracking-wider text-[#c9a84c] border border-[#c9a84c]/30 px-2 py-0.5 rounded bg-[#00001f]/60 backdrop-blur-sm">
                              {car.category}
                            </span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] text-white mb-1">
                            {car.name}
                          </h3>
                          <p className="text-xl font-bold text-[#c9a84c] font-[family-name:var(--font-montserrat)] mb-3">
                            {car.price}
                          </p>

                          {/* Specs - compact */}
                          <div className="flex gap-3 mb-3 text-white/40 text-[10px]">
                            <span className="flex items-center gap-1"><Gauge className="w-3 h-3 text-[#c9a84c]/70" />{car.engine}</span>
                          </div>
                          <div className="flex gap-3 mb-4 text-white/40 text-[10px]">
                            <span className="flex items-center gap-1"><Cog className="w-3 h-3 text-[#c9a84c]/70" />{car.transmission}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3 text-[#c9a84c]/70" />{car.seats}</span>
                          </div>

                          <div className="mt-auto">
                            <MagneticButton
                              href={`/model/${car.slug}`}
                              className="inline-flex items-center gap-2 px-4 py-2 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-medium tracking-wider hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 group/btn shine-button"
                            >
                              Lihat Detail
                              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </MagneticButton>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right - Featured Car Detail (desktop only) */}
            <AnimatePresence mode="wait">
              {selectedCar && (
                <motion.div
                  className="hidden lg:block w-[380px] flex-shrink-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="glass-dark rounded-xl border border-[#c9a84c]/30 h-full flex flex-col overflow-hidden gradient-border">
                    {/* Large Image */}
                    <div className="relative h-[55%] bg-[#0a0a2e] overflow-hidden">
                      <Image
                        src={selectedCar.image}
                        alt={selectedCar.name}
                        fill
                        className="object-contain p-6"
                        sizes="380px"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] tracking-wider text-[#c9a84c] border border-[#c9a84c]/30 px-2 py-0.5 rounded bg-[#00001f]/80 backdrop-blur-sm">
                          {selectedCar.category}
                        </span>
                      </div>
                    </div>

                    {/* Detail */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-1">
                        {selectedCar.name}
                      </h3>
                      <p className="text-2xl font-bold text-[#c9a84c] font-[family-name:var(--font-montserrat)] mb-3">
                        {selectedCar.price}
                      </p>
                      <p className="text-white/50 text-sm leading-relaxed mb-4">
                        {selectedCar.description}
                      </p>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-center">
                          <Gauge className="w-4 h-4 text-[#c9a84c] mx-auto mb-1" />
                          <p className="text-[10px] text-white/50">{selectedCar.engine}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-center">
                          <Cog className="w-4 h-4 text-[#c9a84c] mx-auto mb-1" />
                          <p className="text-[10px] text-white/50">{selectedCar.transmission}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-center">
                          <Users className="w-4 h-4 text-[#c9a84c] mx-auto mb-1" />
                          <p className="text-[10px] text-white/50">{selectedCar.seats}</p>
                        </div>
                      </div>

                      <div className="mt-auto flex gap-3">
                        <MagneticButton
                          href={`/model/${selectedCar.slug}`}
                          className="flex-1 text-center py-2.5 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold tracking-wider hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 shine-button rounded-lg"
                          strength={0.15}
                        >
                          FULL DETAIL
                        </MagneticButton>
                        <MagneticButton
                          href="https://wa.me/6289662524542"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2.5 bg-[#25D366] text-white text-xs font-semibold tracking-wider hover:bg-[#20bd5a] transition-all duration-300 shine-button rounded-lg"
                          strength={0.15}
                        >
                          CHAT WA
                        </MagneticButton>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
