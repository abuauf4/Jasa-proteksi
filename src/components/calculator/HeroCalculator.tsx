"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useCalculator } from "./useCalculator";
import { VehicleStep, CoverageStep } from "./steps";
import { PremiumResult } from "./PremiumResult";
import { CalculationLoadingScreen } from "./CalculationLoadingScreen";
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
  const router = useRouter();
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
      if (!v.brand) { setError("Pilih merek mobil dulu."); return false; }
      if (!v.model) { setError("Pilih tipe mobil dulu."); return false; }
      if (!v.year) { setError("Pilih tahun keluaran dulu."); return false; }
    } else if (state.step === "region" || state.step === "protection" || state.step === "extension") {
      // Coverage step: wilayah + OTR wajib
      if (!state.region.plate) { setError("Pilih wilayah penggunaan."); return false; }
      if (!state.vehicle.vehicleValue) {
        setError("Nilai kendaraan (OTR) belum terisi. Masukkan manual jika perlu.");
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
    }
    setError(null);
    return true;
  };

  const handleNext = async () => {
    setSubmitted(true);
    if (!validateCurrentStep()) return;
    // 2-step flow: vehicle → coverage → navigate to /hasil-simulasi
    if (state.step === "vehicle") {
      calc.goToStep("region");
    } else if (state.step === "region" || state.step === "protection" || state.step === "extension") {
      // Calculate premium, then navigate to dedicated result page
      const success = await calculatePremium();
      if (success) {
        router.push("/hasil-simulasi");
      }
    }
  };

  const handleBack = () => {
    if (state.step === "result") {
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
      {/* Initial calculation loading — full screen overlay */}
      {state.isCalculatingInitial && <CalculationLoadingScreen />}

      {/* Header row: title + step indicator in 1 line */}
      {!hideHeader && (
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-[#0F172A] tracking-tight whitespace-nowrap">Cek Premi Mobil</h3>
          {!isResult && (
            <span className="text-[13px] font-semibold text-[#64748B] whitespace-nowrap">
              Langkah {stepNumber} dari {totalSteps - 1}
            </span>
          )}
        </div>
      )}
      {!hideHeader && (
        <p className="text-[13px] text-[#475569] mb-3 whitespace-nowrap overflow-hidden text-ellipsis">
          Estimasi otomatis dari data kendaraan.
        </p>
      )}

      {/* Progress — segmented bar */}
      {!isResult && (
        <div className="flex items-center gap-1.5 mb-4" aria-hidden>
          {[1, 2].map((n) => (
            <span
              key={n}
              className={`h-1.5 rounded-full transition-all flex-1 ${
                n <= stepNumber ? "bg-[#0F766E]" : "bg-[#E2E8F0]"
              }`}
            />
          ))}
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

      {/* Navigation buttons — hidden on result step + step 1 (no Kembali on first step) */}
      {!isResult && !state.isCalculatingInitial && (
        <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2">
          {!isVehicleStep && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleBack}
              className="sm:flex-1"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Kembali
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={state.isLoadingPremium || state.isCalculatingInitial}
            className={isVehicleStep ? "w-full" : "sm:flex-[2]"}
          >
            {isCoverageStep ? (
              <>
                {state.isLoadingPremium || state.isCalculatingInitial ? (
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
