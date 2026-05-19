import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Jasa Proteksi",
  description: "Admin panel for Jasa Proteksi",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Admin nav */}
      <nav className="border-b border-white/[0.06] bg-[#0D0D0D]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#2E7D6F] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">JP</span>
            </div>
            <span className="text-white/80 text-sm font-semibold font-[family-name:var(--font-montserrat)] tracking-wider">
              JASA PROTEKSI
            </span>
            <span className="text-white/20 text-[10px] tracking-wider ml-2 uppercase">Admin</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/admin" className="text-white/40 text-xs tracking-wider hover:text-white/70 transition-colors duration-500">
              Dashboard
            </a>
            <a href="/admin/products" className="text-white/40 text-xs tracking-wider hover:text-white/70 transition-colors duration-500">
              Produk
            </a>
            <a href="/admin/leads" className="text-white/40 text-xs tracking-wider hover:text-white/70 transition-colors duration-500">
              Leads
            </a>
            <a href="/" className="text-white/20 text-[10px] tracking-wider hover:text-white/50 transition-colors duration-500 border border-white/10 px-3 py-1.5 rounded">
              ← Kembali ke Website
            </a>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
