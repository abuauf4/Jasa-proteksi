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
import { buildCalculatorUrl, type CoverageParam } from "@/lib/calculator-urls";

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
      {/* ═══ HERO — image card + calculator overlap (separate DOM, overflow visible) ═══ */}
      <section id="beranda" className="relative w-full bg-white overflow-visible px-3 sm:px-4 pt-2">
        {/* Image wrapper — overflow-hidden HANYA untuk border radius */}
        <div className="relative w-full overflow-hidden shadow-md" style={{ borderRadius: "28px", aspectRatio: "4 / 3" }}>
          <HeroCarousel images={heroImages} alt="Mobil terlindungi dengan asuransi" onSlideChange={setCurrentSlide} className="w-full h-full object-cover" />

          {/* Shield graphic */}
          <div className="absolute top-5 right-4 sm:right-8 lg:right-12 pointer-events-none opacity-20 z-10" aria-hidden>
            <svg width="90" height="105" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 0L120 20V70C120 100 95 125 60 140C25 125 0 100 0 70V20L60 0Z" fill="white" fillOpacity="0.8" />
              <path d="M40 70L55 85L85 50" stroke="#0F766E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Text overlay */}
          <div className={`absolute inset-0 flex flex-col justify-start pt-4 sm:pt-5 z-10 ${currentSlide === 2 ? "items-end text-right" : "items-start text-left"}`}>
            <div className="px-4 sm:px-6 max-w-[75%]">
              <span
                className="inline-flex items-center gap-1.5 px-3 h-[24px] rounded-full bg-white/90 backdrop-blur-sm text-[#0F766E] font-semibold shadow-sm"
                style={{ fontSize: "11px", letterSpacing: "0.05em" }}
              >
                <ShieldCheck className="h-3 w-3" aria-hidden />
                Asuransi Mobil Online
              </span>
              <h2
                className="font-extrabold tracking-tight text-[16px] leading-[1.2] sm:text-[18px] lg:text-[22px] mt-2 text-white"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
              >
                Mobil Terlindungi,<br />Perjalanan Lebih Tenang.
              </h2>
              <p
                className="text-[11px] sm:text-[12px] leading-snug mt-1 text-white"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
              >
                Estimasi Premi<br />All Risk atau TLO<br />dari berbagai perusahaan
              </p>
            </div>
          </div>
        </div>

        {/* Calculator — separate card, overlap ke depan gambar */}
        <div id="kalkulator" className="relative z-20 scroll-mt-20 mx-auto lg:max-w-[500px]" style={{ marginTop: "-64px" }}>
          <div className="px-2 sm:px-4">
            <HeroCalculator />
          </div>
        </div>
      </section>

      {/* Bottom info cards */}
      <section className="bg-white">
        <Container className="!px-5 sm:!px-6 pt-4 pb-8 lg:pb-12">
          <div className="grid grid-cols-2 gap-3 lg:max-w-[500px] lg:mx-auto">
            <Link href="/asuransi-mobil-all-risk" className="group flex items-center gap-2.5 p-3 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#0F766E] hover:shadow-md transition-all">
              <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0F766E]">
                <ShieldCheck className="h-4 w-4" aria-hidden />
              </span>
              <span className="flex-1 font-bold text-[#0F172A] text-sm">All Risk</span>
              <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#0F766E] flex-shrink-0" aria-hidden />
            </Link>
            <Link href="/asuransi-mobil-tlo" className="group flex items-center gap-2.5 p-3 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#0F766E] hover:shadow-md transition-all">
              <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#475569]">
                <ShieldCheck className="h-4 w-4" aria-hidden />
              </span>
              <span className="flex-1 font-bold text-[#0F172A] text-sm">TLO</span>
              <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#0F766E] flex-shrink-0" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}


/* ═══════════════════════════════════════════════════
   1. SHORTCUT MENU — quick action cards (app-like)
   ═══════════════════════════════════════════════════ */

