import { Metadata } from "next";
import { getArticleSettings } from "@/lib/article-helpers";
import { ArticleShell } from "@/components/site/ArticleShell";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Asuransi Mobil Banjir: Perluasan, Biaya, dan Cara Simulasi",
  description:
    "Pelajari perlindungan banjir pada asuransi mobil, posisi banjir sebagai perluasan jaminan, referensi rate yang digunakan di Jasa Proteksi, dan cara melihat dampaknya pada premi.",
  alternates: { canonical: `${SITE_URL}/asuransi-mobil-banjir` },
  openGraph: {
    title: "Asuransi Mobil Banjir: Perluasan, Biaya, dan Cara Simulasi",
    description:
      "Panduan perlindungan banjir untuk asuransi mobil dan cara menghitung estimasi tambahan preminya.",
    url: `${SITE_URL}/asuransi-mobil-banjir`,
    type: "article",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
};

export default async function Page() {
  const { initialSettings, initialHero } = await getArticleSettings();

  const faqs = [
    {
      q: "Apakah All Risk otomatis menanggung banjir?",
      a: "Pada panduan dan kalkulator Jasa Proteksi, banjir diperlakukan sebagai perluasan jaminan. Artinya, perlindungan banjir perlu dipilih agar tercantum dalam perlindungan yang diajukan. Manfaat final tetap mengikuti polis perusahaan asuransi.",
    },
    {
      q: "Berapa rate perluasan banjir?",
      a: "Referensi rate banjir yang digunakan pada konten Jasa Proteksi adalah 0,1% dari nilai kendaraan. Estimasi pada kalkulator dapat mengikuti konfigurasi aktif dan hasil final tetap mengikuti quotation perusahaan asuransi.",
    },
    {
      q: "Bisa klaim banjir jika perluasan tidak dipilih?",
      a: "Perlindungan terhadap kerusakan akibat banjir memerlukan perluasan banjir yang aktif pada polis. Jika tidak tercantum sebagai manfaat polis, kerusakan akibat banjir tidak otomatis menjadi bagian dari perlindungan dasar.",
    },
  ];

  const related = [
    { slug: "perluasan-asuransi-mobil", title: "Perluasan Asuransi Mobil" },
    { slug: "cara-menghitung-premi-asuransi-mobil", title: "Cara Menghitung Premi Asuransi Mobil" },
    { slug: "cara-klaim-asuransi-mobil", title: "Cara Klaim Asuransi Mobil" },
  ];

  return (
    <ArticleShell
      initialSettings={initialSettings}
      initialHero={initialHero}
      title="Asuransi Mobil Banjir"
      description="Panduan perlindungan banjir sebagai perluasan asuransi mobil."
      updatedAt="September 2026"
      faqs={faqs}
      relatedArticles={related}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
        Asuransi Mobil Banjir: Perluasan, Biaya, dan Cara Simulasi
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed mb-6">
        Perlindungan banjir merupakan salah satu perluasan yang tersedia pada kalkulator Jasa Proteksi.
        Perluasan ini ditambahkan di atas perlindungan utama yang dipilih agar risiko akibat banjir dan
        kondisi terkait dapat dimasukkan dalam pengajuan perlindungan. Detail manfaat final tetap mengikuti
        polis dari perusahaan asuransi.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Banjir Bukan Sekadar Label All Risk
      </h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Istilah All Risk sering dianggap berarti semua kejadian otomatis ditanggung. Pada praktik produk
        yang ditampilkan Jasa Proteksi, beberapa risiko tetap diposisikan sebagai perluasan terpisah.
        Banjir adalah salah satunya. Karena itu, pengguna perlu memeriksa pilihan perluasan sebelum
        melanjutkan pengajuan.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Referensi Biaya Perluasan Banjir
      </h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">
        Konten Jasa Proteksi saat ini menggunakan referensi rate banjir sebesar{" "}
        <strong className="text-[#0F172A]">0,1%</strong> dari nilai kendaraan.
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left p-3 font-semibold text-[#0F172A] border-b border-[#E2E8F0]">Nilai Kendaraan</th>
              <th className="text-left p-3 font-semibold text-[#0F766E] border-b border-[#E2E8F0] border-l">Contoh 0,1%</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-3 border-b border-[#E2E8F0]">Rp200 juta</td><td className="p-3 border-b border-[#E2E8F0] border-l">± Rp200.000</td></tr>
            <tr><td className="p-3 border-b border-[#E2E8F0]">Rp300 juta</td><td className="p-3 border-b border-[#E2E8F0] border-l">± Rp300.000</td></tr>
            <tr><td className="p-3">Rp500 juta</td><td className="p-3 border-l">± Rp500.000</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#64748B] mb-4">
        Contoh di atas hanya ilustrasi perhitungan sederhana. Estimasi kalkulator dan quotation final dapat
        dipengaruhi konfigurasi produk, partner, wilayah, dan komponen lain.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Cara Melihat Dampaknya di Kalkulator
      </h2>
      <ol className="flex flex-col gap-2 mb-5">
        <li className="text-sm text-[#475569]">1. Pilih merek, tipe, dan tahun kendaraan.</li>
        <li className="text-sm text-[#475569]">2. Tentukan wilayah penggunaan dan jenis perlindungan.</li>
        <li className="text-sm text-[#475569]">3. Aktifkan pilihan Banjir pada bagian perluasan.</li>
        <li className="text-sm text-[#475569]">4. Bandingkan estimasi sebelum dan sesudah perluasan ditambahkan.</li>
      </ol>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Jika Mobil Sudah Terkena Banjir
      </h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Klaim bergantung pada manfaat yang tercantum pada polis dan hasil verifikasi perusahaan asuransi.
        Jika perluasan banjir aktif, ikuti alur klaim dari perusahaan asuransi dan siapkan informasi
        kejadian sesuai permintaan. Jika perluasan tersebut tidak ada pada polis, perlindungan terhadap
        banjir tidak otomatis ditambahkan setelah kejadian.
      </p>

      <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 mb-4">
        <p className="text-sm font-semibold text-[#115E59] mb-1">Simulasikan Sebelum Mengajukan</p>
        <p className="text-xs text-[#475569] leading-relaxed">
          Gunakan kalkulator di bawah untuk melihat perubahan estimasi premi ketika perluasan Banjir
          ditambahkan. Hasil simulasi membantu membandingkan pilihan sebelum meminta quotation final.
        </p>
      </div>
    </ArticleShell>
  );
}
