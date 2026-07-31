import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

// GET /api/admin/followups — List all followups with pagination
export async function GET(request: NextRequest) {
  const start = Date.now();
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const result = searchParams.get("result");
    const salesId = searchParams.get("salesId");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    // Sales users can see their own followups + followups on unassigned leads
    if (session.user.role === "sales") {
      where.OR = [
        { salesId: session.user.id },
        { lead: { assignedSalesId: null } },
      ];
    }

    if (result) where.result = result;
    if (salesId && session.user.role === "admin") where.salesId = salesId;
    if (search) {
      where.OR = [
        { notes: { contains: search, mode: "insensitive" } },
        { lead: { customerName: { contains: search, mode: "insensitive" } } },
        { lead: { whatsappNumber: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [followups, total] = await Promise.all([
      db.leadFollowup.findMany({
        where,
        include: {
          lead: {
            select: {
              id: true,
              customerName: true,
              whatsappNumber: true,
              status: true,
            },
          },
          sales: {
            select: { id: true, name: true },
          },
        },
        orderBy: { followupDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.leadFollowup.count({ where }),
    ]);

    const elapsed = Date.now() - start;
    console.log(`[PERF] GET /api/admin/followups: ${elapsed}ms (page=${page}, total=${total})`);

    return NextResponse.json({
      followups,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/followups error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
