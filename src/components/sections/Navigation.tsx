"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { trackWhatsAppClick } from "@/lib/analytics-events";

const navLinkKeys = [
  { key: "beranda", href: "#beranda" },
  { key: "produk", href: "#model" },
  { key: "partner", href: "#trust" },
  { key: "whyBroker", href: "#why-broker" },
  { key: "advisor", href: "#advisor" },
  { key: "trust", href: "#trust-legal" },
  { key: "artikel", href: "/artikel" },
  { key: "kontak", href: "#kontak" },
];

export default function Navigation() {
   const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const { t } = useLanguage();
  const { loading, ctaWhatsApp } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      const anchorLinks = navLinkKeys.filter((l) => l.href.startsWith("#"));
      const sections = anchorLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            : "bg-white"
        }`}
      >
        {/* Thin border on scroll */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300 ${
            scrolled ? "opacity-100 bg-gray-200/80" : "opacity-0"
          }`}
        />

        <nav
          className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8"
          style={{
            paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
            paddingRight: "max(1.25rem, env(safe-area-inset-right))",
          }}
        >
          <div className="flex h-[68px] items-center justify-between lg:h-[72px]">
            {/* Logo — split color text */}
            <a href="#beranda" className="flex-shrink-0">
              <span className="text-xl font-bold tracking-tight sm:text-2xl">
                <span className="text-[#0B1F3A]">Jasa</span>
                <span className="text-[#0F766E]">Proteksi</span>
              </span>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden items-center gap-1 lg:flex">
              {navLinkKeys.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-200 ${
                    activeSection === link.href.replace("#", "")
                      ? "text-[#0F766E]"
                      : "text-[#475569] hover:text-[#0B1F3A]"
                  }`}
                >
                  {t(`nav.${link.key}`)}
                </a>
              ))}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden items-center gap-3 lg:flex">
              {!loading && ctaWhatsApp && (
                <a
                  href={`https://wa.me/${ctaWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ method: "nav_desktop" })}
                  className="flex items-center gap-1.5 text-[12px] text-[#64748B] transition-colors hover:text-[#0F766E]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+{ctaWhatsApp}</span>
                </a>
              )}
              <a
                href="/produk/asuransi-mobil"
                className="inline-flex items-center gap-2 rounded-full bg-[#0F766E] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0D6B63]"
              >
                {t("nav.cekHarga")}
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-[#0B1F3A] transition-colors hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 z-[61] w-[280px] bg-white shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-full flex-col">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <a
                    href="#beranda"
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-bold tracking-tight"
                  >
                    <span className="text-[#0B1F3A]">Jasa</span>
                    <span className="text-[#0F766E]">Proteksi</span>
                  </a>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-gray-100"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Drawer Links */}
                <div className="flex-1 overflow-y-auto px-3 py-3">
                  {navLinkKeys.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center rounded-xl px-4 py-3.5 text-[15px] font-medium transition-colors ${
                        activeSection === link.href.replace("#", "")
                          ? "bg-[#F0FDFA] text-[#0F766E]"
                          : "text-[#334155] hover:bg-gray-50"
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      {t(`nav.${link.key}`)}
                    </motion.a>
                  ))}
                </div>

                {/* Drawer Footer */}
                <div className="border-t border-gray-100 px-5 py-5">
                  {!loading && ctaWhatsApp && (
                    <a
                      href={`https://wa.me/${ctaWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { trackWhatsAppClick({ method: "nav_mobile_drawer" }); setMobileOpen(false); }}
                      className="mb-3 flex items-center gap-2 text-[13px] text-[#64748B]"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>+{ctaWhatsApp}</span>
                    </a>
                  )}
                  <a
                    href="/produk/asuransi-mobil"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0F766E] py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0D6B63]"
                  >
                    {t("nav.cekHarga")}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
