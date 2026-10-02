import { Metadata } from "next";
import { getArticleSettings } from "@/lib/article-helpers";
import { ArticleShell } from "@/components/site/ArticleShell";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Perpanjangan Asuransi Mobil: Cek Ulang Premi dan Perlindungan",
  description:
    "Panduan perpanjangan asuransi mobil: kenapa premi bisa berubah, apa yang perlu dicek ulang, kapan membandingkan All Risk dan TLO, serta cara simulasi sebelum perpanjangan.",
  alternates: { canonical: `${SITE_URL}/perpanjangan-asuransi-mobil` },
  openGraph: {
    title: "Perpanjangan Asuransi Mobil: Cek Ulang Premi dan Perlindungan",
    description:
      "Hal yang perlu diperiksa sebelum memperpanjang asuransi mobil agar pilihan perlindungan tetap sesuai kebutuhan.",
    url: `${SITE_URL}/perpanjangan-asuransi-mobil`,
    type: "article",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
};

export default async function Page() {
  const { initialSettings, initialHero } = await getArticleSettings();

  const faqs = [
    {
      q: "Apakah premi perpanjangan selalu sama dengan tahun sebelumnya?",
      a: "Tidak selalu. Premi dapat berubah karena nilai kendaraan, usia kendaraan, wilayah, pilihan perlindungan, perluasan, konfigurasi rate, dan partner asuransi yang digunakan.",
    },
    {
      q: "Bisa ganti dari All Risk ke TLO saat perpanjangan?",
      a: "Pilihan perlindungan dapat dievaluasi kembali saat masa pertanggungan baru. Ketersediaan dan persetujuan final mengikuti ketentuan perusahaan asuransi serta kondisi kendaraan.",
    },
    {
      q: "Apakah perlu menghitung ulang sebelum perpanjangan?",
      a: "Menghitung ulang membantu melihat estimasi berdasarkan data kendaraan terbaru. Gunakan tahun kendaraan, wilayah penggunaan, dan pilihan perlindungan yang sesuai kondisi saat ini sebelum meminta quotation final.",
    },
  ];

  const related = [
    { slug: "biaya-asuransi-mobil", title: "Berapa Biaya Asuransi Mobil?" },
    { slug: "faktor-premi-asuransi-mobil", title: "7 Faktor yang Memengaruhi Premi" },
    { slug: "asuransi-mobil-bekas", title: "Asuransi Mobil Bekas" },
  ];

  return (
    <ArticleShell
      initialSettings={initialSettings}
      initialHero={initialHero}
      title="Perpanjangan Asuransi Mobil"
      description="Panduan mengevaluasi kembali premi dan perlindungan saat memperpanjang asuransi mobil."
      updatedAt="September 2026"
      faqs={faqs}
      relatedArticles={related}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
        Perpanjangan Asuransi Mobil: Cek Ulang Premi dan Perlindungan
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed mb-6">
        Perpanjangan polis bukan sekadar mengulang premi tahun sebelumnya. Usia kendaraan bertambah,
        nilai kendaraan dapat berubah, dan kebutuhan perlindungan juga bisa berbeda. Karena itu,
        menjelang masa polis berakhir sebaiknya lakukan simulasi ulang dan periksa kembali All Risk,
        TLO, serta perluasan yang masih relevan.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Kenapa Premi Bisa Berubah Saat Perpanjangan?
      </h2>
      <ul className="flex flex-col gap-2 mb-5">
        <li className="text-sm text-[#475569]">• <strong className="text-[#0F172A]">Usia kendaraan bertambah</strong> dan dapat memengaruhi loading serta kelayakan All Risk.</li>
        <li className="text-sm text-[#475569]">• <strong className="text-[#0F172A]">Nilai kendaraan berubah</strong> sehingga basis perhitungan premi dapat berbeda.</li>
        <li className="text-sm text-[#475569]">• <strong className="text-[#0F172A]">Jenis perlindungan berubah</strong>, misalnya dari All Risk ke TLO atau sebaliknya bila memenuhi syarat.</li>
        <li className="text-sm text-[#475569]">• <strong className="text-[#0F172A]">Perluasan jaminan berubah</strong>, seperti Banjir, Bengkel Resmi, TPL, atau PA.</li>
        <li className="text-sm text-[#475569]">• <strong className="text-[#0F172A]">Partner dan konfigurasi rate</strong> dapat menghasilkan estimasi berbeda.</li>
      </ul>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Checklist Sebelum Memperpanjang
      </h2>
      <ol className="flex flex-col gap-3 mb-5">
        {[
          ["Cek tahun dan kondisi kendaraan", "Pastikan data yang digunakan untuk simulasi sesuai kondisi sekarang."],
          ["Bandingkan All Risk dan TLO", "Evaluasi kembali kebutuhan perlindungan dan budget untuk periode berikutnya."],
          ["Periksa perluasan", "Pertahankan, tambah, atau kurangi perluasan sesuai kebutuhan penggunaan kendaraan."],
          ["Bandingkan partner", "Lihat estimasi dari pilihan partner yang tersedia pada kalkulator."],
          ["Konfirmasi quotation final", "Gunakan hasil simulasi sebagai referensi awal, lalu pastikan detail final pada quotation dan polis baru."],
        ].map(([title, desc], index) => (
          <li key={title} className="flex items-start gap-3 text-sm text-[#475569]">
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#0F766E] text-white flex items-center justify-center text-xs font-bold">
              {index + 1}
            </span>
            <span>
              <strong className="text-[#0F172A]">{title}.</strong> {desc}
            </span>
          </li>
        ))}
      </ol>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Perhatikan Batas Usia All Risk
      </h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Seiring bertambahnya usia mobil, beberapa partner tidak lagi menyediakan All Risk. Data partner
        yang digunakan pada panduan Jasa Proteksi memiliki batas usia yang berbeda-beda. Jika kendaraan
        sudah melewati batas partner tertentu, kalkulator dapat membantu melihat pilihan lain atau TLO
        sebagai alternatif perlindungan.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Jangan Menunggu Data Lama Menjadi Acuan
      </h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Premi tahun lalu berguna sebagai referensi, tetapi bukan jaminan premi periode berikutnya.
        Jalankan simulasi dengan data terbaru agar perbandingan lebih relevan. Setelah itu, gunakan
        quotation dari perusahaan asuransi sebagai dasar keputusan akhir.
      </p>

      <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 mb-4">
        <p className="text-sm font-semibold text-[#115E59] mb-1">Hitung Ulang Sebelum Perpanjangan</p>
        <p className="text-xs text-[#475569] leading-relaxed">
          Kalkulator di bawah membantu mengecek estimasi berdasarkan data kendaraan saat ini dan
          membandingkan pilihan perlindungan sebelum masuk ke proses perpanjangan.
        </p>
      </div>
    </ArticleShell>
  );
}
