import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Require any authenticated user (admin or sales).
 * Returns session if valid, or NextResponse error if not.
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Tidak memiliki akses — silakan login" },
        { status: 401 }
      ),
    };
  }
  return { session, error: null };
}

/**
 * Require admin role only.
 * Returns session if admin, or NextResponse error if not.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Tidak memiliki akses — silakan login" },
        { status: 401 }
      ),
    };
  }
  if (session.user.role !== "admin") {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Akses ditolak — hanya admin yang bisa mengakses" },
        { status: 403 }
      ),
    };
  }
  return { session, error: null };
}
