"use client";

import * as React from "react";
import { useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, AlertCircle, Car } from "lucide-react";
import { UseCalculatorReturn } from "./useCalculator";
import { PLATE_OPTIONS } from "./types";
import { formatIDR } from "@/lib/format";

/* ═══════════════════════════════════════════════════
   Shared building blocks
   ═══════════════════════════════════════════════════ */

function FieldLabel({ htmlFor, children, hint }: { htmlFor?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-[#0F172A]">
        {children}
      </label>
      {hint && <span className="text-xs text-[#64748B]">{hint}</span>}
    </div>
  );
}

function FieldError({ id, children }: { id?: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-[#B91C1C] flex items-start gap-1.5" role="alert">
      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/**
 * Searchable native select with a fallback combobox for very large lists.
 * On mobile, native <select> is the most reliable input type.
 */
interface SearchableSelectProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  ariaLabel: string;
  ariaDescribedby?: string;
  ariaInvalid?: boolean;
  disabled?: boolean;
}

function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  ariaDescribedby,
  ariaInvalid,
  disabled,
}: SearchableSelectProps) {
  // If the list is small, render a native select for best mobile UX.
  // If the list is large (>40 items), we still use native select but with a
  // filter input above it. Native select on mobile opens the OS picker,
  // which is far more reliable than custom dropdowns.
  if (options.length <= 60) {
    return (
      <div className="relative">
        <select
          id={id}
          className="ds-input appearance-none pr-10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          aria-invalid={ariaInvalid}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]"
          aria-hidden
        />
      </div>
    );
  }

  // Large list — filter input + native select (the filter narrows the options)
  return <LargeSearchableSelect {...{ id, value, onChange, options, placeholder, ariaLabel, ariaDescribedby, ariaInvalid, disabled }} />;
}

function LargeSearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  ariaDescribedby,
  ariaInvalid,
  disabled,
}: SearchableSelectProps) {
  const [query, setQuery] = React.useState("");
  const filterId = `${id}-filter`;
  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [query, options]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]"
          aria-hidden
        />
        <input
          id={filterId}
          type="text"
          className="ds-input pl-9"
          placeholder={`Cari ${ariaLabel.toLowerCase()}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={`Filter ${ariaLabel}`}
          autoComplete="off"
        />
      </div>
      <div className="relative">
        <select
          id={id}
          className="ds-input appearance-none pr-10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          aria-invalid={ariaInvalid}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {filtered.slice(0, 200).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]"
          aria-hidden
        />
      </div>
      {filtered.length > 200 && (
        <p className="text-xs text-[#64748B]">
          Menampilkan 200 dari {filtered.length} hasil. Gunakan pencarian untuk mempersempit.
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Step 1: Vehicle data
   ═══════════════════════════════════════════════════ */

export function VehicleStep({ calc }: { calc: UseCalculatorReturn }) {
  const { state, brands, models, updateVehicle, setShowManualOtr } = calc;
  const v = state.vehicle;

  const brandErrorId = "veh-brand-err";
  const modelErrorId = "veh-model-err";
  const yearErrorId = "veh-year-err";
  const valueErrorId = "veh-value-err";

  // Show "Enter manually" link if vehicle not found in DB
  const showManualEntry = !state.vehicleFound && v.brand && v.model && v.year && !state.showManualOtr;

  return (
    <fieldset className="flex flex-col gap-5 border-0 p-0">
      <legend className="sr-only">Data Kendaraan</legend>

      {/* Brand */}
      <div>
        <FieldLabel htmlFor="calc-brand">Merek Kendaraan</FieldLabel>
        <SearchableSelect
          id="calc-brand"
          value={v.brand}
          onChange={(val) => updateVehicle({ brand: val, model: "", year: "", vehicleValue: "" })}
          options={brands}
          placeholder="Pilih merek"
          ariaLabel="Merek kendaraan"
          ariaDescribedby={brandErrorId}
        />
      </div>

      {/* Model */}
      <div>
        <FieldLabel htmlFor="calc-model">Tipe / Model</FieldLabel>
        <SearchableSelect
          id="calc-model"
          value={v.model}
          onChange={(val) => updateVehicle({ model: val, year: "", vehicleValue: "" })}
          options={models}
          placeholder={v.brand ? "Pilih tipe" : "Pilih merek terlebih dahulu"}
          ariaLabel="Tipe kendaraan"
          ariaDescribedby={modelErrorId}
          disabled={!v.brand}
        />
      </div>

      {/* Year */}
      <div>
        <FieldLabel htmlFor="calc-year">Tahun Kendaraan</FieldLabel>
        <SearchableSelect
          id="calc-year"
          value={v.year}
          onChange={(val) => updateVehicle({ year: val })}
          options={state.availableYears}
          placeholder={v.model ? "Pilih tahun" : "Pilih tipe terlebih dahulu"}
          ariaLabel="Tahun kendaraan"
          ariaDescribedby={yearErrorId}
          disabled={!v.model}
        />
      </div>

      {/* Vehicle value */}
      <div>
        <FieldLabel htmlFor="calc-value" hint={state.vehicleFound ? "Dari database" : undefined}>
          Nilai Kendaraan (OTR)
        </FieldLabel>
        {state.showManualOtr ? (
          <input
            id="calc-value"
            type="text"
            inputMode="numeric"
            className="ds-input"
            placeholder="Contoh: 250000000"
            value={v.vehicleValue ? formatIDR(parseInt(v.vehicleValue, 10)) : ""}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              updateVehicle({ vehicleValue: digits });
            }}
            aria-describedby={valueErrorId}
            aria-invalid={state.showManualOtr && !v.vehicleValue}
          />
        ) : state.vehicleFound ? (
          <div className="ds-input bg-[#F8FAFC] flex items-center justify-between">
            <span className="font-semibold text-[#0F172A]">
              {v.vehicleValue ? formatIDR(parseInt(v.vehicleValue, 10)) : "—"}
            </span>
            <button
              type="button"
              onClick={() => setShowManualOtr(true)}
              className="text-xs font-semibold text-[#0F766E] hover:underline"
            >
              Ubah manual
            </button>
          </div>
        ) : (
          <div className="ds-input bg-[#FFFBEB] flex items-center gap-2 border-[#FDE68A]">
            <Car className="h-4 w-4 text-[#92400E] flex-shrink-0" aria-hidden />
            <span className="text-sm text-[#92400E]">
              {v.year
                ? "Nilai OTR tidak ditemukan di database"
                : "Nilai akan terisi otomatis"}
            </span>
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
            Kembali ke nilai otomatis
          </button>
        )}
      </div>

      <p className="text-xs text-[#64748B] leading-relaxed">
        Data kendaraan digunakan untuk menghitung estimasi premi berdasarkan tarif resmi.
        Nilai OTR otomatis diambil dari database kendaraan yang tersedia.
      </p>
    </fieldset>
  );
}

/* ═══════════════════════════════════════════════════
   Step 2: Region & usage
   ═══════════════════════════════════════════════════ */

export function RegionStep({ calc }: { calc: UseCalculatorReturn }) {
  const { state, updateRegion } = calc;

  return (
    <fieldset className="flex flex-col gap-5 border-0 p-0">
      <legend className="sr-only">Wilayah & Penggunaan</legend>

      <div>
        <FieldLabel htmlFor="calc-plate">Wilayah Penggunaan (Plat)</FieldLabel>
        <SearchableSelect
          id="calc-plate"
          value={state.region.plate}
          onChange={(val) => updateRegion({ plate: val })}
          options={PLATE_OPTIONS}
          placeholder="Pilih plat nomor wilayah"
          ariaLabel="Wilayah penggunaan kendaraan"
        />
        <p className="mt-1.5 text-xs text-[#64748B]">
          Wilayah menentukan tarif premi sesuai klasifikasi (Wilayah 1, 2, atau 3).
        </p>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <p className="text-sm text-[#475569] leading-relaxed">
          <strong className="text-[#0F172A]">Catatan:</strong> Pastikan plat yang dipilih
          sesuai dengan lokasi kendaraan terdaftar. Wilayah berpengaruh terhadap besaran
          tarif dasar premi.
        </p>
      </div>
    </fieldset>
  );
}

/* ═══════════════════════════════════════════════════
   Step 3: Protection type
   ═══════════════════════════════════════════════════ */

export function ProtectionStep({ calc }: { calc: UseCalculatorReturn }) {
  const { state, updateProtection } = calc;

  const options: Array<{
    value: "AllRisk" | "TLO";
    title: string;
    description: string;
    points: string[];
  }> = [
    {
      value: "AllRisk",
      title: "All Risk (Comprehensive)",
      description:
        "Perlindungan terhadap kerusakan sebagian hingga kerusakan berat sesuai manfaat dan ketentuan polis.",
      points: ["Cocok untuk mobil baru", "Cakupan lebih luas", "Termasuk kerusakan sebagian"],
    },
    {
      value: "TLO",
      title: "Total Loss Only (TLO)",
      description:
        "Perlindungan atas kehilangan atau kerusakan yang memenuhi kriteria total loss sesuai ketentuan polis.",
      points: ["Premi lebih terjangkau", "Untuk risiko kerugian besar", "Batas usia kendaraan berlaku"],
    },
  ];

  return (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className="sr-only">Jenis Perlindungan</legend>

      {options.map((opt) => {
        const selected = state.protection.coverageType === opt.value;
        return (
          <label
            key={opt.value}
            htmlFor={`protection-${opt.value}`}
            className={`
              relative flex flex-col gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all
              ${selected ? "border-[#0F766E] bg-[#ECFDF5]" : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"}
            `}
          >
            <input
              id={`protection-${opt.value}`}
              type="radio"
              name="coverage-type"
              value={opt.value}
              checked={selected}
              onChange={() => updateProtection({ coverageType: opt.value })}
              className="sr-only"
            />
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[#0F172A]">{opt.title}</span>
                <span className="text-sm text-[#475569] leading-relaxed">{opt.description}</span>
              </div>
              <span
                className={`
                  flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                  ${selected ? "border-[#0F766E] bg-[#0F766E]" : "border-[#CBD5E1] bg-white"}
                `}
                aria-hidden
              >
                {selected && <span className="w-2 h-2 rounded-full bg-white" />}
              </span>
            </div>
            <ul className="flex flex-col gap-1 mt-1">
              {opt.points.map((p) => (
                <li key={p} className="text-xs text-[#475569] flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#0F766E]" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </label>
        );
      })}

      <p className="text-xs text-[#64748B] leading-relaxed mt-2">
        Pilih jenis perlindungan sesuai kebutuhan. Manfaat, syarat, dan ketentuan akhir
        mengikuti polis dari perusahaan asuransi penerbit.
      </p>
    </fieldset>
  );
}

/* ═══════════════════════════════════════════════════
   Step 4: Extensions (add-ons)
   ═══════════════════════════════════════════════════ */

import { ADDON_META, TLO_EXCLUDED_ADDONS, ALL_ADDON_KEYS } from "./types";

export function ExtensionStep({ calc }: { calc: UseCalculatorReturn }) {
  const { state, toggleAddon } = calc;
  const isTLO = state.protection.coverageType === "TLO";

  return (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className="sr-only">Perluasan</legend>

      <p className="text-sm text-[#475569] mb-2 leading-relaxed">
        Pilih perluasan jaminan yang dibutuhkan. Biaya perluasan akan ditambahkan ke premi dasar.
      </p>

      {ALL_ADDON_KEYS.map((key) => {
        const meta = ADDON_META[key];
        if (!meta) return null;
        const isOn = state.extension.addOns.includes(key);
        const isExcluded = isTLO && TLO_EXCLUDED_ADDONS.includes(key);

        return (
          <label
            key={key}
            htmlFor={`addon-${key}`}
            className={`
              relative flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all
              ${isExcluded
                ? "border-[#E2E8F0] bg-[#F8FAFC] opacity-60 cursor-not-allowed"
                : isOn
                ? "border-[#0F766E] bg-[#ECFDF5]"
                : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
              }
            `}
          >
            <input
              id={`addon-${key}`}
              type="checkbox"
              checked={isOn}
              onChange={() => !isExcluded && toggleAddon(key)}
              disabled={isExcluded}
              className="sr-only"
            />
            <span
              className={`
                flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5
                ${isOn ? "border-[#0F766E] bg-[#0F766E]" : "border-[#CBD5E1] bg-white"}
              `}
              aria-hidden
            >
              {isOn && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-semibold text-[#0F172A] text-sm">{meta.label}</span>
              <span className="text-xs text-[#64748B] leading-relaxed">{meta.description}</span>
              {isExcluded && (
                <span className="text-xs text-[#92400E] mt-1">Tidak tersedia untuk TLO</span>
              )}
            </div>
          </label>
        );
      })}

      <p className="text-xs text-[#64748B] leading-relaxed mt-2">
        Anda dapat memilih lebih dari satu perluasan. Tarif perluasan mengikuti ketentuan
        wilayah dan jenis perlindungan yang dipilih.
      </p>
    </fieldset>
  );
}
