/**
 * Duplicate Follow-up Detection Script (Read-Only)
 *
 * Detects potential duplicate follow-up records based on:
 * - Same lead (leadId)
 * - Same sales (salesId)
 * - Same notes
 * - Same result
 * - Same nextFollowupDate
 * - Created within 60 seconds of each other
 *
 * Usage:
 *   npx ts-node scripts/detect-duplicate-followups.ts
 *
 * DO NOT run any DELETE statements without explicit approval.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Window in seconds — two follow-ups created within this gap are considered
// potential duplicates if all other fields match.
const DUPLICATE_WINDOW_SECONDS = 60;

async function main() {
  console.log("=== Duplicate Follow-up Detection Report ===\n");
  console.log(`Duplicate window: ${DUPLICATE_WINDOW_SECONDS}s`);
  console.log(`Run time: ${new Date().toISOString()}\n`);

  // Fetch all follow-ups ordered by leadId + createdAt for pairwise comparison
  const allFollowups = await prisma.leadFollowup.findMany({
    include: {
      lead: { select: { id: true, customerName: true } },
      sales: { select: { id: true, name: true } },
    },
    orderBy: [{ leadId: "asc" }, { createdAt: "asc" }],
  });

  console.log(`Total follow-up records: ${allFollowups.length}\n`);

  const duplicates: Array<{
    record1: (typeof allFollowups)[number];
    record2: (typeof allFollowups)[number];
    gapSeconds: number;
  }> = [];

  for (let i = 0; i < allFollowups.length - 1; i++) {
    const a = allFollowups[i];
    const b = allFollowups[i + 1];

    // Must be same lead
    if (a.leadId !== b.leadId) continue;

    // Must have same key fields
    if (
      a.notes !== b.notes ||
      a.result !== b.result ||
      a.salesId !== b.salesId
    ) continue;

    // nextFollowupDate comparison (both null or same value)
    const aNext = a.nextFollowupDate?.getTime() ?? null;
    const bNext = b.nextFollowupDate?.getTime() ?? null;
    if (aNext !== bNext) continue;

    // Must be within the window
    const gapMs = Math.abs(b.createdAt.getTime() - a.createdAt.getTime());
    const gapSeconds = gapMs / 1000;
    if (gapSeconds > DUPLICATE_WINDOW_SECONDS) continue;

    duplicates.push({ record1: a, record2: b, gapSeconds });
  }

  if (duplicates.length === 0) {
    console.log("✅ No duplicate follow-up pairs detected.\n");
  } else {
    console.log(`⚠️  Found ${duplicates.length} potential duplicate pair(s):\n`);

    for (let i = 0; i < duplicates.length; i++) {
      const { record1, record2, gapSeconds } = duplicates[i];
      console.log(`--- Duplicate Pair #${i + 1} ---`);
      console.log(`  Lead: ${record1.lead.customerName} (${record1.leadId})`);
      console.log(`  Sales: ${record1.sales?.name || "System"}`);
      console.log(`  Notes: "${record1.notes.substring(0, 80)}${record1.notes.length > 80 ? "..." : ""}"`);
      console.log(`  Result: ${record1.result || "-"}`);
      console.log(`  Next Follow-up: ${record1.nextFollowupDate?.toISOString() || "-"}`);
      console.log(`  Record A: id=${record1.id}  createdAt=${record1.createdAt.toISOString()}`);
      console.log(`  Record B: id=${record2.id}  createdAt=${record2.createdAt.toISOString()}`);
      console.log(`  Gap: ${gapSeconds.toFixed(1)}s`);
      console.log();
    }

    // Summary
    const affectedLeadIds = new Set(duplicates.map((d) => d.record1.leadId));
    console.log(`Affected leads: ${affectedLeadIds.size}`);
    console.log(`Total duplicate pairs: ${duplicates.length}`);
    console.log(`Total duplicate records (to potentially remove): ${duplicates.length}`);
  }

  console.log("\n=== End of Report ===");
  console.log("NOTE: No data was modified. To clean up duplicates, run DELETE only after approval.\n");
}

main()
  .catch((e) => {
    console.error("Script error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
