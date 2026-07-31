"use client";

import { useState, useEffect, useCallback } from "react";
import { Car, Bike, Plane, PawPrint, Zap, UserCheck, ArrowRight, Shield, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AnimatedSection from "@/components/shared/AnimatedSection";
import GradientMesh from "@/components/shared/GradientMesh";
import SectionHeader from "@/components/shared/SectionHeader";
import CTAButton from "@/components/shared/CTAButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import TextReveal from "@/components/shared/TextReveal";
import { products as staticProducts, InsuranceProduct } from "@/lib/products";
import { prefetchVehicleData } from "@/lib/vehiclePrefetch";

// LeadFlowModal no longer imported — product "Cek Harga" CTA now navigates
// to /produk/[slug] dedicated page instead of opening a modal overlay.

const iconMap: Record<string, React.ElementType> = {
  "asuransi-mobil": Car,
  "asuransi-motor": Bike,
  "asuransi-perjalanan": Plane,
  "asuransi-hewan-peliharaan": PawPrint,
  "asuransi-motor-listrik": Zap,
  "asuransi-kecelakaan-diri": UserCheck,
};

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

function mergeProductData(dbProducts: any[]): InsuranceProduct[] {
  return dbProducts
    .filter((p) => p.isActive)
    .map((dbProduct) => {
      const staticProduct = staticProducts.find((sp) => sp.slug === dbProduct.slug);
      if (staticProduct) {
        return {
          ...staticProduct,
          id: dbProduct.id,
          name: dbProduct.name,
          slug: dbProduct.slug,
          category: dbProduct.category,
          description: dbProduct.description,
          benefits: dbProduct.benefits,
          estimatedPrice: dbProduct.estimatedPrice,
          minimumOfferPrice: dbProduct.minimumOfferPrice,
          isActive: dbProduct.isActive,
        };
      }
      return {
        id: dbProduct.id,
        slug: dbProduct.slug,
        name: dbProduct.name,
        category: dbProduct.category,
        tagline: dbProduct.name,
        price: `Mulai Rp ${(dbProduct.estimatedPrice / 1000).toLocaleString("id-ID")}rb/tahun`,
        discount: "",
        iconName: "Shield",
        image: "/images/product-car.svg",
        description: dbProduct.description,
        coverage: [],
        highlights: [{ icon: "shield", label: "Tipe", value: "TLO / All Risk" }],
        claimTypes: [],
        variants: [],
        warranty: "Polis aktif sejak pembayaran",
        estimatedPrice: dbProduct.estimatedPrice,
        minimumOfferPrice: dbProduct.minimumOfferPrice,
        benefits: dbProduct.benefits,
        isActive: dbProduct.isActive,
      } as InsuranceProduct;
    });
}

export default function Portfolio() {
  const [active, setActive] = useState("all");
  const [products, setProducts] = useState<InsuranceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const categories = [
    { key: "all", label: t("portfolio.categories.all") },
    { key: "Kendaraan", label: t("portfolio.categories.vehicle") },
  ];

  // Prefetch vehicle data ONLY on hover/touch of "Cek Harga" button
  // This ensures ~287KB of data is never fetched unless user shows clear intent
  // NOTE: Must be defined BEFORE the useEffect that references it, to avoid TDZ ReferenceError
  const [prefetched, setPrefetched] = useState(false);
  const triggerPrefetch = useCallback(() => {
    if (!prefetched) {
      prefetchVehicleData("mobil");
      prefetchVehicleData("motor");
      setPrefetched(true);
    }
  }, [prefetched]);

  // Listen for "open-lead-flow" custom event from Hero CTA — now redirects to
  // /produk/asuransi-mobil page (kept for backward compat with Hero CTA event)
  useEffect(() => {
    const handleOpenLeadFlow = () => {
      const defaultSlug = products.find((p) => p.slug === "asuransi-mobil")?.slug || "asuransi-mobil";
      window.location.href = `/produk/${defaultSlug}`;
    };
    window.addEventListener("open-lead-flow", handleOpenLeadFlow);
    return () => window.removeEventListener("open-lead-flow", handleOpenLeadFlow);
  }, [products]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Cache-Control header on /api/products handles edge caching.
        // Removed `?_t=${Date.now()}` cache-buster — it was preventing
        // Vercel edge cache from working (every request URL was unique).
        const res = await fetch(`/api/products?active=true`);
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            const merged = mergeProductData(data.products);
            setProducts(merged);
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <section id="model" className="bg-[#0F172A] overflow-hidden relative">
      {/* Gradient Mesh */}
      <GradientMesh variant="navy-trust" />

      <div className="relative z-10 ds-section">
        <div className="ds-container safe-px">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-8 mb-14 lg:mb-20">
            <div>
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-12 h-[2px] bg-[#14B8A6] rounded-sm" />
                <span className="ds-label text-[#14B8A6]">
                  {t("portfolio.label")}
                </span>
              </div>
              <TextReveal
                text={t("portfolio.heading")}
                as="h2"
                className="ds-h2 font-bold  text-white"
                delay={0.15}
              />
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex gap-2 p-1 rounded-xl bg-[#1E293B] border border-[#334155] flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActive(cat.key)}
                  className={`px-4 sm:px-5 py-2.5 text-[11px] font-medium tracking-wider transition-all duration-300 rounded-lg min-h-[40px] ${
                    active === cat.key
                      ? "bg-[#14B8A6]/15 text-[#14B8A6]"
                      : "bg-[#0F172A] text-[#64748B] hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-[#1E293B] border border-[#334155] animate-pulse">
                  <div className="h-[160px] bg-[#1E293B]" />
                  <div className="ds-card space-y-3">
                    <div className="h-5 bg-[#334155] rounded w-2/3" />
                    <div className="h-3 bg-[#334155] rounded w-full" />
                    <div className="h-3 bg-[#334155] rounded w-4/5" />
                    <div className="h-9 bg-[#334155] rounded-full w-32 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <AnimatePresence>
              {filtered.map((product, i) => {
                const IconComponent = iconMap[product.slug] || Shield;
                return (
                  <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.8,
                      ease: premiumEase,
                    }}
                  >
                    <div className="rounded-2xl overflow-hidden h-full flex flex-col bg-[#1E293B] border border-[#334155] hover:border-[#14B8A6]/30 hover:shadow-lg hover:shadow-[#14B8A6]/5 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 group">
                      {/* Icon Header */}
                      <div className="relative h-[160px] overflow-hidden bg-gradient-to-br from-[#134E4A] to-[#1E293B] flex items-center justify-center">
                        <div className="text-center">
                          <IconComponent className="w-12 h-12 text-[#14B8A6]/40 mx-auto mb-2 group-hover:text-[#14B8A6] transition-colors duration-300" />
                          <span className="text-base font-bold text-white/10 ">
                            {product.name}
                          </span>
                        </div>
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="text-[9px] tracking-wider text-[#14B8A6]/80 border border-[#14B8A6]/25 px-2.5 py-0.5 rounded-full bg-[#0F172A]/60 backdrop-blur-sm">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="ds-card flex-1 flex flex-col">
                        <h3 className="text-lg font-bold  text-white mb-2">
                          {product.name}
                        </h3>
                        {/* Highlights */}
                        <div className="grid grid-cols-2 gap-2 mb-5">
                          {product.highlights.slice(0, 4).map((h) => (
                            <div key={h.label} className="flex items-center gap-1.5 text-[#64748B] text-[10px]">
                              <Shield className="w-3 h-3 text-[#14B8A6] flex-shrink-0" />
                              <span className="truncate">{h.value}</span>
                            </div>
                          ))}
                        </div>

                        <p className="text-[#64748B] text-xs leading-relaxed mb-6 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="mt-auto" onMouseEnter={triggerPrefetch} onTouchStart={triggerPrefetch}>
                          <CTAButton
                            variant="sm"
                            color="orange"
                            href={`/produk/${product.slug}`}
                            icon={<Search className="w-3 h-3" />}
                            trailingIcon={<ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" />}
                          >
                            {t("portfolio.cekHarga")}
                          </CTAButton>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
