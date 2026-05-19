"use client";

import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const testimonials = [
  {
    quote: "Saya bayar dan langsung dapat polis. Mudah sekali proses pembeliannya",
    name: "Yunita Taniwangsa",
    product: "Asuransi Perjalanan Internasional",
    rating: 5,
  },
  {
    quote: "Saya sampai 2 kali beli asuransi mobil di Jasa Proteksi, karena memang puas dengan pelayanan telemarketingnya, dan diskon yg diberikan pun juga lumayan besar.",
    name: "Christianto Aribowo",
    product: "Asuransi Mobil",
    rating: 5,
  },
  {
    quote: "Saya bertemu dan dibantu Jasa Proteksi saat pameran dan saya tertarik ingin mencoba asuransi hewan, karena produk yang ditawarkan merupakan asuransi hewan pertama yang saya ketahui",
    name: "Agam Yudi",
    product: "Asuransi Kucing",
    rating: 4,
  },
  {
    quote: "Hanya tinggal klik-klik lalu bayar! Mudah, murah dan lengkap.",
    name: "Raditya Anugrah",
    product: "Asuransi Motor",
    rating: 5,
  },
  {
    quote: "Lega ada produk asuransi khusus hewan peliharaan, worth it sih menurut saya. Ngga mahal dan yang penting bisa bikin tenang.",
    name: "Eric W",
    product: "Asuransi Anjing",
    rating: 4,
  },
  {
    quote: "Proses pembelian mudah banget, cukup 5 menit saya langsung berhasil membeli asuransi untuk motor saya. Penjelasan produk pun sangat jelas dan banyak promonya!",
    name: "Desi Widayanti",
    product: "Asuransi Motor",
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section id="testimoni" className="section-padding relative overflow-hidden bg-[#F5F5F0] text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          {/* Decorative Quote Icon */}
          <div className="flex justify-center mb-6">
            <Quote className="w-10 h-10 text-[#2E7D6F]/30" />
          </div>
          {/* Label */}
          <span className="text-xs tracking-[0.3em] text-[#2E7D6F] uppercase font-medium">Testimonials</span>
          {/* Heading */}
          <TextReveal
            text="Trusted by thousands"
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-[#0D0D0D] mt-4"
            delay={0.1}
          />
        </AnimatedSection>

        {/* Testimonial Card */}
        <div className="text-center min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        i < t.rating ? "text-[#2E7D6F] fill-[#2E7D6F]" : "text-[#0D0D0D]/15"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-light text-[#0D0D0D]/80 italic leading-relaxed mb-10 font-[family-name:var(--font-montserrat)]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Decorative accent line */}
              <div className="flex justify-center mb-6">
                <div className="accent-line" />
              </div>

              {/* Name */}
              <p className="text-lg font-semibold font-[family-name:var(--font-montserrat)] text-[#2E7D6F]">
                {t.name}
              </p>
              {/* Product */}
              <p className="text-sm text-[#0D0D0D]/40 mt-1">Pengguna {t.product}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-[#2E7D6F]/30 flex items-center justify-center text-[#2E7D6F] hover:bg-[#2E7D6F] hover:text-white transition-all duration-500"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === current ? "bg-[#2E7D6F] w-6" : "bg-[#2E7D6F]/30 hover:bg-[#2E7D6F]/50 w-2"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-[#2E7D6F]/30 flex items-center justify-center text-[#2E7D6F] hover:bg-[#2E7D6F] hover:text-white transition-all duration-500"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
