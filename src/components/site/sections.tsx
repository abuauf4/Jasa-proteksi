"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck, Car, Calculator, MapPin, FileText, TrendingUp,
  Clock, ListChecks, BadgeCheck, MessageCircle, ArrowRight,
  ChevronDown, Wallet, Calendar, Globe, Sliders, ShieldAlert,
  FileSearch, Users, Lock, Sparkles,
} from "lucide-react";
import { Container, Section, SectionHeader, Card, Badge } from "./primitives";
import { Button } from "./Button";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { buildWhatsAppLink } from "@/lib/format";
import { trackEvent } from "@/lib/analytics-events";

/* ═══════════════════════════════════════════════════
   HERO + CALCULATOR (the centerpiece)
   ═══════════════════════════════════════════════════ */

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative ds-bg-soft pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: copy */}
          <div className="flex flex-col gap-5 lg:gap-6 lg:pt-4 max-w-xl">
            <Badge>
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Platform Asuransi Mobil
            </Badge>

            <h1 className="ds-h1">
              Hitung Premi Asuransi Mobil Secara Online
            </h1>

            <p className="ds-body-lg">
              Dapatkan estimasi premi All Risk atau TLO berdasarkan data kendaraan
              dan wilayah penggunaan Anda.
            </p>

            <ul className="flex flex-col gap-2.5">
              {[
                { icon: Calculator, label: "Estimasi otomatis berdasarkan data kendaraan" },
                { icon: ShieldCheck, label: "Pilihan All Risk & TLO" },
                { icon: MessageCircle, label: "Konsultasi tanpa biaya" },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0F766E]">
                    <item.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-sm sm:text-base text-[#475569]">{item.label}</span>
                </li>
              ))}
            </ul>

            <div className="hidden lg:block">
              <Button as="link" href="/#kalkulator" variant="primary" size="lg">
                <Calculator className="h-4 w-4" aria-hidden />
                Mulai Hitung Premi
              </Button>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed mt-1">
              Simulasi gratis tanpa biaya. Hasil estimasi langsung ditampilkan sebelum pengajuan.
            </p>
          </div>

          {/* Right: calculator (the heart) */}
          <div id="kalkulator" className="scroll-mt-20">
            <HeroCalculator />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PROTECTION COMPARISON — All Risk vs TLO
   ═══════════════════════════════════════════════════ */

