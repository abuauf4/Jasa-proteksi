import { Metadata } from "next";
import { getArticleSettings } from "@/lib/article-helpers";
import { ArticleShell } from "@/components/site/ArticleShell";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Perluasan Asuransi Mobil: Banjir, Gempa, Kerusuhan, dan Tanggung Jawab Pihak Ketiga",
  description:
    "Daftar lengkap perluasan asuransi mobil beserta rate: Banjir 0,1%, Gempa 0,15%, SRCC 0,05%, Terorisme 0,05%, Bengkel Resmi per partner, TPL, PA Driver, dan PA Penumpang.",
  alternates: { canonical: `${SITE_URL}/perluasan-asuransi-mobil` },
  openGraph: {
    title: "Perluasan Asuransi Mobil: Banjir, Gempa, Kerusuhan, dan TPL",
    description: "Daftar perluasan, rate, dan deskripsi manfaat untuk All Risk maupun TLO.",
    url: `${SITE_URL}/perluasan-asuransi-mobil`,
    type: "article",
    images: [{ url: "/perluasan-asuransi-mobil.webp", width: 1200, height: 630 }],
  },
};

export default async function Page() {
  const { initialSettings, initialHero } = await getArticleSettings();

  const faqs = [
    { q: "Apakah banjir wajib?", a: "Tidak wajib, namun sangat dianjurkan bagi Anda yang tinggal di daerah rawan banjir seperti Jakarta dan sekitarnya. Tanpa perluasan Banjir, kerusakan akibat air tidak akan diganti oleh polis dasar All Risk maupun TLO." },
    { q: "Berapa biaya TPL?", a: "TPL (Tanggung Jawab Pihak Ketiga) umumnya ditawarkan dalam beberapa paket nominal fixed, misalnya Rp25 juta, Rp50 juta, hingga Rp100 juta pertanggungan. Biaya preminya mengikuti paket yang dipilih, bukan persentase dari harga kendaraan." },
    { q: "Bisa klaim banjir tanpa perluasan?", a: "Tidak bisa. Klaim kerusakan akibat banjir memerlukan perluasan Banjir aktif di polis. Polis dasar All Risk tidak termasuk kerusakan akibat banjir, sehingga Anda akan menanggung sendiri biaya perbaikan jika tidak menambahkan perluasan ini." },
  ];

  const related = [
    { slug: "perbedaan-all-risk-dan-tlo", title: "Asuransi Mobil All Risk vs TLO: Perbedaan, Kelebihan, dan Cara Memilih" },
    { slug: "faktor-premi-asuransi-mobil", title: "7 Faktor yang Memengaruhi Premi Asuransi Mobil" },
    { slug: "cara-menghitung-premi-asuransi-mobil", title: "Cara Menghitung Premi Asuransi Mobil dan Contoh Simulasinya" },
  ];

  return (
    <ArticleShell
      initialSettings={initialSettings}
      initialHero={initialHero}
      title="Perluasan Asuransi Mobil"
      updatedAt="Agustus 2026"
      coverImage="/perluasan-asuransi-mobil.webp"
      faqs={faqs}
      relatedArticles={related}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
        Perluasan Asuransi Mobil: Banjir, Gempa, Kerusuhan, dan Tanggung Jawab Pihak Ketiga
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed mb-6">
        Polis dasar All Risk atau TLO menanggung kerusakan akibat kecelakaan dan kehilangan. Namun, beberapa peristiwa
        tertentu seperti banjir, gempa bumi, kerusuhan, atau tanggung jawab kepada pihak ketiga tidak termasuk dalam
        cakupan dasar. Untuk itu tersedia <strong className="text-[#0F172A]">perluasan jaminan</strong> yang bisa
        ditambahkan sesuai kebutuhan. Berikut daftar perluasan yang tersedia di engine Jasa Proteksi.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-3">Daftar Perluasan dan Rate</h2>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0]">Perluasan</th>
              <th className="text-left p-2.5 font-semibold text-[#0F766E] border-b border-[#E2E8F0] border-l">Rate</th>
              <th className="text-left p-2.5 font-semibold text-[#475569] border-b border-[#E2E8F0] border-l">Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2.5 border-b border-[#E2E8F0] font-medium">Banjir</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">0,1%</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Kerusakan akibat banjir dan air.</td>
            </tr>
            <tr>
              <td className="p-2.5 border-b border-[#E2E8F0] font-medium">Gempa Bumi</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">0,15%</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Kerusakan akibat gempa, tsunami, dan letusan gunung berapi.</td>
            </tr>
            <tr>
              <td className="p-2.5 border-b border-[#E2E8F0] font-medium">Kerusuhan / SRCC</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">0,05%</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Strike, Riot, and Civil Commotion — kerusuhan, pemogokan, dan huru-hara.</td>
            </tr>
            <tr>
              <td className="p-2.5 border-b border-[#E2E8F0] font-medium">Terorisme</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">0,05%</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Kerusakan akibat tindakan terorisme dan sabotase.</td>
            </tr>
            <tr>
              <td className="p-2.5 border-b border-[#E2E8F0] font-medium">Bengkel Resmi</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Per partner (lihat tabel)</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Klaim diperbaiki di bengkel resmi merek.</td>
            </tr>
            <tr>
              <td className="p-2.5 border-b border-[#E2E8F0] font-medium">TPL (Tanggung Jawab Pihak Ketiga)</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Fixed amount</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Penggantian kerugian pihak ketiga akibat kelalaian Anda.</td>
            </tr>
            <tr>
              <td className="p-2.5 border-b border-[#E2E8F0] font-medium">PA Driver</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">Fixed amount</td>
              <td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#475569]">Kecelakaan diri untuk pengemudi.</td>
            </tr>
            <tr>
              <td className="p-2.5 font-medium">PA Penumpang</td>
              <td className="p-2.5 border-l text-[#0F766E]">Fixed amount</td>
              <td className="p-2.5 border-l text-[#475569]">Kecelakaan diri untuk penumpang, per kursi.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#64748B] mb-4">
        Rate persentase dihitung dari harga kendaraan. TPL, PA Driver, dan PA Penumpang menggunakan nilai fixed sesuai paket yang dipilih.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-3">Rate Bengkel Resmi per Partner</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">
        Perluasan Bengkel Resmi memungkinkan klaim dikerjakan di bengkel resmi. Tidak semua partner menyediakan opsi ini,
        dan rate-nya berbeda antar partner:
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-[#E2E8F0] rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left p-2.5 font-semibold text-[#0F172A] border-b border-[#E2E8F0]">Partner</th>
              <th className="text-left p-2.5 font-semibold text-[#0F766E] border-b border-[#E2E8F0] border-l">Rate Bengkel Resmi</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Sinarmas</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">0,5%</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Mega Insurance</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">0,1%</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Oona</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">0,1%</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Sahabat</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">0,1%</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Zurich Syariah</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">0,15%</td></tr>
            <tr><td className="p-2.5 border-b border-[#E2E8F0]">Tugu</td><td className="p-2.5 border-b border-[#E2E8F0] border-l text-[#0F766E]">0,15%</td></tr>
            <tr><td className="p-2.5"><span className="text-[#475569]">ACA &amp; MAG</span></td><td className="p-2.5 border-l text-[#475569]">Tidak tersedia</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Tidak Semua Perluasan Wajib</h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Pilih perluasan sesuai kebutuhan dan profil risiko Anda. Misalnya, pemilik mobil di Jakarta sangat disarankan
        menambah Banjir, sedangkan TPL penting bagi Anda yang sering berkendara di area padat. Tidak ada perluasan
        yang diwajibkan — semua opsional.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">Batasan Bengkel Resmi</h2>
      <ul className="flex flex-col gap-2 mb-4">
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#B91C1C] mt-0.5">✕</span> Bengkel Resmi <strong className="text-[#0F172A]">tidak tersedia</strong> untuk produk TLO.</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#B91C1C] mt-0.5">✕</span> Bengkel Resmi <strong className="text-[#0F172A]">tidak tersedia</strong> bila usia kendaraan melebihi batas partner (<code className="text-xs bg-[#F1F5F9] px-1 py-0.5 rounded">bengkelResmiMaxYears</code>).</li>
        <li className="flex items-start gap-2 text-sm text-[#475569]"><span className="text-[#0F766E] mt-0.5">✓</span> Tersedia hanya untuk All Risk dan hanya dari partner yang mendukung.</li>
      </ul>

      <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 mb-4">
        <p className="text-sm font-semibold text-[#115E59] mb-1">Lihat Dampak Premi Langsung</p>
        <p className="text-xs text-[#475569]">
          Tambah atau hapus perluasan di kalkulator di bawah untuk melihat perubahan estimasi premi dari 8 perusahaan
          asuransi secara real-time.
        </p>
      </div>
    </ArticleShell>
  );
}
