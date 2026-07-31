import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

// POST /api/admin/leads/[id]/followup — Add followup
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const { notes, nextFollowupDate, result } = body;

    if (!notes || notes.trim() === "") {
      return NextResponse.json(
        { error: "Catatan follow-up wajib diisi" },
        { status: 400 }
      );
    }

    const lead = await db.insuranceLead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: "Lead tidak ditemukan" }, { status: 404 });
    }

    // Sales users can only add followup to their own leads
    if (session.user.role === "sales" && lead.assignedSalesId !== session.user.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const followup = await db.leadFollowup.create({
      data: {
        leadId: id,
        salesId: session.user.id || null,
        notes: notes.trim(),
        nextFollowupDate: nextFollowupDate ? new Date(nextFollowupDate) : null,
        result: result || null,
      },
      include: {
        sales: { select: { id: true, name: true } },
      },
    });

    // Update lead status based on followup result
    if (result === "deal") {
      await db.insuranceLead.update({
        where: { id },
        data: { status: "approved" },
      });
    } else if (result === "rejected") {
      await db.insuranceLead.update({
        where: { id },
        data: { status: "lost" },
      });
    } else if (result === "ragu") {
      await db.insuranceLead.update({
        where: { id },
        data: { status: "ragu_ragu" },
      });
    } else if (result === "interested") {
      await db.insuranceLead.update({
        where: { id },
        data: { status: "negosiasi" },
      });
    } else if (lead.status === "baru") {
      await db.insuranceLead.update({
        where: { id },
        data: { status: "dihubungi" },
      });
    }

    return NextResponse.json({ followup }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/leads/[id]/followup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
