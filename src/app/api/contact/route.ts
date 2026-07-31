import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/contact — submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nama, email, dan pesan wajib diisi" },
        { status: 400 }
      );
    }

    // Store as an InsuranceLead with status "baru" and coverageType "contact_form"
    // This way it shows up in the admin leads page
    const lead = await db.insuranceLead.create({
      data: {
        customerName: name,
        whatsappNumber: phone || "",
        coverageType: "contact_form",
        status: "baru",
        vehicleBrand: subject || "Contact Form",
        vehicleType: "",
        vehicleYear: "",
        plateRegion: "",
        vehiclePriceOtr: 0,
        estimatedPremium: 0,
        originalPremium: 0,
        discountAmount: 0,
        adminFee: 0,
        selectedPartner: "",
        notes: message,
        source: "website",
      },
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
