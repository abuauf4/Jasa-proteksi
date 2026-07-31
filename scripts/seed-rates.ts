/**
 * Seed Insurance Rate Tables — Based on Excel DELA (Final/Valid Version)
 * 
 * Source: Simulasi Rate MV_Retail _ Fleet 2021 - DELA (Recovered)-1.xlsx
 * 
 * Seeds: MotorRate, AddonRate, LoadingRate, TplRate, RegionMapping, InsurancePartner, RateSettings
 * Does NOT seed: Vehicle data, Users, Leads
 * 
 * Idempotent — uses upsert, safe to re-run
 * 
 * Usage:
 *   DATABASE_URL=... DIRECT_URL=... npx tsx scripts/seed-rates.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("═".repeat(60));
  console.log("  Seed Insurance Rate Tables — Excel DELA (Final)");
  console.log("═".repeat(60));

  // ─── RateSettings ───
  console.log("\n[1] RateSettings...");
  const rateSettings = [
    { key: "discountPercent", label: "Diskon Premi", value: 0.25, unit: "fraction", category: "general", description: "Diskon 25% dari premi sebelum biaya administrasi (sesuai Excel DELA)" },
    { key: "adminFee", label: "Biaya Administrasi", value: 50000, unit: "IDR", category: "fee", description: "Biaya administrasi per polis" },
    { key: "policyFee", label: "Biaya Cetak Polis", value: 0, unit: "IDR", category: "fee", description: "Biaya cetak polis" },
    { key: "loadingThreshold", label: "Batas Usia Loading", value: 5, unit: "year", category: "loading", description: "Usia kendaraan mulai dikenakan loading rate" },
    { key: "loadingPercentPerYear", label: "Persentase Loading per Tahun", value: 5, unit: "percent", category: "loading", description: "Loading rate 5% per tahun di atas threshold" },
    { key: "maxAgeAllRisk", label: "Usia Maks All Risk", value: 12, unit: "year", category: "eligibility", description: "Kendaraan di atas 12 tahun tidak eligible All Risk" },
    { key: "maxAgeTLO", label: "Usia Maks TLO", value: 15, unit: "year", category: "eligibility", description: "Kendaraan di atas 15 tahun tidak eligible TLO" },
    { key: "paDriverRate", label: "Rate PA Driver", value: 0.005, unit: "fraction", category: "addon", description: "Rate Personal Accident Driver 0.5% dari pertanggungan" },
    { key: "paPassengerRate", label: "Rate PA Passenger", value: 0.004, unit: "fraction", category: "addon", description: "Rate Personal Accident Passenger 0.4% per orang dari pertanggungan" },
  ];

  for (const setting of rateSettings) {
    await db.rateSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value, label: setting.label, description: setting.description },
      create: setting,
    });
    console.log(`  ✅ Upserted: ${setting.key} = ${setting.value}`);
  }

  // ─── RegionMapping (57 entries from db.police) ───
  console.log("\n[2] RegionMapping (57 entries from Excel DELA db.police)...");
  const regionMappings = [
    { plateCode: "A", platePrefix: "A-", city: "Banten", wilayah: 2 },
    { plateCode: "AA", platePrefix: "AA", city: "Kedu", wilayah: 3 },
    { plateCode: "AB", platePrefix: "AB", city: "Yogyakarta", wilayah: 3 },
    { plateCode: "AD", platePrefix: "AD", city: "Surakarta", wilayah: 3 },
    { plateCode: "AE", platePrefix: "AE", city: "Madiun", wilayah: 3 },
    { plateCode: "AG", platePrefix: "AG", city: "Kediri", wilayah: 3 },
    { plateCode: "B", platePrefix: "B-", city: "Jakarta", wilayah: 2 },
    { plateCode: "BA", platePrefix: "BA", city: "Sumatra Barat", wilayah: 1 },
    { plateCode: "BB", platePrefix: "BB", city: "Sumatra Utara", wilayah: 1 },
    { plateCode: "BD", platePrefix: "BD", city: "Bengkulu", wilayah: 1 },
    { plateCode: "BE", platePrefix: "BE", city: "Lampung", wilayah: 1 },
    { plateCode: "BG", platePrefix: "BG", city: "Sumatra Selatan", wilayah: 1 },
    { plateCode: "BH", platePrefix: "BH", city: "Jambi", wilayah: 1 },
    { plateCode: "BK", platePrefix: "BK", city: "Sumatra Utara", wilayah: 1 },
    { plateCode: "BL", platePrefix: "BL", city: "Aceh", wilayah: 1 },
    { plateCode: "BM", platePrefix: "BM", city: "Riau", wilayah: 1 },
    { plateCode: "BN", platePrefix: "BN", city: "Bangka", wilayah: 1 },
    { plateCode: "BP", platePrefix: "BP", city: "Riau Islands", wilayah: 1 },
    { plateCode: "D", platePrefix: "D-", city: "Bandung", wilayah: 2 },
    { plateCode: "DA", platePrefix: "DA", city: "Kalimantan Selatan", wilayah: 3 },
    { plateCode: "DB", platePrefix: "DB", city: "Minahasa", wilayah: 3 },
    { plateCode: "DC", platePrefix: "DC", city: "Sulawesi Barat", wilayah: 3 },
    { plateCode: "DD", platePrefix: "DD", city: "Sulawesi Selatan", wilayah: 3 },
    { plateCode: "DE", platePrefix: "DE", city: "Maluku Selatan", wilayah: 3 },
    { plateCode: "DG", platePrefix: "DG", city: "Maluku Utara", wilayah: 3 },
    { plateCode: "DH", platePrefix: "DH", city: "Maluku Timur", wilayah: 3 },
    { plateCode: "DK", platePrefix: "DK", city: "Bali", wilayah: 3 },
    { plateCode: "DL", platePrefix: "DL", city: "Sangihe/Talaud", wilayah: 3 },
    { plateCode: "DM", platePrefix: "DM", city: "Sulawesi Utara", wilayah: 3 },
    { plateCode: "DN", platePrefix: "DN", city: "Sulawesi Tengah", wilayah: 3 },
    { plateCode: "DR", platePrefix: "DR", city: "Lombok", wilayah: 3 },
    { plateCode: "DS", platePrefix: "DS", city: "Papua", wilayah: 3 },
    { plateCode: "DT", platePrefix: "DT", city: "Sulawesi Tenggara", wilayah: 3 },
    { plateCode: "DW", platePrefix: "DW", city: "Sulawesi Selatan (bagian tengah)", wilayah: 3 },
    { plateCode: "DP", platePrefix: "DP", city: "Sulawesi Selatan (bagian utara)", wilayah: 3 },
    { plateCode: "E", platePrefix: "E-", city: "Cirebon", wilayah: 2 },
    { plateCode: "EA", platePrefix: "EA", city: "Sumbawa", wilayah: 3 },
    { plateCode: "EB", platePrefix: "EB", city: "Flores", wilayah: 3 },
    { plateCode: "ED", platePrefix: "ED", city: "Sumba", wilayah: 3 },
    { plateCode: "F", platePrefix: "F-", city: "Bogor", wilayah: 2 },
    { plateCode: "G", platePrefix: "G-", city: "Pekalongan", wilayah: 3 },
    { plateCode: "H", platePrefix: "H-", city: "Semarang", wilayah: 3 },
    { plateCode: "K", platePrefix: "K-", city: "Pati", wilayah: 3 },
    { plateCode: "KB", platePrefix: "KB", city: "Kalimantan Barat", wilayah: 3 },
    { plateCode: "KH", platePrefix: "KH", city: "Kalimantan Tengah", wilayah: 3 },
    { plateCode: "KT", platePrefix: "KT", city: "Kalimantan Timur", wilayah: 3 },
    { plateCode: "KU", platePrefix: "KU", city: "Kalimantan Utara", wilayah: 3 },
    { plateCode: "L", platePrefix: "L-", city: "Surabaya", wilayah: 3 },
    { plateCode: "M", platePrefix: "M-", city: "Madura", wilayah: 3 },
    { plateCode: "N", platePrefix: "N-", city: "Malang", wilayah: 3 },
    { plateCode: "P", platePrefix: "P-", city: "Besuki", wilayah: 3 },
    { plateCode: "PB", platePrefix: "PB", city: "Papua Barat", wilayah: 3 },
    { plateCode: "R", platePrefix: "R-", city: "Banyumas", wilayah: 3 },
    { plateCode: "S", platePrefix: "S-", city: "Bojonegoro", wilayah: 3 },
    { plateCode: "T", platePrefix: "T-", city: "Kerawang", wilayah: 2 },
    { plateCode: "W", platePrefix: "W-", city: "Sidoarjo", wilayah: 3 },
    { plateCode: "Z", platePrefix: "Z-", city: "Tasikmalaya", wilayah: 2 },
  ];

  let regionCount = 0;
  for (const mapping of regionMappings) {
    await db.regionMapping.upsert({
      where: { plateCode: mapping.plateCode },
      update: { city: mapping.city, wilayah: mapping.wilayah, platePrefix: mapping.platePrefix },
      create: mapping,
    });
    regionCount++;
  }
  console.log(`  Upserted: ${regionCount} region mappings`);

  // ─── MotorRate (from db.motor - both Comprehensive and TLO) ───
  console.log("\n[3] MotorRate (from Excel DELA db.motor)...");
  const motorRates = [
    // Comprehensive (Comp) - Non Bus dan Non Truk
    { coverageType: "Comprehensive", category: 1, vehicleType: "Non Bus dan Non Truk", coverageMin: 0, coverageMax: 125000000, rateWilayah1: 0.0382, rateWilayah2: 0.0326, rateWilayah3: 0.0253, rateAtasWilayah1: 0.042, rateAtasWilayah2: 0.0359, rateAtasWilayah3: 0.0278 },
    { coverageType: "Comprehensive", category: 2, vehicleType: "Non Bus dan Non Truk", coverageMin: 125000001, coverageMax: 200000000, rateWilayah1: 0.0267, rateWilayah2: 0.0247, rateWilayah3: 0.0269, rateAtasWilayah1: 0.0294, rateAtasWilayah2: 0.0272, rateAtasWilayah3: 0.0296 },
    { coverageType: "Comprehensive", category: 3, vehicleType: "Non Bus dan Non Truk", coverageMin: 200000001, coverageMax: 400000000, rateWilayah1: 0.0218, rateWilayah2: 0.0208, rateWilayah3: 0.0179, rateAtasWilayah1: 0.024, rateAtasWilayah2: 0.0229, rateAtasWilayah3: 0.0197 },
    { coverageType: "Comprehensive", category: 4, vehicleType: "Non Bus dan Non Truk", coverageMin: 400000001, coverageMax: 800000000, rateWilayah1: 0.012, rateWilayah2: 0.012, rateWilayah3: 0.0114, rateAtasWilayah1: 0.0132, rateAtasWilayah2: 0.0132, rateAtasWilayah3: 0.0125 },
    { coverageType: "Comprehensive", category: 5, vehicleType: "Non Bus dan Non Truk", coverageMin: 800000001, coverageMax: 999999999, rateWilayah1: 0.0105, rateWilayah2: 0.0105, rateWilayah3: 0.0105, rateAtasWilayah1: 0.0116, rateAtasWilayah2: 0.0116, rateAtasWilayah3: 0.0116 },
    // Comprehensive - Truk dan Pick Up
    { coverageType: "Comprehensive", category: 6, vehicleType: "Truk dan Pick Up", coverageMin: 0, coverageMax: 999999999, rateWilayah1: 0.0242, rateWilayah2: 0.0239, rateWilayah3: 0.0223, rateAtasWilayah1: 0.0267, rateAtasWilayah2: 0.0263, rateAtasWilayah3: 0.0246 },
    // Comprehensive - Bus
    { coverageType: "Comprehensive", category: 7, vehicleType: "Bus", coverageMin: 0, coverageMax: 999999999, rateWilayah1: 0.0104, rateWilayah2: 0.0104, rateWilayah3: 0.0088, rateAtasWilayah1: 0.0114, rateAtasWilayah2: 0.0114, rateAtasWilayah3: 0.0097 },
    // Comprehensive - Kendaraan Roda 2
    { coverageType: "Comprehensive", category: 8, vehicleType: "Kendaraan Roda 2", coverageMin: 0, coverageMax: 999999999, rateWilayah1: 0.0318, rateWilayah2: 0.0318, rateWilayah3: 0.0318, rateAtasWilayah1: 0.035, rateAtasWilayah2: 0.035, rateAtasWilayah3: 0.035 },
    // TLO - Non Bus dan Non Truk
    { coverageType: "TLO", category: 1, vehicleType: "Non Bus dan Non Truk", coverageMin: 0, coverageMax: 125000000, rateWilayah1: 0.0047, rateWilayah2: 0.0065, rateWilayah3: 0.0051, rateAtasWilayah1: null, rateAtasWilayah2: null, rateAtasWilayah3: null },
    { coverageType: "TLO", category: 2, vehicleType: "Non Bus dan Non Truk", coverageMin: 125000001, coverageMax: 200000000, rateWilayah1: 0.0063, rateWilayah2: 0.0044, rateWilayah3: 0.0044, rateAtasWilayah1: null, rateAtasWilayah2: null, rateAtasWilayah3: null },
    { coverageType: "TLO", category: 3, vehicleType: "Non Bus dan Non Truk", coverageMin: 200000001, coverageMax: 400000000, rateWilayah1: 0.0041, rateWilayah2: 0.0038, rateWilayah3: 0.0029, rateAtasWilayah1: null, rateAtasWilayah2: null, rateAtasWilayah3: null },
    { coverageType: "TLO", category: 4, vehicleType: "Non Bus dan Non Truk", coverageMin: 400000001, coverageMax: 800000000, rateWilayah1: 0.0025, rateWilayah2: 0.0025, rateWilayah3: 0.0023, rateAtasWilayah1: null, rateAtasWilayah2: null, rateAtasWilayah3: null },
    { coverageType: "TLO", category: 5, vehicleType: "Non Bus dan Non Truk", coverageMin: 800000001, coverageMax: 999999999, rateWilayah1: 0.002, rateWilayah2: 0.002, rateWilayah3: 0.002, rateAtasWilayah1: null, rateAtasWilayah2: null, rateAtasWilayah3: null },
    // TLO - Truk dan Pick Up
    { coverageType: "TLO", category: 6, vehicleType: "Truk dan Pick Up", coverageMin: 0, coverageMax: 999999999, rateWilayah1: 0.0088, rateWilayah2: 0.0168, rateWilayah3: 0.0081, rateAtasWilayah1: null, rateAtasWilayah2: null, rateAtasWilayah3: null },
    // TLO - Bus
    { coverageType: "TLO", category: 7, vehicleType: "Bus", coverageMin: 0, coverageMax: 999999999, rateWilayah1: 0.0023, rateWilayah2: 0.0023, rateWilayah3: 0.0018, rateAtasWilayah1: null, rateAtasWilayah2: null, rateAtasWilayah3: null },
    // TLO - Kendaraan Roda 2
    { coverageType: "TLO", category: 8, vehicleType: "Kendaraan Roda 2", coverageMin: 0, coverageMax: 999999999, rateWilayah1: 0.0176, rateWilayah2: 0.018, rateWilayah3: 0.0067, rateAtasWilayah1: null, rateAtasWilayah2: null, rateAtasWilayah3: null },
  ];

  let motorCount = 0;
  for (const rate of motorRates) {
    const existing = await db.motorRate.findFirst({
      where: { coverageType: rate.coverageType, category: rate.category, vehicleType: rate.vehicleType },
    });
    if (existing) {
      await db.motorRate.update({
        where: { id: existing.id },
        data: {
          rateWilayah1: rate.rateWilayah1,
          rateWilayah2: rate.rateWilayah2,
          rateWilayah3: rate.rateWilayah3,
          rateAtasWilayah1: rate.rateAtasWilayah1,
          rateAtasWilayah2: rate.rateAtasWilayah2,
          rateAtasWilayah3: rate.rateAtasWilayah3,
          coverageMin: rate.coverageMin,
          coverageMax: rate.coverageMax,
        },
      });
      console.log(`  ✅ Updated: ${rate.coverageType} Cat ${rate.category} ${rate.vehicleType}`);
    } else {
      await db.motorRate.create({ data: rate });
      console.log(`  ✅ Created: ${rate.coverageType} Cat ${rate.category} ${rate.vehicleType}`);
    }
    motorCount++;
  }
  console.log(`  Total processed: ${motorCount}`);

  // ─── LoadingRate ───
  console.log("\n[4] LoadingRate...");
  const loadingRates = [
    { minAge: 6, maxAge: 99, loadingPercent: 0.05, coverageType: "Comprehensive", description: "Loading 5% per tahun di atas usia 5 tahun (linear)" },
  ];

  for (const rate of loadingRates) {
    const existing = await db.loadingRate.findFirst({
      where: { coverageType: rate.coverageType },
    });
    if (existing) {
      await db.loadingRate.update({
        where: { id: existing.id },
        data: rate,
      });
      console.log(`  ✅ Updated: ${rate.description}`);
    } else {
      await db.loadingRate.create({ data: rate });
      console.log(`  ✅ Created: ${rate.description}`);
    }
  }

  // ─── AddonRate (from db.flood, db.eq + Sheet1 rates) ───
  console.log("\n[5] AddonRate (from Excel DELA db.flood, db.eq, Sheet1)...");

  // First, delete all existing addon rates to start fresh (structure changed significantly)
  await db.addonRate.deleteMany({});
  console.log("  Cleared existing addon rates");

  const addonRates = [
    // Flood (Banjir & Angin Kencang) — from db.flood
    // Comprehensive per wilayah
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "Comprehensive", wilayah: 1, rate: 0.00075 },
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "Comprehensive", wilayah: 2, rate: 0.001 },
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "Comprehensive", wilayah: 3, rate: 0.00075 },
    // TLO per wilayah
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "TLO", wilayah: 1, rate: 0.0005 },
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "TLO", wilayah: 2, rate: 0.00075 },
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "TLO", wilayah: 3, rate: 0.0005 },

    // Earthquake (Gempa Bumi & Tsunami) — from db.eq
    // Comprehensive per wilayah
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "Comprehensive", wilayah: 1, rate: 0.0012 },
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "Comprehensive", wilayah: 2, rate: 0.001 },
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "Comprehensive", wilayah: 3, rate: 0.00075 },
    // TLO per wilayah
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "TLO", wilayah: 1, rate: 0.00085 },
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "TLO", wilayah: 2, rate: 0.00075 },
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "TLO", wilayah: 3, rate: 0.0005 },

    // SRCC (Kerusuhan & Huru-Hara) — from Sheet1: 0.0005 flat
    { addonKey: "srcc", addonLabel: "Kerusuhan & Huru-Hara (SRCC)", coverageType: "Comprehensive", wilayah: 0, rate: 0.0005 },
    { addonKey: "srcc", addonLabel: "Kerusuhan & Huru-Hara (SRCC)", coverageType: "TLO", wilayah: 0, rate: 0.0005 },

    // Terrorism (Terorisme & Sabotase) — from Sheet1: 0.0005 flat
    { addonKey: "terrorism", addonLabel: "Terorisme & Sabotase", coverageType: "Comprehensive", wilayah: 0, rate: 0.0005 },
    { addonKey: "terrorism", addonLabel: "Terorisme & Sabotase", coverageType: "TLO", wilayah: 0, rate: 0.0005 },

    // Bengkel Authorized — from Sheet1: 0.001 flat
    { addonKey: "bengkelAuthorized", addonLabel: "Bengkel Resmi / Authorized", coverageType: "Comprehensive", wilayah: 0, rate: 0.001 },
  ];

  let addonCount = 0;
  for (const rate of addonRates) {
    await db.addonRate.create({ data: rate });
    addonCount++;
  }
  console.log(`  Created: ${addonCount} addon rates`);

  // ─── TplRate (from db.tpl) ───
  console.log("\n[6] TplRate (from Excel DELA db.tpl)...");

  // Delete existing and recreate with correct tiered structure
  await db.tplRate.deleteMany({});
  console.log("  Cleared existing TPL rates");

  const tplRates = [
    // Passenger & Motorcycle — 4 tiers
    { vehicleCategory: "Passenger & Motorcycle", coverageMin: 0, coverageMax: 25000000, rate: 0.01 },
    { vehicleCategory: "Passenger & Motorcycle", coverageMin: 25000001, coverageMax: 50000000, rate: 0.005 },
    { vehicleCategory: "Passenger & Motorcycle", coverageMin: 50000001, coverageMax: 100000000, rate: 0.0025 },
    { vehicleCategory: "Passenger & Motorcycle", coverageMin: 100000001, coverageMax: 1000000000, rate: 0.000625 },
    // Bus / Truck — 4 tiers
    { vehicleCategory: "Bus / Truck", coverageMin: 0, coverageMax: 25000000, rate: 0.015 },
    { vehicleCategory: "Bus / Truck", coverageMin: 25000001, coverageMax: 50000000, rate: 0.0075 },
    { vehicleCategory: "Bus / Truck", coverageMin: 50000001, coverageMax: 100000000, rate: 0.00375 },
    { vehicleCategory: "Bus / Truck", coverageMin: 100000001, coverageMax: 1000000000, rate: 0.000625 },
    // PLL (Personal Liability) — 4 tiers
    { vehicleCategory: "PLL", coverageMin: 0, coverageMax: 25000000, rate: 0.005 },
    { vehicleCategory: "PLL", coverageMin: 25000001, coverageMax: 50000000, rate: 0.0025 },
    { vehicleCategory: "PLL", coverageMin: 50000001, coverageMax: 100000000, rate: 0.00125 },
    { vehicleCategory: "PLL", coverageMin: 100000001, coverageMax: 1000000000, rate: 0.000625 },
  ];

  let tplCount = 0;
  for (const rate of tplRates) {
    await db.tplRate.create({ data: rate });
    tplCount++;
  }
  console.log(`  Created: ${tplCount} TPL rates (incl. PLL)`);

  // ─── InsurancePartner (unchanged) ───
  console.log("\n[7] InsurancePartner...");
  const partners = [
    {
      name: "Sinar Mas", slug: "sinar-mas", status: "active",
      benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
      facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
      modifier: 1.0, addonModifier: 1.0, adminFee: 50000,
      description: "Asuransi Sinar Mas - Proteksi terpercaya untuk kendaraan Anda", sortOrder: 1,
    },
    {
      name: "Allianz", slug: "allianz", status: "active",
      benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
      facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
      modifier: 1.0, addonModifier: 1.0, adminFee: 75000,
      description: "Allianz - Solusi asuransi global terpercaya", sortOrder: 2,
    },
    {
      name: "Tokio Marine", slug: "tokio-marine", status: "active",
      benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
      facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
      modifier: 1.0, addonModifier: 1.0, adminFee: 60000,
      description: "Tokio Marine - Asuransi dari Jepang dengan standar kualitas tinggi", sortOrder: 3,
    },
    {
      name: "AXA Mandiri", slug: "axa-mandiri", status: "active",
      benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
      facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
      modifier: 1.0, addonModifier: 1.0, adminFee: 65000,
      description: "AXA Mandiri - Perlindungan terbaik dari kolaborasi global dan lokal", sortOrder: 4,
    },
    {
      name: "Sompo", slug: "sompo", status: "active",
      benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
      facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
      modifier: 1.0, addonModifier: 1.0, adminFee: 55000,
      description: "Sompo Insurance - Asuransi kendaraan dari Jepang", sortOrder: 5,
    },
  ];

  let partnerCount = 0;
  for (const partner of partners) {
    const existing = await db.insurancePartner.findUnique({ where: { slug: partner.slug } });
    if (!existing) {
      await db.insurancePartner.create({ data: partner });
      partnerCount++;
    }
  }
  console.log(`  Created: ${partnerCount} | Skipped: ${partners.length - partnerCount}`);

  // ─── Summary ───
  console.log("\n" + "═".repeat(60));
  console.log("  SEED SUMMARY — Excel DELA (Final)");
  console.log("═".repeat(60));
  const counts = {
    rateSettings: await db.rateSettings.count(),
    regionMappings: await db.regionMapping.count(),
    motorRates: await db.motorRate.count(),
    loadingRates: await db.loadingRate.count(),
    addonRates: await db.addonRate.count(),
    tplRates: await db.tplRate.count(),
    partners: await db.insurancePartner.count(),
  };
  console.log(`  RateSettings:   ${counts.rateSettings}`);
  console.log(`  RegionMappings: ${counts.regionMappings}`);
  console.log(`  MotorRates:     ${counts.motorRates}`);
  console.log(`  LoadingRates:   ${counts.loadingRates}`);
  console.log(`  AddonRates:     ${counts.addonRates}`);
  console.log(`  TplRates:       ${counts.tplRates}`);
  console.log(`  Partners:       ${counts.partners}`);
  console.log("═".repeat(60));

  await db.$disconnect();
}

main().catch(async (e) => {
  console.error("Fatal error:", e);
  await db.$disconnect();
  process.exit(1);
});
