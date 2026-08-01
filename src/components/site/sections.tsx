"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calculator, MessageCircle, ArrowRight, Info, Check, ChevronDown,
} from "lucide-react";
import { Container } from "./primitives";
import { Button } from "./Button";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { buildWhatsAppLink } from "@/lib/format";
import { trackEvent } from "@/lib/analytics-events";

/* ═══════════════════════════════════════════════════
   HeroSection — White bg, typography-driven
   Calculator IS the CTA.
   ═══════════════════════════════════════════════════ */

export function HeroSection() {
  return (
    <section id="beranda" className="bg-white">
      <Container className="pt-12 pb-10 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: copy */}
          <div className="lg:col-span-5 flex flex-col gap-5 lg:pt-4">
            <span className="ds-eyebrow">
              Platform Asuransi Mobil
            </span>

            <h1 className="ds-h1">
              Hitung Premi Asuransi Mobil Secara Online
            </h1>

            <p className="ds-body-lg max-w-md">
              Cek estimasi premi All Risk atau TLO berdasarkan data kendaraan dan wilayah penggunaan Anda.
            </p>

            {/* Benefits as text with check marks */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[#0F172A]">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[#0F766E]" aria-hidden />
                Estimasi otomatis
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[#0F766E]" aria-hidden />
                All Risk &amp; TLO
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[#0F766E]" aria-hidden />
                Konsultasi gratis
              </span>
            </div>
          </div>

          {/* Right: calculator (the CTA) */}
          <div id="kalkulator" className="lg:col-span-7 scroll-mt-20">
            <HeroCalculator />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SimulationDisclaimer — Light strip after calculator
   ═══════════════════════════════════════════════════ */

export function SimulationDisclaimer() {
  return (
    <div className="bg-[#F8FAFC] border-y border-[#E2E8F0]">
      <Container className="py-3">
        <div className="flex items-start gap-2 text-sm text-[#64748B]">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#0F766E]" aria-hidden />
          <p>
            Hasil simulasi merupakan estimasi awal. Premi akhir mengikuti verifikasi dan quotation perusahaan asuransi.
          </p>
        </div>
      </Container>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CoverageComparison — All Risk vs TLO
   ═══════════════════════════════════════════════════ */

export function CoverageComparison() {
  return (
    <section id="jenis-proteksi" className="ds-section ds-bg-white">
      <Container>
        <div className="flex flex-col gap-8">
          <div>
            <span className="ds-eyebrow">Jenis Perlindungan</span>
            <h2 className="ds-h2 mt-2">Pilih Jenis Perlindungan Mobil</h2>
            <p className="ds-body-lg mt-3 max-w-xl">
              Pahami perbedaan perlindungan sebelum menghitung premi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0">
            {/* All Risk */}
            <div className="flex flex-col gap-4 md:pr-6 lg:pr-8">
              <h3 className="text-lg font-bold text-[#0F172A]">All Risk (Comprehensive)</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Melindungi dari kerusakan sebagian hingga berat, kehilangan akibat pencurian, dan pihak ketiga. Cocok untuk mobil baru atau yang rutin digunakan.
              </p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2 text-sm text-[#475569]">
                  <Check className="h-4 w-4 text-[#0F766E] flex-shrink-0 mt-0.5" aria-hidden />
                  Kerusakan sebagian sampai berat
                </li>
                <li className="flex items-start gap-2 text-sm text-[#475569]">
                  <Check className="h-4 w-4 text-[#0F766E] flex-shrink-0 mt-0.5" aria-hidden />
                  Kehilangan akibat pencurian
                </li>
                <li className="flex items-start gap-2 text-sm text-[#475569]">
                  <Check className="h-4 w-4 text-[#0F766E] flex-shrink-0 mt-0.5" aria-hidden />
                  Tanggung jawab pihak ketiga
                </li>
              </ul>
              <Link
                href="/asuransi-mobil-all-risk"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] hover:text-[#115E59] transition-colors mt-1"
                onClick={() => trackEvent("apply_click", {})}
              >
                Hitung Premi All Risk
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            {/* TLO — with left border divider on desktop */}
            <div className="flex flex-col gap-4 md:pl-6 lg:pl-8 md:border-l md:border-[#E2E8F0]">
              <h3 className="text-lg font-bold text-[#0F172A]">TLO (Total Loss Only)</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Melindungi hanya jika kendaraan mengalami kerusakan total atau hilang. Premi lebih terjangkau, cocok untuk mobil dengan nilai lebih rendah atau risiko besar.
              </p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2 text-sm text-[#475569]">
                  <Check className="h-4 w-4 text-[#0F766E] flex-shrink-0 mt-0.5" aria-hidden />
                  Kehilangan atau rusak total saja
                </li>
                <li className="flex items-start gap-2 text-sm text-[#475569]">
                  <Check className="h-4 w-4 text-[#0F766E] flex-shrink-0 mt-0.5" aria-hidden />
                  Premi lebih terjangkau
                </li>
                <li className="flex items-start gap-2 text-sm text-[#475569]">
                  <Check className="h-4 w-4 text-[#0F766E] flex-shrink-0 mt-0.5" aria-hidden />
                  Cocok untuk risiko besar
                </li>
              </ul>
              <Link
                href="/asuransi-mobil-tlo"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] hover:text-[#115E59] transition-colors mt-1"
                onClick={() => trackEvent("apply_click", {})}
              >
                Hitung Premi TLO
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   HowItWorks — 4-step vertical timeline on mobile
   ═══════════════════════════════════════════════════ */

export function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Isi Data Kendaraan",
      desc: "Pilih kendaraan, wilayah, dan kebutuhan perlindungan.",
    },
    {
      n: "2",
      title: "Lihat Estimasi Premi",
      desc: "Engine menghitung estimasi berdasarkan data yang Anda masukkan.",
    },
    {
      n: "3",
      title: "Konsultasikan Hasil",
      desc: "Pelajari hasil dan tanyakan detail perlindungan kepada tim.",
    },
    {
      n: "4",
      title: "Lanjutkan Pengajuan",
      desc: "Lengkapi verifikasi hingga polis diterbitkan oleh perusahaan asuransi terkait.",
    },
  ];

  return (
    <section id="cara-kerja" className="ds-section ds-bg-soft">
      <Container>
        <div className="flex flex-col gap-8">
          <div>
            <span className="ds-eyebrow">Cara Kerja</span>
            <h2 className="ds-h2 mt-2">Dari Simulasi hingga Polis</h2>
          </div>

          {/* Vertical timeline */}
          <ol className="relative flex flex-col gap-0">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-8 bottom-8 w-px bg-[#E2E8F0]" aria-hidden />

            {steps.map((step) => (
              <li key={step.n} className="relative flex items-start gap-4 py-3">
                <span className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm">
                  {step.n}
                </span>
                <div className="flex flex-col gap-1 pt-1">
                  <h3 className="font-bold text-[#0F172A] text-base">{step.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{step.desc}</p>
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
   PremiumFactors — Accordion
   ═══════════════════════════════════════════════════ */

const PREMIUM_FACTORS = [
  {
    title: "Nilai kendaraan (OTR)",
    desc: "Harga On The Road kendaraan menjadi dasar utama perhitungan premi. Semakin tinggi nilai kendaraan, semakin besar premi.",
  },
  {
    title: "Tahun kendaraan",
    desc: "Usia kendaraan memengaruhi tariff yang diterapkan. Kendaraan yang lebih tua umumnya memiliki besaran premi yang berbeda.",
  },
  {
    title: "Wilayah penggunaan",
    desc: "Wilayah registrasi kendaraan menentukan zona risiko. Wilayah dengan risiko lebih tinggi memiliki premi lebih besar.",
  },
  {
    title: "Jenis perlindungan (All Risk / TLO)",
    desc: "All Risk menanggung kerusakan sebagian hingga total. TLO hanya menanggung kerusakan total atau kehilangan.",
  },
  {
    title: "Perluasan jaminan",
    desc: "Perluasan seperti gempa bumi, banjir, terorisme, atau tanggung jawab penumpang menambah komponen premi.",
  },
  {
    title: "Jenis penggunaan kendaraan",
    desc: "Kendaraan untuk penggunaan pribadi, komersial, atau operasional memiliki tariff dan koefisien yang berbeda.",
  },
];

export function PremiumFactors() {
  return (
    <section id="faktor-premi" className="ds-section ds-bg-white">
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-8">
          <div>
            <span className="ds-eyebrow">Faktor Premi</span>
            <h2 className="ds-h2 mt-2">Apa yang Memengaruhi Premi Asuransi Mobil?</h2>
          </div>

          <div className="flex flex-col gap-2">
            {PREMIUM_FACTORS.map((factor, idx) => (
              <FactorAccordion key={idx} title={factor.title} desc={factor.desc} />
            ))}
          </div>

          <div className="mt-2">
            <Button
              as="link"
              href="/#kalkulator"
              variant="primary"
              size="md"
              onClick={() => trackEvent("apply_click", {})}
            >
              <Calculator className="h-4 w-4" aria-hidden />
              Coba Hitung Premi Mobil
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function FactorAccordion({ title, desc }: { title: string; desc: string }) {
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
        <span className="font-semibold text-[#0F172A] text-sm sm:text-base">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#64748B] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
          {desc}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PlatformBenefits — Simple list with check icons
   ═══════════════════════════════════════════════════ */

export function PlatformBenefits() {
  const benefits = [
    "Perhitungan menggunakan data kendaraan.",
    "Tersedia pilihan All Risk dan TLO.",
    "Hasil simulasi ditampilkan sebelum konsultasi.",
    "Hasil dapat langsung dilanjutkan ke proses pengajuan.",
  ];

  return (
    <section className="ds-section ds-bg-soft">
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-6">
          <div>
            <span className="ds-eyebrow">Keunggulan</span>
            <h2 className="ds-h2 mt-2">Simulasi yang Lebih Mudah Dipahami</h2>
          </div>

          <ul className="flex flex-col gap-3">
            {benefits.map((b, idx) => (
              <li key={idx} className="flex items-start gap-3 text-base text-[#475569]">
                <Check className="h-5 w-5 text-[#0F766E] flex-shrink-0 mt-0.5" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ServiceIdentity — About the service, real data only
   ═══════════════════════════════════════════════════ */

export function ServiceIdentity() {
  const { settings } = useSiteSettings();

  const whatsappLink = settings.whatsapp
    ? buildWhatsAppLink(
        settings.whatsapp,
        "Halo Jasa Proteksi, saya ingin bertanya tentang asuransi mobil."
      )
    : null;

  return (
    <section id="tentang-layanan" className="ds-section ds-bg-white">
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-6">
          <div>
            <span className="ds-eyebrow">Tentang Layanan</span>
            <h2 className="ds-h2 mt-2">Tentang Layanan Jasa Proteksi</h2>
          </div>

          <p className="ds-body-lg">
            Jasa Proteksi menyediakan simulasi premi awal dan membantu proses konsultasi serta pengajuan asuransi mobil. Premi, manfaat, dan polis akhir diterbitkan oleh perusahaan asuransi terkait.
          </p>

          {/* Contact details from real settings */}
          <div className="flex flex-col gap-3 text-sm">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#0F766E] hover:text-[#115E59] font-medium"
                onClick={() => trackEvent("whatsapp_click", {})}
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp: {settings.whatsapp}
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center gap-2 text-[#475569] hover:text-[#0F172A]"
              >
                <span className="font-medium">Email:</span> {settings.email}
              </a>
            )}
            {settings.address && (
              <p className="text-[#475569]">
                <span className="font-medium">Alamat:</span> {settings.address}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ArticlesSection — Fetch from API
   ═══════════════════════════════════════════════════ */

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  category: { name: string } | null;
}

export function ArticlesSection() {
  const [articles, setArticles] = React.useState<ArticleItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/articles?status=published&limit=3")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles || []);
      })
      .catch(() => {
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="ds-section ds-bg-soft">
      <Container>
        <div className="flex flex-col gap-6">
          <div>
            <span className="ds-eyebrow">Artikel</span>
            <h2 className="ds-h2 mt-2">Pelajari Asuransi Mobil</h2>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-[#E2E8F0] animate-pulse" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <p className="text-sm text-[#64748B]">
              Artikel belum tersedia. Silakan kunjungi halaman blog untuk pembaruan.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {articles.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
                  >
                    {/* Thumbnail */}
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt=""
                        className="w-24 h-[72px] rounded-lg object-cover flex-shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-24 h-[72px] rounded-lg bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center">
                        <Calculator className="h-5 w-5 text-[#CBD5E1]" aria-hidden />
                      </div>
                    )}
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#0F766E] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#64748B]">
                        {article.category?.name && <span>{article.category.name}</span>}
                        {article.publishedAt && (
                          <>
                            {article.category?.name && <span>·</span>}
                            <span>{formatDateShort(article.publishedAt)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}

function formatDateShort(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

/* ═══════════════════════════════════════════════════
   FAQSection — 8 questions, accordion
   ═══════════════════════════════════════════════════ */

const FAQ_ITEMS = [
  {
    q: "Apa itu asuransi mobil All Risk?",
    a: "All Risk (Comprehensive) melindungi kendaraan dari kerusakan sebagian hingga berat, kehilangan akibat pencurian, dan tanggung jawab terhadap pihak ketiga. Perlindungan ini lebih luas dibandingkan TLO.",
  },
  {
    q: "Apa itu asuransi mobil TLO?",
    a: "TLO (Total Loss Only) hanya memberikan ganti rugi jika kendaraan mengalami kerusakan total (biaya perbaikan melebihi persentase tertentu dari nilai kendaraan) atau hilang dicuri. Premi lebih terjangkau dibandingkan All Risk.",
  },
  {
    q: "Apakah hasil simulasi sama dengan premi final?",
    a: "Tidak. Hasil simulasi merupakan estimasi awal berdasarkan data yang Anda masukkan. Premi final mengikuti verifikasi dan quotation dari perusahaan asuransi penerbit polis.",
  },
  {
    q: "Berapa lama proses simulasi?",
    a: "Kurang dari 1 menit. Pilih merek, tipe, tahun, wilayah, dan jenis perlindungan — hasil otomatis ditampilkan.",
  },
  {
    q: "Apakah saya wajib membeli setelah simulasi?",
    a: "Tidak. Simulasi gratis dan tidak mengikat. Anda hanya melanjutkan pengajuan jika sudah yakin dengan hasil estimasi.",
  },
  {
    q: "Siapa yang menerbitkan polis?",
    a: "Polis diterbitkan oleh perusahaan asuransi terkait. Jasa Proteksi membantu proses simulasi dan pengajuan, bukan penerbit polis.",
  },
  {
    q: "Dokumen apa yang dibutuhkan?",
    a: "Untuk simulasi: tidak ada dokumen yang dibutuhkan. Untuk pengajuan resmi: KTP, STNK, dan dokumen pendukung lainnya via alur aman setelah konsultasi.",
  },
  {
    q: "Apa saja perluasan jaminan yang tersedia?",
    a: "Perluasan jaminan yang umum tersedia meliputi tanggung jawab penumpang, gempa bumi, banjir, angin topan, huru-hara dan terorisme, serta kecelakaan diri pengemudi. Ketersediaan bergantung pada perusahaan asuransi.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="ds-section ds-bg-white">
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-6">
          <div>
            <span className="ds-eyebrow">FAQ</span>
            <h2 className="ds-h2 mt-2">Pertanyaan yang Sering Ditanyakan</h2>
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
        <ChevronDown
          className={`h-4 w-4 text-[#64748B] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
   FinalCTA — Navy band
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
    <section id="final-cta" className="ds-section ds-bg-navy">
      <Container className="max-w-2xl text-center">
        <h2 className="ds-h2 !text-white">Siap Menghitung Premi Mobil Anda?</h2>
        <p className="ds-body-lg !text-[#CBD5E1] mt-3 max-w-md mx-auto">
          Lengkapi data kendaraan dan lihat estimasi premi All Risk atau TLO secara online.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button
            as="link"
            href="/#kalkulator"
            variant="primary"
            size="lg"
            onClick={() => trackEvent("apply_click", {})}
          >
            <Calculator className="h-4 w-4" aria-hidden />
            Hitung Premi Sekarang
          </Button>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors min-h-[44px]"
              onClick={() => trackEvent("whatsapp_click", {})}
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Konsultasi WhatsApp
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   LegalDisclaimer — Small disclaimer strip
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
