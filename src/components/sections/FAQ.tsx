"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "Bagaimana cara booking test drive?",
    answer:
      "Anda bisa booking test drive melalui website ini dengan mengisi form di bagian Kontak, menghubungi kami via WhatsApp di 0812-3456-7890, atau langsung datang ke showroom kami di Jl. Raya Protokol Halim PK, Jakarta Timur. Tim kami akan membantu menjadwalkan test drive sesuai waktu yang Anda inginkan.",
  },
  {
    question: "Berapa minimal DP untuk kredit Mitsubishi?",
    answer:
      "Minimal DP untuk kredit Mitsubishi mulai dari 10% dari harga kendaraan. Kami menawarkan berbagai paket kredit dengan DP ringan mulai 10%, 20%, hingga 30% dengan bunga kompetitif dan tenor hingga 7 tahun.",
  },
  {
    question: "Apakah ada promo trade-in?",
    answer:
      "Ya! Kami menawarkan promo trade-in dengan penilaian harga yang adil dan transparan. Anda bisa menukar mobil lama Anda dengan model Mitsubishi terbaru. Hubungi kami untuk mendapatkan penilaian gratis tanpa komitmen.",
  },
  {
    question: "Berapa lama garansi Mitsubishi?",
    answer:
      "Mitsubishi memberikan garansi komprehensif selama 5 tahun atau 150.000 km (mana yang tercapai lebih dulu). Garansi ini mencakup komponen utama kendaraan dan memberikan ketenangan pikiran bagi Anda.",
  },
  {
    question: "Apa saja dokumen yang diperlukan untuk kredit?",
    answer:
      "Dokumen yang diperlukan untuk pengajuan kredit: KTP (suami & istri), Kartu Keluarga, Surat Nikah, NPWP, Slip Gaji 3 bulan terakhir / Surat Keterangan Usaha, Rekening Koran 3 bulan terakhir, dan DP sesuai paket yang dipilih.",
  },
  {
    question: "Apakah bisa booking online?",
    answer:
      "Tentu! Anda bisa booking online melalui website ini. Isi form kontak, pilih model yang Anda minati, dan tim kami akan menghubungi Anda untuk melanjutkan proses. Booking online juga berlaku untuk test drive dan konsultasi kredit.",
  },
];

export default function FAQ() {
  return (
    <SectionWrapper id="faq" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:border-accent/30 data-[state=open]:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-semibold font-[family-name:var(--font-montserrat)] text-foreground hover:text-accent hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>

        <AnimatedSection className="text-center mt-10">
          <p className="text-muted-foreground mb-4">Masih punya pertanyaan?</p>
          <Button
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            <a href="#kontak">
              <MessageCircle className="w-4 h-4 mr-2" />
              Hubungi Kami
            </a>
          </Button>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
