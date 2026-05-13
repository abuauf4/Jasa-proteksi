"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const faqs = [
  {
    q: "Berapa lama proses pengajuan kredit?",
    a: "Proses pengajuan kredit kami hanya membutuhkan 1-3 hari kerja. Tim kami akan membantu Anda dari awal hingga persetujuan, termasuk pengumpulan dokumen dan negosiasi dengan lembaga pembiayaan. Hubungi MIRA di WhatsApp 0811-1301-1300 untuk konsultasi gratis.",
  },
  {
    q: "Bagaimana cara booking test drive?",
    a: "Anda bisa booking test drive melalui website ini dengan mengisi form di bagian Kontak, atau menghubungi MIRA (Mitsubishi Intelligent Response Assistant) di WhatsApp 0811-1301-1300. Anda juga bisa langsung mengunjungi showroom terdekat.",
  },
  {
    q: "Apa saja dokumen yang diperlukan untuk kredit?",
    a: "Dokumen yang diperlukan meliputi: KTP, KK, NPWP, slip gaji 3 bulan terakhir, rekening koran 3 bulan terakhir, dan surat keterangan kerja. Untuk wirausaha, diperlukan tambahan SIUP dan laporan keuangan.",
  },
  {
    q: "Berapa lama garansi Mitsubishi?",
    a: "Garansi untuk kendaraan penumpang (Xpander, Pajero Sport, Xforce, Destinator, Outlander PHEV) adalah 3 tahun atau 100.000 km, mana yang tercapai lebih dahulu. Untuk Triton: 3 tahun atau 100.000 km. Untuk L300: 2 tahun atau 50.000 km.",
  },
  {
    q: "Apakah menerima tukar tambah?",
    a: "Tentu saja! Kami menerima trade-in untuk semua merek dan jenis kendaraan. Tim appraiser kami akan memberikan penilaian yang wajar dan transparan. Prosesnya cepat dan bisa dilakukan bersamaan dengan pembelian mobil baru.",
  },
  {
    q: "Apakah ada promo khusus saat ini?",
    a: "Kami selalu memiliki promo menarik yang berrotasi setiap bulan. Mulai dari DP ringan mulai 10%, bunga special 0% hingga 2 tahun, hingga cashback dan free accessories. Hubungi MIRA di WhatsApp 0811-1301-1300 untuk penawaran terkini.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionWrapper id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">FAQ</span>
          <TextReveal
            text="Pertanyaan Umum"
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] mt-4"
            delay={0.1}
          />
        </AnimatedSection>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <motion.div
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === i
                    ? "border-[#c9a84c]/30 bg-[#c9a84c]/5"
                    : "border-border hover:border-[#c9a84c]/20"
                }`}
                whileHover={{ x: openIndex === i ? 0 : 4 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-semibold font-[family-name:var(--font-montserrat)] text-sm sm:text-base pr-4">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown
                      className="w-5 h-5 flex-shrink-0 text-[#c9a84c]"
                    />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.5} className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Masih punya pertanyaan?</p>
          <a
            href="#kontak"
            className="inline-flex items-center gap-2 text-[#c9a84c] font-medium text-sm tracking-wider hover:gap-3 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            Hubungi Kami Langsung
          </a>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
