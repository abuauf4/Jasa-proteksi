"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Check, X, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import RateInput from "@/components/admin/RateInput";

interface AddonRate {
  id: string;
  addonKey: string;
  addonLabel: string;
  coverageType: string;
  wilayah: number;
  rate: number;
  fixedAmount: number | null;
  isActive: boolean;
}

const ADDON_DEFINITIONS = [
  { key: "flood", label: "Banjir & Angin Kencang" },
  { key: "earthquake", label: "Gempa Bumi & Tsunami" },
  { key: "srcc", label: "Kerusohan & Huru-Hara (SRCC)" },
  { key: "terrorism", label: "Terorisme & Sabotase" },
  { key: "bengkelAuthorized", label: "Bengkel Authorized" },
  { key: "tpl", label: "Tanggung Jawab Pihak Ketiga (TPL)" },
  { key: "paDriver", label: "Perlindungan Jiwa Supir" },
  { key: "paPassenger", label: "Perlindungan Jiwa Penumpang" },
];

const COVERAGE_TYPES = ["Comprehensive", "TLO", "All"];

function formatRate(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function wilayahLabel(w: number): string {
  if (w === 0) return "Semua Wilayah";
  return `Wilayah ${w}`;
}

function getAddonLabel(key: string): string {
  return ADDON_DEFINITIONS.find(a => a.key === key)?.label || key;
}

export default function AddonRatePage() {
  const [rates, setRates] = useState<AddonRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AddonRate | null>(null);
  const [addForm, setAddForm] = useState({
    addonKey: "flood",
    coverageType: "Comprehensive",
    wilayah: "0",
    rate: null as number | null,
    fixedAmount: "",
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/admin/rates/addon");
      if (res.ok) {
        const data = await res.json();
        setRates(data.rates);
      }
    } catch {
      toast.error("Gagal memuat data rate addon");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const addonDef = ADDON_DEFINITIONS.find(a => a.key === addForm.addonKey);
    try {
      const res = await fetch("/api/admin/rates/addon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...addForm,
          addonLabel: addonDef?.label || addForm.addonKey,
        }),
      });
      if (res.ok) {
        setShowAddDialog(false);
        resetAddForm();
        fetchRates();
        toast.success("Rate addon berhasil ditambahkan");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menambah rate addon");
      }
    } catch {
      toast.error("Gagal menambah rate addon");
    }
  };

  const handleInlineEdit = async (rateId: string) => {
    if (editRate === null) return;
    try {
      const res = await fetch("/api/admin/rates/addon", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rateId, rate: editRate }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditRate(null);
        fetchRates();
        toast.success("Rate addon berhasil diperbarui");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal memperbarui rate addon");
      }
    } catch {
      toast.error("Gagal memperbarui rate addon");
    }
  };

  const handleSoftDelete = async (rate: AddonRate) => {
    try {
      const res = await fetch("/api/admin/rates/addon", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rate.id, isActive: false }),
      });
      if (res.ok) {
        setDeleteTarget(null);
        fetchRates();
        toast.success("Rate addon berhasil dinonaktifkan");
      }
    } catch {
      toast.error("Gagal menghapus rate addon");
    }
  };

  const startEdit = (rate: AddonRate) => {
    setEditingId(rate.id);
    setEditRate(rate.rate);
  };

  const resetAddForm = () => {
    setAddForm({
      addonKey: "flood",
      coverageType: "Comprehensive",
      wilayah: "0",
      rate: null,
      fixedAmount: "",
    });
  };

  // Group rates by addonKey for display
  const groupedRates = rates.reduce<Record<string, AddonRate[]>>((acc, rate) => {
    if (!acc[rate.addonKey]) acc[rate.addonKey] = [];
    acc[rate.addonKey].push(rate);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rate Addon</h1>
          <p className="text-slate-500 text-sm">Rate untuk perluasan jaminan (banjir, gempa, SRCC, dll)</p>
        </div>
        <Button
          className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px]"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Rate Addon
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-sky-500" />
              Daftar Rate Addon
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Addon</TableHead>
                    <TableHead>Pertanggungan</TableHead>
                    <TableHead>Wilayah</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Jumlah Tetap</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : rates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                        Belum ada data rate addon
                      </TableCell>
                    </TableRow>
                  ) : (
                    Object.entries(groupedRates).map(([addonKey, addonRates]) => (
                      addonRates.map((rate, idx) => (
                        <TableRow
                          key={rate.id}
                          className={`hover:bg-slate-50 ${!rate.isActive ? "opacity-50" : ""} ${idx === 0 ? "border-t-2 border-t-slate-300" : ""}`}
                        >
                          {idx === 0 && (
                            <TableCell
                              rowSpan={addonRates.length}
                              className="font-medium text-slate-700 align-top"
                            >
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-sky-400 shrink-0" />
                                {getAddonLabel(addonKey)}
                              </div>
                              <span className="text-xs text-slate-400 ml-6">{addonRates.length} varian</span>
                            </TableCell>
                          )}
                          <TableCell>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                              {rate.coverageType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{wilayahLabel(rate.wilayah)}</TableCell>
                          <TableCell>
                            {editingId === rate.id ? (
                              <div className="flex items-center gap-1">
                                <RateInput
                                  value={editRate}
                                  onChange={(val) => setEditRate(val ?? 0)}
                                  step={0.01}
                                  min={0}
                                  max={100}
                                  className="h-8 w-28 text-sm"
                                  showDecimalHelper={false}
                                />
                                <Button variant="ghost" size="sm" onClick={() => handleInlineEdit(rate.id)} className="text-green-500 h-8 w-8 p-0">
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setEditRate(null); }} className="text-red-500 h-8 w-8 p-0">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <span
                                className="font-mono text-sm cursor-pointer hover:text-sky-500"
                                onClick={() => startEdit(rate)}
                                title="Klik untuk edit"
                              >
                                {formatRate(rate.rate)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {rate.fixedAmount ? `Rp ${rate.fixedAmount.toLocaleString("id-ID")}` : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={rate.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                              {rate.isActive ? "Aktif" : "Nonaktif"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {editingId !== rate.id && (
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="sm" onClick={() => startEdit(rate)} className="text-sky-500 h-8 w-8 p-0">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                {rate.isActive && (
                                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(rate)} className="text-red-400 hover:text-red-600 h-8 w-8 p-0">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card Layout — grouped by addon */}
      <div className="lg:hidden space-y-4">
        <div className="flex items-center gap-2 px-1 pb-2">
          <Shield className="h-5 w-5 text-sky-500" />
          <h2 className="text-base font-semibold text-slate-800">Daftar Rate Addon</h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400">Memuat data...</div>
        ) : rates.length === 0 ? (
          <div className="text-center py-8 text-slate-400">Belum ada data rate addon</div>
        ) : (
          Object.entries(groupedRates).map(([addonKey, addonRates]) => (
            <div key={addonKey} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              {/* Addon header */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-sky-400" />
                  <span className="font-semibold text-slate-700">{getAddonLabel(addonKey)}</span>
                  <Badge variant="secondary" className="bg-sky-50 text-sky-700 text-xs ml-auto">
                    {addonRates.filter(r => r.isActive).length}/{addonRates.length} aktif
                  </Badge>
                </div>
              </div>

              {/* Rate variants */}
              <div className="divide-y divide-slate-100">
                {addonRates.map((rate) => (
                  <div
                    key={rate.id}
                    className={`px-4 py-3 flex items-center justify-between gap-2 ${!rate.isActive ? "opacity-50" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px]">
                          {rate.coverageType}
                        </Badge>
                        <span className="text-xs text-slate-500">{wilayahLabel(rate.wilayah)}</span>
                      </div>
                      {editingId === rate.id ? (
                        <div className="flex items-center gap-1 mt-1">
                          <RateInput
                            value={editRate}
                            onChange={(val) => setEditRate(val ?? 0)}
                            step={0.01}
                            min={0}
                            max={100}
                            className="h-9 text-sm flex-1 min-w-0"
                            showDecimalHelper={false}
                          />
                          <Button variant="ghost" size="sm" onClick={() => handleInlineEdit(rate.id)} className="text-green-500 min-h-[44px] min-w-[44px] p-0">
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setEditRate(null); }} className="text-red-500 min-h-[44px] min-w-[44px] p-0">
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-sm font-semibold text-slate-700 cursor-pointer"
                            onClick={() => startEdit(rate)}
                          >
                            {formatRate(rate.rate)}
                          </span>
                          {rate.fixedAmount ? (
                            <span className="text-xs text-slate-400">+ Rp {rate.fixedAmount.toLocaleString("id-ID")}</span>
                          ) : null}
                        </div>
                      )}
                    </div>
                    {editingId !== rate.id && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(rate)} className="text-sky-500 min-h-[44px] min-w-[44px] p-0">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {rate.isActive && (
                          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(rate)} className="text-red-400 hover:text-red-600 min-h-[44px] min-w-[44px] p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Rate Addon?</AlertDialogTitle>
            <AlertDialogDescription>
              Rate addon &quot;{deleteTarget ? getAddonLabel(deleteTarget.addonKey) : ""}&quot; akan dinonaktifkan. Data tidak akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && handleSoftDelete(deleteTarget)} className="bg-red-500 hover:bg-red-600 text-white min-h-[44px]">
              Nonaktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Rate Addon Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Jenis Addon *</Label>
              <Select value={addForm.addonKey} onValueChange={(v) => setAddForm(prev => ({ ...prev, addonKey: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ADDON_DEFINITIONS.map(a => <SelectItem key={a.key} value={a.key}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis Pertanggungan *</Label>
                <Select value={addForm.coverageType} onValueChange={(v) => setAddForm(prev => ({ ...prev, coverageType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COVERAGE_TYPES.map(ct => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Wilayah *</Label>
                <Select value={addForm.wilayah} onValueChange={(v) => setAddForm(prev => ({ ...prev, wilayah: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Semua Wilayah</SelectItem>
                    <SelectItem value="1">Wilayah 1</SelectItem>
                    <SelectItem value="2">Wilayah 2</SelectItem>
                    <SelectItem value="3">Wilayah 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <RateInput
              label="Rate"
              value={addForm.rate}
              onChange={(val) => setAddForm(prev => ({ ...prev, rate: val }))}
              step={0.01}
              min={0}
              max={100}
              placeholder="0.50"
              required
            />
            <p className="text-xs text-slate-400">
              Masukkan dalam persen (contoh: 0.5 untuk 0.5%)
            </p>
            <div className="space-y-2">
              <Label>Jumlah Tetap (Rp) — opsional</Label>
              <Input
                type="number"
                value={addForm.fixedAmount}
                onChange={(e) => setAddForm(prev => ({ ...prev, fixedAmount: e.target.value }))}
                placeholder="50000"
              />
              <p className="text-xs text-slate-400">Biaya tetap jika ada (selain rate persen)</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetAddForm(); }} className="min-h-[44px]">Batal</Button>
            <Button
              className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px]"
              onClick={handleAdd}
              disabled={!addForm.addonKey || addForm.rate === null}
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
