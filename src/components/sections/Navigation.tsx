"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Shield } from "lucide-react";
import Image from "next/image";
import MagneticButton from "@/components/shared/MagneticButton";

const navLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Produk", href: "#model" },
  { label: "Layanan", href: "#layanan" },
  { label: "Coverage", href: "#promo" },
  { label: "Tentang", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#00001f]/90 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#beranda" className="flex items-center gap-3 group">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 lg:w-9 lg:h-9 flex-shrink-0">
                  <Image
                    src="/logo-jasa-proteksi.webp"
                    alt="Jasa Proteksi Logo"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-lg lg:text-xl font-bold font-[family-name:var(--font-montserrat)] text-white tracking-wider">
                    JASA PROTEKSI
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-px h-6 bg-white/20" />
                <span className="text-xs tracking-[0.2em] text-white/50 uppercase font-medium">OJK Licensed</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 group"
                >
                  <span
                    className={
                      activeSection === link.href.replace("#", "")
                        ? "text-[#c9a84c]"
                        : "text-white/80 group-hover:text-white"
                    }
                  >
                    {link.label}
                  </span>
                  {activeSection === link.href.replace("#", "") && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-[#c9a84c] to-[#dfc06f]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-[#c9a84c] transition-colors duration-300 border border-white/10 hover:border-[#c9a84c]/30"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}

              <MagneticButton
                href="#kontak"
                className="relative px-6 py-2.5 text-sm font-semibold tracking-wider border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 overflow-hidden group shine-button"
                strength={0.2}
              >
                <span className="relative z-10">DAPATKAN PERLINDUNGAN</span>
                <div className="absolute inset-0 bg-[#c9a84c] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </MagneticButton>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-3">
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-[#c9a84c] transition-colors duration-300"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={() => setMobileOpen(true)}
                className="w-8 h-8 flex items-center justify-center text-white hover:text-[#c9a84c] transition-colors duration-300"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-[#00001f]/98 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col h-full">
              {/* Close button */}
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-[#c9a84c] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-3xl font-[family-name:var(--font-montserrat)] font-semibold tracking-wider transition-colors duration-300 ${
                      activeSection === link.href.replace("#", "")
                        ? "text-[#c9a84c]"
                        : "text-white/80 hover:text-[#c9a84c]"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              {/* CTA */}
              <div className="p-8 flex flex-col items-center gap-4">
                <a
                  href="#kontak"
                  onClick={() => setMobileOpen(false)}
                  className="w-full max-w-xs text-center py-4 border border-[#c9a84c] text-[#c9a84c] font-semibold tracking-wider hover:bg-[#c9a84c] hover:text-[#00001f] transition-all duration-300 shine-button"
                >
                  DAPATKAN PERLINDUNGAN
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
