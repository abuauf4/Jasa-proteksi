import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/region-mappings — List all region mappings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wilayah = searchParams.get("wilayah");

    const where: any = {};
    if (wilayah) where.wilayah = parseInt(wilayah);

    const [mappings, total] = await Promise.all([
      db.regionMapping.findMany({
        where,
        orderBy: [{ wilayah: "asc" }, { plateCode: "asc" }],
        take: 500,
      }),
      db.regionMapping.count({ where }),
    ]);

    const response = NextResponse.json({ mappings, total });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("GET /api/region-mappings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch region mappings" },
      { status: 500 }
    );
  }
}

// POST /api/region-mappings — Create a new region mapping
export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const { plateCode, platePrefix, city, wilayah } = body;

    if (!plateCode || !platePrefix || !city || wilayah === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: plateCode, platePrefix, city, wilayah" },
        { status: 400 }
      );
    }

    const mapping = await db.regionMapping.create({
      data: {
        plateCode,
        platePrefix,
        city,
        wilayah: parseInt(wilayah),
      },
    });

    return NextResponse.json({ mapping }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/region-mappings error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Plate code already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create region mapping" },
      { status: 500 }
    );
  }
}

// PUT /api/region-mappings — Update a region mapping by id
export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await request.json();
    const { id, wilayah, city, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const existing = await db.regionMapping.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Region mapping not found" },
        { status: 404 }
      );
    }

    const data: any = {};
    if (wilayah !== undefined) data.wilayah = parseInt(wilayah);
    if (city !== undefined) data.city = city;
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await db.regionMapping.update({
      where: { id },
      data,
    });

    return NextResponse.json({ mapping: updated });
  } catch (error) {
    console.error("PUT /api/region-mappings error:", error);
    return NextResponse.json(
      { error: "Failed to update region mapping" },
      { status: 500 }
    );
  }
}

// DELETE /api/region-mappings — Soft delete
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

    const existing = await db.regionMapping.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Region mapping not found" },
        { status: 404 }
      );
    }

    const updated = await db.regionMapping.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ mapping: updated });
  } catch (error) {
    console.error("DELETE /api/region-mappings error:", error);
    return NextResponse.json(
      { error: "Failed to delete region mapping" },
      { status: 500 }
    );
  }
}
