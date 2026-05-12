"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const testimonials = [
  {
    name: "Budi Santoso",
    occupation: "Pengusaha",
    car: "Pajero Sport",
    quote:
      "Pajero Sport benar-benar memenuhi ekspektasi saya. Performa tangguh di segala medan, interior mewah, dan servis after-sales yang luar biasa. Pilihan terbaik untuk keluarga saya!",
    rating: 5,
    initials: "BS",
  },
  {
    name: "Sari Dewi",
    occupation: "Dokter",
    car: "Xpander Cross",
    quote:
      "Xpander Cross sangat nyaman untuk keluarga. Fitur keselamatan lengkap, kabin luas, dan desain yang stylish. Proses pembelian di dealer ini juga sangat profesional dan mudah.",
    rating: 5,
    initials: "SD",
  },
  {
    name: "Ahmad Rizky",
    occupation: "Arsitek",
    car: "Outlander PHEV",
    quote:
      "Outlander PHEV adalah masa depan! Hemat BBM luar biasa dengan teknologi hybrid canggih. Dealer memberikan penjelasan detail dan pelayanan terbaik sejak awal.",
    rating: 5,
    initials: "AR",
  },
  {
    name: "Linda Wijaya",
    occupation: "Guru",
    car: "Xpander",
    quote:
      "Xpander pilihan tepat untuk keluarga kami. Harga sangat kompetitif, fitur lengkap, dan kenyamanan luar biasa. Terima kasih atas layanan profesional dari tim dealer!",
    rating: 5,
    initials: "LW",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  return (
    <SectionWrapper id="testimoni" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-4">
            Apa Kata Mereka
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Testimoni pelanggan kami yang puas
          </p>
        </AnimatedSection>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Card className="bg-card border-border/50 shadow-lg">
                <CardContent className="p-8 sm:p-10">
                  <div className="flex flex-col items-center text-center">
                    <Quote className="w-10 h-10 text-accent/30 mb-4" />
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-foreground text-lg leading-relaxed mb-6 max-w-2xl italic">
                      &ldquo;{testimonials[current].quote}&rdquo;
                    </p>
                    <Avatar className="w-16 h-16 mb-3">
                      <AvatarFallback className="bg-accent/10 text-accent font-semibold text-lg">
                        {testimonials[current].initials}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-semibold font-[family-name:var(--font-montserrat)] text-foreground">
                      {testimonials[current].name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {testimonials[current].occupation} &mdash; {testimonials[current].car}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === current
                      ? "bg-accent w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
