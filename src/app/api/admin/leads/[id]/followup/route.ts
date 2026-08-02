import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

// Deduplication window: if an identical follow-up was created within this
// number of seconds, return the existing record instead of creating a new one.
const DEDUP_WINDOW_SECONDS = 15;

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

    // ── Deduplication check ─────────────────────────────────────────
    // Prevent duplicate rows when the same request is submitted twice
    // within a short window (e.g. double-tap, Enter + click, network retry).
    const dedupCutoff = new Date(Date.now() - DEDUP_WINDOW_SECONDS * 1000);

    const existingFollowup = await db.leadFollowup.findFirst({
      where: {
        leadId: id,
        salesId: session.user.id || null,
        notes: notes.trim(),
        nextFollowupDate: nextFollowupDate ? new Date(nextFollowupDate) : null,
        result: result || null,
        createdAt: { gte: dedupCutoff },
      },
      include: {
        sales: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingFollowup) {
      // Return the existing record so the UI still gets valid data
      return NextResponse.json({ followup: existingFollowup }, { status: 200 });
    }
    // ── End deduplication check ─────────────────────────────────────

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
