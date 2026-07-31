import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/tpl-rates — List all TPL rates
export async function GET() {
  try {
    const [rates, total] = await Promise.all([
      db.tplRate.findMany({
        orderBy: [{ vehicleCategory: "asc" }, { coverageMin: "asc" }],
        take: 500,
      }),
      db.tplRate.count(),
    ]);

    const response = NextResponse.json({ rates, total });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("GET /api/tpl-rates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch TPL rates" },
      { status: 500 }
    );
  }
}

// POST /api/tpl-rates — Create a new TPL rate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleCategory, coverageMin, coverageMax, rate } = body;

    if (!vehicleCategory || coverageMin === undefined || coverageMax === undefined || rate === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: vehicleCategory, coverageMin, coverageMax, rate" },
        { status: 400 }
      );
    }

    const tplRate = await db.tplRate.create({
      data: {
        vehicleCategory,
        coverageMin: BigInt(coverageMin),
        coverageMax: BigInt(coverageMax),
        rate: parseFloat(rate),
      },
    });

    return NextResponse.json({ rate: tplRate }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tpl-rates error:", error);
    return NextResponse.json(
      { error: "Failed to create TPL rate" },
      { status: 500 }
    );
  }
}

// PUT /api/tpl-rates — Update a TPL rate by id
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, rate, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const existing = await db.tplRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "TPL rate not found" },
        { status: 404 }
      );
    }

    const data: any = {};
    if (rate !== undefined) data.rate = parseFloat(rate);
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await db.tplRate.update({
      where: { id },
      data,
    });

    return NextResponse.json({ rate: updated });
  } catch (error) {
    console.error("PUT /api/tpl-rates error:", error);
    return NextResponse.json(
      { error: "Failed to update TPL rate" },
      { status: 500 }
    );
  }
}

// DELETE /api/tpl-rates — Soft delete
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const existing = await db.tplRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "TPL rate not found" },
        { status: 404 }
      );
    }

    const updated = await db.tplRate.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ rate: updated });
  } catch (error) {
    console.error("DELETE /api/tpl-rates error:", error);
    return NextResponse.json(
      { error: "Failed to delete TPL rate" },
      { status: 500 }
    );
  }
}
