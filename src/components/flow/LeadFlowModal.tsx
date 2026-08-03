"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { openWhatsAppWithConversion } from "@/lib/analytics-events";
import { trackEvent } from "@/lib/conversion";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, User, Phone, Send,
  CheckCircle2, MessageCircle, AlertTriangle, Shield,
  Info, Calculator, ArrowLeft, Handshake, Car,
  ToggleLeft, ToggleRight, ChevronDown, MapPin,
  Sparkles, TrendingUp, Eye, Loader2, Pencil,
  RotateCcw, AlertCircle,
} from "lucide-react";
import { InsuranceProduct } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { getVehicleData, getVehicleDataSync, prefetchVehicleData, type PrefetchedVehicleData } from "@/lib/vehiclePrefetch";
// vehicleCodeMap removed from client bundle — only used server-side

// ─── NEW FLOW ───
// Step 1: Vehicle Selection — Merk → Tipe → Tahun → Auto-lookup value → TLO/All Risk → Add-ons
// Step 2: Premium Simulation — API premium calc → Breakdown → Partner cards
// Step 3: Personal Data — Name + WhatsApp
// Step 4: Result — Confirmation + WhatsApp redirect
// Exit prompt: Only when user closes during result — redirect to chat advisor

type Step = "vehicle-form" | "premium-simulation" | "personal-data" | "result" | "exit-prompt";

type CoverageType = "TLO" | "AllRisk";

interface VehicleData {
  coverageType: CoverageType;
  merk: string;
  tipe: string;
  tahun: string;
  plat: string;
  hargaOtr: string;
  addOns: string[];
}

interface PersonalData {
  customerName: string;
  whatsappNumber: string;
}

interface LeadData {
  id: string;
  customerName: string;
  whatsappNumber: string;
  productName: string;
  estimatedPrice: number;
  minimumOfferPrice: number;
  notes: string | null;
}

interface LeadFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: InsuranceProduct | null;
  /**
   * When true, render the flow content inline without the modal chrome
   * (no AnimatePresence, no backdrop, no close button, no fixed positioning).
   * Used by /produk/[slug] page so the flow lives on a dedicated page
   * instead of inside a modal overlay.
   */
  embedded?: boolean;
}

// Premium API response types
interface PremiumAddOn {
  key: string;
  label: string;
  rate: number;
  premium: number;
}

interface PremiumPartner {
  name: string;
  modifier: number;
  addonModifier: number;
  adminFee: number;
  bengkelAuthorizedExcluded?: boolean;
  estimatedPremium: number;
  benefits: string[];
  facilities: string[];
  availableAddOns: string[];
  breakdown?: {
    basePremium: number;
    addOnPremium: number;
    addons: Array<{ key: string; label: string; premium: number }>;
    totalPremiumBeforeDiscount: number;
    discountPercent: number;
    discountAmount: number;
    adminFee: number;
    policyFee?: number;
  };
}

interface PremiumResponse {
  vehicleValue: number;
  vehicleAge?: number;
  vehicleFound: boolean;
  coverageType: string;
  baseRate: number;
  basePremium: number;
  addOnPremium: number;
  addOns: PremiumAddOn[];
  totalPremiumBeforeDiscount: number;
  discountPercent: number;
  discountAmount: number;
  adminFee: number;
  policyFee: number;
  totalPremium: number;
  isEligible?: boolean;
  ineligibilityReason?: string;
  partners: PremiumPartner[];
}

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const platOptions = [
  "B (Jakarta)", "D (Bandung)", "E (Cirebon)", "F (Bogor)",
  "G (Pekalongan)", "H (Semarang)", "K (Pati)", "L (Surabaya)",
  "M (Madura)", "N (Malang)", "P (Jember)", "S (Bojonegoro)",
  "T (Purwakarta)", "W (Sidoarjo)", "AA (Magelang)", "AB (Yogyakarta)",
  "AD (Surakarta)", "AE (Madiun)", "AG (Kediri)", "BA (Lampung)",
  "BB (Tanggamus)", "BD (Bengkulu)", "BE (Palembang)", "BG (Lahat)",
  "BH (Jambi)", "BK (Padang)", "BL (Batusangkar)", "BM (Riau)",
  "BN (Tanjung Pinang)", "BP (Batam)", "DB (Denpasar)", "DA (Mataram)",
  "DH (Lombok)", "DN (Bima)", "KB (Pontianak)", "KH (Sampit)",
  "KT (Ketapang)", "KU (Sintang)", "KT (Kotawaringin)",
  "EA (Samarinda)", "EB (Balikpapan)", "PA (Makassar)", "PB (Bone)",
  "PC (Pare-Pare)", "RA (Manado)", "RB (Gorontalo)", "RC (Bitung)",
  "TA (Ambon)", "TB (Ternate)", "TL (Sorong)",
];

const ALL_ADDON_KEYS = ["flood", "earthquake", "srcc", "terrorism", "bengkelAuthorized", "tpl", "paDriver", "paPassenger"];
// Addons not available for TLO coverage
const TLO_EXCLUDED_ADDONS = ["bengkelAuthorized"];

