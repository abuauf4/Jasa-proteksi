import { Metadata } from "next";
import { db } from "@/lib/db";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { LegalDisclaimer } from "@/components/site/sections";
import { Container, Section, SectionHeader, Card, Badge } from "@/components/site/primitives";
import { ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Asuransi Mobil TLO — Simulasi Premi Online | Jasa Proteksi",
  description:
    "Asuransi mobil TLO (Total Loss Only) memberikan perlindungan atas kehilangan atau kerusakan yang memenuhi kriteria total loss. Hitung estimasi premi secara online.",
  alternates: { canonical: `${SITE_URL}/asuransi-mobil-tlo` },
  openGraph: {
    title: "Asuransi Mobil TLO — Simulasi Premi Online | Jasa Proteksi",
    description:
      "Asuransi mobil TLO (Total Loss Only) dengan simulasi premi online. Estimasi otomatis berdasarkan data kendaraan.",
    url: `${SITE_URL}/asuransi-mobil-tlo`,
    siteName: "Jasa Proteksi",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

async function getSettings() {
  let initialSettings: SiteSettings = {
    whatsapp: "", whatsapp2: "", phone: "", email: "", address: "",
    googleAnalyticsId: "", metaPixelId: "", gtmId: "", adsenseId: "",
    googleAdsId: "", maintenanceMode: false,
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
  } catch { /* defaults */ }
  return { initialSettings, initialHero };
}

export default async function TLOPage() {
  const { initialSettings, initialHero } = await getSettings();

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={initialHero}>
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          <Section tone="soft" className="!pt-10 !pb-12 sm:!pt-14 sm:!pb-16">
            <Container>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="flex flex-col gap-5 lg:pt-4 max-w-xl">
                  <Badge>
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Total Loss Only (TLO)
                  </Badge>
                  <h1 className="ds-h1">Asuransi Mobil TLO</h1>
                  <p className="ds-body-lg">
                    TLO (Total Loss Only) memberikan perlindungan atas kehilangan atau kerusakan
                    yang memenuhi kriteria total loss sesuai ketentuan polis. Hitung estimasi
                    premi secara online.
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {[
                      "Pengguna yang membutuhkan perlindungan terhadap risiko kerugian besar",
                      "Kendaraan dengan pertimbangan premi lebih terjangkau",
                      "Mobil yang memenuhi batas usia pertanggungan",
                    ].map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#0F766E] flex-shrink-0 mt-0.5" aria-hidden />
                        <span className="text-sm sm:text-base text-[#475569]">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="kalkulator" className="scroll-mt-20">
                  <HeroCalculator initialCoverageType="TLO" />
                </div>
              </div>
            </Container>
          </Section>

          <Section tone="white">
            <Container className="max-w-3xl">
              <SectionHeader
                eyebrow="Tentang TLO"
                title="Apa itu Asuransi Mobil TLO?"
                description="TLO (Total Loss Only) adalah jenis perlindungan asuransi mobil yang memberikan ganti rugi atas kehilangan atau kerusakan yang memenuhi kriteria total loss sesuai ketentuan polis."
              />
              <Card variant="lg" className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#0F766E]" aria-hidden />
                  <h2 className="font-semibold text-[#0F172A]">Manfaat TLO</h2>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Asuransi TLO memberikan perlindungan atas kehilangan atau kerusakan yang
                  memenuhi kriteria total loss sesuai ketentuan polis. Jenis perlindungan ini
                  umumnya memiliki premi lebih terjangkau dibandingkan All Risk.
                </p>
                <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-4 mt-2">
                  <p className="text-sm text-[#92400E] leading-relaxed">
                    <strong>Catatan:</strong> Manfaat, syarat, dan ketentuan akhir mengikuti
                    polis dari perusahaan asuransi penerbit. Hasil simulasi merupakan estimasi
                    awal dan bukan harga final.
                  </p>
                </div>
              </Card>
              <LegalDisclaimer className="mt-6" />
            </Container>
          </Section>
        </main>
        <SiteFooter />
        <MobileStickyCTA />
      </div>
    </ServerDataProvider>
  );
}
