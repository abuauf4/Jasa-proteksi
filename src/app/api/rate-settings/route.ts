import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/rate-settings — List all rate settings
export async function GET() {
  try {
    const [settings, total] = await Promise.all([
      db.rateSettings.findMany({
        orderBy: [{ category: "asc" }, { key: "asc" }],
        take: 500,
      }),
      db.rateSettings.count(),
    ]);

    const response = NextResponse.json({ settings, total });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("GET /api/rate-settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rate settings" },
      { status: 500 }
    );
  }
}

// PUT /api/rate-settings — Update a rate setting by key
export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const { key, value } = body as { key: string; value: number };

    if (!key || value === undefined || value === null) {
      return NextResponse.json(
        { error: "Missing required fields: key, value" },
        { status: 400 }
      );
    }

    const existing = await db.rateSettings.findUnique({ where: { key } });
    if (!existing) {
      return NextResponse.json(
        { error: "Rate setting not found" },
        { status: 404 }
      );
    }

    const updated = await db.rateSettings.update({
      where: { key },
      data: { value: Number(value) },
    });

    return NextResponse.json({ setting: updated });
  } catch (error) {
    console.error("PUT /api/rate-settings error:", error);
    return NextResponse.json(
      { error: "Failed to update rate setting" },
      { status: 500 }
    );
  }
}
