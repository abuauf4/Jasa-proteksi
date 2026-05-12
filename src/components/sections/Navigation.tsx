"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, Search, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const navLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Model", href: "#model" },
  { label: "Layanan", href: "#layanan" },
  { label: "Promo", href: "#promo" },
  { label: "Tentang", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md shadow-lg border-b border-border"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#beranda" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold font-[family-name:var(--font-montserrat)] tracking-wider text-primary">
                MITSUBISHI
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-accent transition-colors duration-300 rounded-md hover:bg-accent/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-foreground/80 hover:text-accent"
              >
                <Search className="h-5 w-5" />
              </Button>
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-foreground/80 hover:text-accent"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}
              <Button
                asChild
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              >
                <a href="#kontak">
                  <Phone className="h-4 w-4 mr-2" />
                  Book Test Drive
                </a>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-foreground/80"
              >
                <Search className="h-5 w-5" />
              </Button>
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-foreground/80"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground/80">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-background">
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="text-2xl font-extrabold font-[family-name:var(--font-montserrat)] tracking-wider text-primary">
                      MITSUBISHI
                    </div>
                    <nav className="flex flex-col gap-1">
                      {navLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="px-4 py-3 text-base font-medium text-foreground/80 hover:text-accent hover:bg-accent/5 transition-colors rounded-lg"
                        >
                          {link.label}
                        </a>
                      ))}
                    </nav>
                    <Button
                      asChild
                      className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold w-full"
                    >
                      <a href="#kontak">
                        <Phone className="h-4 w-4 mr-2" />
                        Book Test Drive
                      </a>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md flex items-start justify-center pt-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="absolute top-6 right-6 text-foreground/60 hover:text-foreground"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-8 w-8" />
            </button>
            <div className="w-full max-w-2xl px-6">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] mb-6">
                Cari Model Mitsubishi
              </h2>
              <Input
                type="text"
                placeholder="Ketik nama model, misalnya Xpander..."
                className="h-14 text-lg"
                autoFocus
              />
              <p className="text-muted-foreground mt-4 text-sm">
                Tekan Enter untuk mencari atau Esc untuk menutup
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
