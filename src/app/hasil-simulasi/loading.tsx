import { Calculator, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3 mb-8">
        <span className="w-12 h-12 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0F766E]">
          <Calculator className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">Tunggu sebentar</h2>
        <p className="text-sm text-[#475569] text-center max-w-xs leading-relaxed">
          Kami sedang menghitung estimasi premi terbaik berdasarkan data kendaraan Anda.
        </p>
        <p className="text-xs text-[#94A3B8]">
          Perhitungan dilakukan dari partner asuransi yang tersedia.
        </p>
      </div>
      <Loader2 className="h-6 w-6 text-[#0F766E] animate-spin mb-8" aria-hidden />
      <div className="w-full max-w-[400px] flex flex-col gap-3">
        <div className="rounded-2xl border-2 border-[#E2E8F0] bg-white p-4">
          <div className="h-3 w-32 bg-[#E2E8F0] rounded-full mb-3 animate-pulse" />
          <div className="h-8 w-48 bg-[#E2E8F0] rounded-lg animate-pulse" />
          <div className="h-3 w-24 bg-[#E2E8F0] rounded-full mt-3 animate-pulse" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl border border-[#E2E8F0] bg-white flex items-center justify-center">
              <div className="h-5 w-12 bg-[#E2E8F0] rounded animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
