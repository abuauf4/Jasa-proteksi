import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";

// GET /api/admin/sales — List sales users (admin only)
export async function GET(request: NextRequest) {
  const start = Date.now();
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);

    const salesUsers = await db.user.findMany({
      where: { role: "sales" },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        _count: {
          select: {
            assignedLeads: true,
            followups: true,
          },
        },
      },
    });

    const salesIds = salesUsers.map((u) => u.id);

    // Batch: active + approved leads per sales in 2 groupBy queries (replaces N+1 loop)
    const [activeLeadsBySales, approvedLeadsBySales] = await Promise.all([
      db.insuranceLead.groupBy({
        by: ["assignedSalesId"],
        where: {
          assignedSalesId: { in: salesIds },
          status: { in: ["baru", "dihubungi", "ragu_ragu", "negosiasi"] },
        },
        _count: { id: true },
      }),
      db.insuranceLead.groupBy({
        by: ["assignedSalesId"],
        where: {
          assignedSalesId: { in: salesIds },
          status: "approved",
        },
        _count: { id: true },
      }),
    ]);

    // Build lookup maps from groupBy results
    const activeLeadsMap = new Map(
      activeLeadsBySales.map((r) => [r.assignedSalesId, r._count.id])
    );
    const approvedLeadsMap = new Map(
      approvedLeadsBySales.map((r) => [r.assignedSalesId, r._count.id])
    );

    // Assemble response
    const salesWithStats = salesUsers.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      totalLeads: user._count.assignedLeads,
      totalFollowups: user._count.followups,
      activeLeads: activeLeadsMap.get(user.id) || 0,
      approvedLeads: approvedLeadsMap.get(user.id) || 0,
    }));

    const elapsed = Date.now() - start;
    console.log(`[PERF] GET /api/admin/sales: ${elapsed}ms (${salesWithStats.length} sales)`);

    return NextResponse.json({ sales: salesWithStats });
  } catch (error) {
    console.error("GET /api/admin/sales error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/sales — Create sales user (admin only)
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { name, username, password } = body;

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: "Nama, username, dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existing = await db.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: "Username sudah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    const user = await db.user.create({
      data: {
        name: name.trim(),
        username: username.trim(),
        password: hashedPassword,
        role: "sales",
        isActive: true,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/sales error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/sales — Update sales user (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { id, name, username, password, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID wajib diisi" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (username !== undefined) updateData.username = username.trim();
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password) updateData.password = await hash(password, 12);

    const user = await db.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("PATCH /api/admin/sales error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
