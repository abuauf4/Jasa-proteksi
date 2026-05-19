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

// PATCH /api/leads/[id] — Update lead (status, offer price, etc.)
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
    const historyAction: string | null = null;
    const historyDetail: string | null = null;

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

      // Send email notification for offer
      sendOfferNotification(
        isValid ? "offer_submitted" : "offer_rejected",
        {
          leadId: id,
          customerName: existing.customerName,
          whatsappNumber: existing.whatsappNumber,
          productName: existing.productNameSnapshot,
          estimatedPrice: existing.estimatedPriceSnapshot,
          minimumOfferPrice: existing.minimumOfferPriceSnapshot,
          customerOfferPrice: offerPrice,
          notes: existing.notes,
          createdAt: new Date().toISOString(),
        }
      ).catch((err) => console.error("Email notification error:", err));
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

// Email notification for offers
async function sendOfferNotification(
  type: "offer_submitted" | "offer_rejected",
  data: {
    leadId: string;
    customerName: string;
    whatsappNumber: string;
    productName: string;
    estimatedPrice: number;
    minimumOfferPrice: number;
    customerOfferPrice: number;
    notes?: string | null;
    createdAt: string;
  }
) {
  const adminEmail = "abuaufa.nauka@gmail.com";
  const statusLabel = type === "offer_submitted" ? "VALID ✅" : "REJECTED ❌";

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 EMAIL NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${adminEmail}
Subject: Penawaran Customer - ${data.productName}

Nama: ${data.customerName}
WhatsApp: ${data.whatsappNumber}
Produk: ${data.productName}
Estimasi Harga: Rp ${data.estimatedPrice.toLocaleString("id-ID")}
Harga Penawaran: Rp ${data.customerOfferPrice.toLocaleString("id-ID")}
Minimum Penawaran: Rp ${data.minimumOfferPrice.toLocaleString("id-ID")}
Status: ${statusLabel}
Catatan: ${data.notes || "-"}
Waktu: ${new Date(data.createdAt).toLocaleString("id-ID")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);

  // TODO: Integrate with actual email service for production
}
