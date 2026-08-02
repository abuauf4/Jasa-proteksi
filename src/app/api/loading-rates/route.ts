import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/loading-rates — List all loading rates
export async function GET() {
  try {
    const [rates, total] = await Promise.all([
      db.loadingRate.findMany({
        orderBy: [{ coverageType: "asc" }, { minAge: "asc" }],
        take: 500,
      }),
      db.loadingRate.count(),
    ]);

    const response = NextResponse.json({ rates, total });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("GET /api/loading-rates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch loading rates" },
      { status: 500 }
    );
  }
}

// POST /api/loading-rates — Create a new loading rate
export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const { minAge, maxAge, loadingPercent, coverageType, description } = body;

    if (minAge === undefined || maxAge === undefined || loadingPercent === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: minAge, maxAge, loadingPercent" },
        { status: 400 }
      );
    }

    const rate = await db.loadingRate.create({
      data: {
        minAge: parseInt(minAge),
        maxAge: parseInt(maxAge),
        loadingPercent: parseFloat(loadingPercent),
        coverageType: coverageType || "Comprehensive",
        description: description || null,
      },
    });

    return NextResponse.json({ rate }, { status: 201 });
  } catch (error) {
    console.error("POST /api/loading-rates error:", error);
    return NextResponse.json(
      { error: "Failed to create loading rate" },
      { status: 500 }
    );
  }
}

// PUT /api/loading-rates — Update a loading rate by id
export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const { id, loadingPercent, minAge, maxAge, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const existing = await db.loadingRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Loading rate not found" },
        { status: 404 }
      );
    }

    const data: any = {};
    if (loadingPercent !== undefined) data.loadingPercent = parseFloat(loadingPercent);
    if (minAge !== undefined) data.minAge = parseInt(minAge);
    if (maxAge !== undefined) data.maxAge = parseInt(maxAge);
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await db.loadingRate.update({
      where: { id },
      data,
    });

    return NextResponse.json({ rate: updated });
  } catch (error) {
    console.error("PUT /api/loading-rates error:", error);
    return NextResponse.json(
      { error: "Failed to update loading rate" },
      { status: 500 }
    );
  }
}

// DELETE /api/loading-rates — Soft delete
export async function DELETE(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const existing = await db.loadingRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Loading rate not found" },
        { status: 404 }
      );
    }

    const updated = await db.loadingRate.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ rate: updated });
  } catch (error) {
    console.error("DELETE /api/loading-rates error:", error);
    return NextResponse.json(
      { error: "Failed to delete loading rate" },
      { status: 500 }
    );
  }
}
