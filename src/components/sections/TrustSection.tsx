"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Lock,
  FileCheck,
  Users,
  TrendingUp,
  BadgeCheck,
  Landmark,
  CheckCircle2,
  Handshake,
} from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

// Premium cinematic easing
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Partner Logos (placeholder brand names) ─── */
const partners = [
  "OJK",
  "APPARINDO",
  "LPOJK",
  "Asuransi Sinar Mas",
  "Asuransi Tokio Marine",
  "Asuransi Allianz",
  "Asuransi Axa Mandiri",
  "Asuransi Sompo",
];

/* ─── Claim Statistics ─── */
const claimStats = [
  { value: 15000, suffix: "+", label: "Klaim Diproses", icon: FileCheck },
  { value: 98, suffix: "%", label: "Claim Approval Rate", icon: TrendingUp },
  { value: 72, suffix: "Jam", label: "Rata-rata Penyelesaian", icon: Lock },
  { value: 100, suffix: "K+", label: "Nasabah Terlindungi", icon: Users },
];

/* ─── Trust Badges ─── */
const trustBadges = [
  {
    icon: ShieldCheck,
    title: "Berizin & Diawasi OJK",
    desc: "Lisensi KEP-060/NB.1/2021",
  },
  {
    icon: Award,
    title: "Insurance Asia Awards 2025",
    desc: "Insurtech Initiative of the Year",
  },
  {
    icon: Landmark,
    title: "APPARINDO Verified",
    desc: "No. 113-2005/APPARINDO/2025",
  },
  {
    icon: BadgeCheck,
    title: "ISO 27001 Compliant",
    desc: "Data security guaranteed",
  },
];

/* ─── Secure Process Steps ─── */
const secureProcess = [
  {
    step: "01",
    title: "Pilih Produk",
    desc: "Temukan perlindungan yang sesuai dengan kebutuhanmu.",
  },
  {
    step: "02",
    title: "Isi Data",
    desc: "Proses verifikasi aman dan terenkripsi end-to-end.",
  },
  {
    step: "03",
    title: "Bayar Aman",
    desc: "Pembayaran tersertifikasi dan terproteksi penuh.",
  },
  {
    step: "04",
    title: "Polis Aktif",
    desc: "Polis digital langsung terbit, perlindungan dimulai.",
  },
];

