"use client";

import { useState } from "react";
import { Shield, Plane, PawPrint, Zap, UserCheck, Award, ZoomIn } from "lucide-react";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const galleryItems = [
  { icon: Shield, categoryKey: "vehicle", titleKey: "carMotor", color: "from-[#141B30]/60 to-[#0A0F1E]/30" },
  { icon: Plane, categoryKey: "travel", titleKey: "travel", color: "from-[#141B30]/60 to-[#0A0F1E]/30" },
  { icon: PawPrint, categoryKey: "pet", titleKey: "pet", color: "from-[#141B30]/60 to-[#0A0F1E]/30" },
  { icon: Zap, categoryKey: "vehicle", titleKey: "evMotor", color: "from-[#141B30]/60 to-[#0A0F1E]/30" },
  { icon: UserCheck, categoryKey: "personal", titleKey: "personal", color: "from-[#141B30]/60 to-[#0A0F1E]/30" },
  { icon: Award, categoryKey: "award", titleKey: "award", color: "from-[#2E7D6F]/15 to-[#2E7D6F]/5" },
];

const categoryKeys = ["all", "vehicle", "travel", "pet", "personal", "award"];

export default function Gallery() {
  const { t } = useLanguage();
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? galleryItems : galleryItems.filter((g) => g.categoryKey === active);

  return (
    <SectionWrapper id="galeri" className="bg-[#0D0D0D]" dark>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-4">
            <div className="accent-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#2E7D6F] uppercase font-medium">{t("gallery.label")}</span>
          <TextReveal
            text={t("gallery.heading")}
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mt-4"
            delay={0.1}
          />
        </AnimatedSection>

        {/* Filter */}
        <AnimatedSection delay={0.15} className="flex justify-center mb-10">
          <div className="inline-flex gap-1 p-1 rounded-lg bg-white/5 border border-white/5 flex-wrap justify-center">
            {categoryKeys.map((catKey) => (
              <button
                key={catKey}
                onClick={() => setActive(catKey)}
                className={`px-5 py-2 text-sm font-medium tracking-wider transition-all duration-300 rounded-md ${
                  active === catKey ? "bg-[#2E7D6F] text-[#0D0D0D]" : "text-white/60 hover:text-white"
                }`}
              >
                {t(`gallery.categories.${catKey}`)}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.titleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              style={{ height: "280px" }}
              whileHover={{ scale: 1.01 }}
              transition-hover={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} bg-[#0A0F1E]`} />

              {/* Decorative grid - emerald lines */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full" style={{
                  backgroundImage: "linear-gradient(rgba(46,125,111,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(46,125,111,0.3) 1px, transparent 1px)",
                  backgroundSize: "30px 30px"
                }} />
              </div>

              {/* Icon & Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <item.icon className="w-16 h-16 text-[#2E7D6F]/30 mx-auto mb-4 group-hover:text-[#2E7D6F]/60 transition-colors duration-500" />
                  <p className="text-white font-medium font-[family-name:var(--font-montserrat)] text-lg group-hover:text-[#2E7D6F] transition-colors duration-500">{t(`gallery.items.${item.titleKey}`)}</p>
                  <p className="text-[#2E7D6F] text-xs tracking-wider mt-1">{t(`gallery.categories.${item.categoryKey}`)}</p>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#0D0D0D]/0 group-hover:bg-[#0D0D0D]/30 transition-all duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ZoomIn className="w-8 h-8 text-[#2E7D6F]" />
                </div>
              </div>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0D0D0D]/50 to-transparent pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
