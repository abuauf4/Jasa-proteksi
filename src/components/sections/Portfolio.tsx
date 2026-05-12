"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";

const cars = [
  { name: "Pajero Sport", category: "SUV", price: "Mulai Rp 599 Juta", image: "/images/pajero-sport.png" },
  { name: "Xpander", category: "MPV", price: "Mulai Rp 279 Juta", image: "/images/xpander.png" },
  { name: "Xpander Cross", category: "MPV", price: "Mulai Rp 329 Juta", image: "/images/xpander-cross.png" },
  { name: "Triton", category: "Pickup", price: "Mulai Rp 399 Juta", image: "/images/triton.png" },
  { name: "Outlander PHEV", category: "SUV", price: "Mulai Rp 899 Juta", image: "/images/outlander.png" },
  { name: "L300", category: "Pickup", price: "Mulai Rp 199 Juta", image: "/images/l300.png" },
];

const categories = ["Semua", "SUV", "MPV", "Pickup"];

export default function Portfolio() {
  const [active, setActive] = useState("Semua");

  const filtered = active === "Semua" ? cars : cars.filter((c) => c.category === active);

  return (
    <SectionWrapper id="model" dark>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Our Models</span>
          <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4">
            Pilih Kendaraan Anda
          </h2>
        </AnimatedSection>

        {/* Filter Tabs */}
        <AnimatedSection delay={0.15} className="flex justify-center mb-12">
          <div className="inline-flex gap-1 p-1 rounded-lg bg-white/5 border border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 text-sm font-medium tracking-wider transition-all duration-300 rounded-md ${
                  active === cat
                    ? "bg-[#c9a84c] text-[#00001f]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((car, i) => (
            <AnimatedSection key={car.name} delay={i * 0.1}>
              <div className="glass-dark rounded-xl overflow-hidden group hover:border-[#c9a84c]/30 transition-all duration-500">
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-[#0a0a2e]">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-white">
                      {car.name}
                    </h3>
                    <span className="text-xs tracking-wider text-[#c9a84c] border border-[#c9a84c]/30 px-2 py-0.5 rounded">
                      {car.category}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[#c9a84c] font-[family-name:var(--font-montserrat)] mb-5">
                    {car.price}
                  </p>
                  <a
                    href="#kontak"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#c9a84c]/40 text-[#c9a84c] text-sm font-medium tracking-wider hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 group/btn"
                  >
                    Lihat Detail
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
