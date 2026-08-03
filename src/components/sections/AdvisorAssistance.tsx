"use client";

import { UserCheck, MessageCircle, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import GradientMesh from "@/components/shared/GradientMesh";
import CTAButton from "@/components/shared/CTAButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { trackWhatsAppClick } from "@/lib/analytics-events";

const stepKeys = ["step1", "step2", "step3", "step4"];

const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  step1: ShieldCheck,
  step2: UserCheck,
  step3: CheckCircle2,
  step4: MessageCircle,
};

export default function AdvisorAssistance() {
  const { t } = useLanguage();
  const { settings, loading, ctaWhatsApp } = useSiteSettings();

  return (
    <section id="advisor" className="bg-[#F0FDFA] overflow-hidden relative">
      {/* Gradient Mesh */}
      <GradientMesh variant="warm-teal" />

      <div className="relative z-10 ds-section">
        <div className="ds-container safe-px">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 xl:gap-28 items-center">
            {/* Left - How It Works */}
            <AnimatedSection direction="left">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-12 h-[2px] bg-[#0D9488] rounded-sm" />
                <span className="ds-label text-[#0D9488]">{t("advisor.label")}</span>
              </div>
              <TextReveal
                text={t("advisor.heading")}
                as="h2"
                className="ds-h2 font-bold  text-[#0F172A] mb-5 sm:mb-7"
                delay={0.15}
                staggerDelay={0.04}
              />
              <p className="ds-body-lg text-[#64748B] mb-9 sm:mb-12 max-w-md">
                {t("advisor.subheading")}
              </p>

              <span className="ds-label text-[#0D9488] block mb-6 sm:mb-8">
                {t("advisor.howItWorks")}
              </span>

              <div>
                {stepKeys.map((key, i) => {
                  const Icon = stepIcons[key];
                  return (
                    <AnimatedSection key={key} delay={i * 0.1} direction="left">
                      <div className="flex gap-5 sm:gap-6 group mb-7 sm:mb-10 last:mb-0">
                        <div className="flex-shrink-0">
                          <div className="w-[2px] h-full min-h-[60px] bg-gradient-to-b from-[#0D9488] to-[#0D9488]/15 relative">
                            <div className="absolute -left-[7px] top-0 w-4 h-4 rounded-full border-2 border-[#0D9488] bg-[#F0FDFA] flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold  text-[#0F172A] mb-2 group-hover:text-[#0D9488] transition-colors duration-300">
                            {t(`advisor.steps.${key}.title`)}
                          </h3>
                          <p className="text-[#94A3B8] text-sm leading-[1.7]">
                            {t(`advisor.steps.${key}.desc`)}
                          </p>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </AnimatedSection>

            {/* Right - Advisor Image + CTA Card */}
            <AnimatedSection direction="right" delay={0.2}>
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-sm">
                  <Image
                    src="/advisor-consultation.webp"
                    alt="Insurance Advisor Consultation"
                    width={672}
                    height={480}
                    loading="lazy"
                    className="w-full h-auto min-h-[320px] sm:min-h-[480px] object-cover rounded-2xl"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent rounded-2xl" />
                  {/* CTA overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-bold  text-white mb-2">
                      {t("advisor.advisorTitle")}
                    </h3>
                    <p className="text-[#CBD5E1] text-xs leading-[1.7] mb-5 sm:mb-6 max-w-sm">
                      {t("advisor.advisorDesc")}
                    </p>
                    <CTAButton
                      variant="md"
                      color="orange"
                      href={ctaWhatsApp ? `https://wa.me/${ctaWhatsApp}` : "#"}
                      target={ctaWhatsApp ? "_blank" : undefined}
                      rel={ctaWhatsApp ? "noopener noreferrer" : undefined}
                      onClick={() => trackWhatsAppClick({ method: "advisor_cta" })}
                      icon={<MessageCircle className="w-4 h-4" />}
                      trailingIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      {t("advisor.ctaButton")}
                    </CTAButton>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