// ─── Animated counter hook ───
function useAnimatedValue(target: number, duration: number = 800) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const prevTargetRef = useRef(0);

  useEffect(() => {
    const start = prevTargetRef.current;
    prevTargetRef.current = target;

    if (target === 0 && start === 0) return;

    if (target === 0) {
      // Animate down to 0
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(start + (target - start) * eased));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (target - start) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}

// ─── Step Indicator Component ───
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-500 ${
            i + 1 === current
              ? "w-6 bg-[#0EA5E9]"
              : i + 1 < current
                ? "w-3 bg-[#0EA5E9]/50"
                : "w-3 bg-[#E2E8F0]"
          }`}
        />
      ))}
    </div>
  );
}

export default function LeadFlowModal({
  isOpen,
  onClose,
  product,
  embedded = false,
}: LeadFlowModalProps) {
  const { t } = useLanguage();
  const { settings, loading: settingsLoading } = useSiteSettings();
  const [step, setStep] = useState<Step>("vehicle-form");

  // Lock body scroll when modal is open (skip in embedded mode — page should scroll normally)
  useEffect(() => {
    if (embedded) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, embedded]);

  // Derive vehicleType from product slug for API filtering
  const getVehicleType = (): string => {
    if (!product) return "mobil";
    if (product.slug === "asuransi-motor" || product.slug === "asuransi-motor-listrik") return "motor";
    return "mobil";
  };
  const vehicleType = getVehicleType();

  // Vehicle form state
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    coverageType: "AllRisk",
    merk: "",
    tipe: "",
    tahun: "",
    plat: "",
    hargaOtr: "",
    addOns: [],
  });

  const [prefetchedData, setPrefetchedData] = useState<PrefetchedVehicleData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Derived from prefetched data (instant lookups, no API calls)
  const brands = useMemo(() => prefetchedData?.brands ?? [], [prefetchedData]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [vehicleFound, setVehicleFound] = useState<boolean>(false);
  const [vehicleValueFromApi, setVehicleValueFromApi] = useState<number | null>(null);
  const isLoadingBrands = isLoadingData;
  const isLoadingModels = false; // No more per-dropdown loading
  const isLoadingYears = false;
  const isLoadingVehicle = false;
  const [showManualOtr, setShowManualOtr] = useState(false);
  const [dataNotAvailable, setDataNotAvailable] = useState(false);

  // Premium simulation state
  const [premiumData, setPremiumData] = useState<PremiumResponse | null>(null);
  const [isLoadingPremium, setIsLoadingPremium] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);

  // Personal data state
  const [personalData, setPersonalData] = useState<PersonalData>({
    customerName: "",
    whatsappNumber: "",
  });

  // General state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadData, setLeadData] = useState<LeadData | null>(null);

  // Manual OTR cursor fix — ref-based approach
  const manualOtrInputRef = useRef<HTMLInputElement>(null);
  // Raw OTR value for manual input (unformatted number string)
  const [rawOtrValue, setRawOtrValue] = useState("");

  // Budget submission state
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetNotes, setBudgetNotes] = useState("");
  const [isSubmittingBudget, setIsSubmittingBudget] = useState(false);
  const [budgetSubmitted, setBudgetSubmitted] = useState(false);

  // Coverage eligibility state
  const [coverageWarning, setCoverageWarning] = useState<string | null>(null);
  const [allRiskDisabled, setAllRiskDisabled] = useState(false);
  const [tloDisabled, setTloDisabled] = useState(false);

  // UI state
  const [modelSearch, setModelSearch] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  // Computed: OTR range based on API value
  const otrRange = useMemo(() => {
    const baseValue = vehicleValueFromApi || 0;
    if (!baseValue) return { min: 0, max: 0, minDisplay: "", maxDisplay: "" };
    const min = Math.round(baseValue * 0.85);
    const max = Math.round(baseValue * 1.15);
    return {
      min,
      max,
      minDisplay: formatRupiah(min),
      maxDisplay: formatRupiah(max),
    };
  }, [vehicleValueFromApi]);

  // Computed: check if manual price is within OTR range
  const manualOtrValidation = useMemo(() => {
    if (!showManualOtr || !vehicleValueFromApi) return { isValid: true, isBelow: false, isAbove: false };
    const manualVal = parseInt(vehicleData.hargaOtr.replace(/\D/g, "")) || 0;
    if (!manualVal) return { isValid: true, isBelow: false, isAbove: false };
    const isBelow = manualVal < otrRange.min;
    const isAbove = manualVal > otrRange.max;
    return { isValid: !isBelow && !isAbove, isBelow, isAbove };
  }, [showManualOtr, vehicleData.hargaOtr, vehicleValueFromApi, otrRange]);

  // Computed: display value for vehicle (API or manual)
  const displayVehicleValue = useMemo(() => {
    if (showManualOtr) {
      // Manual input: parse from hargaOtr string
      const manualVal = parseInt(vehicleData.hargaOtr.replace(/\D/g, "")) || 0;
      return manualVal;
    }
    return vehicleValueFromApi || 0;
  }, [showManualOtr, vehicleData.hargaOtr, vehicleValueFromApi]);

  // Animated vehicle value display
  const animatedVehicleValue = useAnimatedValue(displayVehicleValue, 1000);

  // ─── Memoized filtered lists (prevent triple .filter() recomputation) ───
  // Smart filter: startsWith takes priority over includes, selected brand always visible
  const filteredBrands = useMemo(() => {
    if (!brandSearch) return brands;
    const q = brandSearch.toLowerCase();
    const startsWithMatches = brands.filter((b) => b.toLowerCase().startsWith(q));
    const includesMatches = brands.filter((b) => !b.toLowerCase().startsWith(q) && b.toLowerCase().includes(q));
    const selected = vehicleData.merk && !startsWithMatches.includes(vehicleData.merk) && !includesMatches.includes(vehicleData.merk) ? [vehicleData.merk] : [];
    return [...startsWithMatches, ...includesMatches, ...selected];
  }, [brands, brandSearch, vehicleData.merk]);
  const filteredModels = useMemo(() => {
    if (!modelSearch) return models;
    const q = modelSearch.toLowerCase();
    const startsWithMatches = models.filter((m) => m.toLowerCase().startsWith(q));
    const includesMatches = models.filter((m) => !m.toLowerCase().startsWith(q) && m.toLowerCase().includes(q));
    return [...startsWithMatches, ...includesMatches];
  }, [models, modelSearch]);

  // ─── Coverage eligibility check based on vehicle age ───
  useEffect(() => {
    if (!vehicleData.tahun) {
      setCoverageWarning(null);
      setAllRiskDisabled(false);
      setTloDisabled(false);
      return;
    }
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - parseInt(vehicleData.tahun);

    if (vehicleAge > 15) {
      setAllRiskDisabled(true);
      setTloDisabled(true);
      setCoverageWarning(`Kendaraan berusia ${vehicleAge} tahun. Asuransi kendaraan (All Risk & TLO) tidak tersedia untuk kendaraan berusia lebih dari 15 tahun.`);
      // Don't auto-switch, just warn
    } else if (vehicleAge > 12) {
      setAllRiskDisabled(true);
      setTloDisabled(false);
      setCoverageWarning(`Kendaraan berusia ${vehicleAge} tahun. All Risk/Comprehensive tidak tersedia untuk kendaraan berusia lebih dari 12 tahun. Otomatis beralih ke TLO.`);
      // Auto-switch to TLO if currently AllRisk
      if (vehicleData.coverageType === "AllRisk") {
        setVehicleData((prev) => ({ ...prev, coverageType: "TLO", addOns: prev.addOns.filter((a) => !TLO_EXCLUDED_ADDONS.includes(a)) }));
      }
    } else {
      setAllRiskDisabled(false);
      setTloDisabled(false);
      setCoverageWarning(null);
    }
  }, [vehicleData.tahun, vehicleData.coverageType]);

  // ─── Load vehicle data ASAP — don't wait for modal to open! ───
  // This loads on component mount so data is ready when user opens modal
  useEffect(() => {
    // Try sync access first (instant if already cached in memory/localStorage)
    const syncData = getVehicleDataSync(vehicleType);
    if (syncData) {
      setPrefetchedData(syncData);
      setIsLoadingData(false);
      return;
    }

    // Not cached yet — wait for async fetch (likely already started from Portfolio prefetch)
    setIsLoadingData(true);
    getVehicleData(vehicleType).then((data) => {
      if (data) setPrefetchedData(data);
      setIsLoadingData(false);
    });
  }, [vehicleType]); // Only re-run if vehicleType changes (mobil→motor)

  // ─── Instant lookup: models from prefetched data (no API call!) ───
  const lookupModels = useCallback((brand: string): string[] => {
    if (!brand || !prefetchedData) return [];
    return prefetchedData.modelsByBrand[brand] || [];
  }, [prefetchedData]);

  // ─── Instant lookup: years from prefetched data (no API call!) ───
  const lookupYears = useCallback((brand: string, modelDesc: string): string[] => {
    if (!brand || !modelDesc || !prefetchedData) return [];
    return prefetchedData.yearsByBrandModel[brand]?.[modelDesc] || [];
  }, [prefetchedData]);

  // ─── Instant lookup: vehicle value from prefetched data (no API call!) ───
  const lookupVehicleValue = useCallback((brand: string, modelDesc: string, year: string): number | null => {
    if (!brand || !modelDesc || !year || !prefetchedData) return null;
    return prefetchedData.valuesByBrandModelYear[brand]?.[modelDesc]?.[year] ?? null;
  }, [prefetchedData]);

  // Early return after all hooks
  if (!product) return null;

  // ─── Vehicle change handler ───
  const handleVehicleChange = (field: keyof VehicleData, value: string | string[]) => {
    setVehicleData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "coverageType" && value === "TLO") {
        // Remove addons that are not available for TLO
        next.addOns = next.addOns.filter((a) => !TLO_EXCLUDED_ADDONS.includes(a));
      }
      if (field === "merk") {
        next.tipe = "";
        next.tahun = "";
        next.hargaOtr = "";
        setModelSearch("");
        setYears([]);
        setVehicleFound(false);
        setVehicleValueFromApi(null);
        setShowManualOtr(false);
        setDataNotAvailable(false);
        setRawOtrValue("");
        // Only close dropdown when a brand is selected (non-empty), keep open while typing
        if (value) {
          setShowBrandDropdown(false);
        }
        // Instant lookup from prefetched data — NO API CALL!
        if (value) {
          const modelList = lookupModels(value as string);
          setModels(modelList);
        } else {
          setModels([]);
        }
      }
      if (field === "tipe") {
        next.tahun = "";
        next.hargaOtr = "";
        setVehicleFound(false);
        setVehicleValueFromApi(null);
        setShowManualOtr(false);
        setDataNotAvailable(false);
        setRawOtrValue("");
        // Instant lookup from prefetched data — NO API CALL!
        if (value && next.merk) {
          const yearList = lookupYears(next.merk, value as string);
          setYears(yearList);
        } else {
          setYears([]);
        }
      }
      if (field === "tahun" && next.merk && next.tipe && value) {
        // Instant lookup from prefetched data — NO API CALL!
        const val = lookupVehicleValue(next.merk, next.tipe, value as string);
        if (val !== null) {
          next.hargaOtr = val.toLocaleString("id-ID");
          setRawOtrValue(String(val));
          setVehicleValueFromApi(val);
          setVehicleFound(true);
        } else {
          next.hargaOtr = "";
          setRawOtrValue("");
          setVehicleFound(false);
          setVehicleValueFromApi(null);
          setShowManualOtr(true);
          setDataNotAvailable(true);
        }
      }
      return next;
    });
    setError(null);
  };

  const handlePersonalChange = (field: keyof PersonalData, value: string) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const toggleAddOn = (addOnKey: string) => {
    setVehicleData((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(addOnKey)
        ? prev.addOns.filter((a) => a !== addOnKey)
        : [...prev.addOns, addOnKey],
    }));
  };

  // ─── Step 1 → Step 2: Fetch premium simulation ───
  // ─── Auto-scroll to top of flow on step change ───
  // In embedded mode (page), scroll window to top with smooth behavior
  // so user sees the new step's header instead of staying at the previous
  // step's submit button position.
  // In modal mode (legacy), scroll the inner card's scroll container to top.
  const scrollToTopOfFlow = useCallback(() => {
    if (embedded) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Modal mode — find the inner scroll container and scroll it
    const modalCard = document.querySelector('[class*="max-h-[92vh"]');
    if (modalCard) {
      modalCard.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [embedded]);

  const handleVehicleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleData.merk || !vehicleData.tipe || !vehicleData.tahun || !vehicleData.plat || !vehicleData.hargaOtr) {
      setError(t("leadFlow.validationError"));
      return;
    }

    // Move to premium simulation step and fetch data
    setStep("premium-simulation");
    scrollToTopOfFlow();
    setIsLoadingPremium(true);
    setError(null);

    try {
      const otrNum = parseInt(vehicleData.hargaOtr.replace(/\D/g, "")) || 0;
      // Extract plate letter code from format like "B (Jakarta)" → "B"
      const plateLetter = vehicleData.plat.split(' ')[0];
      const body: Record<string, unknown> = {
        brand: vehicleData.merk,
        modelDescription: vehicleData.tipe,
        vehicleYear: parseInt(vehicleData.tahun),
        coverageType: vehicleData.coverageType,
        plateCode: plateLetter,
        addOns: vehicleData.addOns,
        vehicleTypeCategory: vehicleType === "motor" ? "Kendaraan Roda 2" : undefined,
      };

      // If user manually entered price (vehicle not found OR manual override), pass as override
      if (showManualOtr && otrNum > 0) {
        body.vehicleValueOverride = otrNum;
      } else if (!vehicleFound && otrNum > 0) {
        body.vehicleValueOverride = otrNum;
      }

      const res = await fetch("/api/vehicles/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data: PremiumResponse = await res.json();
        setPremiumData(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || t("leadFlow.connectionError"));
        // Go back to vehicle form on error
        setStep("vehicle-form");
        scrollToTopOfFlow();
      }
    } catch {
      setError(t("leadFlow.connectionError"));
      setStep("vehicle-form");
      scrollToTopOfFlow();
    } finally {
      setIsLoadingPremium(false);
    }
  };

  // ─── Step 2 → Step 3: After selecting partner ───
  const handlePartnerSelect = () => {
    if (selectedPartner === null) {
      setError(t("leadFlow.validationError"));
      return;
    }
    setError(null);
    setStep("personal-data");
    scrollToTopOfFlow();
  };

  // ─── Step 3 → Step 4: Submit and create lead ───
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const cleanPhone = personalData.whatsappNumber.replace(/[\s\-+]/g, "");
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      setError(t("leadFlow.phoneError"));
      setIsSubmitting(false);
      return;
    }

    try {
      let productId: string | null = null;
      try {
        // Edge-cached via Cache-Control header on /api/products
        const productsRes = await fetch(`/api/products`);
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const dbProduct = productsData.products?.find((p: { slug: string }) => p.slug === product.slug);
          if (dbProduct) productId = dbProduct.id;
        }
      } catch { /* API not available */ }

      const otrNum = parseInt(vehicleData.hargaOtr.replace(/\D/g, "")) || 0;
      const partnerName = selectedPartner !== null && premiumData?.partners[selectedPartner]
        ? premiumData.partners[selectedPartner].name
        : "";
      const estimatedPremium = selectedPartner !== null && premiumData?.partners[selectedPartner]
        ? premiumData.partners[selectedPartner].estimatedPremium
        : 0;

      const vehicleNotes = `[${vehicleData.coverageType}] ${vehicleData.merk} ${vehicleData.tipe} ${vehicleData.tahun} | Plat: ${vehicleData.plat} | OTR: Rp ${otrNum.toLocaleString("id-ID")}${vehicleData.addOns.length ? ` | Add-on: ${vehicleData.addOns.join(", ")}` : ""}${partnerName ? ` | Partner: ${partnerName}` : ""}${estimatedPremium ? ` | Est. Premi: Rp ${estimatedPremium.toLocaleString("id-ID")}` : ""}`;

      if (productId) {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: personalData.customerName.trim(),
            whatsappNumber: cleanPhone,
            productId,
            notes: vehicleNotes,
            coverageType: vehicleData.coverageType,
            vehicleBrand: vehicleData.merk,
            vehicleType: vehicleData.tipe,
            vehicleYear: vehicleData.tahun,
            plateRegion: vehicleData.plat,
            vehiclePriceOtr: otrNum || null,
            addOns: vehicleData.addOns.length ? JSON.stringify(vehicleData.addOns) : null,
            estimatedPremium: estimatedPremium || null,
            originalPremium: premiumData?.totalPremiumBeforeDiscount || null,
            discountAmount: premiumData?.discountAmount || null,
            adminFee: (selectedPartner !== null && premiumData?.partners[selectedPartner]?.adminFee) || premiumData?.adminFee || null,
            customerBudget: null,
            selectedPartner: partnerName || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || t("leadFlow.connectionError"));
          setIsSubmitting(false);
          return;
        }
        setLeadData({
          id: data.lead.id,
          customerName: data.lead.customerName,
          whatsappNumber: data.lead.whatsappNumber,
          productName: data.lead.productNameSnapshot,
          estimatedPrice: data.lead.estimatedPriceSnapshot,
          minimumOfferPrice: data.lead.minimumOfferPriceSnapshot,
          notes: data.lead.notes,
        });
      } else {
        setLeadData({
          id: `local-${Date.now()}`,
          customerName: personalData.customerName.trim(),
          whatsappNumber: cleanPhone,
          productName: product.name,
          estimatedPrice: product.estimatedPrice,
          minimumOfferPrice: product.minimumOfferPrice,
          notes: vehicleNotes,
        });
      }
      // Track lead submission conversion
      trackEvent("submit_application", {
        method: "kalkulator",
        partner: selectedPartner !== null && premiumData?.partners[selectedPartner] ? premiumData.partners[selectedPartner].name : "",
        value: selectedPartner !== null && premiumData?.partners[selectedPartner] ? premiumData.partners[selectedPartner].estimatedPremium : 0,
        currency: "IDR",
        coverage: vehicleData.coverageType,
        vehicle: `${vehicleData.merk} ${vehicleData.tipe} ${vehicleData.tahun}`,
      });
      setStep("result");
      scrollToTopOfFlow();
    } catch {
      setError(t("leadFlow.connectionError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp click → update lead status
  const handleWhatsAppClick = async (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    // Track conversion event for GA4 + Meta Pixel + Google Ads
    const partnerName = selectedPartner !== null && premiumData?.partners[selectedPartner]
      ? premiumData.partners[selectedPartner].name : undefined;
    const estimatedPremi = selectedPartner !== null && premiumData?.partners[selectedPartner]
      ? premiumData.partners[selectedPartner].estimatedPremium : 0;

    // Fire conversion with event_callback, then open WhatsApp
    openWhatsAppWithConversion(url, {
      method: "lead_flow_result",
      coverage_type: vehicleData.coverageType as "AllRisk" | "TLO",
      estimated_premium: estimatedPremi,
    });

    trackEvent("lead", {
      method: "whatsapp",
      partner: partnerName || "",
      value: estimatedPremi,
      currency: "IDR",
      coverage: vehicleData.coverageType,
      vehicle: `${vehicleData.merk} ${vehicleData.tipe} ${vehicleData.tahun}`,
    });

    // Update lead status (fire-and-forget — don't block navigation)
    if (leadData && !leadData.id.startsWith("local-")) {
      fetch(`/api/leads/${leadData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "whatsapp_clicked" }),
      }).catch(() => {});
    }
  };

  // Budget submission handler
  const handleSubmitBudget = async () => {
    const budgetRaw = parseInt(budgetAmount.replace(/\D/g, "")) || 0;
    if (budgetRaw <= 0) return;

    setIsSubmittingBudget(true);
    try {
      const estimatedPremi = selectedPartner !== null && premiumData?.partners[selectedPartner]
        ? premiumData.partners[selectedPartner].estimatedPremium
        : 0;
      const partnerName = selectedPartner !== null && premiumData?.partners[selectedPartner]
        ? premiumData.partners[selectedPartner].name
        : null;

      if (leadData && !leadData.id.startsWith("local-")) {
        const res = await fetch(`/api/leads/${leadData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit_budget",
            customerBudget: budgetRaw,
            estimatedPremium: estimatedPremi,
            selectedPartner: partnerName,
            budgetNotes: budgetNotes.trim() || undefined,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setError(errData.error || t("leadFlow.connectionError"));
          setIsSubmittingBudget(false);
          return;
        }
      }
      setBudgetSubmitted(true);
    } catch {
      setError(t("leadFlow.connectionError"));
    } finally {
      setIsSubmittingBudget(false);
    }
  };

  const buildWhatsAppUrl = (partnerName?: string, includeBudget?: boolean) => {
    const phone = settings.whatsapp;
    const name = personalData.customerName;
    const otrVal = parseInt(vehicleData.hargaOtr.replace(/\D/g, "")) || 0;
    const estimatedPremi = selectedPartner !== null && premiumData?.partners[selectedPartner]
      ? premiumData.partners[selectedPartner].estimatedPremium
      : 0;
    const budgetRaw = parseInt(budgetAmount.replace(/\D/g, "")) || 0;

    let message = `Halo Jasa Proteksi,\n\nSaya ingin konsultasi mengenai asuransi kendaraan:\n\nNama: ${name}\nProduk: ${product.name}\nJenis: ${vehicleData.coverageType === "TLO" ? "Total Loss Only (TLO)" : "Komprehensif (All Risk)"}\nKendaraan: ${vehicleData.merk} ${vehicleData.tipe} ${vehicleData.tahun}\nPlat: ${vehicleData.plat}\nHarga OTR: Rp ${otrVal.toLocaleString("id-ID")}${vehicleData.addOns.length ? `\nAdd-on: ${vehicleData.addOns.join(", ")}` : ""}${partnerName ? `\n\nSaya tertarik dengan ${partnerName}` : ""}${estimatedPremi ? `\nEstimasi Premi: Rp ${estimatedPremi.toLocaleString("id-ID")}/tahun` : ""}`;

    if (includeBudget && budgetSubmitted && budgetRaw > 0) {
      message += `\n\nSaya mengajukan budget Rp ${budgetRaw.toLocaleString("id-ID")} untuk perlindungan kendaraan saya.`;
    }

    message += `\n\nMohon informasi lebih lanjut. Terima kasih.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Close handling
  const handleCloseClick = () => {
    if (step === "result") {
      setStep("exit-prompt");
      scrollToTopOfFlow();
      return;
    }
    if (step === "exit-prompt") {
      resetAndClose();
      return;
    }
    resetAndClose();
  };

  const handleBackdropClick = () => {
    if (step === "result") {
      setStep("exit-prompt");
      scrollToTopOfFlow();
      return;
    }
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep("vehicle-form");
    setVehicleData({
      coverageType: "AllRisk",
      merk: "",
      tipe: "",
      tahun: "",
      plat: "",
      hargaOtr: "",
      addOns: [],
    });
    setPersonalData({ customerName: "", whatsappNumber: "" });
    setError(null);
    setLeadData(null);
    setSelectedPartner(null);
    setPremiumData(null);
    setModels([]);
    setYears([]);
    setVehicleFound(false);
    setVehicleValueFromApi(null);
    setShowManualOtr(false);
    setDataNotAvailable(false);
    setRawOtrValue("");
    setModelSearch("");
    setShowModelDropdown(false);
    setBrandSearch("");
    setShowBrandDropdown(false);
    setShowBudgetForm(false);
    setBudgetAmount("");
    setBudgetNotes("");
    setIsSubmittingBudget(false);
    setBudgetSubmitted(false);
    setCoverageWarning(null);
    setAllRiskDisabled(false);
    setTloDisabled(false);
    onClose();
  };

  const getStepNumber = () => {
    switch (step) {
      case "vehicle-form": return 1;
      case "premium-simulation": return 2;
      case "personal-data": return 3;
      case "result": return 4;
      default: return 1;
    }
  };

  const otrValue = parseInt(vehicleData.hargaOtr.replace(/\D/g, "")) || product.estimatedPrice;

  return (
    <AnimatePresence>
      {(isOpen || embedded) && (
        <motion.div
          initial={embedded ? false : { opacity: 0 }}
          animate={embedded ? {} : { opacity: 1 }}
          exit={embedded ? {} : { opacity: 0 }}
          transition={embedded ? {} : { duration: 0.4 }}
          className={embedded ? "" : "fixed inset-0 z-[70]"}
        >
          {/* Backdrop — hidden in embedded mode */}
          {!embedded && (
            <div
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm"
              onClick={handleBackdropClick}
            />
          )}

          {/* Modal container — becomes inline wrapper in embedded mode */}
          <motion.div
            initial={embedded ? false : { opacity: 0, y: 40, scale: 0.97 }}
            animate={embedded ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={embedded ? {} : { opacity: 0, y: 20, scale: 0.97 }}
            transition={embedded ? {} : { duration: 0.5, ease: premiumEase }}
            className={
              embedded
                ? "min-h-screen py-6 sm:py-10"
                : "fixed inset-0 z-[71] flex items-end sm:items-center justify-center sm:p-4 overflow-hidden"
            }
            onWheel={(e) => !embedded && e.stopPropagation()}
          >
            <div
              className={
                embedded
                  ? "relative w-full max-w-2xl mx-auto bg-white border border-[#E2E8F0] rounded-2xl shadow-xl safe-pb"
                  : "relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-t-2xl sm:rounded-xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto overscroll-contain safe-pb"
              }
              onWheel={(e) => !embedded && e.stopPropagation()}
            >
              {/* Close button — hidden in embedded mode (page has its own back navigation) */}
              {!embedded && (
                <button
                  onClick={handleCloseClick}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-full transition-colors duration-300 z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Step indicator — shown on steps 1-3 */}
              {step !== "exit-prompt" && (
                <div className={embedded ? "pt-6 pb-2 flex justify-center" : "absolute top-4 left-1/2 -translate-x-1/2 z-10"}>
                  <StepIndicator current={getStepNumber()} total={4} />
                </div>
              )}

              {/* ══════════ STEP 1: VEHICLE SELECTION ══════════ */}
              {step === "vehicle-form" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: premiumEase }}
                >
                  {/* Header */}
                  <div className="relative h-28 bg-gradient-to-br from-[#E0F2FE] via-[#F0F9FF] to-white flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[#0EA5E9]/[0.04] blur-3xl" />
                    <div className="relative text-center">
                      <Car className="w-8 h-8 text-[#0EA5E9]/50 mx-auto mb-1.5" />
                      <h3 className="text-base font-bold text-[#475569] ">
                        {product.name}
                      </h3>
                      <span className="text-[9px] tracking-wider text-[#0EA5E9]/70 uppercase">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pt-5 pb-2">
                    <p className="text-center text-[#475569] text-[10px] tracking-wider uppercase mb-1">
                      {t("leadFlow.step1Label")}
                    </p>
                    <h4 className="text-center text-[#475569] text-sm font-semibold  mb-5">
                      {t("leadFlow.step1Title")}
                    </h4>
                  </div>

                  <form onSubmit={handleVehicleNext} className="px-6 pb-8">
                    <div className="space-y-4">
                      {/* Merk - Searchable dropdown (replaces native select for desktop compatibility) */}
                      <div>
                        <label className="flex items-center gap-1.5 text-[#475569] text-[10px] tracking-wider uppercase mb-2">
                          {t("leadFlow.merkLabel")}
                          {isLoadingBrands && <Loader2 className="w-3 h-3 animate-spin text-[#0EA5E9]" />}
                        </label>
                        <div className="relative">
                          {!isLoadingBrands && brands.length === 0 ? (
                            <input
                              type="text"
                              disabled
                              value=""
                              placeholder="Data belum tersedia"
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#475569] text-sm cursor-not-allowed"
                            />
                          ) : (
                            <>
                              <input
                                type="text"
                                required
                                value={vehicleData.merk || brandSearch}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setBrandSearch(val);
                                  // Only clear merk selection if user is actually typing different text
                                  if (vehicleData.merk && val !== vehicleData.merk) {
                                    handleVehicleChange("merk", "");
                                  }
                                  setShowBrandDropdown(true);
                                }}
                                onFocus={() => {
                                  setBrandSearch(vehicleData.merk || brandSearch);
                                  setShowBrandDropdown(true);
                                }}
                                onBlur={() => setTimeout(() => setShowBrandDropdown(false), 300)}
                                disabled={isLoadingBrands}
                                placeholder={isLoadingBrands ? "Loading..." : t("leadFlow.merkPlaceholder")}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#475569] text-sm placeholder:text-[#475569] focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/20 transition-colors duration-150 disabled:opacity-40"
                              />
                              {showBrandDropdown && brands.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0] rounded-md shadow-xl max-h-48 overflow-y-auto" onMouseDown={(e) => e.preventDefault()}>
                                  {filteredBrands
                                    .slice(0, 50)
                                    .map((merk) => (
                                      <button
                                        key={merk}
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                          handleVehicleChange("merk", merk);
                                          setBrandSearch(merk);
                                          setShowBrandDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs hover:bg-[#0EA5E9]/10 transition-colors ${
                                          vehicleData.merk === merk ? "text-[#0EA5E9] bg-[#0EA5E9]/5" : "text-[#475569]"
                                        }`}
                                      >
                                        {brandSearch ? (() => {
                                          const idx = merk.toLowerCase().indexOf(brandSearch.toLowerCase());
                                          if (idx === -1) return merk;
                                          return <>{merk.slice(0, idx)}<span className="text-[#0EA5E9] font-semibold">{merk.slice(idx, idx + brandSearch.length)}</span>{merk.slice(idx + brandSearch.length)}</>;
                                        })() : merk}
                                      </button>
                                    ))}
                                  {filteredBrands.length > 50 && (
                                    <div className="px-4 py-2 text-[#475569] text-[10px] text-center">
                                      Ketik untuk filter lebih lanjut...
                                    </div>
                                  )}
                                  {filteredBrands.length === 0 && (
                                    <div className="px-4 py-3 text-[#475569] text-[10px] text-center">
                                      Merk tidak ditemukan
                                    </div>
                                  )}
                                </div>
                              )}
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
                            </>
                          )}
                        </div>
                        {!isLoadingBrands && brands.length === 0 && vehicleType === "motor" && (
                          <p className="mt-1.5 text-[10px] text-amber-400/60 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Data kendaraan motor belum tersedia. Silakan hubungi kami untuk informasi lebih lanjut.
                          </p>
                        )}
                      </div>

                      {/* Tipe - Searchable dropdown */}
                      <div>
                        <label className="flex items-center gap-1.5 text-[#475569] text-[10px] tracking-wider uppercase mb-2">
                          {t("leadFlow.tipeLabel")}
                          {isLoadingModels && <Loader2 className="w-3 h-3 animate-spin text-[#0EA5E9]" />}
                        </label>
                        <div className="relative">
                          {vehicleData.merk ? (
                            <>
                              <input
                                type="text"
                                required
                                value={vehicleData.tipe || modelSearch}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setModelSearch(val);
                                  if (vehicleData.tipe && val !== vehicleData.tipe) {
                                    handleVehicleChange("tipe", "");
                                  }
                                  setShowModelDropdown(true);
                                }}
                                onFocus={() => {
                                  setModelSearch(vehicleData.tipe || modelSearch);
                                  setShowModelDropdown(true);
                                }}
                                onBlur={() => setTimeout(() => setShowModelDropdown(false), 300)}
                                placeholder={t("leadFlow.tipePlaceholder")}
                                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#475569] text-sm placeholder:text-[#475569] focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/20 transition-colors duration-150"
                              />
                              {showModelDropdown && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0] rounded-md shadow-xl max-h-48 overflow-y-auto" onMouseDown={(e) => e.preventDefault()}>
                                  {filteredModels
                                    .slice(0, 50)
                                    .map((model) => (
                                      <button
                                        key={model}
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                          handleVehicleChange("tipe", model);
                                          setModelSearch(model);
                                          setShowModelDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-xs hover:bg-[#0EA5E9]/10 transition-colors ${
                                          vehicleData.tipe === model ? "text-[#0EA5E9] bg-[#0EA5E9]/5" : "text-[#475569]"
                                        }`}
                                      >
                                        {modelSearch ? (() => {
                                          const idx = model.toLowerCase().indexOf(modelSearch.toLowerCase());
                                          if (idx === -1) return model;
                                          return <>{model.slice(0, idx)}<span className="text-[#0EA5E9] font-semibold">{model.slice(idx, idx + modelSearch.length)}</span>{model.slice(idx + modelSearch.length)}</>;
                                        })() : model}
                                      </button>
                                    ))}
                                  {filteredModels.length > 50 && (
                                    <div className="px-4 py-2 text-[#475569] text-[10px] text-center">
                                      Ketik untuk filter lebih lanjut...
                                    </div>
                                  )}
                                  {filteredModels.length === 0 && (
                                    <div className="px-4 py-3 text-[#475569] text-[10px] text-center">
                                      Tipe tidak ditemukan
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          ) : (
                            <input
                              type="text"
                              disabled
                              placeholder="Pilih merk terlebih dahulu"
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#475569] text-sm cursor-not-allowed"
                            />
                          )}
                        </div>
                      </div>

                      {/* Tahun & Plat - 2 columns */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="flex items-center gap-1.5 text-[#475569] text-[10px] tracking-wider uppercase mb-2">
                            {t("leadFlow.tahunLabel")}
                            {isLoadingYears && <Loader2 className="w-3 h-3 animate-spin text-[#0EA5E9]" />}
                          </label>
                          <div className="relative">
                            <select
                              required
                              value={vehicleData.tahun}
                              onChange={(e) => handleVehicleChange("tahun", e.target.value)}
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#475569] text-sm appearance-none focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/20 transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
                              disabled={!vehicleData.merk || !vehicleData.tipe}
                            >
                              <option value="" className="bg-white text-[#0F172A]">{t("leadFlow.tahunPlaceholder")}</option>
                              {years.map((tahun) => (
                                <option key={tahun} value={tahun} className="bg-white text-[#0F172A]">{tahun}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-[#475569] text-[10px] tracking-wider uppercase mb-2">
                            <MapPin className="w-3 h-3" /> {t("leadFlow.platLabel")}
                          </label>
                          <div className="relative">
                            <select
                              required
                              value={vehicleData.plat}
                              onChange={(e) => handleVehicleChange("plat", e.target.value)}
                              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#475569] text-sm appearance-none focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/20 transition-all duration-500"
                            >
                              <option value="" className="bg-white text-[#0F172A]">{t("leadFlow.platPlaceholder")}</option>
                              {platOptions.map((plat) => (
                                <option key={plat} value={plat} className="bg-white text-[#0F172A]">{plat}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* ─── Estimasi Nilai Kendaraan (prominent display) ─── */}
                      {vehicleData.merk && vehicleData.tipe && vehicleData.tahun && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: premiumEase }}
                        >
                          {isLoadingVehicle ? (
                            <div className="bg-[#F8FAFC] border border-[#0EA5E9]/10 rounded-lg p-5 text-center">
                              <Loader2 className="w-6 h-6 text-[#0EA5E9]/50 mx-auto mb-2 animate-spin" />
                              <p className="text-[#475569] text-[10px] tracking-wider">Mencari data kendaraan...</p>
                            </div>
                          ) : (vehicleFound && vehicleValueFromApi) || showManualOtr ? (
                            <div className={`relative bg-gradient-to-br via-white to-white rounded-lg p-5 overflow-hidden transition-all duration-300 ${
                              manualOtrValidation.isValid
                                ? "from-[#0EA5E9]/[0.08] border border-[#0EA5E9]/20"
                                : "from-red-500/[0.08] border border-red-500/30"
                            }`}>
                              <div className={`absolute inset-0 blur-2xl transition-colors duration-300 ${
                                manualOtrValidation.isValid ? "bg-[#0EA5E9]/[0.02]" : "bg-red-500/[0.03]"
                              }`} />
                              <div className="relative">
                                <p className="text-[#475569] text-[10px] tracking-wider uppercase mb-1">
                                  {t("leadFlow.vehicleValueLabel")}
                                </p>
                                <motion.p
                                  className={`text-2xl font-bold  mb-2 transition-colors duration-300 ${
                                    manualOtrValidation.isValid ? "text-[#0EA5E9]" : "text-red-400"
                                  }`}
                                  animate={!manualOtrValidation.isValid ? {
                                    x: [0, -4, 4, -4, 4, -2, 2, 0],
                                  } : {}}
                                  transition={{ duration: 0.4 }}
                                >
                                  {formatRupiah(animatedVehicleValue)}
                                </motion.p>

                                {/* OTR Range Info - estimasi harga sederhana */}
                                {vehicleValueFromApi !== null && vehicleValueFromApi > 0 && (
                                  <div className={`rounded-md p-2.5 mb-2 transition-all duration-300 ${
                                    manualOtrValidation.isValid
                                      ? "bg-[#F8FAFC] border border-[#E2E8F0]"
                                      : "bg-red-500/[0.06] border border-red-500/20"
                                  }`}>
                                    <div className="flex items-center gap-1.5">
                                      <Info className={`w-3 h-3 ${
                                        manualOtrValidation.isValid ? "text-[#0EA5E9]/40" : "text-red-400/60"
                                      }`} />
                                      <p className={`text-[10px] tracking-wide transition-colors duration-300 ${
                                        manualOtrValidation.isValid ? "text-[#475569]" : "text-red-400/70"
                                      }`}>
                                        Estimasi harga: {otrRange.minDisplay} – {otrRange.maxDisplay}
                                      </p>
                                    </div>
                                    {!manualOtrValidation.isValid && (
                                      <p className="text-red-400/80 text-[9px] mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                        Harga di luar estimasi
                                      </p>
                                    )}
                                  </div>
                                )}

                                {/* Source label */}
                                {showManualOtr && (
                                  <div className="flex items-center gap-1.5">
                                    <Pencil className="w-3 h-3 text-amber-400/40" />
                                    <p className="text-amber-400/50 text-[9px] tracking-wide">
                                      Harga manual
                                    </p>
                                  </div>
                                )}

                                {/* Manual override link / Revert button */}
                                {!showManualOtr ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowManualOtr(true);
                                      setRawOtrValue(vehicleData.hargaOtr.replace(/\D/g, ""));
                                    }}
                                    className="mt-2.5 flex items-center gap-1 text-[#475569] text-[10px] hover:text-[#475569] transition-colors"
                                  >
                                    <Pencil className="w-2.5 h-2.5" />
                                    {t("leadFlow.manualInput")}
                                  </button>
                                ) : vehicleFound && vehicleValueFromApi ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowManualOtr(false);
                                      setVehicleData(prev => ({
                                        ...prev,
                                        hargaOtr: vehicleValueFromApi.toLocaleString("id-ID"),
                                      }));
                                      setRawOtrValue(String(vehicleValueFromApi));
                                      setError(null);
                                    }}
                                    className="mt-2.5 flex items-center gap-1 text-[#0EA5E9]/40 text-[10px] hover:text-[#0EA5E9]/70 transition-colors"
                                  >
                                    <RotateCcw className="w-2.5 h-2.5" />
                                    Kembali ke harga default
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-amber-500/[0.05] border border-amber-500/10 rounded-lg p-4">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400/60 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-amber-400/70 text-xs font-medium mb-1">
                                    {t("leadFlow.vehicleNotFound")}
                                  </p>
                                  <p className="text-amber-400/40 text-[10px]">
                                    {t("leadFlow.enterManualPrice")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Manual Harga OTR input (shown when vehicle not found or user clicks "Ubah manual") */}
                          {showManualOtr && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3 }}
                              className="mt-3"
                            >
                              <label className="flex items-center gap-1.5 text-[#475569] text-[10px] tracking-wider uppercase mb-2">
                                {t("leadFlow.hargaOtrLabel")}
                              </label>
                              <input
                                ref={manualOtrInputRef}
                                type="text"
                                required
                                inputMode="numeric"
                                value={rawOtrValue ? parseInt(rawOtrValue).toLocaleString("id-ID") : ""}
                                onChange={(e) => {
                                  const rawDigits = e.target.value.replace(/\D/g, "");
                                  if (rawDigits) {
                                    setRawOtrValue(rawDigits);
                                    const formatted = parseInt(rawDigits).toLocaleString("id-ID");
                                    setVehicleData(prev => ({ ...prev, hargaOtr: formatted }));
                                  } else {
                                    setRawOtrValue("");
                                    setVehicleData(prev => ({ ...prev, hargaOtr: "" }));
                                  }
                                  setError(null);
                                }}
                                onBlur={() => {
                                  // Finalize: ensure hargaOtr is properly formatted
                                  if (rawOtrValue) {
                                    const formatted = parseInt(rawOtrValue).toLocaleString("id-ID");
                                    setVehicleData(prev => ({ ...prev, hargaOtr: formatted }));
                                  }
                                }}
                                placeholder={t("leadFlow.hargaOtrPlaceholder")}
                                className={`w-full bg-[#F8FAFC] rounded-md px-4 py-3 text-sm font-semibold placeholder:text-[#475569] focus:outline-none focus:ring-1 transition-all duration-300 ${
                                  manualOtrValidation.isValid
                                    ? "border border-[#E2E8F0] text-[#0EA5E9] focus:border-[#0EA5E9]/40 focus:ring-[#0EA5E9]/20"
                                    : "border border-red-500/40 text-red-400 focus:border-red-500/60 focus:ring-red-500/20"
                                }`}
                              />
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* Coverage Type Toggle */}
                      <div>
                        <label className="flex items-center gap-1.5 text-[#475569] text-[10px] tracking-wider uppercase mb-2">
                          <Shield className="w-3 h-3" /> {t("leadFlow.coverageTypeLabel")}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => !tloDisabled && handleVehicleChange("coverageType", "TLO")}
                            disabled={tloDisabled}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md border text-xs font-medium tracking-wider transition-all duration-500 ${
                              tloDisabled
                                ? "bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] cursor-not-allowed opacity-40"
                                : vehicleData.coverageType === "TLO"
                                  ? "bg-[#0EA5E9]/15 border-[#0EA5E9]/40 text-[#0EA5E9]"
                                  : "bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:border-[#E2E8F0]"
                            }`}
                          >
                            <ToggleLeft className="w-3.5 h-3.5" />
                            {t("leadFlow.tlo")}
                          </button>
                          <button
                            type="button"
                            onClick={() => !allRiskDisabled && handleVehicleChange("coverageType", "AllRisk")}
                            disabled={allRiskDisabled}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md border text-xs font-medium tracking-wider transition-all duration-500 ${
                              allRiskDisabled
                                ? "bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] cursor-not-allowed opacity-40"
                                : vehicleData.coverageType === "AllRisk"
                                  ? "bg-[#0EA5E9]/15 border-[#0EA5E9]/40 text-[#0EA5E9]"
                                  : "bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:border-[#E2E8F0]"
                            }`}
                          >
                            <ToggleRight className="w-3.5 h-3.5" />
                            {t("leadFlow.allRisk")}
                          </button>
                        </div>
                        {/* Coverage eligibility warning */}
                        {coverageWarning && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-2 flex items-start gap-2 bg-amber-500/[0.06] border border-amber-500/10 rounded-md p-2.5"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400/70 mt-0.5 flex-shrink-0" />
                            <p className="text-amber-400/70 text-[10px] leading-relaxed">{coverageWarning}</p>
                          </motion.div>
                        )}
                      </div>

                      {/* Add-on */}
                      <div>
                        <label className="flex items-center gap-1.5 text-[#475569] text-[10px] tracking-wider uppercase mb-2">
                          {t("leadFlow.addonLabel")}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(vehicleData.coverageType === "TLO" ? ALL_ADDON_KEYS.filter((k) => !TLO_EXCLUDED_ADDONS.includes(k)) : ALL_ADDON_KEYS).map((key) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => toggleAddOn(key)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-[10px] transition-all duration-500 ${
                                vehicleData.addOns.includes(key)
                                  ? "bg-[#0EA5E9]/10 border-[#0EA5E9]/30 text-[#0EA5E9]"
                                  : "bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:border-[#E2E8F0]"
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                vehicleData.addOns.includes(key) ? "bg-[#0EA5E9]" : "bg-white/15"
                              }`} />
                              {t(`leadFlow.addonItems.${key}`)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex items-start gap-2"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80 mt-0.5 flex-shrink-0" />
                        <p className="text-amber-400/80 text-xs">{error}</p>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={!vehicleData.merk || !vehicleData.tipe || !vehicleData.tahun || !vehicleData.plat || !vehicleData.hargaOtr || isLoadingVehicle || (allRiskDisabled && tloDisabled) || !manualOtrValidation.isValid}
                      className="w-full mt-6 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#F97316] text-white font-semibold tracking-wider text-sm hover:bg-[#EA580C] transition-all duration-600 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Calculator className="w-4 h-4" />
                      {t("leadFlow.viewRecommendation")}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ══════════ STEP 2: PREMIUM SIMULATION ══════════ */}
              {step === "premium-simulation" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: premiumEase }}
                >
                  {/* Back button */}
                  <button
                    onClick={() => { setStep("vehicle-form"); setSelectedPartner(null); setError(null); scrollToTopOfFlow(); }}
                    className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center text-[#475569] hover:text-[#475569] transition-colors duration-500 z-10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  {/* Header */}
                  <div className="px-6 pt-8 pb-2 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-[#0EA5E9]" />
                    </div>
                    <p className="text-[#475569] text-[10px] tracking-wider uppercase mb-1">
                      {t("leadFlow.step2Label")}
                    </p>
                    <h4 className="text-[#475569] text-sm font-semibold  mb-1">
                      {t("leadFlow.step2Title")}
                    </h4>
                  </div>

                  <div className="px-6 pb-8">
                    {isLoadingPremium ? (
                      /* Loading state */
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 text-center"
                      >
                        <div className="relative w-16 h-16 mx-auto mb-4">
                          <div className="absolute inset-0 rounded-full border-2 border-[#0EA5E9]/10" />
                          <div className="absolute inset-0 rounded-full border-2 border-t-[#0EA5E9] animate-spin" />
                          <Calculator className="absolute inset-0 m-auto w-5 h-5 text-[#0EA5E9]/50" />
                        </div>
                        <p className="text-[#475569] text-sm font-medium mb-1">
                          {t("leadFlow.simulating")}
                        </p>
                        <p className="text-[#475569] text-[10px]">
                          {vehicleData.merk} {vehicleData.tipe} {vehicleData.tahun}
                        </p>
                      </motion.div>
                    ) : premiumData ? (
                      /* Premium simulation results */
                      <div className="space-y-4">
                        {/* Vehicle value summary */}
                        <div className="bg-gradient-to-br from-[#0EA5E9]/[0.06] via-white to-white border border-[#0EA5E9]/15 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[#475569] text-[10px] tracking-wider uppercase">
                              {t("leadFlow.vehicleValueLabel")}
                            </p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              vehicleData.coverageType === "AllRisk"
                                ? "bg-[#0EA5E9]/10 text-[#0EA5E9]/70"
                                : "bg-amber-500/10 text-amber-400/70"
                            }`}>
                              {vehicleData.coverageType === "AllRisk" ? "All Risk" : "TLO"}
                            </span>
                          </div>
                          <p className="text-xl font-bold text-[#0EA5E9] ">
                            {formatRupiah(premiumData.vehicleValue)}
                          </p>
                          {showManualOtr ? (
                            <div className="flex items-center gap-1.5 mt-1">
                              <Pencil className="w-3 h-3 text-amber-400/40" />
                              <p className="text-amber-400/50 text-[9px] tracking-wide">
                                Harga manual
                              </p>
                            </div>
                          ) : null}
                        </div>

                        {/* Ineligibility warning from API */}
                        {premiumData.isEligible === false && premiumData.ineligibilityReason && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2 bg-amber-500/[0.06] border border-amber-500/10 rounded-md p-3"
                          >
                            <AlertTriangle className="w-4 h-4 text-amber-400/70 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-amber-400/80 text-xs font-medium mb-0.5">Perhatian</p>
                              <p className="text-amber-400/60 text-[10px] leading-relaxed">{premiumData.ineligibilityReason}</p>
                            </div>
                          </motion.div>
                        )}

                        {/* Partner selection - vertical stack (was horizontal slider) */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-[#475569] text-[10px] tracking-wider uppercase">
                              {t("leadFlow.selectPartner")}
                            </p>
                            <span className="text-[#64748B] text-[9px]">
                              {premiumData.partners.length} {t("leadFlow.partnerCard.estimatedPremium") ? "partner" : ""}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {premiumData.partners.map((partner, i) => {
                              const isSelected = selectedPartner === i;
                              return (
                                <motion.div
                                  key={partner.name}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05, duration: 0.3, ease: premiumEase }}
                                >
                                  <div
                                    className={`rounded-lg border p-4 transition-all duration-300 cursor-pointer ${
                                      isSelected
                                        ? "bg-[#0EA5E9]/[0.07] border-[#0EA5E9]/30 ring-1 ring-[#0EA5E9]/20"
                                        : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#0EA5E9]/30"
                                    }`}
                                    onClick={() => setSelectedPartner(i)}
                                  >
                                    {/* Partner Header */}
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <h4 className="text-sm font-bold  text-[#475569]">
                                          {partner.name}
                                        </h4>
                                        <span className="text-[10px] text-[#0EA5E9]/70 tracking-wider">
                                          {vehicleData.coverageType === "AllRisk" ? "Komprehensif" : "TLO"}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-[#475569] text-[9px] tracking-wider uppercase">
                                          {t("leadFlow.partnerCard.estimatedPremium")}
                                        </p>
                                        <p className="text-lg font-bold text-[#0EA5E9] ">
                                          {formatRupiah(partner.estimatedPremium)}
                                        </p>
                                        <p className="text-[#475569] text-[9px]">{t("leadFlow.perYear")}</p>
                                      </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    {partner.bengkelAuthorizedExcluded && vehicleData.addOns.includes("bengkelAuthorized") && (
                                      <div className="bg-amber-500/5 border border-amber-500/15 rounded-md px-2.5 py-2 mb-2 flex items-start gap-1.5">
                                        <AlertCircle className="w-3 h-3 text-amber-500/60 mt-0.5 flex-shrink-0" />
                                        <span className="text-amber-600/70 text-[9px] leading-relaxed">
                                          Bengkel Resmi tidak tersedia untuk kendaraan di atas batas umur partner ini
                                        </span>
                                      </div>
                                    )}
                                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-md p-2.5 mb-3 space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[#475569] text-[10px]">{t("leadFlow.basePremium")}</span>
                                        <span className="text-[#475569] text-[10px] font-medium">{formatRupiah(partner.breakdown?.basePremium ?? premiumData.basePremium)}</span>
                                      </div>
                                      {(partner.breakdown?.addons ?? premiumData.addOns).length > 0 && (
                                        <div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-[#475569] text-[10px]">{t("leadFlow.addOnPremium")}</span>
                                            <span className="text-[#475569] text-[10px] font-medium">{formatRupiah(partner.breakdown?.addOnPremium ?? premiumData.addOnPremium)}</span>
                                          </div>
                                          <div className="ml-2 mt-0.5 space-y-0.5">
                                            {(partner.breakdown?.addons ?? premiumData.addOns).map((addon) => (
                                              <div key={addon.key} className="flex justify-between items-center">
                                                <span className="text-[#64748B] text-[9px]">↳ {addon.label}</span>
                                                <span className="text-[#64748B] text-[9px]">{formatRupiah(addon.premium)}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      <div className="pt-1 border-t border-dashed border-[#E2E8F0]">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[#475569] text-[10px] font-medium">Subtotal</span>
                                          <span className="text-[#475569] text-[10px] font-medium">{formatRupiah(partner.breakdown?.totalPremiumBeforeDiscount ?? premiumData.totalPremiumBeforeDiscount)}</span>
                                        </div>
                                      </div>
                                      {(partner.breakdown?.discountAmount ?? premiumData.discountAmount) > 0 && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-emerald-600 text-[10px] flex items-center gap-1">
                                            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500/10 text-emerald-600 text-[8px] font-bold leading-3 text-center">−</span>
                                            Diskon {partner.breakdown?.discountPercent ?? premiumData.discountPercent}%
                                          </span>
                                          <span className="text-emerald-600 text-[10px] font-medium">−{formatRupiah(partner.breakdown?.discountAmount ?? premiumData.discountAmount)}</span>
                                        </div>
                                      )}
                                      {(partner.breakdown?.adminFee ?? partner.adminFee) > 0 && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-[#475569] text-[10px]">Biaya admin</span>
                                          <span className="text-[#475569] text-[10px] font-medium">{formatRupiah(partner.breakdown?.adminFee ?? partner.adminFee)}</span>
                                        </div>
                                      )}
                                      <div className="pt-1 border-t border-[#0EA5E9]/20">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[#0EA5E9] text-[11px] font-bold ">Total</span>
                                          <span className="text-[#0EA5E9] text-[11px] font-bold ">{formatRupiah(partner.estimatedPremium)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Benefits */}
                                    <div className="mb-3">
                                      <p className="text-[#475569] text-[9px] tracking-wider uppercase mb-1.5">
                                        {t("leadFlow.partnerCard.mainBenefit")}
                                      </p>
                                      <div className="grid grid-cols-2 gap-1">
                                        {partner.benefits.slice(0, 4).map((b, j) => (
                                          <div key={j} className="flex items-center gap-1 text-[#475569] text-[10px]">
                                            <div className="w-1 h-1 rounded-full bg-[#0EA5E9]/50 flex-shrink-0" />
                                            <span>{b}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Facilities */}
                                    <div className="mb-3">
                                      <p className="text-[#475569] text-[9px] tracking-wider uppercase mb-1.5">
                                        {t("leadFlow.partnerCard.facilities")}
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {partner.facilities.map((f, j) => (
                                          <span key={j} className="text-[9px] px-2 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[#475569]">
                                            {f}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Selection indicator */}
                                    {isSelected && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-3 pt-3 border-t border-[#0EA5E9]/20"
                                      >
                                        <div className="flex items-center gap-2 text-[#0EA5E9] text-xs">
                                          <CheckCircle2 className="w-4 h-4" />
                                          <span className="font-medium">
                                            {t("leadFlow.partnerCard.chooseAndConsult")}
                                          </span>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex items-start gap-2"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80 mt-0.5 flex-shrink-0" />
                            <p className="text-amber-400/80 text-xs">{error}</p>
                          </motion.div>
                        )}

                        {/* Navigation buttons */}
                        <div className="flex gap-3 mt-4">
                          <button
                            type="button"
                            onClick={() => { setStep("vehicle-form"); setSelectedPartner(null); setError(null); scrollToTopOfFlow(); }}
                            className="flex-1 px-5 py-3 border border-[#E2E8F0] text-[#475569] text-xs font-medium tracking-wider hover:border-[#0EA5E9]/30 transition-all duration-500 rounded-md"
                          >
                            {t("leadFlow.back")}
                          </button>
                          <button
                            type="button"
                            onClick={handlePartnerSelect}
                            disabled={selectedPartner === null}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#0EA5E9] text-white text-xs font-semibold tracking-wider hover:bg-[#0284C7] transition-all duration-500 rounded-md disabled:opacity-40"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            {t("leadFlow.nextStep")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Error state when premium fails */
                      <div className="py-8 text-center">
                        <AlertTriangle className="w-8 h-8 text-amber-400/40 mx-auto mb-3" />
                        <p className="text-[#475569] text-xs mb-4">{error || t("leadFlow.connectionError")}</p>
                        <button
                          type="button"
                          onClick={() => { setStep("vehicle-form"); setError(null); scrollToTopOfFlow(); }}
                          className="px-5 py-2.5 border border-[#E2E8F0] text-[#475569] text-xs font-medium tracking-wider hover:border-[#0EA5E9]/30 transition-all duration-500 rounded-md"
                        >
                          {t("leadFlow.back")}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ══════════ STEP 3: PERSONAL DATA ══════════ */}
              {step === "personal-data" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: premiumEase }}
                >
                  {/* Back button */}
                  <button
                    onClick={() => { setStep("premium-simulation"); setError(null); scrollToTopOfFlow(); }}
                    className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center text-[#475569] hover:text-[#475569] transition-colors duration-500 z-10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="px-6 pt-8 pb-2 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center mx-auto mb-3">
                      <User className="w-6 h-6 text-[#0EA5E9]" />
                    </div>
                    <p className="text-[#475569] text-[10px] tracking-wider uppercase mb-1">
                      {t("leadFlow.step3Label")}
                    </p>
                    <h4 className="text-[#475569] text-sm font-semibold  mb-1">
                      {t("leadFlow.step3Title")}
                    </h4>
                    <p className="text-[#475569] text-[10px]">{t("leadFlow.step2Subtitle")}</p>
                  </div>

                  {/* Selected partner mini-summary */}
                  {selectedPartner !== null && premiumData?.partners[selectedPartner] && (
                    <div className="mx-6 mb-3 bg-[#0EA5E9]/[0.05] border border-[#0EA5E9]/15 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#475569] text-[10px]">{premiumData.partners[selectedPartner].name}</p>
                          <p className="text-[#0EA5E9] text-sm font-bold ">
                            {formatRupiah(premiumData.partners[selectedPartner].estimatedPremium)}
                            <span className="text-[#0EA5E9]/40 text-[10px] font-normal">/{t("leadFlow.perYear")}</span>
                          </p>
                          {premiumData.partners[selectedPartner].adminFee > 0 && (
                            <p className="text-[9px] text-[#64748B] mt-0.5">
                              Termasuk biaya admin {formatRupiah(premiumData.partners[selectedPartner].adminFee)}
                            </p>
                          )}
                        </div>
                        <Shield className="w-4 h-4 text-[#0EA5E9]/30" />
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmitLead} className="px-6 pb-8">
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-1.5 text-[#475569] text-[10px] tracking-wider uppercase mb-2">
                          <User className="w-3 h-3" /> {t("leadFlow.nameLabel")}
                        </label>
                        <input
                          type="text"
                          required
                          minLength={2}
                          value={personalData.customerName}
                          onChange={(e) => handlePersonalChange("customerName", e.target.value)}
                          placeholder={t("leadFlow.namePlaceholder")}
                          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#475569] text-sm placeholder:text-[#475569] focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/20 transition-all duration-500"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-1.5 text-[#475569] text-[10px] tracking-wider uppercase mb-2">
                          <Phone className="w-3 h-3" /> {t("leadFlow.whatsappLabel")}
                        </label>
                        <input
                          type="tel"
                          required
                          pattern="[0-9+\-\s]{10,15}"
                          value={personalData.whatsappNumber}
                          onChange={(e) => handlePersonalChange("whatsappNumber", e.target.value)}
                          placeholder={t("leadFlow.whatsappPlaceholder")}
                          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-4 py-3 text-[#475569] text-sm placeholder:text-[#475569] focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/20 transition-all duration-500"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex items-start gap-2"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80 mt-0.5 flex-shrink-0" />
                        <p className="text-amber-400/80 text-xs">{error}</p>
                      </motion.div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => { setStep("premium-simulation"); setError(null); scrollToTopOfFlow(); }}
                        className="flex-1 px-5 py-3 border border-[#E2E8F0] text-[#475569] text-xs font-medium tracking-wider hover:border-[#0EA5E9]/30 transition-all duration-500 rounded-md"
                      >
                        {t("leadFlow.back")}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !personalData.customerName || !personalData.whatsappNumber}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#0EA5E9] text-white text-xs font-semibold tracking-wider hover:bg-[#0284C7] transition-all duration-500 rounded-md disabled:opacity-40"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-[#E2E8F0] border-t-[#0EA5E9] rounded-full animate-spin" />
                        ) : (
                          <><Send className="w-3.5 h-3.5" /> {t("leadFlow.nextStep")}</>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ══════════ STEP 4: RESULT / CONFIRMATION ══════════ */}
              {step === "result" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: premiumEase }}
                >
                  {/* Header */}
                  <div className="px-6 pt-8 pb-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-[#0EA5E9]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#475569]  mb-1">
                      {t("leadFlow.resultTitle")}
                    </h3>
                    <p className="text-[#475569] text-[10px]">{t("leadFlow.resultSubtitle")}</p>
                  </div>

                  <div className="px-6 pb-8">
                    {/* Vehicle Summary */}
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 mb-5">
                      <p className="text-[#475569] text-[10px] tracking-wider uppercase mb-3">{t("leadFlow.vehicleSummary")}</p>
                      <div className="space-y-2.5">
                        {/* Kendaraan — merk + tipe di baris sendiri */}
                        <div>
                          <p className="text-[#475569] text-xs font-semibold leading-snug">
                            {vehicleData.merk} {vehicleData.tipe}
                          </p>
                          <p className="text-[#64748B] text-[10px] mt-0.5">
                            {vehicleData.tahun} — {vehicleData.plat}
                          </p>
                        </div>
                        {/* Jenis Perlindungan */}
                        <div className="flex justify-between items-center">
                          <span className="text-[#64748B] text-xs">{t("leadFlow.coverageType")}</span>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            vehicleData.coverageType === "AllRisk"
                              ? "bg-[#0EA5E9]/10 text-[#0EA5E9]"
                              : "bg-amber-500/10 text-amber-600"
                          }`}>
                            {vehicleData.coverageType === "TLO" ? "TLO" : "All Risk"}
                          </span>
                        </div>
                        {/* Estimasi Nilai Kendaraan */}
                        <div className="flex justify-between items-center">
                          <span className="text-[#64748B] text-xs">{t("leadFlow.vehicleValueLabel")}</span>
                          <span className="text-[#475569] text-xs font-semibold">{formatRupiah(otrValue)}</span>
                        </div>
                        {/* Add-on */}
                        {vehicleData.addOns.length > 0 && (
                          <div className="pt-2 border-t border-[#E2E8F0]">
                            <p className="text-[#64748B] text-[10px] tracking-wider uppercase mb-1.5">Add-on</p>
                            <div className="flex flex-wrap gap-1.5">
                              {vehicleData.addOns.map((k) => (
                                <span key={k} className="text-[9px] px-2 py-0.5 bg-[#0EA5E9]/[0.05] border border-[#0EA5E9]/10 rounded text-[#0EA5E9]/60">
                                  {t(`leadFlow.addonItems.${k}`)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected Partner Summary */}
                    {selectedPartner !== null && premiumData?.partners[selectedPartner] && (
                      <div className="bg-gradient-to-br from-[#0EA5E9]/[0.08] via-white to-white border border-[#0EA5E9]/20 rounded-lg p-5 mb-5">
                        <p className="text-[#475569] text-[10px] tracking-wider uppercase mb-2">
                          {t("leadFlow.simulationTitle")}
                        </p>
                        <h4 className="text-base font-bold text-[#475569]  mb-3">
                          {premiumData.partners[selectedPartner].name}
                        </h4>

                        {/* Rincian harga */}
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[#64748B] text-[11px]">Harga sebelum diskon</span>
                            <span className="text-[#64748B] text-[11px] line-through">{formatRupiah(premiumData.totalPremiumBeforeDiscount)}</span>
                          </div>
                          {premiumData.discountAmount > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-emerald-600 text-[11px]">Diskon {premiumData.discountPercent}%</span>
                              <span className="text-emerald-600 text-[11px] font-medium">−{formatRupiah(premiumData.discountAmount)}</span>
                            </div>
                          )}
                          {premiumData.adminFee > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-[#64748B] text-[11px]">Biaya Administrasi</span>
                              <span className="text-[#64748B] text-[11px]">{formatRupiah(premiumData.partners[selectedPartner].adminFee || premiumData.adminFee)}</span>
                            </div>
                          )}
                          {premiumData.policyFee > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-[#64748B] text-[11px]">Biaya Polis</span>
                              <span className="text-[#64748B] text-[11px]">{formatRupiah(premiumData.policyFee)}</span>
                            </div>
                          )}
                        </div>

                        {/* Harga final */}
                        <div className="pt-2 border-t border-[#0EA5E9]/15">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[#0EA5E9] text-sm font-bold ">Harga setelah diskon</span>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-[#0EA5E9]  leading-tight">
                                {formatRupiah(premiumData.partners[selectedPartner].estimatedPremium)}
                              </p>
                              <p className="text-[#0EA5E9]/40 text-[10px]">{t("leadFlow.perYear")}</p>
                            </div>
                          </div>
                        </div>

                        {/* Benefits tags */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {premiumData.partners[selectedPartner].benefits.slice(0, 3).map((b, j) => (
                            <span key={j} className="text-[9px] px-2 py-0.5 bg-[#0EA5E9]/[0.05] border border-[#0EA5E9]/10 rounded text-[#0EA5E9]/60">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─── Primary CTA: Lanjut Konsultasi (WhatsApp) ─── */}
                    {!budgetSubmitted && (
                      <a
                        href={buildWhatsAppUrl(
                          selectedPartner !== null && premiumData?.partners[selectedPartner]
                            ? premiumData.partners[selectedPartner].name
                            : undefined,
                          false
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e: React.MouseEvent) => handleWhatsAppClick(e, buildWhatsAppUrl(
                          selectedPartner !== null && premiumData?.partners[selectedPartner]
                            ? premiumData.partners[selectedPartner].name
                            : undefined,
                          false
                        ))}
                        className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#F97316] text-white font-semibold tracking-wider text-sm hover:bg-[#EA580C] transition-all duration-600 rounded-md"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {t("leadFlow.consultWhatsApp")}
                      </a>
                    )}

                    {/* ─── Budget Submission Section ─── */}
                    {!budgetSubmitted ? (
                      <>
                        {/* Secondary subtle CTA: Diskusikan Budget Anda */}
                        {!showBudgetForm ? (
                          <div className="mt-3 text-center">
                            <button
                              type="button"
                              onClick={() => setShowBudgetForm(true)}
                              className="text-[#475569] text-[11px] hover:text-[#475569] transition-colors underline underline-offset-2"
                            >
                              {t("leadFlow.discussBudget")}
                            </button>
                          </div>
                        ) : (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: premiumEase }}
                              className="mt-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 overflow-hidden"
                            >
                              <p className="text-[#475569] text-xs mb-3 leading-relaxed">
                                <Handshake className="w-3 h-3 inline mr-1 text-[#64748B]" />
                                {t("leadFlow.budgetAdvisorMessage")}
                              </p>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-[#475569] text-[10px] tracking-wider uppercase mb-1.5 block">
                                    {t("leadFlow.budgetLabel")}
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    inputMode="numeric"
                                    value={budgetAmount}
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(/\D/g, "");
                                      const formatted = raw ? parseInt(raw).toLocaleString("id-ID") : "";
                                      setBudgetAmount(formatted);
                                    }}
                                    placeholder={t("leadFlow.budgetPlaceholder")}
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-4 py-2.5 text-[#0EA5E9] text-sm font-semibold placeholder:text-[#475569] focus:outline-none focus:border-[#0EA5E9]/30 focus:ring-1 focus:ring-[#0EA5E9]/15 transition-all duration-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[#475569] text-[10px] tracking-wider uppercase mb-1.5 block">
                                    {t("leadFlow.budgetNotesLabel")}
                                  </label>
                                  <textarea
                                    value={budgetNotes}
                                    onChange={(e) => setBudgetNotes(e.target.value)}
                                    placeholder={t("leadFlow.budgetNotesPlaceholder")}
                                    rows={2}
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-4 py-2.5 text-[#475569] text-xs placeholder:text-[#475569] focus:outline-none focus:border-[#0EA5E9]/30 focus:ring-1 focus:ring-[#0EA5E9]/15 transition-all duration-500 resize-none"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={handleSubmitBudget}
                                  disabled={isSubmittingBudget || !budgetAmount || parseInt(budgetAmount.replace(/\D/g, "")) <= 0}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500/10 border border-purple-500/20 text-[#0EA5E9] text-xs font-semibold tracking-wider hover:bg-purple-500/15 hover:border-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-500 rounded-md"
                                >
                                  {isSubmittingBudget ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      {t("leadFlow.budgetSubmitting")}
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-3.5 h-3.5" />
                                      {t("leadFlow.budgetSubmitButton")}
                                    </>
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </>
                    ) : (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: premiumEase }}
                          className="mt-4 bg-purple-500/[0.06] border border-purple-500/15 rounded-lg p-4 text-center"
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#64748B] mx-auto mb-2" />
                          <p className="text-[#0EA5E9] text-xs font-semibold mb-1">
                            {t("leadFlow.budgetSuccessTitle")}
                          </p>
                          <p className="text-[#475569] text-[10px] leading-relaxed mb-3">
                            {t("leadFlow.budgetSuccessDesc")}
                          </p>
                          <a
                            href={buildWhatsAppUrl(
                              selectedPartner !== null && premiumData?.partners[selectedPartner]
                                ? premiumData.partners[selectedPartner].name
                                : undefined,
                              true
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e: React.MouseEvent) => handleWhatsAppClick(e, buildWhatsAppUrl(
                              selectedPartner !== null && premiumData?.partners[selectedPartner]
                                ? premiumData.partners[selectedPartner].name
                                : undefined,
                              true
                            ))}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0EA5E9] text-white text-sm font-semibold tracking-wider hover:bg-[#0284C7] transition-all duration-500 rounded-md"
                          >
                            <MessageCircle className="w-4 h-4" />
                            {t("leadFlow.budgetConsultButton")}
                          </a>
                        </motion.div>
                      </AnimatePresence>
                    )}

                    <p className="text-center text-[#475569] text-[10px] mt-5 leading-relaxed">
                      {t("leadFlow.closeHint")}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ══════════ EXIT PROMPT ══════════ */}
              {step === "exit-prompt" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: premiumEase }}
                  className="px-6 py-10 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center mx-auto mb-4">
                    <Handshake className="w-6 h-6 text-[#0EA5E9]/70" />
                  </div>

                  <h4 className="text-[#475569] font-semibold text-base mb-2 ">
                    {t("leadFlow.exitPromptTitle")}
                  </h4>
                  <p className="text-[#475569] text-xs leading-relaxed mb-6 max-w-sm mx-auto">
                    {t("leadFlow.exitPromptDesc")}
                  </p>

                  <div className="flex flex-col gap-3">
                    <a
                      href={buildWhatsAppUrl(
                        selectedPartner !== null && premiumData?.partners[selectedPartner]
                          ? premiumData.partners[selectedPartner].name
                          : undefined
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e: React.MouseEvent) => handleWhatsAppClick(e, buildWhatsAppUrl(
                        selectedPartner !== null && premiumData?.partners[selectedPartner]
                          ? premiumData.partners[selectedPartner].name
                          : undefined
                      ))}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#F97316] text-white font-semibold tracking-wider text-sm hover:bg-[#EA580C] transition-all duration-600 rounded-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t("leadFlow.submitOffer")}
                    </a>

                    <button
                      onClick={resetAndClose}
                      className="w-full px-5 py-3 border border-[#E2E8F0] text-[#475569] text-xs font-medium tracking-wider hover:border-[#0EA5E9]/30 hover:text-[#475569] transition-all duration-500 rounded-md"
                    >
                      {t("leadFlow.close")}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
