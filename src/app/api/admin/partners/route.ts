import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// GET /api/admin/partners — List partners (admin only)
export async function GET() {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    // Try with addon rate overrides first, fall back to basic query
    let partners;
    let total;
    try {
      [partners, total] = await Promise.all([
        db.insurancePartner.findMany({
          orderBy: { sortOrder: "asc" },
          include: { addonRateOverrides: { where: { isActive: true }, orderBy: { addonKey: "asc" } } },
          take: 100,
        }),
        db.insurancePartner.count(),
      ]);
    } catch {
      // Fallback if addonRateOverrides table doesn't exist yet
      [partners, total] = await Promise.all([
        db.insurancePartner.findMany({
          orderBy: { sortOrder: "asc" },
          take: 100,
        }),
        db.insurancePartner.count(),
      ]);
    }

    return NextResponse.json({ partners, total });
  } catch (error) {
    console.error("GET /api/admin/partners error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/partners — Create partner (admin only)
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { name, slug, logoUrl, status, benefits, facilities, modifier, addonModifier, adminFee, description, sortOrder } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Nama dan slug wajib diisi" },
        { status: 400 }
      );
    }

    const existing = await db.insurancePartner.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 400 });
    }

    const partner = await db.insurancePartner.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        logoUrl: logoUrl || null,
        status: status || "active",
        benefits: benefits || null,
        facilities: facilities || null,
        modifier: modifier ?? 1.0,
        addonModifier: addonModifier ?? 1.0,
        adminFee: adminFee ?? 50000,
        description: description || null,
        sortOrder: sortOrder ?? 0,
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ partner }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/partners error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
