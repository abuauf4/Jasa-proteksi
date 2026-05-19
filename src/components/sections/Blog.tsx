"use client";

import { BookOpen, HelpCircle, ListChecks, Heart, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const blogPosts = [
  {
    icon: BookOpen,
    category: "Edukasi",
    title: "Apa Itu Asuransi? Pengertian, Jenis, Manfaat Lengkapnya",
    excerpt: "Pahami dasar-dasar asuransi dan mengapa perlindungan ini penting untuk kamu dan keluarga.",
    date: "20 Mei 2025",
  },
  {
    icon: HelpCircle,
    category: "Tips",
    title: "10 Pertanyaan Tentang Asuransi dan Jawabannya",
    excerpt: "Jawaban atas pertanyaan yang paling sering ditanyakan tentang dunia asuransi.",
    date: "15 Mei 2025",
  },
  {
    icon: ListChecks,
    category: "Lifestyle",
    title: "7 Jenis Asuransi di Indonesia, Kenali Terlebih Dahulu",
    excerpt: "Kenali berbagai jenis asuransi yang tersedia dan mana yang paling sesuai untuk kebutuhanmu.",
    date: "10 Mei 2025",
  },
];

export default function Blog() {
  return (
    <SectionWrapper id="blog" className="bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="accent-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#2E7D6F] uppercase font-medium">Latest News</span>
          <TextReveal
            text="Artikel & Edukasi"
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] mt-4 text-[#0D0D0D]"
            delay={0.1}
          />
        </AnimatedSection>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <AnimatedSection key={post.title} delay={i * 0.12}>
              <article className="group cursor-pointer h-full bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-500 hover:border-[#2E7D6F]/20">
                {/* Icon Header */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#0A0F1E] to-[#141B30] flex items-center justify-center border-b border-gray-200">
                  <div className="text-center">
                    <post.icon className="w-12 h-12 text-[#2E7D6F]/30 mx-auto mb-3 group-hover:text-[#2E7D6F]/60 transition-colors duration-500" />
                    <p className="text-[#2E7D6F]/20 text-sm font-[family-name:var(--font-montserrat)]">Jasa Proteksi Article</p>
                  </div>
                  {/* Category overlay */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] tracking-wider text-[#2E7D6F] border border-[#2E7D6F]/30 px-2 py-0.5 rounded bg-[#0D0D0D]/60 backdrop-blur-sm uppercase font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] mb-2 group-hover:text-[#2E7D6F] transition-colors duration-300 line-clamp-2 text-[#0D0D0D]">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className="inline-flex items-center gap-1 text-[#2E7D6F] text-sm font-medium group-hover:gap-2 transition-all duration-300">
                      Baca
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.4} className="mt-12 text-center">
          <a
            href="#blog"
            className="inline-flex items-center gap-2 px-8 py-3 border border-[#2E7D6F]/40 text-[#2E7D6F] font-semibold tracking-wider text-sm hover:bg-[#2E7D6F] hover:text-[#0D0D0D] transition-all duration-500 rounded-md"
          >
            Lihat Semua Artikel
          </a>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
