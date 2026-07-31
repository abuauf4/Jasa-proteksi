"use client";

// TODO: This page uses /api/loading-rates which is NOT admin-protected.
// Should be migrated to /api/admin/rates/loading with requireAdmin() middleware.

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
  Percent,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import RateInput from "@/components/admin/RateInput";

interface LoadingRate {
  id: string;
  minAge: number;
  maxAge: number;
  loadingPercent: number;
  coverageType: string;
  description: string | null;
  isActive: boolean;
}

const COVERAGE_TYPES = ["Comprehensive", "TLO"];

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function formatDecimal(value: number): string {
  return value.toFixed(6);
}

export default function LoadingRatePage() {
  const [rates, setRates] = useState<LoadingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLoadingPercent, setEditLoadingPercent] = useState<number | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<LoadingRate | null>(null);
  const [addForm, setAddForm] = useState({
    minAge: "",
    maxAge: "",
    loadingPercent: null as number | null,
    coverageType: "Comprehensive",
    description: "",
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/loading-rates");
      if (res.ok) {
        const data = await res.json();
        setRates(data.rates);
      }
    } catch {
      toast.error("Gagal memuat data rate loading");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/loading-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minAge: parseInt(addForm.minAge),
          maxAge: parseInt(addForm.maxAge),
          loadingPercent: addForm.loadingPercent,
          coverageType: addForm.coverageType,
          description: addForm.description || null,
        }),
      });
      if (res.ok) {
        setShowAddDialog(false);
        resetAddForm();
        fetchRates();
        toast.success("Rate loading berhasil ditambahkan");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menambah rate loading");
      }
    } catch {
      toast.error("Gagal menambah rate loading");
    }
  };

  const handleInlineEdit = async (rateId: string) => {
    if (editLoadingPercent === null) return;
    try {
      const res = await fetch("/api/loading-rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rateId,
          loadingPercent: editLoadingPercent,
        }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditLoadingPercent(null);
        fetchRates();
        toast.success("Rate loading berhasil diperbarui");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal memperbarui rate loading");
      }
    } catch {
      toast.error("Gagal memperbarui rate loading");
    }
  };

  const handleToggleActive = async (rate: LoadingRate) => {
    try {
      const res = await fetch("/api/loading-rates", {
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

  const handleSoftDelete = async (rate: LoadingRate) => {
    try {
      const res = await fetch(`/api/loading-rates?id=${rate.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteTarget(null);
        fetchRates();
        toast.success("Rate loading berhasil dinonaktifkan");
      }
    } catch {
      toast.error("Gagal menghapus rate loading");
    }
  };

  const startEdit = (rate: LoadingRate) => {
    setEditingId(rate.id);
    setEditLoadingPercent(rate.loadingPercent);
  };

  const resetAddForm = () => {
    setAddForm({
      minAge: "",
      maxAge: "",
      loadingPercent: null,
      coverageType: "Comprehensive",
      description: "",
    });
  };

  // Group rates by coverageType
  const groupedRates = rates.reduce<Record<string, LoadingRate[]>>(
    (acc, rate) => {
      if (!acc[rate.coverageType]) acc[rate.coverageType] = [];
      acc[rate.coverageType].push(rate);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Rate Loading
          </h1>
          <p className="text-slate-500 text-sm">
            Rate loading berdasarkan usia kendaraan untuk penyesuaian premi
          </p>
        </div>
        <Button
          className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px]"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Rate Loading
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Percent className="h-5 w-5 text-sky-500" />
              Daftar Rate Loading
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pertanggungan</TableHead>
                    <TableHead>Usia Min</TableHead>
                    <TableHead>Usia Max</TableHead>
                    <TableHead>Loading Rate</TableHead>
                    <TableHead>Desimal</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-slate-400"
                      >
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : rates.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-slate-400"
                      >
                        Belum ada data rate loading
                      </TableCell>
                    </TableRow>
                  ) : (
                    Object.entries(groupedRates).map(
                      ([coverageType, coverageRates]) =>
                        coverageRates.map((rate, idx) => (
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
                                rowSpan={coverageRates.length}
                                className="font-medium text-slate-700 align-top"
                              >
                                <div className="flex items-center gap-2">
                                  <Percent className="h-4 w-4 text-sky-400 shrink-0" />
                                  <Badge
                                    variant="secondary"
                                    className={
                                      coverageType === "Comprehensive"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-amber-100 text-amber-700"
                                    }
                                  >
                                    {coverageType}
                                  </Badge>
                                </div>
                                <span className="text-xs text-slate-400 ml-6">
                                  {coverageRates.length} range usia
                                </span>
                              </TableCell>
                            )}
                            <TableCell className="text-sm">
                              {rate.minAge} tahun
                            </TableCell>
                            <TableCell className="text-sm">
                              {rate.maxAge} tahun
                            </TableCell>
                            <TableCell>
                              {editingId === rate.id ? (
                                <div className="flex items-center gap-1">
                                  <RateInput
                                    value={editLoadingPercent}
                                    onChange={(val) =>
                                      setEditLoadingPercent(val ?? 0)
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
                                      setEditLoadingPercent(null);
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
                                  {formatPercent(rate.loadingPercent)}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-slate-400 font-mono">
                              {formatDecimal(rate.loadingPercent)}
                            </TableCell>
                            <TableCell className="text-sm text-slate-500 max-w-[200px] truncate">
                              {rate.description || "-"}
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

      {/* Mobile Card Layout — grouped by coverageType */}
      <div className="lg:hidden space-y-4">
        <div className="flex items-center gap-2 px-1 pb-2">
          <Percent className="h-5 w-5 text-sky-500" />
          <h2 className="text-base font-semibold text-slate-800">
            Daftar Rate Loading
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400">Memuat data...</div>
        ) : rates.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            Belum ada data rate loading
          </div>
        ) : (
          Object.entries(groupedRates).map(
            ([coverageType, coverageRates]) => (
              <div
                key={coverageType}
                className="rounded-lg border border-slate-200 bg-white overflow-hidden"
              >
                {/* CoverageType header */}
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-sky-400" />
                    <Badge
                      variant="secondary"
                      className={
                        coverageType === "Comprehensive"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {coverageType}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-sky-50 text-sky-700 text-xs ml-auto"
                    >
                      {coverageRates.filter((r) => r.isActive).length}/
                      {coverageRates.length} aktif
                    </Badge>
                  </div>
                </div>

                {/* Rate items */}
                <div className="divide-y divide-slate-100">
                  {coverageRates.map((rate) => (
                    <div
                      key={rate.id}
                      className={`px-4 py-3 flex items-center justify-between gap-2 ${
                        !rate.isActive ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-slate-500">
                            Usia {rate.minAge}–{rate.maxAge} tahun
                          </span>
                        </div>
                        {editingId === rate.id ? (
                          <div className="flex items-center gap-1 mt-1">
                            <RateInput
                              value={editLoadingPercent}
                              onChange={(val) =>
                                setEditLoadingPercent(val ?? 0)
                              }
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
                                setEditLoadingPercent(null);
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
                              {formatPercent(rate.loadingPercent)}
                            </span>
                            <span className="text-xs text-slate-400">
                              ({formatDecimal(rate.loadingPercent)})
                            </span>
                          </div>
                        )}
                        {rate.description && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {rate.description}
                          </p>
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
            <AlertDialogTitle>Hapus Rate Loading?</AlertDialogTitle>
            <AlertDialogDescription>
              Rate loading untuk usia{" "}
              {deleteTarget
                ? `${deleteTarget.minAge}–${deleteTarget.maxAge} tahun`
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
            <DialogTitle>Tambah Rate Loading Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Jenis Pertanggungan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={addForm.coverageType}
                onValueChange={(v) =>
                  setAddForm((prev) => ({ ...prev, coverageType: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COVERAGE_TYPES.map((ct) => (
                    <SelectItem key={ct} value={ct}>
                      {ct}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Usia Minimum (tahun) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={addForm.minAge}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, minAge: e.target.value }))
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Usia Maksimum (tahun) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={addForm.maxAge}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, maxAge: e.target.value }))
                  }
                  placeholder="5"
                />
              </div>
            </div>
            <RateInput
              label="Loading Rate"
              value={addForm.loadingPercent}
              onChange={(val) =>
                setAddForm((prev) => ({ ...prev, loadingPercent: val }))
              }
              step={0.01}
              min={0}
              max={100}
              placeholder="5.00"
              required
            />
            <p className="text-xs text-slate-400">
              Masukkan dalam persen (contoh: 5 untuk 5%)
            </p>
            <div className="space-y-2">
              <Label>Keterangan — opsional</Label>
              <Input
                type="text"
                value={addForm.description}
                onChange={(e) =>
                  setAddForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Keterangan tambahan"
              />
            </div>
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
                !addForm.minAge ||
                !addForm.maxAge ||
                addForm.loadingPercent === null ||
                addForm.loadingPercent === undefined
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