export function ShortcutMenu() {
  const shortcuts = [
    { icon: ShieldCheck, label: "All Risk", href: buildCalculatorUrl("all-risk"), color: "#0F766E", bg: "#ECFDF5" },
    { icon: ShieldCheck, label: "TLO", href: buildCalculatorUrl("tlo"), color: "#475569", bg: "#F1F5F9" },
    { icon: Calculator, label: "Cek Premi", href: "/#kalkulator", color: "#0F766E", bg: "#ECFDF5" },
    { icon: ArrowRight, label: "Cara Kerja", href: "/#cara-kerja", color: "#475569", bg: "#F1F5F9" },
  ];

  return (
    <section className="px-4 sm:px-6 py-4">
      <div className="grid grid-cols-4 gap-2.5 max-w-[500px] mx-auto">
        {shortcuts.map((s) => (
          <Link key={s.label} href={s.href} className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white border border-[#E2E8F0] hover:shadow-md transition-all">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
              <s.icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-[11px] font-semibold text-[#0F172A] text-center leading-tight">{s.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   2. PROMO BANNER — visual horizontal banner
   ═══════════════════════════════════════════════════ */

export function PromoBanner() {
  return (
    <section className="px-4 sm:px-6 py-3">
      <Link href="/#kalkulator" className="block relative w-full max-w-[500px] mx-auto rounded-2xl overflow-hidden bg-gradient-to-r from-[#0F766E] to-[#0B5C55] p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Pilih Perlindungan Mobil</p>
            <p className="text-[#A7F3D0] text-xs mt-0.5">Simulasi All Risk & TLO gratis</p>
          </div>
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-white" aria-hidden />
          </span>
        </div>
      </Link>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   3. COVERAGE CARDS — All Risk + TLO visual cards
   ═══════════════════════════════════════════════════ */

export function CoverageCards() {
  const cards = [
    { title: "All Risk", desc: "Kerusakan sebagian hingga total", href: buildCalculatorUrl("all-risk"), gradient: "from-[#ECFDF5] to-[#FFFFFF]", border: "border-[#A7F3D0]", iconColor: "#0F766E", iconBg: "#CCFBF1" },
    { title: "TLO", desc: "Kehilangan atau rusak total", href: buildCalculatorUrl("tlo"), gradient: "from-[#F1F5F9] to-[#FFFFFF]", border: "border-[#E2E8F0]", iconColor: "#475569", iconBg: "#F1F5F9" },
  ];

  return (
    <section className="px-4 sm:px-6 py-4">
      <div className="grid grid-cols-2 gap-3 max-w-[500px] mx-auto">
        {cards.map((c) => (
          <Link key={c.title} href={c.href} className={`group relative rounded-2xl border ${c.border} bg-gradient-to-b ${c.gradient} p-4 hover:shadow-lg transition-all overflow-hidden`}>
            <div className="flex items-start justify-between mb-3">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.iconBg, color: c.iconColor }}>
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </span>
              <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#0F766E] transition-colors" aria-hidden />
            </div>
            <h3 className="font-bold text-[#0F172A] text-base">{c.title}</h3>
            <p className="text-xs text-[#64748B] mt-0.5 leading-snug">{c.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   4. APP STEPS — cara kerja as vertical stepper
   ═══════════════════════════════════════════════════ */

export function AppSteps() {
  const steps = [
    { n: "1", title: "Isi Data Kendaraan", desc: "Merek, tipe, tahun, wilayah" },
    { n: "2", title: "Lihat Estimasi", desc: "Premi dari 8 perusahaan" },
    { n: "3", title: "Bandingkan", desc: "Pilih partner terbaik" },
    { n: "4", title: "Konsultasi", desc: "Lanjut pengajuan via WhatsApp" },
  ];

  return (
    <section id="cara-kerja" className="px-4 sm:px-6 py-6">
      <div className="max-w-[500px] mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0F766E] mb-3">Cara Kerja</p>
        <div className="flex flex-col gap-2">
          {steps.map((s) => (
            <div key={s.n} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#E2E8F0]">
              <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm">{s.n}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#0F172A] text-sm">{s.title}</p>
                <p className="text-xs text-[#64748B]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   5. ARTICLE CARDS — content cards with thumbnail
   ═══════════════════════════════════════════════════ */

export function ArticleCards() {
  const [articles, setArticles] = React.useState<Array<{ id: string; slug: string; title: string; excerpt: string | null; coverImage: string | null; publishedAt: string | null }>>([]);

  React.useEffect(() => {
    fetch("/api/articles?status=published&limit=3").then((r) => r.ok ? r.json() : null).then((d) => { if (d?.articles) setArticles(d.articles); }).catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 py-6">
      <div className="max-w-[500px] mx-auto">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">Artikel</p>
          <Link href="/artikel" className="text-xs font-semibold text-[#64748B] hover:text-[#0F766E]">Lihat semua</Link>
        </div>
        <div className="flex flex-col gap-3">
          {articles.map((a, idx) => (
            <Link key={a.id} href={`/artikel/${a.slug}`} className="group rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden hover:shadow-lg transition-all">
              {/* Thumbnail — full width, 16:9 */}
              <div className="relative w-full aspect-[16/9] bg-[#F1F5F9] overflow-hidden">
                {a.coverImage ? (
                  <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ECFDF5] to-[#F1F5F9]">
                    <Calculator className="h-8 w-8 text-[#94A3B8]" aria-hidden />
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="p-3.5">
                <h3 className="font-semibold text-[#0F172A] text-sm line-clamp-2 group-hover:text-[#0F766E] transition-colors leading-snug">{a.title}</h3>
                {a.excerpt && <p className="text-xs text-[#64748B] line-clamp-2 mt-1 leading-relaxed">{a.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   6. TESTIMONIAL CARDS — user reviews as app-style cards
   ═══════════════════════════════════════════════════ */

export function TestimonialCards() {
  const testimonials = [
    {
      name: "Andi P.",
      role: "Pengguna All Risk",
      text: "Simulasinya cepat banget, tinggal pilih mobil langsung keluar estimasi preminya.",
      rating: 5,
      initials: "AP",
      color: "#0F766E",
      bg: "#ECFDF5",
    },
    {
      name: "Rina S.",
      role: "Pengguna TLO",
      text: "Bandingin premi dari 8 perusahaan sekaligus. Hemat waktu dan jelas.",
      rating: 5,
      initials: "RS",
      color: "#475569",
      bg: "#F1F5F9",
    },
    {
      name: "Budi H.",
      role: "Pengguna All Risk",
      text: "Prosesnya gampang, ga perlu isi form panjang. Langsung konsultasi via WA.",
      rating: 4,
      initials: "BH",
      color: "#0F766E",
      bg: "#ECFDF5",
    },
  ];

  return (
    <section className="px-4 sm:px-6 py-6">
      <div className="max-w-[500px] mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0F766E] mb-3">Testimoni</p>
        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
          {testimonials.map((t) => (
            <div key={t.name} className="flex-shrink-0 w-[280px] p-3.5 rounded-2xl bg-white border border-[#E2E8F0]">
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: t.bg, color: t.color }}
                >
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-[#0F172A] text-sm">{t.name}</p>
                  <p className="text-[10px] text-[#64748B]">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < t.rating ? "text-[#F59E0B]" : "text-[#E2E8F0]"}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   7. FAQ CARDS — expandable app-style cards
   ═══════════════════════════════════════════════════ */

export function FAQCards() {
  const faqs = [
    { q: "Apa beda All Risk dan TLO?", a: "All Risk melindungi dari kerusakan sebagian hingga total. TLO hanya untuk kehilangan atau rusak total sesuai ketentuan polis." },
    { q: "Apakah hasil simulasi = harga final?", a: "Tidak. Hasil simulasi adalah estimasi awal. Premi final mengikuti quotation dari perusahaan asuransi penerbit polis." },
    { q: "Berapa lama simulasi?", a: "Kurang dari 1 menit. Pilih merek, tipe, tahun, wilayah, dan jenis perlindungan. Hasil otomatis." },
    { q: "Apakah saya wajib beli setelah simulasi?", a: "Tidak. Simulasi gratis dan tidak mengikat. Lanjut pengajuan hanya kalau kamu sudah yakin." },
    { q: "Siapa yang terbitkan polis?", a: "Polis diterbitkan oleh perusahaan asuransi terkait. Jasa Proteksi bantu proses simulasi dan pengajuan, bukan penerbit polis." },
    { q: "Dokumen apa yang dibutuhkan?", a: "Untuk simulasi: tidak ada. Untuk pengajuan resmi: KTP, STNK, dan dokumen lain via alur aman setelah konsultasi." },
  ];

  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  return (
    <section id="faq" className="px-4 sm:px-6 py-6">
      <div className="max-w-[500px] mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0F766E] mb-3">FAQ</p>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-2 p-3.5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-[#0F172A] text-sm flex-1">{faq.q}</span>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-[#0F766E] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      {isOpen ? <path d="M5 12h14" /> : <><path d="M12 5v14" /><path d="M5 12h14" /></>}
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-0">
                    <p className="text-xs text-[#475569] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   8. INFO MODULE — service info + disclaimer
   ═══════════════════════════════════════════════════ */

export function InfoModule() {
  const { settings } = useSiteSettings();
  const items = [
    { icon: Calculator, label: "Simulasi Premi", desc: "Gratis, otomatis" },
    { icon: MessageCircle, label: "Konsultasi", desc: "Via WhatsApp" },
    { icon: ShieldCheck, label: "Pengajuan", desc: "Proses aman" },
  ];

  return (
    <section className="px-4 sm:px-6 py-6">
      <div className="max-w-[500px] mx-auto flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-[#E2E8F0]">
              <span className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#0F766E]">
                <item.icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-[11px] font-semibold text-[#0F172A] text-center">{item.label}</span>
              <span className="text-[10px] text-[#64748B] text-center">{item.desc}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] p-3.5">
          <p className="text-xs text-[#64748B] leading-relaxed text-center">
            Jasa Proteksi menyediakan simulasi awal dan bantuan proses pengajuan. Premi, manfaat, dan ketentuan akhir mengikuti quotation dari perusahaan asuransi penerbit polis.
          </p>
        </div>
        {settings.whatsapp && (
          <a href={buildWhatsAppLink(settings.whatsapp, "Halo Jasa Proteksi, saya ingin bertanya.")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#0F766E] text-white font-semibold text-sm hover:bg-[#0B5C55] transition-colors">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Hubungi Kami
          </a>
        )}
      </div>
    </section>
  );
}
