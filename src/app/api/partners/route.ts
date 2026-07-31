import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Removed force-dynamic — cache public requests at edge, bypass for admin.

// GET /api/partners — Public endpoint for active partners (no auth required)
// Public homepage requests (active=true) cached at edge for 5 min to
// eliminate ~3s DB latency on subsequent page loads.
export async function GET(request: NextRequest) {
  const start = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";

    const [partners, total] = await Promise.all([
      db.insurancePartner.findMany({
        where: activeOnly ? { status: "active" } : undefined,
        orderBy: { sortOrder: "asc" },
        take: 50,
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          status: true,
          benefits: true,
          facilities: true,
          description: true,
          sortOrder: true,
        },
      }),
      db.insurancePartner.count({ where: activeOnly ? { status: "active" } : undefined }),
    ]);

    const elapsed = Date.now() - start;
    console.log(`[PERF] GET /api/partners: ${elapsed}ms (total=${total})`);

    const headers =
      activeOnly
        ? { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" }
        : { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" };

    return NextResponse.json({ partners, total }, { headers });
  } catch (error) {
    console.error("GET /api/partners error:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}
