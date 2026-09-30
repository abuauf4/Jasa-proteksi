import { Metadata } from "next";
import { ServerDataProvider } from "@/lib/ServerDataContext";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { LegalDisclaimer, HowItWorks, PremiumFactors } from "@/components/site/sections";
import { Container, Section, SectionHeader, Card, Badge } from "@/components/site/primitives";
import { Button } from "@/components/site/Button";
import { ShieldCheck, Calculator, Sparkles, Wallet, Calendar, Globe, ListChecks, Sliders } from "lucide-react";
import Link from "next/link";
import { PILLAR_ARTICLES } from "@/lib/pillar-articles";
import { getCachedSiteSettings } from "@/lib/site-data-cache";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Asuransi Mobil Online: All Risk & TLO",
  description:
    "Pahami asuransi mobil All Risk dan TLO, cara memilih perlindungan, faktor biaya, dan proses pengajuan. Cek estimasi premi sesuai data kendaraan Anda.",
  alternates: { canonical: `${SITE_URL}/asuransi-mobil` },
  openGraph: {
    title: "Asuransi Mobil Online: All Risk & TLO | Jasa Proteksi",
    description:
      "Panduan asuransi mobil All Risk dan TLO, pilihan perlindungan, biaya, serta simulasi premi sesuai data kendaraan.",
    url: `${SITE_URL}/asuransi-mobil`,
    siteName: "Jasa Proteksi",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
};

export default async function AsuransiMobilPage() {
  const initialSettings = await getCachedSiteSettings();

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={null}>
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
                  <h1 className="ds-h1">Asuransi Mobil Online: All Risk & TLO</h1>
                  <p className="ds-body-lg">
                    Pelajari pilihan asuransi mobil All Risk dan TLO, pahami perbedaan cakupan
                    serta faktor biayanya, lalu pilih perlindungan yang sesuai dengan kendaraan Anda.
                  </p>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Jika Anda ingin langsung melihat estimasi biaya, buka{" "}
                    <Link href="/cek-premi" className="font-semibold text-[#0F766E] hover:underline">
                      cek premi asuransi mobil
                    </Link>{" "}
                    untuk simulasi berdasarkan data kendaraan dan wilayah penggunaan.
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

          <Section tone="white" id="tentang-asuransi-mobil">
            <Container className="max-w-4xl">
              <SectionHeader
                eyebrow="Panduan Dasar"
                title="Apa Itu Asuransi Mobil?"
                description="Asuransi mobil membantu mengalihkan sebagian risiko finansial akibat kerusakan atau kehilangan kendaraan sesuai manfaat dan ketentuan polis."
              />
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Card className="space-y-3">
                  <h2 className="text-lg font-bold text-[#0F172A]">All Risk untuk Cakupan Lebih Luas</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    All Risk atau Comprehensive umumnya mencakup kerusakan sebagian hingga kerusakan berat
                    sesuai ketentuan polis. Pilihan ini sering dipertimbangkan untuk kendaraan yang masih baru,
                    rutin digunakan, atau ketika pemilik ingin perlindungan yang lebih menyeluruh.
                  </p>
                  <Link href="/perbedaan-all-risk-dan-tlo" className="text-sm font-semibold text-[#0F766E] hover:underline">
                    Bandingkan All Risk dan TLO
                  </Link>
                </Card>
                <Card className="space-y-3">
                  <h2 className="text-lg font-bold text-[#0F172A]">TLO untuk Risiko Kerugian Total</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    TLO atau Total Loss Only berfokus pada kehilangan atau kerusakan yang memenuhi kriteria
                    kerugian total sesuai polis. Premi biasanya lebih rendah dibanding All Risk karena cakupannya
                    lebih terbatas.
                  </p>
                  <Link href="/asuransi-mobil-tlo" className="text-sm font-semibold text-[#0F766E] hover:underline">
                    Pelajari asuransi mobil TLO
                  </Link>
                </Card>
              </div>

              <div className="mt-8 space-y-6 text-sm text-[#475569] leading-relaxed">
                <section>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-2">Berapa Biaya Asuransi Mobil?</h2>
                  <p>
                    Premi dipengaruhi oleh nilai kendaraan, tahun kendaraan, wilayah penggunaan, jenis
                    perlindungan, dan perluasan jaminan. Karena setiap kendaraan memiliki profil yang berbeda,
                    tidak ada satu harga yang berlaku untuk semua mobil. Lihat{" "}
                    <Link href="/biaya-asuransi-mobil" className="font-semibold text-[#0F766E] hover:underline">
                      estimasi harga asuransi mobil
                    </Link>{" "}
                    atau gunakan kalkulator untuk menghitung berdasarkan data kendaraan Anda.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-2">Cara Memilih Perlindungan</h2>
                  <p>
                    Pertimbangkan usia dan nilai kendaraan, frekuensi penggunaan, kondisi lingkungan,
                    kemampuan menanggung biaya perbaikan sendiri, serta kebutuhan perluasan perlindungan.
                    Setelah menentukan kebutuhan, bandingkan cakupan dan estimasi premi sebelum melanjutkan
                    ke quotation resmi.
                  </p>
                </section>

                <div className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4">
                  <p className="font-semibold text-[#115E59] mb-1">Ingin langsung hitung?</p>
                  <p>
                    Gunakan{" "}
                    <Link href="/cek-premi" className="font-semibold text-[#0F766E] hover:underline">
                      kalkulator asuransi mobil
                    </Link>{" "}
                    untuk melihat estimasi premi All Risk atau TLO sesuai kendaraan Anda.
                  </p>
                </div>
              </div>
            </Container>
          </Section>

          <Section tone="soft" id="panduan-asuransi-mobil">
            <Container>
              <SectionHeader
                eyebrow="Panduan Utama"
                title="Pelajari Asuransi Mobil Lebih Dalam"
                description="Mulai dari perbedaan All Risk dan TLO, cara menghitung premi, biaya, hingga perluasan perlindungan."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {PILLAR_ARTICLES.map((article) => (
                  <Link
                    key={article.slug}
                    href={article.href}
                    className="group rounded-2xl border border-[#E2E8F0] bg-white p-4 hover:border-[#0F766E] hover:shadow-md transition-all"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E]">
                      {article.category}
                    </span>
                    <h2 className="mt-2 text-sm font-semibold text-[#0F172A] leading-snug group-hover:text-[#0F766E]">
                      {article.title}
                    </h2>
                    <p className="mt-2 text-xs text-[#64748B] leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-[#0F766E]">
                      Baca panduan
                      <span aria-hidden>→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </Container>
          </Section>

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
