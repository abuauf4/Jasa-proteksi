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
   1. SHORTCUT MENU — quick action cards (app-like)
   ═══════════════════════════════════════════════════ */

export function ShortcutMenu() {
  const shortcuts = [
    { icon: ShieldCheck, label: "All Risk", href: "/asuransi-mobil-all-risk", color: "#0F766E", bg: "#ECFDF5" },
    { icon: ShieldCheck, label: "TLO", href: "/asuransi-mobil-tlo", color: "#475569", bg: "#F1F5F9" },
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
    { title: "All Risk", desc: "Kerusakan sebagian hingga total", href: "/asuransi-mobil-all-risk", gradient: "from-[#ECFDF5] to-[#FFFFFF]", border: "border-[#A7F3D0]", iconColor: "#0F766E", iconBg: "#CCFBF1" },
    { title: "TLO", desc: "Kehilangan atau rusak total", href: "/asuransi-mobil-tlo", gradient: "from-[#F1F5F9] to-[#FFFFFF]", border: "border-[#E2E8F0]", iconColor: "#475569", iconBg: "#F1F5F9" },
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
          <Link href="/perbedaan-all-risk-dan-tlo" className="text-xs font-semibold text-[#64748B] hover:text-[#0F766E]">Lihat semua</Link>
        </div>
        <div className="flex flex-col gap-3">
          {articles.map((a) => (
            <Link key={a.id} href={`/blog/${a.slug}`} className="group rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden hover:shadow-lg transition-all">
              <div className="relative w-full aspect-[16/9] bg-[#F1F5F9] overflow-hidden">
                {a.coverImage ? (
                  <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ECFDF5] to-[#F1F5F9]">
                    <Calculator className="h-8 w-8 text-[#94A3B8]" aria-hidden />
                  </div>
                )}
              </div>
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
    { name: "Andi P.", role: "Pengguna All Risk", text: "Simulasinya cepat banget, tinggal pilih mobil langsung keluar estimasi preminya.", rating: 5, initials: "AP", color: "#0F766E", bg: "#ECFDF5" },
    { name: "Rina S.", role: "Pengguna TLO", text: "Bandingin premi dari 8 perusahaan sekaligus. Hemat waktu dan jelas.", rating: 5, initials: "RS", color: "#475569", bg: "#F1F5F9" },
    { name: "Budi H.", role: "Pengguna All Risk", text: "Prosesnya gampang, ga perlu isi form panjang. Langsung konsultasi via WA.", rating: 4, initials: "BH", color: "#0F766E", bg: "#ECFDF5" },
  ];
  return (
    <section className="px-4 sm:px-6 py-6">
      <div className="max-w-[500px] mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0F766E] mb-3">Testimoni</p>
        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
          {testimonials.map((t) => (
            <div key={t.name} className="flex-shrink-0 w-[280px] p-3.5 rounded-2xl bg-white border border-[#E2E8F0]">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: t.bg, color: t.color }}>{t.initials}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-[#0F172A] text-sm">{t.name}</p>
                  <p className="text-[10px] text-[#64748B]">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < t.rating ? "text-[#F59E0B]" : "text-[#E2E8F0]"}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
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
                <button type="button" onClick={() => setOpenIdx(isOpen ? null : idx)} className="w-full flex items-center justify-between gap-2 p-3.5 text-left" aria-expanded={isOpen}>
                  <span className="font-semibold text-[#0F172A] text-sm flex-1">{faq.q}</span>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-[#0F766E] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      {isOpen ? <path d="M5 12h14" /> : <><path d="M12 5v14" /><path d="M5 12h14" /></>}
                    </svg>
                  </span>
                </button>
                {isOpen && <div className="px-3.5 pb-3.5 pt-0"><p className="text-xs text-[#475569] leading-relaxed">{faq.a}</p></div>}
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
