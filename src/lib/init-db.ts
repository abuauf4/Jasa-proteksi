/**
 * Database Initialization for Supabase PostgreSQL
 *
 * With Supabase PostgreSQL, tables are managed by Prisma migrations.
 * This module ensures:
 *   1. The rate configuration data is seeded if tables are empty
 *   2. Product data is seeded if Product table is empty
 *
 * No more raw SQL table creation — Prisma handles schema via `prisma db push`.
 */

import { db } from "./db";
import { ensureSeedData } from "./auto-seed";

let initPromise: Promise<void> | null = null;
let isInitialized = false;

/**
 * Initialize the database for Supabase PostgreSQL.
 * - Seeds rate data if tables are empty
 *
 * Call this at the top of any API route that needs database access.
 */
export async function initDatabase(): Promise<void> {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Quick check: try to count MotorRate — if it works and has data, we're good
      const count = await db.motorRate.count();
      if (count > 0) {
        isInitialized = true;
        return; // Tables exist and have data — all good
      }
      // Tables exist but are empty — need seeding
      await ensureSeedData();
      isInitialized = true;
    } catch (error) {
      console.error("[init-db] Initialization failed:", error);
      initPromise = null; // Reset so it can retry
    }
  })();

  return initPromise;
}
