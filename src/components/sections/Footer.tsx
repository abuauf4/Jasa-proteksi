"use client";

import { Diamond, Instagram, Facebook, Youtube, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Model", href: "#model" },
  { label: "Layanan", href: "#layanan" },
  { label: "Promo", href: "#promo" },
  { label: "Tentang", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

const services = [
  "Penjualan Mobil Baru",
  "Test Drive",
  "Simulasi Kredit",
  "Servis & Perawatan",
  "Trade-In",
  "Asuransi",
];

const contactItems = [
  "Jl. Raya Protokol No. 88",
  "Jakarta Selatan 12345",
  "+62 21 8888 7777",
  "info@misubishi-showroom.co.id",
];

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-[#00001f] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1 - Brand */}
          <div>
            <a href="#beranda" className="flex items-center gap-2 mb-6">
              <span className="text-xl font-bold font-[family-name:var(--font-montserrat)] tracking-wider">
                MISUBISHI
              </span>
              <Diamond className="w-3 h-3 text-[#c9a84c]" />
            </a>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Dealer resmi Mitsubishi terpercaya di Jakarta. Pengalaman berkendara premium dimulai di sini.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-sm font-semibold font-[family-name:var(--font-montserrat)] tracking-wider uppercase mb-6 text-[#c9a84c]">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/40 text-sm hover:text-[#c9a84c] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Layanan */}
          <div>
            <h4 className="text-sm font-semibold font-[family-name:var(--font-montserrat)] tracking-wider uppercase mb-6 text-[#c9a84c]">
              Layanan
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-white/40 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h4 className="text-sm font-semibold font-[family-name:var(--font-montserrat)] tracking-wider uppercase mb-6 text-[#c9a84c]">
              Newsletter
            </h4>
            <p className="text-white/40 text-sm mb-4">
              Dapatkan info promo dan berita terbaru.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Email Anda"
                type="email"
                className="bg-white/5 border-white/10 focus:border-[#c9a84c] h-10 text-sm rounded-md text-white placeholder:text-white/30"
              />
              <Button
                className="bg-[#c9a84c] hover:bg-[#dfc06f] text-[#00001f] h-10 px-4 rounded-md flex-shrink-0"
                size="icon"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Contact */}
            <div className="mt-6">
              <h5 className="text-xs tracking-wider text-white/50 uppercase mb-3">Kontak</h5>
              {contactItems.map((item) => (
                <p key={item} className="text-white/40 text-sm leading-relaxed">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#c9a84c]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Misubishi Showroom. All rights reserved.
          </p>
          <p className="text-[#c9a84c]/40 text-xs">
            Authorized Mitsubishi Dealer
          </p>
        </div>
      </div>
    </footer>
  );
}
