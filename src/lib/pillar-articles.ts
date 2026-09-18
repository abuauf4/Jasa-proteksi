/**
 * Pillar Articles Registry
 *
 * Static metadata for SEO article pages that exist as
 * dedicated route pages (not CMS/database records).
 * Used on the /artikel listing page and homepage article section
 * so these articles always appear even when the database is empty.
 */

export interface PillarArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  href: string;
  category: string;
  publishedAt: string;
  coverImage: string | null;
}

export const PILLAR_ARTICLES: PillarArticle[] = [
  {
    id: "pillar-perbedaan-all-risk-dan-tlo",
    slug: "perbedaan-all-risk-dan-tlo",
    title: "Asuransi Mobil All Risk vs TLO: Perbedaan, Kelebihan, dan Cara Memilih",
    excerpt:
      "Pahami perbedaan asuransi mobil All Risk dan TLO, cakupan manfaat, perbedaan premi, dan kapan sebaiknya memilih masing-masing. Simulasi premi otomatis.",
    href: "/perbedaan-all-risk-dan-tlo",
    category: "Panduan",
    publishedAt: "2025-01-15",
    coverImage: "/allrisk-vs-tlo.webp",
  },
  {
    id: "pillar-cara-menghitung-premi-asuransi-mobil",
    slug: "cara-menghitung-premi-asuransi-mobil",
    title: "Cara Menghitung Premi Asuransi Mobil dan Contoh Simulasinya",
    excerpt:
      "Pelajari cara menghitung premi asuransi mobil: faktor harga kendaraan, kategori, wilayah, usia, perluasan, hingga modifier per partner. Disertai contoh simulasi TOYOTA 86 di Jakarta.",
    href: "/cara-menghitung-premi-asuransi-mobil",
    category: "Panduan",
    publishedAt: "2025-01-20",
    coverImage: "/cara-menghitung-premi-asuransi-mobil.webp",
  },
  {
    id: "pillar-biaya-asuransi-mobil",
    slug: "biaya-asuransi-mobil",
    title: "Berapa Biaya Asuransi Mobil? Simulasi Berdasarkan Harga Kendaraan",
    excerpt:
      "Estimasi biaya asuransi mobil berdasarkan rentang harga kendaraan: Rp100 jt, Rp200 jt, Rp300 jt, Rp500 jt, dan di atas Rp500 jt. Lihat rentang All Risk dan TLO dari 8 partner.",
    href: "/biaya-asuransi-mobil",
    category: "Panduan",
    publishedAt: "2025-02-01",
    coverImage: "/biaya-asuransi-mobil.webp",
  },
  {
    id: "pillar-faktor-premi-asuransi-mobil",
    slug: "faktor-premi-asuransi-mobil",
    title: "7 Faktor yang Memengaruhi Premi Asuransi Mobil",
    excerpt:
      "Kenali 7 faktor utama yang menentukan premi asuransi mobil: harga OTR, tahun kendaraan, wilayah, jenis perlindungan, perluasan, partner asuransi, dan kategori kendaraan.",
    href: "/faktor-premi-asuransi-mobil",
    category: "Panduan",
    publishedAt: "2025-02-10",
    coverImage: "/faktor-premi.webp",
  },
  {
    id: "pillar-asuransi-mobil-bekas",
    slug: "asuransi-mobil-bekas",
    title: "Asuransi Mobil Bekas: Syarat, Batas Usia, dan Pilihan Proteksi",
    excerpt:
      "Panduan asuransi mobil bekas: batas usia All Risk per partner, opsi TLO, ketersediaan bengkel resmi, dan tips sebelum mengajukan.",
    href: "/asuransi-mobil-bekas",
    category: "Panduan",
    publishedAt: "2025-02-20",
    coverImage: "/asuransi-mobil-bekas.webp",
  },
  {
    id: "pillar-perluasan-asuransi-mobil",
    slug: "perluasan-asuransi-mobil",
    title: "Perluasan Asuransi Mobil: Banjir, Gempa, Kerusuhan, dan Tanggung Jawab Pihak Ketiga",
    excerpt:
      "Daftar lengkap perluasan asuransi mobil beserta rate: Banjir, Gempa, SRCC, Terorisme, Bengkel Resmi per partner, TPL, PA Driver, dan PA Penumpang.",
    href: "/perluasan-asuransi-mobil",
    category: "Panduan",
    publishedAt: "2025-03-01",
    coverImage: "/perluasan-asuransi-mobil.webp",
  },
  {
    id: "pillar-cara-klaim-asuransi-mobil",
    slug: "cara-klaim-asuransi-mobil",
    title: "Cara Klaim Asuransi Mobil: Alur, Dokumen, dan Bantuan",
    excerpt:
      "Panduan umum proses klaim asuransi mobil, hal yang perlu disiapkan, perbedaan klaim sesuai perlindungan, serta batas peran Jasa Proteksi dan perusahaan asuransi.",
    href: "/cara-klaim-asuransi-mobil",
    category: "Klaim",
    publishedAt: "2026-09-18",
    coverImage: null,
  },
  {
    id: "pillar-asuransi-mobil-banjir",
    slug: "asuransi-mobil-banjir",
    title: "Asuransi Mobil Banjir: Perluasan, Biaya, dan Cara Simulasi",
    excerpt:
      "Pelajari perlindungan banjir sebagai perluasan asuransi mobil, referensi rate yang digunakan di Jasa Proteksi, dan cara melihat dampaknya pada estimasi premi.",
    href: "/asuransi-mobil-banjir",
    category: "Perluasan",
    publishedAt: "2026-09-18",
    coverImage: null,
  },
  {
    id: "pillar-perpanjangan-asuransi-mobil",
    slug: "perpanjangan-asuransi-mobil",
    title: "Perpanjangan Asuransi Mobil: Cek Ulang Premi dan Perlindungan",
    excerpt:
      "Panduan mengevaluasi kembali premi, All Risk atau TLO, perluasan, usia kendaraan, dan partner sebelum memperpanjang asuransi mobil.",
    href: "/perpanjangan-asuransi-mobil",
    category: "Panduan",
    publishedAt: "2026-09-18",
    coverImage: null,
  },
  {
    id: "pillar-asuransi-mobil-baru",
    slug: "asuransi-mobil-baru",
    title: "Asuransi Mobil Baru: Pilih All Risk atau TLO dan Hitung Premi",
    excerpt:
      "Panduan memilih perlindungan untuk mobil baru, memahami All Risk dan TLO, faktor premi, perluasan, bengkel resmi, dan cara simulasi online.",
    href: "/asuransi-mobil-baru",
    category: "Panduan",
    publishedAt: "2026-09-18",
    coverImage: null,
  },
];
