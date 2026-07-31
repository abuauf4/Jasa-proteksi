/**
 * Idempotent Vehicle Data Import Script
 * 
 * Source: src/lib/vehicleData.json + src/lib/vehicleCodeMap.json
 * Target: ins_vehicles (via Prisma Vehicle model)
 * 
 * Features:
 * - Upsert (not blind insert) — safe to re-run
 * - No deletes — existing rows are preserved
 * - Count tracking: source, inserted, updated, skipped, final DB count
 * - Does NOT modify static fallback or calculator code
 * - Uses raw SQL for bulk upsert (fast for 13k+ records)
 * 
 * Usage:
 *   DATABASE_URL=... DIRECT_URL=... npx tsx scripts/import-vehicles.ts
 *   DATABASE_URL=... DIRECT_URL=... npx tsx scripts/import-vehicles.ts --dry-run
 */

import { PrismaClient } from "@prisma/client";
import vehiclePriceData from "../src/lib/vehicleData.json";
import vehicleCodeMap from "../src/lib/vehicleCodeMap.json";

const db = new PrismaClient();

// ─── Types ───
interface FlatVehicle {
  brand: string;
  vehicleCode: string;
  modelDescription: string;
  vehicleYear: number;
  vehicleValue: number; // in IDR (already converted from millions)
  vehicleType: string;
}

// ─── Flatten JSON → Array of FlatVehicle ───
function flattenVehicleData(): FlatVehicle[] {
  const results: FlatVehicle[] = [];
  const codeMap = vehicleCodeMap as Record<string, string>;
  const priceData = vehiclePriceData as Record<string, Record<string, Record<string, number>>>;

  for (const [brand, models] of Object.entries(priceData)) {
    for (const [modelDesc, yearPrices] of Object.entries(models)) {
      const vehicleCode = codeMap[modelDesc] || `${brand.substring(0, 3).toUpperCase()}-GEN`;

      for (const [yearStr, priceInMillions] of Object.entries(yearPrices)) {
        if (typeof priceInMillions !== "number") continue;
        const vehicleYear = parseInt(yearStr, 10);
        if (isNaN(vehicleYear)) continue;
        if (vehicleYear < 1990 || vehicleYear > 2030) continue;

        const vehicleValue = Math.round(priceInMillions * 1_000_000);

        results.push({
          brand,
          vehicleCode,
          modelDescription: modelDesc,
          vehicleYear,
          vehicleValue,
          vehicleType: "mobil",
        });
      }
    }
  }

  return results;
}

