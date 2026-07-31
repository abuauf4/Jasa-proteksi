import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

// GET /api/admin/leads — List leads with filters
export async function GET(request: NextRequest) {
  const start = Date.now();
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const salesId = searchParams.get("salesId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    // Sales users can see their own leads + unassigned leads
    if (session.user.role === "sales") {
      where.OR = [
        { assignedSalesId: session.user.id },
        { assignedSalesId: null },
      ];
    }

    if (status) where.status = status;
    if (salesId && session.user.role === "admin") where.assignedSalesId = salesId;
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { whatsappNumber: { contains: search, mode: 'insensitive' } },
        { vehicleBrand: { contains: search, mode: 'insensitive' } },
        { vehicleType: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      db.insuranceLead.findMany({
        where,
        include: {
          assignedSales: { select: { id: true, name: true, email: true } },
          followups: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { createdAt: true, result: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.insuranceLead.count({ where }),
    ]);

    const elapsed = Date.now() - start;
    console.log(`[PERF] GET /api/admin/leads: ${elapsed}ms (page=${page}, total=${total})`);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/leads error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/leads — Create lead manually
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const {
      customerName,
      whatsappNumber,
      vehicleBrand,
      vehicleType,
      vehicleYear,
      plateRegion,
      vehiclePriceOtr,
      coverageType,
      addOns,
      customerBudget,
      estimatedPremium,
      originalPremium,
      discountAmount,
      adminFee,
      selectedPartner,
      assignedSalesId,
      notes,
      source,
    } = body;

    if (!customerName || !whatsappNumber) {
      return NextResponse.json(
        { error: "Nama dan nomor WhatsApp wajib diisi" },
        { status: 400 }
      );
    }

    // Sales users can only assign leads to themselves
    const finalAssignedSalesId = session.user.role === "sales"
      ? session.user.id
      : (assignedSalesId || null);

    const lead = await db.insuranceLead.create({
      data: {
        customerName: customerName.trim(),
        whatsappNumber: whatsappNumber.trim(),
        vehicleBrand: vehicleBrand || null,
        vehicleType: vehicleType || null,
        vehicleYear: vehicleYear || null,
        plateRegion: plateRegion || null,
        vehiclePriceOtr: vehiclePriceOtr || null,
        coverageType: coverageType || null,
        addOns: addOns || null,
        customerBudget: customerBudget || null,
        estimatedPremium: estimatedPremium || null,
        originalPremium: originalPremium || null,
        discountAmount: discountAmount || null,
        adminFee: adminFee || null,
        selectedPartner: selectedPartner || null,
        assignedSalesId: finalAssignedSalesId,
        notes: notes || null,
        source: source || "manual",
        status: "baru",
      },
      include: {
        assignedSales: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/leads error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
