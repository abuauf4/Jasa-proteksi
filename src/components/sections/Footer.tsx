"use client";

import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Model", href: "#model" },
  { label: "Promo", href: "#promo" },
  { label: "Tentang", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

const serviceLinks = [
  { label: "Penjualan", href: "#layanan" },
  { label: "Kredit", href: "#promo" },
  { label: "Servis", href: "#layanan" },
  { label: "Trade-In", href: "#layanan" },
  { label: "Asuransi", href: "#layanan" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-extrabold font-[family-name:var(--font-montserrat)] tracking-wider text-white mb-4">
              MITSUBISHI
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Dealer resmi Mitsubishi di Jakarta. Menyediakan layanan penjualan, kredit, servis,
              dan suku cadang dengan standar kualitas tertinggi.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold font-[family-name:var(--font-montserrat)] text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-accent transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Layanan */}
          <div>
            <h4 className="font-semibold font-[family-name:var(--font-montserrat)] text-white mb-4">
              Layanan
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-accent transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Kontak */}
          <div>
            <h4 className="font-semibold font-[family-name:var(--font-montserrat)] text-white mb-4">
              Kontak
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-white/60">
                  Jl. Raya Protokol Halim PK, Jakarta Timur
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span className="text-white/60">021-800123</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span className="text-white/60">info@misubishi.co.id</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span className="text-white/60">Senin - Sabtu 08:00 - 17:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <p className="text-white/60 text-sm font-medium whitespace-nowrap">
              Berlangganan Newsletter:
            </p>
            <div className="flex gap-2 w-full sm:w-auto max-w-md">
              <Input
                type="email"
                placeholder="Masukkan email Anda"
                className="bg-white/10 border-white/10 text-white placeholder:text-white/40 h-10"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 h-10 px-4">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Mitsubishi Showroom. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
