"use client";

import Image from "next/image";
import { Calendar, Phone, Shield, Wrench, Award } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import CountdownTimer from "@/components/shared/CountdownTimer";

const promoDate = new Date();
promoDate.setDate(promoDate.getDate() + 30);

const trustBadges = [
  { icon: Shield, label: "Garansi 3 Tahun / 100.000 km" },
  { icon: Wrench, label: "Servis Resmi" },
  { icon: Award, label: "349 Dealer Resmi" },
];

export default function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-car.png"
          alt="Luxury car background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#00001f]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00001f] via-transparent to-[#00001f]/50" />
        <div className="noise-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6 leading-tight">
            Siap Mengemudi Mobil
            <br />
            <span className="text-[#c9a84c]">Impian Anda?</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Booking test drive sekarang dan dapatkan promo eksklusif
          </p>
        </AnimatedSection>

        {/* CTA Buttons */}
        <AnimatedSection delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#kontak"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#00001f] font-semibold tracking-wider text-sm hover:bg-[#dfc06f] transition-all duration-300"
            >
              <Calendar className="w-4 h-4" />
              BOOK TEST DRIVE
            </a>
            <a
              href="https://wa.me/6281113011300"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold tracking-wider text-sm hover:bg-[#20bd5a] transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              HUBUNGI VIA WHATSAPP
            </a>
          </div>
        </AnimatedSection>

        {/* Trust Badges */}
        <AnimatedSection delay={0.3}>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10 mb-10">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2">
                <badge.icon className="w-5 h-5 text-[#c9a84c]" />
                <span className="text-white/60 text-sm tracking-wider">{badge.label}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Countdown */}
        <AnimatedSection delay={0.4}>
          <div className="inline-block">
            <div className="glass rounded-lg p-5">
              <p className="text-[10px] tracking-[0.2em] text-[#c9a84c] uppercase mb-3 font-medium text-center">
                Promo Berakhir Dalam
              </p>
              <CountdownTimer targetDate={promoDate} />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
