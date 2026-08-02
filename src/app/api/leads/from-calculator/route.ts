import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/leads/from-calculator
 *
 * Creates a lead from the premium calculator WhatsApp flow.
 * Writes to InsuranceLead (the model the CRM admin reads).
 * Also creates a legacy Lead record for backward compatibility.
 *
 * Idempotency: if idempotencyKey matches an existing InsuranceLead,
 * returns the existing lead without creating a duplicate.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      idempotencyKey,
      customerName,
      whatsappNumber,
      vehicleBrand,
      vehicleType,
      vehicleYear,
      plateRegion,
      vehiclePriceOtr,
      coverageType,
      addOns,
      estimatedPremium,
      originalPremium,
      discountAmount,
      adminFee,
      policyFee,
      selectedPartner,
      source,
      pageUrl,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      gclid,
    } = body;

    // ── Validate required fields ──
    if (!customerName || !whatsappNumber) {
      return NextResponse.json(
        { error: "Nama dan nomor WhatsApp wajib diisi." },
        { status: 400 }
      );
    }

    // ── Validate & normalize WhatsApp number ──
    const cleanPhone = normalizePhone(whatsappNumber);
    if (!cleanPhone) {
      return NextResponse.json(
        { error: "Nomor WhatsApp tidak valid. Gunakan format: 08xxxxxxxxxx atau 628xxxxxxxxxx." },
        { status: 400 }
      );
    }

    // ── Validate name minimum length ──
    const trimmedName = customerName.trim();
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Nama minimal 2 karakter." },
        { status: 400 }
      );
    }

    // ── Idempotency: check if lead already exists for this key ──
    if (idempotencyKey) {
      const existing = await db.insuranceLead.findFirst({
        where: { notes: { contains: `[idem:${idempotencyKey}]` } },
        select: { id: true, createdAt: true },
      });
      if (existing) {
        // Generate a leadCode from the existing lead id
        const leadCode = generateLeadCode(existing.id);
        return NextResponse.json({
          success: true,
          leadId: existing.id,
          leadCode,
          duplicate: true,
        });
      }
    }

    // ── Build UTM / attribution metadata for notes ──
    const utmParts: string[] = [];
    if (utm_source) utmParts.push(`utm_source=${utm_source}`);
    if (utm_medium) utmParts.push(`utm_medium=${utm_medium}`);
    if (utm_campaign) utmParts.push(`utm_campaign=${utm_campaign}`);
    if (utm_content) utmParts.push(`utm_content=${utm_content}`);
    if (utm_term) utmParts.push(`utm_term=${utm_term}`);
    if (gclid) utmParts.push(`gclid=${gclid}`);

    const attributionLine = utmParts.length > 0 ? ` | ${utmParts.join("&")}` : "";
    const idemLine = idempotencyKey ? ` [idem:${idempotencyKey}]` : "";

    // ── Build notes with snapshot + attribution ──
    const vehicleName = [vehicleBrand, vehicleType].filter(Boolean).join(" ");
    const coverageLabel = coverageType === "AllRisk" ? "All Risk" : coverageType === "TLO" ? "TLO" : coverageType || "-";
    const addOnLabels = addOns ? (typeof addOns === "string" ? addOns : JSON.stringify(addOns)) : "-";

    const notesParts = [
      `Sumber: ${source || "premium_calculator"}`,
      `Kendaraan: ${vehicleName || "-"} ${vehicleYear || ""}`,
      `Plat: ${plateRegion || "-"}`,
      `Coverage: ${coverageLabel}`,
      `Perluasan: ${addOnLabels}`,
      `Partner: ${selectedPartner || "-"}`,
      `Premi: ${estimatedPremium ? `Rp ${Number(estimatedPremium).toLocaleString("id-ID")}` : "-"}`,
      `URL: ${pageUrl || "-"}`,
    ];
    if (referrer) notesParts.push(`Referrer: ${referrer}`);
    const notesContent = notesParts.join(" | ") + attributionLine + idemLine;

    // ── Create InsuranceLead (the model CRM admin reads) ──
    const insuranceLead = await db.insuranceLead.create({
      data: {
        customerName: trimmedName,
        whatsappNumber: cleanPhone,
        vehicleBrand: vehicleBrand || null,
        vehicleType: vehicleType || null,
        vehicleYear: vehicleYear || null,
        plateRegion: plateRegion || null,
        vehiclePriceOtr: vehiclePriceOtr ? Number(vehiclePriceOtr) : null,
        coverageType: coverageType || null,
        addOns: addOns ? (typeof addOns === "string" ? addOns : JSON.stringify(addOns)) : null,
        estimatedPremium: estimatedPremium ? Number(estimatedPremium) : null,
        originalPremium: originalPremium ? Number(originalPremium) : null,
        discountAmount: discountAmount ? Number(discountAmount) : null,
        adminFee: adminFee ? Number(adminFee) : null,
        selectedPartner: selectedPartner || null,
        status: "baru",
        source: source || "premium_calculator",
        notes: notesContent,
      },
    });

    // ── Also create legacy Lead for backward compatibility ──
    try {
      const productSlug = "asuransi-mobil";
      let product = await db.product.findFirst({ where: { slug: productSlug } });

      if (!product) {
        try {
          product = await db.product.create({
            data: {
              name: "Asuransi Kendaraan",
              slug: productSlug,
              category: "asuransi-kendaraan",
              description: "Asuransi Kendaraan",
              benefits: "[]",
              estimatedPrice: vehiclePriceOtr ? Number(vehiclePriceOtr) : 0,
              minimumOfferPrice: 0,
              isActive: true,
            },
          });
        } catch {
          // Product might already exist from concurrent request — try find again
          product = await db.product.findFirst({ where: { slug: productSlug } });
        }
      }

      if (product) {
        await db.lead.create({
          data: {
            customerName: trimmedName,
            whatsappNumber: cleanPhone,
            productId: product.id,
            productNameSnapshot: product.name,
            estimatedPriceSnapshot: vehiclePriceOtr ? Number(vehiclePriceOtr) : 0,
            minimumOfferPriceSnapshot: 0,
            status: "estimation_viewed",
            notes: notesContent,
            coverageType: coverageType || null,
            vehicleBrand: vehicleBrand || null,
            vehicleType: vehicleType || null,
            vehicleYear: vehicleYear || null,
            plateRegion: plateRegion || null,
            vehiclePriceOtr: vehiclePriceOtr ? Number(vehiclePriceOtr) : null,
            addOns: addOns ? (typeof addOns === "string" ? addOns : JSON.stringify(addOns)) : null,
            estimatedPremium: estimatedPremium ? Number(estimatedPremium) : null,
            selectedPartner: selectedPartner || null,
          },
        });
      }
    } catch (legacyErr) {
      // Don't fail the main request if legacy lead creation fails
      console.error("Failed to create legacy Lead:", legacyErr);
    }

    const leadCode = generateLeadCode(insuranceLead.id);

    return NextResponse.json(
      {
        success: true,
        leadId: insuranceLead.id,
        leadCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/leads/from-calculator error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan lead. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

/**
 * Normalize an Indonesian phone number to 62xxx format.
 * Returns null if the number is invalid.
 */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-+]/g, "");
  // Must be 10-15 digits
  if (!/^\d{10,15}$/.test(digits)) return null;

  // Convert 08xx → 628xx
  if (digits.startsWith("08")) {
    return "62" + digits.slice(1);
  }
  // Already starts with 62
  if (digits.startsWith("62")) {
    return digits;
  }
  // Other formats: just return as-is if valid length
  return digits;
}

/**
 * Generate a human-readable lead code from a cuid id.
 * Format: JP-XXXX (first 4 uppercase chars of the id, padded if needed).
 */
function generateLeadCode(id: string): string {
  const raw = id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const code = raw.slice(0, 4).padEnd(4, "0");
  return `JP-${code}`;
}
