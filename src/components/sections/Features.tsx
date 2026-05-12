"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fuel, ShieldCheck, Palette, Award } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const features = [
  {
    icon: Fuel,
    title: "Teknologi MIVEC",
    description:
      "Mesin dengan teknologi MIVEC (Mitsubishi Innovative Valve-timing and lift Electronic Control) memberikan performa optimal sekaligus efisiensi bahan bakar terbaik di kelasnya. Hemat BBM tanpa mengorbankan tenaga.",
    color: "from-green-500/20 to-green-600/5",
  },
  {
    icon: ShieldCheck,
    title: "Sistem Keselamatan",
    description:
      "Dilengkapi 7 Airbags, ABS (Anti-lock Braking System), EBD (Electronic Brake-force Distribution), dan struktur bodsi RISE (Reinforced Impact Safety Evolution) untuk perlindungan maksimal.",
    color: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: Palette,
    title: "Desain Premium",
    description:
      "Desain aerodinamis dan elegan yang memadukan garis-garis tegas dengan sentuhan modern. Setiap detail dirancang untuk memberikan kesan mewah dan sporty.",
    color: "from-purple-500/20 to-purple-600/5",
  },
  {
    icon: Award,
    title: "Garansi 5 Tahun",
    description:
      "Garansi komprehensif selama 5 tahun atau 150.000 km (mana yang tercapai lebih dulu). Jaminan kualitas dan ketenangan pikiran untuk setiap perjalanan Anda.",
    color: "from-amber-500/20 to-amber-600/5",
  },
];

export default function Features() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SectionWrapper id="keunggulan" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-4">
            Keunggulan Mitsubishi
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Teknologi terdepan yang menjadikan Mitsubishi pilihan terbaik
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Feature tabs */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.button
                key={feature.title}
                onClick={() => setActiveIndex(index)}
                className={`w-full text-left p-5 rounded-xl transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-accent/10 border-2 border-accent/30 shadow-md"
                    : "bg-card border-2 border-transparent hover:bg-muted/50 hover:border-border"
                }`}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activeIndex === index
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    } transition-colors duration-300`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold font-[family-name:var(--font-montserrat)] ${
                        activeIndex === index ? "text-accent" : "text-foreground"
                      } transition-colors duration-300`}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Feature detail */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="rounded-2xl overflow-hidden"
              >
                {/* Image placeholder */}
                <div
                  className={`aspect-[4/3] bg-gradient-to-br ${features[activeIndex].color} flex items-center justify-center rounded-2xl`}
                >
                  {(() => {
                    const Icon = features[activeIndex].icon;
                    return <Icon className="w-24 h-24 text-accent/30" strokeWidth={0.5} />;
                  })()}
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-3">
                    {features[activeIndex].title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {features[activeIndex].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
