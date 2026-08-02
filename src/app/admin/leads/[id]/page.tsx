"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Phone, Plus, Calendar, MessageSquare, User } from "lucide-react";
import Link from "next/link";

interface Followup {
  id: string;
  notes: string;
  result: string | null;
  followupDate: string;
  nextFollowupDate: string | null;
  createdAt: string;
  sales: { id: string; name: string } | null;
}

interface LeadDetail {
  id: string;
  customerName: string;
  whatsappNumber: string;
  vehicleBrand: string | null;
  vehicleType: string | null;
  vehicleYear: string | null;
  plateRegion: string | null;
  vehiclePriceOtr: number | null;
  coverageType: string | null;
  addOns: string | null;
  customerBudget: number | null;
  estimatedPremium: number | null;
  originalPremium: number | null;
  discountAmount: number | null;
  adminFee: number | null;
  selectedPartner: string | null;
  status: string;
  assignedSalesId: string | null;
  notes: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  assignedSales: { id: string; name: string; email: string } | null;
  followups: Followup[];
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

const resultConfig: Record<string, { label: string; color: string }> = {
  interested: { label: "Tertarik", color: "bg-green-100 text-green-700" },
  ragu: { label: "Ragu", color: "bg-orange-100 text-orange-700" },
  rejected: { label: "Ditolak", color: "bg-red-100 text-red-700" },
  no_answer: { label: "Tidak Diangkat", color: "bg-slate-100 text-slate-700" },
  deal: { label: "Deal", color: "bg-emerald-100 text-emerald-700" },
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [salesUsers, setSalesUsers] = useState<{ id: string; name: string }[]>([]);
  const [showFollowupDialog, setShowFollowupDialog] = useState(false);
  const [isSubmittingFollowup, setIsSubmittingFollowup] = useState(false);
  const submissionInFlightRef = useRef(false);
  const [followupForm, setFollowupForm] = useState({
    notes: "",
    nextFollowupDate: "",
    result: "",
  });

  useEffect(() => {
    fetchLead();
    fetchSales();
  }, [params.id]);

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/admin/leads/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
      } else {
        router.push("/admin/leads");
      }
    } catch (error) {
      console.error("Fetch lead error:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchLead();
      }
    } catch (error) {
      console.error("Status change error:", error);
    }
  };

  const handleAssignSales = async (salesId: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedSalesId: salesId || null }),
      });
      if (res.ok) {
        fetchLead();
      }
    } catch (error) {
      console.error("Assign sales error:", error);
    }
  };

  const handleAddFollowup = async () => {
    if (submissionInFlightRef.current) return;
    submissionInFlightRef.current = true;
    setIsSubmittingFollowup(true);
    try {
      const res = await fetch(`/api/admin/leads/${params.id}/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(followupForm),
      });
      if (res.ok) {
        setShowFollowupDialog(false);
        setFollowupForm({ notes: "", nextFollowupDate: "", result: "" });
        fetchLead();
      }
    } catch (error) {
      console.error("Add followup error:", error);
    } finally {
      submissionInFlightRef.current = false;
      setIsSubmittingFollowup(false);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-";
    return `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  if (!lead) return null;

  const statusInfo = statusConfig[lead.status] || { label: lead.status, color: "bg-slate-100 text-slate-700" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href="/admin/leads" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">{lead.customerName}</h1>
          <p className="text-slate-500 text-sm">{lead.whatsappNumber}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={lead.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-36">
              <Badge className={statusInfo.color} variant="secondary">
                {statusInfo.label}
              </Badge>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusConfig).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={showFollowupDialog} onOpenChange={(open) => { if (!open && isSubmittingFollowup) return; if (open) submissionInFlightRef.current = false; setShowFollowupDialog(open); }}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Follow-up
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Follow-up</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Catatan *</Label>
                  <Textarea
                    value={followupForm.notes}
                    onChange={(e) => setFollowupForm({ ...followupForm, notes: e.target.value })}
                    placeholder="Hasil follow-up..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hasil</Label>
                  <Select value={followupForm.result} onValueChange={(v) => setFollowupForm({ ...followupForm, result: v })}>
                    <SelectTrigger><SelectValue placeholder="Pilih hasil" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interested">Tertarik</SelectItem>
                      <SelectItem value="ragu">Ragu</SelectItem>
                      <SelectItem value="rejected">Ditolak</SelectItem>
                      <SelectItem value="no_answer">Tidak Diangkat</SelectItem>
                      <SelectItem value="deal">Deal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Follow-up Berikutnya</Label>
                  <Input
                    type="date"
                    value={followupForm.nextFollowupDate}
                    onChange={(e) => setFollowupForm({ ...followupForm, nextFollowupDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFollowupDialog(false)}
                  disabled={isSubmittingFollowup}
                >
                  Batal
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleAddFollowup}
                  disabled={!followupForm.notes || isSubmittingFollowup}
                  type="button"
                >
                  {isSubmittingFollowup ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer & Vehicle Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informasi Lead</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Nama Customer</p>
                  <p className="text-sm font-medium text-slate-700">{lead.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">WhatsApp</p>
                  <a
                    href={`https://wa.me/${lead.whatsappNumber.replace(/^0/, "62")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-sky-500 hover:underline flex items-center gap-1.5 py-1 -my-1 px-2 -mx-2 rounded-md hover:bg-sky-50 transition-colors min-h-[44px]"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {lead.whatsappNumber}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Merk Kendaraan</p>
                  <p className="text-sm text-slate-700">{lead.vehicleBrand || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Tipe Kendaraan</p>
                  <p className="text-sm text-slate-700">{lead.vehicleType || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Tahun</p>
                  <p className="text-sm text-slate-700">{lead.vehicleYear || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Plat Daerah</p>
                  <p className="text-sm text-slate-700">{lead.plateRegion || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Harga OTR</p>
                  <p className="text-sm font-medium text-slate-700">{formatCurrency(lead.vehiclePriceOtr)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Coverage</p>
                  <p className="text-sm text-slate-700">{lead.coverageType || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Budget Customer</p>
                  <p className="text-sm font-medium text-slate-700">{formatCurrency(lead.customerBudget)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Premi Sebelum Diskon</p>
                  <p className="text-sm font-medium text-slate-700 line-through">{formatCurrency(lead.originalPremium)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Diskon</p>
                  <p className="text-sm font-medium text-green-600">{lead.discountAmount ? `- ${formatCurrency(lead.discountAmount)}` : "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Biaya Admin</p>
                  <p className="text-sm font-medium text-slate-700">{formatCurrency(lead.adminFee)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Premi Setelah Diskon</p>
                  <p className="text-sm font-bold text-sky-600">{formatCurrency(lead.estimatedPremium)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Partner Dipilih</p>
                  <p className="text-sm text-slate-700">{lead.selectedPartner || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Sumber</p>
                  <p className="text-sm text-slate-700">{lead.source || "-"}</p>
                </div>
              </div>
              {lead.addOns && (
                <div className="mt-4">
                  <p className="text-xs text-slate-400 mb-2">Add-ons</p>
                  <div className="flex flex-wrap gap-1">
                    {JSON.parse(lead.addOns).map((addon: string) => (
                      <Badge key={addon} variant="secondary" className="text-xs bg-slate-100">
                        {addon}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {lead.notes && (
                <div className="mt-4">
                  <p className="text-xs text-slate-400 mb-1">Catatan</p>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Followup Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Riwayat Follow-up</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.followups.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">Belum ada follow-up</p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {lead.followups.map((fu, index) => {
                    const resultInfo = fu.result ? resultConfig[fu.result] : null;
                    return (
                      <div key={fu.id} className="flex gap-2 sm:gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center shrink-0 ${
                            index === 0 ? "bg-sky-50" : "bg-slate-50"
                          }`}>
                            <MessageSquare className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                              index === 0 ? "text-sky-500" : "text-slate-400"
                            }`} />
                          </div>
                          {index < lead.followups.length - 1 && (
                            <div className="w-px flex-1 bg-slate-200 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-2 sm:pb-4">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                            <span className="text-sm font-medium text-slate-700">
                              {fu.sales?.name || "System"}
                            </span>
                            {resultInfo && (
                              <Badge className={resultInfo.color} variant="secondary">
                                {resultInfo.label}
                              </Badge>
                            )}
                            <span className="text-xs text-slate-400 w-full sm:w-auto">
                              {formatDate(fu.followupDate)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap">{fu.notes}</p>
                          {fu.nextFollowupDate && (
                            <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Follow-up berikutnya: {new Date(fu.nextFollowupDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Assignment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={lead.assignedSalesId || "none"}
                onValueChange={(v) => handleAssignSales(v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign sales" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa Sales</SelectItem>
                  {salesUsers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {lead.assignedSales && (
                <p className="text-sm text-slate-500 mt-2">
                  {lead.assignedSales.name} ({lead.assignedSales.email})
                </p>
              )}
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={lead.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400 mt-2">
                Dibuat: {formatDate(lead.createdAt)}
              </p>
              <p className="text-xs text-slate-400">
                Diubah: {formatDate(lead.updatedAt)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
