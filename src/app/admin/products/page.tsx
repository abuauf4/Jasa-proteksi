"use client";

import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, X, Save, Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  name: "",
  slug: "",
  category: "Kendaraan",
  description: "",
  benefits: "",
  estimatedPrice: "",
  minimumOfferPrice: "",
  isActive: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?active=false");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description,
      benefits: product.benefits,
      estimatedPrice: product.estimatedPrice.toString(),
      minimumOfferPrice: product.minimumOfferPrice.toString(),
      isActive: product.isActive,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const body: any = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        category: form.category,
        description: form.description,
        benefits: form.benefits,
        estimatedPrice: parseInt(form.estimatedPrice) || 0,
        minimumOfferPrice: parseInt(form.minimumOfferPrice) || 0,
        isActive: form.isActive,
      };

      if (editingId) {
        // Only send changed fields for PUT
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch {
      console.error("Failed to delete product");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      fetchProducts();
    } catch {
      console.error("Failed to toggle product");
    }
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white/90 font-[family-name:var(--font-montserrat)] mb-1">Produk</h1>
          <p className="text-white/30 text-sm">Kelola produk asuransi Anda</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2E7D6F] text-white text-xs font-semibold tracking-wider hover:bg-[#3A9B8A] transition-all duration-500 rounded-md"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Produk
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-xl bg-[#0A0F1E] border border-white/[0.06] rounded-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
                  <h3 className="text-white/80 font-semibold font-[family-name:var(--font-montserrat)]">
                    {editingId ? "Edit Produk" : "Tambah Produk Baru"}
                  </h3>
                  <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-white/40 text-[10px] tracking-wider uppercase mb-1.5 block">Nama Produk</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                        slug: prev.slug || e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                      }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-2.5 text-white/80 text-sm focus:outline-none focus:border-[#2E7D6F]/40 transition-all duration-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/40 text-[10px] tracking-wider uppercase mb-1.5 block">Slug</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-2.5 text-white/80 text-sm focus:outline-none focus:border-[#2E7D6F]/40 transition-all duration-500"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-[10px] tracking-wider uppercase mb-1.5 block">Kategori</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-2.5 text-white/80 text-sm focus:outline-none focus:border-[#2E7D6F]/40 transition-all duration-500"
                      >
                        <option value="Kendaraan" className="bg-[#0A0F1E]">Kendaraan</option>
                        <option value="Perjalanan" className="bg-[#0A0F1E]">Perjalanan</option>
                        <option value="Hewan" className="bg-[#0A0F1E]">Hewan</option>
                        <option value="Personal" className="bg-[#0A0F1E]">Personal</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/40 text-[10px] tracking-wider uppercase mb-1.5 block">Deskripsi</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-2.5 text-white/80 text-sm focus:outline-none focus:border-[#2E7D6F]/40 transition-all duration-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-[10px] tracking-wider uppercase mb-1.5 block">Benefits (JSON array)</label>
                    <textarea
                      value={form.benefits}
                      onChange={(e) => setForm((prev) => ({ ...prev, benefits: e.target.value }))}
                      rows={3}
                      placeholder='["Benefit 1", "Benefit 2"]'
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-2.5 text-white/80 text-sm font-mono focus:outline-none focus:border-[#2E7D6F]/40 transition-all duration-500 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/40 text-[10px] tracking-wider uppercase mb-1.5 block">Estimasi Harga (Rp)</label>
                      <input
                        type="number"
                        value={form.estimatedPrice}
                        onChange={(e) => setForm((prev) => ({ ...prev, estimatedPrice: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-2.5 text-[#2E7D6F] text-sm font-semibold focus:outline-none focus:border-[#2E7D6F]/40 transition-all duration-500"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-[10px] tracking-wider uppercase mb-1.5 block">Minimum Penawaran (Rp)</label>
                      <input
                        type="number"
                        value={form.minimumOfferPrice}
                        onChange={(e) => setForm((prev) => ({ ...prev, minimumOfferPrice: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-2.5 text-white/80 text-sm focus:outline-none focus:border-[#2E7D6F]/40 transition-all duration-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-white/40 text-[10px] tracking-wider uppercase">Aktif</label>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                      className={`w-10 h-5 rounded-full transition-all duration-500 ${form.isActive ? "bg-[#2E7D6F]" : "bg-white/10"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-500 ${form.isActive ? "translate-x-5.5" : "translate-x-0.5"}`} />
                    </button>
                  </div>

                  {error && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 text-amber-400/80 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-5 py-2.5 border border-white/10 text-white/40 text-xs font-medium tracking-wider hover:border-white/20 transition-all duration-500 rounded-md"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2E7D6F] text-white text-xs font-semibold tracking-wider hover:bg-[#3A9B8A] transition-all duration-500 rounded-md disabled:opacity-40"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {saving ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-white/10 border-t-[#2E7D6F] rounded-full animate-spin mx-auto" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Shield className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">Belum ada produk</p>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="text-left px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Produk</th>
                  <th className="text-left px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Kategori</th>
                  <th className="text-right px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Estimasi</th>
                  <th className="text-right px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Min. Penawaran</th>
                  <th className="text-center px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Status</th>
                  <th className="text-right px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors duration-500">
                    <td className="px-6 py-4">
                      <p className="text-white/80 text-sm font-medium">{product.name}</p>
                      <p className="text-white/20 text-[10px]">{product.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/50 text-xs">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[#2E7D6F] text-sm font-semibold">{formatRupiah(product.estimatedPrice)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-white/50 text-sm">{formatRupiah(product.minimumOfferPrice)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`px-3 py-1 rounded text-[10px] tracking-wider font-medium transition-all duration-500 ${
                          product.isActive
                            ? "bg-[#2E7D6F]/10 text-[#2E7D6F] border border-[#2E7D6F]/20"
                            : "bg-white/5 text-white/30 border border-white/10"
                        }`}
                      >
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-[#2E7D6F] transition-colors duration-500"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors duration-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
