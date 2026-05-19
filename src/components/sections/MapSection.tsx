"use client";

import { MapPin, Navigation } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";

export default function MapSection() {
  return (
    <section id="lokasi" className="relative bg-[#00001f] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-white">
            Lokasi Kami
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="relative rounded-xl overflow-hidden border border-white/10 h-80 bg-[#0a0a2e]">
            {/* Map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#c9a84c]/20 flex items-center justify-center mx-auto mb-4 animate-pulse-gold">
                  <MapPin className="w-8 h-8 text-[#c9a84c]" />
                </div>
                <p className="text-white/60 text-sm mb-1">Jasa Proteksi Indonesia</p>
                <p className="text-white/40 text-xs">Menara Anugrah Lantai 23, Kawasan Mega Kuningan, Jakarta Selatan</p>
              </div>
            </div>
            {/* Decorative grid lines */}
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full" style={{
                backgroundImage: "linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }} />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3} className="mt-6 text-center">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#c9a84c]/40 text-[#c9a84c] font-medium tracking-wider text-sm hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
