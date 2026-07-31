import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/media — list media
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const skip = (page - 1) * limit;

    const [media, total] = await Promise.all([
      db.media.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.media.count(),
    ]);

    return NextResponse.json({
      media,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Gagal memuat media" },
      { status: 500 }
    );
  }
}

// POST /api/media — upload media (URL-based for now)
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { filename, url, alt, size, mimeType, uploadedBy } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL media wajib diisi" },
        { status: 400 }
      );
    }

    const media = await db.media.create({
      data: {
        filename: filename || url.split("/").pop() || "untitled",
        url,
        alt: alt || null,
        size: size || null,
        mimeType: mimeType || null,
        uploadedBy: uploadedBy || null,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan media" },
      { status: 500 }
    );
  }
}
