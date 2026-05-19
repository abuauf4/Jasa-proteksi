"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const faqs = [
  {
    q: "Apakah Jasa Proteksi itu?",
    a: "Jasa Proteksi adalah platform yang menawarkan produk asuransi online, yang sesuai dengan kebutuhan gaya hidupmu. Jasa Proteksi berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) dengan nomor lisensi KEP-060/NB.1/2021.",
  },
  {
    q: "Bagaimana cara Jasa Proteksi bekerja?",
    a: "Jasa Proteksi menawarkan berbagai opsi produk asuransi dari asuransi terbaik dan ternama sehingga kamu tidak perlu melewati proses yang panjang dan rumit. Cukup dengan beberapa klik, kamu sudah bisa terlindungi dengan proses yang nyaman, praktis, dengan harga yang terjangkau.",
  },
  {
    q: "Bagaimana cara saya membeli produk asuransi?",
    a: "Pilih asuransi sesuai kebutuhan di halaman Produk dan masukan data-data yang diperlukan. Ketika semua informasi sudah dilengkapi, lanjut ke pembayaran melalui QRIS, dompet digital, virtual account, hingga kartu kredit. Setelah pembayaran sukses, polis asuransi akan langsung kamu terima.",
  },
  {
    q: "Ada produk asuransi apa sajakah di Jasa Proteksi?",
    a: "Jasa Proteksi menawarkan: 1) Asuransi Motor & Motor Listrik, 2) Asuransi Mobil & Mobil Listrik, 3) Asuransi Perjalanan (domestik & internasional), 4) Asuransi Hewan Peliharaan (anjing & kucing), 5) Asuransi Kecelakaan Diri. Semua tersedia dengan premi terjangkau dan proses pembelian yang mudah.",
  },
  {
    q: "Apakah proses klaim di Jasa Proteksi mudah?",
    a: "Sangat mudah! Jasa Proteksi menawarkan klaim dengan sistem reimbursement dan cashless. Proses klaim bisa dilakukan kapanpun dan dimanapun kamu berada. Untuk bantuan, kamu bisa menghubungi Customer Service Jasa Proteksi di hari Senin s.d Jumat, jam 10.00-17.00 WIB.",
  },
  {
    q: "Bagaimana jika produk yang saya inginkan tidak ada di Jasa Proteksi?",
    a: "Jasa Proteksi tetap bisa bantu kamu! Hubungi tim Telesales dengan mengklik tombol WhatsApp yang ada di website kami. Tim kami akan membantu menemukan solusi asuransi yang tepat untuk kebutuhanmu.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionWrapper id="faq" className="bg-[#F5F5F0]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="accent-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#2E7D6F] uppercase font-medium">FAQ</span>
          <TextReveal
            text="Pertanyaan Umum"
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] mt-4 text-[#0D0D0D]"
            delay={0.1}
          />
        </AnimatedSection>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div
                className={`border rounded-xl overflow-hidden transition-all duration-400 bg-white ${
                  openIndex === i
                    ? "border-[#2E7D6F]/30 bg-[#2E7D6F]/5"
                    : "border-gray-200 hover:border-[#2E7D6F]/20"
                }`}
                style={{ transitionDuration: "0.4s" }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-semibold font-[family-name:var(--font-montserrat)] text-sm sm:text-base pr-4 text-[#0D0D0D]">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ChevronDown
                      className="w-5 h-5 flex-shrink-0 text-[#2E7D6F]"
                    />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-5 text-gray-500 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.5} className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Masih punya pertanyaan?</p>
          <a
            href="#kontak"
            className="inline-flex items-center gap-2 text-[#2E7D6F] font-medium text-sm tracking-wider hover:gap-3 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            Hubungi Kami Langsung
          </a>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
