"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Image as ImageIcon,
  Type,
  AlignLeft,
  MousePointerClick,
  Link2,
  Palette,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// ─── Component ───

export default function BrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [tagline, setTagline] = useState("");
  const [subtext, setSubtext] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  // ─── Fetch hero content ───
  const fetchHero = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hero");
      if (res.ok) {
        const data = await res.json();
        setTagline(data.tagline || "");
        setSubtext(data.subtext || "");
        setCtaText(data.ctaText || "");
        setCtaLink(data.ctaLink || "");
        setBackgroundImage(data.backgroundImage || "");
      }
    } catch {
      toast.error("Gagal memuat hero content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHero();
  }, [fetchHero]);

  // ─── Save hero content ───
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagline,
          subtext,
          ctaText,
          ctaLink,
          backgroundImage: backgroundImage || null,
        }),
      });
      if (res.ok) {
        toast.success("Hero content berhasil disimpan");
        fetchHero();
      } else {
        toast.error("Gagal menyimpan hero content");
      }
    } catch {
      toast.error("Gagal menyimpan hero content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Palette className="h-5 w-5 text-slate-500" />
          Hero & Branding
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Edit tampilan bagian hero di halaman utama
        </p>
      </div>

      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center">
              <Type className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">
                Konten Hero
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Teks dan gambar yang tampil di bagian atas halaman utama
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline" className="flex items-center gap-2 text-sm">
              <Type className="h-3 w-3" /> Tagline
            </Label>
            <Input
              id="tagline"
              placeholder="Proteksi Terbaik untuk Kendaraan Anda"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
            <p className="text-xs text-slate-400">
              Judul utama yang besar di hero section
            </p>
          </div>

          {/* Subtext */}
          <div className="space-y-2">
            <Label htmlFor="subtext" className="flex items-center gap-2 text-sm">
              <AlignLeft className="h-3 w-3" /> Subtext
            </Label>
            <Textarea
              id="subtext"
              placeholder="Dapatkan estimasi premi asuransi kendaraan secara instan..."
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-slate-400">
              Teks deskripsi di bawah tagline
            </p>
          </div>

          {/* CTA Text & Link */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ctaText" className="flex items-center gap-2 text-sm">
                <MousePointerClick className="h-3 w-3" /> Teks Tombol CTA
              </Label>
              <Input
                id="ctaText"
                placeholder="Hitung Premi Sekarang"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaLink" className="flex items-center gap-2 text-sm">
                <Link2 className="h-3 w-3" /> Link Tombol CTA
              </Label>
              <Input
                id="ctaLink"
                placeholder="#calculator"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
              />
            </div>
          </div>

          {/* Background Image */}
          <div className="space-y-2">
            <Label htmlFor="bgImage" className="flex items-center gap-2 text-sm">
              <ImageIcon className="h-3 w-3" /> Gambar Hero Utama (URL)
            </Label>
            <Input
              id="bgImage"
              placeholder="https://jasaproteksi.com/hero-car-bg.webp"
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
            />
            <p className="text-xs text-slate-400">
              URL gambar hero yang tampil di homepage. Upload gambar via menu Media,
              lalu paste URL-nya di sini. Kosongkan untuk menggunakan gambar default.
            </p>
          </div>

          {/* Preview */}
          {backgroundImage && (
            <div className="space-y-2">
              <Label className="text-sm text-slate-500">Preview Gambar</Label>
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={backgroundImage}
                  alt="Preview gambar background hero"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* Hero Preview Card */}
          <div className="space-y-2">
            <Label className="text-sm text-slate-500">Preview Teks</Label>
            <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-[#042F2E] via-[#0F172A] to-[#0C4A6E] p-6 text-white">
              <h2 className="text-lg sm:text-xl font-bold mb-2">
                {tagline || "Proteksi Terbaik untuk Kendaraan Anda"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mb-4 line-clamp-2">
                {subtext || "Dapatkan estimasi premi asuransi kendaraan secara instan..."}
              </p>
              <button className="px-4 py-2 bg-[#F97316] text-white text-xs font-bold rounded-full">
                {ctaText || "Hitung Premi Sekarang"}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#14B8A6] hover:bg-[#0D9488] text-white"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan Hero
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
