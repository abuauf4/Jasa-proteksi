import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

// Default settings to seed on first load
const DEFAULT_SETTINGS = [
  { key: "whatsapp", value: "6285282297399", label: "Nomor WhatsApp 1", type: "text", group: "contact" },
  { key: "whatsapp2", value: "6288972252907", label: "Nomor WhatsApp 2", type: "text", group: "contact" },
  { key: "phone", value: "", label: "Nomor Telepon", type: "text", group: "contact" },
  { key: "email", value: "jasaglobalproteksi@gmail.com", label: "Email", type: "email", group: "contact" },
  { key: "address", value: "Jl. Jalur Sutera Tim., RT.001/RW.015, Kunciran, Kec. Pinang, Kota Tangerang, Banten 15143", label: "Alamat", type: "textarea", group: "contact" },
  { key: "googleAnalyticsId", value: "", label: "Google Analytics ID", type: "text", group: "integration" },
  { key: "metaPixelId", value: "", label: "Meta Pixel ID", type: "text", group: "integration" },
  { key: "gtmId", value: "", label: "Google Tag Manager ID", type: "text", group: "integration" },
  { key: "maintenanceMode", value: "false", label: "Mode Maintenance", type: "boolean", group: "maintenance" },
];

// GET — return all settings as key-value map
// Cached at Vercel edge for 5 minutes (s-maxage=300), serve stale for up to
// 10 minutes while revalidating in background. Settings change rarely, so
// edge cache eliminates ~2s DB latency for subsequent page loads.
export async function GET() {
  try {
    let settings = await db.siteSetting.findMany();

    // Seed defaults if no settings exist
    if (settings.length === 0) {
      await db.siteSetting.createMany({ data: DEFAULT_SETTINGS });
      settings = await db.siteSetting.findMany();
    }

    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }

    return NextResponse.json(
      { map, settings },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("SiteSettings GET error:", error);
    return NextResponse.json({ error: "Gagal memuat pengaturan" }, { status: 500 });
  }
}

// PUT — update settings (accepts { key: value } object)
export async function PUT(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const updates: Record<string, string> = body;

    const results = await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        db.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value), label: key, type: "text", group: "general" },
        })
      )
    );

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, updated: results.length });
  } catch (error) {
    console.error("SiteSettings PUT error:", error);
    return NextResponse.json({ error: "Gagal menyimpan pengaturan" }, { status: 500 });
  }
}
