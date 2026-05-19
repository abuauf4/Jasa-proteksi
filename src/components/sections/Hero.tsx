"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, Shield, ArrowRight } from "lucide-react";
import TextReveal from "@/components/shared/TextReveal";

// Cinematic ease curve — smooth, deliberate, premium
const cinematicEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Slower, more graceful parallax transforms
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const overlay1Y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const overlay2Y = useTransform(scrollYProgress, [0, 1], ["0%", "3%"]);

  return (
    <section
      id="beranda"
      ref={sectionRef}
      className="relative h-screen min-h-[700px] flex items-center overflow-hidden"
    >
      {/* ── Gradient Background ── */}
      <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#0A0F1E] to-[#0D0D0D]" />

        {/* Subtle ambient glow orbs — emerald, very low opacity */}
        <div
          className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(46, 125, 111, 0.04)" }}
        />
        <div
          className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ backgroundColor: "rgba(46, 125, 111, 0.03)" }}
        />
        <div
          className="absolute top-[55%] left-[50%] w-[350px] h-[350px] rounded-full blur-[110px]"
          style={{ backgroundColor: "rgba(46, 125, 111, 0.03)" }}
        />
      </motion.div>

      {/* ── Gradient overlay — Parallax Layer 2 ── */}
      <motion.div className="absolute inset-0" style={{ y: overlay1Y }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/85 via-[#0D0D0D]/50 to-transparent" />
      </motion.div>

      {/* ── Bottom gradient — Parallax Layer 3 ── */}
      <motion.div className="absolute inset-0" style={{ y: overlay2Y }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/20" />
      </motion.div>

      {/* ── Noise texture overlay ── */}
      <div className="noise-overlay absolute inset-0" />

      {/* ── Ambient dust particles — slow, subtle, luxury ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => {
          const size = 1 + Math.random() * 1.5;
          const left = 10 + i * 10 + Math.random() * 5;
          const top = 15 + i * 9 + Math.random() * 5;
          const duration = 6 + i * 0.8;
          const drift = -(15 + i * 3);

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                backgroundColor: "rgba(184, 184, 184, 0.15)",
              }}
              animate={{
                y: [0, drift, 0],
                opacity: [0.08, 0.18, 0.08],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            />
          );
        })}
      </div>

      {/* ── Content — Parallax Layer 4 ── */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-2xl">
          {/* Subtle label */}
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: cinematicEase }}
          >
            <div
              className="h-[1px] w-[48px]"
              style={{
                background:
                  "linear-gradient(90deg, #2E7D6F, #3A9B8A, #2E7D6F)",
              }}
            />
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] text-[#B8B8B8]/60 font-medium uppercase">
              Insurtech Terpercaya
            </span>
          </motion.div>

          {/* Main heading — Text Reveal */}
          <TextReveal
            text="Protection for what truly matters."
            as="h1"
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-[family-name:var(--font-montserrat)] text-[#F5F5F0] leading-[1.1] mb-5"
            delay={0.5}
            staggerDelay={0.06}
          />

          {/* Emerald accent subheading */}
          <motion.p
            className="text-xl sm:text-2xl lg:text-3xl font-light text-[#2E7D6F] font-[family-name:var(--font-montserrat)] mb-8"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 1,
              ease: cinematicEase,
            }}
          >
            Jasa Proteksi
          </motion.p>

          {/* Tagline */}
          <motion.p
            className="text-sm sm:text-base lg:text-lg text-[#F5F5F0]/50 max-w-md mb-12 leading-relaxed tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: cinematicEase }}
          >
            Peace of mind for the modern world. Insurance that moves with your
            life.
          </motion.p>

          {/* CTA Buttons — calm, elegant, no magnetic */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6, ease: cinematicEase }}
          >
            {/* Primary CTA — emerald bg */}
            <a
              href="#model"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#2E7D6F] text-[#0D0D0D] font-medium tracking-wider text-sm rounded-sm transition-all duration-500 hover:bg-[#3A9B8A] hover:shadow-[0_0_30px_rgba(46,125,111,0.15)]"
            >
              <Shield className="w-4 h-4 transition-transform duration-500 group-hover:scale-110" />
              Discover Coverage
            </a>

            {/* Secondary CTA — bordered */}
            <a
              href="#kontak"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-[#2E7D6F]/60 text-[#2E7D6F] font-medium tracking-wider text-sm rounded-sm transition-all duration-500 hover:bg-[#2E7D6F]/10 hover:border-[#2E7D6F] hover:shadow-[0_0_30px_rgba(46,125,111,0.08)]"
            >
              Get Protected
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll indicator — elegant, emerald ── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1, ease: cinematicEase }}
      >
        <span className="text-[9px] tracking-[0.35em] text-[#B8B8B8]/30 uppercase font-light">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-4 h-4 text-[#2E7D6F]/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
