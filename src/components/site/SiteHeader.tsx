"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Calculator, ShieldCheck } from "lucide-react";
import { Button } from "./Button";
import { Container } from "./primitives";
import { trackEvent } from "@/lib/analytics-events";

const NAV_LINKS = [
  { label: "Cek Premi", href: "/#kalkulator" },
  { label: "Jenis Proteksi", href: "/#jenis-proteksi" },
  { label: "Cara Kerja", href: "/#cara-kerja" },
  { label: "Artikel", href: "/blog" },
  { label: "Tentang Kami", href: "/tentang-kami" },
];

const MOBILE_MENU_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Cek Premi", href: "/#kalkulator" },
  { label: "All Risk", href: "/asuransi-mobil-all-risk" },
  { label: "TLO", href: "/asuransi-mobil-tlo" },
  { label: "Cara Kerja", href: "/#cara-kerja" },
  { label: "Artikel", href: "/blog" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Bantuan", href: "/#faq" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer open
  React.useEffect(() => {
    if (drawerOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [drawerOpen]);

  // Close drawer on Escape
  React.useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const handleCtaClick = () => {
    trackEvent("apply_click", {});
    setDrawerOpen(false);
    router.push("/#kalkulator");
  };

  return (
    <>
      <header
        className={`
          sticky top-0 z-40 w-full bg-white transition-all
          ${scrolled ? "border-b border-[#E2E8F0] backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04)]" : "border-b border-transparent"}
        `}
      >
        <Container className="flex items-center justify-between h-16 sm:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Jasa Proteksi — Beranda"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-[#5EEAD4]" aria-hidden />
            </span>
            <span className="text-[15px] font-bold text-[#0F172A] tracking-tight">
              Jasa Proteksi
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button as="link" href="/#kalkulator" variant="primary" size="md" onClick={() => trackEvent("apply_click", {})}>
              <Calculator className="h-4 w-4" aria-hidden />
              Hitung Premi
            </Button>
          </div>

          {/* Mobile right cluster */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              as="link"
              href="/#kalkulator"
              variant="primary"
              size="sm"
              onClick={() => trackEvent("apply_click", {})}
              className="!h-10 !min-h-[44px]"
            >
              <Calculator className="h-4 w-4" aria-hidden />
              <span className="hidden xs:inline">Hitung Premi</span>
              <span className="xs:hidden">Hitung</span>
            </Button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#0F172A] hover:bg-[#F1F5F9]"
              aria-label="Buka menu navigasi"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-drawer-title"
          id="mobile-drawer"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
              <h2 id="mobile-drawer-title" className="font-bold text-[#0F172A]">
                Menu
              </h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#0F172A] hover:bg-[#F1F5F9]"
                aria-label="Tutup menu navigasi"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4" aria-label="Navigasi mobile">
              <ul className="flex flex-col gap-1">
                {MOBILE_MENU_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className="block px-3 py-3 min-h-[48px] flex items-center text-base font-medium text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-[#E2E8F0] safe-bottom">
              <Button onClick={handleCtaClick} variant="primary" size="lg" className="w-full">
                <Calculator className="h-4 w-4" aria-hidden />
                Hitung Premi Sekarang
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
