export interface InsuranceProduct {
  slug: string;
  name: string;
  category: "Kendaraan" | "Perjalanan" | "Hewan" | "Personal";
  tagline: string;
  price: string;
  discount: string;
  iconName: string;
  image: string;
  description: string;
  coverage: string[];
  highlights: { icon: string; label: string; value: string }[];
  claimTypes: string[];
  variants: { name: string; price: string }[];
  warranty: string;
  // Backend fields — needed for lead flow
  id?: string;
  estimatedPrice: number;
  minimumOfferPrice: number;
  benefits: string;
  isActive: boolean;
}

export const products: InsuranceProduct[] = [
  {
    slug: "asuransi-mobil",
    name: "Asuransi Mobil",
    category: "Kendaraan",
    tagline: "Perlindungan Terbaik untuk Kendaraan Anda",
    price: "Mulai Rp 1,2jt/tahun",
    discount: "Bengkel Resmi Partner",
    iconName: "Car",
    image: "/images/product-car.svg",
    description: "Asuransi mobil komprehensif dengan pilihan TLO atau All Risk. Perlindungan menyeluruh untuk kendaraan roda empat pribadi Anda, termasuk kerusakan akibat kecelakaan, pencurian, dan bencana alam. Tersedia juga Asuransi Mobil Listrik yang mengcover kerusakan baterai akibat kecelakaan.",
    coverage: [
      "Kerusakan akibat kecelakaan",
      "Pencurian kendaraan",
      "Kerusakan akibat bencana alam",
      "Tanggung jawab pihak ketiga",
      "Kerusakan akibat huru-hara",
      "Asuransi Mobil Listrik tersedia",
      "Bengkel resmi partner (8-10 tahun)",
      "Klaim cashless & reimbursement",
    ],
    highlights: [
      { icon: "shield", label: "Tipe", value: "TLO / All Risk" },
      { icon: "shield", label: "Jangkauan", value: "Bengkel Resmi" },
      { icon: "star", label: "Partner", value: "8+ Asuransi" },
      { icon: "claim", label: "Layanan", value: "Layanan Derek & towing" },
    ],
    claimTypes: ["Reimbursement", "Cashless"],
    variants: [
      { name: "Mobil TLO", price: "Mulai Rp 1,2jt/tahun" },
      { name: "Mobil All Risk", price: "Mulai Rp 2,5jt/tahun" },
    ],
    warranty: "Polis aktif sejak pembayaran",
    estimatedPrice: 1200000,
    minimumOfferPrice: 800000,
    benefits: JSON.stringify([
      "Kerusakan akibat kecelakaan",
      "Pencurian kendaraan",
      "Kerusakan akibat bencana alam",
      "Tanggung jawab pihak ketiga",
      "Bengkel resmi partner",
      "Klaim cashless & reimbursement",
    ]),
    isActive: true,
  },
  {
    slug: "asuransi-motor",
    name: "Asuransi Motor",
    category: "Kendaraan",
    tagline: "Jaminan Keamanan Berkendara Anda",
    price: "Mulai Rp 300rb/tahun",
    discount: "Diskon 20%",
    iconName: "Bike",
    image: "/images/product-motor.svg",
    description: "Perlindungan untuk motor matic atau bebek yang Anda kendarai. Tersedia juga Asuransi Motor Listrik untuk keamanan roda dua listrikmu. Proses pembelian mudah, cukup 5 menit dan polis langsung terbit.",
    coverage: [
      "Kerusakan akibat kecelakaan",
      "Pencurian kendaraan",
      "Tanggung jawab pihak ketiga",
      "Kerusakan akibat bencana alam",
      "Motor Listrik tersedia",
      "Proses cepat 5 menit",
      "Diskon hingga 20%",
      "Klaim mudah & cepat",
    ],
    highlights: [
      { icon: "shield", label: "Tipe", value: "TLO / All Risk" },
      { icon: "discount", label: "Diskon", value: "20%" },
    ],
    claimTypes: ["Reimbursement", "Cashless"],
    variants: [
      { name: "Motor TLO", price: "Mulai Rp 300rb/tahun" },
      { name: "Motor All Risk", price: "Mulai Rp 800rb/tahun" },
      { name: "Motor Listrik TLO", price: "Mulai Rp 400rb/tahun" },
      { name: "Motor Listrik All Risk", price: "Mulai Rp 1jt/tahun" },
    ],
    warranty: "Polis aktif sejak pembayaran",
    estimatedPrice: 300000,
    minimumOfferPrice: 200000,
    benefits: JSON.stringify([
      "Kerusakan akibat kecelakaan",
      "Pencurian kendaraan",
      "Tanggung jawab pihak ketiga",
      "Kerusakan akibat bencana alam",
      "Proses cepat 5 menit",
      "Klaim mudah & cepat",
    ]),
    isActive: false,
  },
  {
    slug: "asuransi-perjalanan",
    name: "Asuransi Perjalanan",
    category: "Perjalanan",
    tagline: "Perjalanan Aman, Pikiran Tenang",
    price: "Mulai Rp 75rb/trip",
    discount: "Diskon 15%",
    iconName: "Plane",
    image: "/images/product-travel.svg",
    description: "Perlindungan selama Anda melakukan perjalanan domestik dan internasional. Menanggung biaya yang terkait dengan pembatalan perjalanan, kehilangan bagasi, keadaan darurat medis selama perjalanan, dan masih banyak lagi.",
    coverage: [
      "Pembatalan perjalanan",
      "Kehilangan bagasi",
      "Darurat medis perjalanan",
      "Keterlambatan penerbangan",
      "Kehilangan dokumen perjalanan",
      "Evakuasi darurat",
      "Diskon 15%",
      "Domestik & Internasional",
    ],
    highlights: [
      { icon: "globe", label: "Cakupan", value: "Domestik & Intl" },
      { icon: "baggage", label: "Bagasi", value: "Tertanggung" },
      { icon: "discount", label: "Diskon", value: "15%" },
      { icon: "medical", label: "Medis", value: "Darurat" },
    ],
    claimTypes: ["Reimbursement"],
    variants: [
      { name: "Perjalanan Domestik", price: "Mulai Rp 75rb/trip" },
      { name: "Perjalanan Internasional", price: "Mulai Rp 150rb/trip" },
      { name: "Perjalanan Tahunan", price: "Mulai Rp 500rb/tahun" },
    ],
    warranty: "Polis aktif selama perjalanan",
    estimatedPrice: 75000,
    minimumOfferPrice: 50000,
    benefits: JSON.stringify([
      "Pembatalan perjalanan",
      "Kehilangan bagasi",
      "Darurat medis perjalanan",
      "Keterlambatan penerbangan",
      "Evakuasi darurat",
      "Domestik & Internasional",
    ]),
    isActive: false,
  },
  {
    slug: "asuransi-hewan-peliharaan",
    name: "Asuransi Hewan Peliharaan",
    category: "Hewan",
    tagline: "Sayangi Hewan Kesayangan Anda",
    price: "Mulai Rp 200rb/tahun",
    discount: "Diskon 10%",
    iconName: "PawPrint",
    image: "/images/product-pet.svg",
    description: "Perlindungan bagi hewan kesayanganmu di rumah, khususnya anjing dan kucing. Perlindungan medis seperti santunan rawat inap, rawat jalan, kematian karena kecelakaan, kompensasi kerugian pihak ketiga bisa kamu dapatkan. Asuransi hewan pertama di Indonesia!",
    coverage: [
      "Santunan rawat inap",
      "Santunan rawat jalan",
      "Kematian karena kecelakaan",
      "Kompensasi kerugian pihak ketiga",
      "Pemeriksaan rutin",
      "Vaksinasi",
      "Diskon 10%",
      "Anjing & Kucing",
    ],
    highlights: [
      { icon: "pet", label: "Hewan", value: "Anjing & Kucing" },
      { icon: "medical", label: "Medis", value: "Rawat Inap & Jalan" },
      { icon: "discount", label: "Diskon", value: "10%" },
      { icon: "unique", label: "Unik", value: "Pertama di ID" },
    ],
    claimTypes: ["Reimbursement", "Cashless"],
    variants: [
      { name: "Kucing Basic", price: "Mulai Rp 200rb/tahun" },
      { name: "Kucing Premium", price: "Mulai Rp 400rb/tahun" },
      { name: "Anjing Basic", price: "Mulai Rp 300rb/tahun" },
      { name: "Anjing Premium", price: "Mulai Rp 600rb/tahun" },
    ],
    warranty: "Polis aktif sejak pembayaran",
    estimatedPrice: 200000,
    minimumOfferPrice: 150000,
    benefits: JSON.stringify([
      "Santunan rawat inap",
      "Santunan rawat jalan",
      "Kematian karena kecelakaan",
      "Kompensasi kerugian pihak ketiga",
      "Pemeriksaan rutin & Vaksinasi",
      "Anjing & Kucing",
    ]),
    isActive: false,
  },
  {
    slug: "asuransi-motor-listrik",
    name: "Asuransi Motor Listrik",
    category: "Kendaraan",
    tagline: "Proteksi Khusus untuk Motor Listrik",
    price: "Mulai Rp 400rb/tahun",
    discount: "Diskon 20%",
    iconName: "Zap",
    image: "/images/product-ev-motor.svg",
    description: "Asuransi khusus untuk keamanan roda dua listrikmu. Mengcover kerusakan baterai akibat kecelakaan, pencurian, dan kerusakan komponen elektrik. Didesain khusus untuk kebutuhan motor listrik yang berbeda dari motor konvensional.",
    coverage: [
      "Kerusakan baterai akibat kecelakaan",
      "Pencurian kendaraan",
      "Kerusakan komponen elektrik",
      "Tanggung jawab pihak ketiga",
      "Kerusakan charger",
      "Roadside assistance",
      "Diskon 20%",
      "Klaim cashless",
    ],
    highlights: [
      { icon: "battery", label: "Baterai", value: "Tertanggung" },
      { icon: "electric", label: "Elektrik", value: "Full Cover" },
      { icon: "discount", label: "Diskon", value: "20%" },
      { icon: "claim", label: "Klaim", value: "Cashless" },
    ],
    claimTypes: ["Reimbursement", "Cashless"],
    variants: [
      { name: "Motor Listrik TLO", price: "Mulai Rp 400rb/tahun" },
      { name: "Motor Listrik All Risk", price: "Mulai Rp 1jt/tahun" },
    ],
    warranty: "Polis aktif sejak pembayaran",
    estimatedPrice: 400000,
    minimumOfferPrice: 280000,
    benefits: JSON.stringify([
      "Kerusakan baterai akibat kecelakaan",
      "Pencurian kendaraan",
      "Kerusakan komponen elektrik",
      "Tanggung jawab pihak ketiga",
      "Kerusakan charger",
      "Roadside assistance",
    ]),
    isActive: false,
  },
  {
    slug: "asuransi-kecelakaan-diri",
    name: "Asuransi Kecelakaan Diri",
    category: "Personal",
    tagline: "Proteksi Diri dari Risiko Kecelakaan",
    price: "Mulai Rp 50rb/tahun",
    discount: "Diskon 10%",
    iconName: "UserCheck",
    image: "/images/product-personal.svg",
    description: "Perlindungan finansial untuk risiko kecelakaan diri, termasuk cacat tetap, biaya medis akibat kecelakaan, hingga meninggal dunia. Premi terjangkau dengan manfaat yang besar untuk ketenangan pikiran Anda dan keluarga.",
    coverage: [
      "Cacat tetap akibat kecelakaan",
      "Biaya medis akibat kecelakaan",
      "Meninggal dunia akibat kecelakaan",
      "Biaya rawat inap",
      "Biaya ambulans",
      "Rehabilitasi medis",
      "Diskon 10%",
      "Premi terjangkau",
    ],
    highlights: [
      { icon: "person", label: "Cakupan", value: "Kecelakaan Diri" },
      { icon: "medical", label: "Medis", value: "Tertanggung" },
      { icon: "discount", label: "Diskon", value: "10%" },
      { icon: "price", label: "Premi", value: "Terjangkau" },
    ],
    claimTypes: ["Reimbursement"],
    variants: [
      { name: "Personal Basic", price: "Mulai Rp 50rb/tahun" },
      { name: "Personal Plus", price: "Mulai Rp 150rb/tahun" },
      { name: "Personal Premium", price: "Mulai Rp 300rb/tahun" },
    ],
    warranty: "Polis aktif sejak pembayaran",
    estimatedPrice: 50000,
    minimumOfferPrice: 35000,
    benefits: JSON.stringify([
      "Cacat tetap akibat kecelakaan",
      "Biaya medis akibat kecelakaan",
      "Meninggal dunia akibat kecelakaan",
      "Biaya rawat inap",
      "Biaya ambulans",
      "Rehabilitasi medis",
    ]),
    isActive: true,
  },
];

export function getProductBySlug(slug: string): InsuranceProduct | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: InsuranceProduct): InsuranceProduct[] {
  return products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
}
