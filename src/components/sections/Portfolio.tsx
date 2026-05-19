"use client";

import { useState, useEffect } from "react";
import { Car, Bike, Plane, PawPrint, Zap, UserCheck, ArrowRight, Shield, Calculator } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import PriceEstimationModal from "@/components/flow/PriceEstimationModal";
import LeadFormModal from "@/components/flow/LeadFormModal";

interface DBProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  benefits: string;
  estimatedPrice: number;
  minimumOfferPrice: number;
  isActive: boolean;
}

const categories = ["Semua", "Kendaraan", "Perjalanan", "Hewan", "Personal"];

const iconMap: Record<string, React.ElementType> = {
  "asuransi-mobil": Car,
  "asuransi-motor": Bike,
  "asuransi-perjalanan": Plane,
  "asuransi-hewan-peliharaan": PawPrint,
  "asuransi-motor-listrik": Zap,
  "asuransi-kecelakaan-diri": UserCheck,
};

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Portfolio() {
  const [active, setActive] = useState("Semua");
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [estimationOpen, setEstimationOpen] = useState(false);
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DBProduct | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = active === "Semua" ? products : products.filter((p) => p.category === active);

  const handleCekHarga = (product: DBProduct) => {
    setSelectedProduct(product);
    setEstimationOpen(true);
  };

  const handleProceedToForm = (product: DBProduct) => {
    setEstimationOpen(false);
    setSelectedProduct(product);
    setTimeout(() => setLeadFormOpen(true), 300);
  };

  const handleBackToEstimation = () => {
    setLeadFormOpen(false);
    setTimeout(() => setEstimationOpen(true), 300);
  };

  const handleCloseAll = () => {
    setEstimationOpen(false);
    setLeadFormOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section id="model" className="bg-white overflow-hidden">
      <div className="py-28 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 mb-20 lg:mb-24">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[2px] bg-[#2E7D6F]" />
                <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">
                  Our Products
                </span>
              </div>
              <AnimatedSection>
                <TextReveal
                  text="Protection for every moment"
                  as="h2"
                  className="text-3xl lg:text-4xl xl:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-[#0D0D0D] leading-[1.1]"
                  delay={0.15}
                />
              </AnimatedSection>
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex gap-1 p-1 rounded-lg bg-gray-50/80 border border-gray-100 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-5 py-2 text-[11px] font-medium tracking-wider transition-all duration-600 rounded-md ${
                    active === cat
                      ? "bg-[#2E7D6F] text-white"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filtered.map((product, i) => {
                const IconComponent = iconMap[product.slug] || Shield;
                const benefits: string[] = JSON.parse(product.benefits || "[]");
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.8,
                      ease: premiumEase,
                    }}
                  >
                    <div className="rounded-xl overflow-hidden h-full flex flex-col bg-white border border-gray-100 hover:border-[#2E7D6F]/20 transition-all duration-800 hover:shadow-sm group">
                      {/* Icon Header */}
                      <div className="relative h-[180px] overflow-hidden bg-gradient-to-br from-[#0A0F1E] to-[#141B30] flex items-center justify-center">
                        <div className="text-center">
                          <IconComponent className="w-14 h-14 text-[#2E7D6F]/40 mx-auto mb-3 group-hover:text-[#3A9B8A]/60 transition-colors duration-600" />
                          <span className="text-lg font-bold text-white/20 font-[family-name:var(--font-montserrat)]">
                            {product.name}
                          </span>
                        </div>
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="text-[9px] tracking-wider text-[#2E7D6F]/70 border border-[#2E7D6F]/30 px-2.5 py-0.5 rounded bg-[#0A0F1E]/50 backdrop-blur-sm">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] text-[#0D0D0D] mb-1.5">
                          {product.name}
                        </h3>
                        <p className="text-xl font-bold text-[#2E7D6F] font-[family-name:var(--font-montserrat)] mb-4">
                          {formatRupiah(product.estimatedPrice)}<span className="text-sm text-gray-400 font-normal">/tahun</span>
                        </p>

                        {/* Benefits */}
                        <div className="grid grid-cols-2 gap-2.5 mb-5">
                          {benefits.slice(0, 4).map((b) => (
                            <div key={b} className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                              <Shield className="w-3 h-3 text-[#2E7D6F] flex-shrink-0" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>

                        <p className="text-gray-400 text-xs leading-relaxed mb-6 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="mt-auto">
                          <button
                            onClick={() => handleCekHarga(product)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E7D6F] text-white text-[11px] font-medium tracking-wider hover:bg-[#3A9B8A] transition-all duration-600 rounded-md group/btn"
                          >
                            <Calculator className="w-3 h-3" />
                            Cek Estimasi
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PriceEstimationModal
        isOpen={estimationOpen}
        onClose={handleCloseAll}
        product={selectedProduct}
        onProceed={handleProceedToForm}
      />
      <LeadFormModal
        isOpen={leadFormOpen}
        onClose={handleCloseAll}
        onBack={handleBackToEstimation}
        product={selectedProduct}
      />
    </section>
  );
}
