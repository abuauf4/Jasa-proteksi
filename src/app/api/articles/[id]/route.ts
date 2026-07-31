import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/articles/[id] — single article
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await db.article.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, name: true } },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Gagal memuat artikel" },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[id] — update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      status,
      categoryId,
      metaTitle,
      metaDescription,
      ogImage,
    } = body;

    // If changing slug, check uniqueness
    if (slug && slug !== existing.slug) {
      const slugExists = await db.article.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: "Slug sudah digunakan oleh artikel lain" },
          { status: 400 }
        );
      }
    }

    // Determine publishedAt
    let publishedAt = existing.publishedAt;
    if (status === "published" && !existing.publishedAt) {
      publishedAt = new Date();
    } else if (status === "draft" || status === "archived") {
      publishedAt = existing.publishedAt; // keep original publishedAt
    }

    const article = await db.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(coverImage !== undefined && { coverImage }),
        ...(status !== undefined && { status, publishedAt }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(ogImage !== undefined && { ogImage }),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui artikel" },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] — delete article
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.article.delete({ where: { id } });

    return NextResponse.json({ message: "Artikel berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Gagal menghapus artikel" },
      { status: 500 }
    );
  }
}
