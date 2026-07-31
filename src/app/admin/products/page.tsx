"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Package } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  benefits: string;
  estimatedPrice: number;
  minimumOfferPrice: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

const PRODUCT_CATEGORIES = [
  { value: "Kendaraan", label: "Kendaraan" },
  { value: "Perjalanan", label: "Perjalanan" },
  { value: "Hewan", label: "Hewan" },
  { value: "Personal", label: "Personal" },
  { value: "Kebakaran", label: "Kebakaran" },
  { value: "Kesehatan", label: "Kesehatan" },
  { value: "lainnya", label: "Lainnya" },
];

function formatCurrency(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function getCategoryLabel(cat: string): string {
  return PRODUCT_CATEGORIES.find(c => c.value === cat)?.label || cat;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "mobil",
    description: "",
    benefits: "",
    estimatedPrice: "",
    minimumOfferPrice: "",
    sortOrder: "0",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch {
      toast.error("Gagal memuat data produk");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          benefits: form.benefits ? JSON.stringify(form.benefits.split("\n").filter(Boolean)) : "[]",
          estimatedPrice: parseInt(form.estimatedPrice) || 0,
          minimumOfferPrice: parseInt(form.minimumOfferPrice) || 0,
          sortOrder: parseInt(form.sortOrder) || 0,
        }),
      });
      if (res.ok) {
        setShowAddDialog(false);
        resetForm();
        fetchProducts();
        toast.success("Produk berhasil ditambahkan");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menambah produk");
      }
    } catch {
      toast.error("Gagal menambah produk");
    }
  };

  const handleEdit = async () => {
    if (!editProduct) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editProduct.id,
          name: form.name,
          slug: form.slug,
          category: form.category,
          description: form.description,
          benefits: form.benefits ? JSON.stringify(form.benefits.split("\n").filter(Boolean)) : "[]",
          estimatedPrice: parseInt(form.estimatedPrice) || 0,
          minimumOfferPrice: parseInt(form.minimumOfferPrice) || 0,
          sortOrder: parseInt(form.sortOrder) || 0,
        }),
      });
      if (res.ok) {
        setShowEditDialog(false);
        setEditProduct(null);
        resetForm();
        fetchProducts();
        toast.success("Produk berhasil diperbarui");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal memperbarui produk");
      }
    } catch {
      toast.error("Gagal memperbarui produk");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, isActive: !product.isActive }),
      });
      if (res.ok) {
        fetchProducts();
        toast.success(product.isActive ? "Produk dinonaktifkan" : "Produk diaktifkan");
      } else {
        toast.error("Gagal mengubah status produk");
      }
    } catch {
      toast.error("Gagal mengubah status produk");
    }
  };

  const openEditDialog = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description || "",
      benefits: product.benefits ? JSON.parse(product.benefits).join("\n") : "",
      estimatedPrice: product.estimatedPrice.toString(),
      minimumOfferPrice: product.minimumOfferPrice.toString(),
      sortOrder: product.sortOrder.toString(),
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      category: "mobil",
      description: "",
      benefits: "",
      estimatedPrice: "",
      minimumOfferPrice: "",
      sortOrder: "0",
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Produk</h1>
          <p className="text-slate-500 text-sm">Kelola jenis produk asuransi yang tersedia</p>
        </div>
        <Button
          className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px]"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5 text-sky-500" />
              Daftar Produk
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga Estimasi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Urutan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                        Belum ada produk
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id} className={`hover:bg-slate-50 ${!product.isActive ? "opacity-50" : ""}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-700">{product.name}</p>
                            <p className="text-xs text-slate-400">{product.slug}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-sky-50 text-sky-700">
                            {getCategoryLabel(product.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{formatCurrency(product.estimatedPrice)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={product.isActive}
                              onCheckedChange={() => handleToggleActive(product)}
                            />
                            <span className={`text-xs ${product.isActive ? "text-green-600" : "text-slate-400"}`}>
                              {product.isActive ? "Aktif" : "Nonaktif"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">{product.sortOrder}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)} className="text-sky-500 min-h-[44px] min-w-[44px] p-0">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-3">
        <div className="flex items-center gap-2 px-1 pb-2">
          <Package className="h-5 w-5 text-sky-500" />
          <h2 className="text-base font-semibold text-slate-800">Daftar Produk</h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400">Memuat data...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-slate-400">Belum ada produk</div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className={`rounded-lg border border-slate-200 bg-white p-4 space-y-3 ${!product.isActive ? "opacity-50" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800 text-base">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.slug}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)} className="text-sky-500 min-h-[44px] min-w-[44px] p-0">
                  <Pencil className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-sky-50 text-sky-700">
                  {getCategoryLabel(product.category)}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-500">
                  Estimasi: <span className="font-medium text-slate-700">{formatCurrency(product.estimatedPrice)}</span>
                </span>
                <span className="text-slate-500">
                  Min: <span className="font-medium text-slate-700">{formatCurrency(product.minimumOfferPrice)}</span>
                </span>
              </div>

              {/* Aktif/Nonaktif toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-sm text-slate-600">Status:</span>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={product.isActive}
                    onCheckedChange={() => handleToggleActive(product)}
                  />
                  <span className={`text-sm font-medium ${product.isActive ? "text-green-600" : "text-slate-400"}`}>
                    {product.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Produk Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Produk *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value, slug: generateSlug(e.target.value) }))}
                  placeholder="Asuransi Mobil"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="asuransi-mobil"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select value={form.category} onValueChange={(v) => setForm(prev => ({ ...prev, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Harga Estimasi (Rp)</Label>
                <Input type="number" value={form.estimatedPrice} onChange={(e) => setForm(prev => ({ ...prev, estimatedPrice: e.target.value }))} placeholder="50000000" />
              </div>
              <div className="space-y-2">
                <Label>Min. Harga Penawaran (Rp)</Label>
                <Input type="number" value={form.minimumOfferPrice} onChange={(e) => setForm(prev => ({ ...prev, minimumOfferPrice: e.target.value }))} placeholder="10000000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Deskripsi produk asuransi..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Manfaat (satu per baris)</Label>
              <Textarea value={form.benefits} onChange={(e) => setForm(prev => ({ ...prev, benefits: e.target.value }))} placeholder={"Ganti rugi total\nBengkel resmi\nRoadside assistance"} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Urutan Tampil</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => setForm(prev => ({ ...prev, sortOrder: e.target.value }))} placeholder="0" />
              <p className="text-xs text-slate-400">Produk dengan angka kecil tampil duluan</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }} className="min-h-[44px]">Batal</Button>
            <Button
              className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px] px-6"
              onClick={handleAdd}
              disabled={!form.name || !form.slug || !form.category}
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Produk *</Label>
                <Input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kategori *</Label>
              <Select value={form.category} onValueChange={(v) => setForm(prev => ({ ...prev, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Harga Estimasi (Rp)</Label>
                <Input type="number" value={form.estimatedPrice} onChange={(e) => setForm(prev => ({ ...prev, estimatedPrice: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Min. Harga Penawaran (Rp)</Label>
                <Input type="number" value={form.minimumOfferPrice} onChange={(e) => setForm(prev => ({ ...prev, minimumOfferPrice: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Manfaat (satu per baris)</Label>
              <Textarea value={form.benefits} onChange={(e) => setForm(prev => ({ ...prev, benefits: e.target.value }))} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Urutan Tampil</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => setForm(prev => ({ ...prev, sortOrder: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowEditDialog(false); setEditProduct(null); resetForm(); }} className="min-h-[44px]">Batal</Button>
            <Button
              className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px] px-6"
              onClick={handleEdit}
              disabled={!form.name || !form.slug || !form.category}
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
