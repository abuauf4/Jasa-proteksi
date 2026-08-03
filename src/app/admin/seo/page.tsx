"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Search, Loader2, Save, Globe } from "lucide-react";

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

// ─── Types ───

interface SeoEntry {
  id?: string;
  page: string;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  ogImage: string | null;
}

interface PageConfig {
  key: string;
  label: string;
  description: string;
}

const PAGES: PageConfig[] = [
  { key: "homepage", label: "Halaman Utama", description: "Halaman depan website" },
  { key: "calculator", label: "Kalkulator Premi", description: "Halaman hitung premi" },
  { key: "blog", label: "Blog", description: "Halaman artikel blog" },
  { key: "about", label: "Tentang Kami", description: "Halaman tentang (segera)" },
];

// ─── Component ───

export default function SeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>("homepage");
  const [seoData, setSeoData] = useState<Record<string, SeoEntry>>({});

  const form = seoData[selectedPage] || {
    page: selectedPage,
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    ogImage: "",
  };

  // ─── Fetch SEO data ───
  const fetchSeo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seo");
      if (res.ok) {
        const entries: SeoEntry[] = await res.json();
        const map: Record<string, SeoEntry> = {};
        for (const e of entries) {
          map[e.page] = e;
        }
        // Fill defaults for pages without data
        for (const p of PAGES) {
          if (!map[p.key]) {
            map[p.key] = {
              page: p.key,
              metaTitle: "",
              metaDescription: "",
              keywords: "",
              ogImage: "",
            };
          }
        }
        setSeoData(map);
      }
    } catch {
      toast.error("Gagal memuat data SEO");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeo();
  }, [fetchSeo]);

  // ─── Update form field ───
  const updateField = (field: keyof SeoEntry, value: string) => {
    setSeoData((prev) => ({
      ...prev,
      [selectedPage]: {
        ...prev[selectedPage],
        page: selectedPage,
        [field]: value,
      },
    }));
  };

  // ─── Save SEO ───
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: selectedPage,
          metaTitle: form.metaTitle || null,
          metaDescription: form.metaDescription || null,
          keywords: form.keywords || null,
          ogImage: form.ogImage || null,
        }),
      });
      if (res.ok) {
        toast.success("Data SEO berhasil disimpan");
        fetchSeo();
      } else {
        const err = await res.json();
        toast.error(err.error || "Gagal menyimpan data SEO");
      }
    } catch {
      toast.error("Gagal menyimpan data SEO");
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
          <Search className="h-5 w-5 text-slate-500" />
          Manajemen SEO
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Atur meta title, description, dan keyword untuk setiap halaman
        </p>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setSelectedPage(p.key)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedPage === p.key
                ? "bg-[#14B8A6] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* SEO Form */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-sky-100 flex items-center justify-center">
              <Globe className="h-4 w-4 text-sky-600" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">
                {PAGES.find((p) => p.key === selectedPage)?.label}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {PAGES.find((p) => p.key === selectedPage)?.description} — /
                {selectedPage}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle" className="text-sm">
              Meta Title
            </Label>
            <Input
              id="metaTitle"
              placeholder="Judul halaman untuk Google (max 60 karakter)"
              value={form.metaTitle || ""}
              onChange={(e) => updateField("metaTitle", e.target.value)}
            />
            <p className="text-xs text-slate-400">
              Judul yang muncul di hasil pencarian Google. Maksimal 60 karakter
              agar tidak terpotong.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription" className="text-sm">
              Meta Description
            </Label>
            <Textarea
              id="metaDescription"
              placeholder="Deskripsi halaman untuk Google (max 160 karakter)"
              value={form.metaDescription || ""}
              onChange={(e) => updateField("metaDescription", e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-slate-400">
              Deskripsi singkat yang muncul di bawah judul di Google. Maksimal
              160 karakter.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-sm">
              Keywords
            </Label>
            <Input
              id="keywords"
              placeholder="asuransi mobil, premi asuransi, platform perbandingan asuransi"
              value={form.keywords || ""}
              onChange={(e) => updateField("keywords", e.target.value)}
            />
            <p className="text-xs text-slate-400">
              Pisahkan dengan koma. Kata kunci yang relevan dengan halaman ini.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImage" className="text-sm">
              OG Image URL
            </Label>
            <Input
              id="ogImage"
              placeholder="https://jasaproteksi.com/og-image.png"
              value={form.ogImage || ""}
              onChange={(e) => updateField("ogImage", e.target.value)}
            />
            <p className="text-xs text-slate-400">
              URL gambar yang muncul saat link di-share ke WhatsApp/Facebook.
              Ukuran ideal 1200x630 px.
            </p>
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
              Simpan SEO
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
