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
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#0A0F1E] to-[#0D0D0D]" />
        {/* Emerald orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2E7D6F]/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#2E7D6F]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute inset-0 bg-[#0D0D0D]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/50" />
        <div className="noise-overlay absolute inset-0" />
      </div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2E7D6F]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2E7D6F]/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <TextReveal
            text="Ready for peace of mind?"
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6 leading-tight"
            delay={0.1}
            staggerDelay={0.03}
          />
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Start your protection journey today
          </p>
        </AnimatedSection>

        {/* CTA Buttons */}
        <AnimatedSection delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#kontak"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2E7D6F] text-[#0D0D0D] font-semibold tracking-wider text-sm hover:bg-[#3A9B8A] transition-all duration-500 rounded-md"
            >
              <Shield className="w-4 h-4" />
              GET PROTECTED
            </a>
            <a
              href="https://wa.me/6287766860381"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold tracking-wider text-sm hover:bg-[#20bd5a] transition-all duration-500 rounded-md"
            >
              <Phone className="w-4 h-4" />
              CHAT VIA WHATSAPP
            </a>
          </div>
        </AnimatedSection>

        {/* Trust Badges */}
        <AnimatedSection delay={0.3}>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2">
                <badge.icon className="w-5 h-5 text-[#2E7D6F]" />
                <span className="text-white/60 text-sm tracking-wider">{badge.label}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
