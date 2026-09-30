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
  title: "Asuransi Mobil TLO & Estimasi Premi",
  description:
    "Pahami asuransi mobil TLO, arti Total Loss Only, cakupan perlindungan, faktor biaya, perbedaannya dengan All Risk, dan cek estimasi premi kendaraan.",
  alternates: { canonical: `${SITE_URL}/asuransi-mobil-tlo` },
  openGraph: {
    title: "Asuransi Mobil TLO & Estimasi Premi | Jasa Proteksi",
    description:
      "Panduan asuransi mobil TLO, arti Total Loss Only, cakupan perlindungan, faktor biaya, dan estimasi premi kendaraan.",
    url: `${SITE_URL}/asuransi-mobil-tlo`,
    siteName: "Jasa Proteksi",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
};

export default async function TLOPage() {
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
                    Total Loss Only (TLO)
                  </Badge>
                  <h1 className="ds-h1">Asuransi Mobil TLO</h1>
                  <p className="ds-body-lg">
                    Asuransi mobil TLO atau Total Loss Only memberikan perlindungan terhadap
                    kehilangan atau kerusakan yang memenuhi kriteria kerugian total sesuai manfaat,
                    pengecualian, dan ketentuan polis.
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
              <div className="mt-8 space-y-6">
                <Card variant="lg" className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#0F766E]" aria-hidden />
                    <h2 className="font-semibold text-[#0F172A]">Apa yang Dicakup Asuransi TLO?</h2>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Asuransi TLO berfokus pada risiko kehilangan kendaraan atau kerusakan yang
                    memenuhi kriteria total loss sesuai polis. Kerusakan ringan atau sebagian yang
                    tidak memenuhi kriteria tersebut umumnya tidak termasuk dalam perlindungan TLO.
                  </p>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Syarat total loss, pengecualian, dokumen klaim, dan manfaat akhir dapat berbeda
                    antar perusahaan asuransi, sehingga rincian polis tetap perlu dibaca sebelum membeli.
                  </p>
                </Card>

                <section>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-2">Apa Arti Total Loss Only?</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Total Loss Only berarti perlindungan difokuskan pada kerugian yang dikategorikan
                    sebagai kerugian total menurut ketentuan polis. Istilah TLO bukan berarti semua
                    jenis kerusakan ditanggung, sehingga penting membedakannya dari perlindungan All Risk.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-2">TLO vs All Risk: Apa Bedanya?</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    All Risk memiliki cakupan lebih luas terhadap kerusakan sebagian hingga kerusakan berat,
                    sedangkan TLO berfokus pada kerugian total. Karena cakupannya lebih terbatas, premi TLO
                    umumnya lebih rendah. Baca perbandingan lengkap di{" "}
                    <Link href="/perbedaan-all-risk-dan-tlo" className="font-semibold text-[#0F766E] hover:underline">
                      perbedaan All Risk dan TLO
                    </Link>.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-2">Berapa Premi Asuransi Mobil TLO?</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Premi TLO dipengaruhi nilai kendaraan, wilayah penggunaan, usia kendaraan,
                    kategori kendaraan, perusahaan asuransi, serta perluasan yang dipilih jika tersedia.
                    Untuk memahami komponen biayanya, lihat{" "}
                    <Link href="/faktor-premi-asuransi-mobil" className="font-semibold text-[#0F766E] hover:underline">
                      faktor premi asuransi mobil
                    </Link>{" "}
                    dan{" "}
                    <Link href="/biaya-asuransi-mobil" className="font-semibold text-[#0F766E] hover:underline">
                      estimasi harga asuransi mobil
                    </Link>.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-2">Siapa yang Cocok Mempertimbangkan TLO?</h2>
                  <p className="text-sm text-[#475569] leading-relaxed mb-3">
                    TLO dapat dipertimbangkan ketika kebutuhan utama adalah perlindungan terhadap
                    risiko kehilangan atau kerugian besar, dengan premi yang biasanya lebih terjangkau
                    dibanding All Risk. Pilihan tetap perlu disesuaikan dengan nilai kendaraan, usia,
                    pola penggunaan, dan kemampuan menanggung risiko kerusakan sebagian sendiri.
                  </p>
                  <Link href="/asuransi-mobil" className="text-sm font-semibold text-[#0F766E] hover:underline">
                    Lihat panduan asuransi mobil
                  </Link>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-[#0F172A] mb-2">Cara Cek Estimasi Premi TLO</h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Masukkan data kendaraan, tahun, wilayah penggunaan, dan pilih TLO pada kalkulator.
                    Hasil yang tampil merupakan estimasi awal dan bukan quotation final. Untuk simulasi,
                    buka{" "}
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
