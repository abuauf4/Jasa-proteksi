import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Auto-seed region mappings if empty
async function ensureRegionSeeded() {
  const count = await db.regionMapping.count();
  if (count === 0) {
    // Basic seed - full seed should be done via prisma/seed-rates.ts
    const basicRegions = [
      { plateCode: "B", platePrefix: "B-", city: "Jakarta", wilayah: 2 },
      { plateCode: "D", platePrefix: "D-", city: "Bandung", wilayah: 2 },
      { plateCode: "L", platePrefix: "L-", city: "Surabaya", wilayah: 3 },
      { plateCode: "A", platePrefix: "A-", city: "Banten", wilayah: 2 },
      { plateCode: "F", platePrefix: "F-", city: "Bogor", wilayah: 2 },
      { plateCode: "H", platePrefix: "H-", city: "Semarang", wilayah: 3 },
      { plateCode: "E", platePrefix: "E-", city: "Cirebon", wilayah: 2 },
      { plateCode: "N", platePrefix: "N-", city: "Malang", wilayah: 3 },
      { plateCode: "T", platePrefix: "T-", city: "Kerawang", wilayah: 2 },
      { plateCode: "Z", platePrefix: "Z-", city: "Tasikmalaya", wilayah: 2 },
      { plateCode: "BB", platePrefix: "BB", city: "Sumatra Utara", wilayah: 1 },
      { plateCode: "BA", platePrefix: "BA", city: "Sumatra Barat", wilayah: 1 },
      { plateCode: "DK", platePrefix: "DK", city: "Bali", wilayah: 3 },
      { plateCode: "KT", platePrefix: "KT", city: "Kalimantan Timur", wilayah: 3 },
      { plateCode: "DA", platePrefix: "DA", city: "Kalimantan Selatan", wilayah: 3 },
    ];
    await db.regionMapping.createMany({
      data: basicRegions.map(r => ({ ...r, isActive: true })),
      skipDuplicates: true,
    });
  }
}

// GET /api/vehicles/plates — List all plate codes with region info
export async function GET(request: NextRequest) {
  try {
    await ensureRegionSeeded();

    const regions = await db.regionMapping.findMany({
      where: { isActive: true },
      orderBy: [{ wilayah: "asc" }, { plateCode: "asc" }],
      take: 200,
    });

    // Group by wilayah for easier frontend consumption
    const grouped = {
      1: regions.filter(r => r.wilayah === 1),
      2: regions.filter(r => r.wilayah === 2),
      3: regions.filter(r => r.wilayah === 3),
    };

    const wilayahLabels: Record<number, string> = {
      1: "Wilayah 1 — Sumatera & Kepulauan sekitarnya",
      2: "Wilayah 2 — DKI Jakarta, Banten, Jawa Barat",
      3: "Wilayah 3 — Di Luar Wilayah 1 dan 2",
    };

    const response = NextResponse.json({
      plates: regions,
      grouped,
      wilayahLabels,
      total: regions.length,
    });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("GET /api/vehicles/plates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch plate regions" },
      { status: 500 }
    );
  }
}
