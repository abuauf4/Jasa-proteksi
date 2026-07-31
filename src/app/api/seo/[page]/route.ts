import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET — single page SEO
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;
    const entry = await db.seoMeta.findUnique({ where: { page } });

    if (!entry) {
      return NextResponse.json({ page, metaTitle: null, metaDescription: null, keywords: null, ogImage: null });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error("SEO [page] GET error:", error);
    return NextResponse.json({ error: "Gagal memuat data SEO" }, { status: 500 });
  }
}
