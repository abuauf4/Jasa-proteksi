"use client";

import { useState, useEffect } from "react";
import {
  Shield, CheckCircle2, XCircle, MessageCircle, Eye,
  Trash2, Clock, ArrowRight, Filter, Search,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadHistory {
  id: string;
  action: string;
  detail: string | null;
  createdAt: string;
}

interface Lead {
  id: string;
  customerName: string;
  whatsappNumber: string;
  productId: string;
  productNameSnapshot: string;
  estimatedPriceSnapshot: number;
  minimumOfferPriceSnapshot: number;
  customerOfferPrice: number | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  product?: { name: string; slug: string; category: string };
  history?: LeadHistory[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  estimation_viewed: { label: "Estimasi Dilihat", color: "bg-blue-500/10 text-blue-400/80 border-blue-500/20", icon: Eye },
  whatsapp_clicked: { label: "WhatsApp Diklik", color: "bg-[#2E7D6F]/10 text-[#2E7D6F] border-[#2E7D6F]/20", icon: MessageCircle },
  offer_submitted: { label: "Penawaran Valid", color: "bg-emerald-500/10 text-emerald-400/80 border-emerald-500/20", icon: CheckCircle2 },
  offer_rejected: { label: "Penawaran Ditolak", color: "bg-amber-500/10 text-amber-400/80 border-amber-500/20", icon: XCircle },
};

const actionLabels: Record<string, string> = {
  created: "Lead dibuat — melihat estimasi",
  whatsapp_clicked: "Klik tombol WhatsApp",
  offer_submitted: "Mengajukan penawaran (valid)",
  offer_rejected: "Mengajukan penawaran (rejected)",
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1);
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus lead ini?")) return;
    try {
      await fetch(`/api/leads/${id}`, { method: "DELETE" });
      fetchLeads(pagination.page);
    } catch {
      console.error("Failed to delete lead");
    }
  };

  const buildWhatsAppUrl = (lead: Lead) => {
    const phone = lead.whatsappNumber.replace(/^0/, "62").replace(/\D/g, "");
    const message = `Halo ${lead.customerName}, terima kasih atas minat Anda pada produk ${lead.productNameSnapshot}. Kami dari Jasa Proteksi ingin membantu Anda lebih lanjut.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const filteredLeads = searchQuery
    ? leads.filter(
        (l) =>
          l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.whatsappNumber.includes(searchQuery) ||
          l.productNameSnapshot.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : leads;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white/90 font-[family-name:var(--font-montserrat)] mb-1">Leads</h1>
          <p className="text-white/30 text-sm">Penawaran dari customer</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/20 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama / produk..."
              className="bg-white/[0.03] border border-white/[0.08] rounded-md pl-9 pr-4 py-2 text-white/80 text-xs focus:outline-none focus:border-[#2E7D6F]/40 transition-all duration-500 w-48"
            />
          </div>
          <div className="flex items-center gap-1 p-0.5 bg-white/[0.03] border border-white/[0.06] rounded-md">
            {[
              { label: "Semua", value: "" },
              { label: "Estimasi", value: "estimation_viewed" },
              { label: "WhatsApp", value: "whatsapp_clicked" },
              { label: "Valid", value: "offer_submitted" },
              { label: "Rejected", value: "offer_rejected" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-2.5 py-1.5 text-[10px] tracking-wider font-medium rounded transition-all duration-500 ${
                  statusFilter === f.value
                    ? "bg-[#2E7D6F]/20 text-[#2E7D6F]"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-white/10 border-t-[#2E7D6F] rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-20">
          <Shield className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">Belum ada leads</p>
        </div>
      ) : (
        <>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="text-left px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Customer</th>
                    <th className="text-left px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Produk</th>
                    <th className="text-right px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Estimasi</th>
                    <th className="text-right px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Penawaran</th>
                    <th className="text-center px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Status</th>
                    <th className="text-left px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Update</th>
                    <th className="text-right px-6 py-4 text-[10px] tracking-wider text-white/30 uppercase font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const sc = statusConfig[lead.status] || statusConfig.estimation_viewed;
                    const StatusIcon = sc.icon;
                    return (
                      <tr key={lead.id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors duration-500">
                        <td className="px-6 py-4">
                          <p className="text-white/80 text-sm font-medium">{lead.customerName}</p>
                          <p className="text-white/20 text-[10px]">{lead.whatsappNumber}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white/60 text-xs">{lead.productNameSnapshot}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-white/50 text-sm">{formatRupiah(lead.estimatedPriceSnapshot)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {lead.customerOfferPrice ? (
                            <span className={`text-sm font-semibold ${lead.status === "offer_submitted" ? "text-[#2E7D6F]" : "text-amber-400/80"}`}>
                              {formatRupiah(lead.customerOfferPrice)}
                            </span>
                          ) : (
                            <span className="text-white/15 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] tracking-wider font-medium border ${sc.color}`}>
                            <StatusIcon className="w-3 h-3" /> {sc.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white/30 text-[10px]">{formatDate(lead.updatedAt)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="w-7 h-7 flex items-center justify-center text-white/20 hover:text-[#2E7D6F] transition-colors duration-500"
                              title="Detail"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={buildWhatsAppUrl(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-7 h-7 flex items-center justify-center text-white/20 hover:text-[#2E7D6F] transition-colors duration-500"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="w-7 h-7 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors duration-500"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => fetchLeads(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors duration-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-white/30 text-xs">{pagination.page} / {pagination.totalPages}</span>
              <button
                onClick={() => fetchLeads(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors duration-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedLead(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-md bg-[#0A0F1E] border border-white/[0.06] rounded-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
                  <h3 className="text-white/80 font-semibold font-[family-name:var(--font-montserrat)]">Detail Lead</h3>
                  <button onClick={() => setSelectedLead(null)} className="text-white/30 hover:text-white/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  {/* Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/30">Nama</span>
                      <span className="text-white/70">{selectedLead.customerName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/30">WhatsApp</span>
                      <a href={buildWhatsAppUrl(selectedLead)} target="_blank" rel="noopener noreferrer" className="text-[#2E7D6F] hover:underline">
                        {selectedLead.whatsappNumber}
                      </a>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/30">Produk</span>
                      <span className="text-white/70">{selectedLead.productNameSnapshot}</span>
                    </div>
                    <div className="border-t border-white/[0.05] pt-3">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/30">Harga Estimasi</span>
                        <span className="text-white/70">{formatRupiah(selectedLead.estimatedPriceSnapshot)}</span>
                      </div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/30">Minimum Penawaran</span>
                        <span className="text-white/70">{formatRupiah(selectedLead.minimumOfferPriceSnapshot)}</span>
                      </div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/30">Penawaran Customer</span>
                        <span className={selectedLead.customerOfferPrice ? "text-[#2E7D6F] font-semibold" : "text-white/30"}>
                          {selectedLead.customerOfferPrice ? formatRupiah(selectedLead.customerOfferPrice) : "—"}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-white/[0.05] pt-3">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/30">Status</span>
                        <span className={(() => {
                          const sc = statusConfig[selectedLead.status];
                          return sc ? sc.color.split(" ").find(c => c.startsWith("text-"))?.replace("text-", "") || "text-white/70" : "text-white/70";
                        })()}>
                          {statusConfig[selectedLead.status]?.label || selectedLead.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/30">Dibuat</span>
                        <span className="text-white/70">{formatDate(selectedLead.createdAt)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/30">Update Terakhir</span>
                        <span className="text-white/70">{formatDate(selectedLead.updatedAt)}</span>
                      </div>
                    </div>
                    {selectedLead.notes && (
                      <div className="border-t border-white/[0.05] pt-3">
                        <p className="text-white/30 text-[10px] tracking-wider uppercase mb-1">Catatan</p>
                        <p className="text-white/50 text-xs leading-relaxed">{selectedLead.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* History Timeline */}
                  {selectedLead.history && selectedLead.history.length > 0 && (
                    <div className="mb-6">
                      <p className="text-white/40 text-[10px] tracking-wider uppercase mb-3">Riwayat</p>
                      <div className="space-y-0">
                        {selectedLead.history.map((h, i) => (
                          <div key={h.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                h.action === "created" ? "bg-blue-400/60" :
                                h.action === "whatsapp_clicked" ? "bg-[#2E7D6F]/60" :
                                h.action === "offer_submitted" ? "bg-emerald-400/60" :
                                "bg-amber-400/60"
                              }`} />
                              {i < (selectedLead.history?.length || 0) - 1 && (
                                <div className="w-px h-6 bg-white/[0.05]" />
                              )}
                            </div>
                            <div className="pb-3">
                              <p className="text-white/60 text-[11px]">{actionLabels[h.action] || h.action}</p>
                              <p className="text-white/20 text-[9px]">{formatDate(h.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <a
                    href={buildWhatsAppUrl(selectedLead)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#2E7D6F] text-white text-xs font-semibold tracking-wider hover:bg-[#3A9B8A] transition-all duration-500 rounded-md"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Hubungi via WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
