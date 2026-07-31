import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { requireAdmin } from "@/lib/auth-helpers";

// PUT — update user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { name, role, isActive, password } = body;

    // Check user exists
    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    // If password change
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
      }
      const hashedPassword = await hash(password, 10);
      await db.user.update({
        where: { id },
        data: { password: hashedPassword },
      });
      return NextResponse.json({ success: true, message: "Password berhasil diubah" });
    }

    // General update — only allow admin or sales role
    const updateData: { name?: string; role?: string; isActive?: boolean } = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) {
      updateData.role = role === "admin" ? "admin" : "sales";
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, username: true, role: true, isActive: true, createdAt: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("User PUT error:", error);
    return NextResponse.json({ error: "Gagal mengupdate pengguna" }, { status: 500 });
  }
}

// DELETE — delete user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    // Prevent self-deletion
    if (existing.id === session.user.id) {
      return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
    }

    await db.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User DELETE error:", error);
    return NextResponse.json({ error: "Gagal menghapus pengguna" }, { status: 500 });
  }
}
