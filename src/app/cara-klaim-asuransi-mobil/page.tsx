import { Metadata } from "next";
import { getArticleSettings } from "@/lib/article-helpers";
import { ArticleShell } from "@/components/site/ArticleShell";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Cara Klaim Asuransi Mobil: Alur, Dokumen, dan Bantuan",
  description:
    "Panduan cara klaim asuransi mobil: langkah umum setelah kejadian, dokumen yang biasanya perlu disiapkan, perbedaan klaim sesuai perlindungan, dan bantuan Jasa Proteksi.",
  alternates: { canonical: `${SITE_URL}/cara-klaim-asuransi-mobil` },
  openGraph: {
    title: "Cara Klaim Asuransi Mobil: Alur, Dokumen, dan Bantuan",
    description:
      "Pahami alur umum klaim asuransi mobil dan hal yang perlu disiapkan sebelum menghubungi perusahaan asuransi.",
    url: `${SITE_URL}/cara-klaim-asuransi-mobil`,
    type: "article",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
};

export default async function Page() {
  const { initialSettings, initialHero } = await getArticleSettings();

  const faqs = [
    {
      q: "Apakah Jasa Proteksi yang menyetujui klaim?",
      a: "Tidak. Keputusan klaim, manfaat yang diberikan, dan proses penyelesaian mengikuti ketentuan polis serta verifikasi perusahaan asuransi penerbit. Jasa Proteksi membantu pengguna memahami alur dan berkomunikasi dalam proses pengajuan klaim.",
    },
    {
      q: "Apakah dokumen klaim selalu sama?",
      a: "Tidak selalu. Dokumen yang diminta dapat berbeda berdasarkan jenis kejadian, jenis perlindungan, partner asuransi, dan ketentuan polis. Siapkan data kendaraan, informasi polis, kronologi, serta bukti kejadian yang relevan, lalu ikuti permintaan dokumen dari perusahaan asuransi.",
    },
    {
      q: "Apa beda klaim cashless dan reimbursement?",
      a: "Pada skema cashless, perbaikan dapat diproses melalui jaringan bengkel sesuai ketentuan partner. Pada reimbursement, biaya tertentu dapat dibayar lebih dahulu lalu diajukan penggantian sesuai ketentuan polis. Ketersediaan metode bergantung pada produk dan perusahaan asuransi.",
    },
  ];

  const related = [
    { slug: "perbedaan-all-risk-dan-tlo", title: "Asuransi Mobil All Risk vs TLO" },
    { slug: "perluasan-asuransi-mobil", title: "Perluasan Asuransi Mobil" },
    { slug: "asuransi-mobil-banjir", title: "Asuransi Mobil Banjir" },
  ];

  return (
    <ArticleShell
      initialSettings={initialSettings}
      initialHero={initialHero}
      title="Cara Klaim Asuransi Mobil"
      description="Panduan umum proses klaim asuransi mobil dan hal yang perlu disiapkan."
      updatedAt="September 2026"
      faqs={faqs}
      relatedArticles={related}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
        Cara Klaim Asuransi Mobil: Alur, Dokumen, dan Bantuan
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed mb-6">
        Ketika kendaraan mengalami kerusakan atau kehilangan, proses klaim dimulai dengan memastikan
        bahwa kejadian tersebut termasuk dalam perlindungan polis Anda. All Risk, TLO, dan perluasan
        jaminan memiliki cakupan yang berbeda. Karena itu, langkah pertama bukan langsung memperbaiki
        kendaraan, melainkan memahami perlindungan yang aktif dan mengikuti alur dari perusahaan asuransi.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Alur Umum Klaim Asuransi Mobil
      </h2>
      <ol className="flex flex-col gap-3 mb-5">
        {[
          ["Laporkan kejadian", "Hubungi pihak yang membantu proses polis atau perusahaan asuransi sesegera mungkin setelah kejadian."],
          ["Jelaskan kronologi", "Sampaikan apa yang terjadi, lokasi, waktu, kondisi kendaraan, dan jenis kerusakan atau kehilangan."],
          ["Siapkan dokumen dan bukti", "Dokumen yang diminta dapat berbeda. Ikuti daftar yang diberikan perusahaan asuransi untuk kasus Anda."],
          ["Verifikasi atau survei bila diperlukan", "Perusahaan asuransi dapat melakukan pemeriksaan sebelum memberikan persetujuan perbaikan atau penyelesaian klaim."],
          ["Perbaikan atau penyelesaian", "Tahap akhir mengikuti manfaat polis, jaringan bengkel, metode klaim, dan keputusan perusahaan asuransi."],
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
        Apa yang Sebaiknya Disiapkan?
      </h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-3">
        Persyaratan final mengikuti partner asuransi dan jenis kejadian. Secara umum, informasi berikut
        membantu mempercepat proses komunikasi:
      </p>
      <ul className="flex flex-col gap-2 mb-5">
        <li className="text-sm text-[#475569]">• Informasi polis dan jenis perlindungan yang aktif.</li>
        <li className="text-sm text-[#475569]">• Data kendaraan dan identitas pemilik bila diminta.</li>
        <li className="text-sm text-[#475569]">• Kronologi kejadian yang jelas dan konsisten.</li>
        <li className="text-sm text-[#475569]">• Foto atau bukti kondisi kendaraan bila relevan.</li>
        <li className="text-sm text-[#475569]">• Dokumen tambahan sesuai jenis kejadian dan permintaan perusahaan asuransi.</li>
      </ul>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Klaim Harus Sesuai Jenis Perlindungan
      </h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        All Risk memberikan cakupan kerusakan yang lebih luas dibanding TLO, sedangkan TLO fokus pada
        kehilangan atau kerusakan yang memenuhi kriteria total loss sesuai polis. Risiko tertentu seperti
        banjir, gempa, kerusuhan, atau tanggung jawab pihak ketiga bergantung pada perluasan yang aktif.
        Jadi dua kendaraan dengan kejadian serupa belum tentu memiliki hasil klaim yang sama bila pilihan
        perlindungannya berbeda.
      </p>

      <h2 className="text-lg font-bold text-[#0F172A] mt-6 mb-2">
        Jangan Mengandalkan Estimasi Premi untuk Menentukan Manfaat Klaim
      </h2>
      <p className="text-sm text-[#475569] leading-relaxed mb-4">
        Kalkulator Jasa Proteksi digunakan untuk melihat estimasi premi berdasarkan data kendaraan,
        wilayah, jenis perlindungan, dan perluasan yang dipilih. Hasil simulasi bukan dokumen polis dan
        bukan keputusan klaim. Manfaat aktual selalu mengikuti quotation final, polis yang diterbitkan,
        dan hasil verifikasi perusahaan asuransi.
      </p>

      <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 mb-4">
        <p className="text-sm font-semibold text-[#115E59] mb-1">Butuh Bantuan Memahami Proses?</p>
        <p className="text-xs text-[#475569] leading-relaxed">
          Jasa Proteksi menyediakan bantuan setelah polis terbit, termasuk membantu pengguna memahami
          alur ketika terjadi klaim. Keputusan dan penyelesaian klaim tetap berada pada perusahaan
          asuransi penerbit polis sesuai ketentuan yang berlaku pada polis tersebut.
        </p>
      </div>
    </ArticleShell>
  );
}