/* ─── Animated Counter ─── */
function AnimatedCounter({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const startTime = Date.now();
    const duration = 2500;
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Premium ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  const display = target >= 1000 ? `${(count / 1000).toFixed(count >= target ? 0 : 1)}K` : count;

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  stat,
  index,
  inView,
}: {
  stat: (typeof claimStats)[0];
  index: number;
  inView: boolean;
}) {
  const IconComponent = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.15, ease }}
      className="relative group"
    >
      <div className="relative p-8 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:border-[#2E7D6F]/25 transition-all duration-700 overflow-hidden">
        {/* Subtle top glow on hover */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2E7D6F]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        {/* Ambient light on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2E7D6F]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10">
          <IconComponent className="w-5 h-5 text-[#2E7D6F] mb-5" />
          <p className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-[#F5F5F0] mb-2">
            <AnimatedCounter
              target={stat.value}
              suffix={stat.suffix}
              inView={inView}
            />
          </p>
          <p className="text-white/40 text-sm tracking-wider">{stat.label}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function TrustSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  return (
    <section id="trust" className="relative overflow-hidden bg-[#0A0F1E]">
      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#0A0F1E] to-[#0D0D0D]" />
        <div
          className="absolute top-[30%] left-[20%] w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ backgroundColor: "rgba(46, 125, 111, 0.025)" }}
        />
        <div
          className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ backgroundColor: "rgba(46, 125, 111, 0.02)" }}
        />
      </div>

      {/* ── Noise texture ── */}
      <div className="noise-overlay absolute inset-0" />

      {/* ── Top divider ── */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2E7D6F]/15 to-transparent" />

      <div ref={sectionRef} className="relative z-10">
        {/* ════════════════════════════════════════════
            PART 1: PARTNER LOGOS
        ════════════════════════════════════════════ */}
        <div className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <AnimatedSection className="text-center mb-16 lg:mb-20">
              <div className="flex justify-center mb-5">
                <div className="w-8 h-[2px] bg-[#2E7D6F]" />
              </div>
              <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">
                Trusted & Licensed
              </span>
              <TextReveal
                text="Protection you can trust"
                as="h2"
                className="text-4xl lg:text-5xl xl:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-5 mb-6 leading-[1.1]"
                delay={0.15}
                staggerDelay={0.05}
              />
              <p className="text-white/40 text-base lg:text-lg max-w-lg mx-auto leading-relaxed">
                Backed by Indonesia&apos;s leading regulators and insurers
              </p>
            </AnimatedSection>

            {/* Partner Logos - Premium Marquee */}
            <AnimatedSection delay={0.2}>
              <div className="relative overflow-hidden py-6">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0F1E] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0F1E] to-transparent z-10 pointer-events-none" />

                <div className="animate-marquee whitespace-nowrap">
                  {[...partners, ...partners].map((name, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-3 mx-8"
                    >
                      <span className="text-sm font-medium tracking-[0.2em] text-white/[0.08] uppercase font-[family-name:var(--font-montserrat)]">
                        {name}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#2E7D6F]/30" />
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* ── Subtle divider ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        {/* ════════════════════════════════════════════
            PART 2: TRUST BADGES
        ════════════════════════════════════════════ */}
        <div className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustBadges.map((badge, i) => {
                const IconComponent = badge.icon;
                return (
                  <AnimatedSection key={badge.title} delay={i * 0.12}>
                    <div className="relative group h-full">
                      <div className="relative p-8 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm hover:border-[#2E7D6F]/20 transition-all duration-700 h-full overflow-hidden">
                        {/* Top glow line on hover */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2E7D6F]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="w-12 h-12 rounded-lg bg-[#2E7D6F]/[0.07] border border-[#2E7D6F]/10 flex items-center justify-center mb-5 group-hover:bg-[#2E7D6F]/[0.12] transition-colors duration-700">
                          <IconComponent className="w-6 h-6 text-[#2E7D6F]" />
                        </div>
                        <h3 className="text-base font-semibold font-[family-name:var(--font-montserrat)] text-white mb-2">
                          {badge.title}
                        </h3>
                        <p className="text-white/35 text-sm leading-relaxed">
                          {badge.desc}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Subtle divider ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        {/* ════════════════════════════════════════════
            PART 3: CLAIM STATISTICS
        ════════════════════════════════════════════ */}
        <div className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16 lg:mb-20">
              <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">
                Proven Track Record
              </span>
              <TextReveal
                text="Numbers that speak for themselves"
                as="h3"
                className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4 leading-[1.15]"
                delay={0.1}
                staggerDelay={0.04}
              />
            </AnimatedSection>

            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {claimStats.map((stat, i) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  index={i}
                  inView={statsInView}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Subtle divider ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        {/* ════════════════════════════════════════════
            PART 4: SECURE PROCESS
        ════════════════════════════════════════════ */}
        <div className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Left - Emotional Storytelling */}
              <AnimatedSection direction="left">
                <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">
                  Secure Process
                </span>
                <TextReveal
                  text="Every step, protected"
                  as="h3"
                  className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4 mb-6 leading-[1.1]"
                  delay={0.1}
                  staggerDelay={0.04}
                />
                <p className="text-white/40 text-base leading-relaxed mb-8 max-w-md">
                  From selection to activation, your data and transactions are
                  secured with bank-level encryption. Trust is built into every
                  step.
                </p>
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-[#2E7D6F]" />
                  <span className="text-white/50 text-sm tracking-wider">
                    256-bit SSL Encrypted
                  </span>
                </div>
              </AnimatedSection>

              {/* Right - Process Steps */}
              <div className="space-y-6">
                {secureProcess.map((step, i) => (
                  <AnimatedSection key={step.step} delay={i * 0.12} direction="right">
                    <div className="group flex gap-6 p-6 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#2E7D6F]/15 transition-all duration-700">
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-[#2E7D6F]/[0.07] border border-[#2E7D6F]/10 flex items-center justify-center group-hover:bg-[#2E7D6F]/[0.12] transition-colors duration-700">
                          <span className="text-sm font-bold font-[family-name:var(--font-montserrat)] text-[#2E7D6F]">
                            {step.step}
                          </span>
                        </div>
                      </div>
                      {/* Content */}
                      <div>
                        <h4 className="text-base font-semibold font-[family-name:var(--font-montserrat)] text-white mb-1.5">
                          {step.title}
                        </h4>
                        <p className="text-white/35 text-sm leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                      {/* Check icon */}
                      <div className="flex-shrink-0 ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <CheckCircle2 className="w-5 h-5 text-[#2E7D6F]/40" />
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Customer Protection Guarantee */}
            <AnimatedSection delay={0.5} className="mt-16 lg:mt-20">
              <div className="relative p-8 lg:p-10 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] bg-[#2E7D6F]/[0.04] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-[#2E7D6F]/10 border border-[#2E7D6F]/20 flex items-center justify-center">
                      <Handshake className="w-7 h-7 text-[#2E7D6F]" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-lg font-semibold font-[family-name:var(--font-montserrat)] text-white mb-2">
                      Customer Protection Guarantee
                    </h4>
                    <p className="text-white/40 text-sm leading-relaxed max-w-xl">
                      Jasa Proteksi menjamin perlindungan hak nasabah sesuai
                      regulasi OJK. Setiap transaksi dijamin transparan, klaim
                      diproses secara adil, dan data pribadi dilindungi sesuai
                      standar keamanan tertinggi.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* ── Bottom divider ── */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2E7D6F]/15 to-transparent" />
    </section>
  );
}
