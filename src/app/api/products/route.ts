import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/products — List all active products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";

    const products = await db.product.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products — Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, category, description, benefits, estimatedPrice, minimumOfferPrice, isActive } = body;

    if (!name || !slug || !category || !description || estimatedPrice == null || minimumOfferPrice == null) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, category, description, estimatedPrice, minimumOfferPrice" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        category,
        description,
        benefits: typeof benefits === "string" ? benefits : JSON.stringify(benefits || []),
        estimatedPrice: Number(estimatedPrice),
        minimumOfferPrice: Number(minimumOfferPrice),
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
