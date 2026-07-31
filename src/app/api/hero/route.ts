import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

const DEFAULT_HERO = {
  tagline: "Proteksi Terbaik untuk Kendaraan Anda",
  subtext: "Dapatkan estimasi premi asuransi kendaraan secara instan dari berbagai perusahaan asuransi terkemuka",
  ctaText: "Hitung Premi Sekarang",
  ctaLink: "#calculator",
  backgroundImage: null as string | null,
};

// GET — return hero content (first record, or defaults)
// Cached at Vercel edge for 5 minutes — hero content changes rarely.
export async function GET() {
  try {
    const hero = await db.heroContent.findFirst();

    if (!hero) {
      return NextResponse.json(DEFAULT_HERO, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      });
    }

    return NextResponse.json(
      {
        tagline: hero.tagline,
        subtext: hero.subtext,
        ctaText: hero.ctaText,
        ctaLink: hero.ctaLink,
        backgroundImage: hero.backgroundImage,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Hero GET error:", error);
    return NextResponse.json(DEFAULT_HERO);
  }
}

// PUT — update hero content (upsert)
export async function PUT(request: NextRequest) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { tagline, subtext, ctaText, ctaLink, backgroundImage } = body;

    const existing = await db.heroContent.findFirst();

    let hero;
    if (existing) {
      hero = await db.heroContent.update({
        where: { id: existing.id },
        data: {
          tagline: tagline ?? existing.tagline,
          subtext: subtext ?? existing.subtext,
          ctaText: ctaText ?? existing.ctaText,
          ctaLink: ctaLink ?? existing.ctaLink,
          backgroundImage: backgroundImage !== undefined ? backgroundImage : existing.backgroundImage,
        },
      });
    } else {
      hero = await db.heroContent.create({
        data: {
          tagline: tagline || DEFAULT_HERO.tagline,
          subtext: subtext || DEFAULT_HERO.subtext,
          ctaText: ctaText || DEFAULT_HERO.ctaText,
          ctaLink: ctaLink || DEFAULT_HERO.ctaLink,
          backgroundImage: backgroundImage || null,
        },
      });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error("Hero PUT error:", error);
    return NextResponse.json({ error: "Gagal menyimpan hero content" }, { status: 500 });
  }
}
