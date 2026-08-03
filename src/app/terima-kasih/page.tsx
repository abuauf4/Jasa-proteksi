import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { ThankYouWhatsAppButton } from "./ThankYouWhatsAppButton";

export const metadata: Metadata = {
  title: "Terima Kasih - Jasa Proteksi",
  description: "Terima kasih telah menghubungi Jasa Proteksi. Tim advisor kami akan segera menghubungi Anda.",
  robots: { index: false, follow: false }, // Don't index thank-you pages
};

export default async function TerimaKasihPage() {
  let whatsappNumber = "6285282297399"; // fallback
  try {
    const setting = await db.siteSetting.findUnique({ where: { key: "whatsapp" } });
    if (setting?.value) whatsappNumber = setting.value;
  } catch {}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#042F2E] via-[#0F172A] to-[#0C4A6E] px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-[#14B8A6]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold  text-white mb-4">
          Terima Kasih!
        </h1>

        <p className="text-[#94A3B8] text-base sm:text-lg leading-relaxed mb-8">
          Data Anda telah kami terima. Tim advisor kami akan menghubungi Anda dalam waktu 1x24 jam kerja untuk membantu memilih perlindungan kendaraan terbaik.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F97316] text-white font-semibold tracking-wider text-sm rounded-full hover:bg-[#EA580C] transition-all duration-300 shadow-lg hover:shadow-[#F97316]/25"
          >
            Kembali ke Beranda
            <ArrowRight className="w-4 h-4" />
          </Link>

          <ThankYouWhatsAppButton whatsappNumber={whatsappNumber} />
        </div>

        {/* Trust signal */}
        <p className="mt-10 text-[#64748B] text-xs tracking-wider">
          Jasa Proteksi — Platform Perbandingan Asuransi Kendaraan
        </p>
      </div>
    </div>
  );
}
