"use client";

import { BookOpen, HelpCircle, ListChecks, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const blogKeys = ["post1", "post2", "post3"];

const blogIcons = [BookOpen, HelpCircle, ListChecks];

export default function Blog() {
  const { t } = useLanguage();
  return (
    <SectionWrapper id="blog" className="bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-24">
          <div className="flex justify-center mb-6">
            <div className="accent-line" />
          </div>
          <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">{t("blog.label")}</span>
          <TextReveal
            text={t("blog.heading")}
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] mt-6 text-[#0D0D0D] leading-[1.1]"
            delay={0.1}
            staggerDelay={0.05}
          />
        </AnimatedSection>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogKeys.map((key, i) => {
            const Icon = blogIcons[i];
            return (
            <AnimatedSection key={key} delay={i * 0.08}>
              <article className="group cursor-pointer h-full bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-800 hover:border-[#2E7D6F]/15 hover:shadow-sm">
                {/* Icon Header */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#0A0F1E] to-[#141B30] flex items-center justify-center border-b border-gray-100">
                  <div className="text-center">
                    <Icon className="w-12 h-12 text-[#2E7D6F]/25 mx-auto mb-3 group-hover:text-[#2E7D6F]/50 transition-colors duration-700" />
                    <p className="text-[#2E7D6F]/15 text-sm font-[family-name:var(--font-montserrat)]">{t("blog.articleLabel")}</p>
                  </div>
                  {/* Category overlay */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] tracking-wider text-[#2E7D6F]/60 border border-[#2E7D6F]/25 px-2.5 py-0.5 rounded bg-[#0D0D0D]/50 backdrop-blur-sm uppercase font-medium">
                      {t(`blog.items.${key}.category`)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  {/* Title */}
                  <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] mb-2.5 group-hover:text-[#2E7D6F] transition-colors duration-800 line-clamp-2 text-[#0D0D0D] leading-[1.3]">
                    {t(`blog.items.${key}.title`)}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-400 leading-[1.7] mb-5">
                    {t(`blog.items.${key}.excerpt`)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">{t(`blog.items.${key}.date`)}</span>
                    <span className="inline-flex items-center gap-1.5 text-[#2E7D6F] text-sm font-medium group-hover:gap-2.5 transition-all duration-800">
                      {t("blog.readMore")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            </AnimatedSection>
            );
          })}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.4} className="mt-16 text-center">
          <a
            href="#blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#2E7D6F]/30 text-[#2E7D6F] font-semibold tracking-wider text-sm hover:bg-[#2E7D6F] hover:text-[#0D0D0D] transition-all duration-800 rounded-md"
          >
            {t("blog.viewAll")}
          </a>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
