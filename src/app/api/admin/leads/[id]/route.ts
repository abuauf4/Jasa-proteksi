import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

// GET /api/admin/leads/[id] — Get lead detail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const lead = await db.insuranceLead.findUnique({
      where: { id },
      include: {
        assignedSales: { select: { id: true, name: true, email: true } },
        followups: {
          include: { sales: { select: { id: true, name: true } } },
          orderBy: { followupDate: "desc" },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead tidak ditemukan" }, { status: 404 });
    }

    // Sales users can view their own leads + unassigned leads
    if (session.user.role === "sales" && lead.assignedSalesId !== session.user.id && lead.assignedSalesId !== null) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("GET /api/admin/leads/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/admin/leads/[id] — Update lead (status, assignment, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    const existing = await db.insuranceLead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Lead tidak ditemukan" }, { status: 404 });
    }

    // Sales users can update their own leads + claim unassigned leads
    if (session.user.role === "sales" && existing.assignedSalesId !== session.user.id && existing.assignedSalesId !== null) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};

    // Sales can update status, notes, and claim unassigned leads; Admin can update everything
    if (session.user.role === "sales") {
      if (body.status !== undefined) updateData.status = body.status;
      if (body.notes !== undefined) updateData.notes = body.notes;
      // Sales can claim an unassigned lead by assigning themselves
      if (existing.assignedSalesId === null && body.claimLead === true) {
        updateData.assignedSalesId = session.user.id;
      }
    } else {
      if (body.status !== undefined) updateData.status = body.status;
      if (body.assignedSalesId !== undefined) updateData.assignedSalesId = body.assignedSalesId || null;
      if (body.notes !== undefined) updateData.notes = body.notes;
      if (body.customerName !== undefined) updateData.customerName = body.customerName;
      if (body.whatsappNumber !== undefined) updateData.whatsappNumber = body.whatsappNumber;
      if (body.vehicleBrand !== undefined) updateData.vehicleBrand = body.vehicleBrand;
      if (body.vehicleType !== undefined) updateData.vehicleType = body.vehicleType;
      if (body.vehicleYear !== undefined) updateData.vehicleYear = body.vehicleYear;
      if (body.plateRegion !== undefined) updateData.plateRegion = body.plateRegion;
      if (body.vehiclePriceOtr !== undefined) updateData.vehiclePriceOtr = body.vehiclePriceOtr;
      if (body.coverageType !== undefined) updateData.coverageType = body.coverageType;
      if (body.addOns !== undefined) updateData.addOns = body.addOns;
      if (body.customerBudget !== undefined) updateData.customerBudget = body.customerBudget;
      if (body.estimatedPremium !== undefined) updateData.estimatedPremium = body.estimatedPremium;
      if (body.originalPremium !== undefined) updateData.originalPremium = body.originalPremium;
      if (body.discountAmount !== undefined) updateData.discountAmount = body.discountAmount;
      if (body.adminFee !== undefined) updateData.adminFee = body.adminFee;
      if (body.selectedPartner !== undefined) updateData.selectedPartner = body.selectedPartner;
    }

    const lead = await db.insuranceLead.update({
      where: { id },
      data: updateData,
      include: {
        assignedSales: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("PATCH /api/admin/leads/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
