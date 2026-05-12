"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Cog, Users, Gauge } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import TiltCard from "@/components/shared/TiltCard";
import SpotlightCard from "@/components/shared/SpotlightCard";
import MagneticButton from "@/components/shared/MagneticButton";

const cars = [
  {
    name: "Xpander",
    category: "MPV",
    price: "Mulai Rp 270 Juta",
    image: "/images/xpander.png",
    engine: "1.5L DOHC 16V",
    transmission: "MT & CVT",
    seats: "7 Penumpang",
  },
  {
    name: "Xpander Cross",
    category: "MPV",
    price: "Mulai Rp 331 Juta",
    image: "/images/xpander-cross.png",
    engine: "1.5L DOHC 16V",
    transmission: "MT & CVT",
    seats: "7 Penumpang",
  },
  {
    name: "Pajero Sport",
    category: "SUV",
    price: "Mulai Rp 578 Juta",
    image: "/images/pajero-sport.png",
    engine: "2.4L Diesel Turbo",
    transmission: "MT & AT",
    seats: "7 Penumpang",
  },
  {
    name: "Xforce",
    category: "SUV",
    price: "Mulai Rp 388 Juta",
    image: "/images/outlander.png",
    engine: "1.5L DOHC CVT",
    transmission: "CVT",
    seats: "5 Penumpang",
  },
  {
    name: "Destinator",
    category: "SUV",
    price: "Mulai Rp 385 Juta",
    image: "/images/outlander.png",
    engine: "1.5L Turbo",
    transmission: "CVT",
    seats: "7 Penumpang",
  },
  {
    name: "Triton",
    category: "Pickup",
    price: "Mulai Rp 307 Juta",
    image: "/images/triton.png",
    engine: "2.4L Turbo Diesel",
    transmission: "MT & AT",
    seats: "2-5 Penumpang",
  },
  {
    name: "L300",
    category: "Pickup",
    price: "Mulai Rp 233 Juta",
    image: "/images/l300.png",
    engine: "2.5L Diesel",
    transmission: "MT",
    seats: "2 Penumpang",
  },
  {
    name: "Outlander PHEV",
    category: "SUV",
    price: "Mulai Rp 1,2 M",
    image: "/images/outlander.png",
    engine: "2.0L Hybrid PHEV",
    transmission: "CVT",
    seats: "7 Penumpang",
  },
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
          <TextReveal
            text="Pilih Kendaraan Anda"
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4"
            delay={0.1}
          />
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

        {/* Cars Grid - with TiltCard + Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((car, i) => (
            <AnimatedSection key={car.name} delay={i * 0.1}>
              <TiltCard tiltStrength={6} glareEnabled>
                <SpotlightCard className="h-full" spotlightColor="rgba(201, 168, 76, 0.06)">
                  <div className="glass-dark rounded-xl overflow-hidden group hover:border-[#c9a84c]/30 transition-all duration-500 card-lift h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-[#0a0a2e]">
                      <Image
                        src={car.image}
                        alt={car.name}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] tracking-wider text-[#c9a84c] border border-[#c9a84c]/30 px-2 py-0.5 rounded bg-[#00001f]/60 backdrop-blur-sm">
                          {car.category}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-white">
                          {car.name}
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-[#c9a84c] font-[family-name:var(--font-montserrat)] mb-4">
                        {car.price}
                      </p>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 mb-5">
                        <div className="flex items-center gap-1.5 text-white/50 text-xs">
                          <Gauge className="w-3.5 h-3.5 text-[#c9a84c]/70" />
                          <span>{car.engine}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/50 text-xs">
                          <Cog className="w-3.5 h-3.5 text-[#c9a84c]/70" />
                          <span>{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/50 text-xs">
                          <Users className="w-3.5 h-3.5 text-[#c9a84c]/70" />
                          <span>{car.seats}</span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <MagneticButton
                          href="#kontak"
                          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#c9a84c]/40 text-[#c9a84c] text-sm font-medium tracking-wider hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 group/btn shine-button"
                        >
                          Lihat Detail
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </MagneticButton>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
