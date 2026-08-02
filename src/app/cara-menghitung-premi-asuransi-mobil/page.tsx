import { Metadata } from "next";
import { getArticleSettings } from "@/lib/article-helpers";
import { ArticleShell } from "@/components/site/ArticleShell";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Cara Menghitung Premi Asuransi Mobil dan Contoh Simulasinya",
  description:
    "Pelajari cara menghitung premi asuransi mobil: faktor harga kendaraan, kategori, wilayah, usia, perluasan, hingga modifier per partner. Disertai contoh simulasi TOYOTA 86 di Jakarta.",
  alternates: { canonical: `${SITE_URL}/cara-menghitung-premi-asuransi-mobil` },
  openGraph: {
    title: "Cara Menghitung Premi Asuransi Mobil dan Contoh Simulasinya",
    description: "Faktor, rumus engine, kategori harga, rate wilayah, dan contoh simulasi premi mobil.",
    url: `${SITE_URL}/cara-menghitung-premi-asuransi-mobil`,
    type: "article",
    images: [{ url: "/cara-menghitung-premi-asuransi-mobil.webp", width: 1200, height: 630 }],
  },
};

export default async function Page() {
  const { initialSettings, initialHero } = await getArticleSettings();

  const faqs = [
    { q: "Apakah perhitungan engine akurat?", a: "Engine menghitung berdasarkan tabel rate resmi yang sama digunakan oleh partner asuransi kami. Hasilnya adalah estimasi yang sangat dekat dengan quotation final, namun tetap perlu dikonfirmasi via quotation resmi karena bisa terdapat kebijakan underwriting atau promo tertentu." },
    { q: "Kenapa premi berbeda per partner?", a: "Setiap perusahaan asuransi menetapkan base rate dan modifier sendiri. Selain itu, beban loading untuk usia kendaraan serta rate perluasan seperti Bengkel Resmi juga berbeda antar partner. Itulah sebabnya kalkulator kami menampilkan 8 partner sekaligus untuk Anda bandingkan." },
    { q: "Apakah perluasan wajib?", a: "Tidak. Perluasan bersifat opsional. Anda bisa memilih hanya perlindungan dasar (All Risk atau TLO) atau menambah perluasan seperti Banjir, Gempa, SRCC, Terorisme, Bengkel Resmi, TPL, dan PA sesuai kebutuhan dan budget." },
  ];

  const related = [
    { slug: "perbedaan-all-risk-dan-tlo", title: "Asuransi Mobil All Risk vs TLO: Perbedaan, Kelebihan, dan Cara Memilih" },
    { slug: "biaya-asuransi-mobil", title: "Berapa Biaya Asuransi Mobil? Simulasi Berdasarkan Harga Kendaraan" },
    { slug: "faktor-premi-asuransi-mobil", title: "7 Faktor yang Memengaruhi Premi Asuransi Mobil" },
  ];

  return (
    <ArticleShell
      initialSettings={initialSettings}
      initialHero={initialHero}
      title="Cara Menghitung Premi"
      updatedAt="Agustus 2026"
      coverImage="/cara-menghitung-premi-asuransi-mobil.webp"
      faqs={faqs}
      relatedArticles={related}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
        Cara Menghitung Premi Asuransi Mobil dan Contoh Simulasinya
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed mb-6">
        Premi asuransi mobil bukan angka tunggal yang diambil sembarang. Engine kalkulator Jasa Proteksi menghitungnya
        dari kombinasi harga kendaraan, kategori kendaraan, wilayah penggunaan, jenis perlindungan, usia kendaraan,
        perluasan yang dipilih, serta modifier per partner asuransi. Artikel ini menjelaskan cara kerja engine
        secara transparan disertai contoh simulasi nyata.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Faktor yang Digunakan Engine</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">
        Saat Anda memasukkan data mobil di kalkulator, engine mengambil lima input utama berikut:
      </p>
      <ul className="flex flex-col gap-2 mb-4">
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> <span><strong className="text-[#0F172A]">Harga kendaraan</strong> — menentukan kategori harga (cat1–cat5) yang memilih baris rate dasar.</span></li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> <span><strong className="text-[#0F172A]">Wilayah penggunaan</strong> — diturunkan dari plat nomor, memilih rate Wilayah 1, 2, atau 3.</span></li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> <span><strong className="text-[#0F172A]">Jenis perlindungan</strong> — All Risk (comprehensive) atau TLO (Total Loss Only).</span></li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> <span><strong className="text-[#0F172A]">Usia kendaraan</strong> — menentukan loading rate tambahan dan kelayakan All Risk.</span></li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> <span><strong className="text-[#0F172A]">Perluasan jaminan</strong> — Banjir, Gempa, SRCC, Terorisme, Bengkel Resmi, TPL, PA Driver & Penumpang.</span></li>
      </ul>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Cara Engine Menghitung</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">
        Secara ringkas, langkah perhitungan engine adalah:
      </p>
      <ol className="flex flex-col gap-2 mb-4 list-decimal list-inside text-sm text-[#475569]">
        <li><strong className="text-[#0F172A]">Base rate</strong> diambil dari tabel rate sesuai kategori harga kendaraan × wilayah × jenis perlindungan (All Risk atau TLO).</li>
        <li><strong className="text-[#0F172A]">Loading rate</strong> untuk usia kendaraan ditambahkan bila kendaraan sudah berusia di atas ambang tertentu (misalnya &gt; 5 tahun).</li>
        <li><strong className="text-[#0F172A]">Addon rates</strong> untuk setiap perluasan yang dipilih, dihitung berdasarkan persentase dari harga kendaraan (mis. Banjir 0,1%, Gempa 0,15%) atau jumlah fixed (TPL, PA).</li>
        <li><strong className="text-[#0F172A]">Partner modifier</strong> diterapkan — setiap partner asuransi punya bobot sendiri sehingga total premi bisa berbeda antar partner meski input sama.</li>
        <li>Total premi = (base rate + loading + addon) × modifier partner, kemudian dibulatkan sesuai ketentuan.</li>
      </ol>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-3">Kategori Kendaraan Berdasarkan Harga</h2>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0]">Kategori</th>
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0] border-l">Rentang Harga Kendaraan</th>
              <th className="text-left p-2.5 font-semibold text-[#0F766E] border-b border-[#E2E8F0] border-l">Contoh Model</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">Kategori 1</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">≤ Rp125 juta</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Daihatsu Ayla, Datsun Go</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">Kategori 2</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">≤ Rp200 juta</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Toyota Avanza, Honda Brio</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">Kategori 3</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">≤ Rp400 juta</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Honda HR-V, Toyota Yaris</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">Kategori 4</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">≤ Rp800 juta</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Toyota Innova, Mitsubishi Pajero</td></tr>
            <tr><td className="p-2.5 font-medium">Kategori 5</td><td className="p-2.5 border-l">&gt; Rp800 juta</td><td className="p-2.5 border-l text-[#0F766E]">Toyota Fortuner, BMW, Mercedes</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-3">Tabel Rate Wilayah</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">
        Wilayah ditentukan dari plat nomor kendaraan. Rate All Risk untuk Wilayah 1 umumnya lebih rendah dibanding Wilayah 2 dan 3 karena profil risiko yang berbeda.
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0]">Wilayah</th>
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0] border-l">Cakupan</th>
              <th className="text-left p-2.5 font-semibold text-[#0F766E] border-b border-[#E2E8F0] border-l">Indikasi Rate All Risk</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">Wilayah 1</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">Sumatera, Kalimantan, Sulawesi, dll</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Terendah</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0] font-medium">Wilayah 2</td><td className="p-2.5 border-b border-[#E2E8F0] border-l">Jawa Tengah, Jawa Timur, Bali, Yogyakarta</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Menengah</td></tr>
            <tr><td className="p-2.5 font-medium">Wilayah 3</td><td className="p-2.5 border-l">DKI Jakarta, Banten, Jawa Barat</td><td className="p-2.5 border-l text-[#0F766E]">Tertinggi</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#64748B] mb-4">
        Rate spesifik per kategori dan per partner dikelola di tabel resmi engine. Lihat hasil kalkulator untuk angka aktual sesuai kendaraan Anda.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Contoh Simulasi: TOYOTA 86 2024 di Jakarta</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">
        Untuk memberi gambaran, berikut simulasi perhitungan untuk kendaraan dengan spesifikasi:
      </p>
      <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 mb-4">
        <ul className="flex flex-col gap-1 text-sm text-[#0F172A]">
          <li><strong className="text-[#0F766E]">Mobil:</strong> TOYOTA 86</li>
          <li><strong className="text-[#0F766E]">Tahun:</strong> 2024</li>
          <li><strong className="text-[#0F766E]">Wilayah:</strong> Jakarta (Wilayah 3)</li>
          <li><strong className="text-[#0F766E]">Nilai kendaraan:</strong> ± Rp725 juta (Kategori 4)</li>
          <li><strong className="text-[#0F766E]">Jenis perlindungan:</strong> All Risk</li>
        </ul>
      </div>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">Engine akan menghitung bertahap:</p>
      <ol className="flex flex-col gap-2 mb-4 list-decimal list-inside text-sm text-[#475569]">
        <li><strong className="text-[#0F172A]">Premi dasar</strong> — base rate Kategori 4 × Wilayah 3 untuk All Risk.</li>
        <li><strong className="text-[#0F172A]">Loading</strong> — karena tahun 2024 masih relatif baru, loading usia minimum atau nol.</li>
        <li><strong className="text-[#0F766E]">Perluasan (opsional)</strong> — misalnya Banjir 0,1% × Rp725jt = ± Rp725.000, atau Bengkel Resmi sesuai partner yang dipilih.</li>
        <li><strong className="text-[#0F766E]">Modifier partner</strong> — total premi bisa berbeda antara Sinarmas, ACA, Mega, Zurich, Tugu, Sahabat, Oona, dan MAG.</li>
      </ol>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Coba langsung di kalkulator di bawah — pilih Toyota sebagai merek, model 86, tahun 2024, dan wilayah Jakarta untuk melihat estimasi dari 8 partner sekaligus.
      </p>

      <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 mb-4">
        <p className="text-sm font-semibold text-[#115E59] mb-1">Disclaimer</p>
        <p className="text-xs text-[#475569]">
          Seluruh angka di kalkulator adalah estimasi berdasarkan tabel rate internal. Hasil akhir tetap mengikuti
          quotation resmi dari partner asuransi yang diterbitkan bersamaan dengan polis.
        </p>
      </div>
    </ArticleShell>
  );
}
