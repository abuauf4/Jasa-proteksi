"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useCalculator } from "./useCalculator";
import { STEP_FLOW, STEP_LABELS, type CalculatorStep, type CoverageType } from "./types";
import { VehicleStep, RegionStep, ProtectionStep, ExtensionStep } from "./steps";
import { PremiumResult } from "./PremiumResult";
import { Button } from "@/components/site/Button";
import { trackEvent } from "@/lib/analytics-events";

interface HeroCalculatorProps {
  initialCoverageType?: CoverageType;
  /** Optional className for the outer card wrapper. */
  className?: string;
  /** Hide the header (title + subtitle) — useful when embedded in a section with its own title. */
  hideHeader?: boolean;
  /** Pre-fill step (e.g. user came from /asuransi-mobil-all-risk). */
  startStep?: CalculatorStep;
}

export function HeroCalculator({
  initialCoverageType,
  className,
  hideHeader = false,
  startStep,
}: HeroCalculatorProps) {
  const calc = useCalculator({ initialCoverageType });
  const { state, nextStep, prevStep, calculatePremium, setError } = calc;
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  // Optional start step override
  React.useEffect(() => {
    if (startStep) calc.goToStep(startStep);
  }, [startStep, calc]);

  // Scroll to top of calculator on step change
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state.step]);

  const stepIndex = STEP_FLOW.indexOf(state.step);
  const isResult = state.step === "result";
  const isFirstStep = stepIndex === 0;

  // Per-step validation
  const validateCurrentStep = (): boolean => {
    if (state.step === "vehicle") {
      const v = state.vehicle;
      if (!v.brand) { setError("Silakan pilih merek kendaraan."); return false; }
      if (!v.model) { setError("Silakan pilih tipe kendaraan."); return false; }
      if (!v.year) { setError("Silakan pilih tahun kendaraan."); return false; }
      if (!v.vehicleValue) {
        setError("Nilai kendaraan belum tersedia. Silakan masukkan secara manual.");
        return false;
      }
    } else if (state.step === "region") {
      if (!state.region.plate) { setError("Silakan pilih wilayah penggunaan."); return false; }
    } else if (state.step === "protection") {
      if (!state.protection.coverageType) { setError("Silakan pilih jenis perlindungan."); return false; }
    }
    setError(null);
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;
    if (state.step === "extension") {
      // Last input step — calculate premium
      await calculatePremium();
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  // Hide nav buttons on result step
  const showNavButtons = !isResult && !state.isLoadingPremium;

  return (
    <div ref={scrollRef} className={`ds-card-calc ${className ?? ""}`}>
      {/* Header */}
      {!hideHeader && (
        <div className="mb-5">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Cek Premi Mobil</h3>
          <p className="text-sm text-[#475569] mt-1">
            Lengkapi data kendaraan untuk melihat estimasi premi.
          </p>
        </div>
      )}

      {/* Progress indicator (only on input steps) */}
      {!isResult && (
        <ProgressIndicator stepIndex={stepIndex} />
      )}

      {/* Step content */}
      <div className="mt-5" aria-live="polite">
        {state.step === "vehicle" && <VehicleStep calc={calc} />}
        {state.step === "region" && <RegionStep calc={calc} />}
        {state.step === "protection" && <ProtectionStep calc={calc} />}
        {state.step === "extension" && <ExtensionStep calc={calc} />}
        {state.step === "result" && <PremiumResult calc={calc} />}
      </div>

      {/* Error */}
      {state.error && (
        <div
          className="mt-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3.5 flex items-start gap-2.5"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-[#B91C1C] flex-shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm text-[#991B1B]">{state.error}</p>
        </div>
      )}

      {/* Navigation buttons */}
      {showNavButtons && (
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleBack}
            disabled={isFirstStep}
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
            {state.step === "extension" ? (
              <>
                {state.isLoadingPremium ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="h-4 w-4" aria-hidden />
                )}
                Hitung Estimasi Premi
              </>
            ) : (
              <>
                Lanjutkan
                <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Loading state for premium calc */}
      {state.isLoadingPremium && state.step === "result" && (
        <div className="mt-6 flex items-center justify-center py-8 gap-2 text-[#0F766E]">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          <span className="text-sm font-semibold">Menghitung estimasi premi...</span>
        </div>
      )}
    </div>
  );
}

/* ── Progress indicator: "Langkah X dari 4" + step dots ── */
function ProgressIndicator({ stepIndex }: { stepIndex: number }) {
  const total = STEP_FLOW.length;
  const current = stepIndex + 1;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5" aria-hidden>
        {STEP_FLOW.map((step, idx) => {
          const isComplete = idx < stepIndex;
          const isActive = idx === stepIndex;
          return (
            <span
              key={step}
              className="ds-step-dot"
              data-active={isActive}
              data-complete={isComplete}
            >
              {isComplete ? "✓" : idx + 1}
            </span>
          );
        })}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#64748B]">
          Langkah {current} dari {total}
        </p>
        <p className="text-sm font-semibold text-[#0F172A] truncate">
          {STEP_LABELS[STEP_FLOW[stepIndex]]}
        </p>
      </div>
    </div>
  );
}
