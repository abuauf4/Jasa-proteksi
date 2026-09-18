"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Calculator, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/primitives";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";
import { PILLAR_ARTICLES } from "@/lib/pillar-articles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

interface ArticleShellProps {
  initialSettings: SiteSettings;
  initialHero: HeroData | null;
  title: string;
  description?: string;
  updatedAt: string;
  coverImage?: string | null;
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
  coverImage,
  faqs,
  relatedArticles,
  children,
}: ArticleShellProps) {
  const pathname = usePathname();
  const pillarArticle = PILLAR_ARTICLES.find((article) => article.href === pathname);
  const articleUrl = `${SITE_URL}${pathname}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${articleUrl}#article`,
        headline: pillarArticle?.title || title,
        description: pillarArticle?.excerpt || description,
        url: articleUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        ...(coverImage
          ? {
              image: [
                coverImage.startsWith("http")
                  ? coverImage
                  : `${SITE_URL}${coverImage.startsWith("/") ? "" : "/"}${coverImage}`,
              ],
            }
          : {}),
        ...(pillarArticle?.publishedAt ? { datePublished: pillarArticle.publishedAt } : {}),
        author: {
          "@type": "Organization",
          name: "Tim Editorial Jasa Proteksi",
          url: `${SITE_URL}/tentang-kami#editorial`,
        },
        publisher: {
          "@type": "Organization",
          name: "Jasa Proteksi",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logo-jasa-proteksi.webp`,
          },
        },
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          name: "Jasa Proteksi",
          url: SITE_URL,
        },
        inLanguage: "id-ID",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Artikel",
            item: `${SITE_URL}/artikel`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: pillarArticle?.title || title,
            item: articleUrl,
          },
        ],
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${articleUrl}#faq`,
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a,
                },
              })),
            },
          ]
        : []),
    ],
  };

  // Ensure article pages always start at the top — prevents scroll-to-calculator
  // on navigation and compensates for App Router scroll restoration quirks.
  React.useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={initialHero}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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

            {/* Cover image */}
            {coverImage && (
              <div className="relative rounded-xl overflow-hidden mb-6 aspect-video">
                <img
                  src={coverImage}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* Article body */}
            <div className="prose-content">
              {children}
            </div>

            {/* Editorial trust note */}
            <aside className="mt-8 rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] p-4">
              <p className="text-sm font-semibold text-[#115E59] mb-1">Tentang konten ini</p>
              <p className="text-xs text-[#475569] leading-relaxed">
                Panduan ini disusun berdasarkan informasi produk dan data yang digunakan
                pada platform Jasa Proteksi saat artikel diperbarui. Hasil simulasi adalah
                estimasi awal; premi, manfaat, syarat, dan ketentuan akhir mengikuti quotation
                serta polis perusahaan asuransi terkait.
              </p>
              <Link
                href="/tentang-kami#editorial"
                className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#0F766E] hover:underline"
              >
                Tentang Jasa Proteksi & proses editorial
                <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </aside>

            {/* Updated date */}
            <p className="text-xs text-[#94A3B8] mt-4 pt-4 border-t border-[#E2E8F0]">
              Diperbarui: {updatedAt} ·{" "}
              <Link href="/tentang-kami#editorial" className="hover:text-[#0F766E] hover:underline">
                Tim Editorial Jasa Proteksi
              </Link>
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
                  {relatedArticles.map((art) => {
                    const href =
                      PILLAR_ARTICLES.find((pillar) => pillar.slug === art.slug)?.href ||
                      `/artikel/${art.slug}`;

                    return (
                    <Link
                      key={art.slug}
                      href={href}
                      className="group flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0F766E] hover:shadow-md transition-all"
                    >
                      <span className="flex-1 font-semibold text-[#0F172A] text-sm group-hover:text-[#0F766E]">{art.title}</span>
                      <ArrowRight className="h-4 w-4 text-[#64748B] group-hover:text-[#0F766E]" aria-hidden />
                    </Link>
                    );
                  })}
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
