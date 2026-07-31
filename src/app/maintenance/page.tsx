import { db } from "@/lib/db";
import { CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  // Fetch site name from settings
  let siteName = "Jasa Proteksi";
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "email" },
    });
    // Just use the default site name
    void setting;
  } catch {
    // fallback to default
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#042F2E] via-[#0F172A] to-[#0C4A6E] px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/20">
          <CheckCircle className="h-10 w-10 text-amber-400" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 ">
          Sedang Maintenance
        </h1>

        {/* Description */}
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
          Kami sedang melakukan pemeliharaan website. Silakan kembali nanti.
        </p>

        {/* Footer */}
        <p className="text-xs text-slate-500">
          {siteName} — PT. Jasa Global Proteksi
        </p>
      </div>
    </div>
  );
}
