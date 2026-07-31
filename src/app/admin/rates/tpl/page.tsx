"use client";

// TODO: This page uses /api/tpl-rates which is NOT admin-protected.
// Should be migrated to /api/admin/rates/tpl with requireAdmin() middleware.

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
import {
  Plus,
  Pencil,
  Check,
  X,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import RateInput from "@/components/admin/RateInput";

interface TplRate {
  id: string;
  vehicleCategory: string;
  coverageMin: number;
  coverageMax: number;
  rate: number;
  isActive: boolean;
}

const VEHICLE_CATEGORIES = [
  "Passenger & Motorcycle",
  "Bus / Truck",
];

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function formatDecimal(value: number): string {
  return value.toFixed(6);
}

function formatCurrency(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function categoryLabel(cat: string): string {
  if (cat === "Passenger & Motorcycle") return "Penumpang & Sepeda Motor";
  if (cat === "Bus / Truck") return "Bus / Truk";
  return cat;
}

export default function TplRatePage() {
  const [rates, setRates] = useState<TplRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TplRate | null>(null);
  const [addForm, setAddForm] = useState({
    vehicleCategory: "Passenger & Motorcycle",
    coverageMin: "",
    coverageMax: "",
    rate: null as number | null,
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/tpl-rates");
      if (res.ok) {
        const data = await res.json();
        // Convert BigInt fields to numbers for client use
        const normalized = (data.rates as any[]).map((r: any) => ({
          ...r,
          coverageMin:
            typeof r.coverageMin === "bigint"
              ? Number(r.coverageMin)
              : Number(r.coverageMin),
          coverageMax:
            typeof r.coverageMax === "bigint"
              ? Number(r.coverageMax)
              : Number(r.coverageMax),
        }));
        setRates(normalized);
      }
    } catch {
      toast.error("Gagal memuat data rate TPL");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/tpl-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleCategory: addForm.vehicleCategory,
          coverageMin: addForm.coverageMin,
          coverageMax: addForm.coverageMax,
          rate: addForm.rate,
        }),
      });
      if (res.ok) {
        setShowAddDialog(false);
        resetAddForm();
        fetchRates();
        toast.success("Rate TPL berhasil ditambahkan");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menambah rate TPL");
      }
    } catch {
      toast.error("Gagal menambah rate TPL");
    }
  };

  const handleInlineEdit = async (rateId: string) => {
    if (editRate === null) return;
    try {
      const res = await fetch("/api/tpl-rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rateId, rate: editRate }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditRate(null);
        fetchRates();
        toast.success("Rate TPL berhasil diperbarui");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal memperbarui rate TPL");
      }
    } catch {
      toast.error("Gagal memperbarui rate TPL");
    }
  };

  const handleToggleActive = async (rate: TplRate) => {
    try {
      const res = await fetch("/api/tpl-rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rate.id, isActive: !rate.isActive }),
      });
      if (res.ok) {
        fetchRates();
        toast.success(rate.isActive ? "Rate dinonaktifkan" : "Rate diaktifkan");
      }
    } catch {
      toast.error("Gagal mengubah status rate");
    }
  };

  const handleSoftDelete = async (rate: TplRate) => {
    try {
      const res = await fetch(`/api/tpl-rates?id=${rate.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteTarget(null);
        fetchRates();
        toast.success("Rate TPL berhasil dinonaktifkan");
      }
    } catch {
      toast.error("Gagal menghapus rate TPL");
    }
  };

  const startEdit = (rate: TplRate) => {
    setEditingId(rate.id);
    setEditRate(rate.rate);
  };

  const resetAddForm = () => {
    setAddForm({
      vehicleCategory: "Passenger & Motorcycle",
      coverageMin: "",
      coverageMax: "",
      rate: null,
    });
  };

  // Group rates by vehicleCategory
  const groupedRates = rates.reduce<Record<string, TplRate[]>>(
    (acc, rate) => {
      if (!acc[rate.vehicleCategory]) acc[rate.vehicleCategory] = [];
      acc[rate.vehicleCategory].push(rate);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rate TPL</h1>
          <p className="text-slate-500 text-sm">
            Rate Tanggung Jawab Pihak Ketiga berdasarkan kategori kendaraan dan limit pertanggungan
          </p>
        </div>
        <Button
          className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px]"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Rate TPL
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sky-500" />
              Daftar Rate TPL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Limit Pertanggungan</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Desimal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-slate-400"
                      >
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : rates.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-slate-400"
                      >
                        Belum ada data rate TPL
                      </TableCell>
                    </TableRow>
                  ) : (
                    Object.entries(groupedRates).map(
                      ([vehicleCategory, categoryRates]) =>
                        categoryRates.map((rate, idx) => (
                          <TableRow
                            key={rate.id}
                            className={`hover:bg-slate-50 ${
                              !rate.isActive ? "opacity-50" : ""
                            } ${
                              idx === 0 ? "border-t-2 border-t-slate-300" : ""
                            }`}
                          >
                            {idx === 0 && (
                              <TableCell
                                rowSpan={categoryRates.length}
                                className="font-medium text-slate-700 align-top"
                              >
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0" />
                                  {categoryLabel(vehicleCategory)}
                                </div>
                                <span className="text-xs text-slate-400 ml-6">
                                  {categoryRates.length} range limit
                                </span>
                              </TableCell>
                            )}
                            <TableCell className="text-sm">
                              <span className="font-mono">
                                {formatCurrency(rate.coverageMin)}
                              </span>
                              <span className="text-slate-400"> – </span>
                              <span className="font-mono">
                                {formatCurrency(rate.coverageMax)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {editingId === rate.id ? (
                                <div className="flex items-center gap-1">
                                  <RateInput
                                    value={editRate}
                                    onChange={(val) =>
                                      setEditRate(val ?? 0)
                                    }
                                    step={0.01}
                                    min={0}
                                    max={100}
                                    className="h-8 w-28 text-sm"
                                    showDecimalHelper={false}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleInlineEdit(rate.id)
                                    }
                                    className="text-green-500 h-8 w-8 p-0"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingId(null);
                                      setEditRate(null);
                                    }}
                                    className="text-red-500 h-8 w-8 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <span
                                  className="font-mono text-sm cursor-pointer hover:text-sky-500"
                                  onClick={() => startEdit(rate)}
                                  title="Klik untuk edit"
                                >
                                  {formatPercent(rate.rate)}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-slate-400 font-mono">
                              {formatDecimal(rate.rate)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={
                                  rate.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }
                              >
                                {rate.isActive ? "Aktif" : "Nonaktif"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {editingId !== rate.id && (
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEdit(rate)}
                                    className="text-sky-500 h-8 w-8 p-0"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleActive(rate)}
                                    className="h-8 w-8 p-0"
                                  >
                                    {rate.isActive ? (
                                      <ToggleRight className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <ToggleLeft className="h-4 w-4 text-slate-400" />
                                    )}
                                  </Button>
                                  {rate.isActive && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setDeleteTarget(rate)}
                                      className="text-red-400 hover:text-red-600 h-8 w-8 p-0"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card Layout — grouped by vehicleCategory */}
      <div className="lg:hidden space-y-4">
        <div className="flex items-center gap-2 px-1 pb-2">
          <ShieldCheck className="h-5 w-5 text-sky-500" />
          <h2 className="text-base font-semibold text-slate-800">
            Daftar Rate TPL
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400">Memuat data...</div>
        ) : rates.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            Belum ada data rate TPL
          </div>
        ) : (
          Object.entries(groupedRates).map(
            ([vehicleCategory, categoryRates]) => (
              <div
                key={vehicleCategory}
                className="rounded-lg border border-slate-200 bg-white overflow-hidden"
              >
                {/* VehicleCategory header */}
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-sky-400" />
                    <span className="font-semibold text-slate-700">
                      {categoryLabel(vehicleCategory)}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-sky-50 text-sky-700 text-xs ml-auto"
                    >
                      {categoryRates.filter((r) => r.isActive).length}/
                      {categoryRates.length} aktif
                    </Badge>
                  </div>
                </div>

                {/* Rate items */}
                <div className="divide-y divide-slate-100">
                  {categoryRates.map((rate) => (
                    <div
                      key={rate.id}
                      className={`px-4 py-3 flex items-center justify-between gap-2 ${
                        !rate.isActive ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <span className="text-xs text-slate-500">
                            Limit: {formatCurrency(rate.coverageMin)} –{" "}
                            {formatCurrency(rate.coverageMax)}
                          </span>
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleInlineEdit(rate.id)}
                              className="text-green-500 min-h-[44px] min-w-[44px] p-0"
                            >
                              <Check className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingId(null);
                                setEditRate(null);
                              }}
                              className="text-red-500 min-h-[44px] min-w-[44px] p-0"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className="font-mono text-sm font-semibold text-slate-700 cursor-pointer"
                              onClick={() => startEdit(rate)}
                            >
                              {formatPercent(rate.rate)}
                            </span>
                            <span className="text-xs text-slate-400">
                              ({formatDecimal(rate.rate)})
                            </span>
                          </div>
                        )}
                      </div>
                      {editingId !== rate.id && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(rate)}
                            className="text-sky-500 min-h-[44px] min-w-[44px] p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(rate)}
                            className="min-h-[44px] min-w-[44px] p-0"
                          >
                            {rate.isActive ? (
                              <ToggleRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-slate-400" />
                            )}
                          </Button>
                          {rate.isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(rate)}
                              className="text-red-400 hover:text-red-600 min-h-[44px] min-w-[44px] p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Rate TPL?</AlertDialogTitle>
            <AlertDialogDescription>
              Rate TPL untuk limit{" "}
              {deleteTarget
                ? `${formatCurrency(deleteTarget.coverageMin)} – ${formatCurrency(deleteTarget.coverageMax)}`
                : ""}{" "}
              akan dinonaktifkan. Data tidak akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleSoftDelete(deleteTarget)}
              className="bg-red-500 hover:bg-red-600 text-white min-h-[44px]"
            >
              Nonaktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Rate TPL Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Kategori Kendaraan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={addForm.vehicleCategory}
                onValueChange={(v) =>
                  setAddForm((prev) => ({ ...prev, vehicleCategory: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_CATEGORIES.map((vc) => (
                    <SelectItem key={vc} value={vc}>
                      {categoryLabel(vc)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Limit Minimum (Rp) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={addForm.coverageMin}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      coverageMin: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Limit Maksimum (Rp) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={addForm.coverageMax}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      coverageMax: e.target.value,
                    }))
                  }
                  placeholder="25000000"
                />
              </div>
            </div>
            <RateInput
              label="Rate TPL"
              value={addForm.rate}
              onChange={(val) =>
                setAddForm((prev) => ({ ...prev, rate: val }))
              }
              step={0.01}
              min={0}
              max={100}
              placeholder="0.80"
              required
            />
            <p className="text-xs text-slate-400">
              Masukkan dalam persen (contoh: 0.8 untuk 0.8%)
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                resetAddForm();
              }}
              className="min-h-[44px]"
            >
              Batal
            </Button>
            <Button
              className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px]"
              onClick={handleAdd}
              disabled={
                !addForm.vehicleCategory ||
                !addForm.coverageMin ||
                !addForm.coverageMax ||
                addForm.rate === null ||
                addForm.rate === undefined
              }
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
