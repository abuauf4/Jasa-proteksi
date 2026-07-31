import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/leads/[id] — Get single lead with history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        product: { select: { name: true, slug: true, category: true } },
        history: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("GET /api/leads/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
  }
}

// PATCH /api/leads/[id] — Update lead (status, offer price, budget, etc.)
// Also syncs relevant updates to InsuranceLead for admin panel
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const updateData: any = {};

    // Handle status updates
    if (body.status === "whatsapp_clicked") {
      updateData.status = "whatsapp_clicked";
      await db.leadHistory.create({
        data: {
          leadId: id,
          action: "whatsapp_clicked",
          detail: JSON.stringify({ previousStatus: existing.status }),
        },
      });

      // Sync to InsuranceLead — mark as "dihubungi"
      try {
        await db.insuranceLead.updateMany({
          where: {
            customerName: existing.customerName,
            whatsappNumber: existing.whatsappNumber,
          },
          data: { status: "dihubungi" },
        });
      } catch { /* silent */ }
    }

    // Handle budget submission
    if (body.action === "submit_budget") {
      const customerBudget = Number(body.customerBudget);
      const estimatedPremium = Number(body.estimatedPremium) || 0;
      const selectedPartnerName = body.selectedPartner || null;

      if (customerBudget <= 0) {
        return NextResponse.json(
          { error: "Budget tidak valid" },
          { status: 400 }
        );
      }

      updateData.customerBudget = customerBudget;
      updateData.estimatedPremium = estimatedPremium;
      updateData.budgetGap = estimatedPremium - customerBudget;
      updateData.budgetNotes = body.budgetNotes?.trim() || null;
      updateData.selectedPartner = selectedPartnerName;
      updateData.status = "budget_submitted";

      await db.leadHistory.create({
        data: {
          leadId: id,
          action: "budget_submitted",
          detail: JSON.stringify({
            customerBudget,
            estimatedPremium,
            budgetGap: estimatedPremium - customerBudget,
            previousStatus: existing.status,
          }),
        },
      });

      // Sync to InsuranceLead — update budget and status
      try {
        await db.insuranceLead.updateMany({
          where: {
            customerName: existing.customerName,
            whatsappNumber: existing.whatsappNumber,
          },
          data: {
            customerBudget,
            estimatedPremium,
            selectedPartner: selectedPartnerName,
            status: "negosiasi",
            notes: body.budgetNotes?.trim()
              ? `Budget: Rp ${customerBudget.toLocaleString("id-ID")}${body.budgetNotes.trim() ? ` — ${body.budgetNotes.trim()}` : ""}`
              : `Budget customer: Rp ${customerBudget.toLocaleString("id-ID")}`,
          },
        });
      } catch { /* silent */ }
    }

    // Handle offer submission
    if (body.customerOfferPrice !== undefined) {
      const offerPrice = Number(body.customerOfferPrice);
      if (offerPrice <= 0) {
        return NextResponse.json(
          { error: "Harga penawaran tidak valid" },
          { status: 400 }
        );
      }

      updateData.customerOfferPrice = offerPrice;

      const isValid = offerPrice >= existing.minimumOfferPriceSnapshot;
      updateData.status = isValid ? "offer_submitted" : "offer_rejected";

      await db.leadHistory.create({
        data: {
          leadId: id,
          action: isValid ? "offer_submitted" : "offer_rejected",
          detail: JSON.stringify({
            customerOfferPrice: offerPrice,
            minimumOfferPrice: existing.minimumOfferPriceSnapshot,
            previousStatus: existing.status,
          }),
        },
      });

      // Sync to InsuranceLead
      try {
        await db.insuranceLead.updateMany({
          where: {
            customerName: existing.customerName,
            whatsappNumber: existing.whatsappNumber,
          },
          data: {
            status: isValid ? "approved" : "lost",
            notes: `Penawaran: Rp ${offerPrice.toLocaleString("id-ID")} — ${isValid ? "Valid" : "Di bawah minimum"}`,
          },
        });
      } catch { /* silent */ }
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const lead = await db.lead.update({
      where: { id },
      data: updateData,
    });

    const isValidOffer = body.customerOfferPrice !== undefined
      ? Number(body.customerOfferPrice) >= existing.minimumOfferPriceSnapshot
      : null;

    return NextResponse.json({
      lead,
      isValidOffer,
      message: body.customerOfferPrice !== undefined
        ? isValidOffer
          ? "Penawaran Anda telah dikirim. Silakan lanjut konsultasi via WhatsApp."
          : "Maaf, penawaran belum memenuhi syarat minimum untuk produk ini."
        : undefined,
    });
  } catch (error) {
    console.error("PATCH /api/leads/[id] error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

// DELETE /api/leads/[id] — Delete lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Delete history first (should cascade, but explicit for safety)
    await db.leadHistory.deleteMany({ where: { leadId: id } });
    await db.lead.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/leads/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
