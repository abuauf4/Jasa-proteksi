"use client";

import * as React from "react";
import {
  CheckCircle2, AlertCircle, Loader2, RotateCcw, Pencil,
  ShieldCheck, Car, MapPin, Send, ChevronDown, ChevronUp, ChevronRight,
  User, Phone,
} from "lucide-react";
import { UseCalculatorReturn } from "./useCalculator";
import { type PremiumPartner, partnerLogoPath, getPartnerLogoScale, ADDON_META, TLO_EXCLUDED_ADDONS, ALL_ADDON_KEYS } from "./types";
import { useCountUp } from "./useCountUp";
import { formatIDR, formatPercent, formatRate, buildWhatsAppLink } from "@/lib/format";
import { trackEvent } from "@/lib/analytics-events";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { Button } from "@/components/site/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

/* ═══════════════════════════════════════════════════
   Premium Result — canggih dengan partner grid + coverage toggle + perluasan scroll
   ═══════════════════════════════════════════════════ */

export function PremiumResult({ calc }: { calc: UseCalculatorReturn }) {
  const { state, prevStep, reset, markWhatsappClicked, updateProtection, toggleAddon } = calc;
  const { settings } = useSiteSettings();

  const p = state.premium;
  const partner: PremiumPartner | null =
    state.selectedPartnerIndex !== null && p?.partners[state.selectedPartnerIndex]
      ? p.partners[state.selectedPartnerIndex]
      : null;
  const displayPremium = partner?.estimatedPremium ?? p?.totalPremium ?? 0;

  // Count-up animation for premium reveal.
  // On initial result mount (from navigation), show final value directly — no animation.
  // Animation only for subsequent changes (partner switch, addon toggle).
  const [hasShownInitial] = React.useState(() => {
    // If premium already exists on mount, this is a hydration — skip animation
    return !!state.premium;
  });
  const animatedPremium = useCountUp(displayPremium, 900, !hasShownInitial);

  // Sort partners by cheapest
  const sortedPartners = React.useMemo(() => {
    if (!p?.partners) return [];
    const partners = p.partners;
    return [...partners]
      .map((partner, originalIdx) => ({ partner, originalIdx }))
      .sort((a, b) => a.partner.estimatedPremium - b.partner.estimatedPremium);
  }, [p?.partners]);

  if (state.isLoadingPremium) return <PremiumLoading />;
  if (!p) return null;

  const v = state.vehicle;

  const vehicleName = v.model.toLowerCase().startsWith(v.brand.toLowerCase())
    ? v.model
    : `${v.brand} ${v.model}`;

  // Filter addons by coverage type + partner availability + bengkel resmi eligibility
  const isTLO = state.protection.coverageType === "TLO";
  const availableAddons = ALL_ADDON_KEYS.filter((key) => {
    // Exclude bengkelAuthorized for TLO
    if (isTLO && TLO_EXCLUDED_ADDONS.includes(key)) return false;
    // If partner selected, filter by partner.availableAddOns + bengkel exclusion
    if (partner?.availableAddOns && !partner.availableAddOns.includes(key)) return false;
    // If partner selected and bengkel resmi excluded for this partner (vehicle too old), hide it
    if (key === "bengkelAuthorized" && partner?.bengkelAuthorizedExcluded) return false;
    // If no partner selected, check if ALL partners would exclude bengkel (vehicle age > 10 = max)
    if (key === "bengkelAuthorized" && !partner && p.vehicleAge && p.vehicleAge > 10) return false;
    return true;
  });

  const whatsappMessage = buildWhatsAppMessage({
    brand: v.brand,
    model: v.model,
    year: v.year,
    plate: state.region.plate,
    coverageType: state.protection.coverageType,
    addOns: state.extension.addOns,
    estimatedPremium: displayPremium,
    partnerName: partner?.name,
  });
  const whatsappLink = buildWhatsAppLink(settings.whatsapp, whatsappMessage);

  const handleWhatsApp = () => {
    trackEvent("whatsapp_click", { coverage_type: state.protection.coverageType, estimated_premium: displayPremium });
    markWhatsappClicked();
  };

  // Lead form dialog state
  const [showLeadDialog, setShowLeadDialog] = React.useState(false);
  const [leadForm, setLeadForm] = React.useState({ customerName: "", whatsappNumber: "" });
  const [isSubmittingLead, setIsSubmittingLead] = React.useState(false);
  const [leadFormError, setLeadFormError] = React.useState<string | null>(null);

  const handleApplyClick = () => {
    trackEvent("apply_click", { coverage_type: state.protection.coverageType, estimated_premium: displayPremium });
    // Show the lead form dialog instead of going directly to WhatsApp
    setShowLeadDialog(true);
    setLeadFormError(null);
  };

  const handleLeadSubmit = async () => {
    // Validate name
    if (!leadForm.customerName.trim()) {
      setLeadFormError("Nama wajib diisi.");
      return;
    }
    // Validate WhatsApp number
    const cleanPhone = leadForm.whatsappNumber.replace(/[\s\-+]/g, "");
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      setLeadFormError("Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx atau 628xxxxxxxxxx.");
      return;
    }
    setLeadFormError(null);
    setIsSubmittingLead(true);

    try {
      // Update calculator state with personal data so submitLead can use it
      calc.updatePersonal({ customerName: leadForm.customerName.trim(), whatsappNumber: cleanPhone });

      // Submit lead to admin (creates InsuranceLead + Lead records)
      const success = await calc.submitLead();
      if (!success) {
        setLeadFormError("Gagal mengirim data. Silakan coba lagi.");
        setIsSubmittingLead(false);
        return;
      }

      // Close dialog and open WhatsApp
      setShowLeadDialog(false);
      trackEvent("lead_submit_whatsapp", { coverage_type: state.protection.coverageType, estimated_premium: displayPremium });
      markWhatsappClicked();
      window.open(whatsappLink, "_blank", "noopener");
    } catch {
      setLeadFormError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Re-calculate when coverage type or addons change — handled by useEffect in useCalculator
  const handleCoverageChange = (newCoverage: "AllRisk" | "TLO") => {
    if (newCoverage === state.protection.coverageType) return;
    updateProtection({ coverageType: newCoverage });
    // useEffect in useCalculator will auto re-calculate
  };

  const handleAddonToggle = (key: string) => {
    toggleAddon(key);
    // useEffect in useCalculator will auto re-calculate
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Card 1: Data Kendaraan */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <h3 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Car className="h-4 w-4 text-[#0F766E]" aria-hidden />
          Data Kendaraan
        </h3>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <div>
            <dt className="text-xs text-[#64748B]">Merek</dt>
            <dd className="font-semibold text-[#0F172A]">{v.brand}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#64748B]">Tipe</dt>
            <dd className="font-semibold text-[#0F172A] truncate">{v.model}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#64748B]">Tahun</dt>
            <dd className="font-semibold text-[#0F172A]">{v.year}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#64748B]">Wilayah</dt>
            <dd className="font-semibold text-[#0F172A]">{state.region.plate}</dd>
          </div>
        </dl>
      </div>

      {/* Card 2: Estimasi Premi + Harga Kendaraan (OTR) — minimal */}
      <div className="rounded-2xl bg-gradient-to-b from-[#ECFDF5] to-[#FFFFFF] border-2 border-[#A7F3D0] p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E]">Estimasi Premi Tahunan</p>
          {state.isRecalculating && (
            <span className="inline-flex items-center gap-1 text-[10px] text-[#64748B] font-medium">
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              Menghitung ulang...
            </span>
          )}
        </div>
        <p className={`ds-premium-hero transition-opacity duration-200 ${state.isRecalculating ? "opacity-60" : "opacity-100"}`}>
          {formatIDR(animatedPremium)}
        </p>
        {partner && (
          <div className="flex items-center justify-center gap-2 mt-2">
            {partnerLogoPath(partner.name) && (
              <img
                src={partnerLogoPath(partner.name)}
                alt={`Logo ${partner.name}`}
                className="h-5 w-auto object-contain"
                loading="lazy"
              />
            )}
            <span className="text-xs text-[#115E59] font-semibold">dari {partner.name}</span>
          </div>
        )}
        <div className="mt-3 pt-3 border-t border-[#A7F3D0]">
          <p className="text-xs text-[#64748B]">Harga Kendaraan (OTR)</p>
          <p className="text-lg font-bold text-[#0F172A]">{formatIDR(p.vehicleValue)}</p>
        </div>
      </div>

      {/* Partner Logo Grid — 4 cols × 2 rows, normalized logo sizes */}
      <div>
        <p className="text-sm font-bold text-[#0F172A] mb-2">Pilih Perusahaan Asuransi</p>
        <div className="grid grid-cols-4 gap-2">
          {sortedPartners.map(({ partner: pt, originalIdx }, rankIdx) => {
            const selected = state.selectedPartnerIndex === originalIdx;
            const logo = partnerLogoPath(pt.name);
            const isCheapest = rankIdx === 0;
            const scale = getPartnerLogoScale(pt.name);
            return (
              <button
                key={pt.name}
                type="button"
                onClick={() => calc.selectPartner(originalIdx)}
                className={`
                  relative aspect-square rounded-2xl border-2 flex items-center justify-center transition-all
                  ${selected
                    ? "border-[#0F766E] bg-[#ECFDF5] shadow-sm"
                    : isCheapest
                    ? "border-[#FCD34D] bg-white hover:shadow-sm"
                    : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"}
                `}
                aria-pressed={selected}
                aria-label={`Pilih ${pt.name}`}
              >
                {isCheapest && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-[#F59E0B] text-white text-[9px] font-bold uppercase tracking-wider whitespace-nowrap z-10">
                    Termurah
                  </span>
                )}
                {logo ? (
                  <div className="flex h-9 w-16 items-center justify-center overflow-visible">
                    <img
                      src={logo}
                      alt={pt.name}
                      width={96}
                      height={48}
                      className="h-auto max-h-full w-auto max-w-full object-contain"
                      style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "center",
                        opacity: selected ? 1 : 0.75,
                      }}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <span className="text-sm font-bold text-[#475569]">{pt.name.charAt(0)}</span>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[#64748B] mt-1.5 text-center">Klik logo untuk ganti partner — premi di atas otomatis update</p>
      </div>

      {/* Jenis Perlindungan — bagi 2 di 1 baris (TLO, All Risk) */}
      <div>
        <p className="text-sm font-bold text-[#0F172A] mb-2">Jenis Perlindungan</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleCoverageChange("AllRisk")}
            className={`ds-toggle-card ${state.protection.coverageType === "AllRisk" ? "" : ""}`}
            data-active={state.protection.coverageType === "AllRisk"}
          >
            <span className="font-bold text-[#0F172A] text-base">All Risk</span>
            <span className="text-xs text-[#475569] leading-snug">Komprehensif</span>
          </button>
          <button
            type="button"
            onClick={() => handleCoverageChange("TLO")}
            className="ds-toggle-card"
            data-active={state.protection.coverageType === "TLO"}
          >
            <span className="font-bold text-[#0F172A] text-base">TLO</span>
            <span className="text-xs text-[#475569] leading-snug">Total Loss Only</span>
          </button>
        </div>
      </div>

      {/* Perluasan — horizontal scroll, filter by partner + coverage */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-sm font-bold text-[#0F172A]">Perluasan</p>
          <span className="text-xs text-[#64748B]">Opsional</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "thin" }}>
          {availableAddons.map((key) => {
            const meta = ADDON_META[key];
            if (!meta) return null;
            const isOn = state.extension.addOns.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleAddonToggle(key)}
                className={`
                  flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all border min-h-[44px] whitespace-nowrap
                  ${isOn
                    ? "bg-[#0F766E] text-white border-[#0F766E]"
                    : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]"}
                `}
                aria-pressed={isOn}
              >
                {isOn && <CheckCircle2 className="h-3.5 w-3.5 inline mr-1" aria-hidden />}
                {meta.label}
              </button>
            );
          })}
          {availableAddons.length === 0 && (
            <p className="text-xs text-[#64748B]">Tidak ada perluasan tersedia untuk pilihan ini.</p>
          )}
        </div>
        {isTLO && (
          <p className="text-xs text-[#92400E] mt-1">Bengkel Resmi tidak tersedia untuk TLO</p>
        )}
      </div>

      {/* Rincian — di paling bawah setelah perluasan */}
      <RincianSection calc={calc} partner={partner} displayPremium={displayPremium} />

      {/* CTAs */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#E2E8F0]">
        <Button type="button" variant="primary" size="lg" onClick={handleApplyClick} className="w-full">
          <Send className="h-4 w-4" aria-hidden />
          Lanjutkan Pengajuan
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button as="external" href={whatsappLink} variant="secondary" size="md" onClick={handleWhatsApp}>
            Konsultasi
          </Button>
          <Button type="button" variant="secondary" size="md" onClick={prevStep}>
            <Pencil className="h-4 w-4" aria-hidden />
            Ubah Data
          </Button>
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-xs text-[#64748B] hover:text-[#0F172A] mt-1 self-center"
        >
          Mulai simulasi baru
        </button>
      </div>

      {/* Lead Form Dialog */}
      <Dialog open={showLeadDialog} onOpenChange={(open) => { if (!isSubmittingLead) setShowLeadDialog(open); }}>
        <DialogContent showCloseButton={!isSubmittingLead} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-left">Lanjutkan Pengajuan</DialogTitle>
            <DialogDescription className="text-left">
              Isi data Anda untuk melanjutkan pengajuan ke WhatsApp. Data akan tersimpan di sistem kami.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {/* Nama */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lead-name" className="text-sm font-semibold text-[#0F172A]">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" aria-hidden />
                <input
                  id="lead-name"
                  type="text"
                  placeholder="Masukkan nama Anda"
                  value={leadForm.customerName}
                  onChange={(e) => setLeadForm((f) => ({ ...f, customerName: e.target.value }))}
                  disabled={isSubmittingLead}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E] disabled:opacity-50"
                  autoFocus
                />
              </div>
            </div>
            {/* WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lead-wa" className="text-sm font-semibold text-[#0F172A]">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" aria-hidden />
                <input
                  id="lead-wa"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={leadForm.whatsappNumber}
                  onChange={(e) => setLeadForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
                  disabled={isSubmittingLead}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E] disabled:opacity-50"
                />
              </div>
            </div>
            {/* Error */}
            {leadFormError && (
              <div className="flex items-start gap-2 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-2.5">
                <AlertCircle className="h-4 w-4 text-[#B91C1C] flex-shrink-0 mt-0.5" aria-hidden />
                <p className="text-sm text-[#991B1B]">{leadFormError}</p>
              </div>
            )}
            {/* Submit */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleLeadSubmit}
              disabled={isSubmittingLead}
              className="w-full mt-1"
            >
              {isSubmittingLead ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Send className="h-4 w-4" aria-hidden />
              )}
              {isSubmittingLead ? "Mengirim..." : "Kirim & Buka WhatsApp"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disclaimer */}
      <p className="text-xs text-[#64748B] leading-relaxed text-center">
        Hasil simulasi adalah estimasi awal. Premi, manfaat, syarat, dan ketentuan akhir
        mengikuti quotation dari perusahaan asuransi penerbit polis.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Premium Loading state
   ═══════════════════════════════════════════════════ */

function PremiumLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3" aria-live="polite" aria-busy="true">
      <Loader2 className="h-7 w-7 text-[#0F766E] animate-spin" aria-hidden />
      <p className="text-sm font-semibold text-[#0F172A]">Menghitung estimasi premi...</p>
      <p className="text-xs text-[#64748B]">Engine memproses data kendaraan & tarif</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Rincian Section — collapsible breakdown di paling bawah
   ═══════════════════════════════════════════════════ */

function RincianSection({
  calc,
  partner,
  displayPremium,
}: {
  calc: UseCalculatorReturn;
  partner: PremiumPartner | null;
  displayPremium: number;
}) {
  const { state } = calc;
  const p = state.premium;
  const [showPartners, setShowPartners] = React.useState(false);

  if (!p) return null;

  // Use partner breakdown if available, else global
  const bd = partner?.breakdown;
  const basePremium = bd?.basePremium ?? p.basePremium;
  const addons = bd?.addons ?? p.addOns;
  const subtotal = bd?.totalPremiumBeforeDiscount ?? p.totalPremiumBeforeDiscount;
  const discount = bd?.discountAmount ?? p.discountAmount;
  const discountPercent = bd?.discountPercent ?? p.discountPercent;
  const adminFee = bd?.adminFee ?? p.adminFee;
  const policyFee = bd?.policyFee ?? p.policyFee;

  return (
    <div>
      <p className="text-sm font-bold text-[#0F172A] mb-2">Rincian Premi</p>
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex flex-col gap-2">
        <Row label="Premi Dasar" value={formatIDR(basePremium)} />
        {addons.map((a) => (
          <Row
            key={a.key}
            label={`Perluasan: ${a.label}`}
            value={formatIDR(a.premium)}
            sub={a.rate ? `Tarif ${formatRate(a.rate)}` : undefined}
          />
        ))}
        <Row label="Subtotal" value={formatIDR(subtotal)} bold />
        {discount > 0 && (
          <Row label={`Diskon (${formatPercent(discountPercent)})`} value={`− ${formatIDR(discount)}`} negative />
        )}
        <Row label="Biaya Admin" value={formatIDR(adminFee)} />
        {policyFee > 0 && <Row label="Biaya Polis" value={formatIDR(policyFee)} />}
        <div className="border-t border-[#E2E8F0] mt-2 pt-2">
          <Row label="Total" value={formatIDR(displayPremium)} bold large />
        </div>

        {/* Partner comparison toggle */}
        {p.partners.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setShowPartners((v) => !v)}
              className="w-full flex items-center justify-between text-sm font-semibold text-[#0F172A] py-2 mt-2 border-t border-[#E2E8F0]"
              aria-expanded={showPartners}
            >
              <span>Estimasi dari {p.partners.length} perusahaan</span>
              {showPartners ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showPartners && (
              <div className="flex flex-col gap-1.5 mt-1">
                {p.partners.map((pt, idx) => {
                  const selected = state.selectedPartnerIndex === idx;
                  return (
                    <button
                      key={pt.name}
                      type="button"
                      onClick={() => calc.selectPartner(idx)}
                      className={`text-left p-2.5 rounded-lg border-2 transition-all flex items-center justify-between gap-2 ${
                        selected ? "border-[#0F766E] bg-[#ECFDF5]" : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
                      }`}
                      aria-pressed={selected}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {partnerLogoPath(pt.name) && (
                          <img
                            src={partnerLogoPath(pt.name)}
                            alt={pt.name}
                            className="h-6 w-auto object-contain flex-shrink-0"
                            loading="lazy"
                          />
                        )}
                        <span className="text-xs font-semibold text-[#0F172A] truncate">{pt.name}</span>
                      </div>
                      <span className="text-sm font-bold text-[#0F172A] whitespace-nowrap">
                        {formatIDR(pt.estimatedPremium)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  sub,
  bold,
  large,
  negative,
}: {
  label: string;
  value: string;
  sub?: string;
  bold?: boolean;
  large?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="flex flex-col">
        <span className={`text-sm ${bold ? "font-semibold text-[#0F172A]" : "text-[#475569]"}`}>
          {label}
        </span>
        {sub && <span className="text-xs text-[#94A3B8]">{sub}</span>}
      </div>
      <span
        className={`${large ? "text-base" : "text-sm"} ${
          bold ? "font-bold text-[#0F172A]" : negative ? "text-[#15803D] font-semibold" : "text-[#475569]"
        } whitespace-nowrap`}
      >
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   WhatsApp message builder
   ═══════════════════════════════════════════════════ */

interface WhatsAppMessageInput {
  brand: string;
  model: string;
  year: string;
  plate: string;
  coverageType: "AllRisk" | "TLO";
  addOns: string[];
  estimatedPremium: number;
  partnerName?: string;
}

function buildWhatsAppMessage(input: WhatsAppMessageInput): string {
  const coverageLabel = input.coverageType === "AllRisk" ? "All Risk" : "TLO";
  const addonLabels = input.addOns.map((k) => ADDON_LABELS[k] || k);
  const vehicleName = input.model.toLowerCase().startsWith(input.brand.toLowerCase())
    ? input.model
    : `${input.brand} ${input.model}`;
  const lines = [
    "Halo Jasa Proteksi, saya sudah melakukan simulasi premi.",
    "",
    `Kendaraan: ${vehicleName}`,
    `Tahun: ${input.year}`,
    `Wilayah: ${input.plate}`,
    `Proteksi: ${coverageLabel}`,
    ...(addonLabels.length ? [`Perluasan: ${addonLabels.join(", ")}`] : []),
    `Estimasi Premi: ${formatIDR(input.estimatedPremium)}`,
    ...(input.partnerName ? [`Perusahaan: ${input.partnerName}`] : []),
    "",
    "Saya ingin mengetahui quotation dan proses selanjutnya.",
  ];
  return lines.join("\n");
}
