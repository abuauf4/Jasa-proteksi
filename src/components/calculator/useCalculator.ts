"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getVehicleData,
  prefetchVehicleData,
  type PrefetchedVehicleData,
} from "@/lib/vehiclePrefetch";
import { trackEvent } from "@/lib/analytics-events";
import {
  type CalculatorStep,
  type CoverageType,
  type ExtensionFormState,
  type LeadResponse,
  type PersonalFormState,
  type PremiumResponse,
  type ProtectionFormState,
  type RegionFormState,
  type VehicleFormState,
  ALL_ADDON_KEYS,
  PLATE_OPTIONS,
  STEP_FLOW,
  TLO_EXCLUDED_ADDONS,
  plateCodeFromLabel,
} from "./types";

interface UseCalculatorOptions {
  /** Pre-select coverage type (e.g. when arriving from /asuransi-mobil-all-risk). */
  initialCoverageType?: CoverageType;
  /** Auto-fire view_calculator event on mount. */
  trackViewOnMount?: boolean;
}

interface CalculatorState {
  step: CalculatorStep;
  vehicle: VehicleFormState;
  region: RegionFormState;
  protection: ProtectionFormState;
  extension: ExtensionFormState;
  personal: PersonalFormState;
  premium: PremiumResponse | null;
  selectedPartnerIndex: number | null;
  lead: LeadResponse | null;
  isLoadingPremium: boolean;
  isSubmittingLead: boolean;
  error: string | null;
  /** Set of available years for the currently selected brand+model. */
  availableYears: string[];
  /** Whether the vehicle was found in the database (vs manually entered). */
  vehicleFound: boolean;
  /** Whether the user has chosen to enter OTR manually. */
  showManualOtr: boolean;
  /** Database OTR value (for ±15% manual validation when vehicle was found). */
  databaseVehicleValue: number | null;
  /** Manual OTR validation result — null when not applicable. */
  manualOtrValidation: {
    isValid: boolean;
    isBelow: boolean;
    isAbove: boolean;
    min: number;
    max: number;
  } | null;
  /** Subtle "recalculating" indicator — doesn't clear previous result */
  isRecalculating: boolean;
  /** Full loading for initial calculation (after last step, before result page) */
  isCalculatingInitial: boolean;
}

