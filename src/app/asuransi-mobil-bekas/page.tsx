import { Metadata } from "next";
import { getArticleSettings } from "@/lib/article-helpers";
import { ArticleShell } from "@/components/site/ArticleShell";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Asuransi Mobil Bekas: Syarat, Batas Usia, dan Pilihan Proteksi",
  description:
    "Panduan asuransi mobil bekas: batas usia All Risk per partner (Sinarmas, ACA, Mega, Zurich, Tugu, Sahabat, Oona, MAG), opsi TLO, ketersediaan bengkel resmi, dan tips sebelum mengajukan.",
  alternates: { canonical: `${SITE_URL}/asuransi-mobil-bekas` },
  openGraph: {
    title: "Asuransi Mobil Bekas: Syarat, Batas Usia, dan Pilihan Proteksi",
    description: "Batas usia All Risk per partner, opsi TLO, bengkel resmi, dan tips asuransi mobil bekas.",
    url: `${SITE_URL}/asuransi-mobil-bekas`,
    type: "article",
    images: [{ url: "/asuransi-mobil-bekas.webp", width: 1200, height: 630 }],
  },
};

export default async function Page() {
  const { initialSettings, initialHero } = await getArticleSettings();

  const faqs = [
    { q: "Mobil 15 tahun bisa diasuransikan?", a: "Untuk All Risk, mobil berusia 15 tahun sudah melebihi batas maksimal seluruh partner kami (tertinggi 10 tahun). Namun Anda masih bisa mengambil perlindungan TLO yang umumnya menerima kendaraan dengan usia lebih panjang. Cek via kalkulator dengan tahun kendaraan Anda." },
    { q: "Apakah perlu survey kendaraan?", a: "Untuk kendaraan berusia lanjut atau bernilai tinggi, partner asuransi dapat meminta survey kondisi kendaraan sebelum menerbitkan polis. Hal ini untuk memastikan kondisi aktual kendaraan sesuai dengan nilai pertanggungan." },
    { q: "Berapa batas maksimal All Risk?", a: "Batas tertinggi All Risk di antara partner Jasa Proteksi adalah 10 tahun (Sinarmas, ACA, Mega, Zurich Syariah). Tugu, Sahabat, dan Oona menerima hingga 5 tahun, sedangkan MAG paling ketat di 3 tahun. Bila usia mobil melebihi batas, opsi yang tersedia adalah TLO." },
  ];

  const related = [
    { slug: "perbedaan-all-risk-dan-tlo", title: "Asuransi Mobil All Risk vs TLO: Perbedaan, Kelebihan, dan Cara Memilih" },
    { slug: "faktor-premi-asuransi-mobil", title: "7 Faktor yang Memengaruhi Premi Asuransi Mobil" },
    { slug: "perluasan-asuransi-mobil", title: "Perluasan Asuransi Mobil: Banjir, Gempa, Kerusuhan, dan TPL" },
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
        Asuransi Mobil Bekas: Syarat, Batas Usia, dan Pilihan Proteksi
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed mb-6">
        Banyak pemilik mobil bekas bertanya apakah kendaraannya masih bisa diasuransikan. Jawabannya: <strong className="text-[#0F172A]">bisa</strong>,
        dengan batasan tertentu. Setiap perusahaan asuransi menetapkan batas usia kendaraan untuk produk All Risk.
        Jika mobil terlalu tua untuk All Risk, produk TLO biasanya masih tersedia sebagai alternatif perlindungan.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-3">Batas Usia All Risk per Partner</h2>
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

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Jika Mobil Terlalu Tua untuk All Risk</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Bila usia kendaraan melebihi batas All Risk partner, produk <strong className="text-[#0F172A]">TLO (Total Loss Only)</strong> biasanya masih tersedia.
        TLO memberikan ganti rugi saat kendaraan hilang dicuri atau mengalami kerugian total. Meski tidak menanggung
        kerusakan sebagian, TLO tetap memberi perlindungan terhadap risiko terbesar dengan premi yang jauh lebih terjangkau.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Bengkel Resmi pada Mobil Bekas</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Perluasan Bengkel Resmi memungkinkan perbaikan klaim di bengkel resmi merek. Ketersediaannya bergantung
        pada partner dan usia kendaraan — masing-masing partner menetapkan batas usia maksimal (<code className="text-xs bg-[#F1F5F9] px-1 py-0.5 rounded">bengkelResmiMaxYears</code>).
        Bengkel Resmi tidak tersedia untuk produk TLO dan tidak dapat dipilih bila usia kendaraan sudah melebihi batas partner.
        Untuk mobil bekas yang mendekati ambang batas, segera pertimbangkan perluasan ini sebelum terlambat.
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
          Masukkan tahun mobil di kalkulator di bawah — engine otomatis menampilkan partner mana saja yang masih
          menerima All Risk, beserta estimasi preminya.
        </p>
      </div>
    </ArticleShell>
  );
}
