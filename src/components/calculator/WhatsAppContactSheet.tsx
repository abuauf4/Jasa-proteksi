"use client";

import * as React from "react";
import { X, User, Phone, Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * WhatsAppContactSheet — bottom sheet modal for collecting customer
 * name and WhatsApp number before opening WhatsApp.
 *
 * Flow:
 *   1. User clicks "Lanjutkan via WhatsApp" in PremiumResult
 *   2. This sheet opens
 *   3. User fills name + phone
 *   4. On submit: POST lead → get leadCode → build WhatsApp message → open WhatsApp
 *   5. If API fails, show fallback "Tetap Buka WhatsApp" button
 */

interface WhatsAppContactSheetProps {
  open: boolean;
  onClose: () => void;
  /** Called with the leadCode after successful lead creation */
  onLeadCreated?: (leadCode: string, leadId: string) => void;
  /** Called when WhatsApp is opened (for analytics) */
  onWhatsAppOpened?: () => void;
  /** Calculator snapshot data for the lead payload */
  calculatorSnapshot: CalculatorSnapshot;
  /** WhatsApp number from SiteSettings (destination) */
  whatsappTarget: string;
}

export interface CalculatorSnapshot {
  brand: string;
  model: string;
  year: string;
  plate: string;
  coverageType: "AllRisk" | "TLO";
  addOns: string[];
  vehicleValue: number;
  estimatedPremium: number;
  partnerName?: string;
  /** Breakdown details */
  basePremium?: number;
  discountAmount?: number;
  adminFee?: number;
  policyFee?: number;
  originalPremium?: number;
}

/* ─── Phone normalization ─── */

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[\s\-+]/g, "");
  if (digits.startsWith("08")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return digits;
}

function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/[\s\-+]/g, "");
  return /^\d{10,15}$/.test(digits);
}

/* ─── WhatsApp message builder ─── */

const ADDON_LABELS: Record<string, string> = {
  flood: "Banjir",
  earthquake: "Gempa Bumi",
  srcc: "Kerusuhan",
  terrorism: "Terorisme",
  bengkelAuthorized: "Bengkel Resmi",
  tpl: "Tanggung Jawab Pihak Ketiga",
  paDriver: "Kecelakaan Diri Pengemudi",
  paPassenger: "Kecelakaan Diri Penumpang",
};

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function buildWhatsAppMessage(
  snap: CalculatorSnapshot,
  leadCode: string,
  customerName: string,
  customerPhone: string
): string {
  const vehicleName = snap.model.toLowerCase().startsWith(snap.brand.toLowerCase())
    ? snap.model
    : `${snap.brand} ${snap.model}`;
  const coverageLabel = snap.coverageType === "AllRisk" ? "All Risk" : "TLO";
  const addonLabels = snap.addOns.map((k) => ADDON_LABELS[k] || k);

  const lines = [
    "Halo Jasa Proteksi, saya ingin melanjutkan konsultasi.",
    "",
    `Kode Lead: ${leadCode}`,
    `Mobil: ${vehicleName} ${snap.year}`,
    `Perlindungan: ${coverageLabel}`,
    ...(snap.partnerName ? [`Partner: ${snap.partnerName}`] : []),
    `Estimasi Premi: ${formatIDR(snap.estimatedPremium)}`,
    ...(addonLabels.length ? [`Perluasan: ${addonLabels.join(", ")}`] : []),
    "",
    `Nama: ${customerName}`,
    `Nomor: ${customerPhone}`,
    "",
    "Mohon dibantu untuk proses selanjutnya.",
  ];
  return lines.join("\n");
}

/* ─── Idempotency key ─── */

