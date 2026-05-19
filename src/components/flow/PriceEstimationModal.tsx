"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, ArrowRight, ChevronRight, Info } from "lucide-react";

interface Product {
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

interface PriceEstimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onProceed: (product: Product) => void;
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

export default function PriceEstimationModal({
  isOpen,
  onClose,
  product,
  onProceed,
}: PriceEstimationModalProps) {
  if (!product) return null;

  const benefits: string[] = JSON.parse(product.benefits || "[]");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-[#0D0D0D]/70 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: premiumEase }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg bg-[#0A0F1E] border border-white/[0.06] rounded-xl overflow-hidden shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors duration-500 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header gradient */}
              <div className="relative h-32 bg-gradient-to-br from-[#0A0F1E] via-[#141B30] to-[#0A0F1E] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#2E7D6F]/[0.04] blur-3xl" />
                <div className="relative text-center">
                  <Shield className="w-10 h-10 text-[#2E7D6F]/50 mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-white/90 font-[family-name:var(--font-montserrat)]">
                    {product.name}
                  </h3>
                  <span className="text-[10px] tracking-wider text-[#2E7D6F]/70 uppercase">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Price display */}
                <div className="text-center mb-6">
                  <p className="text-white/40 text-xs tracking-wider uppercase mb-2">Estimasi Harga</p>
                  <p className="text-3xl font-bold text-[#2E7D6F] font-[family-name:var(--font-montserrat)]">
                    {formatRupiah(product.estimatedPrice)}
                  </p>
                  <p className="text-white/25 text-[10px] mt-1">/tahun</p>
                </div>

                {/* Description */}
                <p className="text-white/40 text-xs leading-relaxed mb-5 text-center">
                  {product.description}
                </p>

                {/* Benefits */}
                {benefits.length > 0 && (
                  <div className="mb-6">
                    <p className="text-white/50 text-[10px] tracking-wider uppercase mb-3">Manfaat Perlindungan</p>
                    <div className="grid grid-cols-2 gap-2">
                      {benefits.slice(0, 6).map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/40 text-[11px]">
                          <div className="w-1 h-1 rounded-full bg-[#2E7D6F]/50 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Minimum offer info */}
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2.5">
                    <Info className="w-3.5 h-3.5 text-[#2E7D6F]/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/50 text-[11px] leading-relaxed">
                        Harga penawaran minimum untuk produk ini adalah{" "}
                        <span className="text-[#2E7D6F] font-semibold">{formatRupiah(product.minimumOfferPrice)}</span>/tahun.
                        Anda bisa mengajukan penawaran sesuai kemampuan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => onProceed(product)}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#2E7D6F] text-white font-semibold tracking-wider text-sm hover:bg-[#3A9B8A] transition-all duration-600 rounded-md group"
                >
                  Ajukan Penawaran
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
