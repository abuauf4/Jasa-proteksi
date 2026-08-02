import { Metadata } from "next";
import { getArticleSettings } from "@/lib/article-helpers";
import { ArticleShell } from "@/components/site/ArticleShell";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Berapa Biaya Asuransi Mobil? Simulasi Berdasarkan Harga Kendaraan",
  description:
    "Estimasi biaya asuransi mobil berdasarkan rentang harga kendaraan: Rp100 jt, Rp200 jt, Rp300 jt, Rp500 jt, dan di atas Rp500 jt. Lihat rentang All Risk dan TLO dari 8 partner.",
  alternates: { canonical: `${SITE_URL}/biaya-asuransi-mobil` },
  openGraph: {
    title: "Berapa Biaya Asuransi Mobil? Simulasi Berdasarkan Harga Kendaraan",
    description: "Tabel estimasi biaya asuransi mobil berdasarkan harga kendaraan, dengan rentang All Risk dan TLO.",
    url: `${SITE_URL}/biaya-asuransi-mobil`,
    type: "article",
    images: [{ url: "/biaya-asuransi-mobil.webp", width: 1200, height: 630 }],
  },
};

export default async function Page() {
  const { initialSettings, initialHero } = await getArticleSettings();

  const faqs = [
    { q: "Kenapa premi mobil saya lebih mahal dari teman?", a: "Banyak penyebabnya: harga kendaraan, tahun, wilayah plat, jenis perlindungan, perluasan, dan partner yang dipilih bisa berbeda. Mobil senada di Jakarta umumnya lebih mahal dibanding di kota Wilayah 1 karena tingkat risiko dan traffic density yang lebih tinggi." },
    { q: "Apakah premi bisa berubah?", a: "Ya. Premi dapat berubah saat perpanjangan polis mengikuti penyesuaian rate dari perusahaan asuransi, usia kendaraan yang bertambah, serta perubahan nilai pertanggungan. Selalu cek ulang setiap periode perpanjangan." },
    { q: "Apakah ada biaya tersembunyi?", a: "Tidak. Estimasi yang ditampilkan kalkulator sudah mencakup base rate, loading, dan perluasan yang Anda pilih. Biaya administrasi polis (jika ada) akan tertera transparan di quotation resmi sebelum Anda membayar." },
  ];

  const related = [
    { slug: "cara-menghitung-premi-asuransi-mobil", title: "Cara Menghitung Premi Asuransi Mobil dan Contoh Simulasinya" },
    { slug: "faktor-premi-asuransi-mobil", title: "7 Faktor yang Memengaruhi Premi Asuransi Mobil" },
    { slug: "perbedaan-all-risk-dan-tlo", title: "Asuransi Mobil All Risk vs TLO: Perbedaan, Kelebihan, dan Cara Memilih" },
  ];

  return (
    <ArticleShell
      initialSettings={initialSettings}
      initialHero={initialHero}
      title="Biaya Asuransi Mobil"
      updatedAt="Agustus 2026"
      coverImage="/biaya-asuransi-mobil.webp"
      faqs={faqs}
      relatedArticles={related}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
        Berapa Biaya Asuransi Mobil? Simulasi Berdasarkan Harga Kendaraan
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed mb-6">
        Pertanyaan paling umum soal asuransi mobil adalah <em className="text-[#0F172A]">“berapa sih sebenarnya biaya asuransi mobil saya?”</em>.
        Jawabannya: tidak ada satu harga mutlak. Biaya asuransi mobil bergantung pada kombinasi harga kendaraan,
        wilayah penggunaan, jenis perlindungan (All Risk/TLO), perluasan yang dipilih, usia kendaraan, dan partner
        asuransi. Di bawah ini Anda bisa melihat rentang estimasi umum per kelompok harga kendaraan.
      </p>

      <div className="rounded-xl bg-[#FEF3C7] border border-[#FDE68A] p-4 mb-6">
        <p className="text-sm font-semibold text-[#92400E] mb-1">Catatan Penting</p>
        <p className="text-xs text-[#475569]">
          Angka pada tabel di bawah adalah rentang estimasi ilustratif, bukan harga pasti. Untuk angka aktual sesuai
          kendaraan Anda, gunakan kalkulator di akhir halaman.
        </p>
      </div>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-3">Estimasi Biaya Berdasarkan Harga Kendaraan</h2>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0]">Nilai Kendaraan</th>
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0] border-l">Contoh Model</th>
              <th className="text-left p-2.5 font-semibold text-[#0F766E] border-b border-[#E2E8F0] border-l">Estimasi All Risk / thn</th>
              <th className="text-left p-2.5 font-semibold text-[#475569] border-b border-[#E2E8F0] border-l">Estimasi TLO / thn</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2.5 border-b border-[#E2E8F0] font-medium">Rp100 juta</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l">Daihatsu Ayla</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">± Rp1,5 – 2,5 jt</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">± Rp300 – 500 rb</td>
            </tr>
            <tr>
              <td className="p-2.5 border-b border-[#E2E8F0] font-medium">Rp200 juta</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l">Toyota Avanza</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">± Rp3 – 5 jt</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">± Rp500 – 900 rb</td>
            </tr>
            <tr>
              <td className="p-2.5 border-b border-[#E2E8F0] font-medium">Rp300 juta</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l">Honda HR-V</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">± Rp4,5 – 7,5 jt</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">± Rp750 rb – 1,3 jt</td>
            </tr>
            <tr>
              <td className="p-2.5 border-b border-[#E2E8F0] font-medium">Rp500 juta</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l">Toyota Innova</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">± Rp7,5 – 12 jt</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">± Rp1,2 – 2 jt</td>
            </tr>
            <tr>
              <td className="p-2.5 font-medium">&gt; Rp500 juta</td>
              <td className="p-2.5 border-l">Toyota Fortuner</td>
              <td className="p-2.5 border-l text-[#0F766E]">± Rp10 – 20 jt+</td>
              <td className="p-2.5 border-l text-[#475569]">± Rp1,7 – 3,5 jt+</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#64748B] mb-4">
        Rentang di atas menggunakan asumsi kendaraan baru (0–2 tahun), tanpa perluasan tambahan, dan dapat lebih
        tinggi bila ditambah Banjir, Gempa, SRCC, Terorisme, Bengkel Resmi, TPL, atau PA.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Wilayah dan Partner Memengaruhi Hasil</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">
        Premi bisa berbeda 10–30% hanya karena perbedaan wilayah dan partner. Mobil yang sama persis bisa lebih
        mahal di Jakarta (Wilayah 3) dibanding di Sumatera (Wilayah 1). Demikian pula, Sinarmas, ACA, Mega, Zurich,
        Tugu, Sahabat, Oona, dan MAG masing-masing menerapkan rate dan modifier sendiri — itulah mengapa kalkulator
        kami menampilkan 8 partner sekaligus.
      </p>
      <ul className="flex flex-col gap-2 mb-4">
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Wilayah 3 (Jakarta, Banten, Jabar) cenderung paling tinggi.</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Wilayah 2 (Jateng, Jatim, Bali, DIY) di tengah.</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Wilayah 1 (Sumatera, Kaltim, Sulawesi, dll) umumnya terendah.</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Setiap partner punya keunggulan: rate kompetitif, jaringan bengkel, atau syarat usia lebih longgar.</li>
      </ul>

      <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 mb-4">
        <p className="text-sm font-semibold text-[#115E59] mb-1">Coba Sekarang</p>
        <p className="text-xs text-[#475569]">
          Biaya pasti asuransi mobil Anda bergantung pada data spesifik kendaraan. Gunakan kalkulator di bawah
          halaman ini — masukkan merek, model, tahun, dan plat wilayah, lalu lihat estimasi dari 8 perusahaan
          asuransi dalam hitungan detik.
        </p>
      </div>
    </ArticleShell>
  );
}
