import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

// GET /api/articles — list articles with pagination, search, status filter
// Public homepage requests (status=published, no search) cached at edge for
// 5 min. Admin/search requests bypass cache for fresh data.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const categoryId = searchParams.get("categoryId") || "";

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.article.count({ where }),
    ]);

    // Cache only published-article list requests without search/category filters
    // (these are homepage/blog listing requests that don't need fresh data).
    // Admin or filtered requests bypass cache.
    const isPublicList = status === "published" && !search && !categoryId && page === 1;
    const headers = isPublicList
      ? { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" }
      : { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" };

    return NextResponse.json(
      {
        articles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { headers }
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Gagal memuat artikel" },
      { status: 500 }
    );
  }
}

// POST /api/articles — create article
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      status = "draft",
      categoryId,
      authorId,
      metaTitle,
      metaDescription,
      ogImage,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Judul artikel wajib diisi" },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    let articleSlug = slug;
    if (!articleSlug) {
      articleSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Check slug uniqueness
    const existing = await db.article.findUnique({
      where: { slug: articleSlug },
    });
    if (existing) {
      articleSlug = `${articleSlug}-${Date.now()}`;
    }

    const article = await db.article.create({
      data: {
        title,
        slug: articleSlug,
        content: content || null,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        status,
        categoryId: categoryId || null,
        authorId: authorId || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        ogImage: ogImage || null,
        publishedAt: status === "published" ? new Date() : null,
      },
      include: {
        category: true,
      },
    });

    revalidatePath("/artikel");
    revalidatePath("/", "layout");
    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Gagal membuat artikel" },
      { status: 500 }
    );
  }
}
