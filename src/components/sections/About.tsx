"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Award, ShieldCheck } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import MagneticButton from "@/components/shared/MagneticButton";

const stats = [
  { value: 6, suffix: "+", label: "Produk Asuransi" },
  { value: 100, suffix: "K+", label: "Pelanggan" },
  { value: 98, suffix: "%", label: "Kepuasan Pelanggan" },
  { value: 24, suffix: "/7", label: "Layanan" },
];

function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
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
      className="text-center p-4 rounded-xl bg-white/5 border border-white/5"
      whileHover={{ borderColor: "rgba(201, 168, 76, 0.3)", backgroundColor: "rgba(201, 168, 76, 0.05)" }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-[#c9a84c]">
        {value >= 1000 ? `${Math.floor(count / 1000)}K` : count}
        {suffix}
      </p>
      <p className="text-sm text-white/50 mt-2 tracking-wider">{label}</p>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <SectionWrapper id="tentang" dark>
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Certification/Award Showcase with parallax */}
          <AnimatedSection direction="left">
            <motion.div className="relative" style={{ y: imageY }}>
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#c9a84c]/10 to-transparent rounded-2xl" />
              <div className="relative overflow-hidden rounded-xl group">
                <div className="bg-gradient-to-br from-[#0a0a2e] to-[#1a1a3e] p-10 min-h-[400px] flex flex-col items-center justify-center border border-[#c9a84c]/20">
                  {/* OJK Badge */}
                  <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 border-2 border-[#c9a84c]/30 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-10 h-10 text-[#c9a84c]" />
                  </div>
                  <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] text-white text-center mb-2">
                    Berizin & Diawasi OJK
                  </h3>
                  <p className="text-[#c9a84c] text-xs tracking-wider uppercase text-center mb-4">
                    Lisensi KEP-060/NB.1/2021
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-[#c9a84c]" />
                    <span className="text-white/50 text-xs tracking-wider">APPARINDO No. 113-2005/APPARINDO/2025</span>
                  </div>
                  <p className="text-white/30 text-xs text-center max-w-sm leading-relaxed">
                    Pialang asuransi yang telah berizin dan diawasi oleh Otoritas Jasa Keuangan
                  </p>
                </div>
                <div className="absolute inset-0 border border-[#c9a84c]/20 rounded-xl pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00001f]/30 to-transparent pointer-events-none" />
              </div>
              {/* Experience badge */}
              <div className="absolute -bottom-4 -left-4 glass rounded-lg p-4 animate-glow-pulse">
                <p className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-[#c9a84c]">OJK</p>
                <p className="text-[10px] tracking-[0.2em] text-white/60 uppercase">Licensed</p>
              </div>
            </motion.div>
          </AnimatedSection>

          {/* Right - Content */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="flex items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">About Us</span>
            </div>
            <TextReveal
              text="PT Solusiutama Tekno Broker Asuransi"
              as="h2"
              className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6 leading-tight"
              delay={0.1}
              staggerDelay={0.02}
            />
            <p className="text-white/50 leading-relaxed mb-10">
              Sebagai perusahaan insurtech terpercaya di Indonesia yang berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK), Jasa Proteksi berkomitmen menghadirkan produk asuransi yang mudah, cepat, dan terjangkau untuk setiap gaya hidup. Dengan tagline &apos;Melindungi Setiap Langkah Hidupmu&apos;, kami terus berinovasi untuk memberikan perlindungan terbaik bagi kamu dan keluarga.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
              ))}
            </div>

            {/* CTA */}
            <MagneticButton
              href="#kontak"
              className="inline-flex items-center gap-2 px-8 py-3 border border-[#c9a84c]/40 text-[#c9a84c] font-semibold tracking-wider text-sm hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 group shine-button"
            >
              Pelajari Lebih Lanjut
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </MagneticButton>
          </AnimatedSection>
        </div>
      </div>
    </SectionWrapper>
  );
}
