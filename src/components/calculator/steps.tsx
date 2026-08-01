"use client";

import * as React from "react";
import { Search, ChevronDown, AlertCircle, Car, Check, CheckCircle2, Calendar, MapPin, Wallet } from "lucide-react";
import { UseCalculatorReturn } from "./useCalculator";
import { PLATE_OPTIONS, ADDON_META, TLO_EXCLUDED_ADDONS, ALL_ADDON_KEYS } from "./types";
import { formatIDR } from "@/lib/format";
import { BottomSheetPicker, PickerTrigger } from "./BottomSheetPicker";

/* ═══════════════════════════════════════════════════
   Step 1: Vehicle (brand + model + year + auto value, all in one view)
   ═══════════════════════════════════════════════════ */

export function VehicleStep({ calc, submitted = false }: { calc: UseCalculatorReturn; submitted?: boolean }) {
  const { state, brands, models, updateVehicle, setShowManualOtr } = calc;
  const v = state.vehicle;
  const [brandSheet, setBrandSheet] = React.useState(false);
  const [modelSheet, setModelSheet] = React.useState(false);

  const showManualEntry = !state.vehicleFound && v.brand && v.model && v.year && !state.showManualOtr;

  // Show red only if user has attempted to proceed AND field is empty
  const brandInvalid = submitted && !v.brand;
  const modelInvalid = submitted && !v.model;
  const yearInvalid = submitted && !v.year;

  return (
    <div className="flex flex-col gap-3">
      {/* Brand — bottom sheet picker */}
      <PickerTrigger
        label="Merek mobil"
        value={v.brand}
        placeholder="Pilih merek"
        onClick={() => setBrandSheet(true)}
        invalid={brandInvalid}
        icon={<Car className="h-4 w-4" aria-hidden />}
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

      {/* Model — bottom sheet picker */}
      <PickerTrigger
        label="Tipe mobil"
        value={v.model}
        placeholder={v.brand ? "Pilih tipe" : "Pilih merek dulu"}
        onClick={() => v.brand && setModelSheet(true)}
        disabled={!v.brand}
        invalid={modelInvalid && !!v.brand}
        icon={<Car className="h-4 w-4" aria-hidden />}
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

      {/* Year — native select with icon */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-sm font-semibold text-[#0F172A]">Tahun keluaran</span>
          {yearInvalid && <span className="text-xs text-[#B91C1C] font-semibold">Wajib</span>}
        </div>
        <div className="relative">
          <div className={`ds-input flex items-center gap-2.5 pr-10 ${yearInvalid ? "!border-[#B91C1C] !bg-[#FEF2F2]" : ""}`}>
            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${yearInvalid ? "bg-[#FEE2E2] text-[#B91C1C]" : "bg-[#ECFDF5] text-[#0F766E]"}`}>
              <Calendar className="h-4 w-4" aria-hidden />
            </span>
            <select
              className={`flex-1 bg-transparent border-0 outline-none cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed text-[16px] ${v.year ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
              value={v.year}
              onChange={(e) => updateVehicle({ year: e.target.value })}
              disabled={!v.model}
              aria-label="Tahun keluaran"
              aria-invalid={yearInvalid || undefined}
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
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Step 2: Coverage (region + AllRisk/TLO toggle + extension chips, all in one view)
   ═══════════════════════════════════════════════════ */

export function CoverageStep({ calc, submitted = false }: { calc: UseCalculatorReturn; submitted?: boolean }) {
  const { state, updateRegion, updateVehicle, setShowManualOtr } = calc;
  const v = state.vehicle;
  const plateInvalid = submitted && !state.region.plate;
  const valueInvalid = submitted && !v.vehicleValue;
  const showManualEntry = !state.vehicleFound && v.brand && v.model && v.year && !state.showManualOtr;

  return (
    <div className="flex flex-col gap-3">
      {/* Region — native select with icon */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-sm font-semibold text-[#0F172A]">Wilayah (Plat)</span>
          {plateInvalid && <span className="text-xs text-[#B91C1C] font-semibold">Wajib</span>}
        </div>
        <div className="relative">
          <div className={`ds-input flex items-center gap-2.5 pr-10 ${plateInvalid ? "!border-[#B91C1C] !bg-[#FEF2F2]" : ""}`}>
            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${plateInvalid ? "bg-[#FEE2E2] text-[#B91C1C]" : "bg-[#ECFDF5] text-[#0F766E]"}`}>
              <MapPin className="h-4 w-4" aria-hidden />
            </span>
            <select
              className={`flex-1 bg-transparent border-0 outline-none cursor-pointer appearance-none text-[16px] ${state.region.plate ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
              value={state.region.plate}
              onChange={(e) => updateRegion({ plate: e.target.value })}
              aria-label="Wilayah penggunaan"
              aria-invalid={plateInvalid || undefined}
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
      </div>

      {/* Nilai Kendaraan (OTR) — pindah dari step 1 ke step 2 */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-sm font-semibold text-[#0F172A]">Nilai Kendaraan (OTR)</span>
          {valueInvalid && <span className="text-xs text-[#B91C1C] font-semibold">Wajib</span>}
          {state.vehicleFound && !state.showManualOtr && <span className="text-xs text-[#0F766E] font-semibold">Otomatis</span>}
        </div>
        {state.showManualOtr ? (
          <>
            <div className={`ds-input flex items-center gap-2.5 ${state.manualOtrValidation && !state.manualOtrValidation.isValid ? "!border-[#B91C1C]" : ""}`}>
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#ECFDF5] text-[#0F766E]">
                <Wallet className="h-4 w-4" aria-hidden />
              </span>
              <input
                type="text"
                inputMode="numeric"
                className={`flex-1 bg-transparent border-0 outline-none text-[16px] text-[#0F172A] ${state.manualOtrValidation && !state.manualOtrValidation.isValid ? "text-[#B91C1C]" : ""}`}
                placeholder="Masukkan nilai OTR"
                value={v.vehicleValue ? formatIDR(parseInt(v.vehicleValue, 10)) : ""}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  updateVehicle({ vehicleValue: digits });
                }}
                aria-invalid={state.manualOtrValidation ? !state.manualOtrValidation.isValid : undefined}
              />
            </div>
            {state.manualOtrValidation && !state.manualOtrValidation.isValid && (
              <div className="mt-1.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] p-2.5 flex items-start gap-1.5" role="alert">
                <AlertCircle className="h-3.5 w-3.5 text-[#B91C1C] flex-shrink-0 mt-0.5" aria-hidden />
                <p className="text-xs text-[#991B1B] leading-relaxed">
                  {state.manualOtrValidation.isBelow && (
                    <>Nilai terlalu rendah. Minimum <strong>{formatIDR(state.manualOtrValidation.min)}</strong> (−15% dari database).</>
                  )}
                  {state.manualOtrValidation.isAbove && (
                    <>Nilai terlalu tinggi. Maksimum <strong>{formatIDR(state.manualOtrValidation.max)}</strong> (+15% dari database).</>
                  )}
                </p>
              </div>
            )}
            {state.manualOtrValidation && state.manualOtrValidation.isValid && (
              <p className="mt-1.5 text-xs text-[#0F766E] flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" aria-hidden />
                Dalam rentang ±15% dari database
              </p>
            )}
          </>
        ) : state.vehicleFound ? (
          <div className="ds-input bg-[#F8FAFC] flex items-center gap-2.5">
            <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#ECFDF5] text-[#0F766E]">
              <Wallet className="h-4 w-4" aria-hidden />
            </span>
            <span className="font-bold text-[#0F172A] flex-1">
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
        ) : v.year ? (
          <div className="ds-input flex items-center gap-2.5 bg-[#FFFBEB] border-[#FDE68A]">
            <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#FEF3C7] text-[#92400E]">
              <Wallet className="h-4 w-4" aria-hidden />
            </span>
            <AlertCircle className="h-4 w-4 text-[#92400E] flex-shrink-0" aria-hidden />
            <span className="text-sm text-[#92400E] flex-1">Nilai tidak ditemukan</span>
            <button
              type="button"
              onClick={() => setShowManualOtr(true)}
              className="text-xs font-semibold text-[#0F766E] hover:underline whitespace-nowrap"
            >
              Input manual
            </button>
          </div>
        ) : (
          <div className="ds-input bg-[#F8FAFC] flex items-center">
            <span className="text-sm text-[#94A3B8] flex-1">Kembali ke step 1 untuk pilih kendaraan</span>
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
