import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/motor-rates — List all motor rates with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coverageType = searchParams.get("coverageType");
    const vehicleType = searchParams.get("vehicleType");
    const category = searchParams.get("category");

    const where: any = {};
    if (coverageType) where.coverageType = coverageType;
    if (vehicleType) where.vehicleType = vehicleType;
    if (category) where.category = parseInt(category);

    const [rates, total] = await Promise.all([
      db.motorRate.findMany({
        where,
        orderBy: [
          { coverageType: "asc" },
          { category: "asc" },
          { coverageMin: "asc" },
        ],
        take: 500,
      }),
      db.motorRate.count({ where }),
    ]);

    const response = NextResponse.json({ rates, total });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("GET /api/motor-rates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch motor rates" },
      { status: 500 }
    );
  }
}

// POST /api/motor-rates — Create a new motor rate
export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const {
      coverageType,
      category,
      vehicleType,
      coverageMin,
      coverageMax,
      rateWilayah1,
      rateWilayah2,
      rateWilayah3,
    } = body;

    if (!coverageType || !vehicleType || category === undefined || coverageMin === undefined || coverageMax === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: coverageType, category, vehicleType, coverageMin, coverageMax" },
        { status: 400 }
      );
    }

    const rate = await db.motorRate.create({
      data: {
        coverageType,
        category: parseInt(category),
        vehicleType,
        coverageMin: BigInt(coverageMin),
        coverageMax: BigInt(coverageMax),
        rateWilayah1: parseFloat(rateWilayah1) || 0,
        rateWilayah2: parseFloat(rateWilayah2) || 0,
        rateWilayah3: parseFloat(rateWilayah3) || 0,
      },
    });

    return NextResponse.json({ rate }, { status: 201 });
  } catch (error) {
    console.error("POST /api/motor-rates error:", error);
    return NextResponse.json(
      { error: "Failed to create motor rate" },
      { status: 500 }
    );
  }
}

// PUT /api/motor-rates — Update a motor rate by id
export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const { id, rateWilayah1, rateWilayah2, rateWilayah3, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const existing = await db.motorRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Motor rate not found" },
        { status: 404 }
      );
    }

    const data: any = {};
    if (rateWilayah1 !== undefined) data.rateWilayah1 = parseFloat(rateWilayah1);
    if (rateWilayah2 !== undefined) data.rateWilayah2 = parseFloat(rateWilayah2);
    if (rateWilayah3 !== undefined) data.rateWilayah3 = parseFloat(rateWilayah3);
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await db.motorRate.update({
      where: { id },
      data,
    });

    return NextResponse.json({ rate: updated });
  } catch (error) {
    console.error("PUT /api/motor-rates error:", error);
    return NextResponse.json(
      { error: "Failed to update motor rate" },
      { status: 500 }
    );
  }
}

// DELETE /api/motor-rates — Soft delete (set isActive=false)
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

    const existing = await db.motorRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Motor rate not found" },
        { status: 404 }
      );
    }

    const updated = await db.motorRate.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ rate: updated });
  } catch (error) {
    console.error("DELETE /api/motor-rates error:", error);
    return NextResponse.json(
      { error: "Failed to delete motor rate" },
      { status: 500 }
    );
  }
}
