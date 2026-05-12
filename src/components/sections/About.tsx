"use client";

import { TrendingUp, Users, ThumbsUp, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { motion } from "framer-motion";

const stats = [
  { icon: TrendingUp, value: "10+", label: "Years Experience" },
  { icon: Users, value: "5000+", label: "Cars Sold" },
  { icon: ThumbsUp, value: "98%", label: "Customer Satisfaction" },
  { icon: Trophy, value: "15+", label: "Awards" },
];

export default function About() {
  return (
    <SectionWrapper id="tentang" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <AnimatedSection direction="left">
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-6">
              Tentang Kami
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Kami adalah dealer resmi Mitsubishi yang telah melayani masyarakat Indonesia selama
              lebih dari 10 tahun. Dengan komitmen untuk memberikan pelayanan terbaik, kami
              menyediakan pengalaman pembelian kendaraan yang nyaman, transparan, dan profesional.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Tim kami terdiri dari tenaga penjualan berpengalaman, teknisi bersertifikat, dan
              staf layanan pelanggan yang siap membantu Anda dalam setiap langkah — mulai dari
              pemilihan kendaraan, proses kredit, hingga after-sales service.
            </p>
            <Button
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              <a href="#kontak">Pelajari Lebih Lanjut</a>
            </Button>
          </AnimatedSection>

          {/* Image + Stats */}
          <AnimatedSection direction="right">
            {/* Image placeholder */}
            <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="text-6xl font-bold font-[family-name:var(--font-montserrat)] text-primary/20">
                  M
                </div>
                <p className="text-muted-foreground/50 text-sm mt-2">Showroom</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 bg-card rounded-xl border border-border/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  custom={index}
                >
                  <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-xs mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </SectionWrapper>
  );
}
