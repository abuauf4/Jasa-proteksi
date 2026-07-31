"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import GradientMesh from "@/components/shared/GradientMesh";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const trustStatements = [
  { labelKey: "about.trustStatements.secureProcess", icon: ShieldCheck },
  { labelKey: "about.trustStatements.dataProtected", icon: ShieldCheck },
  { labelKey: "about.trustStatements.trustedPartners", icon: ShieldCheck },
];

export default function About() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["1.5%", "-1.5%"]);

  return (
    <section id="tentang" className="ds-section relative overflow-hidden bg-gradient-to-br from-[#042F2E] via-[#0F172A] to-[#0C4A6E] text-white">
      {/* Gradient Mesh */}
      <GradientMesh variant="teal-aurora" />

      <div ref={sectionRef} className="relative z-10 ds-container safe-px">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 xl:gap-28 items-center">
          {/* Left - Image with parallax */}
          <AnimatedSection direction="left">
            <motion.div className="relative" style={{ y: imageY }}>
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="/about-office-team.webp"
                  alt="PT. Jasa Global Proteksi - Platform Perbandingan Asuransi Kendaraan"
                  width={672}
                  height={420}
                  loading="lazy"
                  className="w-full h-auto min-h-[320px] sm:min-h-[420px] object-cover rounded-2xl"
                />
                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#042F2E]/60 via-transparent to-transparent rounded-2xl" />
                {/* Badge overlay */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="glass-card-dark p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#14B8A6]/20 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5 text-[#14B8A6]" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold ">{t("about.secureTitle")}</p>
                      <p className="text-[#94A3B8] text-[10px] leading-relaxed">{t("about.secureDesc")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>

          {/* Right - Company Info + Stats */}
          <AnimatedSection direction="right" delay={0.15}>
            {/* Label */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="ds-accent-line" />
              <span className="ds-label text-[#14B8A6]">{t("about.label")}</span>
            </div>

            {/* Heading */}
            <TextReveal
              text="Jasa Proteksi"
              as="h2"
              className="ds-h2 font-bold  text-white mb-7 sm:mb-8"
              delay={0.1}
              staggerDelay={0.02}
            />

            {/* Description */}
            <p className="ds-body-lg text-[#94A3B8] mb-12 max-w-lg">
              {t("about.description")}
            </p>

            {/* Trust Statements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {trustStatements.map((statement, i) => (
                <div
                  key={statement.labelKey}
                  className="flex items-center gap-3.5 p-4 rounded-xl glass-card-dark transition-all duration-300 hover:border-[#14B8A6]/25"
                  style={{
                    opacity: 0,
                    transform: "translateY(16px)",
                    animation: `fadeSlideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.08}s forwards`,
                  }}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#14B8A6]/[0.10] border border-[#14B8A6]/15 flex items-center justify-center flex-shrink-0">
                    <statement.icon className="w-4 h-4 text-[#14B8A6]" />
                  </div>
                  <span className="text-sm text-[#CBD5E1] leading-relaxed">{t(statement.labelKey)}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="#kontak"
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white font-semibold tracking-wider text-sm transition-all duration-300 rounded-full shine-button"
            >
              {t("about.learnMore")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
