"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, User, Phone, FileText, Send,
  CheckCircle2, MessageCircle, AlertTriangle, Shield,
  Info, Calculator, ArrowLeft, Handshake,
} from "lucide-react";
import { InsuranceProduct } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Step 1: Form (Name, WA, Notes) → "Lihat Estimasi"
// Step 2: Estimation shown + confident WhatsApp CTA + only close button
// Step 2b: Exit prompt "Punya budget tertentu?" (fallback when user closes)
// Step 3: Offer form (price input) → Submit → Result

type Step = "form" | "estimation" | "exit-prompt" | "offer" | "result-valid" | "result-rejected";

interface LeadData {
  id: string;
  customerName: string;
  whatsappNumber: string;
  productName: string;
  estimatedPrice: number;
  minimumOfferPrice: number;
  notes: string | null;
}

interface LeadFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: InsuranceProduct | null;
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

export default function LeadFlowModal({
  isOpen,
  onClose,
  product,
}: LeadFlowModalProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState({
    customerName: "",
    whatsappNumber: "",
    notes: "",
  });
  const [offerPrice, setOfferPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadData, setLeadData] = useState<LeadData | null>(null);

  if (!product) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  // Step 1: Submit form → Create lead in DB
  const handleViewEstimation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const cleanPhone = formData.whatsappNumber.replace(/[\s\-+]/g, "");
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      setError(t("leadFlow.phoneError"));
      setIsSubmitting(false);
      return;
    }

    try {
      // Find product in DB by slug
      let productId: string | null = null;

      try {
        const productsRes = await fetch("/api/products");
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const dbProduct = productsData.products?.find((p: any) => p.slug === product.slug);
          if (dbProduct) productId = dbProduct.id;
        }
      } catch {
        // API not available
      }

      if (productId) {
        // Create lead via API
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: formData.customerName.trim(),
            whatsappNumber: cleanPhone,
            productId,
            notes: formData.notes.trim() || null,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || t("leadFlow.connectionError"));
          setIsSubmitting(false);
          return;
        }

        setLeadData({
          id: data.lead.id,
          customerName: data.lead.customerName,
          whatsappNumber: data.lead.whatsappNumber,
          productName: data.lead.productNameSnapshot,
          estimatedPrice: data.lead.estimatedPriceSnapshot,
          minimumOfferPrice: data.lead.minimumOfferPriceSnapshot,
          notes: data.lead.notes,
        });
      } else {
        // No DB — use local fallback
        setLeadData({
          id: `local-${Date.now()}`,
          customerName: formData.customerName.trim(),
          whatsappNumber: cleanPhone,
          productName: product.name,
          estimatedPrice: product.estimatedPrice,
          minimumOfferPrice: product.minimumOfferPrice,
          notes: formData.notes.trim() || null,
        });
      }

      setStep("estimation");
    } catch {
      setError(t("leadFlow.connectionError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: WhatsApp CTA → Update lead status
  const handleWhatsAppClick = async () => {
    if (leadData && !leadData.id.startsWith("local-")) {
      try {
        await fetch(`/api/leads/${leadData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "whatsapp_clicked" }),
        });
      } catch {
        // Silent fail — WhatsApp should still open
      }
    }
  };

  // Step 3: Submit offer → Update existing lead
  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const priceValue = parseInt(offerPrice.replace(/\D/g, ""));
    if (!priceValue || priceValue <= 0) {
      setError(t("leadFlow.offerValidError"));
      setIsSubmitting(false);
      return;
    }

    try {
      if (leadData && !leadData.id.startsWith("local-")) {
        // Update existing lead via API
        const res = await fetch(`/api/leads/${leadData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerOfferPrice: priceValue }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || t("leadFlow.offerError"));
          setIsSubmitting(false);
          return;
        }

        setStep(data.isValidOffer ? "result-valid" : "result-rejected");
      } else {
        // Local validation fallback
        const isValid = priceValue >= (leadData?.minimumOfferPrice || product.minimumOfferPrice);
        setStep(isValid ? "result-valid" : "result-rejected");
      }
    } catch {
      setError(t("leadFlow.connectionError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildWhatsAppUrl = () => {
    const phone = "6281379290494";
    const name = leadData?.customerName || formData.customerName;
    const message = `Halo Jasa Proteksi,\n\nSaya tertarik dengan produk asuransi berikut:\n\nNama: ${name}\nProduk: ${product.name}\nHarga Estimasi: ${formatRupiah(product.estimatedPrice)}\n${offerPrice ? `Penawaran Saya: Rp ${parseInt(offerPrice.replace(/\D/g, "")).toLocaleString("id-ID")}\n` : ""}${formData.notes ? `Catatan: ${formData.notes}\n` : ""}\nMohon informasi lebih lanjut. Terima kasih.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Handle close button based on current step
  const handleCloseClick = () => {
    if (step === "estimation" && leadData) {
      // Don't close directly — show exit prompt (fallback to offer)
      setStep("exit-prompt");
      return;
    }
    if (step === "exit-prompt") {
      // User explicitly chose to close from exit prompt
      resetAndClose();
      return;
    }
    if (step === "offer") {
      // Go back to exit prompt
      setStep("exit-prompt");
      return;
    }
    resetAndClose();
  };

  // Handle backdrop click
  const handleBackdropClick = () => {
    if (step === "estimation" && leadData) {
      setStep("exit-prompt");
      return;
    }
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep("form");
    setFormData({ customerName: "", whatsappNumber: "", notes: "" });
    setOfferPrice("");
    setError(null);
    setLeadData(null);
    onClose();
  };

  const benefits: string[] = JSON.parse(product.benefits || "[]");

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
            onClick={handleBackdropClick}
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
                onClick={handleCloseClick}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors duration-500 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* ──────── STEP 1: FORM ──────── */}
              {step === "form" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: premiumEase }}
                >
                  {/* Header */}
                  <div className="relative h-28 bg-gradient-to-br from-[#0A0F1E] via-[#141B30] to-[#0A0F1E] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[#2E7D6F]/[0.04] blur-3xl" />
                    <div className="relative text-center">
                      <Shield className="w-8 h-8 text-[#2E7D6F]/50 mx-auto mb-1.5" />
                      <h3 className="text-base font-bold text-white/90 font-[family-name:var(--font-montserrat)]">
                        {product.name}
                      </h3>
                      <span className="text-[9px] tracking-wider text-[#2E7D6F]/70 uppercase">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pt-5 pb-2">
                    <p className="text-center text-white/40 text-[10px] tracking-wider uppercase mb-1">{t("leadFlow.step1Label")}</p>
                    <h4 className="text-center text-white/80 text-sm font-semibold font-[family-name:var(--font-montserrat)] mb-5">
                      {t("leadFlow.step1Title")}
                    </h4>
                  </div>

                  <form onSubmit={handleViewEstimation} className="px-6 pb-8">
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-1.5 text-white/40 text-[10px] tracking-wider uppercase mb-2">
                          <User className="w-3 h-3" /> {t("leadFlow.nameLabel")}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.customerName}
                          onChange={(e) => handleInputChange("customerName", e.target.value)}
                          placeholder={t("leadFlow.namePlaceholder")}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-white/80 text-sm placeholder:text-white/15 focus:outline-none focus:border-[#2E7D6F]/40 focus:ring-1 focus:ring-[#2E7D6F]/20 transition-all duration-500"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-1.5 text-white/40 text-[10px] tracking-wider uppercase mb-2">
                          <Phone className="w-3 h-3" /> {t("leadFlow.whatsappLabel")}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.whatsappNumber}
                          onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                          placeholder={t("leadFlow.whatsappPlaceholder")}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-white/80 text-sm placeholder:text-white/15 focus:outline-none focus:border-[#2E7D6F]/40 focus:ring-1 focus:ring-[#2E7D6F]/20 transition-all duration-500"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-1.5 text-white/40 text-[10px] tracking-wider uppercase mb-2">
                          <FileText className="w-3 h-3" /> {t("leadFlow.notesLabel")}
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          placeholder={t("leadFlow.notesPlaceholder")}
                          rows={2}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-white/80 text-sm placeholder:text-white/15 focus:outline-none focus:border-[#2E7D6F]/40 focus:ring-1 focus:ring-[#2E7D6F]/20 transition-all duration-500 resize-none"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex items-start gap-2"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80 mt-0.5 flex-shrink-0" />
                        <p className="text-amber-400/80 text-xs">{error}</p>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.customerName || !formData.whatsappNumber}
                      className="w-full mt-6 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#2E7D6F] text-white font-semibold tracking-wider text-sm hover:bg-[#3A9B8A] transition-all duration-600 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t("leadFlow.processing")}
                        </>
                      ) : (
                        <>
                          <Calculator className="w-4 h-4" />
                          {t("leadFlow.viewEstimation")}
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ──────── STEP 2: ESTIMATION (confident, no offer) ──────── */}
              {step === "estimation" && leadData && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: premiumEase }}
                >
                  {/* Header */}
                  <div className="px-6 pt-8 pb-2 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#2E7D6F]/10 border border-[#2E7D6F]/20 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-[#2E7D6F]" />
                    </div>
                    <h3 className="text-lg font-bold text-white/90 font-[family-name:var(--font-montserrat)] mb-1">
                      {t("leadFlow.estimationTitle")}
                    </h3>
                    <p className="text-white/30 text-[10px]">{leadData.productName}</p>
                  </div>

                  <div className="px-6 pb-8">
                    {/* Price display */}
                    <div className="text-center bg-white/[0.03] border border-white/[0.05] rounded-lg p-5 mb-5">
                      <p className="text-white/40 text-[10px] tracking-wider uppercase mb-2">{t("leadFlow.estimatedPriceLabel")}</p>
                      <p className="text-3xl font-bold text-[#2E7D6F] font-[family-name:var(--font-montserrat)]">
                        {formatRupiah(leadData.estimatedPrice)}
                      </p>
                      <p className="text-white/25 text-[10px] mt-1">{t("leadFlow.perYear")}</p>
                    </div>

                    {/* Benefits */}
                    {benefits.length > 0 && (
                      <div className="mb-6">
                        <p className="text-white/50 text-[10px] tracking-wider uppercase mb-2.5">{t("leadFlow.benefitsLabel")}</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {benefits.slice(0, 6).map((b, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-white/40 text-[10px]">
                              <div className="w-1 h-1 rounded-full bg-[#2E7D6F]/50 flex-shrink-0" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Primary CTA — Confident WhatsApp */}
                    <a
                      href={buildWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWhatsAppClick}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-[#2E7D6F] text-white font-semibold tracking-wider text-sm hover:bg-[#3A9B8A] transition-all duration-600 rounded-md"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {t("leadFlow.agreeWhatsApp")}
                    </a>

                    {/* Subtle hint — no aggressive secondary action */}
                    <p className="text-center text-white/20 text-[10px] mt-4 leading-relaxed">
                      {t("leadFlow.closeHint")}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ──────── EXIT PROMPT: Fallback to offer (only when user closes) ──────── */}
              {step === "exit-prompt" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: premiumEase }}
                  className="px-6 py-10 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#2E7D6F]/10 border border-[#2E7D6F]/20 flex items-center justify-center mx-auto mb-4">
                    <Handshake className="w-6 h-6 text-[#2E7D6F]/70" />
                  </div>

                  <h4 className="text-white/90 font-semibold text-base mb-2 font-[family-name:var(--font-montserrat)]">
                    {t("leadFlow.exitPromptTitle")}
                  </h4>
                  <p className="text-white/40 text-xs leading-relaxed mb-6 max-w-sm mx-auto">
                    {t("leadFlow.exitPromptDesc")}
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setStep("offer")}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#2E7D6F] text-white font-semibold tracking-wider text-sm hover:bg-[#3A9B8A] transition-all duration-600 rounded-md"
                    >
                      <Send className="w-4 h-4" />
                      {t("leadFlow.submitOffer")}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={resetAndClose}
                      className="w-full px-5 py-3 border border-white/[0.08] text-white/30 text-xs font-medium tracking-wider hover:border-white/15 hover:text-white/50 transition-all duration-500 rounded-md"
                    >
                      {t("leadFlow.close")}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ──────── STEP 3: OFFER FORM (fallback flow) ──────── */}
              {step === "offer" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: premiumEase }}
                >
                  {/* Back button */}
                  <button
                    onClick={() => setStep("exit-prompt")}
                    className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors duration-500 z-10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="px-6 pt-8 pb-2 text-center">
                    <h3 className="text-lg font-bold text-white/90 font-[family-name:var(--font-montserrat)] mb-1">
                      {t("leadFlow.offerTitle")}
                    </h3>
                    <p className="text-white/30 text-xs">{product.name} — {t("leadFlow.estimatedPriceLabel")} {formatRupiah(product.estimatedPrice)}{t("leadFlow.perYear")}</p>
                  </div>

                  <form onSubmit={handleSubmitOffer} className="px-6 pb-8">
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-1.5 text-white/40 text-[10px] tracking-wider uppercase mb-2">
                          {t("leadFlow.offerPriceLabel")}
                        </label>
                        <input
                          type="text"
                          required
                          value={offerPrice}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            setOfferPrice(raw ? parseInt(raw).toLocaleString("id-ID") : "");
                            setError(null);
                          }}
                          placeholder={`Min. ${product.minimumOfferPrice.toLocaleString("id-ID")}`}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-4 py-3 text-[#2E7D6F] text-sm font-semibold placeholder:text-white/15 focus:outline-none focus:border-[#2E7D6F]/40 focus:ring-1 focus:ring-[#2E7D6F]/20 transition-all duration-500"
                        />
                        <p className="text-white/20 text-[10px] mt-1.5">
                          {t("leadFlow.offerMinLabel")}: {formatRupiah(product.minimumOfferPrice)}{t("leadFlow.perYear")}
                        </p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-3.5 mt-4">
                      <div className="flex items-start gap-2">
                        <Info className="w-3 h-3 text-[#2E7D6F]/50 mt-0.5 flex-shrink-0" />
                        <p className="text-white/40 text-[10px] leading-relaxed">
                          {t("leadFlow.offerInfoText")}
                        </p>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex items-start gap-2"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80 mt-0.5 flex-shrink-0" />
                        <p className="text-amber-400/80 text-xs">{error}</p>
                      </motion.div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep("exit-prompt")}
                        className="flex-1 px-5 py-3 border border-white/10 text-white/40 text-xs font-medium tracking-wider hover:border-white/20 transition-all duration-500 rounded-md"
                      >
                        {t("leadFlow.back")}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !offerPrice}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#2E7D6F] text-white text-xs font-semibold tracking-wider hover:bg-[#3A9B8A] transition-all duration-500 rounded-md disabled:opacity-40"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <><Send className="w-3.5 h-3.5" /> {t("leadFlow.sendOffer")}</>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ──────── RESULT: VALID ──────── */}
              {step === "result-valid" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: premiumEase }}
                  className="px-6 py-10 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#2E7D6F]/10 border border-[#2E7D6F]/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7 text-[#2E7D6F]" />
                  </div>
                  <h4 className="text-white/90 font-semibold text-base mb-2 font-[family-name:var(--font-montserrat)]">
                    {t("leadFlow.resultValidTitle")}
                  </h4>
                  <p className="text-white/40 text-xs leading-relaxed mb-6 max-w-sm mx-auto">
                    {t("leadFlow.resultValidDesc").replace("{name}", leadData?.customerName || "")}
                  </p>

                  {/* Summary */}
                  <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-4 mb-6 text-left">
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/30">{t("leadFlow.resultProduct")}</span>
                        <span className="text-white/70">{product.name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/30">{t("leadFlow.resultEstPrice")}</span>
                        <span className="text-white/70">{formatRupiah(product.estimatedPrice)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/30">{t("leadFlow.resultYourOffer")}</span>
                        <span className="text-[#2E7D6F] font-semibold">
                          {offerPrice ? `Rp ${parseInt(offerPrice.replace(/\D/g, "")).toLocaleString("id-ID")}` : "-"}
                        </span>
                      </div>
                      <div className="border-t border-white/[0.05] pt-2.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/30">{t("leadFlow.resultStatus")}</span>
                          <span className="text-[#2E7D6F] font-medium">{t("leadFlow.resultValidStatus")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#2E7D6F] text-white font-semibold tracking-wider text-sm hover:bg-[#3A9B8A] transition-all duration-600 rounded-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t("leadFlow.continueWhatsApp")}
                  </a>
                </motion.div>
              )}

              {/* ──────── RESULT: REJECTED ──────── */}
              {step === "result-rejected" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: premiumEase }}
                  className="px-6 py-10 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-7 h-7 text-amber-400/80" />
                  </div>
                  <h4 className="text-white/90 font-semibold text-base mb-2 font-[family-name:var(--font-montserrat)]">
                    {t("leadFlow.resultRejectedTitle")}
                  </h4>
                  <p className="text-white/40 text-xs leading-relaxed mb-5 max-w-sm mx-auto">
                    {t("leadFlow.resultRejectedDesc").replace("{minPrice}", formatRupiah(product.minimumOfferPrice)).replace("{productName}", product.name)}
                  </p>
                  <p className="text-white/25 text-[10px] leading-relaxed mb-6">
                    {t("leadFlow.resultRejectedNote")}
                  </p>

                  <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-4 mb-6 text-left">
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/30">{t("leadFlow.resultYourOffer")}</span>
                        <span className="text-amber-400/80 font-medium">
                          {offerPrice ? `Rp ${parseInt(offerPrice.replace(/\D/g, "")).toLocaleString("id-ID")}` : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/30">Minimum</span>
                        <span className="text-white/70">{formatRupiah(product.minimumOfferPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep("offer")}
                      className="flex-1 px-5 py-3 border border-white/10 text-white/50 text-xs font-medium tracking-wider hover:border-white/20 transition-all duration-500 rounded-md"
                    >
                      {t("leadFlow.changeOffer")}
                    </button>
                    <a
                      href={buildWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWhatsAppClick}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#2E7D6F] text-white text-xs font-semibold tracking-wider hover:bg-[#3A9B8A] transition-all duration-500 rounded-md"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> {t("leadFlow.chatWhatsApp")}
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
