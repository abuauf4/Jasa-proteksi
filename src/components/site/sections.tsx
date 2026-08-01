"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calculator, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2,
} from "lucide-react";
import { Container, Section, SectionHeader, Card, Badge } from "./primitives";
import { Button } from "./Button";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { buildWhatsAppLink } from "@/lib/format";
import { trackEvent } from "@/lib/analytics-events";
import { partnerLogoPath } from "@/components/calculator/types";

const PARTNER_NAMES = [
  "Sinarmas", "Multi Artha Guna", "ACA", "Mega Insurance",
  "Zurich Syariah", "Tugu", "Sahabat", "Oona",
];

/* ═══════════════════════════════════════════════════
   HERO — typography-driven, navy fullbleed, dense trust strip
   ═══════════════════════════════════════════════════ */

export function HeroSection() {
  const { settings } = useSiteSettings();
  const whatsappLink = settings.whatsapp
    ? buildWhatsAppLink(
        settings.whatsapp,
        "Halo Jasa Proteksi, saya ingin konsultasi tentang premi asuransi mobil."
      )
    : null;

  return (
    <>
      {/* ═══ VISUAL HERO — full-width image, text overlay ═══ */}
      <section id="beranda" className="relative w-full overflow-hidden bg-[#F0FDFA]">
        {/* Full-width image */}
        <div className="relative w-full h-[280px] sm:h-[340px] lg:h-[440px]">
          <img
            src="/hero-car-bg.webp"
            alt="Mobil terlindungi dengan asuransi"
            className="absolute inset-0 w-full h-full object-cover"
            priority
          />
          {/* Light gradient overlay — bottom fade for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent" />
        </div>

        {/* Text overlay — positioned at bottom of image */}
        <div className="absolute inset-0 flex flex-col justify-end pb-4 sm:pb-6">
          <Container className="!px-5 sm:!px-6">
            <div className="max-w-md">
              {/* Badge */}
              <span
                className="inline-flex items-center self-start px-3 h-[26px] rounded-full bg-[#0F766E] text-white font-semibold mb-2"
                style={{ fontSize: "11px", letterSpacing: "0.05em" }}
              >
                Asuransi Mobil Online
              </span>

              {/* Headline — 2 lines max */}
              <h2 className="font-extrabold text-[#0F172A] tracking-tight text-[26px] leading-[1.15] sm:text-[32px] lg:text-[40px] lg:leading-[1.1] mb-1.5">
                Mobil Terlindungi,
                <br />
                Perjalanan Lebih Tenang.
              </h2>

              {/* Subheadline — 2 lines max */}
              <p className="text-[13px] sm:text-sm text-[#475569] leading-snug mb-3 max-w-sm">
                Cek estimasi premi All Risk atau TLO dari berbagai perusahaan asuransi.
              </p>

              {/* CTA + Link */}
              <div className="flex items-center gap-3">
                <Button
                  as="link"
                  href="/#kalkulator"
                  variant="primary"
                  size="lg"
                  onClick={() => trackEvent("apply_click", {})}
                  className="!h-12 !min-h-[48px]"
                >
                  Cek Premi Sekarang
                </Button>
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#0F766E] hover:text-[#0B5C55] font-medium inline-flex items-center gap-1"
                    onClick={() => trackEvent("whatsapp_click", {})}
                  >
                    Konsultasi Gratis
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                )}
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ═══ CALCULATOR — directly below hero ═══ */}
      <section className="bg-white">
        <Container className="!px-5 sm:!px-6 pt-4 pb-8 lg:pt-6 lg:pb-12">
          <div id="kalkulator" className="scroll-mt-20 lg:max-w-[560px] lg:mx-auto">
            <HeroCalculator />
          </div>
        </Container>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   TRUST BAR — real partner logos strip
   ═══════════════════════════════════════════════════ */

