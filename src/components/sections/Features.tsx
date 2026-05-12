"use client";

import Image from "next/image";
import { Cpu, ShieldCheck, Gem, Clock, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";

const features = [
  {
    icon: Cpu,
    title: "Teknologi MIVEC",
    description: "Mesin dengan teknologi Mitsubishi Innovative Valve timing Electronic Control untuk performa dan efisiensi optimal",
  },
  {
    icon: ShieldCheck,
    title: "Sistem Keselamatan",
    description: "Dilengkapi 7 Airbags, ABS, EBD, Active Stability Control, dan Hill Start Assist",
  },
  {
    icon: Gem,
    title: "Desain Premium",
    description: "Desain Dynamic Shield yang aerodinamis, elegan, dan berwibawa",
  },
  {
    icon: Clock,
    title: "Garansi 3 Tahun / 100.000 km",
    description: "Jaminan kualitas dan ketenangan pikiran untuk setiap perjalanan Anda",
  },
];

export default function Features() {
  return (
    <SectionWrapper id="fitur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text Content */}
          <AnimatedSection direction="left">
            <div className="flex items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Why Mitsubishi</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] mb-10 leading-tight">
              Keunggulan
              <br />
              <span className="text-[#c9a84c]">Tanpa Kompromi</span>
            </h2>

            <div className="space-y-8">
              {features.map((feature, i) => (
                <AnimatedSection key={feature.title} delay={i * 0.12} direction="left">
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0">
                      <div className="w-[2px] h-full min-h-[60px] bg-gradient-to-b from-[#c9a84c] to-[#c9a84c]/20 relative">
                        <div className="absolute -left-[7px] top-0 w-4 h-4 rounded-full border-2 border-[#c9a84c] bg-background" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold font-[family-name:var(--font-montserrat)] mb-1 group-hover:text-[#c9a84c] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.5} className="mt-10">
              <a
                href="#model"
                className="inline-flex items-center gap-2 text-[#c9a84c] font-medium text-sm tracking-wider group hover:gap-3 transition-all duration-300"
              >
                Explore All Features
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </AnimatedSection>
          </AnimatedSection>

          {/* Right - Image */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#c9a84c]/10 to-transparent rounded-2xl" />
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/images/showroom-bg.png"
                  alt="Mitsubishi premium showroom interior"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Decorative frame */}
                <div className="absolute inset-0 border border-[#c9a84c]/20 rounded-xl pointer-events-none" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </SectionWrapper>
  );
}
