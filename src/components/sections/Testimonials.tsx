"use client";

import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const testimonials = [
  {
    quote: "Saya sampai 2 kali beli asuransi mobil di Jasa Proteksi, karena memang puas dengan pelayanan telemarketingnya, dan diskon yg diberikan pun juga lumayan besar.",
    name: "Christianto Aribowo",
    city: "Jakarta",
    product: "Asuransi Mobil",
    rating: 5,
  },
  {
    quote: "Hanya tinggal klik-klik lalu bayar! Mudah, murah dan lengkap.",
    name: "Raditya Anugrah",
    city: "Tangerang",
    product: "Asuransi Motor",
    rating: 5,
  },
  {
    quote: "Proses pembelian mudah banget, cukup 5 menit saya langsung berhasil membeli asuransi untuk motor saya. Penjelasan produk pun sangat jelas dan banyak promonya!",
    name: "Desi Widayanti",
    city: "Depok",
    product: "Asuransi Motor",
    rating: 5,
  },
  {
    quote: "Proses klaimnya cepat dan tanpa ribet. Saya sangat terbantu saat kendaraan saya mengalami kecelakaan. Tim advisor selalu siap membantu!",
    name: "Dewi Anggraini",
    city: "Surabaya",
    product: "Asuransi Mobil",
    rating: 5,
  },
  {
    quote: "Harga premi yang kompetitif dengan coverage yang lengkap. Saya sudah merekomendasikan ke teman-teman di kantor. Puas banget!",
    name: "Rudi Hermawan",
    city: "Bandung",
    product: "Asuransi Mobil",
    rating: 5,
  },
];

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

const avatarColors = [
  "bg-[#0D9488]",
  "bg-[#F97316]",
  "bg-[#10B981]",
  "bg-[#14B8A6]",
  "bg-[#059669]",
];

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Testimonials() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const currentTestimonial = testimonials[current];

  return (
    <section id="testimoni" className="ds-section relative overflow-hidden bg-[#0F172A]">
      {/* Dot pattern */}
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 safe-px">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-14 lg:mb-20">
          {/* Decorative Quote Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-[#14B8A6]/25" />
          </div>
          {/* Label */}
          <span className="ds-label text-[#14B8A6]">{t("testimonials.label")}</span>
          {/* Heading */}
          <TextReveal
            text={t("testimonials.heading")}
            as="h2"
            className="ds-h2 font-bold  text-white mt-5 sm:mt-6"
            delay={0.1}
            staggerDelay={0.05}
          />
        </AnimatedSection>

        {/* Testimonial Card */}
        <div className="text-center min-h-[260px] sm:min-h-[300px]">
          <AnimatePresence>
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.8, ease: premiumEase }}
            >
              {/* Avatar with initials */}
              <div className="flex justify-center mb-5 sm:mb-6">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${avatarColors[current]} flex items-center justify-center`}>
                  <span className="text-base sm:text-lg font-bold ">
                    {getInitials(currentTestimonial.name)}
                  </span>
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 sm:gap-1.5 mb-6 sm:mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 + 0.2, duration: 0.6, ease: premiumEase }}
                  >
                    <Star
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < currentTestimonial.rating ? "text-[#F97316] fill-[#F97316]" : "text-[#334155]"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg sm:text-2xl lg:text-3xl font-light text-white/75 italic leading-[1.5] mb-8 sm:mb-10  px-2">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </blockquote>

              {/* Decorative accent line */}
              <div className="flex justify-center mb-5 sm:mb-7">
                <div className="ds-accent-line" />
              </div>

              {/* Name */}
              <p className="text-base sm:text-lg font-semibold  text-[#14B8A6]">
                {currentTestimonial.name}
              </p>
              {/* City & Product */}
              <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
                {currentTestimonial.city} &middot; {t("testimonials.user")} {currentTestimonial.product}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-12 sm:mt-16">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-[#334155] flex items-center justify-center text-[#14B8A6] hover:bg-[#14B8A6] hover:text-white hover:border-[#14B8A6] transition-all duration-300 min-h-[44px] sm:min-h-0"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2 sm:gap-2.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-[#14B8A6] w-6 sm:w-7" : "bg-[#334155] hover:bg-[#14B8A6]/40 w-2"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-[#334155] flex items-center justify-center text-[#14B8A6] hover:bg-[#14B8A6] hover:text-white hover:border-[#14B8A6] transition-all duration-300 min-h-[44px] sm:min-h-0"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
