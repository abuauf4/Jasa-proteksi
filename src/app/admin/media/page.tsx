"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Copy, ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";

// ─── Types ───

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  alt: string | null;
  size: number | null;
  mimeType: string | null;
  createdAt: string;
}

// ─── Component ───

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    url: "",
    alt: "",
    filename: "",
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media?limit=100");
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media);
      }
    } catch {
      toast.error("Gagal memuat media");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = async () => {
    if (!form.url.trim()) {
      toast.error("URL media wajib diisi");
      return;
    }

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: form.url,
          alt: form.alt || null,
          filename: form.filename || undefined,
        }),
      });

      if (res.ok) {
        toast.success("Media berhasil ditambahkan");
        setShowAddDialog(false);
        setForm({ url: "", alt: "", filename: "" });
        fetchMedia();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menambah media");
      }
    } catch {
      toast.error("Gagal menambah media");
    }
  };

  const handleDeleteMedia = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/media/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Media berhasil dihapus");
        setDeleteTarget(null);
        fetchMedia();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menghapus media");
      }
    } catch {
      toast.error("Gagal menghapus media");
    }
  };

  const handleCopyUrl = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      toast.success("URL disalin!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Gagal menyalin URL");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Media Library</h1>
          <p className="text-slate-500 text-sm">Kelola gambar dan file media</p>
        </div>
        <Button
          className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px]"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Media
        </Button>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
        </div>
      ) : media.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 mb-1">Belum ada media</p>
            <p className="text-slate-400 text-sm">Klik &quot;Tambah Media&quot; untuk menambahkan gambar atau file</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-lg border border-slate-200 bg-white overflow-hidden hover:border-sky-300 hover:shadow-sm transition-all"
            >
              {/* Image preview */}
              <div className="aspect-square bg-slate-100 relative">
                <img
                  src={item.url}
                  alt={item.alt || item.filename || 'Media image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'flex items-center justify-center w-full h-full text-slate-400';
                    placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                    el.parentElement?.appendChild(placeholder);
                  }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCopyUrl(item)}
                    className="min-h-[44px] min-w-[44px] p-0"
                  >
                    {copiedId === item.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDeleteTarget(item)}
                    className="min-h-[44px] min-w-[44px] p-0 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="text-xs text-slate-600 truncate font-medium">{item.filename}</p>
                <p className="text-xs text-slate-400 truncate">{item.alt || ""}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>URL Media *</Label>
              <Input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://contoh.com/gambar.jpg"
                className="min-h-[44px]"
              />
              <p className="text-xs text-slate-400">Masukkan URL gambar atau file yang ingin disimpan</p>
            </div>
            <div className="space-y-2">
              <Label>Nama File</Label>
              <Input
                value={form.filename}
                onChange={(e) => setForm({ ...form, filename: e.target.value })}
                placeholder="gambar-sampul.jpg"
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={form.alt}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
                placeholder="Deskripsi gambar untuk aksesibilitas"
                className="min-h-[44px]"
              />
            </div>

            {/* Preview */}
            {form.url && (
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={form.url}
                  alt="Preview"
                  className="w-full h-auto max-h-48 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="min-h-[44px]">
                Batal
              </Button>
              <Button
                className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px] px-6"
                onClick={handleAddMedia}
                disabled={!form.url.trim()}
              >
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Media?</AlertDialogTitle>
            <AlertDialogDescription>
              File &quot;{deleteTarget?.filename}&quot; akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMedia} className="bg-red-500 hover:bg-red-600 text-white min-h-[44px]">
              Hapus Media
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
