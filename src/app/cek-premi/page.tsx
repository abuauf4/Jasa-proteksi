import { Metadata } from "next";
import { db } from "@/lib/db";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { LegalDisclaimer } from "@/components/site/sections";
import { Container, Section, SectionHeader, Card, Badge } from "@/components/site/primitives";
import { ShieldCheck, Calculator, Sparkles } from "lucide-react";
import { parseCoverageParam } from "@/lib/calculator-urls";
import type { CoverageType } from "@/components/calculator/types";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Cek Premi Mobil Online | Kalkulator Asuransi Mobil",
  description:
    "Cek premi mobil dan estimasi harga asuransi mobil All Risk atau TLO berdasarkan merek, tahun, nilai kendaraan, dan wilayah. Gratis, hasil otomatis.",
  alternates: { canonical: `${SITE_URL}/cek-premi` },
  openGraph: {
    title: "Cek Premi Mobil Online | Kalkulator Asuransi Mobil",
    description:
      "Cek premi asuransi mobil dan estimasi harga All Risk atau TLO secara online berdasarkan data kendaraan.",
    url: `${SITE_URL}/cek-premi`,
    siteName: "Jasa Proteksi",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
};

export default async function CekPremiPage({
  searchParams,
}: {
  searchParams: Promise<{ coverage?: string }>;
}) {
  const params = await searchParams;
  const initialCoverage: CoverageType | undefined = parseCoverageParam(params?.coverage) ?? undefined;

  let initialSettings: SiteSettings = {
    whatsapp: "", whatsapp2: "", phone: "", email: "", address: "",
    googleAnalyticsId: "", metaPixelId: "", gtmId: "", maintenanceMode: false,
  };
  let initialHero: HeroData | null = null;
  try {
    const [settingsRows, heroRow] = await Promise.all([
      db.siteSetting.findMany(),
      db.heroContent.findFirst(),
    ]);
    const map: Record<string, string> = {};
    for (const s of settingsRows) map[s.key] = s.value;
    initialSettings = {
      whatsapp: map.whatsapp || "", whatsapp2: map.whatsapp2 || "",
      phone: map.phone || "", email: map.email || "", address: map.address || "",
      googleAnalyticsId: map.googleAnalyticsId || "", metaPixelId: map.metaPixelId || "",
      gtmId: map.gtmId || "", maintenanceMode: map.maintenanceMode === "true",
    };
    if (heroRow) {
      initialHero = {
        tagline: heroRow.tagline, subtext: heroRow.subtext,
        ctaText: heroRow.ctaText, ctaLink: heroRow.ctaLink,
        backgroundImage: heroRow.backgroundImage,
      };
    }
  } catch {
    /* defaults */
  }

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={initialHero}>
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          <Section tone="soft" id="kalkulator" className="!pt-8 !pb-12 sm:!pt-10 sm:!pb-16">
            <Container className="max-w-3xl">
              <div className="text-center mb-6">
                <Badge>
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Simulasi Premi
                </Badge>
                <h1 className="ds-h1 mt-3 mb-3">Cek Premi Mobil Online</h1>
                <p className="ds-body-lg max-w-xl mx-auto">
                  Cek premi asuransi mobil dan estimasi harga perlindungan All Risk atau TLO
                  berdasarkan data kendaraan dan wilayah penggunaan Anda.
                </p>
              </div>
              <HeroCalculator hideHeader initialCoverageType={initialCoverage} />
              <LegalDisclaimer className="mt-6" />
            </Container>
          </Section>

          <Section tone="white" id="info-cek-premi">
            <Container className="max-w-3xl">
              <SectionHeader
                eyebrow="Informasi"
                title="Cek Premi Asuransi Mobil Berdasarkan Data Kendaraan"
                description="Halaman ini membantu Anda menghitung estimasi premi dan memahami kisaran harga asuransi mobil secara cepat dan tanpa biaya."
              />
              <div className="mt-8 grid gap-4">
                <Card className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[#0F766E]" aria-hidden />
                    <h2 className="font-semibold text-[#0F172A]">Cara Menggunakan Kalkulator</h2>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Pilih merek, tipe, dan tahun kendaraan Anda. Tentukan wilayah penggunaan
                    berdasarkan kode plat nomor, lalu pilih jenis perlindungan (All Risk atau
                    TLO) dan perluasan jaminan yang dibutuhkan. Engine akan menghitung estimasi
                    premi secara otomatis.
                  </p>
                </Card>
                <Card className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#0F766E]" aria-hidden />
                    <h2 className="font-semibold text-[#0F172A]">Yang Memengaruhi Hasil</h2>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Estimasi premi dipengaruhi oleh nilai kendaraan, tahun kendaraan, wilayah
                    penggunaan, jenis perlindungan, dan perluasan jaminan yang dipilih. Setiap
                    faktor dihitung berdasarkan tarif resmi.
                  </p>
                </Card>
              </div>
              <div className="mt-6 text-sm text-[#475569] leading-relaxed">
                <p>
                  Nilai premi dipengaruhi oleh harga kendaraan, tahun, wilayah, jenis perlindungan,
                  serta perluasan yang dipilih. Untuk penjelasan lebih lengkap, baca{" "}
                  <a href="/biaya-asuransi-mobil" className="font-semibold text-[#0F766E] hover:underline">
                    panduan harga asuransi mobil
                  </a>{" "}
                  atau{" "}
                  <a href="/asuransi-mobil" className="font-semibold text-[#0F766E] hover:underline">
                    panduan asuransi mobil
                  </a>.
                </p>
              </div>
            </Container>
          </Section>
        </main>
        <SiteFooter />
        <MobileStickyCTA />
      </div>
    </ServerDataProvider>
  );
}
