import { Metadata } from "next";
import { getArticleSettings } from "@/lib/article-helpers";
import { ArticleShell } from "@/components/site/ArticleShell";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Asuransi Mobil Baru: Pilih All Risk atau TLO dan Hitung Premi",
  description:
    "Panduan asuransi mobil baru: memahami pilihan All Risk dan TLO, faktor yang memengaruhi premi, perluasan yang tersedia, bengkel resmi, dan cara simulasi online.",
  alternates: { canonical: `${SITE_URL}/asuransi-mobil-baru` },
  openGraph: {
    title: "Asuransi Mobil Baru: Pilih All Risk atau TLO dan Hitung Premi",
    description:
      "Pelajari pilihan perlindungan untuk mobil baru dan hitung estimasi premi berdasarkan data kendaraan.",
    url: `${SITE_URL}/asuransi-mobil-baru`,
    type: "article",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
};

export default async function Page() {
  const { initialSettings, initialHero } = await getArticleSettings();

  const faqs = [
    {
      q: "Apakah mobil baru harus menggunakan All Risk?",
      a: "Tidak ada kewajiban dari Jasa Proteksi untuk memilih All Risk. All Risk memiliki cakupan kerusakan yang lebih luas dibanding TLO, sedangkan pilihan akhir sebaiknya disesuaikan dengan kebutuhan, budget, dan ketentuan produk.",
    },
    {
      q: "Apakah mobil baru bisa memilih TLO?",
      a: "TLO merupakan salah satu pilihan perlindungan yang tersedia pada kalkulator. Perbedaannya dengan All Risk terletak pada cakupan manfaat, sehingga pengguna perlu memahami risikonya sebelum memilih.",
    },
    {
      q: "Bisa memilih bengkel resmi?",
      a: "Perluasan Bengkel Resmi tersedia pada partner tertentu dan mengikuti syarat usia kendaraan serta ketentuan produk. Ketersediaannya dapat dilihat pada hasil simulasi dan dikonfirmasi kembali pada quotation final.",
    },
  ];

  const related = [
    { slug: "perbedaan-all-risk-dan-tlo", title: "Asuransi Mobil All Risk vs TLO" },
    { slug: "biaya-asuransi-mobil", title: "Berapa Biaya Asuransi Mobil?" },
    { slug: "perluasan-asuransi-mobil", title: "Perluasan Asuransi Mobil" },
  ];

  return (
    <ArticleShell
      initialSettings={initialSettings}
      initialHero={initialHero}
      title="Asuransi Mobil Baru"
      description="Panduan memilih perlindungan dan menghitung estimasi premi untuk mobil baru."
      updatedAt="September 2026"
      faqs={faqs}
      relatedArticles={related}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
        Asuransi Mobil Baru: Pilih All Risk atau TLO dan Hitung Premi
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed mb-6">
        Mobil baru memiliki nilai kendaraan yang relatif tinggi, sehingga pilihan perlindungan perlu
        dipertimbangkan sejak awal. Di Jasa Proteksi, pengguna dapat membandingkan estimasi All Risk
        dan TLO berdasarkan merek, tipe, tahun kendaraan, wilayah penggunaan, serta perluasan yang dipilih.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        All Risk atau TLO untuk Mobil Baru?
      </h2>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left p-3 font-semibold text-[#0F172A] border-b border-[#E2E8F0]">Pertimbangan</th>
              <th className="text-left p-3 font-semibold text-[#0F766E] border-b border-[#E2E8F0] border-l">All Risk</th>
              <th className="text-left p-3 font-semibold text-[#475569] border-b border-[#E2E8F0] border-l">TLO</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-3 border-b border-[#E2E8F0]">Kerusakan sebagian</td><td className="p-3 border-b border-[#E2E8F0] border-l">Sesuai manfaat polis</td><td className="p-3 border-b border-[#E2E8F0] border-l">Tidak menjadi fokus perlindungan</td></tr>
            <tr><td className="p-3 border-b border-[#E2E8F0]">Kerugian total / kehilangan</td><td className="p-3 border-b border-[#E2E8F0] border-l">Sesuai manfaat polis</td><td className="p-3 border-b border-[#E2E8F0] border-l">Sesuai kriteria polis</td></tr>
            <tr><td className="p-3">Premi</td><td className="p-3 border-l">Umumnya lebih tinggi</td><td className="p-3 border-l">Umumnya lebih rendah</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Faktor Premi Mobil Baru
      </h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">
        Tahun kendaraan yang baru bukan satu-satunya penentu. Estimasi pada kalkulator juga dipengaruhi oleh:
      </p>
      <ul className="flex flex-col gap-2 mb-5">
        <li className="text-sm text-[#475569]">• Nilai kendaraan atau harga OTR yang digunakan sebagai basis perhitungan.</li>
        <li className="text-sm text-[#475569]">• Wilayah penggunaan kendaraan.</li>
        <li className="text-sm text-[#475569]">• Pilihan All Risk atau TLO.</li>
        <li className="text-sm text-[#475569]">• Perluasan seperti Banjir, Gempa, SRCC, Terorisme, TPL, PA, dan Bengkel Resmi.</li>
        <li className="text-sm text-[#475569]">• Partner asuransi dan konfigurasi rate yang digunakan.</li>
      </ul>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Pertimbangkan Perluasan Bengkel Resmi
      </h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Untuk pengguna yang ingin opsi perbaikan melalui bengkel resmi merek, tersedia perluasan Bengkel Resmi
        pada partner tertentu. Rate dan ketersediaannya berbeda antar partner. Opsi ini tidak otomatis tersedia
        pada semua produk, sehingga perlu dicek pada hasil simulasi dan quotation final.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Cara Menghitung Estimasi Premi Mobil Baru
      </h2>
      <ol className="flex flex-col gap-2 mb-5">
        <li className="text-sm text-[#475569]">1. Pilih merek dan model kendaraan.</li>
        <li className="text-sm text-[#475569]">2. Pilih tahun kendaraan terbaru yang sesuai.</li>
        <li className="text-sm text-[#475569]">3. Tentukan wilayah penggunaan.</li>
        <li className="text-sm text-[#475569]">4. Bandingkan All Risk dan TLO.</li>
        <li className="text-sm text-[#475569]">5. Tambahkan perluasan yang ingin dibandingkan.</li>
      </ol>

      <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 mb-4">
        <p className="text-sm font-semibold text-[#115E59] mb-1">Mulai dari Data Mobil Anda</p>
        <p className="text-xs text-[#475569] leading-relaxed">
          Kalkulator di bawah menggunakan data kendaraan dan pilihan perlindungan untuk menghasilkan
          estimasi awal. Harga final dan manfaat pertanggungan mengikuti quotation serta polis perusahaan asuransi.
        </p>
      </div>
    </ArticleShell>
  );
}
