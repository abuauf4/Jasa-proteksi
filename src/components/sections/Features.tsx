"use client";

import { Zap, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const featureConfig = [
  { key: "fast", icon: Zap },
  { key: "secure", icon: ShieldCheck },
  { key: "affordable", icon: Clock },
];

export default function Features() {
  const { t } = useLanguage();
  return (
    <section id="fitur" className="bg-[#F5F5F0] overflow-hidden">
      <div className="py-28 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-center">
            {/* Left - Emotional Storytelling */}
            <AnimatedSection direction="left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[2px] bg-[#2E7D6F]" />
                <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">
                  {t("features.label")}
                </span>
              </div>
              <TextReveal
                text={t("features.heading")}
                as="h2"
                className="text-4xl lg:text-5xl xl:text-6xl font-bold  text-[#0D0D0D] mb-16 leading-[1.08]"
                delay={0.15}
                staggerDelay={0.04}
              />

              <div>
                {featureConfig.map((feature, i) => (
                  <AnimatedSection key={feature.key} delay={i * 0.1} direction="left">
                    <div className="flex gap-6 group mb-12 last:mb-0">
                      <div className="flex-shrink-0">
                        <div className="w-[2px] h-full min-h-[60px] bg-gradient-to-b from-[#2E7D6F] to-[#2E7D6F]/15 relative">
                          <div className="absolute -left-[7px] top-0 w-4 h-4 rounded-full border-2 border-[#2E7D6F] bg-[#F5F5F0]" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold  text-[#0D0D0D] mb-2 group-hover:text-[#2E7D6F] transition-colors duration-800">
                          {t(`features.items.${feature.key}.title`)}
                        </h3>
                        <p className="text-gray-400 text-sm leading-[1.8]">
                          {t(`features.items.${feature.key}.desc`)}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              <AnimatedSection delay={0.6} className="mt-14">
                <a
                  href="#model"
                  className="inline-flex items-center gap-2.5 text-[#2E7D6F] font-medium text-sm tracking-wider group"
                >
                  {t("features.exploreAll")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-800" />
                </a>
              </AnimatedSection>
            </AnimatedSection>

            {/* Right - Secure Process Showcase */}
            <AnimatedSection direction="right" delay={0.2}>
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0A0F1E] to-[#141B30] p-12 min-h-[420px] flex flex-col items-center justify-center border border-white/[0.05]">
                  {/* Shield Badge */}
                  <div className="w-24 h-24 rounded-full border-2 border-[#2E7D6F]/25 flex items-center justify-center mb-7">
                    <ShieldCheck className="w-12 h-12 text-[#2E7D6F]" />
                  </div>
                  <h3 className="text-xl font-bold  text-white text-center mb-2">
                    {t("features.secureTitle")}
                  </h3>
                  <p className="text-[#2E7D6F] text-sm tracking-wider uppercase text-center mb-5">
                    {t("features.secureSubtitle")}
                  </p>
                  <p className="text-white/30 text-xs text-center max-w-sm leading-[1.7]">
                    {t("features.secureDesc")}
                  </p>
                  {/* Subtle shine on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
