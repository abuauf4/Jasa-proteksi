"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Award, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const stats = [
  { value: 6, suffix: "+", label: "Produk Asuransi" },
  { value: 100, suffix: "K+", label: "Pelanggan" },
  { value: 98, suffix: "%", label: "Kepuasan Pelanggan" },
  { value: 24, suffix: "/7", label: "Layanan" },
];

function useCountUp(target: number, inView: boolean, duration = 2500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      start = Math.floor(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return count;
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(value, inView);

  return (
    <motion.div
      ref={ref}
      className="text-center p-6 rounded-xl bg-[#0A0F1E]/50 border border-white/[0.04] transition-all duration-700 hover:border-[#2E7D6F]/20 hover:bg-[#0A0F1E]/70"
    >
      <p className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-[#2E7D6F]">
        {value >= 1000 ? `${Math.floor(count / 1000)}K` : count}
        {suffix}
      </p>
      <p className="text-sm text-white/40 mt-2.5 tracking-wider">{label}</p>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["1.5%", "-1.5%"]);

  return (
    <section id="tentang" className="section-padding relative overflow-hidden bg-[#0D0D0D] text-white">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-center">
          {/* Left - OJK Certification Showcase with slower parallax */}
          <AnimatedSection direction="left">
            <motion.div className="relative" style={{ y: imageY }}>
              <div className="relative overflow-hidden rounded-2xl">
                <div className="bg-[#0A0F1E] p-12 min-h-[420px] flex flex-col items-center justify-center border border-white/[0.05] rounded-2xl">
                  {/* Shield Icon Ring */}
                  <div className="w-20 h-20 rounded-full bg-[#2E7D6F]/[0.07] border-2 border-[#2E7D6F]/25 flex items-center justify-center mb-7">
                    <ShieldCheck className="w-10 h-10 text-[#2E7D6F]" />
                  </div>
                  {/* Title */}
                  <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] text-white text-center mb-2">
                    Berizin & Diawasi OJK
                  </h3>
                  {/* License Number */}
                  <p className="text-[#2E7D6F] text-xs tracking-wider uppercase text-center mb-5">
                    Lisensi KEP-060/NB.1/2021
                  </p>
                  {/* APPARINDO Number */}
                  <div className="flex items-center gap-2 mb-5">
                    <Award className="w-5 h-5 text-[#2E7D6F]" />
                    <span className="text-white/40 text-xs tracking-wider">APPARINDO No. 113-2005/APPARINDO/2025</span>
                  </div>
                  {/* Description */}
                  <p className="text-white/25 text-xs text-center max-w-sm leading-[1.8]">
                    Pialang asuransi yang telah berizin dan diawasi oleh Otoritas Jasa Keuangan
                  </p>
                </div>
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/30 to-transparent pointer-events-none rounded-2xl" />
              </div>

              {/* Floating OJK Licensed Badge */}
              <motion.div
                className="absolute -bottom-4 -left-4 glass rounded-xl p-4 border border-[#2E7D6F]/15"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-[#2E7D6F]">OJK</p>
                <p className="text-[10px] tracking-[0.2em] text-white/50 uppercase">Licensed</p>
              </motion.div>
            </motion.div>
          </AnimatedSection>

          {/* Right - Company Info + Stats */}
          <AnimatedSection direction="right" delay={0.15}>
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="accent-line" />
              <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">About Us</span>
            </div>

            {/* Heading */}
            <TextReveal
              text="PT Solusiutama Tekno Broker Asuransi"
              as="h2"
              className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-8 leading-[1.1]"
              delay={0.1}
              staggerDelay={0.02}
            />

            {/* Description */}
            <p className="text-white/40 leading-[1.8] mb-14 max-w-lg text-[15px]">
              Sebagai perusahaan insurtech terpercaya di Indonesia yang berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK), Jasa Proteksi berkomitmen menghadirkan produk asuransi yang mudah, cepat, dan terjangkau untuk setiap gaya hidup. Dengan tagline &apos;Melindungi Setiap Langkah Hidupmu&apos;, kami terus berinovasi untuk memberikan perlindungan terbaik bagi kamu dan keluarga.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-14">
              {stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="#kontak"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-[#2E7D6F]/30 text-[#2E7D6F] font-semibold tracking-wider text-sm hover:bg-[#2E7D6F] hover:text-white transition-all duration-800 group shine-button rounded-lg"
            >
              Pelajari Lebih Lanjut
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-800" />
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
