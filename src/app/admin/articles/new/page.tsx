"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ───

interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

// ─── Slug Helper ───

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Component ───

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    categoryId: "",
    excerpt: "",
    content: "",
    coverImage: "",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/article-categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch {
      toast.error("Gagal memuat kategori");
    }
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      ...(slugManuallyEdited ? {} : { slug: generateSlug(title) }),
    }));
  };

  const handleSlugChange = (slug: string) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Judul artikel wajib diisi");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug || undefined,
          categoryId: form.categoryId || null,
          excerpt: form.excerpt || null,
          content: form.content || null,
          coverImage: form.coverImage || null,
          status: form.status,
          metaTitle: form.metaTitle || null,
          metaDescription: form.metaDescription || null,
        }),
      });

      if (res.ok) {
        toast.success("Artikel berhasil disimpan!");
        router.push("/admin/articles");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menyimpan artikel");
      }
    } catch {
      toast.error("Gagal menyimpan artikel");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm" className="min-h-[44px] min-w-[44px] p-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tulis Artikel</h1>
          <p className="text-slate-500 text-sm">Buat artikel baru</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Judul */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Judul Artikel *</Label>
            <Input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Tips Memilih Asuransi Mobil yang Tepat"
              className="min-h-[44px] text-base"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label className="text-sm text-slate-500">Slug (URL)</Label>
            <Input
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="tips-memilih-asuransi-mobil"
              className="min-h-[44px]"
            />
            <p className="text-xs text-slate-400">Akan terisi otomatis dari judul. Bisa diedit manual.</p>
          </div>

          {/* Kategori & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Kategori</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v === "none" ? "" : v })}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa Kategori</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ringkasan */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Ringkasan</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Ringkasan singkat artikel (tampil di daftar artikel)..."
              rows={3}
              className="min-h-[44px]"
            />
          </div>

          {/* Konten */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Konten Artikel</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Tulis konten artikel di sini..."
              rows={12}
              className="min-h-[200px] text-base"
            />
          </div>

          {/* Gambar Sampul */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Gambar Sampul (URL)</Label>
            <Input
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              placeholder="https://contoh.com/gambar.jpg"
              className="min-h-[44px]"
            />
            {form.coverImage && (
              <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 max-w-sm">
                <img
                  src={form.coverImage}
                  alt="Preview gambar sampul"
                  className="w-full h-auto max-h-48 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
          </div>

          {/* SEO Section */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-base font-semibold text-slate-700 mb-4">SEO</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Meta Title</Label>
                <Input
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  placeholder="Judul untuk search engine (opsional)"
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Meta Description</Label>
                <Textarea
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  placeholder="Deskripsi untuk search engine (opsional)"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
            <Link href="/admin/articles">
              <Button variant="outline" className="min-h-[44px] w-full sm:w-auto px-8">
                Batal
              </Button>
            </Link>
            <Button
              className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px] px-8"
              onClick={handleSave}
              disabled={saving || !form.title.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
