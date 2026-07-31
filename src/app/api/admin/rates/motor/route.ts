import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// GET /api/admin/rates/motor — List all MotorRate rows (admin only)
export async function GET() {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const rates = await db.motorRate.findMany({
      orderBy: [{ coverageType: "asc" }, { category: "asc" }, { vehicleType: "asc" }],
    });

    return NextResponse.json({ rates });
  } catch (error) {
    console.error("GET /api/admin/rates/motor error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/admin/rates/motor — Create new MotorRate (admin only)
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

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
      rateAtasWilayah1,
      rateAtasWilayah2,
      rateAtasWilayah3,
      isActive,
    } = body;

    if (!coverageType || !vehicleType || category === undefined || coverageMin === undefined || coverageMax === undefined || rateWilayah1 === undefined || rateWilayah2 === undefined || rateWilayah3 === undefined) {
      return NextResponse.json(
        { error: "Semua field wajib diisi (coverageType, category, vehicleType, coverageMin, coverageMax, rateWilayah1-3)" },
        { status: 400 }
      );
    }

    const rate = await db.motorRate.create({
      data: {
        coverageType,
        category: parseInt(category),
        vehicleType,
        coverageMin: parseInt(coverageMin),
        coverageMax: parseInt(coverageMax),
        rateWilayah1: parseFloat(rateWilayah1),
        rateWilayah2: parseFloat(rateWilayah2),
        rateWilayah3: parseFloat(rateWilayah3),
        rateAtasWilayah1: rateAtasWilayah1 !== undefined && rateAtasWilayah1 !== null && rateAtasWilayah1 !== "" ? parseFloat(rateAtasWilayah1) : null,
        rateAtasWilayah2: rateAtasWilayah2 !== undefined && rateAtasWilayah2 !== null && rateAtasWilayah2 !== "" ? parseFloat(rateAtasWilayah2) : null,
        rateAtasWilayah3: rateAtasWilayah3 !== undefined && rateAtasWilayah3 !== null && rateAtasWilayah3 !== "" ? parseFloat(rateAtasWilayah3) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ rate }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/rates/motor error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PATCH /api/admin/rates/motor — Update MotorRate (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const {
      id,
      coverageType,
      category,
      vehicleType,
      coverageMin,
      coverageMax,
      rateWilayah1,
      rateWilayah2,
      rateWilayah3,
      rateAtasWilayah1,
      rateAtasWilayah2,
      rateAtasWilayah3,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID rate wajib diisi" }, { status: 400 });
    }

    const existing = await db.motorRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Rate tidak ditemukan" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (coverageType !== undefined) updateData.coverageType = coverageType;
    if (category !== undefined) updateData.category = parseInt(category);
    if (vehicleType !== undefined) updateData.vehicleType = vehicleType;
    if (coverageMin !== undefined) updateData.coverageMin = parseInt(coverageMin);
    if (coverageMax !== undefined) updateData.coverageMax = parseInt(coverageMax);
    if (rateWilayah1 !== undefined) updateData.rateWilayah1 = parseFloat(rateWilayah1);
    if (rateWilayah2 !== undefined) updateData.rateWilayah2 = parseFloat(rateWilayah2);
    if (rateWilayah3 !== undefined) updateData.rateWilayah3 = parseFloat(rateWilayah3);
    if (rateAtasWilayah1 !== undefined) updateData.rateAtasWilayah1 = rateAtasWilayah1 !== null && rateAtasWilayah1 !== "" ? parseFloat(rateAtasWilayah1) : null;
    if (rateAtasWilayah2 !== undefined) updateData.rateAtasWilayah2 = rateAtasWilayah2 !== null && rateAtasWilayah2 !== "" ? parseFloat(rateAtasWilayah2) : null;
    if (rateAtasWilayah3 !== undefined) updateData.rateAtasWilayah3 = rateAtasWilayah3 !== null && rateAtasWilayah3 !== "" ? parseFloat(rateAtasWilayah3) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const rate = await db.motorRate.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ rate });
  } catch (error) {
    console.error("PATCH /api/admin/rates/motor error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
