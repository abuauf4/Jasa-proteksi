import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

// PUT /api/article-categories/[id] — update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { name, slug, description } = body;

    const existing = await db.articleCategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    // If changing slug, check uniqueness
    if (slug && slug !== existing.slug) {
      const slugExists = await db.articleCategory.findUnique({
        where: { slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: "Slug kategori sudah digunakan" },
          { status: 400 }
        );
      }
    }

    const category = await db.articleCategory.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description: description || null }),
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kategori" },
      { status: 500 }
    );
  }
}

// DELETE /api/article-categories/[id] — delete category
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const existing = await db.articleCategory.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existing._count.articles > 0) {
      return NextResponse.json(
        { error: `Kategori ini masih memiliki ${existing._count.articles} artikel. Pindahkan atau hapus artikel terlebih dahulu.` },
        { status: 400 }
      );
    }

    await db.articleCategory.delete({ where: { id } });

    return NextResponse.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}
