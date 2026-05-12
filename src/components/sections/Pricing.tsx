"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    name: "DP Ringan",
    price: "Rp 4.5jt",
    period: "/bulan",
    dp: "DP 10%",
    description: "Cicilan ringan untuk Anda yang ingin segera memiliki Mitsubishi",
    features: [
      "DP mulai 10%",
      "Cicilan mulai Rp 4.5jt/bulan",
      "Tenor hingga 5 tahun",
      "Bunga kompetitif",
      "Proses cepat 1 hari",
      "Free ASRI tahun pertama",
    ],
    popular: false,
  },
  {
    name: "Best Value",
    price: "Rp 3.8jt",
    period: "/bulan",
    dp: "DP 20%",
    description: "Paket terbaik dengan keseimbangan DP dan cicilan",
    features: [
      "DP mulai 20%",
      "Cicilan mulai Rp 3.8jt/bulan",
      "Tenor hingga 6 tahun",
      "Bunga spesial dealer",
      "Proses cepat 1 hari",
      "Free ASRI tahun pertama",
      "Free accessories senilai Rp 5jt",
      "Gratis servis 2 tahun",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "Rp 2.9jt",
    period: "/bulan",
    dp: "DP 30%",
    description: "DP lebih besar, cicilan lebih ringan setiap bulannya",
    features: [
      "DP mulai 30%",
      "Cicilan mulai Rp 2.9jt/bulan",
      "Tenor hingga 7 tahun",
      "Bunga terendah",
      "Proses cepat 1 hari",
      "Free ASRI 2 tahun",
      "Free accessories senilai Rp 10jt",
      "Gratis servis 3 tahun",
      "Prioritas booking test drive",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <SectionWrapper id="promo" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-4">
            Paket Kredit Spesial
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Simulasi kredit dengan bunga terbaik
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {pricingTiers.map((tier, index) => (
            <AnimatedSection key={tier.name} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full"
              >
                <Card
                  className={`h-full relative overflow-hidden ${
                    tier.popular
                      ? "border-2 border-accent shadow-xl"
                      : "border-border/50 hover:border-accent/30"
                  } transition-all duration-300`}
                >
                  {tier.popular && (
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground border-0">
                      Recommended
                    </Badge>
                  )}
                  <CardHeader className="pb-2 pt-6 px-6">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-foreground">
                      {tier.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">{tier.description}</p>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="mb-6">
                      <span className="text-sm text-accent font-medium">{tier.dp}</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-4xl font-bold font-[family-name:var(--font-montserrat)] text-foreground">
                          {tier.price}
                        </span>
                        <span className="text-muted-foreground">{tier.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className={`w-full font-semibold ${
                        tier.popular
                          ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      }`}
                    >
                      <a href="#kontak">Hubungi Kami</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
