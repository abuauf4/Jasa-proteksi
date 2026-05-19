"use client";

import { MapPin, Navigation } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";

export default function MapSection() {
  return (
    <section id="lokasi" className="relative bg-[#0D0D0D] py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#2E7D6F]/50 to-transparent" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-white leading-[1.1]">
            Lokasi Kami
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="relative rounded-xl overflow-hidden border border-white/[0.05] h-80 bg-[#0A0F1E]">
            {/* Map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#2E7D6F]/10 flex items-center justify-center mx-auto mb-5 relative">
                  <MapPin className="w-8 h-8 text-[#2E7D6F]" />
                  {/* Subtle emerald pulse ring */}
                  <div className="absolute inset-0 rounded-full animate-ping opacity-15 bg-[#2E7D6F]" style={{ animationDuration: '3s' }} />
                </div>
                <p className="text-white/50 text-sm mb-1.5">Jasa Proteksi Indonesia</p>
                <p className="text-white/30 text-xs">Menara Anugrah Lantai 23, Kawasan Mega Kuningan, Jakarta Selatan</p>
              </div>
            </div>
            {/* Decorative grid lines */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="h-full w-full" style={{
                backgroundImage: "linear-gradient(rgba(46,125,111,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(46,125,111,0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }} />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.25} className="mt-8 text-center">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3 border border-[#2E7D6F]/30 text-[#2E7D6F] font-medium tracking-wider text-sm hover:bg-[#2E7D6F] hover:text-[#0D0D0D] transition-all duration-600"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
