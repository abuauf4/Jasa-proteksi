import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// PATCH /api/admin/partners/[id] — Update partner (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    const existing = await db.insurancePartner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Partner tidak ditemukan" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.benefits !== undefined) updateData.benefits = body.benefits;
    if (body.facilities !== undefined) updateData.facilities = body.facilities;
    if (body.modifier !== undefined) updateData.modifier = body.modifier;
    if (body.addonModifier !== undefined) updateData.addonModifier = body.addonModifier;
    if (body.adminFee !== undefined) updateData.adminFee = body.adminFee;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;

    const partner = await db.insurancePartner.update({
      where: { id },
      data: updateData,
    });

    // Handle addon rate overrides
    if (Array.isArray(body.addonRateOverrides)) {
      for (const override of body.addonRateOverrides) {
        if (!override.addonKey || override.rate === undefined || override.rate === null) continue;

        if (override._delete) {
          // Delete this override
          await db.partnerAddonRate.deleteMany({
            where: { partnerId: id, addonKey: override.addonKey },
          });
        } else {
          // Upsert: create or update
          await db.partnerAddonRate.upsert({
            where: {
              partnerId_addonKey: { partnerId: id, addonKey: override.addonKey },
            },
            create: {
              partnerId: id,
              addonKey: override.addonKey,
              addonLabel: override.addonLabel || override.addonKey,
              rate: parseFloat(String(override.rate)) || 0,
              isActive: true,
            },
            update: {
              addonLabel: override.addonLabel || override.addonKey,
              rate: parseFloat(String(override.rate)) || 0,
              isActive: true,
            },
          });
        }
      }
    }

    // Return partner with updated overrides
    const updatedPartner = await db.insurancePartner.findUnique({
      where: { id },
      include: { addonRateOverrides: { where: { isActive: true }, orderBy: { addonKey: "asc" } } },
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ partner: updatedPartner });
  } catch (error) {
    console.error("PATCH /api/admin/partners/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/partners/[id] — Delete partner (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;

    const existing = await db.insurancePartner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Partner tidak ditemukan" }, { status: 404 });
    }

    // Delete addon rate overrides first (cascade should handle this, but be safe)
    await db.partnerAddonRate.deleteMany({ where: { partnerId: id } });

    // Delete the partner
    await db.insurancePartner.delete({ where: { id } });

    revalidatePath("/", "layout");
    return NextResponse.json({ message: "Partner berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/admin/partners/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
