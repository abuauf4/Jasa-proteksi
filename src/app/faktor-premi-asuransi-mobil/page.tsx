import { Metadata } from "next";
import { getArticleSettings } from "@/lib/article-helpers";
import { ArticleShell } from "@/components/site/ArticleShell";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "7 Faktor yang Memengaruhi Premi Asuransi Mobil",
  description:
    "Kenali 7 faktor utama yang menentukan premi asuransi mobil: harga OTR, tahun kendaraan, wilayah, jenis perlindungan, perluasan, partner asuransi, dan kategori kendaraan.",
  alternates: { canonical: `${SITE_URL}/faktor-premi-asuransi-mobil` },
  openGraph: {
    title: "7 Faktor yang Memengaruhi Premi Asuransi Mobil",
    description: "Faktor utama yang menentukan premi asuransi mobil beserta ringkasan tabel.",
    url: `${SITE_URL}/faktor-premi-asuransi-mobil`,
    type: "article",
  },
};

function FactorCTA() {
  return (
    <p className="text-xs text-[#0F766E] font-medium mt-2">
      → Hitung Sesuai Data Mobil Anda di kalkulator di bawah
    </p>
  );
}

export default async function Page() {
  const { initialSettings, initialHero } = await getArticleSettings();

  const faqs = [
    { q: "Apakah warna mobil mempengaruhi premi?", a: "Tidak. Warna kendaraan tidak menjadi salah satu variabel penentu premi di tabel rate. Yang berpengaruh adalah harga kendaraan, tahun, wilayah, jenis perlindungan, perluasan, partner, dan kategori kendaraan." },
    { q: "Apakah CC mesin berpengaruh?", a: "Tidak langsung. Premi dihitung berdasarkan harga dan kategori kendaraan, bukan dari kapasitas mesin. Namun mobil dengan CC besar umumnya juga bernilai lebih tinggi sehingga premi akhirnya ikut lebih tinggi." },
    { q: "Bisa nego premi?", a: "Rate dasar mengikuti tabel resmi partner asuransi sehingga tidak bisa dinegosiasikan. Namun Anda bisa menyesuaikan premi dengan memilih kombinasi jenis perlindungan, perluasan, dan partner yang paling sesuai budget lewat kalkulator kami." },
  ];

  const related = [
    { slug: "perbedaan-all-risk-dan-tlo", title: "Asuransi Mobil All Risk vs TLO: Perbedaan, Kelebihan, dan Cara Memilih" },
    { slug: "biaya-asuransi-mobil", title: "Berapa Biaya Asuransi Mobil? Simulasi Berdasarkan Harga Kendaraan" },
    { slug: "perluasan-asuransi-mobil", title: "Perluasan Asuransi Mobil: Banjir, Gempa, Kerusuhan, dan TPL" },
  ];

  return (
    <ArticleShell
      initialSettings={initialSettings}
      initialHero={initialHero}
      title="Faktor Premi Asuransi Mobil"
      updatedAt="Agustus 2026"
      faqs={faqs}
      relatedArticles={related}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
        7 Faktor yang Memengaruhi Premi Asuransi Mobil
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed mb-6">
        Premi asuransi mobil bukan ditentukan oleh satu faktor saja. Engine kalkulator Jasa Proteksi mempertimbangkan
        tujuh variabel utama yang dijelaskan di bawah ini. Memahami ketujuh faktor ini akan membantu Anda memilih
        kombinasi proteksi yang paling sesuai dengan kebutuhan dan budget.
      </p>

      <section className="mb-5">
        <h2 className="text-base font-bold text-[#0F172A] mb-1">1. Harga OTR Kendaraan</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          Harga OTR (On The Road) adalah nilai dasar pertanggungan. Engine memetakan nilai kendaraan ke 5 kategori
          harga (Kategori 1 ≤ Rp125 jt hingga Kategori 5 &gt; Rp800 jt). Kategori inilah yang menentukan baris rate
          dasar. Semakin tinggi harga mobil, semakin tinggi pula premi karena nilai ganti rugi yang berpotensi
          dikeluarkan insurer juga lebih besar.
        </p>
        <FactorCTA />
      </section>

      <section className="mb-5">
        <h2 className="text-base font-bold text-[#0F172A] mb-1">2. Tahun Kendaraan (Usia)</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          Usia kendaraan berdampak dua hal: kelayakan All Risk dan loading rate. Sebagian partner hanya menerima
          All Risk hingga usia tertentu (mis. MAG 3 tahun, Tugu/Sahabat/Oona 5 tahun, Sinarmas/ACA/Mega/Zurich 10
          tahun). Kendaraan yang lebih tua juga dapat dikenakan loading rate tambahan karena risiko kerusakan
          dianggap meningkat.
        </p>
        <FactorCTA />
      </section>

      <section className="mb-5">
        <h2 className="text-base font-bold text-[#0F172A] mb-1">3. Wilayah Penggunaan (Plat Nomor)</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          Plat nomor menentukan wilayah pertanggungan: Wilayah 1 (Sumatera, Kalimantan, Sulawesi, dll), Wilayah 2
          (Jateng, Jatim, Bali, DIY), atau Wilayah 3 (DKI Jakarta, Banten, Jabar). Rate All Risk di Wilayah 3 umumnya
          paling tinggi karena traffic density dan risiko kecelakaan/kerusuhan yang lebih besar.
        </p>
        <FactorCTA />
      </section>

      <section className="mb-5">
        <h2 className="text-base font-bold text-[#0F172A] mb-1">4. Jenis Perlindungan (All Risk / TLO)</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          All Risk (Comprehensive) menanggung kerusakan sebagian hingga total, sehingga preminya lebih tinggi.
          TLO (Total Loss Only) hanya menanggung kerugian total sehingga preminya jauh lebih terjangkau. Pilihan
          tergantung profil risiko dan budget Anda.
        </p>
        <FactorCTA />
      </section>

      <section className="mb-5">
        <h2 className="text-base font-bold text-[#0F172A] mb-1">5. Perluasan Jaminan</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          Perluasan menambah cakupan di luar proteksi dasar. Pilihan perluasan meliputi Banjir (0,1%), Gempa Bumi
          (0,15%), Kerusuhan/SRCC (0,05%), Terorisme (0,05%), Bengkel Resmi (rate per partner), TPL, serta PA
          Driver dan Penumpang. Semakin banyak perluasan, premi total semakin tinggi.
        </p>
        <FactorCTA />
      </section>

      <section className="mb-5">
        <h2 className="text-base font-bold text-[#0F172A] mb-1">6. Partner Asuransi (Modifier per Partner)</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          Setiap partner menerapkan modifier sendiri terhadap base rate. Itu sebabnya, untuk kendaraan yang sama,
          Sinarmas, ACA, Mega, Zurich Syariah, Tugu, Sahabat, Oona, dan MAG bisa memberikan total premi yang
          berbeda. Kalkulator kami menampilkan 8 partner sekaligus supaya Anda bisa memilih yang paling kompetitif.
        </p>
        <FactorCTA />
      </section>

      <section className="mb-5">
        <h2 className="text-base font-bold text-[#0F172A] mb-1">7. Kategori Kendaraan (Penumpang, Truk, Bus)</h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          Jenis penggunaan kendaraan juga menentukan rate. Mobil penumpang pribadi mendapat rate standar, sementara
          kendaraan komersial seperti truk atau bus memiliki profil risiko berbeda dan dikenakan rate tersendiri.
          Pastikan Anda mengisi kategori yang benar saat menghitung premi.
        </p>
        <FactorCTA />
      </section>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-3">Ringkasan Faktor</h2>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0]">Faktor</th>
              <th className="text-left p-2.5 font-semibold text-[#0F766E] border-b border-[#E2E8F0] border-l">Dampak ke Premi</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">Harga OTR</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Semakin tinggi → premi naik</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">Tahun kendaraan</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Lebih tua → loading, batas All Risk</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">Wilayah plat</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Wilayah 3 paling tinggi</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">All Risk / TLO</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">All Risk &gt; TLO</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">Perluasan</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Tambah cakupan → premi naik</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">Partner</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Modifier berbeda per partner</td></tr>
            <tr><td className="p-2.5 font-medium">Kategori kendaraan</td><td className="p-2.5 border-l text-[#0F766E]">Komersial &gt; pribadi</td></tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 mb-4">
        <p className="text-sm font-semibold text-[#115E59] mb-1">Sudah Siap Menghitung?</p>
        <p className="text-xs text-[#475569]">
          Masukkan data kendaraan Anda di kalkulator di bawah untuk melihat bagaimana ketujuh faktor di atas
          bekerja sama menghasilkan estimasi premi dari 8 perusahaan asuransi.
        </p>
      </div>
    </ArticleShell>
  );
}
