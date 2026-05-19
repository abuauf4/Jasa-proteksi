"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowLeft, User, Phone, FileText, Send,
  CheckCircle2, XCircle, MessageCircle, AlertTriangle,
} from "lucide-react";

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
}

interface LeadResult {
  lead: {
    id: string;
    customerName: string;
    whatsappNumber: string;
    customerOfferPrice: number;
    status: string;
  };
  isValid: boolean;
  message: string;
  minimumOfferPrice: number;
  estimatedPrice: number;
}

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  product: Product | null;
}

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function LeadFormModal({
  isOpen,
  onClose,
  onBack,
  product,
}: LeadFormModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    whatsappNumber: "",
    customerOfferPrice: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<LeadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!product) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const offerPrice = parseInt(formData.customerOfferPrice.replace(/\D/g, ""));
      if (!offerPrice || offerPrice <= 0) {
        setError("Masukkan harga penawaran yang valid");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          whatsappNumber: formData.whatsappNumber.trim(),
          productId: product.id,
          customerOfferPrice: offerPrice,
          notes: formData.notes.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 202) {
        setError(data.error || "Terjadi kesalahan. Silakan coba lagi.");
        return;
      }

      setResult(data);
    } catch {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildWhatsAppUrl = () => {
    if (!result) return "#";
    const phone = "6287766860381";
    const message = `Halo Jasa Proteksi,\n\nSaya tertarik dengan produk asuransi berikut:\n\nNama: ${result.lead.customerName}\nProduk: ${product.name}\nHarga Estimasi: ${formatRupiah(result.estimatedPrice)}\nPenawaran Saya: ${formatRupiah(result.lead.customerOfferPrice)}\n${formData.notes ? `Catatan: ${formData.notes}` : ""}\n\nMohon informasi lebih lanjut. Terima kasih.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleClose = () => {
    setFormData({ customerName: "", whatsappNumber: "", customerOfferPrice: "", notes: "" });
    setResult(null);
    setError(null);
    onClose();
  };

  const handleBack = () => {
    setResult(null);
    setError(null);
    onBack();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-[#0D0D0D]/70 backdrop-blur-sm z-[60]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: premiumEase }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg bg-[#0A0F1E] border border-white/[0.06] rounded-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors duration-500 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Back button */}
              {!result && (
                <button
                  onClick={handleBack}
                  className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors duration-500 z-10"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              {/* Header */}
              <div className="relative px-6 pt-8 pb-4">
                <div className="text-center">
                  <p className="text-[10px] tracking-wider text-[#2E7D6F]/70 uppercase mb-1">Formulir Penawaran</p>
                  <h3 className="text-lg font-bold text-white/90 font-[family-name:var(--font-montserrat)]">
                    {product.name}
                  </h3>
                  <p className="text-[#2E7D6F] text-sm font-semibold mt-1">
                    Estimasi {formatRupiah(product.estimatedPrice)}/tahun
                  </p>
                </div>
              </div>

              {/* Result State */}
              {result ? (
                <div className="px-6 pb-8">
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: premiumEase }}
                    >
                      {result.isValid ? (
                        /* VALID LEAD */
                        <div className="text-center">
                          <div className="w-14 h-14 rounded-full bg-[#2E7D6F]/10 border border-[#2E7D6F]/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-7 h-7 text-[#2E7D6F]" />
                          </div>
                          <h4 className="text-white/90 font-semibold text-base mb-2 font-[family-name:var(--font-montserrat)]">
                            Penawaran Diterima
                          </h4>
                          <p className="text-white/40 text-xs leading-relaxed mb-6 max-w-sm mx-auto">
                            Terima kasih, {result.lead.customerName}. Penawaran Anda telah kami catat.
                            Silakan lanjut konsultasi dengan tim kami melalui WhatsApp untuk proses selanjutnya.
                          </p>

                          {/* Summary card */}
                          <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-4 mb-6 text-left">
                            <div className="space-y-2.5">
                              <div className="flex justify-between text-xs">
                                <span className="text-white/30">Produk</span>
                                <span className="text-white/70">{product.name}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-white/30">Estimasi Harga</span>
                                <span className="text-white/70">{formatRupiah(result.estimatedPrice)}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-white/30">Penawaran Anda</span>
                                <span className="text-[#2E7D6F] font-semibold">{formatRupiah(result.lead.customerOfferPrice)}</span>
                              </div>
                              <div className="border-t border-white/[0.05] pt-2.5">
                                <div className="flex justify-between text-xs">
                                  <span className="text-white/30">Status</span>
                                  <span className="text-[#2E7D6F] font-medium">Valid — Dapat Dilanjutkan</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* WhatsApp CTA */}
                          <a
                            href={buildWhatsAppUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#2E7D6F] text-white font-semibold tracking-wider text-sm hover:bg-[#3A9B8A] transition-all duration-600 rounded-md"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Lanjut Konsultasi via WhatsApp
                          </a>
                        </div>
                      ) : (
                        /* REJECTED LEAD */
                        <div className="text-center">
                          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-7 h-7 text-amber-400/80" />
                          </div>
                          <h4 className="text-white/90 font-semibold text-base mb-2 font-[family-name:var(--font-montserrat)]">
                            Penawaran Belum Memenuhi Syarat
                          </h4>
                          <p className="text-white/40 text-xs leading-relaxed mb-5 max-w-sm mx-auto">
                            Maaf, penawaran Anda sebesar {formatRupiah(result.lead.customerOfferPrice)} belum memenuhi
                            syarat minimum {formatRupiah(result.minimumOfferPrice)} untuk produk {product.name}.
                          </p>
                          <p className="text-white/25 text-[10px] leading-relaxed mb-6">
                            Data Anda tetap kami simpan. Tim kami mungkin akan menghubungi Anda untuk penawaran lain yang sesuai.
                          </p>

                          {/* Info card */}
                          <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-4 mb-6 text-left">
                            <div className="space-y-2.5">
                              <div className="flex justify-between text-xs">
                                <span className="text-white/30">Penawaran Anda</span>
                                <span className="text-amber-400/80 font-medium">{formatRupiah(result.lead.customerOfferPrice)}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-white/30">Minimum Penawaran</span>
                                <span className="text-white/70">{formatRupiah(result.minimumOfferPrice)}</span>
                              </div>
                              <div className="border-t border-white/[0.05] pt-2.5">
                                <div className="flex justify-between text-xs">
                                  <span className="text-white/30">Kekurangan</span>
                                  <span className="text-amber-400/60">
                                    {formatRupiah(result.minimumOfferPrice - result.lead.customerOfferPrice)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={handleBack}
                              className="flex-1 px-5 py-3 border border-white/10 text-white/50 text-xs font-medium tracking-wider hover:border-white/20 hover:text-white/70 transition-all duration-500 rounded-md"
                            >
                              Ubah Penawaran
                            </button>
                            <a
                              href={buildWhatsAppUrl()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#2E7D6F] text-white text-xs font-semibold tracking-wider hover:bg-[#3A9B8A] transition-all duration-500 rounded-md"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              Chat WhatsApp
                            </a>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                /* FORM STATE */
                <form onSubmit={handleSubmit} className="px-6 pb-8">
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="flex items-center gap-1.5 text-white/40 text-[10px] tracking-wider uppercase mb-2">
                        <User className="w-3 h-3" />
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-white/80 text-sm placeholder:text-white/15 focus:outline-none focus:border-[#2E7D6F]/40 focus:ring-1 focus:ring-[#2E7D6F]/20 transition-all duration-500"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="flex items-center gap-1.5 text-white/40 text-[10px] tracking-wider uppercase mb-2">
                        <Phone className="w-3 h-3" />
                        Nomor WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.whatsappNumber}
                        onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-white/80 text-sm placeholder:text-white/15 focus:outline-none focus:border-[#2E7D6F]/40 focus:ring-1 focus:ring-[#2E7D6F]/20 transition-all duration-500"
                      />
                    </div>

                    {/* Offer Price */}
                    <div>
                      <label className="flex items-center gap-1.5 text-white/40 text-[10px] tracking-wider uppercase mb-2">
                        <FileText className="w-3 h-3" />
                        Harga Penawaran Anda (Rp)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerOfferPrice}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          if (raw === "" || parseInt(raw) >= 0) {
                            handleInputChange("customerOfferPrice", raw ? parseInt(raw).toLocaleString("id-ID") : "");
                          }
                        }}
                        placeholder={`Min. ${product.minimumOfferPrice.toLocaleString("id-ID")}`}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-[#2E7D6F] text-sm font-semibold placeholder:text-white/15 focus:outline-none focus:border-[#2E7D6F]/40 focus:ring-1 focus:ring-[#2E7D6F]/20 transition-all duration-500"
                      />
                      <p className="text-white/20 text-[10px] mt-1.5">
                        Minimum: {formatRupiah(product.minimumOfferPrice)}/tahun
                      </p>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="flex items-center gap-1.5 text-white/40 text-[10px] tracking-wider uppercase mb-2">
                        <FileText className="w-3 h-3" />
                        Catatan / Kebutuhan Khusus
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Opsional: jelaskan kebutuhan Anda..."
                        rows={3}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-white/80 text-sm placeholder:text-white/15 focus:outline-none focus:border-[#2E7D6F]/40 focus:ring-1 focus:ring-[#2E7D6F]/20 transition-all duration-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex items-start gap-2"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80 mt-0.5 flex-shrink-0" />
                        <p className="text-amber-400/80 text-xs">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.customerName || !formData.whatsappNumber || !formData.customerOfferPrice}
                    className="w-full mt-6 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#2E7D6F] text-white font-semibold tracking-wider text-sm hover:bg-[#3A9B8A] transition-all duration-600 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirim Penawaran
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
