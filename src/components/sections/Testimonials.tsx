"use client";

import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";

const testimonials = [
  {
    quote: "Pengalaman membeli Pajero Sport di sini sangat menyenangkan. Tim sales profesional dan tidak ada tekanan sama sekali. Proses kredit cepat dan transparan.",
    name: "Ahmad Rizki",
    car: "Pajero Sport",
    rating: 5,
  },
  {
    quote: "Sudah 3 kali servis di sini dan selalu puas. Teknisi sangat kompeten dan suku cadang selalu tersedia. Waiting room yang nyaman membuat tunggu tidak terasa.",
    name: "Diana Putri",
    car: "Xpander Cross",
    rating: 5,
  },
  {
    quote: "Pelayanan after-sales yang luar biasa. Setiap pertanyaan selalu dijawab dengan cepat. Benar-benar merasa dihargai sebagai pelanggan.",
    name: "Budi Santoso",
    car: "Outlander PHEV",
    rating: 5,
  },
  {
    quote: "Proses trade-in sangat mudah dan penawaran harga wajar. Dari Xpander lama langsung pindah ke Triton tanpa ribet. Terima kasih tim!",
    name: "Rina Wulandari",
    car: "Triton",
    rating: 4,
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
          <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)]">
            Kata Mereka
          </h2>
        </AnimatedSection>

        {/* Testimonial Card */}
        <AnimatedSection delay={0.2}>
          <div className="text-center">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < t.rating ? "text-[#c9a84c] fill-[#c9a84c]" : "text-muted-foreground/30"
                  }`}
                />
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

            {/* Name & Car */}
            <p className="text-lg font-semibold font-[family-name:var(--font-montserrat)] text-[#c9a84c]">
              {t.name}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Pemilik {t.car}</p>
          </div>
        </AnimatedSection>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300"
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
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-[#c9a84c] w-6" : "bg-[#c9a84c]/30 hover:bg-[#c9a84c]/50"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}
