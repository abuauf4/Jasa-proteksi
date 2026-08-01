"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calculator, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2,
} from "lucide-react";
import { Container, Section, SectionHeader, Card, Badge } from "./primitives";
import { Button } from "./Button";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { HeroCarousel } from "./HeroCarousel";
import { useSiteSettings, useHeroData } from "@/lib/ServerDataContext";
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
  const { heroData } = useHeroData();
  const whatsappLink = settings.whatsapp
    ? buildWhatsAppLink(
        settings.whatsapp,
        "Halo Jasa Proteksi, saya ingin konsultasi tentang premi asuransi mobil."
      )
    : null;

  const heroImage = heroData?.backgroundImage || "/hero-car-bg.webp";

  // Track current carousel slide for text alignment
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Build hero images array: multiple from settings, fallback to single backgroundImage
  const heroImages = React.useMemo(() => {
    const bg = heroData?.backgroundImage;
    if (bg) {
      const urls = bg.split(",").map(s => s.trim()).filter(Boolean);
      if (urls.length > 0) return urls;
    }
    return ["/hero-car-bg.webp"];
  }, [heroData?.backgroundImage]);

  return (
    <>
      {/* ═══ VISUAL HERO — rounded image card flush to navbar, calc overlays ═══ */}
      <section id="beranda" className="relative w-full bg-white pt-2 sm:pt-3">
        <Container className="!px-3 sm:!px-5">
          {/* Rounded image card — wider than calculator, flush to navbar */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-md" style={{ aspectRatio: "4 / 3" }}>
            <HeroCarousel images={heroImages} alt="Mobil terlindungi dengan asuransi" onSlideChange={setCurrentSlide} />

            {/* Shield graphic overlay — semi-transparent */}
            <div className="absolute top-5 right-4 sm:right-8 lg:right-12 pointer-events-none opacity-20 z-10" aria-hidden>
              <svg width="90" height="105" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 0L120 20V70C120 100 95 125 60 140C25 125 0 100 0 70V20L60 0Z" fill="white" fillOpacity="0.8" />
                <path d="M60 10L110 27V70C110 95 90 117 60 130C30 117 10 95 10 70V27L60 10Z" stroke="white" strokeWidth="2" fill="none" />
                <path d="M40 70L55 85L85 50" stroke="#0F766E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Text overlay — left aligned for images 1-2, right aligned for image 3 */}
            <div className={`absolute inset-0 flex flex-col justify-start pt-4 sm:pt-5 z-10 ${currentSlide === 2 ? "items-end text-right" : "items-start text-left"}`}>
              <div className="!px-4 sm:!px-6 max-w-[75%]">
                {/* Badge */}
                <span
                  className="inline-flex items-center gap-1.5 self-start px-3 h-[24px] rounded-full bg-white/90 backdrop-blur-sm text-[#0F766E] font-semibold shadow-sm"
                  style={{ fontSize: "11px", letterSpacing: "0.05em" }}
                >
                  <ShieldCheck className="h-3 w-3" aria-hidden />
                  Asuransi Mobil Online
                </span>

                {/* Headline — smaller */}
                <h2 className="font-extrabold text-[#0F172A] tracking-tight text-[16px] leading-[1.2] sm:text-[18px] lg:text-[22px] lg:leading-[1.15] mt-2">
                  Mobil Terlindungi,
                  <br />
                  Perjalanan Lebih Tenang.
                </h2>

                {/* Subheadline — 3 lines */}
                <p className="text-[11px] sm:text-[12px] text-[#475569] leading-snug mt-1">
                  Estimasi Premi<br />
                  All Risk atau TLO<br />
                  dari berbagai perusahaan
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══ CALCULATOR — overlay ke gambar hero (negative margin) ═══ */}
      <section className="bg-white relative z-10">
        <Container className="!px-5 sm:!px-6 -mt-12 sm:-mt-16 relative z-10 pb-6 lg:pb-8">
          <div id="kalkulator" className="scroll-mt-20 lg:max-w-[500px] lg:mx-auto">
            <HeroCalculator />
          </div>
        </Container>

        {/* ═══ BOTTOM INFO CARDS — All Risk + TLO quick links ═══ */}
        <Container className="!px-5 sm:!px-6 pb-8 lg:pb-12">
          <div className="grid grid-cols-2 gap-3 lg:max-w-[500px] lg:mx-auto">
            <Link
              href="/asuransi-mobil-all-risk"
              className="group flex items-center gap-3 p-3 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#0F766E] hover:shadow-md transition-all"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0F766E]">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0F172A] text-sm">All Risk</p>
                <p className="text-xs text-[#64748B] truncate">Komprehensif</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#0F766E] flex-shrink-0" aria-hidden />
            </Link>
            <Link
              href="/asuransi-mobil-tlo"
              className="group flex items-center gap-3 p-3 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#0F766E] hover:shadow-md transition-all"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#475569]">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0F172A] text-sm">TLO</p>
                <p className="text-xs text-[#64748B] truncate">Total Loss Only</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#0F766E] flex-shrink-0" aria-hidden />
            </Link>
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
