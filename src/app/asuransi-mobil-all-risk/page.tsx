import { Metadata } from "next";
import { ServerDataProvider } from "@/lib/ServerDataContext";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { LegalDisclaimer } from "@/components/site/sections";
import { Container, Section, SectionHeader, Card, Badge } from "@/components/site/primitives";
import { ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getCachedSiteSettings } from "@/lib/site-data-cache";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Asuransi Mobil All Risk & Estimasi Premi",
  description:
    "Pahami asuransi mobil All Risk, cakupan perlindungan, faktor biaya, perbedaannya dengan TLO, dan cek estimasi premi sesuai data kendaraan Anda.",
  alternates: { canonical: `${SITE_URL}/asuransi-mobil-all-risk` },
  openGraph: {
    title: "Asuransi Mobil All Risk & Estimasi Premi | Jasa Proteksi",
    description:
      "Panduan asuransi mobil All Risk, cakupan perlindungan, faktor biaya, dan estimasi premi sesuai data kendaraan.",
    url: `${SITE_URL}/asuransi-mobil-all-risk`,
    siteName: "Jasa Proteksi",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
};

export default async function AllRiskPage() {
  const initialSettings = await getCachedSiteSettings();

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={null}>
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          <Section tone="soft" className="!pt-10 !pb-12 sm:!pt-14 sm:!pb-16">
            <Container>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="flex flex-col gap-5 lg:pt-4 max-w-xl">
                  <Badge>
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    All Risk (Comprehensive)
                  </Badge>
                  <h1 className="ds-h1">Asuransi Mobil All Risk</h1>
                  <p className="ds-body-lg">
                    Asuransi mobil All Risk atau Comprehensive memberikan cakupan perlindungan
                    lebih luas dibanding TLO, termasuk kerusakan sebagian hingga kerusakan berat
                    sesuai manfaat, pengecualian, dan ketentuan polis.
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {[
                      "Cocok dipertimbangkan untuk mobil baru",
                      "Kendaraan yang rutin digunakan",
                      "Pengguna yang membutuhkan cakupan lebih luas",
                    ].map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#0F766E] flex-shrink-0 mt-0.5" aria-hidden />
                        <span className="text-sm sm:text-base text-[#475569]">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="kalkulator" className="scroll-mt-20">
                  <HeroCalculator initialCoverageType="AllRisk" />
                </div>
              </div>
            </Container>
          </Section>

          <Section tone="white">
            <Container className="max-w-3xl">
              <SectionHeader
                eyebrow="Tentang All Risk"
                title="Apa itu Asuransi Mobil All Risk?"
                description="All Risk (Comprehensive) adalah jenis perlindungan asuransi mobil yang memberikan cakupan terhadap kerusakan sebagian hingga kerusakan berat sesuai manfaat dan ketentuan polis."
              />
              <div className="mt-8 space-y-6">
                <Card variant="lg" className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#0F766E]" aria-hidden />
                    <h2 className="font-semibold text-[#0F172A]">Apa yang Dicakup All Risk?</h2>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Secara umum, perlindungan All Risk dapat mencakup kerusakan sebagian hingga
                    kerusakan berat akibat risiko yang dijamin polis. Contohnya bisa berupa lecet,
                    penyok, benturan, atau kecelakaan. Cakupan persisnya tetap mengikuti polis
                    perusahaan asuransi yang dipilih.
                  </p>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Risiko tertentu seperti banjir, gempa bumi, kerusuhan, tanggung jawab hukum
                    terhadap pihak ketiga, atau kecelakaan diri biasanya perlu diperiksa sebagai
                    perluasan tambahan dan tidak boleh diasumsikan otomatis termasuk.
                  </p>
                </Card>

                <section>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-2">All Risk vs TLO: Apa Bedanya?</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Perbedaan utama ada pada luas perlindungan. All Risk memiliki cakupan lebih luas,
                    sedangkan TLO berfokus pada kerugian yang memenuhi kriteria total loss sesuai polis.
                    Karena cakupannya berbeda, premi All Risk umumnya lebih tinggi. Lihat penjelasan lengkap di{" "}
                    <Link href="/perbedaan-all-risk-dan-tlo" className="font-semibold text-[#0F766E] hover:underline">
                      perbedaan All Risk dan TLO
                    </Link>.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-2">Berapa Premi Asuransi Mobil All Risk?</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Besarnya premi dipengaruhi nilai kendaraan, wilayah penggunaan, usia kendaraan,
                    kategori kendaraan, perluasan perlindungan, dan perusahaan asuransi. Karena itu,
                    dua mobil dengan harga berbeda atau berada di wilayah berbeda dapat menghasilkan
                    estimasi premi yang berbeda. Baca juga{" "}
                    <Link href="/faktor-premi-asuransi-mobil" className="font-semibold text-[#0F766E] hover:underline">
                      faktor yang memengaruhi premi asuransi mobil
                    </Link>.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-2">Siapa yang Cocok Mempertimbangkan All Risk?</h2>
                  <p className="text-sm text-[#475569] leading-relaxed mb-3">
                    All Risk dapat dipertimbangkan ketika kendaraan masih memiliki nilai tinggi,
                    sering digunakan, atau ketika pemilik ingin mengurangi risiko biaya perbaikan
                    akibat kerusakan sebagian. Namun pilihan perlindungan tetap perlu disesuaikan
                    dengan kebutuhan, usia kendaraan, anggaran, serta syarat perusahaan asuransi.
                  </p>
                  <Link href="/asuransi-mobil" className="text-sm font-semibold text-[#0F766E] hover:underline">
                    Lihat panduan asuransi mobil
                  </Link>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-2">Cara Cek Estimasi Premi All Risk</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Masukkan data kendaraan, tahun, wilayah penggunaan, dan pilihan perlindungan pada
                    kalkulator. Hasil yang tampil merupakan estimasi awal, bukan quotation final.
                    Untuk halaman khusus simulasi, buka{" "}
                    <Link href="/cek-premi" className="font-semibold text-[#0F766E] hover:underline">
                      cek premi asuransi mobil
                    </Link>.
                  </p>
                </section>

                <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-4">
                  <p className="text-sm text-[#92400E] leading-relaxed">
                    <strong>Catatan:</strong> Manfaat, pengecualian, syarat, dan ketentuan akhir
                    mengikuti polis dari perusahaan asuransi penerbit. Hasil simulasi merupakan
                    estimasi awal dan bukan harga final.
                  </p>
                </div>
              </div>
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
