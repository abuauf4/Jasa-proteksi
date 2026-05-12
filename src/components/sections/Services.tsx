"use client";

import { Car, CircleGauge, Calculator, Wrench, ArrowRightLeft, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { motion } from "framer-motion";

const services = [
  {
    icon: Car,
    title: "Penjualan Mobil Baru",
    description:
      "Pilihan lengkap model Mitsubishi terbaru dengan harga terbaik dan promo menarik setiap bulannya.",
  },
  {
    icon: CircleGauge,
    title: "Test Drive",
    description:
      "Rasakan langsung performa kendaraan Mitsubishi sebelum membeli. Booking jadwal test drive Anda.",
  },
  {
    icon: Calculator,
    title: "Simulasi Kredit",
    description:
      "Hitung simulasi kredit dengan bunga kompetitif dan DP ringan. Proses cepat dan mudah.",
  },
  {
    icon: Wrench,
    title: "Servis & Perawatan",
    description:
      "Bengkel resmi dengan teknisi berpengalaman dan suku cadang original untuk kendaraan Anda.",
  },
  {
    icon: ArrowRightLeft,
    title: "Trade-In",
    description:
      "Tukar mobil lama Anda dengan model Mitsubishi terbaru. Penilaian harga yang adil dan transparan.",
  },
  {
    icon: Shield,
    title: "Asuransi",
    description:
      "Perlindungan menyeluruh untuk kendaraan Anda dengan premi kompetitif dan proses klaim mudah.",
  },
];

export default function Services() {
  return (
    <SectionWrapper id="layanan" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-4">
            Layanan Kami
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Solusi otomotif lengkap untuk setiap kebutuhan Anda
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <AnimatedSection key={service.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Card className="h-full border-border/50 hover:shadow-xl hover:border-accent/30 transition-all duration-300 bg-card">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                      <service.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold font-[family-name:var(--font-montserrat)] text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <a
                      href="#kontak"
                      className="inline-flex items-center text-accent font-medium text-sm hover:gap-2 transition-all duration-300"
                    >
                      Learn More
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
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
