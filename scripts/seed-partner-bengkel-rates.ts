/**
 * Seed per-partner bengkelAuthorized (Bengkel Resmi) rate overrides.
 *
 * Confirmed by owner on 2026-08-01:
 *   - Mega Insurance:    0.1%   (max 10 thn)
 *   - Multi Artha Guna:  default 0.1% (max 3 thn)
 *   - Sahabat:           0.1%   (max 5 thn)
 *   - Zurich Syariah:    0.15%  (max 10 thn)
 *   - ACA:               default 0.1% (max 10 thn)
 *   - Sinarmas:          0.5%   (max 10 thn)
 *   - Tugu:              0.15%  (max 5 thn)
 *   - Oona:              0.1%   (max 5 thn)
 *
 * Run with:  bun run scripts/seed-partner-bengkel-rates.ts
 *
 * Idempotent — upserts by (partnerId, addonKey).
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// slug must match InsurancePartner.slug in DB
const PARTNER_RATES: Array<{ slug: string; name: string; rate: number }> = [
  { slug: "sinarmas",         name: "Sinarmas",          rate: 0.005  },
  { slug: "mega-insurance",   name: "Mega Insurance",    rate: 0.001  },
  { slug: "zurich-syariah",   name: "Zurich Syariah",   rate: 0.0015 },
  { slug: "tugu",             name: "Tugu",              rate: 0.0015 },
  { slug: "sahabat",          name: "Sahabat",           rate: 0.001  },
  { slug: "oona",             name: "Oona",              rate: 0.001  },
  // MAG & ACA use global default 0.1% — not seeded (engine falls back to global rate)
];

async function main() {
  console.log("Seeding per-partner bengkelAuthorized rates...");

  for (const entry of PARTNER_RATES) {
    const partner = await db.insurancePartner.findUnique({
      where: { slug: entry.slug },
    });
    if (!partner) {
      console.warn(`  ⚠️  Partner not found in DB: ${entry.name} (slug: ${entry.slug}) — skipping`);
      continue;
    }

    // Upsert PartnerAddonRate for bengkelAuthorized
    const existing = await db.partnerAddonRate.findUnique({
      where: {
        partnerId_addonKey: {
          partnerId: partner.id,
          addonKey: "bengkelAuthorized",
        },
      },
    });

    if (existing) {
      await db.partnerAddonRate.update({
        where: { id: existing.id },
        data: { rate: entry.rate, addonLabel: "Bengkel Resmi", isActive: true },
      });
      console.log(`  ✓ Updated ${entry.name}: bengkelAuthorized rate = ${(entry.rate * 100).toFixed(2)}%`);
    } else {
      await db.partnerAddonRate.create({
        data: {
          partnerId: partner.id,
          addonKey: "bengkelAuthorized",
          addonLabel: "Bengkel Resmi",
          rate: entry.rate,
          isActive: true,
        },
      });
      console.log(`  ✓ Created ${entry.name}: bengkelAuthorized rate = ${(entry.rate * 100).toFixed(2)}%`);
    }
  }

  console.log("\nDone.");
  console.log("Note: MAG (Multi Artha Guna) & ACA use the global default rate (0.1%) — no PartnerAddonRate record needed.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
