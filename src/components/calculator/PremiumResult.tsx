"use client";

import * as React from "react";
import {
  ArrowLeft, CheckCircle2, AlertCircle, Loader2,
  RotateCcw, Pencil, ShieldCheck, Car, MapPin, FileText, Calculator,
  MessageCircle, Send, ChevronDown, ChevronUp,
} from "lucide-react";
import { UseCalculatorReturn } from "./useCalculator";
import { type PremiumPartner } from "./types";
import { formatIDR, formatPercent, formatRate, buildWhatsAppLink } from "@/lib/format";
import { trackEvent } from "@/lib/analytics-events";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { Button } from "@/components/site/Button";

const ADDON_LABELS: Record<string, string> = {
  flood: "Banjir",
  earthquake: "Gempa Bumi",
  srcc: "Kerusuhan",
  terrorism: "Terorisme",
  bengkelAuthorized: "Bengkel Authorised",
  tpl: "Tanggung Jawab Pihak Ketiga",
  paDriver: "Kecelakaan Diri Pengemudi",
  paPassenger: "Kecelakaan Diri Penumpang",
};

/* ═══════════════════════════════════════════════════
   Premium Result — premium number BIG at top, breakdown + partners collapsible
   ═══════════════════════════════════════════════════ */

export function PremiumResult({ calc }: { calc: UseCalculatorReturn }) {
  const { state, prevStep, reset, markWhatsappClicked } = calc;
  const { settings } = useSiteSettings();
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const [showPartners, setShowPartners] = React.useState(false);

  if (state.isLoadingPremium) return <PremiumLoading />;
  if (!state.premium) return null;

  const p = state.premium;
  const v = state.vehicle;

  const partner: PremiumPartner | null =
    state.selectedPartnerIndex !== null && p.partners[state.selectedPartnerIndex]
      ? p.partners[state.selectedPartnerIndex]
      : null;
  const displayPremium = partner?.estimatedPremium ?? p.totalPremium;

  const vehicleName = v.model.toLowerCase().startsWith(v.brand.toLowerCase())
    ? v.model
    : `${v.brand} ${v.model}`;

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
    trackEvent("whatsapp_click", {
      coverage_type: state.protection.coverageType,
      estimated_premium: displayPremium,
    });
    markWhatsappClicked();
  };

  const handleApplyClick = () => {
    trackEvent("apply_click", {
      coverage_type: state.protection.coverageType,
      estimated_premium: displayPremium,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Eligibility warning (if not eligible, show first) */}
      {p.isEligible === false && p.ineligibilityReason && (
        <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-3.5 flex items-start gap-2.5" role="alert">
          <AlertCircle className="h-5 w-5 text-[#92400E] flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="font-semibold text-[#92400E] text-sm">Kendaraan tidak memenuhi syarat</p>
            <p className="text-sm text-[#92400E] mt-0.5">{p.ineligibilityReason}</p>
          </div>
        </div>
      )}

      {/* Premium number — BIG, immediately visible */}
      <div className="text-center">
        <p className="ds-eyebrow mb-1.5">Estimasi Premi Tahunan</p>
        <p className="ds-premium-hero">
          {formatIDR(displayPremium)}
        </p>
        {partner && (
          <p className="text-xs text-[#115E59] mt-2 font-semibold">
            dari {partner.name}
          </p>
        )}
        <p className="text-xs text-[#64748B] mt-1.5">
          Nilai kendaraan {formatIDR(p.vehicleValue)}
          {p.otrRange?.display ? ` · Rentang OTR ${p.otrRange.display}` : ""}
        </p>
      </div>

      {/* Vehicle data summary — compact, single row on desktop */}
      <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        <span className="flex items-center gap-1.5 text-[#475569]">
          <Car className="h-3.5 w-3.5 text-[#0F766E]" aria-hidden />
          {vehicleName} {v.year}
        </span>
        <span className="flex items-center gap-1.5 text-[#475569]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#0F766E]" aria-hidden />
          {state.protection.coverageType === "AllRisk" ? "All Risk" : "TLO"}
        </span>
        <span className="flex items-center gap-1.5 text-[#475569]">
          <MapPin className="h-3.5 w-3.5 text-[#0F766E]" aria-hidden />
          {state.region.plate}
        </span>
        {state.extension.addOns.length > 0 && (
          <span className="flex items-center gap-1.5 text-[#475569]">
            <FileText className="h-3.5 w-3.5 text-[#0F766E]" aria-hidden />
            {state.extension.addOns.length} perluasan
          </span>
        )}
      </div>

      {/* Breakdown — collapsible */}
      <button
        type="button"
        onClick={() => setShowBreakdown((s) => !s)}
        className="flex items-center justify-between w-full py-1.5 text-sm font-semibold text-[#0F172A]"
        aria-expanded={showBreakdown}
      >
        <span className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-[#0F766E]" aria-hidden />
          Rincian Komponen Premi
        </span>
        {showBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {showBreakdown && (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex flex-col gap-2 -mt-2">
          <Row label="Premi Dasar" value={formatIDR(p.basePremium)} />
          {p.addOns.map((a) => (
            <Row key={a.key} label={`Perluasan: ${a.label}`} value={formatIDR(a.premium)} sub={`Tarif ${formatRate(a.rate)}`} />
          ))}
          <Row label="Subtotal" value={formatIDR(p.totalPremiumBeforeDiscount)} bold />
          {p.discountAmount > 0 && (
            <Row label={`Diskon (${formatPercent(p.discountPercent)})`} value={`− ${formatIDR(p.discountAmount)}`} negative />
          )}
          {p.adminFee > 0 && <Row label="Biaya Admin" value={formatIDR(p.adminFee)} />}
          {p.policyFee > 0 && <Row label="Biaya Polis" value={formatIDR(p.policyFee)} />}
          <div className="border-t border-[#E2E8F0] mt-1.5 pt-1.5">
            <Row label="Total" value={formatIDR(p.totalPremium)} bold large />
          </div>
        </div>
      )}

      {/* Partners — collapsible */}
      {p.partners.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setShowPartners((s) => !s)}
            className="flex items-center justify-between w-full py-1.5 text-sm font-semibold text-[#0F172A]"
            aria-expanded={showPartners}
          >
            <span>Estimasi dari {p.partners.length} perusahaan asuransi</span>
            {showPartners ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showPartners && (
            <div className="flex flex-col gap-1.5 -mt-2">
              {p.partners.map((partner, idx) => {
                const selected = state.selectedPartnerIndex === idx;
                return (
                  <button
                    key={partner.name}
                    type="button"
                    onClick={() => calc.selectPartner(idx)}
                    className={`
                      text-left p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-2
                      ${selected ? "border-[#0F766E] bg-[#ECFDF5]" : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"}
                    `}
                    aria-pressed={selected}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-semibold text-[#0F172A] text-sm truncate">{partner.name}</span>
                      {partner.bengkelAuthorizedExcluded && (
                        <span className="text-xs text-[#92400E]">Tanpa bengkel authorized</span>
                      )}
                    </div>
                    <span className="font-bold text-[#0F172A] text-sm whitespace-nowrap">
                      {formatIDR(partner.estimatedPremium)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* CTAs — sticky bottom of card */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#E2E8F0]">
        <Button as="external" href={whatsappLink} variant="primary" size="lg" onClick={handleApplyClick} className="w-full">
          <Send className="h-4 w-4" aria-hidden />
          Lanjutkan Pengajuan
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button as="external" href={whatsappLink} variant="secondary" size="md" onClick={handleWhatsApp}>
            <MessageCircle className="h-4 w-4" aria-hidden />
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
   Helpers
   ═══════════════════════════════════════════════════ */

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
        className={`
          ${large ? "text-base" : "text-sm"}
          ${bold ? "font-bold text-[#0F172A]" : negative ? "text-[#15803D] font-semibold" : "text-[#475569]"}
          whitespace-nowrap
        `}
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
