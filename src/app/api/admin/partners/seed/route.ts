import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// POST /api/admin/partners/seed — Seed default partners if table is empty (admin only)
export async function POST(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    // Check if partners already exist
    const existingCount = await db.insurancePartner.count();
    if (existingCount > 0) {
      return NextResponse.json({
        message: `Sudah ada ${existingCount} partner di database`,
        partners: existingCount,
      });
    }

    // Seed default partners
    const partners = [
      {
        name: "Sinarmas",
        slug: "sinarmas",
        status: "active",
        benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
        facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
        modifier: 1.0,
        addonModifier: 1.0,
        adminFee: 50000,
        bengkelResmiMaxYears: 10,
        description: "Asuransi Sinarmas - Proteksi terpercaya untuk kendaraan Anda",
        sortOrder: 1,
      },
      {
        name: "Multi Artha Guna",
        slug: "multi-artha-global",
        status: "active",
        benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
        facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
        modifier: 1.0,
        addonModifier: 1.0,
        adminFee: 50000,
        bengkelResmiMaxYears: 10,
        description: "Multi Artha Guna - Broker asuransi dengan jaringan luas",
        sortOrder: 2,
      },
      {
        name: "ACA",
        slug: "aca",
        status: "active",
        benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
        facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
        modifier: 1.0,
        addonModifier: 1.0,
        adminFee: 50000,
        bengkelResmiMaxYears: 10,
        description: "ACA Insurance - Asuransi kendaraan berkualitas",
        sortOrder: 3,
      },
      {
        name: "Mega Insurance",
        slug: "mega-insurance",
        status: "active",
        benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 10 Tahun"]),
        facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
        modifier: 1.0,
        addonModifier: 1.0,
        adminFee: 50000,
        bengkelResmiMaxYears: 10,
        description: "Mega Insurance - Proteksi kendaraan terpercaya dengan bengkel resmi 10 tahun",
        sortOrder: 4,
      },
      {
        name: "Zurich Syariah",
        slug: "zurich-syariah",
        status: "active",
        benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 10 Tahun", "Syariah Compliant"]),
        facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
        modifier: 1.0,
        addonModifier: 1.0,
        adminFee: 50000,
        bengkelResmiMaxYears: 10,
        description: "Zurich Syariah - Asuransi kendaraan syariah dengan bengkel resmi 10 tahun",
        sortOrder: 6,
      },
      {
        name: "Tugu",
        slug: "tugu",
        status: "active",
        benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 8 Tahun"]),
        facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
        modifier: 1.0,
        addonModifier: 1.0,
        adminFee: 50000,
        bengkelResmiMaxYears: 8,
        description: "Tugu Insurance - Asuransi kendaraan dengan bengkel resmi 8 tahun",
        sortOrder: 7,
      },
      {
        name: "Sahabat",
        slug: "sahabat",
        status: "active",
        benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 10 Tahun"]),
        facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
        modifier: 1.0,
        addonModifier: 1.0,
        adminFee: 50000,
        bengkelResmiMaxYears: 10,
        description: "Sahabat Insurance - Asuransi kendaraan terjangkau dengan bengkel resmi 10 tahun",
        sortOrder: 8,
      },
      {
        name: "Oona",
        slug: "oona",
        status: "active",
        benefits: JSON.stringify(["Bantuan Claim", "Jaringan Bengkel Luas"]),
        facilities: JSON.stringify(["Free derek", "Layanan call 24 jam"]),
        modifier: 1.0,
        addonModifier: 1.0,
        adminFee: 50000,
        bengkelResmiMaxYears: 10,
        description: "Oona Insurance - Asuransi digital yang modern",
        sortOrder: 5,
      },
    ];

    let created = 0;
    for (const partner of partners) {
      await db.insurancePartner.create({ data: partner });
      created++;
    }

    revalidatePath("/", "layout");
    return NextResponse.json({
      message: `Berhasil membuat ${created} partner`,
      partners: created,
    });
  } catch (error) {
    console.error("POST /api/admin/partners/seed error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
