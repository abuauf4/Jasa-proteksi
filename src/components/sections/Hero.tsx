"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ChevronDown, Calendar, ArrowRight } from "lucide-react";
import CountdownTimer from "@/components/shared/CountdownTimer";
import TextReveal from "@/components/shared/TextReveal";
import MagneticButton from "@/components/shared/MagneticButton";

const promoDate = new Date();
promoDate.setDate(promoDate.getDate() + 30);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Multi-layer parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const overlay1Y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const overlay2Y = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

  return (
    <section id="beranda" ref={sectionRef} className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image - Parallax Layer 1 (slowest) */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
        <Image
          src="/images/hero-car.png"
          alt="Mitsubishi Pajero Sport in luxury showroom"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Gradient overlay - Parallax Layer 2 */}
      <motion.div className="absolute inset-0" style={{ y: overlay1Y }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00001f]/90 via-[#00001f]/60 to-transparent" />
      </motion.div>

      {/* Bottom gradient - Parallax Layer 3 */}
      <motion.div className="absolute inset-0" style={{ y: overlay2Y }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#00001f] via-transparent to-[#00001f]/30" />
      </motion.div>

      {/* Noise texture */}
      <div className="noise-overlay absolute inset-0" />

      {/* Decorative particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#c9a84c]/20"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content - Parallax Layer 4 (fastest) */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-2xl">
          {/* Small label */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="gold-line animate-line-expand" />
            <span className="text-xs sm:text-sm tracking-[0.25em] text-[#c9a84c] font-medium uppercase">
              Drive your Ambition
            </span>
          </motion.div>

          {/* Main heading - Text Reveal */}
          <TextReveal
            text="Drive Your Dreams"
            as="h1"
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold font-[family-name:var(--font-montserrat)] text-white leading-[1.05] mb-4"
            delay={0.4}
            staggerDelay={0.04}
          />

          {/* Subheading */}
          <motion.p
            className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#c9a84c] font-[family-name:var(--font-montserrat)] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            with Mitsubishi
          </motion.p>

          {/* Tagline */}
          <motion.p
            className="text-base sm:text-lg text-white/60 max-w-md mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            Pengalaman berkendara premium dimulai di sini
          </motion.p>

          {/* CTA Buttons - Magnetic */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <MagneticButton
              href="#kontak"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#00001f] font-semibold tracking-wider text-sm hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 shine-button"
            >
              <Calendar className="w-4 h-4" />
              SCHEDULE TEST DRIVE
            </MagneticButton>
            <MagneticButton
              href="#model"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#c9a84c] text-[#c9a84c] font-semibold tracking-wider text-sm hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 shine-button"
            >
              EXPLORE MODELS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 text-[#c9a84c] animate-scroll-indicator" />
      </motion.div>

      {/* Countdown Timer - glass card */}
      <motion.div
        className="absolute bottom-8 right-4 sm:right-8 lg:right-12 z-10 hidden sm:block"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="glass rounded-lg p-4 animate-glow-pulse">
          <p className="text-[10px] tracking-[0.2em] text-[#c9a84c] uppercase mb-3 font-medium">
            Promo Berakhir Dalam
          </p>
          <CountdownTimer targetDate={promoDate} compact />
        </div>
      </motion.div>
    </section>
  );
}
