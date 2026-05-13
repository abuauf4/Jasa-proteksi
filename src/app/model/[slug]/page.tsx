"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, MessageCircle, Calendar, Mail,
  Gauge, Cog, Users, Zap, Fuel, Shield, Activity,
  ChevronRight, Check, Star, Clock
} from "lucide-react";
import { cars, getCarBySlug, getRelatedCars } from "@/lib/cars";
import MagneticButton from "@/components/shared/MagneticButton";
import GradientMesh from "@/components/shared/GradientMesh";
import FloatingParticles from "@/components/shared/FloatingParticles";
import SectionPattern from "@/components/shared/SectionPattern";
import CountdownTimer from "@/components/shared/CountdownTimer";
import CustomCursor from "@/components/shared/CustomCursor";
import CursorTrail from "@/components/shared/CursorTrail";
import Navigation from "@/components/sections/Navigation";

const iconMap: Record<string, React.ElementType> = {
  engine: Gauge,
  fuel: Fuel,
  seat: Users,
  safety: Shield,
};

const promoDate = new Date();
promoDate.setDate(promoDate.getDate() + 30);

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const car = getCarBySlug(slug);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeSpec, setActiveSpec] = useState<"performance" | "dimension" | "safety">("performance");

  if (!car) {
    return (
      <div className="min-h-screen bg-[#00001f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold font-[family-name:var(--font-montserrat)] text-[#c9a84c] mb-4">404</h1>
          <p className="text-white/50 mb-6">Model tidak ditemukan</p>
          <button onClick={() => router.push("/")} className="px-6 py-3 border border-[#c9a84c] text-[#c9a84c] font-semibold tracking-wider text-sm hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 shine-button">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const related = getRelatedCars(car);

  return (
    <>
      <CustomCursor />
      <CursorTrail />
      <Navigation />
      <div className="bg-[#00001f] min-h-screen overflow-y-auto">
        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <SectionPattern pattern="geometric-diamonds" />
          <GradientMesh variant="gold-aurora" />
          <FloatingParticles count={15} />

          {/* Back button */}
          <motion.button
            onClick={() => router.push("/#model")}
            className="fixed top-20 left-4 sm:left-8 z-30 flex items-center gap-2 px-4 py-2 glass rounded-full text-white/70 hover:text-[#c9a84c] transition-colors duration-300 text-xs tracking-wider"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Semua Model
          </motion.button>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
              {/* Left - Text */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Category + Tagline */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="gold-line animate-line-expand" />
                  <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">{car.category}</span>
                </div>
                <p className="text-white/40 text-sm tracking-[0.2em] uppercase mb-2 font-medium">{car.tagline}</p>

                {/* Car Name */}
                <motion.h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-montserrat)] text-white leading-[1.05] mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  {car.name}
                </motion.h1>

                {/* Price */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <p className="text-3xl sm:text-4xl font-bold text-[#c9a84c] font-[family-name:var(--font-montserrat)]">
                    {car.price}
                  </p>
                  <p className="text-white/30 text-xs mt-1">OTR Jakarta — estimasi</p>
                </motion.div>

                {/* Description */}
                <motion.p
                  className="text-white/50 leading-relaxed max-w-lg mb-8 text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {car.description}
                </motion.p>

                {/* Quick Stats */}
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {car.highlights.map((h, i) => {
                    const Icon = iconMap[h.icon] || Gauge;
                    return (
                      <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-[#c9a84c]/20 transition-all duration-300 group">
                        <Icon className="w-4 h-4 text-[#c9a84c] mb-1.5" />
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">{h.label}</p>
                        <p className="text-sm font-semibold text-white mt-0.5">{h.value}</p>
                      </div>
                    );
                  })}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <MagneticButton
                    href="https://wa.me/6289662524542"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold tracking-wider text-sm hover:bg-[#20bd5a] transition-all duration-300 shine-button rounded-lg"
                    strength={0.3}
                  >
                    <MessageCircle className="w-4 h-4" />
                    CHAT WHATSAPP
                  </MagneticButton>
                  <MagneticButton
                    href="/#kontak"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#c9a84c]/40 text-[#c9a84c] font-semibold tracking-wider text-sm hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 shine-button rounded-lg"
                    strength={0.3}
                  >
                    <Calendar className="w-4 h-4" />
                    BOOK TEST DRIVE
                  </MagneticButton>
                </motion.div>
              </motion.div>

              {/* Right - Car Image */}
              <motion.div
                className="relative flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-[#c9a84c]/5 rounded-full blur-[120px] pointer-events-none" />

                {/* Rotating ring */}
                <motion.div
                  className="absolute w-[85%] h-[85%] rounded-full border border-[#c9a84c]/10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                />

                {/* Car image */}
                <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                  <Image
                    src={car.heroImage}
                    alt={car.name}
                    fill
                    className="object-contain p-8 drop-shadow-2xl"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>

                {/* Floating warranty badge */}
                <motion.div
                  className="absolute bottom-8 right-4 glass rounded-lg p-3 animate-glow-pulse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <Shield className="w-4 h-4 text-[#c9a84c] mb-1" />
                  <p className="text-[9px] tracking-[0.15em] text-[#c9a84c] uppercase font-medium">Garansi</p>
                  <p className="text-xs font-semibold text-white">{car.warranty}</p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#00001f] to-transparent z-10 pointer-events-none" />
        </section>

        {/* ===== COLOR PICKER + SPECS ===== */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <SectionPattern pattern="hexagon-tech" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Color Picker */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="gold-line" />
                  <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Color</span>
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                  Pilih Warna
                </h3>

                {/* Color swatches */}
                <div className="flex gap-3 mb-6">
                  {car.colors.map((color, i) => (
                    <motion.button
                      key={color.name}
                      onClick={() => setSelectedColor(i)}
                      className="relative group"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                          selectedColor === i
                            ? "border-[#c9a84c] scale-110 shadow-lg"
                            : "border-white/20 hover:border-white/40"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      {selectedColor === i && (
                        <motion.div
                          className="absolute -inset-1.5 rounded-full border-2 border-[#c9a84c]/50"
                          layoutId="colorRing"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={selectedColor}
                    className="text-white/60 text-sm"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {car.colors[selectedColor].name}
                  </motion.p>
                </AnimatePresence>

                {/* Variants */}
                <div className="mt-8">
                  <h4 className="text-sm font-semibold font-[family-name:var(--font-montserrat)] text-white/70 tracking-wider uppercase mb-4">
                    Tipe & Harga
                  </h4>
                  <div className="space-y-2">
                    {car.variants.map((variant, i) => (
                      <motion.div
                        key={variant.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-[#c9a84c]/20 transition-all duration-300 group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                          <span className="text-sm text-white/70 group-hover:text-white transition-colors">{variant.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#c9a84c]">{variant.price}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Specs Tabs */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="gold-line" />
                  <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Specification</span>
                </div>
                <h3 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                  Spesifikasi Teknis
                </h3>

                {/* Spec Tabs */}
                <div className="inline-flex gap-1 p-1 rounded-lg bg-white/5 border border-white/5 mb-6">
                  {(["performance", "dimension", "safety"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSpec(tab)}
                      className={`px-4 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 rounded-md capitalize ${
                        activeSpec === tab
                          ? "bg-[#c9a84c] text-[#00001f]"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {tab === "performance" ? "Performa" : tab === "dimension" ? "Dimensi" : "Keselamatan"}
                    </button>
                  ))}
                </div>

                {/* Spec Content */}
                <AnimatePresence mode="wait">
                  {activeSpec === "performance" && (
                    <motion.div
                      key="perf"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <SpecCard icon={Gauge} label="Mesin" value={car.engine} />
                      <SpecCard icon={Zap} label="Tenaga" value={car.power} />
                      <SpecCard icon={Activity} label="Torsi" value={car.torque} />
                      <SpecCard icon={Cog} label="Transmisi" value={car.transmission} />
                      <SpecCard icon={Fuel} label="Bahan Bakar" value={car.fuel} />
                      <SpecCard icon={Users} label="Kapasitas" value={car.seats} />
                      <SpecCard icon={Activity} label="Kecepatan Maks" value={car.topSpeed} />
                      <SpecCard icon={Clock} label="0-100 km/h" value={car.acceleration} />
                    </motion.div>
                  )}
                  {activeSpec === "dimension" && (
                    <motion.div
                      key="dim"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <SpecCard icon={Users} label="Penumpang" value={car.seats} />
                      <SpecCard icon={Fuel} label="Bahan Bakar" value={car.fuel} />
                      <SpecCard icon={Cog} label="Transmisi" value={car.transmission} />
                      <SpecCard icon={Gauge} label="Kategori" value={car.category} />
                    </motion.div>
                  )}
                  {activeSpec === "safety" && (
                    <motion.div
                      key="safe"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-[#c9a84c]/5 border border-[#c9a84c]/20 mb-4">
                        <Shield className="w-5 h-5 text-[#c9a84c]" />
                        <span className="text-sm font-semibold text-[#c9a84c]">Garansi: {car.warranty}</span>
                      </div>
                      {car.features.filter(f =>
                        f.toLowerCase().includes("airbag") || f.toLowerCase().includes("safety") ||
                        f.toLowerCase().includes("brake") || f.toLowerCase().includes("collision") ||
                        f.toLowerCase().includes("stability") || f.toLowerCase().includes("assist") ||
                        f.toLowerCase().includes("monitor") || f.toLowerCase().includes("misaccel") ||
                        f.toLowerCase().includes("ncap") || f.toLowerCase().includes("lock")
                      ).map((f, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                          <Check className="w-4 h-4 text-[#c9a84c] flex-shrink-0" />
                          <span className="text-sm text-white/70">{f}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <SectionPattern pattern="circuit-lines" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="gold-line" />
              <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Features</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-10">
              Fitur Unggulan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {car.features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#c9a84c]/20 transition-all duration-500 card-lift group"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9a84c]/20 transition-colors duration-300">
                    <Check className="w-4 h-4 text-[#c9a84c]" />
                  </div>
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors duration-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINANCING CTA ===== */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <SectionPattern pattern="chevron-luxury" />
          <GradientMesh variant="ember-glow" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <div className="gold-line" />
              </div>
              <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Financing</span>
              <h3 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-3 mb-4">
                Miliki {car.name} Sekarang
              </h3>
              <p className="text-white/50 max-w-lg mx-auto mb-8 text-sm">
                Dengan berbagai pilihan kredit fleksibel, {car.name} bisa jadi milik Anda. Hubungi Abu Aufa untuk simulasi kredit gratis.
              </p>
            </motion.div>

            {/* Financing Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <motion.div
                className="glass-dark rounded-xl p-5 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 transition-all duration-500 card-lift"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-xs text-white/40 tracking-wider uppercase mb-2">DP Ringan</p>
                <p className="text-2xl font-bold text-[#c9a84c] font-[family-name:var(--font-montserrat)]">DP 10%</p>
                <p className="text-xs text-white/30 mt-1">Cicilan mulai Rp 4,5jt/bln</p>
              </motion.div>
              <motion.div
                className="glass-dark rounded-xl p-5 border border-[#c9a84c]/40 shadow-lg shadow-[#c9a84c]/10 gradient-border relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 bg-[#c9a84c] text-[#00001f] px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    <Star className="w-2.5 h-2.5 fill-[#00001f]" /> Best Deal
                  </span>
                </div>
                <p className="text-xs text-white/40 tracking-wider uppercase mb-2">Bunga Special</p>
                <p className="text-2xl font-bold text-[#c9a84c] font-[family-name:var(--font-montserrat)]">0%</p>
                <p className="text-xs text-white/30 mt-1">Hingga 2 tahun pertama</p>
              </motion.div>
              <motion.div
                className="glass-dark rounded-xl p-5 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 transition-all duration-500 card-lift"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <p className="text-xs text-white/40 tracking-wider uppercase mb-2">Cash Deal</p>
                <p className="text-2xl font-bold text-[#c9a84c] font-[family-name:var(--font-montserrat)]">Cashback</p>
                <p className="text-xs text-white/30 mt-1">Bonus aksesoris & diskon</p>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <MagneticButton
                href="https://wa.me/6289662524542"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-semibold tracking-wider text-sm hover:bg-[#20bd5a] transition-all duration-300 shine-button rounded-lg"
                strength={0.3}
              >
                <MessageCircle className="w-4 h-4" />
                SIMULASI KREDIT GRATIS
              </MagneticButton>
              <MagneticButton
                href="/#kontak"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#c9a84c]/40 text-[#c9a84c] font-semibold tracking-wider text-sm hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 shine-button rounded-lg"
                strength={0.3}
              >
                <Calendar className="w-4 h-4" />
                BOOK TEST DRIVE
              </MagneticButton>
            </motion.div>

            {/* Countdown */}
            <motion.div
              className="mt-8 inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="glass rounded-lg p-4 animate-glow-pulse">
                <p className="text-[10px] tracking-[0.2em] text-[#c9a84c] uppercase mb-3 font-medium">Promo Berakhir Dalam</p>
                <CountdownTimer targetDate={promoDate} compact />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== RELATED MODELS ===== */}
        {related.length > 0 && (
          <section className="relative py-16 lg:py-24 overflow-hidden">
            <SectionPattern pattern="damask-ornate" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="gold-line" />
                <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Related</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-8">
                Model Lainnya
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((r, i) => (
                  <motion.div
                    key={r.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <button
                      onClick={() => {
                        router.push(`/model/${r.slug}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full text-left glass-dark rounded-xl overflow-hidden border border-white/5 hover:border-[#c9a84c]/30 transition-all duration-500 card-lift group"
                    >
                      <div className="relative h-44 bg-[#0a0a2e] overflow-hidden">
                        <Image
                          src={r.image}
                          alt={r.name}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-[10px] tracking-wider text-[#c9a84c] uppercase mb-1">{r.category}</p>
                        <h4 className="text-lg font-bold font-[family-name:var(--font-montserrat)] text-white mb-1 group-hover:text-[#c9a84c] transition-colors">{r.name}</h4>
                        <p className="text-lg font-bold text-[#c9a84c]">{r.price}</p>
                        <div className="flex items-center gap-1 mt-3 text-[#c9a84c]/70 text-xs">
                          <span>Lihat Detail</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== FOOTER BAR ===== */}
        <footer className="border-t border-[#c9a84c]/10 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src="/images/mitsubishi-logo.svg" alt="Mitsubishi" className="h-5 w-auto brightness-0 invert opacity-40" />
              <span className="text-white/20 text-[10px]">© 2025 PT MMKSI</span>
            </div>
            <span className="text-[#c9a84c]/30 text-[10px] tracking-widest">Drive your Ambition</span>
          </div>
        </footer>
      </div>
    </>
  );
}

// ===== Sub-components =====

function SpecCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-[#c9a84c]/20 transition-all duration-300 group">
      <Icon className="w-4 h-4 text-[#c9a84c] mb-2" />
      <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-white mt-0.5">{value}</p>
    </div>
  );
}
