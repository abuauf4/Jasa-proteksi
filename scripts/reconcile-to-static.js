/**
 * Reconcile DB data to match STATIC code (ground truth)
 * 
 * Static code is authoritative per business decision.
 * This script updates all DB tables to match static values.
 * 
 * Usage: DATABASE_URL="..." node scripts/reconcile-to-static.js
 */

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL not set");
  process.exit(1);
}

const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  console.log("═".repeat(60));
  console.log("  RECONCILE DB → STATIC (Ground Truth)");
  console.log("═".repeat(60));

  // ═══════════════════════════════════════════
  // 1. PARTNERS — Replace DB partners with static PARTNERS
  // ═══════════════════════════════════════════
  console.log("\n[1] Insurance Partners — Replace with static...");

  // Static PARTNERS from route.ts
  const STATIC_PARTNERS = [
    {
      name: "Sinarmas", slug: "sinarmas", status: "active",
      benefits: JSON.stringify(["Klaim cepat 7 hari kerja", "Bengkel rekanan luas", "Roadside assistance 24/7"]),
      facilities: JSON.stringify(["Free derep 50km", "Penggantian kendaraan"]),
      modifier: 1.0, addonModifier: 1.0, adminFee: 50000,
      description: "Asuransi Sinarmas - Proteksi terpercaya", sortOrder: 1,
    },
    {
      name: "Multi Artha Graha", slug: "multi-artha-global", status: "active",
      benefits: JSON.stringify(["Proteksi komprehensif", "Jaringan bengkel premium", "Klaim tanpa survei di bawah 5jt"]),
      facilities: JSON.stringify(["Free derep 100km", "Penggantian kendaraan 7 hari"]),
      modifier: 1.0, addonModifier: 1.0, adminFee: 50000,
      description: "Multi Artha Graha - Proteksi komprehensif", sortOrder: 2,
    },
    {
      name: "ACA", slug: "aca", status: "active",
      benefits: JSON.stringify(["Perlindungan global", "Bengkel authorized dealer", "Cashless klaim di semua bengkel"]),
      facilities: JSON.stringify(["Free derep unlimited", "Penggantian kendaraan 14 hari"]),
      modifier: 1.0, addonModifier: 1.0, adminFee: 50000,
      description: "ACA - Asuransi Central Asia", sortOrder: 3,
    },
    {
      name: "SOMPO", slug: "sompo", status: "active",
      benefits: JSON.stringify(["Jaminan luas", "Layanan klaim profesional", "Jaringan bengkel nasional"]),
      facilities: JSON.stringify(["Free derep 75km", "Penggantian kendaraan 10 hari"]),
      modifier: 1.0, addonModifier: 1.0, adminFee: 50000,
      description: "SOMPO Insurance - Asuransi kendaraan dari Jepang", sortOrder: 4,
    },
    {
      name: "Oona", slug: "oona", status: "active",
      benefits: JSON.stringify(["Proteksi digital-first", "Proses klaim cepat", "Coverage fleksibel"]),
      facilities: JSON.stringify(["Free derep 50km", "Penggantian kendaraan 7 hari"]),
      modifier: 1.0, addonModifier: 1.0, adminFee: 50000,
      description: "Oona - Asuransi digital-first", sortOrder: 5,
    },
  ];

  // Delete all existing partners first
  const deleteResult = await db.$executeRawUnsafe(`DELETE FROM ins_insurance_partners`);
  console.log(`  Deleted: ${deleteResult} old partners`);

  // Insert static partners
  for (const p of STATIC_PARTNERS) {
    await db.$executeRawUnsafe(`
      INSERT INTO ins_insurance_partners (id, name, slug, "logoUrl", status, benefits, facilities, modifier, "addonModifier", "adminFee", description, "sortOrder", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${esc(p.name)}, ${esc(p.slug)}, NULL, ${esc(p.status)}, ${esc(p.benefits)}, ${esc(p.facilities)}, ${p.modifier}, ${p.addonModifier}, ${p.adminFee}, ${esc(p.description)}, ${p.sortOrder}, NOW(), NOW())
    `);
  }
  console.log(`  Inserted: ${STATIC_PARTNERS.length} static partners`);

  // Verify
  const partnerCount = await db.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM ins_insurance_partners`);
  console.log(`  ✓ Total partners now: ${partnerCount[0].cnt}`);

  // ═══════════════════════════════════════════
  // 2. RATE SETTINGS — Update discount to 25%, admin fee to 50000
  // ═══════════════════════════════════════════
  console.log("\n[2] Rate Settings — Update to match static...");

  // Static code: discountPercent = 25%, adminFee = 50000, policyFee = 0
  await db.$executeRawUnsafe(`UPDATE ins_rate_settings SET value = 0.25, "updatedAt" = NOW() WHERE key = 'discountPercent'`);
  console.log(`  ✓ discountPercent → 0.25 (25%)`);

  await db.$executeRawUnsafe(`UPDATE ins_rate_settings SET value = 50000, "updatedAt" = NOW() WHERE key = 'adminFee'`);
  console.log(`  ✓ adminFee → 50000`);

  // policyFee stays 0 — already correct

  // Verify
  const settings = await db.$queryRawUnsafe(`SELECT key, value FROM ins_rate_settings ORDER BY key`);
  for (const s of settings) {
    console.log(`    ${s.key} = ${s.value}`);
  }

  // ═══════════════════════════════════════════
  // 3. LOADING RATES — Replace with single row matching static formula
  // ═══════════════════════════════════════════
  console.log("\n[3] Loading Rates — Replace with static logic (5%/year linear from age 6)...");

  // Static: loadingRate = baseRate * ((vehicleAge - 5) * 0.05)
  // DB code: yearsAboveThreshold = vehicleAge - (minAge - 1)
  // With single row minAge=6: yearsAboveThreshold = vehicleAge - 5 ← MATCHES!
  await db.$executeRawUnsafe(`DELETE FROM ins_loading_rates`);
  await db.$executeRawUnsafe(`
    INSERT INTO ins_loading_rates (id, "minAge", "maxAge", "loadingPercent", "coverageType", description, "isActive", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), 6, 99, 0.05, 'Comprehensive', 'Loading 5% per tahun di atas usia 5 tahun (linear)', true, NOW(), NOW())
  `);
  console.log(`  ✓ Single row: minAge=6, maxAge=99, loadingPercent=5% → matches static formula`);

  // ═══════════════════════════════════════════
  // 4. ADDON RATES — Replace with static flat rates
  // ═══════════════════════════════════════════
  console.log("\n[4] Addon Rates — Replace with static flat rates...");

  // Static STATIC_ADDON_RATES from route.ts
  const STATIC_ADDON_RATES = [
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "All", wilayah: 0, rate: 0.001 },
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "All", wilayah: 0, rate: 0.0015 },
    { addonKey: "srcc", addonLabel: "Kerusuhan & Huru-Hara", coverageType: "All", wilayah: 0, rate: 0.0005 },
    { addonKey: "terrorism", addonLabel: "Terorisme & Sabotase", coverageType: "All", wilayah: 0, rate: 0.0005 },
    { addonKey: "bengkelAuthorized", addonLabel: "Bengkel Resmi", coverageType: "All", wilayah: 0, rate: 0.001 },
    // Also add Comprehensive-specific entries (same rate, for when engine filters by coverageType)
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "Comprehensive", wilayah: 0, rate: 0.001 },
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "Comprehensive", wilayah: 0, rate: 0.0015 },
    { addonKey: "srcc", addonLabel: "Kerusuhan & Huru-Hara", coverageType: "Comprehensive", wilayah: 0, rate: 0.0005 },
    { addonKey: "terrorism", addonLabel: "Terorisme & Sabotase", coverageType: "Comprehensive", wilayah: 0, rate: 0.0005 },
    { addonKey: "bengkelAuthorized", addonLabel: "Bengkel Resmi", coverageType: "Comprehensive", wilayah: 0, rate: 0.001 },
    // TLO coverage — static applies to Comprehensive+All, but add TLO for completeness
    { addonKey: "flood", addonLabel: "Banjir & Angin Kencang", coverageType: "TLO", wilayah: 0, rate: 0.001 },
    { addonKey: "earthquake", addonLabel: "Gempa Bumi & Tsunami", coverageType: "TLO", wilayah: 0, rate: 0.0015 },
    { addonKey: "srcc", addonLabel: "Kerusuhan & Huru-Hara", coverageType: "TLO", wilayah: 0, rate: 0.0005 },
    { addonKey: "terrorism", addonLabel: "Terorisme & Sabotase", coverageType: "TLO", wilayah: 0, rate: 0.0005 },
  ];

  await db.$executeRawUnsafe(`DELETE FROM ins_addon_rates`);

  for (const a of STATIC_ADDON_RATES) {
    await db.$executeRawUnsafe(`
      INSERT INTO ins_addon_rates (id, "addonKey", "addonLabel", "coverageType", "wilayah", rate, "isActive", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${esc(a.addonKey)}, ${esc(a.addonLabel)}, ${esc(a.coverageType)}, ${a.wilayah}, ${a.rate}, true, NOW(), NOW())
    `);
  }
  console.log(`  ✓ Inserted: ${STATIC_ADDON_RATES.length} addon rate rows (flat rates, no per-wilayah)`);

  // ═══════════════════════════════════════════
  // 5. TPL RATES — Replace with flat 1% (matching static)
  // ═══════════════════════════════════════════
  console.log("\n[5] TPL Rates — Replace with flat 1%...");

  // Static: tplPremium = tplCoverageAmount * 0.01
  // Use single tier 0 to 999999999 with rate 0.01
  await db.$executeRawUnsafe(`DELETE FROM ins_tpl_rates`);

  const TPL_RATES = [
    { vehicleCategory: "Passenger & Motorcycle", coverageMin: 0, coverageMax: 999999999, rate: 0.01 },
    { vehicleCategory: "Bus / Truck", coverageMin: 0, coverageMax: 999999999, rate: 0.01 },
  ];

  for (const t of TPL_RATES) {
    await db.$executeRawUnsafe(`
      INSERT INTO ins_tpl_rates (id, "vehicleCategory", "coverageMin", "coverageMax", rate, "isActive", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${esc(t.vehicleCategory)}, ${t.coverageMin}, ${t.coverageMax}, ${t.rate}, true, NOW(), NOW())
    `);
  }
  console.log(`  ✓ Inserted: ${TPL_RATES.length} TPL rate rows (flat 1% for all)`);

  // ═══════════════════════════════════════════
  // 6. VERIFY — Show final state
  // ═══════════════════════════════════════════
  console.log("\n" + "═".repeat(60));
  console.log("  VERIFICATION — Final DB State");
  console.log("═".repeat(60));

  const counts = {
    partners: (await db.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM ins_insurance_partners`))[0].cnt,
    motorRates: (await db.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM ins_motor_rates`))[0].cnt,
    loadingRates: (await db.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM ins_loading_rates`))[0].cnt,
    addonRates: (await db.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM ins_addon_rates`))[0].cnt,
    tplRates: (await db.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM ins_tpl_rates`))[0].cnt,
    rateSettings: (await db.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM ins_rate_settings`))[0].cnt,
    regionMappings: (await db.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM ins_region_mappings`))[0].cnt,
    partnerAddonRates: (await db.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM ins_partner_addon_rates`))[0].cnt,
    insuranceRates: (await db.$queryRawUnsafe(`SELECT COUNT(*)::int as cnt FROM ins_insurance_rates`))[0].cnt,
  };

  console.log(`  Partners:          ${counts.partners} (was 5, now static list)`);
  console.log(`  Motor Rates:       ${counts.motorRates} (unchanged — already matched)`);
  console.log(`  Loading Rates:     ${counts.loadingRates} (was 3 tiered, now 1 linear)`);
  console.log(`  Addon Rates:       ${counts.addonRates} (was 19 per-wilayah, now flat)`);
  console.log(`  TPL Rates:         ${counts.tplRates} (was 10 tiered, now 2 flat)`);
  console.log(`  Rate Settings:     ${counts.rateSettings} (updated discount & admin fee)`);
  console.log(`  Region Mappings:   ${counts.regionMappings} (unchanged — already matched)`);
  console.log(`  Partner Addons:    ${counts.partnerAddonRates}`);
  console.log(`  Insurance Rates:   ${counts.insuranceRates}`);

  // Show partners
  console.log("\n  Partners:");
  const partners = await db.$queryRawUnsafe(`SELECT name, modifier, "adminFee" FROM ins_insurance_partners ORDER BY "sortOrder"`);
  for (const p of partners) {
    console.log(`    ${p.name}: modifier=${p.modifier}, adminFee=${p.adminFee}`);
  }

  // Show addon rates
  console.log("\n  Addon Rates:");
  const addons = await db.$queryRawUnsafe(`SELECT DISTINCT "addonKey", "addonLabel", rate FROM ins_addon_rates ORDER BY "addonKey"`);
  for (const a of addons) {
    console.log(`    ${a.addonKey}: ${(a.rate * 100).toFixed(2)}% — ${a.addonLabel}`);
  }

  // Show loading
  console.log("\n  Loading Rate:");
  const loading = await db.$queryRawUnsafe(`SELECT * FROM ins_loading_rates`);
  for (const l of loading) {
    console.log(`    Age ${l.minAge}-${l.maxAge}: ${(l.loadingPercent * 100).toFixed(0)}%/year — ${l.description}`);
  }

  // Show TPL
  console.log("\n  TPL Rates:");
  const tpl = await db.$queryRawUnsafe(`SELECT * FROM ins_tpl_rates`);
  for (const t of tpl) {
    console.log(`    ${t.vehicleCategory}: ${(t.rate * 100).toFixed(0)}% flat`);
  }

  console.log("\n═".repeat(60));
  console.log("  RECONCILIATION COMPLETE");
  console.log("═".repeat(60));

  await db.$disconnect();
}

// SQL escape helper
function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

main().catch(async (e) => {
  console.error("FATAL:", e.message);
  await db.$disconnect();
  process.exit(1);
});
