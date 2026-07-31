import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/article-categories — list categories with article count
export async function GET() {
  try {
    const categories = await db.articleCategory.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Gagal memuat kategori" },
      { status: 500 }
    );
  }
}

// POST /api/article-categories — create category
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { name, slug, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    let categorySlug = slug;
    if (!categorySlug) {
      categorySlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Check slug uniqueness
    const existing = await db.articleCategory.findUnique({
      where: { slug: categorySlug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Slug kategori sudah digunakan" },
        { status: 400 }
      );
    }

    const category = await db.articleCategory.create({
      data: {
        name,
        slug: categorySlug,
        description: description || null,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Gagal membuat kategori" },
      { status: 500 }
    );
  }
}
