"use client";

import { useState, useEffect } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  category: { name: string } | null;
}

export default function Blog() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => {
    fetch("/api/articles?status=published&limit=3")
      .then((res) => res.json())
      .then((data) => setArticles(data.articles || []))
      .catch(() => setArticles([]));
  }, []);

  // Don't render section at all while loading or when no articles exist
  // This prevents showing an empty/ugly section on the homepage
  if (articles === null) return null;
  if (articles.length === 0) return null;

  return (
    <SectionWrapper id="blog" className="bg-[#F5F5F0]">
      <div className="ds-container safe-px">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-14 lg:mb-20">
          <div className="flex justify-center mb-5 sm:mb-6">
            <div className="ds-accent-line" />
          </div>
          <span className="ds-label text-[#2E7D6F]">{t("blog.label")}</span>
          <TextReveal
            text={t("blog.heading")}
            as="h2"
            className="ds-h2 font-bold  mt-5 sm:mt-6 text-[#0D0D0D]"
            delay={0.1}
            staggerDelay={0.05}
          />
        </AnimatedSection>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article, i) => (
            <AnimatedSection key={article.id} delay={i * 0.08}>
              <a href={`/blog/${article.slug}`} className="block group cursor-pointer h-full bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-800 hover:border-[#2E7D6F]/15 hover:shadow-sm">
                {/* Image or placeholder header */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-gradient-to-br from-[#0A0F1E] to-[#141B30] flex items-center justify-center border-b border-gray-100">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="text-center">
                      <BookOpen className="w-12 h-12 text-[#2E7D6F]/25 mx-auto mb-3 group-hover:text-[#2E7D6F]/50 transition-colors duration-700" />
                      <p className="text-[#2E7D6F]/15 text-sm ">{t("blog.articleLabel")}</p>
                    </div>
                  )}
                  {/* Category overlay */}
                  {article.category && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] tracking-wider text-[#2E7D6F]/60 border border-[#2E7D6F]/25 px-2.5 py-0.5 rounded bg-[#0D0D0D]/50 backdrop-blur-sm uppercase font-medium">
                        {article.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="ds-card">
                  <h3 className="text-lg font-bold  mb-2.5 group-hover:text-[#2E7D6F] transition-colors duration-800 line-clamp-2 text-[#0D0D0D] leading-[1.3]">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-[1.7] mb-5 line-clamp-3">
                    {article.excerpt || ""}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#2E7D6F] text-sm font-medium group-hover:gap-2.5 transition-all duration-800">
                      {t("blog.readMore")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.4} className="mt-12 sm:mt-16 text-center">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#2E7D6F]/30 text-[#2E7D6F] font-semibold tracking-wider text-sm hover:bg-[#2E7D6F] hover:text-[#0D0D0D] transition-all duration-800 rounded-md min-h-[48px] sm:min-h-0"
          >
            {t("blog.viewAll")}
          </a>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
