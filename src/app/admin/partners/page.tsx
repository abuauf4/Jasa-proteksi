"use client";

import { useEffect, useState, useMemo } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Building2, Trash2, Info, Database, Search } from "lucide-react";
import { toast } from "sonner";

// ─── Addon definitions (labels for each addon key) ───
const ADDON_OPTIONS = [
  { key: "flood", label: "Banjir & Angin Kencang" },
  { key: "earthquake", label: "Gempa Bumi & Tsunami" },
  { key: "srcc", label: "Kerusohan & Huru-Hara (SRCC)" },
  { key: "terrorism", label: "Terorisme & Sabotase" },
  { key: "bengkelAuthorized", label: "Bengkel Authorized" },
  { key: "tpl", label: "Tanggung Jawab Pihak Ketiga (TPL)" },
  { key: "paDriver", label: "Perlindungan Jiwa Supir" },
  { key: "paPassenger", label: "Perlindungan Jiwa Penumpang" },
];

interface AddonRateOverride {
  id?: string;
  addonKey: string;
  addonLabel: string;
  rate: number;
  _delete?: boolean;
}

interface Partner {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  status: string;
  benefits: string | null;
  facilities: string | null;
  modifier: number;
  addonModifier: number;
  adminFee: number;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  addonRateOverrides?: AddonRateOverride[];
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editPartner, setEditPartner] = useState<Partner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    slug: "",
    logoUrl: "",
    status: "active",
    benefits: "",
    facilities: "",
    modifier: "1.0",
    addonModifier: "1.0",
    adminFee: "50000",
    description: "",
    sortOrder: "0",
  });
  const [addonOverrides, setAddonOverrides] = useState<AddonRateOverride[]>([]);
  const [rateInputs, setRateInputs] = useState<Record<number, string>>({});
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/admin/partners");
      if (res.ok) {
        const data = await res.json();
        setPartners(data.partners);
      }
    } catch {
      toast.error("Gagal memuat data partner");
    } finally {
      setLoading(false);
    }
  };

  // Filter partners by search query
  const filteredPartners = useMemo(() => {
    if (!searchQuery.trim()) return partners;
    const q = searchQuery.toLowerCase().trim();
    return partners.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [partners, searchQuery]);

  const handleAddPartner = async () => {
    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          logoUrl: form.logoUrl || null,
          status: form.status,
          benefits: form.benefits ? JSON.stringify(form.benefits.split("\n").filter(Boolean)) : null,
          facilities: form.facilities ? JSON.stringify(form.facilities.split("\n").filter(Boolean)) : null,
          modifier: parseFloat(form.modifier) || 1.0,
          addonModifier: parseFloat(form.addonModifier) || 1.0,
          adminFee: parseInt(form.adminFee) || 50000,
          description: form.description || null,
          sortOrder: parseInt(form.sortOrder) || 0,
        }),
      });
      if (res.ok) {
        setShowAddDialog(false);
        resetForm();
        fetchPartners();
        toast.success("Partner berhasil ditambahkan");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menambah partner");
      }
    } catch {
      toast.error("Gagal menambah partner");
    }
  };

  const handleEditPartner = async () => {
    if (!editPartner) return;
    try {
      const overridePayload = addonOverrides
        .filter(o => !o._delete || o.id)
        .map(o => ({
          addonKey: o.addonKey,
          addonLabel: o.addonLabel,
          rate: o.rate,
          _delete: o._delete,
        }));

      const res = await fetch(`/api/admin/partners/${editPartner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          logoUrl: form.logoUrl || null,
          status: form.status,
          benefits: form.benefits ? JSON.stringify(form.benefits.split("\n").filter(Boolean)) : null,
          facilities: form.facilities ? JSON.stringify(form.facilities.split("\n").filter(Boolean)) : null,
          modifier: parseFloat(form.modifier) || 1.0,
          addonModifier: parseFloat(form.addonModifier) || 1.0,
          adminFee: parseInt(form.adminFee) || 50000,
          description: form.description || null,
          sortOrder: parseInt(form.sortOrder) || 0,
          addonRateOverrides: overridePayload,
        }),
      });
      if (res.ok) {
        setShowEditDialog(false);
        setEditPartner(null);
        resetForm();
        fetchPartners();
        toast.success("Partner berhasil diperbarui");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal memperbarui partner");
      }
    } catch {
      toast.error("Gagal memperbarui partner");
    }
  };

  const handleDeletePartner = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/partners/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteTarget(null);
        fetchPartners();
        toast.success("Partner berhasil dihapus");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menghapus partner");
      }
    } catch {
      toast.error("Gagal menghapus partner");
    }
  };

  const openEditDialog = (partner: Partner) => {
    setEditPartner(partner);
    setForm({
      name: partner.name,
      slug: partner.slug,
      logoUrl: partner.logoUrl || "",
      status: partner.status,
      benefits: partner.benefits ? JSON.parse(partner.benefits).join("\n") : "",
      facilities: partner.facilities ? JSON.parse(partner.facilities).join("\n") : "",
      modifier: partner.modifier.toString(),
      addonModifier: (partner.addonModifier ?? 1.0).toString(),
      adminFee: (partner.adminFee ?? 50000).toString(),
      description: partner.description || "",
      sortOrder: partner.sortOrder.toString(),
    });
    const overrides = (partner.addonRateOverrides || []).map(o => ({
      id: o.id,
      addonKey: o.addonKey,
      addonLabel: o.addonLabel,
      rate: o.rate,
    }));
    setAddonOverrides(overrides);
    const inputs: Record<number, string> = {};
    overrides.forEach((o, i) => {
      if (o.rate) inputs[i] = String(o.rate);
    });
    setRateInputs(inputs);
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      logoUrl: "",
      status: "active",
      benefits: "",
      facilities: "",
      modifier: "1.0",
      addonModifier: "1.0",
      adminFee: "50000",
      description: "",
      sortOrder: "0",
    });
    setAddonOverrides([]);
    setRateInputs({});
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSeedPartners = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/admin/partners/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Partner berhasil di-seed");
        fetchPartners();
      } else {
        toast.error(data.error || "Gagal seed partner");
      }
    } catch {
      toast.error("Gagal seed partner");
    } finally {
      setIsSeeding(false);
    }
  };

  // Addon override handlers
  const addAddonOverride = () => {
    const usedKeys = addonOverrides.filter(o => !o._delete).map(o => o.addonKey);
    const firstAvailable = ADDON_OPTIONS.find(a => !usedKeys.includes(a.key));
    if (!firstAvailable) return;
    const newIndex = addonOverrides.length;
    setAddonOverrides(prev => [
      ...prev,
      { addonKey: firstAvailable.key, addonLabel: firstAvailable.label, rate: 0 },
    ]);
    setRateInputs(prev => ({ ...prev, [newIndex]: "" }));
  };

  const removeAddonOverride = (index: number) => {
    setAddonOverrides(prev => {
      const item = prev[index];
      if (item.id) {
        return prev.map((o, i) => i === index ? { ...o, _delete: true } : o);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateAddonOverride = (index: number, field: "addonKey" | "rate", value: string | number) => {
    if (field === "rate") {
      const strVal = String(value);
      setRateInputs(prev => ({ ...prev, [index]: strVal }));
      const numVal = parseFloat(strVal);
      setAddonOverrides(prev => prev.map((o, i) => {
        if (i !== index) return o;
        return { ...o, rate: isNaN(numVal) ? 0 : numVal };
      }));
      return;
    }
    setAddonOverrides(prev => prev.map((o, i) => {
      if (i !== index) return o;
      const addonDef = ADDON_OPTIONS.find(a => a.key === value);
      return { ...o, addonKey: String(value), addonLabel: addonDef?.label || String(value) };
    }));
  };

  // Helper: get addon label from key
  const getAddonLabel = (key: string) => ADDON_OPTIONS.find(a => a.key === key)?.label || key;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Partner Asuransi</h1>
          <p className="text-slate-500 text-sm">Kelola partner perusahaan asuransi</p>
        </div>
        <div className="flex items-center gap-2">
          {partners.length === 0 && !loading && (
            <Button
              variant="outline"
              onClick={handleSeedPartners}
              disabled={isSeeding}
              className="border-amber-300 text-amber-600 hover:bg-amber-50 min-h-[44px]"
            >
              <Database className="h-4 w-4 mr-2" />
              {isSeeding ? "Menyimpan..." : "Isi Data Default"}
            </Button>
          )}
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px]"
            onClick={() => { resetForm(); setShowAddDialog(true); }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Partner
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {partners.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari partner berdasarkan nama atau slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 min-h-[44px]"
          />
        </div>
      )}

      {/* Desktop Table (md+) */}
      <div className="hidden md:block">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-5 w-5 text-sky-500" />
              Daftar Partner
              {searchQuery && (
                <Badge variant="secondary" className="bg-sky-50 text-sky-700 text-xs ml-2">
                  {filteredPartners.length} dari {partners.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pengali Premi</TableHead>
                    <TableHead>Biaya Admin</TableHead>
                    <TableHead>Override Addon</TableHead>
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
                  ) : filteredPartners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-slate-400 mb-2">
                          {searchQuery ? "Tidak ada partner yang cocok" : "Belum ada partner di database"}
                        </p>
                        {!searchQuery && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSeedPartners}
                            disabled={isSeeding}
                            className="border-amber-300 text-amber-600 hover:bg-amber-50"
                          >
                            <Database className="h-4 w-4 mr-1.5" />
                            {isSeeding ? "Menyimpan..." : "Isi Data Default (5 Partner)"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPartners.map((partner) => (
                      <TableRow key={partner.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-700">
                          {partner.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={partner.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                          >
                            {partner.status === "active" ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{partner.modifier}×</TableCell>
                        <TableCell className="text-sm">Rp {((partner.adminFee ?? 50000) as number).toLocaleString("id-ID")}</TableCell>
                        <TableCell className="text-sm">
                          {partner.addonRateOverrides && partner.addonRateOverrides.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {partner.addonRateOverrides.map(o => (
                                <Badge key={o.addonKey} variant="secondary" className="bg-sky-50 text-sky-700 text-[10px]">
                                  {o.addonLabel}: {(o.rate * 100).toFixed(2)}%
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">Default (pakai rate global)</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(partner)}
                              className="text-sky-500 min-h-[44px] min-w-[44px] p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(partner)}
                              className="text-red-400 hover:text-red-600 min-h-[44px] min-w-[44px] p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Mobile Card List (< md) */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center gap-2 px-1 pb-2">
          <Building2 className="h-5 w-5 text-sky-500" />
          <h2 className="text-base font-semibold text-slate-800">Daftar Partner</h2>
          {searchQuery && (
            <Badge variant="secondary" className="bg-sky-50 text-sky-700 text-xs ml-auto">
              {filteredPartners.length} dari {partners.length}
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400">Memuat data...</div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-3">
              {searchQuery ? "Tidak ada partner yang cocok" : "Belum ada partner di database"}
            </p>
            {!searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSeedPartners}
                disabled={isSeeding}
                className="border-amber-300 text-amber-600 hover:bg-amber-50"
              >
                <Database className="h-4 w-4 mr-1.5" />
                {isSeeding ? "Menyimpan..." : "Isi Data Default (5 Partner)"}
              </Button>
            )}
          </div>
        ) : (
          filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
            >
              {/* Name & actions */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800 text-base leading-tight">
                    {partner.name}
                  </p>
                  <p className="text-slate-400 text-sm mt-0.5">{partner.slug}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(partner)}
                    className="text-sky-500 min-h-[44px] min-w-[44px] p-0"
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(partner)}
                    className="text-red-400 hover:text-red-600 min-h-[44px] min-w-[44px] p-0"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Status, Modifier, Admin Fee */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge
                  variant="secondary"
                  className={
                    partner.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {partner.status === "active" ? "Aktif" : "Nonaktif"}
                </Badge>
                <span className="text-slate-500">
                  Pengali: <span className="font-medium text-slate-700">{partner.modifier}×</span>
                </span>
                <span className="text-slate-500">
                  Admin: <span className="font-medium text-slate-700">Rp {((partner.adminFee ?? 50000) as number).toLocaleString("id-ID")}</span>
                </span>
              </div>

              {/* Addon overrides */}
              {partner.addonRateOverrides && partner.addonRateOverrides.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Override Addon:</p>
                  <div className="flex flex-wrap gap-1">
                    {partner.addonRateOverrides.map(o => (
                      <Badge key={o.addonKey} variant="secondary" className="bg-sky-50 text-sky-700 text-[10px]">
                        {o.addonLabel}: {(o.rate * 100).toFixed(2)}%
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Partner?</AlertDialogTitle>
            <AlertDialogDescription>
              Partner &quot;{deleteTarget?.name}&quot; akan dihapus permanen berserta semua override rate addon-nya. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePartner} className="bg-red-500 hover:bg-red-600 text-white min-h-[44px]">
              Hapus Partner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Partner Baru</DialogTitle>
          </DialogHeader>
          <PartnerForm
            form={form}
            setForm={setForm}
            onSubmit={handleAddPartner}
            onCancel={() => { setShowAddDialog(false); resetForm(); }}
            generateSlug={generateSlug}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
          </DialogHeader>
          <PartnerForm
            form={form}
            setForm={setForm}
            onSubmit={handleEditPartner}
            onCancel={() => { setShowEditDialog(false); setEditPartner(null); resetForm(); }}
            generateSlug={generateSlug}
          />

          {/* ─── Addon Rate Overrides Section ─── */}
          <div className="border-t border-slate-200 pt-4 mt-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Rate Addon Khusus Partner Ini</h3>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Override rate addon buat partner ini. Kosong = pakai rate global.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAddonOverride}
                className="text-sky-500 border-sky-200 hover:bg-sky-50 min-h-[44px]"
                disabled={addonOverrides.filter(o => !o._delete).length >= ADDON_OPTIONS.length}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Tambah
              </Button>
            </div>

            {addonOverrides.filter(o => !o._delete).length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
                Belum ada override — semua addon pakai rate global
              </div>
            ) : (
              <div className="space-y-3">
                {addonOverrides.map((override, index) => {
                  if (override._delete) return null;
                  const usedKeys = addonOverrides.filter((o, i) => !o._delete && i !== index).map(o => o.addonKey);
                  const availableAddons = ADDON_OPTIONS.filter(a => !usedKeys.includes(a.key));

                  return (
                    <div key={override.addonKey + index} className="flex items-center gap-2">
                      {/* Addon selector */}
                      <Select
                        value={override.addonKey}
                        onValueChange={(v) => updateAddonOverride(index, "addonKey", v)}
                      >
                        <SelectTrigger className="flex-1 min-w-0 min-h-[44px]">
                          <SelectValue placeholder="Pilih addon..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ADDON_OPTIONS.filter(a => a.key === override.addonKey).map(a => (
                            <SelectItem key={a.key} value={a.key}>{a.label}</SelectItem>
                          ))}
                          {availableAddons
                            .filter(a => a.key !== override.addonKey)
                            .map(a => (
                              <SelectItem key={a.key} value={a.key}>{a.label}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {/* Rate input */}
                      <div className="relative w-32">
                        <Input
                          type="number"
                          step="0.0001"
                          min="0"
                          value={rateInputs[index] !== undefined ? rateInputs[index] : (override.rate || "")}
                          onChange={(e) => updateAddonOverride(index, "rate", e.target.value)}
                          placeholder="0.005"
                          className="min-h-[44px] pr-7 text-sm"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                      </div>

                      {/* Rate preview */}
                      <span className="text-xs text-slate-400 w-16 text-right shrink-0">
                        {override.rate > 0 ? `${(override.rate * 100).toFixed(2)}%` : "-"}
                      </span>

                      {/* Delete button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAddonOverride(index)}
                        className="text-red-400 hover:text-red-600 min-h-[44px] min-w-[44px] p-0 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PartnerForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  generateSlug,
}: {
  form: { name: string; slug: string; logoUrl: string; status: string; benefits: string; facilities: string; modifier: string; addonModifier: string; adminFee: string; description: string; sortOrder: string };
  setForm: (fn: (prev: { name: string; slug: string; logoUrl: string; status: string; benefits: string; facilities: string; modifier: string; addonModifier: string; adminFee: string; description: string; sortOrder: string }) => { name: string; slug: string; logoUrl: string; status: string; benefits: string; facilities: string; modifier: string; addonModifier: string; adminFee: string; description: string; sortOrder: string }) => void;
  onSubmit: () => void;
  onCancel: () => void;
  generateSlug: (name: string) => string;
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nama Partner *</Label>
          <Input
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value, slug: generateSlug(e.target.value) }));
            }}
            placeholder="Sinar Mas"
            className="min-h-[44px]"
          />
        </div>
        <div className="space-y-2">
          <Label>Slug *</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="sinar-mas"
            className="min-h-[44px]"
          />
        </div>
        <div className="space-y-2">
          <Label>Logo URL</Label>
          <Input
            value={form.logoUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
            placeholder="https://..."
            className="min-h-[44px]"
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm((prev) => ({ ...prev, status: v }))}>
            <SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Pengali Premi Dasar</Label>
          <Input
            type="number"
            step="0.01"
            value={form.modifier}
            onChange={(e) => setForm((prev) => ({ ...prev, modifier: e.target.value }))}
            placeholder="1.0"
            className="min-h-[44px]"
          />
          <p className="text-xs text-slate-400">
            1.0 = sama, 1.1 = 10% lebih mahal, 0.9 = 10% lebih murah
          </p>
        </div>
        <div className="space-y-2">
          <Label>Pengali Premi Addon</Label>
          <Input
            type="number"
            step="0.01"
            value={form.addonModifier}
            onChange={(e) => setForm((prev) => ({ ...prev, addonModifier: e.target.value }))}
            placeholder="1.0"
            className="min-h-[44px]"
          />
          <p className="text-xs text-slate-400">
            Pengali untuk semua rate addon. 1.0 = pakai rate global
          </p>
        </div>
        <div className="space-y-2">
          <Label>Biaya Admin (Rp)</Label>
          <Input
            type="number"
            value={form.adminFee}
            onChange={(e) => setForm((prev) => ({ ...prev, adminFee: e.target.value }))}
            placeholder="50000"
            className="min-h-[44px]"
          />
          <p className="text-xs text-slate-400">Biaya administrasi per polis</p>
        </div>
        <div className="space-y-2">
          <Label>Urutan Tampil</Label>
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
            placeholder="0"
            className="min-h-[44px]"
          />
          <p className="text-xs text-slate-400">Angka kecil tampil duluan</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Manfaat (satu per baris)</Label>
        <Textarea
          value={form.benefits}
          onChange={(e) => setForm((prev) => ({ ...prev, benefits: e.target.value }))}
          placeholder={"Bengkel resmi\nKlaim cepat\nRoadside assistance"}
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>Fasilitas (satu per baris)</Label>
        <Textarea
          value={form.facilities}
          onChange={(e) => setForm((prev) => ({ ...prev, facilities: e.target.value }))}
          placeholder={"24/7 call center\nMobile app\nJaringan bengkel luas"}
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>Deskripsi</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Deskripsi singkat tentang partner..."
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} className="min-h-[44px]">Batal</Button>
        <Button
          className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px] px-6"
          onClick={onSubmit}
          disabled={!form.name || !form.slug}
        >
          Simpan
        </Button>
      </div>
    </div>
  );
}
