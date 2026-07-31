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
import { Plus, Pencil, Check, X, Car, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import RateInput from "@/components/admin/RateInput";

interface MotorRate {
  id: string;
  coverageType: string;
  category: number;
  vehicleType: string;
  coverageMin: number;
  coverageMax: number;
  rateWilayah1: number;
  rateWilayah2: number;
  rateWilayah3: number;
  rateAtasWilayah1: number | null;
  rateAtasWilayah2: number | null;
  rateAtasWilayah3: number | null;
  isActive: boolean;
}

const COVERAGE_TYPES = ["Comprehensive", "TLO"];
const VEHICLE_TYPES = [
  "Non Bus dan Non Truk",
  "Truk dan Pick Up",
  "Bus",
  "Kendaraan Roda 2",
];

function formatRate(value: number | null): string {
  if (value === null || value === undefined) return "-";
  return `${(value * 100).toFixed(2)}%`;
}

function formatCurrency(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function MotorRatePage() {
  const [rates, setRates] = useState<MotorRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, number | null>>({});
  const [addForm, setAddForm] = useState({
    coverageType: "Comprehensive",
    category: "1",
    vehicleType: "Non Bus dan Non Truk",
    coverageMin: "",
    coverageMax: "",
    rateWilayah1: null as number | null,
    rateWilayah2: null as number | null,
    rateWilayah3: null as number | null,
    rateAtasWilayah1: null as number | null,
    rateAtasWilayah2: null as number | null,
    rateAtasWilayah3: null as number | null,
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/admin/rates/motor");
      if (res.ok) {
        const data = await res.json();
        setRates(data.rates);
      }
    } catch (error) {
      console.error("Fetch motor rates error:", error);
      toast.error("Gagal memuat data rate motor");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/admin/rates/motor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        setShowAddDialog(false);
        resetAddForm();
        fetchRates();
        toast.success("Rate motor berhasil ditambahkan");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menambah rate motor");
      }
    } catch {
      toast.error("Gagal menambah rate motor");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const res = await fetch("/api/admin/rates/motor", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...editForm }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditForm({});
        fetchRates();
        toast.success("Rate motor berhasil diperbarui");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal memperbarui rate motor");
      }
    } catch {
      toast.error("Gagal memperbarui rate motor");
    }
  };

  const handleToggleActive = async (rate: MotorRate) => {
    try {
      const res = await fetch("/api/admin/rates/motor", {
        method: "PATCH",
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

  const startEdit = (rate: MotorRate) => {
    setEditingId(rate.id);
    setEditForm({
      rateWilayah1: rate.rateWilayah1,
      rateWilayah2: rate.rateWilayah2,
      rateWilayah3: rate.rateWilayah3,
      rateAtasWilayah1: rate.rateAtasWilayah1,
      rateAtasWilayah2: rate.rateAtasWilayah2,
      rateAtasWilayah3: rate.rateAtasWilayah3,
    });
  };

  const resetAddForm = () => {
    setAddForm({
      coverageType: "Comprehensive",
      category: "1",
      vehicleType: "Non Bus dan Non Truk",
      coverageMin: "",
      coverageMax: "",
      rateWilayah1: null,
      rateWilayah2: null,
      rateWilayah3: null,
      rateAtasWilayah1: null,
      rateAtasWilayah2: null,
      rateAtasWilayah3: null,
    });
  };

  const categoryLabel = (cat: number) => `Kategori ${cat}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rate Dasar Motor</h1>
          <p className="text-slate-500 text-sm">Rate premi dasar untuk asuransi kendaraan bermotor</p>
        </div>
        <Button
          className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px]"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Rate
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Car className="h-5 w-5 text-sky-500" />
              Daftar Rate Motor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pertanggungan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Jenis Kendaraan</TableHead>
                    <TableHead>Range Harga</TableHead>
                    <TableHead>Rate Wil. 1</TableHead>
                    <TableHead>Rate Wil. 2</TableHead>
                    <TableHead>Rate Wil. 3</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-slate-400">
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : rates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-slate-400">
                        Belum ada data rate motor
                      </TableCell>
                    </TableRow>
                  ) : (
                    rates.map((rate) => (
                      <TableRow key={rate.id} className={`hover:bg-slate-50 ${!rate.isActive ? "opacity-50" : ""}`}>
                        <TableCell>
                          <Badge variant="secondary" className={rate.coverageType === "Comprehensive" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                            {rate.coverageType}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{categoryLabel(rate.category)}</TableCell>
                        <TableCell className="text-sm">{rate.vehicleType}</TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {formatCurrency(rate.coverageMin)} – {formatCurrency(rate.coverageMax)}
                        </TableCell>
                        {editingId === rate.id ? (
                          <>
                            <TableCell>
                              <RateInput
                                value={editForm.rateWilayah1 ?? null}
                                onChange={(val) => setEditForm(prev => ({ ...prev, rateWilayah1: val ?? 0 }))}
                                step={0.01}
                                min={0}
                                max={100}
                                className="h-8 w-24 text-sm"
                                showDecimalHelper={false}
                              />
                            </TableCell>
                            <TableCell>
                              <RateInput
                                value={editForm.rateWilayah2 ?? null}
                                onChange={(val) => setEditForm(prev => ({ ...prev, rateWilayah2: val ?? 0 }))}
                                step={0.01}
                                min={0}
                                max={100}
                                className="h-8 w-24 text-sm"
                                showDecimalHelper={false}
                              />
                            </TableCell>
                            <TableCell>
                              <RateInput
                                value={editForm.rateWilayah3 ?? null}
                                onChange={(val) => setEditForm(prev => ({ ...prev, rateWilayah3: val ?? 0 }))}
                                step={0.01}
                                min={0}
                                max={100}
                                className="h-8 w-24 text-sm"
                                showDecimalHelper={false}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="font-mono text-sm">{formatRate(rate.rateWilayah1)}</TableCell>
                            <TableCell className="font-mono text-sm">{formatRate(rate.rateWilayah2)}</TableCell>
                            <TableCell className="font-mono text-sm">{formatRate(rate.rateWilayah3)}</TableCell>
                          </>
                        )}
                        <TableCell>
                          <Badge variant="secondary" className={rate.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                            {rate.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {editingId === rate.id ? (
                              <>
                                <Button variant="ghost" size="sm" onClick={handleUpdate} className="text-green-500 h-8 w-8 p-0">
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setEditForm({}); }} className="text-red-500 h-8 w-8 p-0">
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => startEdit(rate)} className="text-sky-500 h-8 w-8 p-0">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleToggleActive(rate)} className="h-8 w-8 p-0">
                                  {rate.isActive ? (
                                    <ToggleRight className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <ToggleLeft className="h-4 w-4 text-slate-400" />
                                  )}
                                </Button>
                              </>
                            )}
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

      {/* Mobile/Tablet Card Layout */}
      <div className="lg:hidden space-y-3">
        <div className="flex items-center gap-2 px-1 pb-2">
          <Car className="h-5 w-5 text-sky-500" />
          <h2 className="text-base font-semibold text-slate-800">Daftar Rate Motor</h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400">Memuat data...</div>
        ) : rates.length === 0 ? (
          <div className="text-center py-8 text-slate-400">Belum ada data rate motor</div>
        ) : (
          rates.map((rate) => (
            <div
              key={rate.id}
              className={`rounded-lg border border-slate-200 bg-white p-4 space-y-3 ${!rate.isActive ? "opacity-50" : ""}`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={rate.coverageType === "Comprehensive" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                    {rate.coverageType}
                  </Badge>
                  <Badge variant="secondary" className={rate.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                    {rate.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {editingId === rate.id ? (
                    <>
                      <Button variant="ghost" size="sm" onClick={handleUpdate} className="text-green-500 min-h-[44px] min-w-[44px] p-0">
                        <Check className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setEditForm({}); }} className="text-red-500 min-h-[44px] min-w-[44px] p-0">
                        <X className="h-5 w-5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => startEdit(rate)} className="text-sky-500 min-h-[44px] min-w-[44px] p-0">
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleToggleActive(rate)} className="min-h-[44px] min-w-[44px] p-0">
                        {rate.isActive ? (
                          <ToggleRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-slate-400" />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Info */}
              <div>
                <p className="font-semibold text-slate-800">
                  {categoryLabel(rate.category)} — {rate.vehicleType}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatCurrency(rate.coverageMin)} – {formatCurrency(rate.coverageMax)}
                </p>
              </div>

              {/* Rates */}
              {editingId === rate.id ? (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs text-slate-500">Wilayah 1 (%)</Label>
                    <RateInput
                      value={editForm.rateWilayah1 ?? null}
                      onChange={(val) => setEditForm(prev => ({ ...prev, rateWilayah1: val ?? 0 }))}
                      step={0.01}
                      min={0}
                      max={100}
                      className="h-10 text-sm"
                      showDecimalHelper={false}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Wilayah 2 (%)</Label>
                    <RateInput
                      value={editForm.rateWilayah2 ?? null}
                      onChange={(val) => setEditForm(prev => ({ ...prev, rateWilayah2: val ?? 0 }))}
                      step={0.01}
                      min={0}
                      max={100}
                      className="h-10 text-sm"
                      showDecimalHelper={false}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Wilayah 3 (%)</Label>
                    <RateInput
                      value={editForm.rateWilayah3 ?? null}
                      onChange={(val) => setEditForm(prev => ({ ...prev, rateWilayah3: val ?? 0 }))}
                      step={0.01}
                      min={0}
                      max={100}
                      className="h-10 text-sm"
                      showDecimalHelper={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 rounded-md p-2 text-center">
                    <p className="text-xs text-slate-400">Wilayah 1</p>
                    <p className="font-mono text-sm font-semibold text-slate-700">{formatRate(rate.rateWilayah1)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-md p-2 text-center">
                    <p className="text-xs text-slate-400">Wilayah 2</p>
                    <p className="font-mono text-sm font-semibold text-slate-700">{formatRate(rate.rateWilayah2)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-md p-2 text-center">
                    <p className="text-xs text-slate-400">Wilayah 3</p>
                    <p className="font-mono text-sm font-semibold text-slate-700">{formatRate(rate.rateWilayah3)}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Rate Motor Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                <Label>Kategori (1–8) *</Label>
                <Input type="number" min="1" max="8" value={addForm.category} onChange={(e) => setAddForm(prev => ({ ...prev, category: e.target.value }))} placeholder="1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Jenis Kendaraan *</Label>
              <Select value={addForm.vehicleType} onValueChange={(v) => setAddForm(prev => ({ ...prev, vehicleType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map(vt => <SelectItem key={vt} value={vt}>{vt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min. Pertanggungan (Rp) *</Label>
                <Input type="number" value={addForm.coverageMin} onChange={(e) => setAddForm(prev => ({ ...prev, coverageMin: e.target.value }))} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Max. Pertanggungan (Rp) *</Label>
                <Input type="number" value={addForm.coverageMax} onChange={(e) => setAddForm(prev => ({ ...prev, coverageMax: e.target.value }))} placeholder="100000000" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <RateInput
                label="Rate Wilayah 1"
                value={addForm.rateWilayah1}
                onChange={(val) => setAddForm(prev => ({ ...prev, rateWilayah1: val }))}
                step={0.01}
                min={0}
                max={100}
                placeholder="3.82"
                required
              />
              <RateInput
                label="Rate Wilayah 2"
                value={addForm.rateWilayah2}
                onChange={(val) => setAddForm(prev => ({ ...prev, rateWilayah2: val }))}
                step={0.01}
                min={0}
                max={100}
                placeholder="3.82"
                required
              />
              <RateInput
                label="Rate Wilayah 3"
                value={addForm.rateWilayah3}
                onChange={(val) => setAddForm(prev => ({ ...prev, rateWilayah3: val }))}
                step={0.01}
                min={0}
                max={100}
                placeholder="3.82"
                required
              />
            </div>
            <p className="text-xs text-slate-400">
              Masukkan dalam persen (contoh: 3.82 untuk 3.82%)
            </p>
            <div className="grid grid-cols-3 gap-3">
              <RateInput
                label="Rate Atas W1"
                value={addForm.rateAtasWilayah1}
                onChange={(val) => setAddForm(prev => ({ ...prev, rateAtasWilayah1: val }))}
                step={0.01}
                min={0}
                max={100}
                placeholder="Opsional"
              />
              <RateInput
                label="Rate Atas W2"
                value={addForm.rateAtasWilayah2}
                onChange={(val) => setAddForm(prev => ({ ...prev, rateAtasWilayah2: val }))}
                step={0.01}
                min={0}
                max={100}
                placeholder="Opsional"
              />
              <RateInput
                label="Rate Atas W3"
                value={addForm.rateAtasWilayah3}
                onChange={(val) => setAddForm(prev => ({ ...prev, rateAtasWilayah3: val }))}
                step={0.01}
                min={0}
                max={100}
                placeholder="Opsional"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowAddDialog(false); resetAddForm(); }} className="min-h-[44px]">Batal</Button>
            <Button
              className="bg-sky-500 hover:bg-sky-600 text-white min-h-[44px]"
              onClick={handleAdd}
              disabled={!addForm.coverageType || !addForm.category || !addForm.vehicleType || addForm.rateWilayah1 === null || addForm.rateWilayah2 === null || addForm.rateWilayah3 === null}
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
