import { Metadata } from "next";
import { db } from "@/lib/db";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { LegalDisclaimer, HowItWorks, PremiumFactors } from "@/components/site/sections";
import { Container, Section, SectionHeader, Card, Badge } from "@/components/site/primitives";
import { Button } from "@/components/site/Button";
import { ShieldCheck, Calculator, Sparkles, Wallet, Calendar, Globe, ListChecks, Sliders } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Asuransi Mobil — Simulasi Premi All Risk & TLO | Jasa Proteksi",
  description:
    "Asuransi mobil online dengan simulasi premi All Risk dan TLO. Pahami pilihan perlindungan, hitung estimasi premi, dan lanjutkan pengajuan secara online.",
  alternates: { canonical: `${SITE_URL}/asuransi-mobil` },
  openGraph: {
    title: "Asuransi Mobil — Simulasi Premi All Risk & TLO | Jasa Proteksi",
    description:
      "Asuransi mobil online dengan simulasi premi All Risk dan TLO. Hitung estimasi premi otomatis.",
    url: `${SITE_URL}/asuransi-mobil`,
    siteName: "Jasa Proteksi",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

async function getSettings() {
  let initialSettings: SiteSettings = {
    whatsapp: "", whatsapp2: "", phone: "", email: "", address: "",
    googleAnalyticsId: "", metaPixelId: "", gtmId: "", adsenseId: "", maintenanceMode: false,
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
      gtmId: map.gtmId || "", adsenseId: map.adsenseId || "", maintenanceMode: map.maintenanceMode === "true",
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
  return { initialSettings, initialHero };
}

export default async function AsuransiMobilPage() {
  const { initialSettings, initialHero } = await getSettings();

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={initialHero}>
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          {/* Hero with calculator */}
          <Section tone="soft" id="beranda" className="!pt-10 !pb-12 sm:!pt-14 sm:!pb-16">
            <Container>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="flex flex-col gap-5 lg:pt-4 max-w-xl">
                  <Badge>
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Asuransi Mobil
                  </Badge>
                  <h1 className="ds-h1">Asuransi Mobil Online</h1>
                  <p className="ds-body-lg">
                    Simulasikan premi asuransi mobil All Risk atau TLO berdasarkan data
                    kendaraan dan wilayah penggunaan Anda. Hasil otomatis, tanpa biaya.
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {[
                      { icon: Calculator, label: "Estimasi otomatis berdasarkan data kendaraan" },
                      { icon: ShieldCheck, label: "Pilihan All Risk & TLO" },
                      { icon: Wallet, label: "Tanpa biaya simulasi" },
                    ].map((item) => (
                      <li key={item.label} className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0F766E]">
                          <item.icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="text-sm sm:text-base text-[#475569]">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="kalkulator" className="scroll-mt-20">
                  <HeroCalculator />
                </div>
              </div>
            </Container>
          </Section>

          <HowItWorks />

          {/* Coverage types */}
          <Section tone="white" id="jenis-proteksi">
            <Container>
              <SectionHeader
                eyebrow="Jenis Proteksi"
                title="Pilih Perlindungan Sesuai Kebutuhan Mobil"
                description="Pelajari perbedaan perlindungan sebelum menjalankan simulasi premi."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
                <Card variant="lg" className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="ds-badge">Komprehensif</span>
                    <ShieldCheck className="h-6 w-6 text-[#0F766E]" aria-hidden />
                  </div>
                  <h2 className="ds-h3">All Risk</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Perlindungan terhadap kerusakan sebagian hingga kerusakan berat sesuai manfaat
                    dan ketentuan polis.
                  </p>
                  <Button as="link" href="/asuransi-mobil-all-risk" variant="outline" size="md" className="mt-auto">
                    Pelajari All Risk
                  </Button>
                </Card>
                <Card variant="lg" className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="ds-badge">Hemat</span>
                    <ShieldCheck className="h-6 w-6 text-[#0F766E]" aria-hidden />
                  </div>
                  <h2 className="ds-h3">Total Loss Only (TLO)</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Perlindungan atas kehilangan atau kerusakan yang memenuhi kriteria total loss
                    sesuai ketentuan polis.
                  </p>
                  <Button as="link" href="/asuransi-mobil-tlo" variant="outline" size="md" className="mt-auto">
                    Pelajari TLO
                  </Button>
                </Card>
              </div>
            </Container>
          </Section>

          <PremiumFactors />

          <Section tone="white">
            <Container className="max-w-3xl">
              <LegalDisclaimer />
            </Container>
          </Section>
        </main>
        <SiteFooter />
        <MobileStickyCTA />
      </div>
    </ServerDataProvider>
  );
}
