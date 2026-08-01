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
            <div className="flex flex-col gap-2 -mt-2">
              {p.partners.map((partner, idx) => {
                const selected = state.selectedPartnerIndex === idx;
                const vehicleAge = p.vehicleAge ?? 0;
                const hasBengkelExcluded = partner.bengkelAuthorizedExcluded === true;
                return (
                  <PartnerCard
                    key={partner.name}
                    partner={partner}
                    selected={selected}
                    vehicleAge={vehicleAge}
                    hasBengkelAddon={state.extension.addOns.includes("bengkelAuthorized")}
                    onSelect={() => calc.selectPartner(idx)}
                  />
                );
              })}
              <p className="text-xs text-[#64748B] mt-1 px-1 leading-relaxed">
                Setiap perusahaan asuransi menerapkan tarif, biaya admin, dan aturan bengkel resmi yang berbeda.
                Pilih partner untuk melanjutkan pengajuan ke perusahaan tersebut.
              </p>
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
   Partner Card — exposes per-partner rules (adminFee, bengkel restriction, breakdown)
   ═══════════════════════════════════════════════════ */

interface PartnerCardProps {
  partner: PremiumPartner;
  selected: boolean;
  vehicleAge: number;
  hasBengkelAddon: boolean;
  onSelect: () => void;
}

function PartnerCard({ partner, selected, vehicleAge, hasBengkelAddon, onSelect }: PartnerCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const bd = partner.breakdown;
  const hasBengkelExcluded = partner.bengkelAuthorizedExcluded === true;

  return (
    <div
      className={`
        rounded-xl border-2 transition-all overflow-hidden
        ${selected ? "border-[#0F766E] bg-[#ECFDF5]" : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"}
      `}
    >
      {/* Header row — clickable to select + expand */}
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={onSelect}
          className="flex-1 flex items-center justify-between gap-2 p-3 text-left min-h-[56px]"
          aria-pressed={selected}
          aria-label={`Pilih ${partner.name}`}
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-semibold text-[#0F172A] text-sm truncate">{partner.name}</span>
            {selected && (
              <span className="text-xs text-[#0F766E] font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" aria-hidden /> Dipilih
              </span>
            )}
          </div>
          <span className="font-bold text-[#0F172A] text-sm whitespace-nowrap">
            {formatIDR(partner.estimatedPremium)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="px-3 border-l border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] flex items-center"
          aria-label={expanded ? "Tutup detail" : "Buka detail"}
          aria-expanded={expanded}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Rule chips — always visible */}
      <div className="px-3 pb-2 flex flex-wrap gap-1.5">
        <span className="ds-chip">
          Admin <strong className="text-[#0F172A] ml-0.5">{formatIDR(partner.adminFee)}</strong>
        </span>
        {hasBengkelExcluded ? (
          <span className="ds-chip" style={{ background: "#FEF2F2", color: "#991B1B", borderColor: "#FCA5A5" }}>
            <AlertCircle className="h-3 w-3" aria-hidden />
            Bengkel resmi tidak tersedia
          </span>
        ) : (
          <span className="ds-chip-teal ds-chip">
            <ShieldCheck className="h-3 w-3" aria-hidden />
            Bengkel resmi {partner.bengkelResmiRate ? `· ${(partner.bengkelResmiRate * 100).toFixed(2)}%` : "tersedia"}
          </span>
        )}
      </div>

      {/* Expanded detail — per-partner breakdown */}
      {expanded && bd && (
        <div className="px-3 pb-3 pt-1 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          {/* Bengkel restriction reason */}
          {hasBengkelExcluded && (
            <div className="rounded-lg bg-[#FFFBEB] border border-[#FDE68A] p-2.5 mb-2 mt-2">
              <p className="text-xs text-[#92400E] leading-relaxed">
                <strong>Bengkel Authorised tidak tersedia</strong> untuk {partner.name} karena
                usia kendaraan ({vehicleAge} tahun) melebihi batas maksimal yang ditetapkan
                partner ini.
                {hasBengkelAddon && (
                  <span className="block mt-1">
                    Perluasan bengkel authorized yang lu pilih akan otomatis dihapus dari
                    estimasi partner ini.
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Per-partner premium breakdown */}
          <div className="flex flex-col gap-1.5 mt-2">
            <Row label="Premi dasar (setelah modifier)" value={formatIDR(bd.basePremium)} sub={`Modifier ×${partner.modifier.toFixed(2)}`} />
            {bd.addons.length > 0 && bd.addons.map((a) => {
              // Show bengkelAuthorized rate explicitly when partner-specific
              const isBengkelAddon = a.key === "bengkelAuthorized";
              const rateLabel = isBengkelAddon && a.rate
                ? `Tarif ${(a.rate * 100).toFixed(2)}%`
                : undefined;
              return (
                <Row
                  key={a.key}
                  label={`Perluasan: ${a.label}`}
                  value={formatIDR(a.premium)}
                  sub={rateLabel}
                />
              );
            })}
            <Row label="Subtotal" value={formatIDR(bd.totalPremiumBeforeDiscount)} bold />
            {bd.discountAmount > 0 && (
              <Row label={`Diskon (${bd.discountPercent}%)`} value={`− ${formatIDR(bd.discountAmount)}`} negative />
            )}
            <Row label="Biaya admin" value={formatIDR(bd.adminFee)} />
            {bd.policyFee !== undefined && bd.policyFee > 0 && (
              <Row label="Biaya polis" value={formatIDR(bd.policyFee)} />
            )}
            <div className="border-t border-[#E2E8F0] mt-1 pt-1.5">
              <Row label="Total" value={formatIDR(partner.estimatedPremium)} bold large />
            </div>
          </div>

          {/* Benefits & facilities */}
          {partner.benefits.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-[#0F172A] mb-1">Manfaat</p>
              <ul className="flex flex-col gap-0.5">
                {partner.benefits.map((b) => (
                  <li key={b} className="text-xs text-[#475569] flex items-start gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-[#0F766E] mt-0.5 flex-shrink-0" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {partner.facilities.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-[#0F172A] mb-1">Fasilitas</p>
              <ul className="flex flex-col gap-0.5">
                {partner.facilities.map((f) => (
                  <li key={f} className="text-xs text-[#475569] flex items-start gap-1.5">
                    <span className="text-[#0F766E] mt-0.5">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
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
