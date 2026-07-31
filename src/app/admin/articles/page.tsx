"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  MoreVertical,
  Newspaper,
  Tag,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// ─── Types ───

interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { articles: number };
}

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  coverImage: string | null;
  excerpt: string | null;
  createdAt: string;
  publishedAt: string | null;
  category: ArticleCategory | null;
  categoryId: string | null;
}

// ─── Status Config ───

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-yellow-100 text-yellow-700" },
  published: { label: "Published", color: "bg-green-100 text-green-700" },
  archived: { label: "Archived", color: "bg-slate-100 text-slate-500" },
};

// ─── Slug Helper ───

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Component ───

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Category dialog state
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editCategory, setEditCategory] = useState<ArticleCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "" });
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<ArticleCategory | null>(null);

  // Article delete
  const [deleteArticleTarget, setDeleteArticleTarget] = useState<Article | null>(null);

  // Fetch articles
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);
      params.set("page", page.toString());
      params.set("limit", "10");

      const res = await fetch(`/api/articles?${params}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      toast.error("Gagal memuat artikel");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/article-categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch {
      toast.error("Gagal memuat kategori");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // ─── Article Delete ───
  const handleDeleteArticle = async () => {
    if (!deleteArticleTarget) return;
    try {
      const res = await fetch(`/api/articles/${deleteArticleTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Artikel berhasil dihapus");
        setDeleteArticleTarget(null);
        fetchArticles();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menghapus artikel");
      }
    } catch {
      toast.error("Gagal menghapus artikel");
    }
  };

  // ─── Category CRUD ───
  const handleSaveCategory = async () => {
    try {
      const url = editCategory
        ? `/api/article-categories/${editCategory.id}`
        : "/api/article-categories";
      const method = editCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      if (res.ok) {
        toast.success(editCategory ? "Kategori berhasil diperbarui" : "Kategori berhasil ditambahkan");
        setShowCategoryDialog(false);
        setEditCategory(null);
        setCategoryForm({ name: "", slug: "", description: "" });
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menyimpan kategori");
      }
    } catch {
      toast.error("Gagal menyimpan kategori");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    try {
      const res = await fetch(`/api/article-categories/${deleteCategoryTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Kategori berhasil dihapus");
        setDeleteCategoryTarget(null);
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menghapus kategori");
      }
    } catch {
      toast.error("Gagal menghapus kategori");
    }
  };

  const openCategoryEdit = (cat: ArticleCategory) => {
    setEditCategory(cat);
    setCategoryForm({ name: cat.name, slug: cat.slug, description: cat.description || "" });
    setShowCategoryDialog(true);
  };

  const openCategoryAdd = () => {
    setEditCategory(null);
    setCategoryForm({ name: "", slug: "", description: "" });
    setShowCategoryDialog(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Artikel</h1>
          <p className="text-slate-500 text-sm">Kelola artikel & tips asuransi</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={openCategoryAdd}
            className="min-h-[44px]"
          >
            <Tag className="h-4 w-4 mr-2" />
            Kategori
          </Button>
          <Link href="/admin/articles/new">
            <Button className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px] px-6 text-base">
              <Plus className="h-5 w-5 mr-2" />
              Tulis Artikel
            </Button>
          </Link>
        </div>
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm text-slate-600 hover:border-sky-300 transition-colors"
            >
              <span className="font-medium">{cat.name}</span>
              <span className="text-xs text-slate-400">({cat._count?.articles || 0})</span>
              <button
                onClick={() => openCategoryEdit(cat)}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-sky-500 hover:text-sky-600 min-h-[32px] min-w-[32px] inline-flex items-center justify-center"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari judul artikel..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 min-h-[44px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-44 min-h-[44px]">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {Object.entries(statusConfig).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-sky-500" />
            Daftar Artikel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : articles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                        Belum ada artikel
                      </TableCell>
                    </TableRow>
                  ) : (
                    articles.map((article) => {
                      const config = statusConfig[article.status] || {
                        label: article.status,
                        color: "bg-slate-100 text-slate-700",
                      };
                      return (
                        <TableRow key={article.id} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="min-w-0 max-w-xs">
                              <p className="font-medium text-slate-700 truncate">
                                {article.title}
                              </p>
                              <p className="text-xs text-slate-400 truncate">{article.slug}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {article.category ? (
                              <Badge variant="secondary" className="bg-sky-50 text-sky-700">
                                {article.category.name}
                              </Badge>
                            ) : (
                              <span className="text-slate-400 text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={config.color} variant="secondary">
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {formatDate(article.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="min-h-[44px] min-w-[44px] p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/articles/${article.id}/edit`}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeleteArticleTarget(article)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden p-4 space-y-3">
            {loading ? (
              <div className="text-center py-8 text-slate-400">Memuat data...</div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8 text-slate-400">Belum ada artikel</div>
            ) : (
              articles.map((article) => {
                const config = statusConfig[article.status] || {
                  label: article.status,
                  color: "bg-slate-100 text-slate-700",
                };
                return (
                  <div
                    key={article.id}
                    className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 truncate text-base">
                          {article.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{article.slug}</p>
                      </div>
                      <Badge className={`${config.color} shrink-0`} variant="secondary">
                        {config.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      {article.category ? (
                        <Badge variant="secondary" className="bg-sky-50 text-sky-700 text-xs">
                          {article.category.name}
                        </Badge>
                      ) : (
                        <span className="text-slate-400 text-xs">Tanpa kategori</span>
                      )}
                      <span className="text-slate-400 text-xs">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="inline-flex items-center text-sm font-medium text-sky-500 hover:text-sky-600"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteArticleTarget(article)}
                        className="text-red-400 hover:text-red-600 min-h-[44px] min-w-[44px] p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Halaman {page} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="min-h-[44px]"
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="min-h-[44px]"
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Article Confirmation */}
      <AlertDialog open={!!deleteArticleTarget} onOpenChange={(open) => { if (!open) setDeleteArticleTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
            <AlertDialogDescription>
              Artikel &quot;{deleteArticleTarget?.title}&quot; akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteArticle} className="bg-red-500 hover:bg-red-600 text-white min-h-[44px]">
              Hapus Artikel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editCategory ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Kategori *</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="Tips Asuransi"
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                placeholder="tips-asuransi"
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Deskripsi singkat kategori..."
                rows={3}
              />
            </div>

            {/* Existing categories list for quick delete */}
            {!editCategory && categories.length > 0 && (
              <div className="border-t border-slate-200 pt-4">
                <Label className="text-sm text-slate-500 mb-2 block">Kategori yang sudah ada:</Label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between py-1">
                      <span className="text-sm text-slate-600">{cat.name} ({cat._count?.articles || 0})</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openCategoryEdit(cat)}
                          className="text-sky-500 h-7 w-7 p-0"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteCategoryTarget(cat)}
                          className="text-red-400 hover:text-red-600 h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCategoryDialog(false)} className="min-h-[44px]">
                Batal
              </Button>
              <Button
                className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px] px-6"
                onClick={handleSaveCategory}
                disabled={!categoryForm.name}
              >
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation */}
      <AlertDialog open={!!deleteCategoryTarget} onOpenChange={(open) => { if (!open) setDeleteCategoryTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Kategori &quot;{deleteCategoryTarget?.name}&quot; akan dihapus permanen.
              {deleteCategoryTarget?._count?.articles ? ` Masih ada ${deleteCategoryTarget._count.articles} artikel dalam kategori ini.` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-500 hover:bg-red-600 text-white min-h-[44px]">
              Hapus Kategori
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
