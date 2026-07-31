import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/addon-rates — List all addon rates with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coverageType = searchParams.get("coverageType");
    const addonKey = searchParams.get("addonKey");

    const where: any = {};
    if (coverageType) where.coverageType = coverageType;
    if (addonKey) where.addonKey = addonKey;

    const [rates, total] = await Promise.all([
      db.addonRate.findMany({
        where,
        orderBy: [{ addonKey: "asc" }, { coverageType: "asc" }, { wilayah: "asc" }],
        take: 500,
      }),
      db.addonRate.count({ where }),
    ]);

    const response = NextResponse.json({ rates, total });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("GET /api/addon-rates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch addon rates" },
      { status: 500 }
    );
  }
}

// POST /api/addon-rates — Create a new addon rate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addonKey, addonLabel, coverageType, wilayah, rate, fixedAmount } = body;

    if (!addonKey || !addonLabel || !coverageType || wilayah === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: addonKey, addonLabel, coverageType, wilayah" },
        { status: 400 }
      );
    }

    const addonRate = await db.addonRate.create({
      data: {
        addonKey,
        addonLabel,
        coverageType,
        wilayah: parseInt(wilayah),
        rate: parseFloat(rate) || 0,
        fixedAmount: fixedAmount ? parseInt(fixedAmount) : null,
      },
    });

    return NextResponse.json({ rate: addonRate }, { status: 201 });
  } catch (error) {
    console.error("POST /api/addon-rates error:", error);
    return NextResponse.json(
      { error: "Failed to create addon rate" },
      { status: 500 }
    );
  }
}

// PUT /api/addon-rates — Update an addon rate by id
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

    const existing = await db.addonRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Addon rate not found" },
        { status: 404 }
      );
    }

    const data: any = {};
    if (rate !== undefined) data.rate = parseFloat(rate);
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await db.addonRate.update({
      where: { id },
      data,
    });

    return NextResponse.json({ rate: updated });
  } catch (error) {
    console.error("PUT /api/addon-rates error:", error);
    return NextResponse.json(
      { error: "Failed to update addon rate" },
      { status: 500 }
    );
  }
}

// DELETE /api/addon-rates — Soft delete
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

    const existing = await db.addonRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Addon rate not found" },
        { status: 404 }
      );
    }

    const updated = await db.addonRate.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ rate: updated });
  } catch (error) {
    console.error("DELETE /api/addon-rates error:", error);
    return NextResponse.json(
      { error: "Failed to delete addon rate" },
      { status: 500 }
    );
  }
}
