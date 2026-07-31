import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// GET /api/admin/rates/addon — List all AddonRate rows (admin only)
export async function GET() {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const rates = await db.addonRate.findMany({
      orderBy: [{ addonKey: "asc" }, { coverageType: "asc" }, { wilayah: "asc" }],
    });

    return NextResponse.json({ rates });
  } catch (error) {
    console.error("GET /api/admin/rates/addon error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/admin/rates/addon — Create new AddonRate (admin only)
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { addonKey, addonLabel, coverageType, wilayah, rate, fixedAmount, isActive } = body;

    if (!addonKey || !addonLabel || !coverageType || wilayah === undefined || rate === undefined) {
      return NextResponse.json(
        { error: "Semua field wajib diisi (addonKey, addonLabel, coverageType, wilayah, rate)" },
        { status: 400 }
      );
    }

    const addonRate = await db.addonRate.create({
      data: {
        addonKey,
        addonLabel,
        coverageType,
        wilayah: parseInt(wilayah),
        rate: parseFloat(rate),
        fixedAmount: fixedAmount !== undefined && fixedAmount !== null && fixedAmount !== "" ? parseInt(fixedAmount) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ rate: addonRate }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/rates/addon error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PATCH /api/admin/rates/addon — Update AddonRate (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { id, addonKey, addonLabel, coverageType, wilayah, rate, fixedAmount, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID rate wajib diisi" }, { status: 400 });
    }

    const existing = await db.addonRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Rate addon tidak ditemukan" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (addonKey !== undefined) updateData.addonKey = addonKey;
    if (addonLabel !== undefined) updateData.addonLabel = addonLabel;
    if (coverageType !== undefined) updateData.coverageType = coverageType;
    if (wilayah !== undefined) updateData.wilayah = parseInt(wilayah);
    if (rate !== undefined) updateData.rate = parseFloat(rate);
    if (fixedAmount !== undefined) updateData.fixedAmount = fixedAmount !== null && fixedAmount !== "" ? parseInt(fixedAmount) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await db.addonRate.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ rate: updated });
  } catch (error) {
    console.error("PATCH /api/admin/rates/addon error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
