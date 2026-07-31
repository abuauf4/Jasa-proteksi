import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

// DELETE /api/media/[id] — delete media
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const existing = await db.media.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Media tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.media.delete({ where: { id } });

    return NextResponse.json({ message: "Media berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Gagal menghapus media" },
      { status: 500 }
    );
  }
}
