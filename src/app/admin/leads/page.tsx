"use client";

import { useEffect, useRef, useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Filter, ChevronRight, UserPlus } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Lead {
  id: string;
  customerName: string;
  whatsappNumber: string;
  vehicleBrand: string | null;
  vehicleType: string | null;
  vehicleYear: string | null;
  coverageType: string | null;
  status: string;
  assignedSalesId: string | null;
  source: string | null;
  createdAt: string;
  assignedSales: { id: string; name: string; email: string } | null;
  followups: { createdAt: string; result: string | null }[];
}

interface SalesUser {
  id: string;
  name: string;
  email: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  baru: { label: "Baru", color: "bg-blue-100 text-blue-700" },
  dihubungi: { label: "Dihubungi", color: "bg-yellow-100 text-yellow-700" },
  ragu_ragu: { label: "Ragu-ragu", color: "bg-orange-100 text-orange-700" },
  negosiasi: { label: "Negosiasi", color: "bg-purple-100 text-purple-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  lost: { label: "Lost", color: "bg-red-100 text-red-700" },
  expired: { label: "Expired", color: "bg-slate-100 text-slate-700" },
};

export default function AdminLeadsPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "admin";
  const [leads, setLeads] = useState<Lead[]>([]);
  const [salesUsers, setSalesUsers] = useState<SalesUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [salesFilter, setSalesFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // In-flight guard for all admin actions — prevents duplicate submissions
  const actionInFlightRef = useRef(false);

  // Add lead form state
  const [form, setForm] = useState({
    customerName: "",
    whatsappNumber: "",
    vehicleBrand: "",
    vehicleType: "",
    vehicleYear: "",
    plateRegion: "",
    vehiclePriceOtr: "",
    coverageType: "AllRisk",
    addOns: "",
    customerBudget: "",
    estimatedPremium: "",
    originalPremium: "",
    discountAmount: "",
    adminFee: "",
    selectedPartner: "",
    assignedSalesId: "",
    notes: "",
    source: "manual",
  });

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, salesFilter, search, page]);

  const fetchSales = async () => {
    try {
      const res = await fetch("/api/admin/sales");
      if (res.ok) {
        const data = await res.json();
        setSalesUsers(data.sales);
      }
    } catch (error) {
      console.error("Fetch sales error:", error);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (salesFilter !== "all") params.set("salesId", salesFilter);
      if (search) params.set("search", search);
      params.set("page", page.toString());
      params.set("limit", "20");

      const res = await fetch(`/api/admin/leads?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Fetch leads error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    if (actionInFlightRef.current) return;
    actionInFlightRef.current = true;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error("Status change error:", error);
    } finally {
      actionInFlightRef.current = false;
    }
  };

  const handleAssignSales = async (leadId: string, salesId: string) => {
    if (actionInFlightRef.current) return;
    actionInFlightRef.current = true;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedSalesId: salesId || null }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error("Assign sales error:", error);
    } finally {
      actionInFlightRef.current = false;
    }
  };

  const handleClaimLead = async (leadId: string) => {
    if (actionInFlightRef.current) return;
    actionInFlightRef.current = true;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimLead: true }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error("Claim lead error:", error);
    } finally {
      actionInFlightRef.current = false;
    }
  };

  const handleAddLead = async () => {
    if (actionInFlightRef.current) return;
    actionInFlightRef.current = true;
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          vehiclePriceOtr: form.vehiclePriceOtr ? parseInt(form.vehiclePriceOtr) : null,
          customerBudget: form.customerBudget ? parseInt(form.customerBudget) : null,
          estimatedPremium: form.estimatedPremium ? parseInt(form.estimatedPremium) : null,
          originalPremium: form.originalPremium ? parseInt(form.originalPremium) : null,
          discountAmount: form.discountAmount ? parseInt(form.discountAmount) : null,
          adminFee: form.adminFee ? parseInt(form.adminFee) : null,
          assignedSalesId: form.assignedSalesId || null,
        }),
      });
      if (res.ok) {
        setShowAddDialog(false);
        setForm({
          customerName: "",
          whatsappNumber: "",
          vehicleBrand: "",
          vehicleType: "",
          vehicleYear: "",
          plateRegion: "",
          vehiclePriceOtr: "",
          coverageType: "AllRisk",
          addOns: "",
          customerBudget: "",
          estimatedPremium: "",
          originalPremium: "",
          discountAmount: "",
          adminFee: "",
          selectedPartner: "",
          assignedSalesId: "",
          notes: "",
          source: "manual",
        });
        fetchLeads();
      }
    } catch (error) {
      console.error("Add lead error:", error);
    } finally {
      actionInFlightRef.current = false;
    }
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
          <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
          <p className="text-slate-500 text-sm">Kelola leads asuransi</p>
        </div>
        {userRole === "admin" && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-sky-500 hover:bg-sky-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Lead Baru</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nama Customer *</Label>
                <Input
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label>No. WhatsApp *</Label>
                <Input
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label>Merk Kendaraan</Label>
                <Input
                  value={form.vehicleBrand}
                  onChange={(e) => setForm({ ...form, vehicleBrand: e.target.value })}
                  placeholder="TOYOTA"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipe Kendaraan</Label>
                <Input
                  value={form.vehicleType}
                  onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                  placeholder="AVANZA 1.5 G CVT"
                />
              </div>
              <div className="space-y-2">
                <Label>Tahun</Label>
                <Input
                  value={form.vehicleYear}
                  onChange={(e) => setForm({ ...form, vehicleYear: e.target.value })}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Plat Daerah</Label>
                <Input
                  value={form.plateRegion}
                  onChange={(e) => setForm({ ...form, plateRegion: e.target.value })}
                  placeholder="B"
                />
              </div>
              <div className="space-y-2">
                <Label>Harga OTR</Label>
                <Input
                  type="number"
                  value={form.vehiclePriceOtr}
                  onChange={(e) => setForm({ ...form, vehiclePriceOtr: e.target.value })}
                  placeholder="285000000"
                />
              </div>
              <div className="space-y-2">
                <Label>Jenis Coverage</Label>
                <Select value={form.coverageType} onValueChange={(v) => setForm({ ...form, coverageType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AllRisk">All Risk</SelectItem>
                    <SelectItem value="TLO">TLO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Budget Customer</Label>
                <Input
                  type="number"
                  value={form.customerBudget}
                  onChange={(e) => setForm({ ...form, customerBudget: e.target.value })}
                  placeholder="10000000"
                />
              </div>
              <div className="space-y-2">
                <Label>Estimasi Premi</Label>
                <Input
                  type="number"
                  value={form.estimatedPremium}
                  onChange={(e) => setForm({ ...form, estimatedPremium: e.target.value })}
                  placeholder="11500000"
                />
              </div>
              <div className="space-y-2">
                <Label>Premi Sebelum Diskon</Label>
                <Input
                  type="number"
                  value={form.originalPremium}
                  onChange={(e) => setForm({ ...form, originalPremium: e.target.value })}
                  placeholder="13000000"
                />
              </div>
              <div className="space-y-2">
                <Label>Diskon</Label>
                <Input
                  type="number"
                  value={form.discountAmount}
                  onChange={(e) => setForm({ ...form, discountAmount: e.target.value })}
                  placeholder="1500000"
                />
              </div>
              <div className="space-y-2">
                <Label>Biaya Admin</Label>
                <Input
                  type="number"
                  value={form.adminFee}
                  onChange={(e) => setForm({ ...form, adminFee: e.target.value })}
                  placeholder="250000"
                />
              </div>
              <div className="space-y-2">
                <Label>Assign ke Sales</Label>
                <Select value={form.assignedSalesId} onValueChange={(v) => setForm({ ...form, assignedSalesId: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih sales" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa Sales</SelectItem>
                    {salesUsers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sumber</Label>
                <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-full space-y-2">
                <Label>Catatan</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Catatan tambahan..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Batal
              </Button>
              <Button
                className="bg-sky-500 hover:bg-sky-600 text-white"
                onClick={handleAddLead}
                disabled={!form.customerName || !form.whatsappNumber}
              >
                Simpan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nama, WA, kendaraan..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-44">
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
            {userRole === "admin" && (
            <Select value={salesFilter} onValueChange={(v) => { setSalesFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Sales" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Sales</SelectItem>
                {salesUsers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Leads Table — Desktop only */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Daftar Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>WA</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                        Belum ada leads
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => {
                      const config = statusConfig[lead.status] || {
                        label: lead.status,
                        color: "bg-slate-100 text-slate-700",
                      };
                      return (
                        <TableRow key={lead.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700">
                            {lead.customerName}
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {lead.whatsappNumber}
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {lead.vehicleBrand || "-"} {lead.vehicleType || ""}
                          </TableCell>
                          <TableCell className="text-sm">
                            {lead.coverageType || "-"}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={lead.status}
                              onValueChange={(v) => handleStatusChange(lead.id, v)}
                            >
                              <SelectTrigger className="h-7 w-32 text-xs">
                                <Badge className={config.color} variant="secondary">
                                  {config.label}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusConfig).map(([key, val]) => (
                                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {userRole === "sales" && !lead.assignedSalesId ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs text-sky-600 border-sky-200 hover:bg-sky-50"
                                onClick={() => handleClaimLead(lead.id)}
                              >
                                <UserPlus className="h-3 w-3 mr-1" />
                                Ambil
                              </Button>
                            ) : userRole === "admin" ? (
                              <Select
                                value={lead.assignedSalesId || "none"}
                                onValueChange={(v) => handleAssignSales(lead.id, v === "none" ? "" : v)}
                              >
                                <SelectTrigger className="h-7 w-28 text-xs">
                                  <span className="truncate">
                                    {lead.assignedSales?.name || "Assign"}
                                  </span>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Tanpa Sales</SelectItem>
                                  {salesUsers.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-xs text-slate-500">{lead.assignedSales?.name || "-"}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-slate-400 text-xs">
                            {formatDate(lead.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/admin/leads/${lead.id}`}>
                              <Button variant="ghost" size="sm" className="text-sky-500 hover:text-sky-600">
                                Detail
                              </Button>
                            </Link>
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
              <div className="text-center py-8 text-slate-400">
                Memuat data...
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                Belum ada leads
              </div>
            ) : (
              leads.map((lead) => {
                const config = statusConfig[lead.status] || {
                  label: lead.status,
                  color: "bg-slate-100 text-slate-700",
                };
                return (
                  <div
                    key={lead.id}
                    className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
                  >
                    {/* Customer name + status badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {lead.customerName}
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {lead.whatsappNumber}
                        </p>
                      </div>
                      <Badge className={`${config.color} shrink-0`} variant="secondary">
                        {config.label}
                      </Badge>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Vehicle & coverage */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                      <div>
                        <span className="text-slate-400 text-xs">Kendaraan</span>
                        <p className="text-slate-700 truncate">
                          {lead.vehicleBrand || "-"} {lead.vehicleType || ""}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">Coverage</span>
                        <p className="text-slate-700">{lead.coverageType || "-"}</p>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Sales & date row */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                      <div>
                        <span className="text-slate-400 text-xs">Sales</span>
                        <p className="text-slate-700 truncate">
                          {lead.assignedSales?.name || "Belum diassign"}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">Tanggal</span>
                        <p className="text-slate-700">{formatDate(lead.createdAt)}</p>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Action row: claim/status select + detail link */}
                    <div className="flex items-center justify-between gap-3 pt-0.5">
                      {userRole === "sales" && !lead.assignedSalesId ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs text-sky-600 border-sky-200 hover:bg-sky-50"
                          onClick={() => handleClaimLead(lead.id)}
                        >
                          <UserPlus className="h-3.5 w-3.5 mr-1" />
                          Ambil Lead
                        </Button>
                      ) : (
                        <Select
                          value={lead.status}
                          onValueChange={(v) => handleStatusChange(lead.id, v)}
                        >
                          <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
                            <Badge className={config.color} variant="secondary">
                              {config.label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusConfig).map(([key, val]) => (
                              <SelectItem key={key} value={key}>{val.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="inline-flex items-center text-sm font-medium text-sky-500 hover:text-sky-600 shrink-0"
                      >
                        Detail
                        <ChevronRight className="h-4 w-4 ml-0.5" />
                      </Link>
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
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
