"use client";

import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";
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
    <SectionWrapper id="testimoni">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Quote className="w-10 h-10 text-[#c9a84c]/40" />
          </div>
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <TextReveal
            text="Kata Pengguna Jasa Proteksi"
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)]"
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
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        i < t.rating ? "text-[#c9a84c] fill-[#c9a84c]" : "text-muted-foreground/30"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-light text-foreground/80 italic leading-relaxed mb-10 font-[family-name:var(--font-montserrat)]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Decorative line */}
              <div className="flex justify-center mb-6">
                <div className="gold-line" />
              </div>

              {/* Name & Product */}
              <p className="text-lg font-semibold font-[family-name:var(--font-montserrat)] text-[#c9a84c]">
                {t.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Pengguna {t.product}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <motion.button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-[#c9a84c] w-6" : "bg-[#c9a84c]/30 hover:bg-[#c9a84c]/50 w-2"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            onClick={next}
            className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </SectionWrapper>
  );
}
