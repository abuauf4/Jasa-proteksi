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
// Also creates InsuranceLead for admin panel visibility
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName, whatsappNumber, productId, notes,
      coverageType, vehicleBrand, vehicleType, vehicleYear,
      plateRegion, vehiclePriceOtr, addOns,
      estimatedPremium, originalPremium, discountAmount, adminFee,
      customerBudget, selectedPartner,
    } = body;

    // Validate required fields
    if (!customerName || !whatsappNumber) {
      return NextResponse.json(
        { error: "Missing required fields: customerName, whatsappNumber" },
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

    // Get the product (optional - may not exist for vehicle insurance)
    let product = null;
    if (productId) {
      product = await db.product.findUnique({ where: { id: productId } });
    }

    // Create lead with estimation_viewed status (old model for backward compat)
    const leadData: Record<string, unknown> = {
      customerName: customerName.trim(),
      whatsappNumber: cleanPhone,
      status: "estimation_viewed",
      notes: notes?.trim() || null,
      coverageType: coverageType || null,
      vehicleBrand: vehicleBrand || null,
      vehicleType: vehicleType || null,
      vehicleYear: vehicleYear || null,
      plateRegion: plateRegion || null,
      vehiclePriceOtr: vehiclePriceOtr || null,
      addOns: addOns || null,
      estimatedPremium: estimatedPremium || null,
      selectedPartner: selectedPartner || null,
    };

    if (product) {
      leadData.productId = product.id;
      leadData.productNameSnapshot = product.name;
      leadData.estimatedPriceSnapshot = product.estimatedPrice;
      leadData.minimumOfferPriceSnapshot = product.minimumOfferPrice;
    } else {
      // No product — use placeholder
      leadData.productId = "no-product";
      leadData.productNameSnapshot = vehicleBrand && vehicleType
        ? `Asuransi ${vehicleBrand} ${vehicleType}`
        : "Asuransi Kendaraan";
      leadData.estimatedPriceSnapshot = vehiclePriceOtr || 0;
      leadData.minimumOfferPriceSnapshot = 0;
    }

    // Ensure product exists in DB (create stub if not)
    if (!product && productId) {
      try {
        await db.product.upsert({
          where: { id: productId },
          update: {},
          create: {
            id: productId,
            name: leadData.productNameSnapshot as string,
            slug: `stub-${productId}`,
            category: "asuransi-kendaraan",
            description: "Asuransi Kendaraan",
            benefits: "[]",
            estimatedPrice: vehiclePriceOtr || 0,
            minimumOfferPrice: 0,
            isActive: true,
          },
        });
      } catch {
        // Product might already exist or creation fails — continue
      }
    }

    const lead = await db.lead.create({
      data: leadData as any,
    });

    // Create history entry
    await db.leadHistory.create({
      data: {
        leadId: lead.id,
        action: "created",
        detail: JSON.stringify({
          product: leadData.productNameSnapshot,
          estimatedPrice: leadData.estimatedPriceSnapshot,
        }),
      },
    });

    // ─── ALSO create InsuranceLead for admin panel ───
    try {
      await db.insuranceLead.create({
        data: {
          customerName: customerName.trim(),
          whatsappNumber: cleanPhone,
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
          status: "baru",
          assignedSalesId: null,
          notes: notes?.trim() || null,
          source: "website",
        },
      });
    } catch (adminLeadError) {
      // Don't fail the public request if admin lead creation fails
      console.error("Failed to create InsuranceLead for admin:", adminLeadError);
    }

    // Send email notification (async, don't block response)
    sendNotificationEmail("estimation_viewed", {
      leadId: lead.id,
      customerName: lead.customerName,
      whatsappNumber: lead.whatsappNumber,
      productName: (leadData.productNameSnapshot as string) || "Unknown",
      estimatedPrice: (leadData.estimatedPriceSnapshot as number) || 0,
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
        product: product
          ? {
              name: product.name,
              category: product.category,
              description: product.description,
              benefits: product.benefits,
              estimatedPrice: product.estimatedPrice,
              minimumOfferPrice: product.minimumOfferPrice,
            }
          : {
              name: leadData.productNameSnapshot,
              category: "asuransi-kendaraan",
              description: "Asuransi Kendaraan",
              benefits: "[]",
              estimatedPrice: vehiclePriceOtr || 0,
              minimumOfferPrice: 0,
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
  let adminEmail = "jasaglobalproteksi@gmail.com"; // fallback
  try {
    const emailSetting = await db.siteSetting.findUnique({ where: { key: "email" } });
    if (emailSetting?.value) adminEmail = emailSetting.value;
  } catch {}

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
}
