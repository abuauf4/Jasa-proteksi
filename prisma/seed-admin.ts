import { hash } from "bcryptjs";
import { db } from "@/lib/db";

async function main() {
  console.log("🌱 Seeding admin data...");

  // Create admin users
  const bagasPassword = await hash("122333", 12);
  const bagas = await db.user.upsert({
    where: { username: "Bagas" },
    update: {},
    create: {
      name: "Bagas",
      username: "Bagas",
      password: bagasPassword,
      role: "admin",
      isActive: true,
    },
  });
  console.log(`✅ Admin user created: ${bagas.username}`);

  const jpAdminPassword = await hash("Jasaproteksi88", 12);
  const jpAdmin = await db.user.upsert({
    where: { username: "JPadmin" },
    update: {},
    create: {
      name: "JP Admin",
      username: "JPadmin",
      password: jpAdminPassword,
      role: "admin",
      isActive: true,
    },
  });
  console.log(`✅ Admin user created: ${jpAdmin.username}`);

  // Only 2 admin users — no sales users needed

  // Create insurance partners
  const partners = [
    {
      name: "Sinar Mas",
      slug: "sinar-mas",
      status: "active",
      benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
      facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
      modifier: 1.0,
      addonModifier: 1.0,
      adminFee: 50000,
      description: "Asuransi Sinar Mas - Proteksi terpercaya untuk kendaraan Anda",
      sortOrder: 1,
    },
    {
      name: "Allianz",
      slug: "allianz",
      status: "active",
      benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
      facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
      modifier: 1.0,
      addonModifier: 1.0,
      adminFee: 75000,
      description: "Allianz - Solusi asuransi global terpercaya",
      sortOrder: 2,
    },
    {
      name: "Tokio Marine",
      slug: "tokio-marine",
      status: "active",
      benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
      facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
      modifier: 1.0,
      addonModifier: 1.0,
      adminFee: 60000,
      description: "Tokio Marine - Asuransi dari Jepang dengan standar kualitas tinggi",
      sortOrder: 3,
    },
    {
      name: "AXA Mandiri",
      slug: "axa-mandiri",
      status: "active",
      benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
      facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
      modifier: 1.0,
      addonModifier: 1.0,
      adminFee: 65000,
      description: "AXA Mandiri - Perlindungan terbaik dari kolaborasi global dan lokal",
      sortOrder: 4,
    },
    {
      name: "Sompo",
      slug: "sompo",
      status: "active",
      benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
      facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
      modifier: 1.0,
      addonModifier: 1.0,
      adminFee: 55000,
      description: "Sompo Insurance - Asuransi kendaraan dari Jepang",
      sortOrder: 5,
    },
  ];

  for (const partner of partners) {
    const created = await db.insurancePartner.upsert({
      where: { slug: partner.slug },
      update: {},
      create: partner,
    });
    console.log(`✅ Partner created: ${created.name}`);
  }

  // ─── Seed RateSettings ───
  const rateSettings = [
    { key: "discountPercent", label: "Diskon Premier", value: 0.25, unit: "fraction", category: "general", description: "Diskon 25% dari premi sebelum biaya administrasi" },
    { key: "adminFee", label: "Biaya Administrasi", value: 50000, unit: "IDR", category: "fee", description: "Biaya administrasi per polis" },
    { key: "policyFee", label: "Biaya Cetak Polis", value: 0, unit: "IDR", category: "fee", description: "Biaya cetak polis" },
    { key: "loadingThreshold", label: "Batas Usia Loading", value: 5, unit: "year", category: "loading", description: "Usia kendaraan mulai dikenakan loading rate" },
    { key: "loadingPercentPerYear", label: "Persentase Loading per Tahun", value: 5, unit: "percent", category: "loading", description: "Loading rate 5% per tahun di atas threshold" },
    { key: "maxAgeAllRisk", label: "Usia Maks All Risk", value: 12, unit: "year", category: "eligibility", description: "Kendaraan di atas 12 tahun tidak eligible All Risk" },
    { key: "maxAgeTLO", label: "Usia Maks TLO", value: 15, unit: "year", category: "eligibility", description: "Kendaraan di atas 15 tahun tidak eligible TLO" },
    { key: "partnerSinarMasModifier", label: "Modifier Sinar Mas", value: 1.0, unit: "multiplier", category: "partner_modifier", description: "Pengali premi Sinar Mas" },
    { key: "partnerTokioMarineModifier", label: "Modifier Tokio Marine", value: 1.12, unit: "multiplier", category: "partner_modifier", description: "Pengali premi Tokio Marine" },
    { key: "partnerAllianzModifier", label: "Modifier Allianz", value: 1.25, unit: "multiplier", category: "partner_modifier", description: "Pengali premi Allianz" },
  ];

  for (const setting of rateSettings) {
    const existing = await db.rateSettings.findUnique({ where: { key: setting.key } });
    if (!existing) {
      await db.rateSettings.create({ data: setting });
      console.log(`✅ RateSetting created: ${setting.key}`);
    } else {
      console.log(`⏭️ RateSetting already exists: ${setting.key}`);
    }
  }

  // ─── Seed RegionMapping ───
  const regionMappings = [
    { plateCode: "B", platePrefix: "B", city: "Jakarta", wilayah: 2 },
    { plateCode: "D", platePrefix: "D", city: "Bandung", wilayah: 2 },
    { plateCode: "E", platePrefix: "E", city: "Cirebon", wilayah: 3 },
    { plateCode: "F", platePrefix: "F", city: "Bogor", wilayah: 2 },
    { plateCode: "G", platePrefix: "G", city: "Pekalongan", wilayah: 3 },
    { plateCode: "H", platePrefix: "H", city: "Semarang", wilayah: 3 },
    { plateCode: "K", platePrefix: "K", city: "Pati", wilayah: 3 },
    { plateCode: "L", platePrefix: "L", city: "Surabaya", wilayah: 2 },
    { plateCode: "M", platePrefix: "M", city: "Madura", wilayah: 3 },
    { plateCode: "N", platePrefix: "N", city: "Malang", wilayah: 3 },
    { plateCode: "P", platePrefix: "P", city: "Jember", wilayah: 3 },
    { plateCode: "S", platePrefix: "S", city: "Bojonegoro", wilayah: 3 },
    { plateCode: "T", platePrefix: "T", city: "Purwakarta", wilayah: 2 },
    { plateCode: "W", platePrefix: "W", city: "Sidoarjo", wilayah: 2 },
    { plateCode: "AA", platePrefix: "AA", city: "Magelang", wilayah: 3 },
    { plateCode: "AB", platePrefix: "AB", city: "Yogyakarta", wilayah: 3 },
    { plateCode: "AD", platePrefix: "AD", city: "Surakarta", wilayah: 3 },
    { plateCode: "AE", platePrefix: "AE", city: "Madiun", wilayah: 3 },
    { plateCode: "AG", platePrefix: "AG", city: "Kediri", wilayah: 3 },
    { plateCode: "BA", platePrefix: "BA", city: "Lampung", wilayah: 1 },
    { plateCode: "BB", platePrefix: "BB", city: "Tanggamus", wilayah: 1 },
    { plateCode: "BD", platePrefix: "BD", city: "Bengkulu", wilayah: 1 },
    { plateCode: "BE", platePrefix: "BE", city: "Palembang", wilayah: 1 },
    { plateCode: "BG", platePrefix: "BG", city: "Lahat", wilayah: 1 },
    { plateCode: "BH", platePrefix: "BH", city: "Jambi", wilayah: 1 },
    { plateCode: "BK", platePrefix: "BK", city: "Padang", wilayah: 1 },
    { plateCode: "BL", platePrefix: "BL", city: "Batusangkar", wilayah: 1 },
    { plateCode: "BM", platePrefix: "BM", city: "Riau", wilayah: 1 },
    { plateCode: "BN", platePrefix: "BN", city: "Tanjung Pinang", wilayah: 1 },
    { plateCode: "BP", platePrefix: "BP", city: "Batam", wilayah: 1 },
    { plateCode: "DB", platePrefix: "DB", city: "Denpasar", wilayah: 3 },
    { plateCode: "DA", platePrefix: "DA", city: "Mataram", wilayah: 3 },
    { plateCode: "DH", platePrefix: "DH", city: "Lombok", wilayah: 3 },
    { plateCode: "KB", platePrefix: "KB", city: "Pontianak", wilayah: 1 },
    { plateCode: "KH", platePrefix: "KH", city: "Sampit", wilayah: 1 },
    { plateCode: "EA", platePrefix: "EA", city: "Samarinda", wilayah: 1 },
    { plateCode: "EB", platePrefix: "EB", city: "Balikpapan", wilayah: 1 },
    { plateCode: "PA", platePrefix: "PA", city: "Makassar", wilayah: 1 },
    { plateCode: "PB", platePrefix: "PB", city: "Bone", wilayah: 1 },
    { plateCode: "PC", platePrefix: "PC", city: "Pare-Pare", wilayah: 1 },
    { plateCode: "RA", platePrefix: "RA", city: "Manado", wilayah: 1 },
    { plateCode: "RB", platePrefix: "RB", city: "Gorontalo", wilayah: 1 },
    { plateCode: "TA", platePrefix: "TA", city: "Ambon", wilayah: 1 },
    { plateCode: "TB", platePrefix: "TB", city: "Ternate", wilayah: 1 },
  ];

  for (const mapping of regionMappings) {
    const existing = await db.regionMapping.findUnique({ where: { plateCode: mapping.plateCode } });
    if (!existing) {
      await db.regionMapping.create({ data: mapping });
      console.log(`✅ RegionMapping created: ${mapping.plateCode} (${mapping.city})`);
    } else {
      console.log(`⏭️ RegionMapping already exists: ${mapping.plateCode}`);
    }
  }

  // ─── Seed MotorRate ───
  // Based on standard Indonesian insurance rates (OJK reference)
  // Coverage categories: 1-5 = Non Bus Non Truk, 6 = Truk/Pick Up, 7 = Bus, 8 = Roda 2
  const motorRates = [
    // Comprehensive (AllRisk) - Non Bus dan Non Truk
    { coverageType: "Comprehensive", category: 1, vehicleType: "Non Bus dan Non Truk", coverageMin: BigInt(0), coverageMax: BigInt(125000000), rateWilayah1: 0.0382, rateWilayah2: 0.0308, rateWilayah3: 0.0247 },
    { coverageType: "Comprehensive", category: 2, vehicleType: "Non Bus dan Non Truk", coverageMin: BigInt(125000001), coverageMax: BigInt(200000000), rateWilayah1: 0.0344, rateWilayah2: 0.0278, rateWilayah3: 0.0223 },
    { coverageType: "Comprehensive", category: 3, vehicleType: "Non Bus dan Non Truk", coverageMin: BigInt(200000001), coverageMax: BigInt(400000000), rateWilayah1: 0.0293, rateWilayah2: 0.0237, rateWilayah3: 0.0190 },
    { coverageType: "Comprehensive", category: 4, vehicleType: "Non Bus dan Non Truk", coverageMin: BigInt(400000001), coverageMax: BigInt(800000000), rateWilayah1: 0.0256, rateWilayah2: 0.0208, rateWilayah3: 0.0167 },
    { coverageType: "Comprehensive", category: 5, vehicleType: "Non Bus dan Non Truk", coverageMin: BigInt(800000001), coverageMax: BigInt(999999999999), rateWilayah1: 0.0208, rateWilayah2: 0.0168, rateWilayah3: 0.0135 },
    // TLO - Non Bus dan Non Truk
    { coverageType: "TLO", category: 1, vehicleType: "Non Bus dan Non Truk", coverageMin: BigInt(0), coverageMax: BigInt(125000000), rateWilayah1: 0.0099, rateWilayah2: 0.0080, rateWilayah3: 0.0064 },
    { coverageType: "TLO", category: 2, vehicleType: "Non Bus dan Non Truk", coverageMin: BigInt(125000001), coverageMax: BigInt(200000000), rateWilayah1: 0.0089, rateWilayah2: 0.0072, rateWilayah3: 0.0058 },
    { coverageType: "TLO", category: 3, vehicleType: "Non Bus dan Non Truk", coverageMin: BigInt(200000001), coverageMax: BigInt(400000000), rateWilayah1: 0.0076, rateWilayah2: 0.0061, rateWilayah3: 0.0049 },
    { coverageType: "TLO", category: 4, vehicleType: "Non Bus dan Non Truk", coverageMin: BigInt(400000001), coverageMax: BigInt(800000000), rateWilayah1: 0.0066, rateWilayah2: 0.0054, rateWilayah3: 0.0043 },
    { coverageType: "TLO", category: 5, vehicleType: "Non Bus dan Non Truk", coverageMin: BigInt(800000001), coverageMax: BigInt(999999999999), rateWilayah1: 0.0054, rateWilayah2: 0.0044, rateWilayah3: 0.0035 },
    // Comprehensive - Truk dan Pick Up
    { coverageType: "Comprehensive", category: 6, vehicleType: "Truk dan Pick Up", coverageMin: BigInt(0), coverageMax: BigInt(999999999999), rateWilayah1: 0.0334, rateWilayah2: 0.0270, rateWilayah3: 0.0216 },
    // TLO - Truk dan Pick Up
    { coverageType: "TLO", category: 6, vehicleType: "Truk dan Pick Up", coverageMin: BigInt(0), coverageMax: BigInt(999999999999), rateWilayah1: 0.0087, rateWilayah2: 0.0070, rateWilayah3: 0.0056 },
    // Comprehensive - Bus
    { coverageType: "Comprehensive", category: 7, vehicleType: "Bus", coverageMin: BigInt(0), coverageMax: BigInt(999999999999), rateWilayah1: 0.0334, rateWilayah2: 0.0270, rateWilayah3: 0.0216 },
    // TLO - Bus
    { coverageType: "TLO", category: 7, vehicleType: "Bus", coverageMin: BigInt(0), coverageMax: BigInt(999999999999), rateWilayah1: 0.0087, rateWilayah2: 0.0070, rateWilayah3: 0.0056 },
    // Comprehensive - Kendaraan Roda 2
    { coverageType: "Comprehensive", category: 8, vehicleType: "Kendaraan Roda 2", coverageMin: BigInt(0), coverageMax: BigInt(999999999999), rateWilayah1: 0.0382, rateWilayah2: 0.0308, rateWilayah3: 0.0247 },
    // TLO - Kendaraan Roda 2
    { coverageType: "TLO", category: 8, vehicleType: "Kendaraan Roda 2", coverageMin: BigInt(0), coverageMax: BigInt(999999999999), rateWilayah1: 0.0099, rateWilayah2: 0.0080, rateWilayah3: 0.0064 },
  ];

  for (const rate of motorRates) {
    const existing = await db.motorRate.findFirst({
      where: {
        coverageType: rate.coverageType,
        category: rate.category,
        vehicleType: rate.vehicleType,
      },
    });
    if (!existing) {
      await db.motorRate.create({ data: rate });
      console.log(`✅ MotorRate created: ${rate.coverageType} cat${rate.category} ${rate.vehicleType}`);
    } else {
      console.log(`⏭️ MotorRate already exists: ${rate.coverageType} cat${rate.category}`);
    }
  }

  // ─── Seed LoadingRate ───
  const loadingRates = [
    { minAge: 6, maxAge: 10, loadingPercent: 0.05, coverageType: "Comprehensive", description: "Loading 5% untuk usia 6-10 tahun" },
    { minAge: 11, maxAge: 15, loadingPercent: 0.10, coverageType: "Comprehensive", description: "Loading 10% untuk usia 11-15 tahun" },
    { minAge: 16, maxAge: 99, loadingPercent: 0.15, coverageType: "Comprehensive", description: "Loading 15% untuk usia >15 tahun" },
  ];

  for (const rate of loadingRates) {
    const existing = await db.loadingRate.findFirst({
      where: {
        minAge: rate.minAge,
        maxAge: rate.maxAge,
        coverageType: rate.coverageType,
      },
    });
    if (!existing) {
      await db.loadingRate.create({ data: rate });
      console.log(`✅ LoadingRate created: usia ${rate.minAge}-${rate.maxAge}`);
    } else {
      console.log(`⏭️ LoadingRate already exists: usia ${rate.minAge}-${rate.maxAge}`);
    }
  }

  // ─── Seed AddonRate ───
  const addonRates = [
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "All", wilayah: 0, rate: 0.0005 },
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "Comprehensive", wilayah: 1, rate: 0.0006 },
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "Comprehensive", wilayah: 2, rate: 0.0005 },
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "Comprehensive", wilayah: 3, rate: 0.0004 },
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "All", wilayah: 0, rate: 0.0009 },
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "Comprehensive", wilayah: 1, rate: 0.0012 },
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "Comprehensive", wilayah: 2, rate: 0.0009 },
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "Comprehensive", wilayah: 3, rate: 0.0008 },
    { addonKey: "srcc", addonLabel: "Kerusuhan & Huru-Hara (SRCC)", coverageType: "All", wilayah: 0, rate: 0.0005 },
    { addonKey: "srcc", addonLabel: "Kerusuhan & Huru-Hara (SRCC)", coverageType: "Comprehensive", wilayah: 1, rate: 0.0005 },
    { addonKey: "srcc", addonLabel: "Kerusuhan & Huru-Hara (SRCC)", coverageType: "Comprehensive", wilayah: 2, rate: 0.0005 },
    { addonKey: "srcc", addonLabel: "Kerusuhan & Huru-Hara (SRCC)", coverageType: "Comprehensive", wilayah: 3, rate: 0.0005 },
    { addonKey: "terrorism", addonLabel: "Terorisme & Sabotase", coverageType: "All", wilayah: 0, rate: 0.0003 },
    { addonKey: "terrorism", addonLabel: "Terorisme & Sabotase", coverageType: "Comprehensive", wilayah: 0, rate: 0.0003 },
    { addonKey: "bengkelAuthorized", addonLabel: "Bengkel Resmi / Authorized", coverageType: "Comprehensive", wilayah: 0, rate: 0.001 },
    { addonKey: "bengkelAuthorized", addonLabel: "Bengkel Resmi / Authorized", coverageType: "Comprehensive", wilayah: 1, rate: 0.001 },
    { addonKey: "bengkelAuthorized", addonLabel: "Bengkel Resmi / Authorized", coverageType: "Comprehensive", wilayah: 2, rate: 0.001 },
    { addonKey: "bengkelAuthorized", addonLabel: "Bengkel Resmi / Authorized", coverageType: "Comprehensive", wilayah: 3, rate: 0.001 },
    { addonKey: "tpl", addonLabel: "Tanggung Jawab Pihak Ketiga (TPL)", coverageType: "All", wilayah: 0, rate: 0.01 },
    { addonKey: "paDriver", addonLabel: "Kecelakaan Diri Pengemudi", coverageType: "All", wilayah: 0, rate: 0.005 },
    { addonKey: "paPassenger", addonLabel: "Kecelakaan Diri Penumpang", coverageType: "All", wilayah: 0, rate: 0.005 },
  ];

  for (const rate of addonRates) {
    const existing = await db.addonRate.findFirst({
      where: {
        addonKey: rate.addonKey,
        coverageType: rate.coverageType,
        wilayah: rate.wilayah,
      },
    });
    if (!existing) {
      await db.addonRate.create({ data: rate });
      console.log(`✅ AddonRate created: ${rate.addonKey} (${rate.coverageType}, wilayah ${rate.wilayah})`);
    } else {
      console.log(`⏭️ AddonRate already exists: ${rate.addonKey} (${rate.coverageType}, wilayah ${rate.wilayah})`);
    }
  }

  // ─── Seed TplRate ───
  const tplRates = [
    // Passenger & Motorcycle
    { vehicleCategory: "Passenger & Motorcycle", coverageMin: BigInt(0), coverageMax: BigInt(25000000), rate: 0.008, isActive: true },
    { vehicleCategory: "Passenger & Motorcycle", coverageMin: BigInt(25000001), coverageMax: BigInt(50000000), rate: 0.006, isActive: true },
    { vehicleCategory: "Passenger & Motorcycle", coverageMin: BigInt(50000001), coverageMax: BigInt(100000000), rate: 0.004, isActive: true },
    { vehicleCategory: "Passenger & Motorcycle", coverageMin: BigInt(100000001), coverageMax: BigInt(250000000), rate: 0.003, isActive: true },
    { vehicleCategory: "Passenger & Motorcycle", coverageMin: BigInt(250000001), coverageMax: BigInt(999999999999), rate: 0.002, isActive: true },
    // Bus / Truck
    { vehicleCategory: "Bus / Truck", coverageMin: BigInt(0), coverageMax: BigInt(25000000), rate: 0.010, isActive: true },
    { vehicleCategory: "Bus / Truck", coverageMin: BigInt(25000001), coverageMax: BigInt(50000000), rate: 0.008, isActive: true },
    { vehicleCategory: "Bus / Truck", coverageMin: BigInt(50000001), coverageMax: BigInt(100000000), rate: 0.006, isActive: true },
    { vehicleCategory: "Bus / Truck", coverageMin: BigInt(100000001), coverageMax: BigInt(250000000), rate: 0.004, isActive: true },
    { vehicleCategory: "Bus / Truck", coverageMin: BigInt(250000001), coverageMax: BigInt(999999999999), rate: 0.003, isActive: true },
  ];

  for (const rate of tplRates) {
    const existing = await db.tplRate.findFirst({
      where: {
        vehicleCategory: rate.vehicleCategory,
        coverageMin: rate.coverageMin,
        coverageMax: rate.coverageMax,
      },
    });
    if (!existing) {
      await db.tplRate.create({ data: rate });
      console.log(`✅ TplRate created: ${rate.vehicleCategory} ${rate.coverageMin}-${rate.coverageMax}`);
    } else {
      console.log(`⏭️ TplRate already exists: ${rate.vehicleCategory} ${rate.coverageMin}-${rate.coverageMax}`);
    }
  }

  // Create sample insurance rates
  const rates = [
    { category: "base", coverageType: "AllRisk", key: "base_rate", label: "All Risk Base Rate", value: 0.0395, config: null, isActive: true },
    { category: "base", coverageType: "TLO", key: "base_rate", label: "TLO Base Rate", value: 0.0125, config: null, isActive: true },
    { category: "loading", coverageType: "AllRisk", key: "loading_6_10", label: "Loading Usia 6-10 Tahun", value: 0.05, config: JSON.stringify({ minAge: 6, maxAge: 10 }), isActive: true },
    { category: "loading", coverageType: "AllRisk", key: "loading_11_15", label: "Loading Usia 11-15 Tahun", value: 0.10, config: JSON.stringify({ minAge: 11, maxAge: 15 }), isActive: true },
    { category: "loading", coverageType: "AllRisk", key: "loading_over_15", label: "Loading Usia >15 Tahun", value: 0.15, config: JSON.stringify({ minAge: 16, maxAge: 99 }), isActive: true },
    { category: "addon", coverageType: "All", key: "flood", label: "Banjir & Angin Kencang", value: 0.0005, config: null, isActive: true },
    { category: "addon", coverageType: "All", key: "earthquake", label: "Gempa Bumi & Tsunami", value: 0.0009, config: null, isActive: true },
    { category: "addon", coverageType: "All", key: "srcc", label: "Huru-Hara", value: 0.0005, config: null, isActive: true },
    { category: "addon", coverageType: "All", key: "terrorism", label: "Terorisme", value: 0.0003, config: null, isActive: true },
    { category: "addon", coverageType: "All", key: "bengkel_authorize", label: "Bengkel Authorize", value: 0.001, config: null, isActive: true },
    { category: "addon", coverageType: "All", key: "tpl", label: "Tanggung Jawab Pihak Ketiga", value: 0.01, config: null, isActive: true },
    { category: "addon", coverageType: "All", key: "pa_driver", label: "Kecelakaan Diri Pengemudi", value: 0.005, config: null, isActive: true },
    { category: "addon", coverageType: "All", key: "pa_passenger", label: "Kecelakaan Diri Penumpang", value: 0.005, config: null, isActive: true },
  ];

  for (const rate of rates) {
    const existing = await db.insuranceRate.findUnique({
      where: { category_coverageType_key: { category: rate.category, coverageType: rate.coverageType, key: rate.key } },
    });
    if (!existing) {
      const created = await db.insuranceRate.create({ data: rate });
      console.log(`✅ Rate created: ${created.label}`);
    } else {
      console.log(`⏭️ Rate already exists: ${rate.label}`);
    }
  }

  // Create sample insurance leads
  const sampleLeads = [
    {
      customerName: "Budi Santoso",
      whatsappNumber: "081234567890",
      vehicleBrand: "TOYOTA",
      vehicleType: "AVANZA 1.5 G CVT",
      vehicleYear: "2024",
      plateRegion: "B",
      vehiclePriceOtr: 285000000,
      coverageType: "AllRisk",
      addOns: JSON.stringify(["flood", "earthquake"]),
      customerBudget: 10000000,
      estimatedPremium: 11500000,
      selectedPartner: "sinar-mas",
      status: "baru",
      source: "website",
    },
    {
      customerName: "Dewi Lestari",
      whatsappNumber: "082345678901",
      vehicleBrand: "HONDA",
      vehicleType: "HR-V 1.5 RS",
      vehicleYear: "2025",
      plateRegion: "D",
      vehiclePriceOtr: 395000000,
      coverageType: "AllRisk",
      addOns: JSON.stringify(["flood", "bengkel_authorize"]),
      customerBudget: 15000000,
      estimatedPremium: 15800000,
      selectedPartner: "allianz",
      status: "dihubungi",
      assignedSalesId: bagas.id,
      source: "website",
    },
    {
      customerName: "Rini Wulandari",
      whatsappNumber: "083456789012",
      vehicleBrand: "MITSUBISHI",
      vehicleType: "XPANDER CROSS",
      vehicleYear: "2024",
      plateRegion: "L",
      vehiclePriceOtr: 325000000,
      coverageType: "TLO",
      customerBudget: 5000000,
      estimatedPremium: 4200000,
      status: "negosiasi",
      assignedSalesId: jpAdmin.id,
      source: "referral",
    },
    {
      customerName: "Agus Pratama",
      whatsappNumber: "084567890123",
      vehicleBrand: "SUZUKI",
      vehicleType: "ERTIGA GX",
      vehicleYear: "2023",
      plateRegion: "B",
      vehiclePriceOtr: 260000000,
      coverageType: "AllRisk",
      addOns: JSON.stringify(["flood", "earthquake", "pa_driver"]),
      status: "approved",
      assignedSalesId: bagas.id,
      source: "manual",
    },
    {
      customerName: "Fitri Handayani",
      whatsappNumber: "085678901234",
      vehicleBrand: "DAIHATSU",
      vehicleType: "ROKY 1.0 R CVT",
      vehicleYear: "2025",
      plateRegion: "AB",
      vehiclePriceOtr: 195000000,
      coverageType: "AllRisk",
      status: "ragu_ragu",
      assignedSalesId: jpAdmin.id,
      source: "website",
    },
  ];

  for (const lead of sampleLeads) {
    const existing = await db.insuranceLead.findFirst({
      where: { customerName: lead.customerName, whatsappNumber: lead.whatsappNumber },
    });
    if (!existing) {
      const created = await db.insuranceLead.create({ data: lead });
      console.log(`✅ Sample lead created: ${created.customerName}`);
    } else {
      console.log(`⏭️ Lead already exists: ${lead.customerName}`);
    }
  }

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Login credentials:");
  console.log("  Admin: Bagas / 122333");
  console.log("  Admin: JPadmin / Jasaproteksi88");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
