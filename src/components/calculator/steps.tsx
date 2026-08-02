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
      {/* Brand — bottom sheet picker, label inside field */}
      <PickerTrigger
        label="Merek mobil"
        value={v.brand}
        placeholder="Pilih merek"
        onClick={() => setBrandSheet(true)}
        invalid={brandInvalid}
        icon={<Car className="h-4 w-4" aria-hidden />}
        hideLabel
      />
      <BottomSheetPicker
        open={brandSheet}
        onClose={() => setBrandSheet(false)}
        options={brands}
        value={v.brand}
        onChange={(val) => updateVehicle({ brand: val, model: "", year: "", vehicleValue: "" })}
        title="Pilih Merek"
        placeholder="Cari merek..."
        presentation="fullscreen"
      />

      {/* Model — bottom sheet picker, label inside field */}
      <PickerTrigger
        label="Tipe mobil"
        value={v.model}
        placeholder={v.brand ? "Pilih tipe" : "Pilih merek dulu"}
        onClick={() => v.brand && setModelSheet(true)}
        disabled={!v.brand}
        invalid={modelInvalid && !!v.brand}
        icon={<Car className="h-4 w-4" aria-hidden />}
        hideLabel
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

      {/* Year — native select with icon, label inside field */}
      <div>
        <div className={`ds-input flex items-center gap-2.5 ${yearInvalid ? "!border-[#B91C1C] !bg-[#FEF2F2]" : ""}`}>
          <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${yearInvalid ? "bg-[#FEE2E2] text-[#B91C1C]" : "bg-[#ECFDF5] text-[#0F766E]"}`}>
            <Calendar className="h-4 w-4" aria-hidden />
          </span>
          <div className="flex-1 min-w-0">
            <span className={`block text-xs ${v.year ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
              Tahun keluaran{yearInvalid && " · Wajib"}
            </span>
            <select
              className={`w-full bg-transparent border-0 outline-none cursor-pointer appearance-none text-sm font-semibold ${v.year ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
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
      {/* Region — native select with icon, label inside field */}
      <div>
        <div className={`ds-input flex items-center gap-2.5 ${plateInvalid ? "!border-[#B91C1C] !bg-[#FEF2F2]" : ""}`}>
          <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${plateInvalid ? "bg-[#FEE2E2] text-[#B91C1C]" : "bg-[#ECFDF5] text-[#0F766E]"}`}>
            <MapPin className="h-4 w-4" aria-hidden />
          </span>
          <div className="flex-1 min-w-0">
            <span className={`block text-xs ${state.region.plate ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
              Wilayah (Plat){plateInvalid && " · Wajib"}
            </span>
            <select
              className={`w-full bg-transparent border-0 outline-none cursor-pointer appearance-none text-sm font-semibold ${state.region.plate ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
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
          </div>
        </div>
      </div>

      {/* Nilai Kendaraan (OTR) — label inside field */}
      <div>
        <div className={`ds-input flex items-center gap-2.5 ${valueInvalid ? "!border-[#B91C1C] !bg-[#FEF2F2]" : ""} ${state.vehicleFound && !state.showManualOtr ? "bg-[#F8FAFC]" : ""}`}>
          <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${valueInvalid ? "bg-[#FEE2E2] text-[#B91C1C]" : "bg-[#ECFDF5] text-[#0F766E]"}`}>
            <Wallet className="h-4 w-4" aria-hidden />
          </span>
          {state.showManualOtr ? (
            <>
              <div className="flex-1 min-w-0">
                <span className={`block text-xs ${state.manualOtrValidation && !state.manualOtrValidation.isValid ? "text-[#B91C1C]" : "text-[#64748B]"}`}>
                  Nilai Kendaraan (OTR){valueInvalid && " · Wajib"}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`w-full bg-transparent border-0 outline-none text-sm font-semibold text-[#0F172A] ${state.manualOtrValidation && !state.manualOtrValidation.isValid ? "text-[#B91C1C]" : ""}`}
                  placeholder="Masukkan nilai OTR"
                  value={v.vehicleValue ? formatIDR(parseInt(v.vehicleValue, 10)) : ""}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    updateVehicle({ vehicleValue: digits });
                  }}
                  aria-invalid={state.manualOtrValidation ? !state.manualOtrValidation.isValid : undefined}
                />
              </div>
            </>
          ) : state.vehicleFound ? (
            <>
              <div className="flex-1 min-w-0">
                <span className="block text-xs text-[#64748B]">
                  Nilai Kendaraan (OTR){state.vehicleFound && " · Otomatis"}
                </span>
                <span className="block text-sm font-bold text-[#0F172A]">
                  {v.vehicleValue ? formatIDR(parseInt(v.vehicleValue, 10)) : "—"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowManualOtr(true)}
                className="text-xs font-semibold text-[#0F766E] hover:underline flex-shrink-0"
              >
                Ubah
              </button>
            </>
          ) : v.year ? (
            <>
              <div className="flex-1 min-w-0">
                <span className="block text-xs text-[#92400E]">Nilai tidak ditemukan</span>
                <span className="block text-sm text-[#92400E]">Input manual diperlukan</span>
              </div>
              <button
                type="button"
                onClick={() => setShowManualOtr(true)}
                className="text-xs font-semibold text-[#0F766E] hover:underline whitespace-nowrap flex-shrink-0"
              >
                Input
              </button>
            </>
          ) : (
            <span className="text-sm text-[#94A3B8] flex-1">Kembali ke step 1</span>
          )}
        </div>

        {/* Manual OTR validation errors */}
        {state.showManualOtr && state.manualOtrValidation && !state.manualOtrValidation.isValid && (
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
        {state.showManualOtr && state.manualOtrValidation && state.manualOtrValidation.isValid && (
          <p className="mt-1.5 text-xs text-[#0F766E] flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
            Dalam rentang ±15% dari database
          </p>
        )}
        {state.showManualOtr && (
          <button
            type="button"
            onClick={() => {
              setShowManualOtr(false);
              updateVehicle({ vehicleValue: "" });
            }}
            className="mt-1.5 text-xs text-[#64748B] hover:underline"
          >
            Kembali ke otomatis
          </button>
        )}
      </div>
    </div>
  );
}
