"use client";

import * as React from "react";
import {
  ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Loader2,
  RotateCcw, Pencil, ShieldCheck, Car, MapPin, FileText, Calculator,
  MessageCircle, Send, ChevronDown, ChevronUp,
} from "lucide-react";
import { UseCalculatorReturn } from "./useCalculator";
import { type PremiumPartner } from "./types";
import { formatIDR, formatPercent, formatRate, buildWhatsAppLink } from "@/lib/format";
import { trackEvent } from "@/lib/analytics-events";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { Button } from "@/components/site/Button";
import { Card } from "@/components/site/primitives";

/* ═══════════════════════════════════════════════════
   Premium Result — shown after calculation completes
   ═══════════════════════════════════════════════════ */

export function PremiumResult({ calc }: { calc: UseCalculatorReturn }) {
  const { state, prevStep, reset, markWhatsappClicked } = calc;
  const { settings } = useSiteSettings();
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const [showPartners, setShowPartners] = React.useState(true);

  if (state.isLoadingPremium) return <PremiumLoading />;
  if (!state.premium) return null;

  const p = state.premium;
  const v = state.vehicle;

  // Pick the display premium — partner-selected if any, else base totalPremium.
  const partner: PremiumPartner | null =
    state.selectedPartnerIndex !== null && p.partners[state.selectedPartnerIndex]
      ? p.partners[state.selectedPartnerIndex]
      : null;
  const displayPremium = partner?.estimatedPremium ?? p.totalPremium;

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
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="text-center">
        <span className="ds-badge mb-3">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          Estimasi Siap
        </span>
        <h3 className="ds-h3 mb-2">Estimasi Premi Mobil Anda</h3>
        <p className="text-sm text-[#475569]">
          Hasil simulasi berdasarkan data kendaraan dan wilayah penggunaan.
        </p>
      </div>

      {/* Big premium number */}
      <div className="rounded-2xl bg-gradient-to-b from-[#ECFDF5] to-[#FFFFFF] border border-[#A7F3D0] p-5 text-center">
        <p className="text-sm text-[#115E59] font-semibold mb-1">Estimasi Premi Tahunan</p>
        <p className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
          {formatIDR(displayPremium)}
        </p>
        {p.otrRange && (
          <p className="text-xs text-[#64748B] mt-2">
            Nilai kendaraan: {formatIDR(p.vehicleValue)}
            {p.otrRange.display ? ` · Rentang OTR: ${p.otrRange.display}` : ""}
          </p>
        )}
        {!p.otrRange && (
          <p className="text-xs text-[#64748B] mt-2">
            Nilai kendaraan: {formatIDR(p.vehicleValue)}
          </p>
        )}
        {partner && (
          <p className="text-xs text-[#115E59] mt-1">
            Estimasi dari {partner.name}
          </p>
        )}
      </div>

      {/* Eligibility warning */}
      {p.isEligible === false && p.ineligibilityReason && (
        <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 flex items-start gap-3" role="alert">
          <AlertCircle className="h-5 w-5 text-[#92400E] flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="font-semibold text-[#92400E] text-sm">Kendaraan tidak memenuhi syarat</p>
            <p className="text-sm text-[#92400E] mt-0.5">{p.ineligibilityReason}</p>
          </div>
        </div>
      )}

      {/* Data summary */}
      <div className="rounded-xl border border-[#E2E8F0] divide-y divide-[#E2E8F0]">
        <SummaryRow
          icon={<Car className="h-4 w-4" />}
          label="Kendaraan"
          value={
            v.model.toLowerCase().startsWith(v.brand.toLowerCase())
              ? `${v.model} ${v.year}`
              : `${v.brand} ${v.model} ${v.year}`
          }
        />
        <SummaryRow icon={<ShieldCheck className="h-4 w-4" />} label="Jenis Proteksi" value={state.protection.coverageType === "AllRisk" ? "All Risk (Comprehensive)" : "Total Loss Only (TLO)"} />
        <SummaryRow icon={<MapPin className="h-4 w-4" />} label="Wilayah" value={state.region.plate} />
        {state.extension.addOns.length > 0 && (
          <SummaryRow
            icon={<FileText className="h-4 w-4" />}
            label="Perluasan"
            value={state.extension.addOns.map((k) => {
              const meta = ADDON_LABELS[k];
              return meta || k;
            }).join(", ")}
          />
        )}
      </div>

      {/* Breakdown (collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setShowBreakdown((s) => !s)}
          className="w-full flex items-center justify-between text-sm font-semibold text-[#0F172A] py-2"
          aria-expanded={showBreakdown}
        >
          <span className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-[#0F766E]" aria-hidden />
            Rincian Komponen Premi
          </span>
          {showBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showBreakdown && (
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col gap-2">
            <BreakdownRow label="Premi Dasar" value={formatIDR(p.basePremium)} />
            {p.addOns.length > 0 && (
              <>
                {p.addOns.map((a) => (
                  <BreakdownRow key={a.key} label={`Perluasan: ${a.label}`} value={formatIDR(a.premium)} sub={`Tarif ${formatRate(a.rate)}`} />
                ))}
              </>
            )}
            <BreakdownRow label="Total Sebelum Diskon" value={formatIDR(p.totalPremiumBeforeDiscount)} bold />
            {p.discountAmount > 0 && (
              <BreakdownRow label={`Diskon (${formatPercent(p.discountPercent)})`} value={`- ${formatIDR(p.discountAmount)}`} negative />
            )}
            {p.adminFee > 0 && <BreakdownRow label="Biaya Administrasi" value={formatIDR(p.adminFee)} />}
            {p.policyFee > 0 && <BreakdownRow label="Biaya Polis" value={formatIDR(p.policyFee)} />}
            <div className="border-t border-[#E2E8F0] mt-2 pt-2">
              <BreakdownRow label="Total Premi" value={formatIDR(p.totalPremium)} bold large />
            </div>
          </div>
        )}
      </div>

      {/* Partner variants (collapsible) */}
      {p.partners.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowPartners((s) => !s)}
            className="w-full flex items-center justify-between text-sm font-semibold text-[#0F172A] py-2"
            aria-expanded={showPartners}
          >
            <span>Estimasi dari {p.partners.length} perusahaan asuransi</span>
            {showPartners ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showPartners && (
            <div className="flex flex-col gap-2">
              {p.partners.map((partner, idx) => {
                const selected = state.selectedPartnerIndex === idx;
                return (
                  <button
                    key={partner.name}
                    type="button"
                    onClick={() => calc.selectPartner(idx)}
                    className={`
                      text-left p-3 rounded-xl border-2 transition-all
                      ${selected ? "border-[#0F766E] bg-[#ECFDF5]" : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"}
                    `}
                    aria-pressed={selected}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-semibold text-[#0F172A] text-sm">{partner.name}</span>
                        {partner.bengkelAuthorizedExcluded && (
                          <span className="text-xs text-[#92400E]">Tanpa bengkel authorized</span>
                        )}
                      </div>
                      <span className="font-bold text-[#0F172A] text-sm whitespace-nowrap">
                        {formatIDR(partner.estimatedPremium)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-2.5">
        <Button as="external" href={whatsappLink} variant="primary" size="lg" onClick={handleApplyClick} className="w-full">
          <Send className="h-4 w-4" aria-hidden />
          Lanjutkan Pengajuan
        </Button>
        <Button as="external" href={whatsappLink} variant="secondary" size="md" onClick={handleWhatsApp} className="w-full">
          <MessageCircle className="h-4 w-4" aria-hidden />
          Konsultasikan Hasil
        </Button>
        <Button type="button" variant="ghost" size="md" onClick={prevStep} className="w-full">
          <Pencil className="h-4 w-4" aria-hidden />
          Ubah Data Kendaraan
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={reset} className="w-full text-[#64748B]">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Mulai Simulasi Baru
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-[#64748B] leading-relaxed text-center px-2">
        Hasil simulasi merupakan estimasi awal. Premi, manfaat, syarat, dan ketentuan akhir
        mengikuti proses verifikasi serta quotation dari perusahaan asuransi penerbit polis.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Premium Loading state
   ═══════════════════════════════════════════════════ */

function PremiumLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3" aria-live="polite" aria-busy="true">
      <Loader2 className="h-8 w-8 text-[#0F766E] animate-spin" aria-hidden />
      <p className="text-sm font-semibold text-[#0F172A]">Menghitung estimasi premi...</p>
      <p className="text-xs text-[#64748B]">Engine sedang memproses data kendaraan dan tarif</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════ */

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

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3.5">
      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#0F766E]">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#64748B]">{label}</p>
        <p className="text-sm font-semibold text-[#0F172A] truncate">{value}</p>
      </div>
    </div>
  );
}

function BreakdownRow({
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
  // The vehicle model often already starts with the brand (e.g. "TOYOTA 86 A/T" for brand "TOYOTA").
  // Strip the duplicate brand prefix when present.
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
