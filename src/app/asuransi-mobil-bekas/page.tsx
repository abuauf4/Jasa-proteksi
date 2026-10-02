import { Metadata } from "next";
import { getArticleSettings } from "@/lib/article-helpers";
import { ArticleShell } from "@/components/site/ArticleShell";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Asuransi Mobil Bekas: All Risk atau TLO?",
  description:
    "Panduan asuransi mobil bekas: pilihan All Risk atau TLO, batas usia kendaraan, faktor premi, bengkel resmi, dan cara cek estimasi sesuai mobil Anda.",
  alternates: { canonical: `${SITE_URL}/asuransi-mobil-bekas` },
  openGraph: {
    title: "Asuransi Mobil Bekas: All Risk atau TLO?",
    description: "Panduan memilih All Risk atau TLO untuk mobil bekas, batas usia kendaraan, faktor premi, dan estimasi biaya.",
    url: `${SITE_URL}/asuransi-mobil-bekas`,
    type: "article",
    images: [{ url: "/asuransi-mobil-bekas.webp", width: 1200, height: 630 }],
  },
};

export default async function Page() {
  const { initialSettings, initialHero } = await getArticleSettings();

  const faqs = [
    { q: "Mobil bekas masih bisa diasuransikan?", a: "Bisa selama memenuhi syarat produk dan perusahaan asuransi. Usia kendaraan, kondisi, nilai pertanggungan, serta pilihan All Risk atau TLO akan memengaruhi kelayakan. Cek menggunakan tahun kendaraan Anda untuk melihat opsi yang tersedia." },
    { q: "Apakah perlu survey kendaraan?", a: "Untuk kendaraan berusia lanjut atau bernilai tinggi, partner asuransi dapat meminta survey kondisi kendaraan sebelum menerbitkan polis. Hal ini untuk memastikan kondisi aktual kendaraan sesuai dengan nilai pertanggungan." },
    { q: "Apakah semua mobil bekas bisa memakai All Risk?", a: "Tidak selalu. Setiap perusahaan asuransi dapat menetapkan batas usia dan syarat kendaraan yang berbeda untuk All Risk. Jika tidak memenuhi syarat, cek apakah TLO atau produk lain tersedia." },
  ];

  const related = [
    { slug: "perbedaan-all-risk-dan-tlo", title: "Asuransi Mobil All Risk vs TLO: Perbedaan, Kelebihan, dan Cara Memilih" },
    { slug: "faktor-premi-asuransi-mobil", title: "7 Faktor yang Memengaruhi Premi Asuransi Mobil" },
    { slug: "perluasan-asuransi-mobil", title: "Perluasan Asuransi Mobil: Banjir, Gempa, Kerusuhan, dan TPL" },
    { slug: "perpanjangan-asuransi-mobil", title: "Perpanjangan Asuransi Mobil: Cek Ulang Premi dan Perlindungan" },
  ];

  return (
    <ArticleShell
      initialSettings={initialSettings}
      initialHero={initialHero}
      title="Asuransi Mobil Bekas"
      updatedAt="Agustus 2026"
      coverImage="/asuransi-mobil-bekas.webp"
      faqs={faqs}
      relatedArticles={related}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
        Asuransi Mobil Bekas: Pilih All Risk atau TLO?
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed mb-6">
        Mobil bekas tetap dapat dipertimbangkan untuk perlindungan asuransi selama memenuhi syarat perusahaan
        asuransi. Pilihan utamanya biasanya All Risk atau TLO, tetapi kelayakannya dipengaruhi usia kendaraan,
        kondisi kendaraan, nilai pertanggungan, dan ketentuan masing-masing produk. Karena batas usia berbeda
        antar perusahaan, sebaiknya cek kelayakan berdasarkan tahun kendaraan sebelum memilih perlindungan.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-3">Batas Usia All Risk untuk Mobil Bekas</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">
        Berikut batas usia kendaraan maksimal untuk All Risk dari 8 partner Jasa Proteksi:
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0]">Partner</th>
              <th className="text-left p-2.5 font-semibold text-[#0F766E] border-b border-[#E2E8F0] border-l">Batas All Risk</th>
              <th className="text-left p-2.5 font-semibold text-[#475569] border-b border-[#E2E8F0] border-l">Indikasi Bengkel Resmi</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Sinarmas</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">10 tahun</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Tersedia</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">ACA</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">10 tahun</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Tidak tersedia</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Mega Insurance</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">10 tahun</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Tersedia</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Zurich Syariah</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">10 tahun</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Tersedia</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Tugu</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">5 tahun</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Tersedia</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Sahabat</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">5 tahun</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Tersedia</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Oona</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">5 tahun</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Tersedia</td></tr>
            <tr><td className="p-2.5">MAG (Multi Artha Guna)</td><td className="p-2.5 border-l text-[#0F766E]">3 tahun</td><td className="p-2.5 border-l text-[#475569]">Tidak tersedia</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#64748B] mb-4">
        Batas usia dapat berubah sewaktu-waktu. Verifikasi terbaru via kalkulator dengan tahun kendaraan Anda.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Jika Mobil Tidak Memenuhi Syarat All Risk</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Jika usia kendaraan sudah melewati batas All Risk pada suatu produk, Anda masih dapat memeriksa apakah
        <strong className="text-[#0F172A]"> TLO (Total Loss Only)</strong> tersedia sebagai alternatif. TLO berfokus
        pada kehilangan atau kerusakan yang memenuhi kriteria total loss sesuai polis. Ketersediaan dan batas usia
        tetap mengikuti ketentuan perusahaan asuransi yang dipilih. Lihat juga{" "}
        <a href="/asuransi-mobil-tlo" className="font-semibold text-[#0F766E] hover:underline">
          panduan asuransi mobil TLO
        </a>.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Bengkel Resmi pada Mobil Bekas</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Perluasan Bengkel Resmi memungkinkan perbaikan klaim di jaringan bengkel resmi merek jika tersedia pada
        produk yang dipilih. Ketersediaannya bergantung pada perusahaan asuransi, jenis perlindungan, dan usia
        kendaraan. Karena syaratnya dapat berbeda, periksa opsi bengkel resmi pada quotation sebelum membeli polis.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Tips Sebelum Mengajukan Asuransi Mobil Bekas</h2>
      <ul className="flex flex-col gap-2 mb-4">
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Cek kondisi fisik kendaraan — body, mesin, dan kelistrikan.</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Siapkan dokumen lengkap: BPKB, STNK, dan KTP pemilik.</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Pastikan tahun kendaraan akurat — berpengaruh pada kelayakan All Risk.</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Bandingkan batas usia antar partner sebelum memilih.</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Pertimbangkan TLO bila All Risk sudah tidak dimungkinkan.</li>
      </ul>

      <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 mb-4">
        <p className="text-sm font-semibold text-[#115E59] mb-1">Cek Kelayakan Mobil Bekas Anda</p>
        <p className="text-xs text-[#475569]">
          Masukkan tahun dan data kendaraan pada{" "}
          <a href="/cek-premi" className="font-semibold text-[#0F766E] hover:underline">
            kalkulator premi asuransi mobil
          </a>{" "}
          untuk melihat estimasi yang tersedia. Anda juga bisa membaca{" "}
          <a href="/perbedaan-all-risk-dan-tlo" className="font-semibold text-[#0F766E] hover:underline">
            perbedaan All Risk dan TLO
          </a>{" "}
          serta{" "}
          <a href="/faktor-premi-asuransi-mobil" className="font-semibold text-[#0F766E] hover:underline">
            faktor yang memengaruhi premi
          </a>.
        </p>
      </div>
    </ArticleShell>
  );
}
