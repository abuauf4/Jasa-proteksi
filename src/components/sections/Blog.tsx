"use client";

import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { motion } from "framer-motion";

const blogPosts = [
  {
    title: "Mitsubishi Xpander 2024: Fitur Baru yang Wajib Anda Ketahui",
    excerpt:
      "Mitsubishi Xpander terbaru hadir dengan berbagai pembaruan signifikan mulai dari desain eksterior yang lebih agresif hingga fitur keselamatan canggih...",
    category: "Review",
    date: "15 Jan 2024",
    color: "from-blue-600 to-blue-800",
  },
  {
    title: "Tips Memilih Mobil Keluarga yang Tepat",
    excerpt:
      "Memilih mobil keluarga bukan perkara mudah. Ada banyak faktor yang perlu dipertimbangkan mulai dari kapasitas, kenyamanan, fitur keselamatan, hingga anggaran...",
    category: "Tips",
    date: "10 Jan 2024",
    color: "from-green-600 to-green-800",
  },
  {
    title: "Promo Akhir Tahun: Cashback Hingga Rp 30 Juta",
    excerpt:
      "Jangan lewatkan promo akhir tahun dari Mitsubishi! Dapatkan cashback hingga Rp 30 juta dan berbagai keuntungan lainnya untuk pembelian mobil baru...",
    category: "Promo",
    date: "5 Jan 2024",
    color: "from-red-600 to-red-800",
  },
];

export default function Blog() {
  return (
    <SectionWrapper id="blog" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-4">
            Berita & Artikel
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Informasi terbaru seputar dunia otomotif Mitsubishi
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <AnimatedSection key={post.title} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full"
              >
                <Card className="h-full overflow-hidden border-border/50 hover:shadow-xl hover:border-accent/30 transition-all duration-300">
                  <div
                    className={`aspect-[16/9] bg-gradient-to-br ${post.color} flex items-center justify-center relative`}
                  >
                    <div className="text-white/20 text-6xl font-bold font-[family-name:var(--font-montserrat)]">
                      M
                    </div>
                    <Badge className="absolute top-4 left-4 bg-white/20 text-white border-0 backdrop-blur-sm">
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </div>
                    <h3 className="text-lg font-semibold font-[family-name:var(--font-montserrat)] text-foreground mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center text-accent font-medium text-sm hover:gap-2 transition-all duration-300"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-10">
          <Button
            variant="outline"
            className="border-accent/30 text-accent hover:bg-accent/10 font-semibold"
          >
            Lihat Semua Artikel
          </Button>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
