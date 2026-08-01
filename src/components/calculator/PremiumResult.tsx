"use client";

import * as React from "react";
import {
  CheckCircle2, AlertCircle, Loader2, RotateCcw, Pencil,
  ShieldCheck, Car, MapPin, Send, ChevronDown, ChevronUp, ChevronRight,
} from "lucide-react";
import { UseCalculatorReturn } from "./useCalculator";
import { type PremiumPartner, partnerLogoPath, ADDON_META, TLO_EXCLUDED_ADDONS, ALL_ADDON_KEYS } from "./types";
import { useCountUp } from "./useCountUp";
import { formatIDR, buildWhatsAppLink } from "@/lib/format";
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

  // Count-up animation for premium reveal
  const animatedPremium = useCountUp(displayPremium, 900);

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

  // Filter addons by coverage type + partner availability
  const isTLO = state.protection.coverageType === "TLO";
  const availableAddons = ALL_ADDON_KEYS.filter((key) => {
    // Exclude bengkelAuthorized for TLO
    if (isTLO && TLO_EXCLUDED_ADDONS.includes(key)) return false;
    // If partner selected, filter by partner.availableAddOns
    if (partner?.availableAddOns && !partner.availableAddOns.includes(key)) return false;
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

  const handleApplyClick = () => {
    trackEvent("apply_click", { coverage_type: state.protection.coverageType, estimated_premium: displayPremium });
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
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E] mb-1">Estimasi Premi Tahunan</p>
        <p className="ds-premium-hero">
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

      {/* Partner Logo Grid — 4 cols × 2 rows = 8 logos */}
      <div>
        <p className="text-sm font-bold text-[#0F172A] mb-2">Pilih Perusahaan Asuransi</p>
        <div className="grid grid-cols-4 gap-2">
          {sortedPartners.map(({ partner: pt, originalIdx }, rankIdx) => {
            const selected = state.selectedPartnerIndex === originalIdx;
            const logo = partnerLogoPath(pt.name);
            const isCheapest = rankIdx === 0;
            return (
              <button
                key={pt.name}
                type="button"
                onClick={() => calc.selectPartner(originalIdx)}
                className={`
                  relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all
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
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-[#F59E0B] text-white text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                    Termurah
                  </span>
                )}
                {logo ? (
                  <img
                    src={logo}
                    alt={pt.name}
                    className={`max-h-10 max-w-full object-contain transition-opacity ${selected ? "opacity-100" : "opacity-70"}`}
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs font-bold text-[#475569]">{pt.name.charAt(0)}</span>
                )}
                <span className="text-[10px] font-semibold text-[#0F172A] mt-1 text-center leading-tight">
                  {formatIDR(pt.estimatedPremium)}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[#64748B] mt-1.5 text-center">Diurutkan dari premi termurah</p>
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
          <p className="text-xs text-[#92400E] mt-1">Bengkel Authorised tidak tersedia untuk TLO</p>
        )}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#E2E8F0]">
        <Button as="external" href={whatsappLink} variant="primary" size="lg" onClick={handleApplyClick} className="w-full">
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
