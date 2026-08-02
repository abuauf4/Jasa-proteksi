"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calculator, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/primitives";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";

interface ArticleShellProps {
  initialSettings: SiteSettings;
  initialHero: HeroData | null;
  title: string;
  description: string;
  updatedAt: string;
  faqs: Array<{ q: string; a: string }>;
  relatedArticles: Array<{ slug: string; title: string }>;
  children: React.ReactNode;
}

export function ArticleShell({
  initialSettings,
  initialHero,
  title,
  description,
  updatedAt,
  faqs,
  relatedArticles,
  children,
}: ArticleShellProps) {
  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={initialHero}>
      <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
        <SiteHeader />
        <main className="flex-1">
          {/* Article content */}
          <article className="px-4 sm:px-6 py-6 max-w-[680px] mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-[#64748B] mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#0F766E]">Beranda</Link>
              <span>/</span>
              <Link href="/artikel" className="hover:text-[#0F766E]">Artikel</Link>
              <span>/</span>
              <span className="text-[#0F172A] font-medium truncate">{title}</span>
            </nav>

            {/* Article body */}
            <div className="prose-content">
              {children}
            </div>

            {/* Updated date */}
            <p className="text-xs text-[#94A3B8] mt-8 pt-4 border-t border-[#E2E8F0]">
              Diperbarui: {updatedAt} · Tim Editorial Jasa Proteksi
            </p>

            {/* FAQ */}
            {faqs.length > 0 && (
              <section className="mt-8">
                <h2 className="text-lg font-bold text-[#0F172A] mb-3">Pertanyaan Umum</h2>
                <div className="flex flex-col gap-2">
                  {faqs.map((faq, idx) => (
                    <FAQItem key={idx} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </section>
            )}

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <section className="mt-8">
                <h2 className="text-lg font-bold text-[#0F172A] mb-3">Artikel Terkait</h2>
                <div className="flex flex-col gap-2">
                  {relatedArticles.map((art) => (
                    <Link
                      key={art.slug}
                      href={`/artikel/${art.slug}`}
                      className="group flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0F766E] hover:shadow-md transition-all"
                    >
                      <span className="flex-1 font-semibold text-[#0F172A] text-sm group-hover:text-[#0F766E]">{art.title}</span>
                      <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#0F766E]" aria-hidden />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Calculator embed */}
          <section className="px-4 sm:px-6 py-8 bg-white border-t border-[#E2E8F0]">
            <div className="max-w-[500px] mx-auto">
              <div className="text-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">Coba Sekarang</span>
                <h2 className="text-xl font-bold text-[#0F172A] mt-1">Hitung Premi Mobil Anda</h2>
                <p className="text-sm text-[#475569] mt-1">Estimasi otomatis dari 8 perusahaan asuransi.</p>
              </div>
              <HeroCalculator hideHeader />
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </ServerDataProvider>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-xl bg-white border border-[#E2E8F0] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 p-3.5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#0F172A] text-sm flex-1">{q}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${open ? "bg-[#0F766E] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open ? <path d="M5 12h14" /> : <><path d="M12 5v14" /><path d="M5 12h14" /></>}
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-3.5 pb-3.5">
          <p className="text-sm text-[#475569] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}
