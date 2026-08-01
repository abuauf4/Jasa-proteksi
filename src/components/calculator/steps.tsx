"use client";

import * as React from "react";
import { Search, ChevronDown, AlertCircle, Car, Check } from "lucide-react";
import { UseCalculatorReturn } from "./useCalculator";
import { PLATE_OPTIONS, ADDON_META, TLO_EXCLUDED_ADDONS, ALL_ADDON_KEYS } from "./types";
import { formatIDR } from "@/lib/format";
import { BottomSheetPicker, PickerTrigger } from "./BottomSheetPicker";

/* ═══════════════════════════════════════════════════
   Step 1: Vehicle (brand + model + year + auto value, all in one view)
   ═══════════════════════════════════════════════════ */

export function VehicleStep({ calc }: { calc: UseCalculatorReturn }) {
  const { state, brands, models, updateVehicle, setShowManualOtr } = calc;
  const v = state.vehicle;
  const [brandSheet, setBrandSheet] = React.useState(false);
  const [modelSheet, setModelSheet] = React.useState(false);

  const showManualEntry = !state.vehicleFound && v.brand && v.model && v.year && !state.showManualOtr;

  return (
    <div className="flex flex-col gap-4">
      {/* Brand — bottom sheet picker (49 brands, too long for native select) */}
      <PickerTrigger
        label="Merek"
        value={v.brand}
        placeholder="Contoh: Toyota, Honda, BMW"
        onClick={() => setBrandSheet(true)}
        icon={<Car className="h-4 w-4 text-[#64748B]" aria-hidden />}
      />
      <BottomSheetPicker
        open={brandSheet}
        onClose={() => setBrandSheet(false)}
        options={brands}
        value={v.brand}
        onChange={(val) => updateVehicle({ brand: val, model: "", year: "", vehicleValue: "" })}
        title="Pilih Merek Kendaraan"
        placeholder="Cari merek..."
      />

      {/* Model — bottom sheet picker (2,434 models) */}
      <PickerTrigger
        label="Tipe"
        value={v.model}
        placeholder={v.brand ? "Contoh: Toyota 86 A/T" : "Pilih merek dulu"}
        onClick={() => v.brand && setModelSheet(true)}
        disabled={!v.brand}
      />
      <BottomSheetPicker
        open={modelSheet}
        onClose={() => setModelSheet(false)}
        options={models}
        value={v.model}
        onChange={(val) => updateVehicle({ model: val, year: "", vehicleValue: "" })}
        title="Pilih Tipe Kendaraan"
        placeholder="Cari tipe..."
      />

      {/* Year — native select (usually 10-15 options) */}
      <div>
        <span className="text-sm font-semibold text-[#0F172A] block mb-1.5">Tahun</span>
        <div className="relative">
          <select
            className="ds-input appearance-none pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            value={v.year}
            onChange={(e) => updateVehicle({ year: e.target.value })}
            disabled={!v.model}
            aria-label="Tahun kendaraan"
          >
            <option value="">{v.model ? "Pilih tahun" : "Pilih tipe dulu"}</option>
            {state.availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]"
            aria-hidden
          />
        </div>
      </div>

      {/* Hint for first-time users */}
      {!v.brand && (
        <div className="rounded-lg bg-[#F0FDFA] border border-[#A7F3D0] p-2.5 flex items-start gap-2">
          <svg className="h-3.5 w-3.5 text-[#0F766E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-[#115E59] leading-relaxed">
            <strong>Coba:</strong> Toyota → Toyota 86 A/T → 2024
          </p>
        </div>
      )}

      {/* Vehicle value — auto-populated, with manual override */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-sm font-semibold text-[#0F172A]">Nilai Kendaraan (OTR)</span>
          {state.vehicleFound && <span className="text-xs text-[#0F766E] font-semibold">Otomatis</span>}
        </div>
        {state.showManualOtr ? (
          <input
            type="text"
            inputMode="numeric"
            className="ds-input"
            placeholder="Contoh: 250000000"
            value={v.vehicleValue ? formatIDR(parseInt(v.vehicleValue, 10)) : ""}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              updateVehicle({ vehicleValue: digits });
            }}
          />
        ) : state.vehicleFound ? (
          <div className="ds-input bg-[#F8FAFC] flex items-center justify-between">
            <span className="font-bold text-[#0F172A]">
              {v.vehicleValue ? formatIDR(parseInt(v.vehicleValue, 10)) : "—"}
            </span>
            <button
              type="button"
              onClick={() => setShowManualOtr(true)}
              className="text-xs font-semibold text-[#0F766E] hover:underline"
            >
              Ubah
            </button>
          </div>
        ) : (
          <div className={`ds-input flex items-center gap-2 ${v.year ? "bg-[#FFFBEB] border-[#FDE68A]" : "bg-[#F8FAFC]"}`}>
            {v.year ? (
              <>
                <AlertCircle className="h-4 w-4 text-[#92400E] flex-shrink-0" aria-hidden />
                <span className="text-sm text-[#92400E] flex-1">Nilai tidak ditemukan di database</span>
                <button
                  type="button"
                  onClick={() => setShowManualOtr(true)}
                  className="text-xs font-semibold text-[#0F766E] hover:underline whitespace-nowrap"
                >
                  Input manual
                </button>
              </>
            ) : (
              <span className="text-sm text-[#94A3B8] flex-1">Terisi otomatis setelah pilih tahun</span>
            )}
          </div>
        )}

        {showManualEntry && (
          <button
            type="button"
            onClick={() => setShowManualOtr(true)}
            className="mt-2 text-sm font-semibold text-[#0F766E] hover:underline self-start"
          >
            Masukkan nilai OTR manual
          </button>
        )}

        {state.showManualOtr && (
          <button
            type="button"
            onClick={() => {
              setShowManualOtr(false);
              updateVehicle({ vehicleValue: "" });
            }}
            className="mt-2 text-xs text-[#64748B] hover:underline self-start"
          >
            Kembali ke otomatis
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Step 2: Coverage (region + AllRisk/TLO toggle + extension chips, all in one view)
   ═══════════════════════════════════════════════════ */

export function CoverageStep({ calc }: { calc: UseCalculatorReturn }) {
  const { state, updateRegion, updateProtection, toggleAddon } = calc;
  const isTLO = state.protection.coverageType === "TLO";

  return (
    <div className="flex flex-col gap-5">
      {/* Region — native select (~50 options, manageable) */}
      <div>
        <span className="text-sm font-semibold text-[#0F172A] block mb-1.5">Wilayah (Plat)</span>
        <div className="relative">
          <select
            className="ds-input appearance-none pr-10 cursor-pointer"
            value={state.region.plate}
            onChange={(e) => updateRegion({ plate: e.target.value })}
            aria-label="Wilayah penggunaan"
          >
            <option value="">Pilih plat nomor wilayah</option>
            {PLATE_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]"
            aria-hidden
          />
        </div>
      </div>

      {/* Protection type — 2 toggle cards side by side */}
      <div>
        <span className="text-sm font-semibold text-[#0F172A] block mb-1.5">Jenis Perlindungan</span>
        <div className="grid grid-cols-2 gap-2">
          <label
            className={`ds-toggle-card ${state.protection.coverageType === "AllRisk" ? "" : ""}`}
            data-active={state.protection.coverageType === "AllRisk"}
          >
            <input
              type="radio"
              name="coverage-type"
              value="AllRisk"
              checked={state.protection.coverageType === "AllRisk"}
              onChange={() => updateProtection({ coverageType: "AllRisk" })}
              className="sr-only"
            />
            <span className="font-bold text-[#0F172A] text-base">All Risk</span>
            <span className="text-xs text-[#475569] leading-snug">Komprehensif</span>
          </label>
          <label
            className="ds-toggle-card"
            data-active={state.protection.coverageType === "TLO"}
          >
            <input
              type="radio"
              name="coverage-type"
              value="TLO"
              checked={state.protection.coverageType === "TLO"}
              onChange={() => updateProtection({ coverageType: "TLO" })}
              className="sr-only"
            />
            <span className="font-bold text-[#0F172A] text-base">TLO</span>
            <span className="text-xs text-[#475569] leading-snug">Total Loss Only</span>
          </label>
        </div>
      </div>

      {/* Extensions — compact chips */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm font-semibold text-[#0F172A]">Perluasan</span>
          <span className="text-xs text-[#64748B]">Opsional</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_ADDON_KEYS.map((key) => {
            const meta = ADDON_META[key];
            if (!meta) return null;
            const isOn = state.extension.addOns.includes(key);
            const isExcluded = isTLO && TLO_EXCLUDED_ADDONS.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => !isExcluded && toggleAddon(key)}
                disabled={isExcluded}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all border min-h-[44px]
                  ${isExcluded
                    ? "bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed"
                    : isOn
                    ? "bg-[#0F766E] text-white border-[#0F766E]"
                    : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }
                `}
                aria-pressed={isOn}
              >
                <span className="flex items-center gap-1.5">
                  {isOn && <Check className="h-3.5 w-3.5" aria-hidden />}
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
        {isTLO && (
          <p className="text-xs text-[#92400E] mt-2">Bengkel Authorised tidak tersedia untuk TLO</p>
        )}
      </div>
    </div>
  );
}
