import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/leads — List leads with optional status filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "valid" or "rejected"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where = status ? { status } : {};

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        include: { product: { select: { name: true, slug: true } } },
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

// POST /api/leads — Submit a new lead with price validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      whatsappNumber,
      productId,
      customerOfferPrice,
      notes,
    } = body;

    // Validate required fields
    if (!customerName || !whatsappNumber || !productId || customerOfferPrice == null) {
      return NextResponse.json(
        { error: "Missing required fields: customerName, whatsappNumber, productId, customerOfferPrice" },
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

    const offerPrice = Number(customerOfferPrice);
    const isValid = offerPrice >= product.minimumOfferPrice;

    // Create the lead (always save, whether valid or rejected)
    const lead = await db.lead.create({
      data: {
        customerName,
        whatsappNumber,
        productId: product.id,
        productNameSnapshot: product.name,
        estimatedPriceSnapshot: product.estimatedPrice,
        minimumOfferPriceSnapshot: product.minimumOfferPrice,
        customerOfferPrice: offerPrice,
        status: isValid ? "valid" : "rejected",
        notes: notes || null,
      },
    });

    return NextResponse.json(
      {
        lead,
        isValid,
        message: isValid
          ? "Penawaran Anda telah dikirim. Silakan lanjut konsultasi via WhatsApp."
          : "Maaf, penawaran belum memenuhi syarat minimum untuk produk ini.",
        minimumOfferPrice: product.minimumOfferPrice,
        estimatedPrice: product.estimatedPrice,
      },
      { status: isValid ? 201 : 202 }
    );
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to submit lead" },
      { status: 500 }
    );
  }
}
