import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

// GET — list all SEO entries
export async function GET() {
  try {
    const entries = await db.seoMeta.findMany({ orderBy: { page: "asc" } });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("SEO GET error:", error);
    return NextResponse.json({ error: "Gagal memuat data SEO" }, { status: 500 });
  }
}

// PUT — upsert SEO for a page (expects { page, metaTitle, metaDescription, keywords, ogImage })
export async function PUT(request: Request) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { page, metaTitle, metaDescription, keywords, ogImage } = body;

    if (!page) {
      return NextResponse.json({ error: "Page wajib diisi" }, { status: 400 });
    }

    const entry = await db.seoMeta.upsert({
      where: { page },
      update: {
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        keywords: keywords || null,
        ogImage: ogImage || null,
      },
      create: {
        page,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        keywords: keywords || null,
        ogImage: ogImage || null,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("SEO PUT error:", error);
    return NextResponse.json({ error: "Gagal menyimpan data SEO" }, { status: 500 });
  }
}
