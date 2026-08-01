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
  Upload,
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
  const [uploading, setUploading] = useState(false);

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

          {/* Hero Images — upload + manage multiple images */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm">
              <ImageIcon className="h-3 w-3" /> Gambar Hero (Multiple — Slider)
            </Label>
            <p className="text-xs text-slate-400">
              Upload gambar untuk hero slider. Bisa multiple gambar, akan auto-rotate.
              Pisahkan URL dengan koma untuk multiple gambar manual.
            </p>

            {/* File upload button */}
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F766E] text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#0B5C55] transition-colors">
                <Upload className="h-4 w-4" />
                Upload Gambar
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      const res = await fetch("/api/upload", { method: "POST", body: formData });
                      if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        throw new Error(err.error || "Upload failed");
                      }
                      const data = await res.json();
                      // Append to existing images
                      const current = backgroundImage ? backgroundImage.split(",").map(s => s.trim()).filter(Boolean) : [];
                      const updated = [...current, data.url].join(", ");
                      setBackgroundImage(updated);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : "Upload gagal");
                    } finally {
                      setUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
              {uploading && <span className="text-sm text-slate-400">Uploading...</span>}
            </div>

            {/* URL input — comma separated for multiple */}
            <Input
              id="bgImage"
              placeholder="/hero-car-bg.webp atau /uploads/hero-1.webp, /uploads/hero-2.webp"
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
            />

            {/* Image previews + remove buttons */}
            {backgroundImage && (
              <div className="grid grid-cols-3 gap-2">
                {backgroundImage.split(",").map((url, idx) => {
                  const trimmed = url.trim();
                  if (!trimmed) return null;
                  return (
                    <div key={idx} className="relative group">
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-200">
                        <img
                          src={trimmed}
                          alt={`Hero ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const urls = backgroundImage.split(",").map(s => s.trim()).filter(Boolean);
                          urls.splice(idx, 1);
                          setBackgroundImage(urls.join(", "));
                        }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/50 text-white text-[10px]">
                        {idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

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