export function useCalculator(options: UseCalculatorOptions = {}) {
  const { initialCoverageType, trackViewOnMount = true } = options;

  const [state, setState] = useState<CalculatorState>({
    step: "vehicle",
    vehicle: {
      brand: "",
      model: "",
      year: "",
      vehicleValue: "",
      vehicleValueSource: "database",
    },
    region: { plate: "" },
    protection: { coverageType: initialCoverageType ?? "AllRisk" },
    extension: { addOns: [] },
    personal: { customerName: "", whatsappNumber: "", email: "" },
    premium: null,
    selectedPartnerIndex: null,
    lead: null,
    isLoadingPremium: false,
    isSubmittingLead: false,
    error: null,
    availableYears: [],
    vehicleFound: false,
    showManualOtr: false,
    databaseVehicleValue: null,
    manualOtrValidation: null,
    isRecalculating: false,
    isCalculatingInitial: false,
  });

  // Vehicle data is stored in STATE (not ref) so derived memos can react to it.
  const [vehicleData, setVehicleData] = useState<PrefetchedVehicleData | null>(null);
  const startedRef = useRef(false);

  /* ─── Prefetch vehicle data on mount; populate state once available ─── */
  useEffect(() => {
    let mounted = true;
    prefetchVehicleData("mobil");
    getVehicleData("mobil").then((data) => {
      if (mounted && data) setVehicleData(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  /* ─── Fire view_calculator on mount ─── */
  useEffect(() => {
    if (trackViewOnMount) {
      trackEvent("view_calculator", {});
    }
  }, [trackViewOnMount]);

  /* ─── Derived: list of brands, models for current brand ─── */
  const brands = useMemo(() => {
    if (!vehicleData) return [];
    return [...vehicleData.brands].sort();
  }, [vehicleData]);

  const models = useMemo(() => {
    if (!vehicleData || !state.vehicle.brand) return [];
    return vehicleData.modelsByBrand[state.vehicle.brand] || [];
  }, [vehicleData, state.vehicle.brand]);

  /* ─── Update available years whenever brand/model changes ─── */
  useEffect(() => {
    if (!state.vehicle.brand || !state.vehicle.model) {
      setState((s) => ({ ...s, availableYears: [] }));
      return;
    }
    if (!vehicleData) return;

    const yearsForObject =
      vehicleData.yearsByBrandModel?.[state.vehicle.brand]?.[state.vehicle.model] ?? [];
    setState((s) => ({ ...s, availableYears: yearsForObject as string[] }));
  }, [state.vehicle.brand, state.vehicle.model, vehicleData]);

  /* ─── Auto-look up vehicle value when year is selected (database mode) ─── */
  useEffect(() => {
    if (state.showManualOtr) return;
    if (!state.vehicle.brand || !state.vehicle.model || !state.vehicle.year) {
      setState((s) => ({
        ...s,
        vehicle: { ...s.vehicle, vehicleValue: "", vehicleValueSource: "database" },
        vehicleFound: false,
        databaseVehicleValue: null,
      }));
      return;
    }
    if (!vehicleData) return;

    const valueIdr =
      vehicleData.valuesByBrandModelYear?.[state.vehicle.brand]?.[state.vehicle.model]?.[
        state.vehicle.year
      ];
    if (valueIdr) {
      // Prefetch API returns values in IDR (already converted from millions).
      setState((s) => ({
        ...s,
        vehicle: {
          ...s.vehicle,
          vehicleValue: String(valueIdr),
          vehicleValueSource: "database",
        },
        vehicleFound: true,
        databaseVehicleValue: valueIdr,
      }));
    } else {
      setState((s) => ({
        ...s,
        vehicle: { ...s.vehicle, vehicleValue: "", vehicleValueSource: "database" },
        vehicleFound: false,
        databaseVehicleValue: null,
      }));
    }
  }, [
    state.vehicle.brand,
    state.vehicle.model,
    state.vehicle.year,
    state.showManualOtr,
    vehicleData,
  ]);

  /* ─── Manual OTR validation: ±15% of database value ─── */
  // When user enables manual OTR entry AND vehicle was found in database,
  // validate that the manual value is within ±15% of the database value.
  useEffect(() => {
    if (!state.showManualOtr || state.databaseVehicleValue === null) {
      setState((s) => ({ ...s, manualOtrValidation: null }));
      return;
    }
    const baseValue = state.databaseVehicleValue;
    const min = Math.round(baseValue * 0.85);
    const max = Math.round(baseValue * 1.15);
    const manualVal = parseInt(state.vehicle.vehicleValue.replace(/\D/g, ""), 10) || 0;
    if (!manualVal) {
      setState((s) => ({ ...s, manualOtrValidation: null }));
      return;
    }
    const isBelow = manualVal < min;
    const isAbove = manualVal > max;
    setState((s) => ({
      ...s,
      manualOtrValidation: {
        isValid: !isBelow && !isAbove,
        isBelow,
        isAbove,
        min,
        max,
      },
    }));
  }, [state.showManualOtr, state.databaseVehicleValue, state.vehicle.vehicleValue]);

  /* ─── Fire calculator_start on first input ─── */
  const fireStartOnce = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("calculator_start", {});
  }, []);

  /* ─── Step navigation ─── */
  const goToStep = useCallback((step: CalculatorStep) => {
    setState((s) => ({ ...s, step, error: null }));
  }, []);

  const nextStep = useCallback(() => {
    setState((s) => {
      const idx = STEP_FLOW.indexOf(s.step);
      if (idx < 0 || idx >= STEP_FLOW.length - 1) return s;
      const next = STEP_FLOW[idx + 1];
      trackEvent("calculator_step_complete", {
        step: idx + 1,
        step_name: s.step,
      });
      return { ...s, step: next, error: null };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((s) => {
      if (s.step === "result") {
        return { ...s, step: "extension", error: null };
      }
      const idx = STEP_FLOW.indexOf(s.step);
      if (idx <= 0) return s;
      return { ...s, step: STEP_FLOW[idx - 1], error: null };
    });
  }, []);

  /* ─── Field updaters ─── */
  const updateVehicle = useCallback(
    (patch: Partial<VehicleFormState>) => {
      fireStartOnce();
      setState((s) => ({ ...s, vehicle: { ...s.vehicle, ...patch } }));
    },
    [fireStartOnce]
  );

  const updateRegion = useCallback(
    (patch: Partial<RegionFormState>) => {
      fireStartOnce();
      setState((s) => ({ ...s, region: { ...s.region, ...patch } }));
    },
    [fireStartOnce]
  );

  const updateProtection = useCallback(
    (patch: Partial<ProtectionFormState>) => {
      fireStartOnce();
      setState((s) => {
        // When switching to TLO, drop TLO-excluded add-ons.
        let extension = s.extension;
        if (patch.coverageType === "TLO") {
          extension = {
            addOns: s.extension.addOns.filter((k) => !TLO_EXCLUDED_ADDONS.includes(k)),
          };
        }
        return { ...s, protection: { ...s.protection, ...patch }, extension };
      });
    },
    [fireStartOnce]
  );

  const updateExtension = useCallback(
    (patch: Partial<ExtensionFormState>) => {
      fireStartOnce();
      setState((s) => ({ ...s, extension: { ...s.extension, ...patch } }));
    },
    [fireStartOnce]
  );

  const toggleAddon = useCallback(
    (key: string) => {
      fireStartOnce();
      setState((s) => {
        const isOn = s.extension.addOns.includes(key);
        // Block TLO-excluded addons when coverage is TLO
        if (
          !isOn &&
          s.protection.coverageType === "TLO" &&
          TLO_EXCLUDED_ADDONS.includes(key)
        ) {
          return s;
        }
        const addOns = isOn
          ? s.extension.addOns.filter((k) => k !== key)
          : [...s.extension.addOns, key];
        return { ...s, extension: { addOns } };
      });
    },
    [fireStartOnce]
  );

  const updatePersonal = useCallback((patch: Partial<PersonalFormState>) => {
    setState((s) => ({ ...s, personal: { ...s.personal, ...patch } }));
  }, []);

  const setShowManualOtr = useCallback((show: boolean) => {
    setState((s) => ({
      ...s,
      showManualOtr: show,
      vehicle: show ? s.vehicle : { ...s.vehicle, vehicleValue: "" },
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((s) => ({ ...s, error }));
  }, []);

  const selectPartner = useCallback((index: number | null) => {
    setState((s) => ({ ...s, selectedPartnerIndex: index }));
  }, []);

  /* ─── Reset all state ─── */
  const reset = useCallback(() => {
    setState({
      step: "vehicle",
      vehicle: { brand: "", model: "", year: "", vehicleValue: "", vehicleValueSource: "database" },
      region: { plate: "" },
      protection: { coverageType: initialCoverageType ?? "AllRisk" },
      extension: { addOns: [] },
      personal: { customerName: "", whatsappNumber: "", email: "" },
      premium: null,
      selectedPartnerIndex: null,
      lead: null,
      isLoadingPremium: false,
      isSubmittingLead: false,
      error: null,
      availableYears: [],
      vehicleFound: false,
      showManualOtr: false,
      databaseVehicleValue: null,
      manualOtrValidation: null,
      isRecalculating: false,
      isCalculatingInitial: false,
    });
    startedRef.current = false;
  }, [initialCoverageType]);

  /* ─── Premium calculation ─── */
  // AbortController for cancelling stale requests
  const abortRef = useRef<AbortController | null>(null);
  // Debounce timer for addon/coverage changes
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculatePremium = useCallback(async (silent = false): Promise<boolean> => {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    if (!silent) {
      setState((s) => ({ ...s, isCalculatingInitial: true, isLoadingPremium: true, error: null }));
    } else {
      setState((s) => ({ ...s, isRecalculating: true }));
    }

    try {
      const v = state.vehicle;
      const plateCode = plateCodeFromLabel(state.region.plate);

      const body: Record<string, unknown> = {
        brand: v.brand,
        modelDescription: v.model,
        vehicleYear: parseInt(v.year, 10),
        coverageType: state.protection.coverageType,
        plateCode,
        addOns: state.extension.addOns,
      };

      const otrNum = parseInt(v.vehicleValue.replace(/\D/g, ""), 10) || 0;
      if (state.showManualOtr && otrNum > 0) {
        body.vehicleValueOverride = otrNum;
      } else if (!state.vehicleFound && otrNum > 0) {
        body.vehicleValueOverride = otrNum;
      }

      const res = await fetch("/api/vehicles/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg = (errData as { error?: string }).error || "Gagal menghitung premi.";
        setState((s) => ({ ...s, isLoadingPremium: false, isRecalculating: false, error: msg }));
        trackEvent("calculator_error", { error_message: msg });
        return false;
      }

      const data: PremiumResponse = await res.json();

      // Don't update if this request was superseded
      if (controller.signal.aborted) return false;

      // Preserve selected partner if still valid, else auto-select cheapest
      const prevPartnerIdx = state.selectedPartnerIndex;
      const newPartnerIdx = prevPartnerIdx !== null && data.partners[prevPartnerIdx]
        ? prevPartnerIdx
        : data.partners.length > 0 ? 0 : null;

      setState((s) => ({
        ...s,
        premium: data,
        selectedPartnerIndex: newPartnerIdx,
        isLoadingPremium: false,
        isCalculatingInitial: false,
        isRecalculating: false,
        step: "result",
        error: null,
      }));

      if (!silent) {
        trackEvent("calculation_complete", {
          coverage_type: state.protection.coverageType,
          vehicle_brand: v.brand,
          vehicle_year: parseInt(v.year, 10),
          estimated_premium: data.totalPremium,
        });
        trackEvent("view_result", {
          coverage_type: state.protection.coverageType,
          estimated_premium: data.totalPremium,
        });
      }
      return true;
    } catch (err) {
      // Ignore abort errors
      if (err instanceof DOMException && err.name === "AbortError") return false;
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan jaringan.";
      if (!silent) {
        setState((s) => ({ ...s, isLoadingPremium: false, isCalculatingInitial: false, error: msg }));
      } else {
        setState((s) => ({ ...s, isRecalculating: false }));
      }
      trackEvent("calculator_error", { error_message: msg });
      return false;
    }
  }, [
    state.vehicle,
    state.region.plate,
    state.protection.coverageType,
    state.extension.addOns,
    state.showManualOtr,
    state.vehicleFound,
    state.selectedPartnerIndex,
  ]);

  /* ─── Lead submission (after result shown) ─── */
  const submitLead = useCallback(async (): Promise<boolean> => {
    setState((s) => ({ ...s, isSubmittingLead: true, error: null }));

    try {
      const cleanPhone = state.personal.whatsappNumber.replace(/[\s\-+]/g, "");
      if (!/^\d{10,15}$/.test(cleanPhone)) {
        setState((s) => ({
          ...s,
          isSubmittingLead: false,
          error:
            "Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx atau 628xxxxxxxxxx.",
        }));
        return false;
      }

      // Resolve productId from /api/products (cached)
      let productId: string | null = null;
      try {
        const productsRes = await fetch("/api/products");
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const dbProduct = (productsData.products as Array<{ slug: string; id: string }>)
            .find((p) => p.slug === "asuransi-mobil");
          if (dbProduct) productId = dbProduct.id;
        }
      } catch {
        /* API not available */
      }

      const v = state.vehicle;
      const otrNum = parseInt(v.vehicleValue.replace(/\D/g, ""), 10) || 0;
      const partnerName =
        state.selectedPartnerIndex !== null && state.premium?.partners[state.selectedPartnerIndex]
          ? state.premium.partners[state.selectedPartnerIndex].name
          : "";
      const estimatedPremium =
        state.selectedPartnerIndex !== null && state.premium?.partners[state.selectedPartnerIndex]
          ? state.premium.partners[state.selectedPartnerIndex].estimatedPremium
          : state.premium?.totalPremium ?? 0;

      const vehicleNotes = `[${state.protection.coverageType}] ${v.brand} ${v.model} ${v.year} | Plat: ${state.region.plate} | OTR: Rp ${otrNum.toLocaleString("id-ID")}${state.extension.addOns.length ? ` | Add-on: ${state.extension.addOns.join(", ")}` : ""}${partnerName ? ` | Partner: ${partnerName}` : ""}${estimatedPremium ? ` | Est. Premi: Rp ${estimatedPremium.toLocaleString("id-ID")}` : ""}`;

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: state.personal.customerName.trim(),
          whatsappNumber: cleanPhone,
          productId,
          notes: vehicleNotes,
          coverageType: state.protection.coverageType,
          vehicleBrand: v.brand,
          vehicleType: v.model,
          vehicleYear: v.year,
          plateRegion: state.region.plate,
          vehiclePriceOtr: otrNum || null,
          addOns: state.extension.addOns.length
            ? JSON.stringify(state.extension.addOns)
            : null,
          estimatedPremium: estimatedPremium || null,
          originalPremium: state.premium?.totalPremiumBeforeDiscount || null,
          discountAmount: state.premium?.discountAmount || null,
          adminFee:
            (state.selectedPartnerIndex !== null &&
              state.premium?.partners[state.selectedPartnerIndex]?.adminFee) ||
            state.premium?.adminFee ||
            null,
          customerBudget: null,
          selectedPartner: partnerName || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg =
          (data as { error?: string }).error || "Gagal mengirim data. Silakan coba lagi.";
        setState((s) => ({ ...s, isSubmittingLead: false, error: msg }));
        return false;
      }

      const lead = data as LeadResponse;
      setState((s) => ({ ...s, lead, isSubmittingLead: false }));

      trackEvent("lead_submit", {
        lead_id: lead.id,
        coverage_type: state.protection.coverageType,
        estimated_premium: estimatedPremium,
      });

      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan jaringan.";
      setState((s) => ({ ...s, isSubmittingLead: false, error: msg }));
      return false;
    }
  }, [
    state.personal,
    state.vehicle,
    state.region.plate,
    state.protection.coverageType,
    state.extension.addOns,
    state.premium,
    state.selectedPartnerIndex,
  ]);

  /* ─── Mark WhatsApp as clicked (PATCH lead) ─── */
  const markWhatsappClicked = useCallback(async () => {
    if (!state.lead || state.lead.id.startsWith("local-")) return;
    try {
      await fetch(`/api/leads/${state.lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "whatsapp_clicked" }),
      });
    } catch {
      /* silent */
    }
  }, [state.lead]);

  /* ─── Auto re-calculate when coverage type or addons change on result step ─── */
  // Debounced: 200ms delay for addon toggles, instant for coverage type change
  const prevCoverageRef = useRef<string>(state.protection.coverageType);
  const prevAddonsRef = useRef<string>(state.extension.addOns.join(","));

  useEffect(() => {
    const coverageChanged = prevCoverageRef.current !== state.protection.coverageType;
    const addonsChanged = prevAddonsRef.current !== state.extension.addOns.join(",");
    prevCoverageRef.current = state.protection.coverageType;
    prevAddonsRef.current = state.extension.addOns.join(",");

    if (state.step !== "result" || !state.premium || (!coverageChanged && !addonsChanged)) {
      return;
    }

    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Coverage change: immediate (no debounce needed, user expects instant feedback)
    // Addon change: debounce 200ms (user may toggle multiple quickly)
    const delay = coverageChanged ? 0 : 200;

    debounceRef.current = setTimeout(() => {
      calculatePremium(true);
    }, delay);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [state.protection.coverageType, state.extension.addOns, state.step, state.premium, calculatePremium]);

  /* ─── Persist calculator state to sessionStorage (for /hasil-simulasi page) ─── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Only save when we have premium (result ready) or step changed
    if (state.step === "result" || state.premium) {
      try {
        sessionStorage.setItem("jp_calc_state", JSON.stringify({
          step: state.step,
          vehicle: state.vehicle,
          region: state.region,
          protection: state.protection,
          extension: state.extension,
          personal: state.personal,
          premium: state.premium,
          selectedPartnerIndex: state.selectedPartnerIndex,
          lead: state.lead,
          vehicleFound: state.vehicleFound,
          showManualOtr: state.showManualOtr,
          databaseVehicleValue: state.databaseVehicleValue,
          manualOtrValidation: state.manualOtrValidation,
        }));
      } catch { /* silent */ }
    }
  }, [state]);

  /* ─── Restore calculator state from sessionStorage (on /hasil-simulasi mount) ─── */
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    if (typeof window === "undefined") return;
    // Only restore if we don't already have premium (i.e., fresh page load on result page)
    if (state.premium) return;
    try {
      const saved = sessionStorage.getItem("jp_calc_state");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (!parsed.premium) return;
      setState((s) => ({
        ...s,
        step: "result",
        vehicle: parsed.vehicle || s.vehicle,
        region: parsed.region || s.region,
        protection: parsed.protection || s.protection,
        extension: parsed.extension || s.extension,
        personal: parsed.personal || s.personal,
        premium: parsed.premium,
        selectedPartnerIndex: parsed.selectedPartnerIndex ?? null,
        lead: parsed.lead || null,
        vehicleFound: parsed.vehicleFound ?? false,
        showManualOtr: parsed.showManualOtr ?? false,
        databaseVehicleValue: parsed.databaseVehicleValue ?? null,
        manualOtrValidation: parsed.manualOtrValidation ?? null,
      }));
    } catch { /* silent */ }
  }, []);

  return {
    state,
    brands,
    models,
    plateOptions: PLATE_OPTIONS,
    addonKeys: ALL_ADDON_KEYS,
    // actions
    goToStep,
    nextStep,
    prevStep,
    updateVehicle,
    updateRegion,
    updateProtection,
    updateExtension,
    toggleAddon,
    updatePersonal,
    setShowManualOtr,
    setError,
    selectPartner,
    reset,
    calculatePremium,
    submitLead,
    markWhatsappClicked,
  };
}

export type UseCalculatorReturn = ReturnType<typeof useCalculator>;
