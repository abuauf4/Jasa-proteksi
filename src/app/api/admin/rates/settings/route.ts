import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { invalidateRateSettingsCache } from "@/lib/premium-engine";

// GET /api/admin/rates/settings — List all RateSettings (admin only)
export async function GET() {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const settings = await db.rateSettings.findMany({
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/admin/rates/settings error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PATCH /api/admin/rates/settings — Update a RateSetting (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { id, label, value, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID pengaturan wajib diisi" }, { status: 400 });
    }

    const existing = await db.rateSettings.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Pengaturan tidak ditemukan" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (label !== undefined) updateData.label = label;
    if (value !== undefined) updateData.value = parseFloat(value);
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const setting = await db.rateSettings.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/", "layout");
    invalidateRateSettingsCache();
    return NextResponse.json({ setting });
  } catch (error) {
    console.error("PATCH /api/admin/rates/settings error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
