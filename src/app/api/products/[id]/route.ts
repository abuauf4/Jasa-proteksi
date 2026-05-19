import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/products/[id] — Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id] — Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.benefits !== undefined) {
      updateData.benefits = typeof body.benefits === "string" ? body.benefits : JSON.stringify(body.benefits);
    }
    if (body.estimatedPrice !== undefined) updateData.estimatedPrice = Number(body.estimatedPrice);
    if (body.minimumOfferPrice !== undefined) updateData.minimumOfferPrice = Number(body.minimumOfferPrice);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const product = await db.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("PUT /api/products/[id] error:", error);
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id] — Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
