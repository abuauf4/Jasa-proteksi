import { Metadata } from "next";
import { getArticleSettings } from "@/lib/article-helpers";
import { ArticleShell } from "@/components/site/ArticleShell";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Asuransi Mobil All Risk vs TLO: Perbedaan, Kelebihan, dan Cara Memilih",
  description:
    "Pahami perbedaan asuransi mobil All Risk dan TLO, cakupan manfaat, perbedaan premi, dan kapan sebaiknya memilih masing-masing. Simulasi premi otomatis.",
  alternates: { canonical: `${SITE_URL}/perbedaan-all-risk-dan-tlo` },
  openGraph: {
    title: "Asuransi Mobil All Risk vs TLO: Perbedaan, Kelebihan, dan Cara Memilih",
    description: "Pahami perbedaan All Risk dan TLO, cakupan, premi, dan cara memilih.",
    url: `${SITE_URL}/perbedaan-all-risk-dan-tlo`,
    type: "article",
    images: [{ url: "/allrisk-vs-tlo.webp", width: 1200, height: 630 }],
  },
};

export default async function Page() {
  const { initialSettings, initialHero } = await getArticleSettings();

  const faqs = [
    { q: "All Risk lebih mahal dari TLO?", a: "Umumnya ya, karena cakupan All Risk lebih luas. Namun selisih premi bergantung pada nilai kendaraan, wilayah, dan perluasan yang dipilih. Gunakan kalkulator untuk membandingkan langsung." },
    { q: "Bisa pindah dari TLO ke All Risk?", a: "Bisa, saat perpanjangan polis. Pembatalan di tengah masa pertanggungan dapat dikenakan biaya sesuai ketentuan partner asuransi." },
    { q: "Mobil bekas bisa pakai All Risk?", a: "Tergantung batas usia kendaraan yang ditetapkan perusahaan asuransi. Beberapa partner menerima All Risk hingga usia 10 tahun. Cek via kalkulator dengan tahun kendaraan Anda." },
  ];

  const related = [
    { slug: "faktor-premi-asuransi-mobil", title: "7 Faktor yang Memengaruhi Premi Asuransi Mobil" },
    { slug: "biaya-asuransi-mobil", title: "Berapa Biaya Asuransi Mobil?" },
    { slug: "cara-menghitung-premi-asuransi-mobil", title: "Cara Menghitung Premi Asuransi Mobil" },
  ];

  return (
    <ArticleShell
      initialSettings={initialSettings}
      initialHero={initialHero}
      title="All Risk vs TLO"
      updatedAt="Agustus 2026"
      coverImage="/allrisk-vs-tlo.webp"
      faqs={faqs}
      relatedArticles={related}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
        Asuransi Mobil All Risk vs TLO: Perbedaan, Kelebihan, dan Cara Memilih
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed mb-6">
        All Risk (Comprehensive) memberikan perlindungan terhadap kerusakan sebagian hingga kerusakan berat.
        TLO (Total Loss Only) memberikan perlindungan atas kehilangan atau kerusakan yang memenuhi kriteria total loss.
        Pilihan tergantung pada usia kendaraan, budget, dan tingkat risiko yang ingin Anda tanggung sendiri.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Apa itu All Risk?</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        All Risk atau Comprehensive adalah jenis perlindungan yang menanggung kerusakan sebagian hingga kerusakan berat pada kendaraan Anda. Jika mobil lecet, penyok, atau mengalami kerusakan parah akibat kecelakaan, asuransi All Risk dapat mengganti biaya perbaikan sesuai manfaat dan ketentuan polis.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Apa itu TLO?</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        TLO atau Total Loss Only memberikan ganti rugi ketika kendaraan mengalami kerugian total — yaitu hilang dicuri atau rusak dengan biaya perbaikan yang melebihi persentase tertentu dari nilai kendaraan (biasanya 75%). Untuk kerusakan ringan atau sebagian, TLO tidak memberikan penggantian.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-3">Perbandingan Cakupan</h2>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left p-3 font-semibold text-[#0F172A] border-b border-[#E2E8F0]">Aspek</th>
              <th className="text-left p-3 font-semibold text-[#0F766E] border-b border-[#E2E8F0] border-l border-[#E2E8F0]">All Risk</th>
              <th className="text-left p-3 font-semibold text-[#475569] border-b border-[#E2E8F0] border-l border-[#E2E8F0]">TLO</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-3 border-b border-[#E2E8F0] font-medium">Kerusakan ringan</td><td className="p-3 border-b border-[#E2E8F0] border-l border-[#E2E8F0] text-[#0F766E]">Ditanggung</td><td className="p-3 border-b border-[#E2E8F0] border-l border-[#E2E8F0] text-[#B91C1C]">Tidak</td></tr>
            <tr><td className="p-3 border-b border-[#E2E8F0] font-medium">Kerusakan berat</td><td className="p-3 border-b border-[#E2E8F0] border-l border-[#E2E8F0] text-[#0F766E]">Ditanggung</td><td className="p-3 border-b border-[#E2E8F0] border-l border-[#E2E8F0] text-[#0F766E]">Ditanggung (jika total loss)</td></tr>
            <tr><td className="p-3 border-b border-[#E2E8F0] font-medium">Hilang dicuri</td><td className="p-3 border-b border-[#E2E8F0] border-l border-[#E2E8F0] text-[#0F766E]">Ditanggung</td><td className="p-3 border-b border-[#E2E8F0] border-l border-[#E2E8F0] text-[#0F766E]">Ditanggung</td></tr>
            <tr><td className="p-3 border-b border-[#E2E8F0] font-medium">Premi</td><td className="p-3 border-b border-[#E2E8F0] border-l border-[#E2E8F0]">Lebih tinggi</td><td className="p-3 border-b border-[#E2E8F0] border-l border-[#E2E8F0]">Lebih terjangkau</td></tr>
            <tr><td className="p-3 font-medium">Batas usia kendaraan</td><td className="p-3 border-l border-[#E2E8F0]">Sesuai ketentuan partner</td><td className="p-3 border-l border-[#E2E8F0]">Sesuai ketentuan partner</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Kapan Memilih All Risk?</h2>
      <ul className="flex flex-col gap-2 mb-4">
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Mobil baru atau masih dalam masa garansi</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Kendaraan rutin digunakan setiap hari</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Ingin ketenangan pikiran untuk kerusakan apa pun</li>
      </ul>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Kapan Memilih TLO?</h2>
      <ul className="flex flex-col gap-2 mb-4">
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Budget terbatas tapi tetap ingin proteksi risiko besar</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Mobil usia di atas batas All Risk partner</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Kendaraan jarang dipakai</li>
      </ul>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Batas Usia Kendaraan per Partner</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">
        Setiap perusahaan asuransi memiliki batas usia kendaraan yang berbeda untuk All Risk. Berikut data dari partner yang tersedia di Jasa Proteksi:
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0]">Partner</th>
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0] border-l">Batas All Risk</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Sinarmas</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">10 tahun</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">ACA</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">10 tahun</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Mega Insurance</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">10 tahun</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Zurich Syariah</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">10 tahun</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Tugu</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">5 tahun</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Sahabat</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">5 tahun</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Oona</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">5 tahun</td></tr>
            <tr><td className="p-2.5">MAG (Multi Artha Guna)</td><td className="p-2.5 border-l">3 tahun</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#64748B] mb-4">
        Catatan: Batas usia dapat berubah. Verifikasi terbaru via kalkulator dengan tahun kendaraan Anda.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Perbedaan Premi</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Premi All Risk umumnya lebih tinggi karena cakupan yang lebih luas. TLO lebih terjangkau karena hanya menanggung kerugian total. Selisih premi bisa bervariasi tergantung nilai kendaraan, wilayah, dan partner.
        Gunakan kalkulator di bawah untuk membandingkan estimasi premi All Risk dan TLO untuk kendaraan Anda secara langsung.
      </p>

      <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 mb-4">
        <p className="text-sm font-semibold text-[#115E59] mb-1">Coba Sekarang</p>
        <p className="text-xs text-[#475569]">
          Kalkulator di bawah halaman ini memungkinkan Anda beralih antara All Risk dan TLO
          untuk melihat perbedaan estimasi premi dari 8 perusahaan asuransi secara otomatis.
        </p>
      </div>
    </ArticleShell>
  );
}
