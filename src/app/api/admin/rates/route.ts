import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// GET /api/admin/rates — List rates (admin only)
export async function GET() {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const [rates, total] = await Promise.all([
      db.insuranceRate.findMany({
        orderBy: [{ category: "asc" }, { coverageType: "asc" }, { key: "asc" }],
        take: 500,
      }),
      db.insuranceRate.count(),
    ]);

    return NextResponse.json({ rates, total });
  } catch (error) {
    console.error("GET /api/admin/rates error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/rates — Create rate (admin only)
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { category, coverageType, key, label, value, config, isActive } = body;

    if (!category || !coverageType || !key || !label || value === undefined) {
      return NextResponse.json(
        { error: "Category, coverageType, key, label, dan value wajib diisi" },
        { status: 400 }
      );
    }

    const existing = await db.insuranceRate.findUnique({
      where: { category_coverageType_key: { category, coverageType, key } },
    });
    if (existing) {
      return NextResponse.json({ error: "Rate dengan kombinasi category/coverageType/key sudah ada" }, { status: 400 });
    }

    const rate = await db.insuranceRate.create({
      data: {
        category,
        coverageType,
        key,
        label,
        value: parseFloat(value),
        config: config || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ rate }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/rates error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/rates — Update rate (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { id, label, value, config, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Rate ID wajib diisi" }, { status: 400 });
    }

    const existing = await db.insuranceRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Rate tidak ditemukan" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (label !== undefined) updateData.label = label;
    if (value !== undefined) updateData.value = parseFloat(value);
    if (config !== undefined) updateData.config = config;
    if (isActive !== undefined) updateData.isActive = isActive;

    const rate = await db.insuranceRate.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ rate });
  } catch (error) {
    console.error("PATCH /api/admin/rates error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
