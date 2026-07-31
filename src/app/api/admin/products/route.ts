import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// GET /api/admin/products — List all products (admin only)
export async function GET() {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const products = await db.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST /api/admin/products — Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { name, slug, category, description, benefits, estimatedPrice, minimumOfferPrice, isActive, sortOrder } = body;

    if (!name || !slug || !category) {
      return NextResponse.json(
        { error: "Nama, slug, dan kategori wajib diisi" },
        { status: 400 }
      );
    }

    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        category: category.trim(),
        description: description || "",
        benefits: benefits || "[]",
        estimatedPrice: estimatedPrice ? parseInt(estimatedPrice) : 0,
        minimumOfferPrice: minimumOfferPrice ? parseInt(minimumOfferPrice) : 0,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : 0,
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PATCH /api/admin/products — Update product (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { id, name, slug, category, description, benefits, estimatedPrice, minimumOfferPrice, isActive, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ error: "ID produk wajib diisi" }, { status: 400 });
    }

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (description !== undefined) updateData.description = description;
    if (benefits !== undefined) updateData.benefits = benefits;
    if (estimatedPrice !== undefined) updateData.estimatedPrice = parseInt(estimatedPrice);
    if (minimumOfferPrice !== undefined) updateData.minimumOfferPrice = parseInt(minimumOfferPrice);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder);

    const product = await db.product.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ product });
  } catch (error) {
    console.error("PATCH /api/admin/products error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