export function TrustBar() {
  return (
    <section className="bg-white border-b border-[#E2E8F0] py-6">
      <Container>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider flex-shrink-0">
            Estimasi dari
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8 flex-1">
            {PARTNER_NAMES.map((name) => {
              const logo = partnerLogoPath(name);
              if (!logo) return null;
              return (
                <img
                  key={name}
                  src={logo}
                  alt={`Logo ${name}`}
                  className="h-6 sm:h-7 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CARA KERJA — editorial numbered list, not card grid
   ═══════════════════════════════════════════════════ */

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Isi data kendaraan",
      desc: "Merek, tipe, tahun, dan wilayah. Nilai OTR terisi otomatis.",
    },
    {
      n: "02",
      title: "Lihat estimasi",
      desc: "Engine hitung premi dari 8 perusahaan. Bandingkan tarif, admin, dan bengkel resmi.",
    },
    {
      n: "03",
      title: "Lanjut pengajuan",
      desc: "Pilih partner, konsultasi via WhatsApp. Dokumen hanya diminta saat pengajuan resmi.",
    },
  ];

  return (
    <Section tone="white" id="cara-kerja">
      <Container className="max-w-4xl">
        <div className="flex flex-col gap-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <span className="ds-eyebrow">Cara Kerja</span>
              <h2 className="ds-h2 mt-2">Tiga langkah, selesai.</h2>
            </div>
            <p className="text-sm text-[#64748B] hidden sm:block max-w-xs">
              Tanpa daftar akun. Tanpa biaya simulasi.
            </p>
          </div>

          <ol className="flex flex-col divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
            {steps.map((step) => (
              <li key={step.n} className="flex items-start gap-4 sm:gap-6 py-5 sm:py-6">
                <span className="flex-shrink-0 text-2xl sm:text-3xl font-bold text-[#0F766E] tracking-tighter tabular-nums">
                  {step.n}
                </span>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   COVERAGE COMPARISON — single dense table
   ═══════════════════════════════════════════════════ */

export function CoverageComparison() {
  return (
    <Section tone="soft" id="jenis-proteksi">
      <Container>
        <div className="flex flex-col gap-6">
          <div>
            <span className="ds-eyebrow">Pilih Proteksi</span>
            <h2 className="ds-h2 mt-2">All Risk atau TLO?</h2>
            <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-xl">
              Pilih sesuai kebutuhan &amp; budget. Hitung estimasi keduanya di kalkulator.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="grid grid-cols-3 text-sm">
              <div className="p-3 sm:p-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Aspek</span>
              </div>
              <div className="p-3 sm:p-4 bg-[#ECFDF5] border-b border-[#E2E8F0] border-l border-[#E2E8F0]">
                <span className="font-bold text-[#115E59]">All Risk</span>
                <span className="block text-xs text-[#0F766E] mt-0.5">Comprehensive</span>
              </div>
              <div className="p-3 sm:p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] border-l border-[#E2E8F0]">
                <span className="font-bold text-[#0F172A]">TLO</span>
                <span className="block text-xs text-[#64748B] mt-0.5">Total Loss Only</span>
              </div>

              <Row3 label="Cakupan" a="Kerusakan sebagian sampai berat" b="Hilang atau rusak total" />
              <Row3 label="Cocok untuk" a="Mobil baru, rutin dipakai" b="Premi hemat, risiko besar" />
              <Row3 label="Premi" a="Lebih tinggi" b="Lebih terjangkau" />
              <Row3 label="Batas usia mobil" a="Sesuai ketentuan asuransi" b="Sesuai ketentuan asuransi" last />
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
    </Section>
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
   FAQ — inline Q&A editorial, not accordion cards
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
    <Section tone="white" id="faq">
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-6">
          <div>
            <span className="ds-eyebrow">FAQ</span>
            <h2 className="ds-h2 mt-2">Pertanyaan umum.</h2>
          </div>

          <dl className="flex flex-col divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="py-5">
                <dt className="font-bold text-[#0F172A] text-base sm:text-lg tracking-tight">
                  {item.q}
                </dt>
                <dd className="mt-2 text-sm sm:text-base text-[#475569] leading-relaxed">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   FINAL CTA — subtle professional, not big generic band
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
    <Section tone="navy" id="final-cta" className="!py-12 sm:!py-16">
      <Container className="relative max-w-3xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
          <div className="flex-1">
            <h2 className="ds-h3 !text-white mb-2">Belum yakin? Konsultasi dulu.</h2>
            <p className="text-sm sm:text-base !text-[#CBD5E1] max-w-md leading-relaxed">
              Tim kami bantu pilih jenis proteksi yang cocok dengan kebutuhan &amp; budget kamu.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <Button as="link" href="/#kalkulator" variant="primary" size="md">
              <Calculator className="h-4 w-4" aria-hidden />
              Hitung Premi
            </Button>
            {whatsappLink && (
              <Button
                as="external"
                href={whatsappLink}
                variant="secondary"
                size="md"
                className="!bg-transparent !text-white !border-white/30 hover:!bg-white/10"
                onClick={() => trackEvent("whatsapp_click", {})}
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </Button>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   LEGAL DISCLAIMER (small)
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