export function ProtectionComparison() {
  const cards: Array<{
    badge: string;
    title: string;
    description: string;
    points: string[];
    cta: { label: string; href: string };
    initialCoverage: "AllRisk" | "TLO";
  }> = [
    {
      badge: "Komprehensif",
      title: "All Risk",
      description:
        "Perlindungan terhadap kerusakan sebagian hingga kerusakan berat sesuai manfaat dan ketentuan polis.",
      points: [
        "Cocok dipertimbangkan untuk mobil baru",
        "Kendaraan yang rutin digunakan",
        "Pengguna yang membutuhkan cakupan lebih luas",
      ],
      cta: { label: "Hitung Premi All Risk", href: "/asuransi-mobil-all-risk" },
      initialCoverage: "AllRisk",
    },
    {
      badge: "Hemat",
      title: "Total Loss Only (TLO)",
      description:
        "Perlindungan atas kehilangan atau kerusakan yang memenuhi kriteria total loss sesuai ketentuan polis.",
      points: [
        "Pengguna yang membutuhkan perlindungan terhadap risiko kerugian besar",
        "Kendaraan dengan pertimbangan premi lebih terjangkau",
        "Mobil yang memenuhi batas usia pertanggungan",
      ],
      cta: { label: "Hitung Premi TLO", href: "/asuransi-mobil-tlo" },
      initialCoverage: "TLO",
    },
  ];

  return (
    <Section tone="white" id="jenis-proteksi">
      <Container>
        <SectionHeader
          eyebrow="Pilih Perlindungan"
          title="Pilih Perlindungan Sesuai Kebutuhan Mobil"
          description="Pelajari perbedaan perlindungan sebelum menjalankan simulasi premi."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
          {cards.map((card) => (
            <Card key={card.title} variant="lg" className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="ds-badge">{card.badge}</span>
                <ShieldCheck className="h-6 w-6 text-[#0F766E]" aria-hidden />
              </div>
              <h3 className="ds-h3">{card.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{card.description}</p>
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-xs font-semibold text-[#0F172A] uppercase tracking-wide">
                  Cocok dipertimbangkan untuk:
                </p>
                <ul className="flex flex-col gap-1.5">
                  {card.points.map((p) => (
                    <li key={p} className="text-sm text-[#475569] flex items-start gap-2">
                      <ChevronDown className="h-4 w-4 mt-0.5 text-[#0F766E] rotate-[-90deg]" aria-hidden />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-3">
                <Button as="link" href={card.cta.href} variant="outline" size="md" className="w-full">
                  {card.cta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   HOW IT WORKS — 4-step timeline
   ═══════════════════════════════════════════════════ */

export function HowItWorks() {
  const steps: Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }> = [
    {
      icon: Car,
      title: "Isi Data Kendaraan",
      description: "Pilih merek, tipe, tahun, wilayah, dan kebutuhan perlindungan.",
    },
    {
      icon: Calculator,
      title: "Dapatkan Estimasi Otomatis",
      description: "Engine menghitung estimasi premi berdasarkan data yang Anda masukkan.",
    },
    {
      icon: MessageCircle,
      title: "Konsultasikan Pilihan",
      description: "Pelajari hasil simulasi dan tanyakan detail perlindungan kepada tim kami.",
    },
    {
      icon: FileText,
      title: "Lanjutkan Pengajuan",
      description: "Lengkapi proses verifikasi hingga polis diterbitkan oleh perusahaan asuransi terkait.",
    },
  ];

  return (
    <Section tone="soft" id="cara-kerja">
      <Container>
        <SectionHeader
          eyebrow="Alur Layanan"
          title="Dari Simulasi hingga Polis"
          description="Empat langkah mudah untuk memahami estimasi premi dan melanjutkan pengajuan."
        />

        {/* Mobile: vertical timeline. Desktop: horizontal cards. */}
        <ol className="mt-10 flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-4 relative">
          {steps.map((step, idx) => (
            <li
              key={step.title}
              className="relative flex gap-4 lg:flex-col lg:gap-3 lg:items-start"
            >
              {/* Connector line for mobile vertical timeline */}
              {idx < steps.length - 1 && (
                <span
                  className="absolute left-[22px] top-12 bottom-[-20px] w-px bg-[#CBD5E1] lg:hidden"
                  aria-hidden
                />
              )}
              <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm z-10 lg:w-12 lg:h-12">
                {idx + 1}
              </span>
              <div className="flex flex-col gap-1 lg:gap-2 min-w-0 pt-1 lg:pt-0">
                <div className="flex items-center gap-2 lg:gap-0 lg:flex-col lg:items-start">
                  <step.icon className="h-4 w-4 text-[#0F766E] lg:h-5 lg:w-5 lg:mb-1" aria-hidden />
                  <h3 className="font-semibold text-[#0F172A] text-sm sm:text-base">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 text-center">
          <Button as="link" href="/#kalkulator" variant="primary" size="lg">
            <Calculator className="h-4 w-4" aria-hidden />
            Coba Hitung Premi
          </Button>
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   PREMIUM FACTORS — accordion
   ═══════════════════════════════════════════════════ */

export function PremiumFactors() {
  const factors: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: string;
  }> = [
    {
      icon: Wallet,
      label: "Nilai Kendaraan",
      description: "Nilai OTR (On The Road) kendaraan menentukan basis perhitungan premi. Semakin tinggi nilai kendaraan, semakin tinggi premi dasar.",
    },
    {
      icon: Calendar,
      label: "Tahun Kendaraan",
      description: "Usia kendaraan memengaruhi tarif premi. Kendaraan yang lebih tua dapat dikenai loading rate dan memiliki batas kelayakan untuk jenis perlindungan tertentu.",
    },
    {
      icon: Globe,
      label: "Wilayah Penggunaan",
      description: "Tarif premi dibedakan berdasarkan wilayah penggunaan kendaraan (Wilayah 1, 2, atau 3) yang ditentukan dari kode plat nomor.",
    },
    {
      icon: ShieldCheck,
      label: "Jenis Perlindungan",
      description: "All Risk (Comprehensive) memiliki tarif berbeda dengan TLO (Total Loss Only). Cakupan manfaat yang lebih luas umumnya memiliki premi lebih tinggi.",
    },
    {
      icon: ListChecks,
      label: "Perluasan Jaminan",
      description: "Perluasan seperti banjir, gempa bumi, kerusuhan, tanggung jawab pihak ketiga, dan kecelakaan diri menambah komponen premi sesuai tarif masing-masing.",
    },
    {
      icon: Sliders,
      label: "Jenis Penggunaan",
      description: "Kategori kendaraan (mobil penumpang, truk, bus, atau motor) memengaruhi klasifikasi tarif dan ketersediaan jenis perlindungan tertentu.",
    },
  ];

  return (
    <Section tone="white" id="faktor-premi">
      <Container>
        <SectionHeader
          eyebrow="Faktor Premi"
          title="Apa yang Memengaruhi Premi Asuransi Mobil?"
          description="Beberapa faktor utama digunakan oleh engine untuk menghitung estimasi premi Anda."
        />

        <div className="mt-10 max-w-3xl mx-auto flex flex-col gap-2">
          {factors.map((factor, idx) => (
            <FactorAccordion key={factor.label} {...factor} defaultOpen={idx === 0} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button as="link" href="/#kalkulator" variant="primary" size="lg">
            <Calculator className="h-4 w-4" aria-hidden />
            Coba Hitung Premi Mobil
          </Button>
        </div>
      </Container>
    </Section>
  );
}

function FactorAccordion({
  icon: Icon,
  label,
  description,
  defaultOpen = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
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
        className="w-full flex items-center gap-3 p-4 text-left min-h-[56px] hover:bg-[#F8FAFC] transition-colors"
      >
        <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0F766E]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <span className="flex-1 font-semibold text-[#0F172A] text-sm sm:text-base">{label}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#64748B] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={btnId}
          className="px-4 pb-4 pl-16 text-sm text-[#475569] leading-relaxed"
        >
          {description}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PLATFORM BENEFITS — why use Jasa Proteksi
   ═══════════════════════════════════════════════════ */

export function PlatformBenefits() {
  const benefits: Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }> = [
    {
      icon: Calculator,
      title: "Simulasi Premi Otomatis",
      description: "Engine menghitung estimasi premi secara otomatis berdasarkan data kendaraan, wilayah, dan pilihan perlindungan.",
    },
    {
      icon: ShieldCheck,
      title: "Pilihan All Risk dan TLO",
      description: "Pelajari kedua jenis perlindungan dan pilih yang sesuai dengan kebutuhan serta anggaran Anda.",
    },
    {
      icon: FileSearch,
      title: "Ringkasan Hasil Jelas",
      description: "Hasil simulasi ditampilkan dengan rincian komponen premi yang mudah dipahami sebelum melanjutkan.",
    },
    {
      icon: MessageCircle,
      title: "Konsultasi Sebelum Pengajuan",
      description: "Diskusikan hasil simulasi dengan tim kami untuk memahami manfaat dan ketentuan sebelum mengajukan.",
    },
    {
      icon: ListChecks,
      title: "Proses Pengajuan Terarah",
      description: "Setelah simulasi, pengajuan dilanjutkan melalui proses verifikasi yang terarah hingga polis diterbitkan.",
    },
    {
      icon: Lock,
      title: "Data Anda Aman",
      description: "Informasi pribadi hanya digunakan untuk keperluan simulasi dan pengajuan sesuai kebijakan privasi.",
    },
  ];

  return (
    <Section tone="soft" id="kenapa-jasa-proteksi">
      <Container>
        <SectionHeader
          eyebrow="Kenapa Jasa Proteksi"
          title="Lebih Mudah Memahami Proteksi Mobil"
          description="Layanan yang membantu Anda menghitung estimasi premi dan memahami pilihan perlindungan."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {benefits.map((b) => (
            <Card key={b.title} className="flex flex-col gap-3">
              <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0F766E]">
                <b.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-semibold text-[#0F172A]">{b.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{b.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   BUSINESS IDENTITY — honest service description
   ═══════════════════════════════════════════════════ */

export function BusinessIdentity() {
  const { settings } = useSiteSettings();

  // Build identity rows from settings — only show fields that have data.
  const rows: Array<{ label: string; value: string }> = [];
  if (settings.address) rows.push({ label: "Alamat", value: settings.address });
  if (settings.whatsapp) rows.push({ label: "WhatsApp", value: settings.whatsapp });
  if (settings.email) rows.push({ label: "Email", value: settings.email });
  if (settings.phone) rows.push({ label: "Telepon", value: settings.phone });

  return (
    <Section tone="white" id="tentang-layanan">
      <Container className="max-w-4xl">
        <SectionHeader
          eyebrow="Identitas Layanan"
          title="Kenali Layanan Jasa Proteksi"
          description="Posisi dan ruang lingkup layanan Jasa Proteksi dijelaskan secara transparan."
        />

        <Card variant="lg" className="mt-8 flex flex-col gap-5">
          <p className="ds-body-lg leading-relaxed">
            Jasa Proteksi menyediakan layanan simulasi premi dan membantu pengguna
            memahami serta melanjutkan proses pengajuan asuransi mobil. Polis, manfaat,
            dan ketentuan pertanggungan diterbitkan oleh perusahaan asuransi terkait.
          </p>

          {rows.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E2E8F0]">
              {rows.map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    {row.label}
                  </span>
                  <span className="text-sm text-[#0F172A] font-medium break-words">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-4 flex items-start gap-3 mt-2">
            <ShieldAlert className="h-5 w-5 text-[#92400E] flex-shrink-0 mt-0.5" aria-hidden />
            <p className="text-sm text-[#92400E] leading-relaxed">
              <strong>Catatan:</strong> Informasi status badan usaha, nomor izin, dan
              mitra resmi akan ditambahkan setelah tersedia dan terverifikasi. Logo
              perusahaan asuransi hanya ditampilkan jika hubungan kerja sama telah
              dikonfirmasi.
            </p>
          </div>
        </Card>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   ARTICLE PREVIEW — 3 latest articles
   ═══════════════════════════════════════════════════ */

interface ArticlePreviewItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
}

export function ArticlePreview({ articles }: { articles: ArticlePreviewItem[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <Section tone="soft" id="artikel">
      <Container>
        <SectionHeader
          eyebrow="Edukasi"
          title="Pelajari Asuransi Mobil"
          description="Artikel singkat untuk membantu Anda memahami premi, manfaat, dan pilihan perlindungan."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {articles.slice(0, 3).map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden hover:border-[#CBD5E1] hover:shadow-md transition-all"
            >
              {article.coverImage ? (
                <div className="aspect-[16/9] bg-[#F1F5F9] overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-[#F1F5F9] flex items-center justify-center">
                  <FileText className="h-8 w-8 text-[#94A3B8]" aria-hidden />
                </div>
              )}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="font-semibold text-[#0F172A] text-sm sm:text-base line-clamp-2 group-hover:text-[#0F766E] transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-[#475569] line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-auto pt-2 flex items-center gap-1 text-xs font-semibold text-[#0F766E]">
                  Baca artikel
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button as="link" href="/blog" variant="secondary" size="md">
            Lihat semua artikel
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ — 8 items
   ═══════════════════════════════════════════════════ */

const FAQ_ITEMS = [
  {
    q: "Apa perbedaan All Risk dan TLO?",
    a: "All Risk (Comprehensive) memberikan perlindungan terhadap kerusakan sebagian hingga kerusakan berat sesuai manfaat dan ketentuan polis. TLO (Total Loss Only) memberikan perlindungan atas kehilangan atau kerusakan yang memenuhi kriteria total loss sesuai ketentuan polis.",
  },
  {
    q: "Bagaimana premi asuransi mobil dihitung?",
    a: "Premi dihitung berdasarkan nilai kendaraan, tahun kendaraan, wilayah penggunaan, jenis perlindungan, perluasan jaminan, dan jenis penggunaan kendaraan. Engine simulasi Jasa Proteksi menggunakan tarif resmi untuk menghitung estimasi premi secara otomatis.",
  },
  {
    q: "Apakah hasil simulasi merupakan harga final?",
    a: "Tidak. Hasil simulasi merupakan estimasi awal. Premi, manfaat, syarat, dan ketentuan akhir mengikuti proses verifikasi serta quotation dari perusahaan asuransi penerbit polis.",
  },
  {
    q: "Kendaraan tahun berapa yang dapat diasuransikan?",
    a: "Batas usia kendaraan bergantung pada jenis perlindungan dan ketentuan perusahaan asuransi penerbit polis. Engine simulasi akan menampilkan informasi kelayakan secara otomatis berdasarkan tahun kendaraan yang Anda masukkan.",
  },
  {
    q: "Apa saja yang memengaruhi nilai premi?",
    a: "Nilai kendaraan, tahun kendaraan, wilayah penggunaan, jenis perlindungan (All Risk atau TLO), perluasan jaminan, dan jenis penggunaan kendaraan adalah faktor utama yang memengaruhi besaran premi.",
  },
  {
    q: "Dokumen apa yang dibutuhkan untuk pengajuan?",
    a: "Pada tahap simulasi, Anda hanya perlu data kendaraan dan kontak WhatsApp. Dokumen sensitif seperti KTP, STNK, atau dokumen lainnya hanya diminta pada tahap pengajuan resmi melalui alur yang aman.",
  },
  {
    q: "Siapa yang menerbitkan polis?",
    a: "Polis, manfaat, dan ketentuan pertanggungan diterbitkan oleh perusahaan asuransi terkait. Jasa Proteksi membantu proses simulasi dan pengajuan, namun bukan penerbit polis.",
  },
  {
    q: "Apakah saya wajib membeli setelah melakukan simulasi?",
    a: "Tidak. Simulasi premi bersifat gratis dan tidak mengikat. Anda dapat menggunakan hasil simulasi untuk memahami estimasi premi sebelum memutuskan untuk melanjutkan konsultasi atau pengajuan.",
  },
];

export function FAQSection() {
  return (
    <Section tone="white" id="faq">
      <Container className="max-w-3xl">
        <SectionHeader
          eyebrow="FAQ"
          title="Pertanyaan Seputar Asuransi Mobil"
          description="Pertanyaan yang sering diajukan seputar simulasi premi dan layanan Jasa Proteksi."
        />

        <div className="mt-8 flex flex-col gap-2">
          {FAQ_ITEMS.map((item, idx) => (
            <FAQAccordion key={idx} q={item.q} a={item.a} />
          ))}
        </div>
      </Container>
    </Section>
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
          className={`h-4 w-4 text-[#64748B] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
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
   FINAL CTA
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
    <Section tone="navy" id="final-cta">
      <Container className="max-w-3xl text-center">
        <div className="flex flex-col gap-5 items-center">
          <Badge variant="navy">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Mulai Sekarang
          </Badge>
          <h2 className="ds-h2 text-white">
            Siap Mengetahui Estimasi Premi Mobil Anda?
          </h2>
          <p className="ds-body-lg text-[#CBD5E1] max-w-xl">
            Lengkapi data kendaraan dan dapatkan estimasi premi All Risk atau TLO
            secara online.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
            <Button as="link" href="/#kalkulator" variant="primary" size="lg">
              <Calculator className="h-4 w-4" aria-hidden />
              Mulai Hitung Premi
            </Button>
            {whatsappLink && (
              <Button
                as="external"
                href={whatsappLink}
                variant="secondary"
                size="lg"
                onClick={() => trackEvent("whatsapp_click", {})}
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Konsultasi via WhatsApp
              </Button>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   LEGAL DISCLAIMER (small reusable block)
   ═══════════════════════════════════════════════════ */

export function LegalDisclaimer({ className }: { className?: string }) {
  return (
    <div
      id="disclaimer"
      className={`rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 ${className ?? ""}`}
    >
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 text-[#64748B] flex-shrink-0 mt-0.5" aria-hidden />
        <p className="text-xs text-[#64748B] leading-relaxed">
          <strong className="text-[#475569]">Disclaimer Simulasi:</strong> Hasil simulasi
          merupakan estimasi awal. Premi, manfaat, syarat, dan ketentuan akhir mengikuti
          proses verifikasi serta quotation dari perusahaan asuransi penerbit polis.
        </p>
      </div>
    </div>
  );
}