function getIdempotencyKey(snap: CalculatorSnapshot, phone: string): string {
  // Unique key per simulation + phone number
  const raw = `${snap.brand}:${snap.model}:${snap.year}:${snap.coverageType}:${snap.addOns.join(",")}:${snap.estimatedPremium}:${phone}`;
  // Simple hash to keep it short
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/* ─── Component ─── */

export function WhatsAppContactSheet({
  open,
  onClose,
  onLeadCreated,
  onWhatsAppOpened,
  calculatorSnapshot,
  whatsappTarget,
}: WhatsAppContactSheetProps) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [leadFailed, setLeadFailed] = React.useState(false);
  const [leadCode, setLeadCode] = React.useState<string | null>(null);

  // Reset form when sheet opens
  React.useEffect(() => {
    if (open) {
      setName("");
      setPhone("");
      setConsent(false);
      setIsSubmitting(false);
      setError(null);
      setLeadFailed(false);
      setLeadCode(null);
    }
  }, [open]);

  // Check if lead was already submitted for this session (idempotency via sessionStorage)
  const sessionStorageKey = React.useMemo(
    () => `jp_lead_submitted_${calculatorSnapshot.estimatedPremium}`,
    [calculatorSnapshot.estimatedPremium]
  );

  const handleSubmit = async () => {
    // ── Validate ──
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Nama minimal 2 karakter.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("Nomor WhatsApp tidak valid. Gunakan format: 08xxxxxxxxxx atau 628xxxxxxxxxx.");
      return;
    }
    if (!consent) {
      setError("Harap setujui penggunaan data untuk tindak lanjut.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setLeadFailed(false);

    const normalizedPhone = normalizePhone(phone);
    const idempotencyKey = getIdempotencyKey(calculatorSnapshot, normalizedPhone);

    // Check if we already submitted for this session
    try {
      const existing = sessionStorage.getItem(sessionStorageKey);
      if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.leadCode && parsed.phone === normalizedPhone) {
          // Already submitted — open WhatsApp with existing leadCode
          setLeadCode(parsed.leadCode);
          openWhatsApp(parsed.leadCode, trimmedName, normalizedPhone);
          setIsSubmitting(false);
          return;
        }
      }
    } catch { /* silent */ }

    // ── Build UTM data from sessionStorage attribution ──
    let utmData: Record<string, string> = {};
    try {
      const attrRaw = sessionStorage.getItem("jp_attribution");
      if (attrRaw) {
        const attr = JSON.parse(attrRaw);
        if (attr.utm_source) utmData.utm_source = attr.utm_source;
        if (attr.utm_medium) utmData.utm_medium = attr.utm_medium;
        if (attr.utm_campaign) utmData.utm_campaign = attr.utm_campaign;
        if (attr.utm_content) utmData.utm_content = attr.utm_content;
        if (attr.utm_term) utmData.utm_term = attr.utm_term;
        if (attr.gclid) utmData.gclid = attr.gclid;
      }
    } catch { /* silent */ }

    // ── POST lead ──
    try {
      const res = await fetch("/api/leads/from-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey,
          customerName: trimmedName,
          whatsappNumber: normalizedPhone,
          vehicleBrand: calculatorSnapshot.brand,
          vehicleType: calculatorSnapshot.model,
          vehicleYear: calculatorSnapshot.year,
          plateRegion: calculatorSnapshot.plate,
          vehiclePriceOtr: calculatorSnapshot.vehicleValue || null,
          coverageType: calculatorSnapshot.coverageType,
          addOns: calculatorSnapshot.addOns.length
            ? JSON.stringify(calculatorSnapshot.addOns)
            : null,
          estimatedPremium: calculatorSnapshot.estimatedPremium || null,
          originalPremium: calculatorSnapshot.originalPremium || null,
          discountAmount: calculatorSnapshot.discountAmount || null,
          adminFee: calculatorSnapshot.adminFee || null,
          policyFee: calculatorSnapshot.policyFee || null,
          selectedPartner: calculatorSnapshot.partnerName || null,
          source: "premium_calculator",
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          ...utmData,
        }),
      });

      const data = await res.json();
      let resolvedLeadCode = "";

      if (res.ok && data.success) {
        resolvedLeadCode = data.leadCode || "JP-0000";
        setLeadCode(resolvedLeadCode);

        // Save to sessionStorage for idempotency
        try {
          sessionStorage.setItem(
            sessionStorageKey,
            JSON.stringify({
              leadCode: resolvedLeadCode,
              leadId: data.leadId,
              phone: normalizedPhone,
              timestamp: Date.now(),
            })
          );
        } catch { /* silent */ }

        onLeadCreated?.(resolvedLeadCode, data.leadId);
      } else {
        // API failed — still allow WhatsApp
        setLeadFailed(true);
        console.error("Lead creation failed:", data.error);
      }
    } catch (err) {
      // Network error — still allow WhatsApp
      setLeadFailed(true);
      console.error("Lead creation error:", err);
    }

    // ── Open WhatsApp ──
    if (!leadFailed) {
      openWhatsApp(leadCode || "JP-0000", trimmedName, normalizedPhone);
    }

    setIsSubmitting(false);
  };

  const openWhatsApp = (code: string, customerName: string, customerPhone: string) => {
    const message = buildWhatsAppMessage(calculatorSnapshot, code, customerName, customerPhone);
    const cleanTarget = (whatsappTarget || "").replace(/[^\d]/g, "");
    const url = `https://wa.me/${cleanTarget}?text=${encodeURIComponent(message)}`;

    // Same-tab navigation — safest for mobile (no popup blocker issues)
    window.location.href = url;

    onWhatsAppOpened?.();
  };

  const handleForceOpenWhatsApp = () => {
    const normalizedPhone = normalizePhone(phone);
    const message = buildWhatsAppMessage(
      calculatorSnapshot,
      leadCode || "PENDING",
      name.trim(),
      normalizedPhone
    );
    const cleanTarget = (whatsappTarget || "").replace(/[^\d]/g, "");
    const url = `https://wa.me/${cleanTarget}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
    onWhatsAppOpened?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
            aria-hidden
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Lanjutkan Konsultasi"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <span className="h-1 w-10 rounded-full bg-[#CBD5E1]" aria-hidden />
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full p-1.5 text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-5 pb-6 pt-2">
              {/* Header */}
              <h2 className="text-lg font-bold text-[#0F172A] mb-1">
                Lanjutkan Konsultasi
              </h2>
              <p className="text-sm text-[#64748B] mb-5">
                Isi kontak agar tim kami dapat membantu menindaklanjuti hasil simulasi Anda.
              </p>

              {/* Lead creation failure notice */}
              {leadFailed && (
                <div className="mb-4 rounded-xl border border-[#FCD34D] bg-[#FFFBEB] p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-[#92400E] flex-shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="text-sm text-[#92400E] font-medium">
                      Data belum berhasil disimpan, tetapi Anda tetap dapat melanjutkan ke WhatsApp.
                    </p>
                    <button
                      type="button"
                      onClick={handleForceOpenWhatsApp}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] hover:text-[#0B5C55] transition-colors"
                    >
                      <Send className="h-3.5 w-3.5" aria-hidden />
                      Tetap Buka WhatsApp
                    </button>
                  </div>
                </div>
              )}

              {/* Form */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="wa-contact-name" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                    Nama
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" aria-hidden />
                    <input
                      id="wa-contact-name"
                      type="text"
                      inputMode="text"
                      autoComplete="name"
                      placeholder="Nama lengkap Anda"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(null); }}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3 pl-10 pr-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="wa-contact-phone" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" aria-hidden />
                    <input
                      id="wa-contact-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="08xxxxxxxxxx"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setError(null); }}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3 pl-10 pr-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 transition-all disabled:opacity-50"
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Format: 08xxxxxxxxxx atau 628xxxxxxxxxx
                  </p>
                </div>

                {/* Consent */}
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); setError(null); }}
                    disabled={isSubmitting}
                    className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] text-[#0F766E] focus:ring-[#0F766E] accent-[#0F766E]"
                  />
                  <span className="text-xs text-[#64748B] leading-relaxed">
                    Saya setuju data ini digunakan untuk tindak lanjut konsultasi.
                  </span>
                </label>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-[#B91C1C] flex-shrink-0 mt-0.5" aria-hidden />
                    <p className="text-sm text-[#991B1B]">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !name.trim() || !phone.trim() || !consent}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1EBE57] focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Menyimpan data...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden />
                      Lanjut ke WhatsApp
                    </>
                  )}
                </button>

                {/* Success indicator */}
                {leadCode && !leadFailed && (
                  <div className="flex items-center gap-2 text-sm text-[#0F766E] font-medium">
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Data tersimpan. Kode Lead: {leadCode}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
