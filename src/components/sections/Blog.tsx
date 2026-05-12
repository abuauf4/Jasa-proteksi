"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";

const blogPosts = [
  {
    image: "/images/pajero-sport.png",
    category: "Review",
    title: "Pajero Sport 2024: Facelift yang Lebih Berwibawa",
    excerpt: "Tampilan baru yang lebih maskulin dengan teknologi terbaru di kelasnya.",
    date: "15 Jan 2024",
  },
  {
    image: "/images/outlander.png",
    category: "Teknologi",
    title: "Outlander PHEV: Masa Depan Mobil Hybrid",
    excerpt: "Teknologi plug-in hybrid terdepan untuk efisiensi tanpa kompromi.",
    date: "10 Jan 2024",
  },
  {
    image: "/images/xpander-cross.png",
    category: "Lifestyle",
    title: "Xpander Cross: Sahabat Petualangan Keluarga",
    excerpt: "Desain tangguh yang siap menemani setiap perjalanan keluarga Anda.",
    date: "5 Jan 2024",
  },
];

export default function Blog() {
  return (
    <SectionWrapper id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Latest News</span>
          <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] mt-4">
            Berita & Artikel
          </h2>
        </AnimatedSection>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <AnimatedSection key={post.title} delay={i * 0.12}>
              <article className="group cursor-pointer">
                {/* Image */}
                <div className="relative h-52 overflow-hidden rounded-xl mb-5 bg-muted">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Category */}
                <span className="text-xs tracking-[0.2em] text-[#c9a84c] uppercase font-medium">
                  {post.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] mt-2 mb-2 group-hover:text-[#c9a84c] transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <span className="inline-flex items-center gap-1 text-[#c9a84c] text-sm font-medium group-hover:gap-2 transition-all duration-300">
                    Baca
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.4} className="mt-12 text-center">
          <a
            href="#blog"
            className="inline-flex items-center gap-2 px-8 py-3 border border-[#c9a84c]/40 text-[#c9a84c] font-semibold tracking-wider text-sm hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300"
          >
            Lihat Semua Artikel
          </a>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
