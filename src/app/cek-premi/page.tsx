import { Metadata } from "next";
import { ServerDataProvider } from "@/lib/ServerDataContext";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import { HeroCalculator } from "@/components/calculator/HeroCalculator";
import { LegalDisclaimer } from "@/components/site/sections";
import { Container, Section, SectionHeader, Card, Badge } from "@/components/site/primitives";
import { ShieldCheck, Calculator, Sparkles } from "lucide-react";
import { parseCoverageParam } from "@/lib/calculator-urls";
import type { CoverageType } from "@/components/calculator/types";
import { getCachedSiteSettings } from "@/lib/site-data-cache";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Cek Premi Mobil Online | Kalkulator Asuransi",
  description:
    "Cek premi mobil dan estimasi harga asuransi mobil All Risk atau TLO berdasarkan merek, tahun, nilai kendaraan, dan wilayah. Gratis, hasil otomatis.",
  alternates: { canonical: `${SITE_URL}/cek-premi` },
  openGraph: {
    title: "Cek Premi Mobil Online | Kalkulator Asuransi",
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

  const initialSettings = await getCachedSiteSettings();


  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={null}>
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
              <div className="mt-8 space-y-8 text-sm text-[#475569] leading-relaxed">
                <section aria-labelledby="apa-itu-cek-premi">
                  <h2 id="apa-itu-cek-premi" className="text-xl font-bold text-[#0F172A] mb-3">
                    Apa Itu Cek Premi Mobil?
                  </h2>
                  <p>
                    Cek premi mobil adalah simulasi awal untuk memperkirakan biaya perlindungan
                    kendaraan sebelum Anda meminta quotation resmi dari perusahaan asuransi.
                    Kalkulator di halaman ini membantu menyusun estimasi berdasarkan informasi
                    kendaraan yang Anda masukkan, seperti merek, tipe, tahun, nilai kendaraan,
                    wilayah penggunaan, jenis perlindungan, serta perluasan jaminan yang dipilih.
                    Hasilnya dapat digunakan sebagai gambaran awal untuk membandingkan kebutuhan
                    perlindungan sebelum melanjutkan proses pengajuan.
                  </p>
                </section>

                <section aria-labelledby="faktor-premi">
                  <h2 id="faktor-premi" className="text-xl font-bold text-[#0F172A] mb-3">
                    Faktor yang Memengaruhi Premi Asuransi Mobil
                  </h2>
                  <p>
                    Besarnya premi tidak hanya ditentukan oleh harga kendaraan. Tahun kendaraan,
                    kategori kendaraan, wilayah penggunaan, pilihan All Risk atau TLO, dan
                    perluasan jaminan juga dapat memengaruhi hasil simulasi. Karena itu, dua mobil
                    dengan harga yang mirip belum tentu menghasilkan estimasi premi yang sama.
                    Untuk penjelasan lebih lengkap tentang komponen biaya, lihat{" "}
                    <a
                      href="/biaya-asuransi-mobil"
                      className="font-semibold text-[#0F766E] hover:underline"
                    >
                      panduan biaya asuransi mobil
                    </a>.
                  </p>
                </section>

                <section aria-labelledby="all-risk-tlo">
                  <h2 id="all-risk-tlo" className="text-xl font-bold text-[#0F172A] mb-3">
                    Pilih All Risk atau TLO?
                  </h2>
                  <p>
                    All Risk memberikan cakupan yang lebih luas untuk berbagai risiko kerusakan
                    sesuai ketentuan polis, sedangkan TLO berfokus pada kerugian besar sesuai
                    batas yang ditetapkan dalam polis. Pilihan yang sesuai bergantung pada kondisi
                    kendaraan, usia kendaraan, pola penggunaan, dan kebutuhan perlindungan Anda.
                    Jika masih membandingkan keduanya, baca{" "}
                    <a
                      href="/perbedaan-all-risk-dan-tlo"
                      className="font-semibold text-[#0F766E] hover:underline"
                    >
                      perbedaan All Risk dan TLO
                    </a>{" "}
                    sebelum menjalankan simulasi.
                  </p>
                </section>

                <section aria-labelledby="cara-hasil-simulasi">
                  <h2 id="cara-hasil-simulasi" className="text-xl font-bold text-[#0F172A] mb-3">
                    Cara Membaca Hasil Simulasi Premi
                  </h2>
                  <p>
                    Setelah data kendaraan lengkap, kalkulator menampilkan estimasi premi sesuai
                    pilihan perlindungan dan perluasan yang dipilih. Angka tersebut adalah simulasi
                    awal, bukan harga polis final. Quotation akhir tetap dapat menyesuaikan hasil
                    verifikasi kendaraan, ketentuan underwriting, manfaat, pengecualian, dan
                    kebijakan perusahaan asuransi yang dipilih. Anda juga bisa membuka{" "}
                    <a
                      href="/asuransi-mobil"
                      className="font-semibold text-[#0F766E] hover:underline"
                    >
                      panduan asuransi mobil
                    </a>{" "}
                    untuk memahami alur perlindungan secara keseluruhan.
                  </p>
                </section>

                <section aria-labelledby="faq-cek-premi">
                  <h2 id="faq-cek-premi" className="text-xl font-bold text-[#0F172A] mb-3">
                    Pertanyaan Umum tentang Cek Premi Mobil
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-[#0F172A]">
                        Apakah cek premi mobil di sini berbayar?
                      </h3>
                      <p>
                        Tidak. Simulasi dapat digunakan untuk melihat estimasi awal tanpa biaya.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F172A]">
                        Apakah hasil kalkulator sama dengan harga polis final?
                      </h3>
                      <p>
                        Belum tentu. Hasil kalkulator adalah estimasi awal. Premi final mengikuti
                        quotation dan ketentuan perusahaan asuransi setelah proses verifikasi.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F172A]">
                        Data apa yang dibutuhkan untuk cek premi asuransi mobil?
                      </h3>
                      <p>
                        Umumnya Anda perlu menyiapkan merek, tipe, tahun kendaraan, nilai kendaraan,
                        wilayah penggunaan, dan jenis perlindungan yang ingin disimulasikan.
                      </p>
                    </div>
                  </div>
                </section>
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
