"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";

const stats = [
  { value: 10, suffix: "+", label: "Tahun Pengalaman" },
  { value: 5000, suffix: "+", label: "Mobil Terjual" },
  { value: 98, suffix: "%", label: "Kepuasan Pelanggan" },
  { value: 15, suffix: "+", label: "Penghargaan" },
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
    <div ref={ref} className="text-center">
      <p className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-[#c9a84c]">
        {value >= 1000 ? `${Math.floor(count / 1000)}K` : count}
        {suffix}
      </p>
      <p className="text-sm text-white/50 mt-2 tracking-wider">{label}</p>
    </div>
  );
}

export default function About() {
  return (
    <SectionWrapper id="tentang" dark>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <AnimatedSection direction="left">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#c9a84c]/10 to-transparent rounded-2xl" />
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/images/showroom-bg.png"
                  alt="Mitsubishi premium showroom"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 border border-[#c9a84c]/20 rounded-xl pointer-events-none" />
              </div>
            </div>
          </AnimatedSection>

          {/* Right - Content */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="flex items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">About Us</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6 leading-tight">
              Mitra Resmi Mitsubishi Terpercaya
            </h2>
            <p className="text-white/50 leading-relaxed mb-10">
              Sebagai dealer resmi Mitsubishi, kami berkomitmen memberikan pengalaman
              pembelian dan kepemilikan kendaraan terbaik. Dengan tim profesional
              bersertifikat dan fasilitas modern, kami memastikan setiap pelanggan
              mendapatkan pelayanan premium yang melampaui ekspektasi.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
              {stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
              ))}
            </div>

            {/* CTA */}
            <a
              href="#kontak"
              className="inline-flex items-center gap-2 px-8 py-3 border border-[#c9a84c]/40 text-[#c9a84c] font-semibold tracking-wider text-sm hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 group"
            >
              Pelajari Lebih Lanjut
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </AnimatedSection>
        </div>
      </div>
    </SectionWrapper>
  );
}
