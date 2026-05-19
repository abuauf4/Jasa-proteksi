import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: "Asuransi Mobil",
    slug: "asuransi-mobil",
    category: "Kendaraan",
    description: "Asuransi mobil komprehensif dengan pilihan TLO atau All Risk. Perlindungan menyeluruh untuk kendaraan roda empat pribadi Anda, termasuk kerusakan akibat kecelakaan, pencurian, dan bencana alam.",
    benefits: JSON.stringify([
      "Kerusakan akibat kecelakaan",
      "Pencurian kendaraan",
      "Kerusakan akibat bencana alam",
      "Tanggung jawab pihak ketiga",
      "Cashback hingga 20%",
      "Klaim cashless & reimbursement"
    ]),
    estimatedPrice: 1200000,
    minimumOfferPrice: 800000,
    isActive: true,
  },
  {
    name: "Asuransi Motor",
    slug: "asuransi-motor",
    category: "Kendaraan",
    description: "Perlindungan untuk motor matic atau bebek yang Anda kendarai. Proses pembelian mudah, cukup 5 menit dan polis langsung terbit.",
    benefits: JSON.stringify([
      "Kerusakan akibat kecelakaan",
      "Pencurian kendaraan",
      "Tanggung jawab pihak ketiga",
      "Kerusakan akibat bencana alam",
      "Proses cepat 5 menit",
      "Klaim mudah & cepat"
    ]),
    estimatedPrice: 300000,
    minimumOfferPrice: 200000,
    isActive: true,
  },
  {
    name: "Asuransi Perjalanan",
    slug: "asuransi-perjalanan",
    category: "Perjalanan",
    description: "Perlindungan selama Anda melakukan perjalanan domestik dan internasional. Menanggung biaya pembatalan perjalanan, kehilangan bagasi, dan keadaan darurat medis.",
    benefits: JSON.stringify([
      "Pembatalan perjalanan",
      "Kehilangan bagasi",
      "Darurat medis perjalanan",
      "Keterlambatan penerbangan",
      "Evakuasi darurat",
      "Domestik & Internasional"
    ]),
    estimatedPrice: 75000,
    minimumOfferPrice: 50000,
    isActive: true,
  },
  {
    name: "Asuransi Hewan Peliharaan",
    slug: "asuransi-hewan-peliharaan",
    category: "Hewan",
    description: "Perlindungan bagi hewan kesayanganmu. Perlindungan medis seperti santunan rawat inap, rawat jalan, kematian karena kecelakaan. Asuransi hewan pertama di Indonesia!",
    benefits: JSON.stringify([
      "Santunan rawat inap",
      "Santunan rawat jalan",
      "Kematian karena kecelakaan",
      "Kompensasi kerugian pihak ketiga",
      "Pemeriksaan rutin & Vaksinasi",
      "Anjing & Kucing"
    ]),
    estimatedPrice: 200000,
    minimumOfferPrice: 150000,
    isActive: true,
  },
  {
    name: "Asuransi Motor Listrik",
    slug: "asuransi-motor-listrik",
    category: "Kendaraan",
    description: "Asuransi khusus untuk keamanan roda dua listrikmu. Mengcover kerusakan baterai akibat kecelakaan, pencurian, dan kerusakan komponen elektrik.",
    benefits: JSON.stringify([
      "Kerusakan baterai akibat kecelakaan",
      "Pencurian kendaraan",
      "Kerusakan komponen elektrik",
      "Tanggung jawab pihak ketiga",
      "Kerusakan charger",
      "Roadside assistance"
    ]),
    estimatedPrice: 400000,
    minimumOfferPrice: 280000,
    isActive: true,
  },
  {
    name: "Asuransi Kecelakaan Diri",
    slug: "asuransi-kecelakaan-diri",
    category: "Personal",
    description: "Perlindungan finansial untuk risiko kecelakaan diri, termasuk cacat tetap, biaya medis akibat kecelakaan, hingga meninggal dunia. Premi terjangkau dengan manfaat besar.",
    benefits: JSON.stringify([
      "Cacat tetap akibat kecelakaan",
      "Biaya medis akibat kecelakaan",
      "Meninggal dunia akibat kecelakaan",
      "Biaya rawat inap",
      "Biaya ambulans",
      "Rehabilitasi medis"
    ]),
    estimatedPrice: 50000,
    minimumOfferPrice: 35000,
    isActive: true,
  },
];

async function main() {
  console.log('Seeding products...');

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
