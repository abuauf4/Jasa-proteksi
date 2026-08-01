"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calculator, MessageCircle, ArrowRight, ShieldCheck, Sparkles,
} from "lucide-react";
import { Container } from "./primitives";
import { Button } from "./Button";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { buildWhatsAppLink } from "@/lib/format";
import { trackEvent } from "@/lib/analytics-events";

/**
 * Hero — typography-driven, navy fullbleed on desktop.
 * Calculator is the prominent element on the right (desktop) / below (mobile).
 * No generic "Sparkles + bullet list" — just H1 + 1 supporting line + calculator.
 */
export function HeroSection() {
  const { settings } = useSiteSettings();
  const whatsappLink = settings.whatsapp
    ? buildWhatsAppLink(
        settings.whatsapp,
        "Halo Jasa Proteksi, saya ingin konsultasi tentang premi asuransi mobil."
      )
    : null;

  return (
    <section
      id="beranda"
      className="relative bg-[#0F172A] text-white overflow-hidden"
    >
      {/* Subtle dot texture overlay */}
      <div
        className="absolute inset-0 ds-dot-texture-light opacity-50 pointer-events-none"
        aria-hidden
      />

      <Container className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: copy (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-5 lg:pt-6">
            <span className="ds-eyebrow !text-[#5EEAD4]">
              Simulasi Premi Asuransi Mobil
            </span>

            <h1 className="ds-h1 !text-white">
              Hitung premi mobil
              <br />
              <span className="!text-[#5EEAD4]">dalam 30 detik.</span>
            </h1>

            <p className="ds-body-lg !text-[#CBD5E1] max-w-md">
              All Risk atau TLO. Otomatis dari data kendaraan &amp; wilayah kamu.
              Tanpa daftar, tanpa biaya.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <Button
                as="link"
                href="/#kalkulator"
                variant="primary"
                size="lg"
                onClick={() => trackEvent("apply_click", {})}
              >
                <Calculator className="h-4 w-4" aria-hidden />
                Mulai Hitung
              </Button>
              {whatsappLink && (
                <Button
                  as="external"
                  href={whatsappLink}
                  variant="secondary"
                  size="lg"
                  className="!bg-transparent !text-white !border-white/30 hover:!bg-white/10 hover:!border-white/50"
                  onClick={() => trackEvent("whatsapp_click", {})}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Tanya Dulu
                </Button>
              )}
            </div>

            {/* Single hero stat — not a bullet list */}
            <div className="mt-4 pt-5 border-t border-white/10 flex items-baseline gap-3">
              <span className="text-3xl font-bold !text-white tracking-tight">49</span>
              <span className="text-sm text-[#94A3B8] leading-snug max-w-[200px]">
                merek mobil &amp; 13.000+ varian tersedia di database
              </span>
            </div>
          </div>

          {/* Right: calculator (7 cols on desktop, full width on mobile) */}
          <div id="kalkulator" className="lg:col-span-7 scroll-mt-20">
            <HeroCalculator />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Cara Kerja — 3 steps compact
   ═══════════════════════════════════════════════════ */

export function HowItWorks() {
  const steps = [
    { n: "1", title: "Isi Data", desc: "Merek, tipe, tahun, wilayah." },
    { n: "2", title: "Lihat Estimasi", desc: "Engine hitung otomatis." },
    { n: "3", title: "Lanjut Pengajuan", desc: "Konsultasi via WhatsApp." },
  ];

  return (
    <section id="cara-kerja" className="ds-section ds-bg-white">
      <Container>
        <div className="flex flex-col gap-8">
          <div>
            <span className="ds-eyebrow">Cara Kerja</span>
            <h2 className="ds-h2 mt-2">Tiga langkah, selesai.</h2>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {steps.map((step, idx) => (
              <li
                key={step.n}
                className="flex items-start gap-3 sm:flex-col sm:gap-2"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-base">
                  {step.n}
                </span>
                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <h3 className="font-bold text-[#0F172A] text-base sm:text-lg">{step.title}</h3>
                  <p className="text-sm text-[#475569]">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   All Risk vs TLO — 1 compact comparison table
   ═══════════════════════════════════════════════════ */

export function CoverageComparison() {
  return (
    <section id="jenis-proteksi" className="ds-section ds-bg-soft">
      <Container>
        <div className="flex flex-col gap-8">
          <div>
            <span className="ds-eyebrow">Pilih Proteksi</span>
            <h2 className="ds-h2 mt-2">All Risk atau TLO?</h2>
            <p className="ds-body-lg mt-2 max-w-xl">
              Pilih sesuai kebutuhan &amp; budget. Hitung estimasi keduanya di kalkulator.
            </p>
          </div>

          {/* Compact comparison table — not 2 cards side by side */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="grid grid-cols-3 text-sm">
              {/* Header row */}
              <div className="p-3 sm:p-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Aspek</span>
              </div>
              <div className="p-3 sm:p-4 bg-[#ECFDF5] border-b border-[#E2E8F0] border-l border-[#E2E8F0]">
                <span className="font-bold text-[#115E59]">All Risk</span>
              </div>
              <div className="p-3 sm:p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] border-l border-[#E2E8F0]">
                <span className="font-bold text-[#0F172A]">TLO</span>
              </div>

              {/* Row: Cakupan */}
              <Row3
                label="Cakupan"
                a="Kerusakan sebagian sampai berat"
                b="Hilang atau rusak total"
              />
              {/* Row: Cocok untuk */}
              <Row3
                label="Cocok untuk"
                a="Mobil baru, rutin dipakai"
                b="Premi hemat, risiko besar"
              />
              {/* Row: Premi */}
              <Row3
                label="Premi"
                a="Lebih tinggi"
                b="Lebih terjangkau"
              />
              {/* Row: Batas usia */}
              <Row3
                label="Batas usia mobil"
                a="Sesuai ketentuan asuransi"
                b="Sesuai ketentuan asuransi"
                last
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button as="link" href="/asuransi-mobil-all-risk" variant="outline" size="md" className="sm:flex-1">
              Hitung All Risk
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button as="link" href="/asuransi-mobil-tlo" variant="outline" size="md" className="sm:flex-1">
              Hitung TLO
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Row3({ label, a, b, last }: { label: string; a: string; b: string; last?: boolean }) {
  return (
    <>
      <div className={`p-3 sm:p-4 ${last ? "" : "border-b border-[#E2E8F0]"}`}>
        <span className="text-xs sm:text-sm font-semibold text-[#0F172A]">{label}</span>
      </div>
      <div className={`p-3 sm:p-4 border-l border-[#E2E8F0] ${last ? "" : "border-b border-[#E2E8F0]"}`}>
        <span className="text-xs sm:text-sm text-[#475569]">{a}</span>
      </div>
      <div className={`p-3 sm:p-4 border-l border-[#E2E8F0] ${last ? "" : "border-b border-[#E2E8F0]"}`}>
        <span className="text-xs sm:text-sm text-[#475569]">{b}</span>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ — accordion (kept compact)
   ═══════════════════════════════════════════════════ */

const FAQ_ITEMS = [
  {
    q: "Apa beda All Risk dan TLO?",
    a: "All Risk melindungi dari kerusakan sebagian sampai berat. TLO hanya untuk kehilangan atau kerusakan total sesuai ketentuan polis.",
  },
  {
    q: "Apakah hasil simulasi = harga final?",
    a: "Tidak. Hasil simulasi adalah estimasi awal. Premi final mengikuti quotation dari perusahaan asuransi penerbit polis.",
  },
  {
    q: "Berapa lama simulasi?",
    a: "Kurang dari 1 menit. Pilih merek, tipe, tahun, wilayah, dan jenis perlindungan. Hasil otomatis.",
  },
  {
    q: "Apakah saya wajib beli setelah simulasi?",
    a: "Tidak. Simulasi gratis dan tidak mengikat. Lanjut pengajuan hanya kalau kamu sudah yakin.",
  },
  {
    q: "Siapa yang terbitkan polis?",
    a: "Polis diterbitkan oleh perusahaan asuransi terkait. Jasa Proteksi bantu proses simulasi dan pengajuan, bukan penerbit polis.",
  },
  {
    q: "Dokumen apa yang dibutuhkan?",
    a: "Untuk simulasi: tidak ada. Untuk pengajuan resmi: KTP, STNK, dan dokumen lain via alur aman setelah konsultasi.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="ds-section ds-bg-white">
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-6">
          <div>
            <span className="ds-eyebrow">FAQ</span>
            <h2 className="ds-h2 mt-2">Pertanyaan yang sering ditanya.</h2>
          </div>

          <div className="flex flex-col gap-2">
            {FAQ_ITEMS.map((item, idx) => (
              <FAQAccordion key={idx} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function FAQAccordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  const btnId = React.useId();
  const panelId = React.useId();

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
      <button
        type="button"
        id={btnId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left min-h-[56px] hover:bg-[#F8FAFC] transition-colors"
      >
        <span className="font-semibold text-[#0F172A] text-sm sm:text-base">{q}</span>
        <ArrowRight
          className={`h-4 w-4 text-[#64748B] flex-shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={btnId}
          className="px-4 pb-4 text-sm text-[#475569] leading-relaxed"
        >
          {a}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Final CTA — minimal, navy band
   ═══════════════════════════════════════════════════ */

export function FinalCTA() {
  const { settings } = useSiteSettings();
  const whatsappLink = settings.whatsapp
    ? buildWhatsAppLink(
        settings.whatsapp,
        "Halo Jasa Proteksi, saya ingin konsultasi tentang premi asuransi mobil."
      )
    : null;

  return (
    <section id="final-cta" className="ds-section ds-bg-navy relative overflow-hidden">
      <div className="absolute inset-0 ds-dot-texture-light opacity-40 pointer-events-none" aria-hidden />
      <Container className="relative max-w-2xl text-center">
        <h2 className="ds-h2 !text-white">Belum yakin? Konsultasi dulu.</h2>
        <p className="ds-body-lg !text-[#CBD5E1] mt-3 max-w-md mx-auto">
          Tim kami bantu pilih jenis proteksi yang cocok dengan kebutuhan &amp; budget kamu.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
          <Button as="link" href="/#kalkulator" variant="primary" size="lg">
            <Calculator className="h-4 w-4" aria-hidden />
            Hitung Premi
          </Button>
          {whatsappLink && (
            <Button
              as="external"
              href={whatsappLink}
              variant="secondary"
              size="lg"
              className="!bg-transparent !text-white !border-white/30 hover:!bg-white/10"
              onClick={() => trackEvent("whatsapp_click", {})}
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Chat WhatsApp
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Legal disclaimer (small)
   ═══════════════════════════════════════════════════ */

export function LegalDisclaimer({ className }: { className?: string }) {
  return (
    <div
      id="disclaimer"
      className={`rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 ${className ?? ""}`}
    >
      <p className="text-xs text-[#64748B] leading-relaxed">
        <strong className="text-[#475569]">Disclaimer:</strong> Hasil simulasi adalah estimasi awal.
        Premi, manfaat, syarat, dan ketentuan akhir mengikuti quotation dari perusahaan asuransi penerbit polis.
      </p>
    </div>
  );
}