// ─── Escape single quotes for SQL ───
function escSql(str: string): string {
  return str.replace(/'/g, "''");
}

// ─── Main Import Logic ───
async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log("═".repeat(60));
  console.log("  Vehicle Data Import — Idempotent & Safe");
  console.log(`  Mode: ${isDryRun ? "DRY RUN (no DB writes)" : "LIVE"}`);
  console.log("═".repeat(60));

  // Step 1: Count current DB rows
  const existingCount = await db.vehicle.count();
  console.log(`\n[1] Current DB row count: ${existingCount}`);

  // Step 2: Flatten source data
  const flatVehicles = flattenVehicleData();
  console.log(`[2] Source JSON entries:   ${flatVehicles.length}`);

  // Step 3: Summary stats from source
  const brands = new Set(flatVehicles.map(v => v.brand));
  const models = new Set(flatVehicles.map(v => v.modelDescription));
  const uniqueCodes = new Set(flatVehicles.map(v => v.vehicleCode));
  const yearRange = {
    min: Math.min(...flatVehicles.map(v => v.vehicleYear)),
    max: Math.max(...flatVehicles.map(v => v.vehicleYear)),
  };
  console.log(`    Brands: ${brands.size} | Models: ${models.size} | Codes: ${uniqueCodes.size}`);
  console.log(`    Year range: ${yearRange.min}–${yearRange.max}`);

  // Step 4: Check for duplicate keys in source (vehicleCode + vehicleYear)
  const keyCounts = new Map<string, number>();
  for (const v of flatVehicles) {
    const key = `${v.vehicleCode}|${v.vehicleYear}`;
    keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
  }
  const duplicateKeys = [...keyCounts.entries()].filter(([, c]) => c > 1);
  if (duplicateKeys.length > 0) {
    console.log(`\n[3] ⚠️  Found ${duplicateKeys.length} duplicate (vehicleCode, vehicleYear) keys in source:`);
    for (const [key, count] of duplicateKeys.slice(0, 5)) {
      console.log(`    ${key} → appears ${count} times`);
    }
  } else {
    console.log(`\n[3] ✅ No duplicate (vehicleCode, vehicleYear) keys in source`);
  }

  if (isDryRun) {
    console.log("\n" + "─".repeat(60));
    console.log("  DRY RUN — showing first 5 records that would be upserted:");
    console.log("─".repeat(60));
    for (const v of flatVehicles.slice(0, 5)) {
      console.log(`  ${v.brand} | ${v.modelDescription} | ${v.vehicleYear} | Rp ${(v.vehicleValue / 1_000_000).toFixed(1)} jt | Code: ${v.vehicleCode}`);
    }
    console.log(`  ... and ${flatVehicles.length - 5} more`);
    console.log("\n  No DB writes performed. Re-run without --dry-run to import.");
    await db.$disconnect();
    return;
  }

  // Step 5: Bulk upsert using raw SQL (much faster than individual Prisma upserts)
  console.log(`\n[4] Starting bulk upsert import using raw SQL...`);
  
  // Get existing records for accurate counting
  const existingRecords = existingCount > 0
    ? await db.vehicle.findMany({
        select: { vehicleCode: true, vehicleYear: true, vehicleValue: true },
      })
    : [];
  const existingMap = new Map<string, number>();
  for (const r of existingRecords) {
    existingMap.set(`${r.vehicleCode}|${r.vehicleYear}`, Number(r.vehicleValue));
  }

  // Separate into inserts vs updates
  const toInsert: FlatVehicle[] = [];
  const toUpdate: FlatVehicle[] = [];
  let unchanged = 0;

  for (const v of flatVehicles) {
    const key = `${v.vehicleCode}|${v.vehicleYear}`;
    const existingValue = existingMap.get(key);
    if (existingValue === undefined) {
      toInsert.push(v);
    } else if (existingValue !== v.vehicleValue) {
      toUpdate.push(v);
    } else {
      unchanged++;
    }
  }

  console.log(`    Records to insert: ${toInsert.length}`);
  console.log(`    Records to update: ${toUpdate.length}`);
  console.log(`    Records unchanged: ${unchanged}`);

  // Bulk insert in batches using raw SQL
  const BATCH_SIZE = 500;
  let insertCount = 0;
  let updateCount = 0;
  let errors = 0;

  // Insert new records
  if (toInsert.length > 0) {
    console.log(`\n    Inserting ${toInsert.length} new records...`);
    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      const batch = toInsert.slice(i, i + BATCH_SIZE);
      const values = batch.map(v =>
        `('${v.brand.replace(/'/g, "''")}', '${escSql(v.vehicleCode)}', '${escSql(v.modelDescription)}', ${v.vehicleYear}, ${v.vehicleValue}, '${v.vehicleType}', 'Pricelist MV4 Mei 2026.pdf', 2026, true, NOW(), NOW())`
      ).join(",\n");

      const sql = `
        INSERT INTO ins_vehicles (brand, "vehicleCode", "modelDescription", "vehicleYear", "vehicleValue", "vehicleType", "sourceFile", "sourceYear", "isActive", "importedAt", "createdAt")
        VALUES
        ${values}
        ON CONFLICT ("vehicleCode", "vehicleYear") DO NOTHING
      `;

      try {
        const result = await db.$executeRawUnsafe(sql);
        insertCount += batch.length;
      } catch (error: any) {
        errors++;
        console.error(`    ❌ Insert batch error at offset ${i}: ${error?.message || error}`);
      }

      const progress = Math.min(i + BATCH_SIZE, toInsert.length);
      console.log(`    Inserted: ${progress}/${toInsert.length}`);
    }
  }

  // Update changed records
  if (toUpdate.length > 0) {
    console.log(`\n    Updating ${toUpdate.length} changed records...`);
    for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
      const batch = toUpdate.slice(i, i + BATCH_SIZE);
      const values = batch.map(v =>
        `('${escSql(v.brand)}', '${escSql(v.vehicleCode)}', '${escSql(v.modelDescription)}', ${v.vehicleYear}, ${v.vehicleValue}, '${v.vehicleType}', 'Pricelist MV4 Mei 2026.pdf', 2026, true)`
      ).join(",\n");

      const sql = `
        UPDATE ins_vehicles v
        SET 
          brand = d.brand,
          "modelDescription" = d."modelDescription",
          "vehicleValue" = d."vehicleValue",
          "vehicleType" = d."vehicleType",
          "sourceFile" = d."sourceFile",
          "sourceYear" = d."sourceYear",
          "isActive" = d."isActive",
          "updatedAt" = NOW()
        FROM (VALUES
          ${values}
        ) AS d(brand, "vehicleCode", "modelDescription", "vehicleYear", "vehicleValue", "vehicleType", "sourceFile", "sourceYear", "isActive")
        WHERE v."vehicleCode" = d."vehicleCode" AND v."vehicleYear" = d."vehicleYear"
      `;

      try {
        const result = await db.$executeRawUnsafe(sql);
        updateCount += batch.length;
      } catch (error: any) {
        errors++;
        console.error(`    ❌ Update batch error at offset ${i}: ${error?.message || error}`);
      }

      const progress = Math.min(i + BATCH_SIZE, toUpdate.length);
      console.log(`    Updated: ${progress}/${toUpdate.length}`);
    }
  }

  // Step 6: Final DB count
  const finalCount = await db.vehicle.count();

  // Step 7: Verification
  console.log(`\n[5] Verification queries...`);
  
  const dbBrands = await db.vehicle.findMany({
    select: { brand: true },
    distinct: ["brand"],
    orderBy: { brand: "asc" },
  });
  console.log(`    Brands in DB: ${dbBrands.length}`);

  const sampleToyota = await db.vehicle.findFirst({
    where: { brand: "TOYOTA" },
    orderBy: { vehicleYear: "desc" },
  });
  if (sampleToyota) {
    console.log(`    Sample: ${sampleToyota.brand} ${sampleToyota.modelDescription} ${sampleToyota.vehicleYear} = Rp ${(Number(sampleToyota.vehicleValue) / 1_000_000).toFixed(1)} jt (Code: ${sampleToyota.vehicleCode})`);
  }

  const sampleHonda = await db.vehicle.findFirst({
    where: { brand: "HONDA" },
    orderBy: { vehicleYear: "desc" },
  });
  if (sampleHonda) {
    console.log(`    Sample: ${sampleHonda.brand} ${sampleHonda.modelDescription} ${sampleHonda.vehicleYear} = Rp ${(Number(sampleHonda.vehicleValue) / 1_000_000).toFixed(1)} jt (Code: ${sampleHonda.vehicleCode})`);
  }

  const sampleBMW = await db.vehicle.findFirst({
    where: { brand: "BMW" },
    orderBy: { vehicleYear: "desc" },
  });
  if (sampleBMW) {
    console.log(`    Sample: ${sampleBMW.brand} ${sampleBMW.modelDescription} ${sampleBMW.vehicleYear} = Rp ${(Number(sampleBMW.vehicleValue) / 1_000_000).toFixed(1)} jt (Code: ${sampleBMW.vehicleCode})`);
  }

  // Spot-check 5 random records
  const randomVehicles = [...flatVehicles]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
  
  console.log(`\n    Spot-check (5 random records):`);
  let spotCheckPass = 0;
  for (const v of randomVehicles) {
    const dbRecord = await db.vehicle.findFirst({
      where: {
        vehicleCode: v.vehicleCode,
        vehicleYear: v.vehicleYear,
      },
    });
    if (dbRecord && Number(dbRecord.vehicleValue) === v.vehicleValue && dbRecord.brand === v.brand && dbRecord.modelDescription === v.modelDescription) {
      spotCheckPass++;
      console.log(`    ✅ ${v.brand} ${v.modelDescription} ${v.vehicleYear} — Rp ${v.vehicleValue.toLocaleString("id-ID")}`);
    } else {
      console.log(`    ❌ MISMATCH: ${v.brand} ${v.modelDescription} ${v.vehicleYear}`);
      console.log(`       JSON: brand=${v.brand} model=${v.modelDescription} value=${v.vehicleValue}`);
      console.log(`       DB:   brand=${dbRecord?.brand ?? "N/A"} model=${dbRecord?.modelDescription ?? "N/A"} value=${dbRecord?.vehicleValue ?? "N/A"}`);
    }
  }

  // ─── Final Report ───
  console.log("\n" + "═".repeat(60));
  console.log("  IMPORT SUMMARY");
  console.log("═".repeat(60));
  console.log(`  Source JSON entries:   ${flatVehicles.length}`);
  console.log(`  Pre-import DB count:  ${existingCount}`);
  console.log(`  Inserted (new):       ${insertCount}`);
  console.log(`  Updated (changed):    ${updateCount}`);
  console.log(`  Unchanged (skipped):  ${unchanged}`);
  console.log(`  Errors:               ${errors}`);
  console.log(`  Final DB count:       ${finalCount}`);
  console.log(`  Spot-check pass rate: ${spotCheckPass}/5`);
  console.log("═".repeat(60));

  if (finalCount >= flatVehicles.length) {
    console.log("  ✅ All source records are in the database!");
  } else {
    console.log(`  ⚠️  DB has FEWER rows than source (${finalCount} vs ${flatVehicles.length}) — check errors above`);
  }

  await db.$disconnect();
}

main().catch(async (e) => {
  console.error("Fatal error:", e);
  await db.$disconnect();
  process.exit(1);
});
