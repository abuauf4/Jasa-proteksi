"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, UserCheck, Search, Filter } from "lucide-react";
import Link from "next/link";

interface FollowupItem {
  id: string;
  leadId: string;
  notes: string;
  result: string | null;
  followupDate: string;
  nextFollowupDate: string | null;
  createdAt: string;
  lead: { id: string; customerName: string; whatsappNumber: string; status: string };
  sales: { id: string; name: string } | null;
}

const resultConfig: Record<string, { label: string; color: string }> = {
  interested: { label: "Tertarik", color: "bg-green-100 text-green-700" },
  ragu: { label: "Ragu", color: "bg-orange-100 text-orange-700" },
  rejected: { label: "Ditolak", color: "bg-red-100 text-red-700" },
  no_answer: { label: "Tidak Diangkat", color: "bg-slate-100 text-slate-700" },
  deal: { label: "Deal", color: "bg-emerald-100 text-emerald-700" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  baru: { label: "Baru", color: "bg-blue-100 text-blue-700" },
  dihubungi: { label: "Dihubungi", color: "bg-yellow-100 text-yellow-700" },
  ragu_ragu: { label: "Ragu-ragu", color: "bg-orange-100 text-orange-700" },
  negosiasi: { label: "Negosiasi", color: "bg-purple-100 text-purple-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  lost: { label: "Lost", color: "bg-red-100 text-red-700" },
  expired: { label: "Expired", color: "bg-slate-100 text-slate-700" },
};

export default function AdminFollowupsPage() {
  const [followups, setFollowups] = useState<FollowupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFollowups();
  }, [resultFilter, search, page]);

  const fetchFollowups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (resultFilter !== "all") params.set("result", resultFilter);
      if (search) params.set("search", search);
      params.set("page", page.toString());
      params.set("limit", "20");

      const res = await fetch(`/api/admin/followups?${params}`);
      if (res.ok) {
        const data = await res.json();
        setFollowups(data.followups);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Fetch followups error:", error);
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Follow-up</h1>
        <p className="text-slate-500 text-sm">Riwayat follow-up semua leads</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari catatan, nama customer..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={resultFilter} onValueChange={(v) => { setResultFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Hasil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Hasil</SelectItem>
                {Object.entries(resultConfig).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Followups Table - Desktop */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-sky-500" />
            Riwayat Follow-up
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status Lead</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>Hasil</TableHead>
                    <TableHead>Follow-up Berikutnya</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : followups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                        Belum ada follow-up
                      </TableCell>
                    </TableRow>
                  ) : (
                    followups.map((fu) => {
                      const resultInfo = fu.result ? resultConfig[fu.result] : null;
                      const leadStatus = statusConfig[fu.lead.status] || { label: fu.lead.status, color: "bg-slate-100 text-slate-700" };
                      return (
                        <TableRow key={fu.id} className="hover:bg-slate-50">
                          <TableCell className="text-sm text-slate-500">
                            {formatDate(fu.followupDate)}
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/admin/leads/${fu.lead.id}`}
                              className="text-sm font-medium text-sky-500 hover:underline"
                            >
                              {fu.lead.customerName}
                            </Link>
                            <p className="text-xs text-slate-400">{fu.lead.whatsappNumber}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={leadStatus.color} variant="secondary">
                              {leadStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">
                            {fu.sales?.name || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 max-w-xs truncate">
                            {fu.notes}
                          </TableCell>
                          <TableCell>
                            {resultInfo ? (
                              <Badge className={resultInfo.color} variant="secondary">
                                {resultInfo.label}
                              </Badge>
                            ) : (
                              <span className="text-slate-400 text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {fu.nextFollowupDate ? (
                              <span className="flex items-center gap-1 text-orange-500">
                                <Calendar className="h-3 w-3" />
                                {formatDate(fu.nextFollowupDate)}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
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
          <div className="md:hidden space-y-3 p-4">
            {loading ? (
              <div className="text-center py-8 text-slate-400">Memuat data...</div>
            ) : followups.length === 0 ? (
              <div className="text-center py-8 text-slate-400">Belum ada follow-up</div>
            ) : (
              followups.map((fu) => {
                const resultInfo = fu.result ? resultConfig[fu.result] : null;
                const leadStatus = statusConfig[fu.lead.status] || { label: fu.lead.status, color: "bg-slate-100 text-slate-700" };
                return (
                  <div
                    key={fu.id}
                    className="rounded-lg border border-slate-200 p-4 space-y-3"
                  >
                    {/* Row 1: Date & Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-500">{formatDate(fu.followupDate)}</span>
                      <div className="flex items-center gap-1.5">
                        <Badge className={leadStatus.color} variant="secondary">
                          {leadStatus.label}
                        </Badge>
                        {resultInfo ? (
                          <Badge className={resultInfo.color} variant="secondary">
                            {resultInfo.label}
                          </Badge>
                        ) : null}
                      </div>
                    </div>

                    {/* Row 2: Customer name */}
                    <div>
                      <Link
                        href={`/admin/leads/${fu.lead.id}`}
                        className="text-sm font-medium text-sky-500 hover:underline"
                      >
                        {fu.lead.customerName}
                      </Link>
                    </div>

                    {/* Row 3: Sales */}
                    <div className="text-xs text-slate-500">
                      Sales: {fu.sales?.name || "-"}
                    </div>

                    {/* Row 4: Notes */}
                    {fu.notes && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {fu.notes}
                      </p>
                    )}

                    {/* Row 5: Next followup date */}
                    {fu.nextFollowupDate ? (
                      <div className="flex items-center gap-1 text-xs text-orange-500">
                        <Calendar className="h-3 w-3" />
                        <span>Selanjutnya: {formatDate(fu.nextFollowupDate)}</span>
                      </div>
                    ) : null}
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
