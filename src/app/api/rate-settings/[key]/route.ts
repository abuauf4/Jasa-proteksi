import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/rate-settings/[key] — Get a single rate setting by key
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const setting = await db.rateSettings.findUnique({ where: { key } });

    if (!setting) {
      return NextResponse.json(
        { error: "Rate setting not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({ setting });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("GET /api/rate-settings/[key] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rate setting" },
      { status: 500 }
    );
  }
}
