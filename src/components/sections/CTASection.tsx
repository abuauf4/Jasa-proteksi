"use client";

import { Shield, Phone, ShieldCheck, Award, Clock } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const trustBadges = [
  { icon: ShieldCheck, label: "Berizin & Diawasi OJK" },
  { icon: Award, label: "Insurance Asia Awards 2025" },
  { icon: Clock, label: "Proses di Bawah 3 Menit" },
];

export default function CTASection() {
  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#0A0F1E] to-[#0D0D0D]" />
        {/* Emerald orbs — more subtle */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2E7D6F]/[0.02] rounded-full blur-3xl animate-breathe-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#2E7D6F]/[0.02] rounded-full blur-3xl animate-breathe-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-[#0D0D0D]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/40" />
        <div className="noise-overlay absolute inset-0" />
      </div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2E7D6F]/15 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2E7D6F]/15 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <TextReveal
            text="Ready for peace of mind?"
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-7 leading-[1.1]"
            delay={0.1}
            staggerDelay={0.04}
          />
          <p className="text-white/40 text-base lg:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Start your protection journey today
          </p>
        </AnimatedSection>

        {/* CTA Buttons */}
        <AnimatedSection delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-14">
            <a
              href="#kontak"
              className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-[#2E7D6F] text-[#0D0D0D] font-semibold tracking-wider text-sm hover:bg-[#3A9B8A] transition-all duration-600 rounded-md"
            >
              <Shield className="w-4 h-4" />
              GET PROTECTED
            </a>
            <a
              href="https://wa.me/6287766860381"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-[#25D366] text-white font-semibold tracking-wider text-sm hover:bg-[#20bd5a] transition-all duration-600 rounded-md"
            >
              <Phone className="w-4 h-4" />
              CHAT VIA WHATSAPP
            </a>
          </div>
        </AnimatedSection>

        {/* Trust Badges */}
        <AnimatedSection delay={0.3}>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2.5">
                <badge.icon className="w-4 h-4 text-[#2E7D6F]/70" />
                <span className="text-white/40 text-sm tracking-wider">{badge.label}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
