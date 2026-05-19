import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/leads — List leads with optional status filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where = status ? { status } : {};

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        include: {
          product: { select: { name: true, slug: true, category: true } },
          history: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.lead.count({ where }),
    ]);

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
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// POST /api/leads — Create lead when user views estimation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, whatsappNumber, productId, notes } = body;

    // Validate required fields
    if (!customerName || !whatsappNumber || !productId) {
      return NextResponse.json(
        { error: "Missing required fields: customerName, whatsappNumber, productId" },
        { status: 400 }
      );
    }

    // Validate WhatsApp number (basic: must be numeric, 10-15 digits)
    const cleanPhone = whatsappNumber.replace(/[\s\-+]/g, "");
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Nomor WhatsApp tidak valid. Gunakan format: 08xxxxxxxxxx atau 628xxxxxxxxxx" },
        { status: 400 }
      );
    }

    // Get the product
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.isActive) {
      return NextResponse.json({ error: "Product is not available" }, { status: 400 });
    }

    // Create lead with estimation_viewed status
    const lead = await db.lead.create({
      data: {
        customerName: customerName.trim(),
        whatsappNumber: cleanPhone,
        productId: product.id,
        productNameSnapshot: product.name,
        estimatedPriceSnapshot: product.estimatedPrice,
        minimumOfferPriceSnapshot: product.minimumOfferPrice,
        status: "estimation_viewed",
        notes: notes?.trim() || null,
      },
    });

    // Create history entry
    await db.leadHistory.create({
      data: {
        leadId: lead.id,
        action: "created",
        detail: JSON.stringify({
          product: product.name,
          estimatedPrice: product.estimatedPrice,
        }),
      },
    });

    // Send email notification (async, don't block response)
    sendNotificationEmail("estimation_viewed", {
      leadId: lead.id,
      customerName: lead.customerName,
      whatsappNumber: lead.whatsappNumber,
      productName: product.name,
      estimatedPrice: product.estimatedPrice,
      notes: lead.notes,
      createdAt: lead.createdAt.toISOString(),
    }).catch((err) => console.error("Email notification error:", err));

    return NextResponse.json(
      {
        lead: {
          id: lead.id,
          customerName: lead.customerName,
          whatsappNumber: lead.whatsappNumber,
          status: lead.status,
          estimatedPriceSnapshot: lead.estimatedPriceSnapshot,
          minimumOfferPriceSnapshot: lead.minimumOfferPriceSnapshot,
          productNameSnapshot: lead.productNameSnapshot,
        },
        product: {
          name: product.name,
          category: product.category,
          description: product.description,
          benefits: product.benefits,
          estimatedPrice: product.estimatedPrice,
          minimumOfferPrice: product.minimumOfferPrice,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

// Email notification utility
async function sendNotificationEmail(
  type: "estimation_viewed" | "offer_submitted" | "offer_rejected",
  data: {
    leadId: string;
    customerName: string;
    whatsappNumber: string;
    productName: string;
    estimatedPrice: number;
    notes?: string | null;
    createdAt: string;
    customerOfferPrice?: number;
    minimumOfferPrice?: number;
  }
) {
  const adminEmail = "abuaufa.nauka@gmail.com";

  if (type === "estimation_viewed") {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 EMAIL NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${adminEmail}
Subject: Lead Baru Melihat Estimasi - ${data.productName}

Nama: ${data.customerName}
WhatsApp: ${data.whatsappNumber}
Produk: ${data.productName}
Estimasi Harga: Rp ${data.estimatedPrice.toLocaleString("id-ID")}
Catatan: ${data.notes || "-"}
Waktu: ${new Date(data.createdAt).toLocaleString("id-ID")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  } else if (type === "offer_submitted" || type === "offer_rejected") {
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
Harga Penawaran: Rp ${data.customerOfferPrice?.toLocaleString("id-ID") || "-"}
Minimum Penawaran: Rp ${data.minimumOfferPrice?.toLocaleString("id-ID") || "-"}
Status: ${statusLabel}
Catatan: ${data.notes || "-"}
Waktu: ${new Date(data.createdAt).toLocaleString("id-ID")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }

  // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
  // For production, replace console.log with:
  // await fetch("https://api.resend.com/emails", { ... })
  // or await transporter.sendMail({ ... })
}
