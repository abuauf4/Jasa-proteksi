"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useCalculator } from "./useCalculator";
import { VehicleStep, CoverageStep } from "./steps";
import { PremiumResult } from "./PremiumResult";
import { Button } from "@/components/site/Button";
import { formatIDR } from "@/lib/format";

interface HeroCalculatorProps {
  initialCoverageType?: "AllRisk" | "TLO";
  className?: string;
  hideHeader?: boolean;
}

/**
 * Compact 3-step calculator:
 *   Step 1: Vehicle (brand + model + year + auto value)
 *   Step 2: Coverage (region + AllRisk/TLO + extensions)
 *   Step 3: Result (premium big at top, breakdown collapsible)
 *
 * API contracts preserved exactly:
 *   - POST /api/vehicles/premium body shape unchanged
 *   - POST /api/leads body shape unchanged
 *   - PATCH /api/leads/[id] status=whatsapp_clicked unchanged
 */
export function HeroCalculator({
  initialCoverageType,
  className,
  hideHeader = false,
}: HeroCalculatorProps) {
  const calc = useCalculator({ initialCoverageType });
  const { state, calculatePremium, setError } = calc;
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  // Track if user has attempted to proceed — used to show red borders on empty required fields
  const [submitted, setSubmitted] = React.useState(false);

  // Reset "submitted" flag when step changes (so fields don't show red until next attempt)
  React.useEffect(() => {
    setSubmitted(false);
  }, [state.step]);

  // Scroll to top of calculator on step change (only on mobile where space is tight)
  React.useEffect(() => {
    if (scrollRef.current && window.innerWidth < 768) {
      const rect = scrollRef.current.getBoundingClientRect();
      // Only scroll if calculator top is above viewport mid
      if (rect.top < 80 || rect.top > 400) {
        scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [state.step]);

  // Validate current step before allowing next
  const validateCurrentStep = (): boolean => {
    if (state.step === "vehicle") {
      const v = state.vehicle;
      if (!v.brand) { setError("Pilih merek kendaraan dulu."); return false; }
      if (!v.model) { setError("Pilih tipe kendaraan dulu."); return false; }
      if (!v.year) { setError("Pilih tahun kendaraan dulu."); return false; }
      if (!v.vehicleValue) {
        setError("Nilai kendaraan belum tersedia. Masukkan OTR manual.");
        return false;
      }
      // Block if manual OTR is invalid (outside ±15% of database value)
      if (state.manualOtrValidation && !state.manualOtrValidation.isValid) {
        const v = state.manualOtrValidation;
        if (v.isBelow) {
          setError(`Nilai OTR terlalu rendah. Minimum: ${formatIDR(v.min)} (−15% dari database).`);
        } else if (v.isAbove) {
          setError(`Nilai OTR terlalu tinggi. Maksimum: ${formatIDR(v.max)} (+15% dari database).`);
        }
        return false;
      }
    } else if (state.step === "region" || state.step === "protection" || state.step === "extension") {
      // Combined "coverage" step (we use the same state fields, just present them in 1 view)
      if (!state.region.plate) { setError("Pilih wilayah penggunaan."); return false; }
    }
    setError(null);
    return true;
  };

  const handleNext = async () => {
    setSubmitted(true);
    if (!validateCurrentStep()) return;
    // 3-step UI flow: vehicle → coverage → result
    // Internally region/protection/extension are 3 steps but UI presents them as 1,
    // so we skip directly to calculatePremium from any coverage step.
    if (state.step === "vehicle") {
      calc.goToStep("region");
    } else if (state.step === "region" || state.step === "protection" || state.step === "extension") {
      // Any coverage step → calculate directly (no intermediate step)
      await calculatePremium();
    }
  };

  const handleBack = () => {
    if (state.step === "result") {
      // From result, go back to coverage step (region shows CoverageStep UI)
      calc.goToStep("region");
    } else if (state.step === "region" || state.step === "protection" || state.step === "extension") {
      calc.goToStep("vehicle");
    }
  };

  const isResult = state.step === "result";
  const isCoverageStep = state.step === "region" || state.step === "protection" || state.step === "extension";
  const isVehicleStep = state.step === "vehicle";

  // Step number for display: 1 (vehicle), 2 (coverage), 3 (result)
  const stepNumber = isVehicleStep ? 1 : isCoverageStep ? 2 : 3;
  const totalSteps = 3;

  return (
    <div ref={scrollRef} className={`ds-card-calc ${className ?? ""}`}>
      {/* Header */}
      {!hideHeader && (
        <div className="mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">Cek Premi Mobil</h3>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
            Estimasi otomatis dari data kendaraan.
          </p>
        </div>
      )}

      {/* Progress — 3 dots only */}
      {!isResult && (
        <div className="flex items-center gap-2 mb-3">
          {[1, 2].map((n) => (
            <span
              key={n}
              className={`h-1.5 rounded-full transition-all ${
                n === stepNumber ? "w-8 bg-[#0F766E]" : n < stepNumber ? "w-4 bg-[#0F766E]" : "w-4 bg-[#E2E8F0]"
              }`}
              aria-hidden
            />
          ))}
          <span className="text-xs text-[#64748B] ml-auto">
            Langkah {stepNumber} dari {totalSteps - 1}
          </span>
        </div>
      )}

      {/* Step content */}
      <div aria-live="polite">
        {isVehicleStep && <VehicleStep calc={calc} submitted={submitted} />}
        {isCoverageStep && <CoverageStep calc={calc} submitted={submitted} />}
        {isResult && <PremiumResult calc={calc} />}
      </div>

      {/* Error */}
      {state.error && (
        <div
          className="mt-3 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 flex items-start gap-2"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 text-[#B91C1C] flex-shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm text-[#991B1B]">{state.error}</p>
        </div>
      )}

      {/* Navigation buttons — hidden on result step (PremiumResult has its own CTAs) */}
      {!isResult && !state.isLoadingPremium && (
        <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleBack}
            disabled={isVehicleStep}
            className="sm:flex-1"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Kembali
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={state.isLoadingPremium}
            className="sm:flex-[2]"
          >
            {isCoverageStep ? (
              <>
                {state.isLoadingPremium ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="h-4 w-4" aria-hidden />
                )}
                Hitung Premi
              </>
            ) : (
              <>
                Lanjut
                <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
