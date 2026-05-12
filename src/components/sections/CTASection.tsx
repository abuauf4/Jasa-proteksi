"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Shield, Wrench, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CountdownTimer } from "@/components/shared/CountdownTimer";

const trustBadges = [
  { icon: Shield, label: "Garansi 5 Tahun" },
  { icon: Wrench, label: "Servis Resmi" },
  { icon: Award, label: "Mitra Resmi Mitsubishi" },
];

export default function CTASection() {
  const promoDate = new Date();
  promoDate.setDate(promoDate.getDate() + 30);

  return (
    <SectionWrapper id="cta" className="py-0">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#2a2a4e] to-[#0f0f1a]">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-4">
              Siap Mengemudi Mobil Impian Anda?
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Booking test drive sekarang dan dapatkan promo eksklusif
            </p>

            {/* Countdown */}
            <div className="mb-8">
              <p className="text-white/50 text-sm mb-3 uppercase tracking-widest">
                Promo berakhir dalam
              </p>
              <CountdownTimer targetDate={promoDate} className="justify-center" />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 h-14"
                >
                  <a href="#kontak">
                    <Phone className="w-5 h-5 mr-2" />
                    Book Test Drive
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold text-lg px-8 h-14"
                >
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Hubungi via WhatsApp
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-white/60">
                  <badge.icon className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </SectionWrapper>
  );
}
