import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products as staticProducts } from "@/lib/products";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

// Force dynamic rendering for admin requests (active=false); cache public
// requests (active=true) at Vercel edge for 5 minutes.
// Removed: export const dynamic = "force-dynamic";

// Auto-seed products from static data if DB is empty
async function ensureSeeded() {
  const count = await db.product.count();
  if (count === 0) {
    console.log("[Products API] Seeding products from static data...");
    await db.product.createMany({
      data: staticProducts.map((p) => ({
        name: p.name,
        slug: p.slug,
        category: p.category,
        description: p.description,
        benefits: typeof p.benefits === "string" ? p.benefits : JSON.stringify(p.benefits || []),
        estimatedPrice: p.estimatedPrice,
        minimumOfferPrice: p.minimumOfferPrice,
        isActive: p.isActive ?? true,
      })),
    });
  }
}

// GET /api/products — List all products
// Public homepage requests (active=true) cached at edge for 5 min to
// eliminate ~3s DB latency on subsequent page loads. Admin requests
// (active=false) bypass cache to always see latest data.
export async function GET(request: NextRequest) {
  try {
    await ensureSeeded();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";

    const products = await db.product.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const headers =
      activeOnly
        ? { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" }
        : { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" };

    return NextResponse.json({ products }, { headers });
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
    const { session, error } = await requireAdmin();
    if (error) return error;

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

    revalidatePath("/", "layout");
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
