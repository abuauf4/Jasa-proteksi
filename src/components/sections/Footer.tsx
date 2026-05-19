"use client";

import { Diamond, Instagram, Facebook, Youtube, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Produk", href: "#model" },
  { label: "Trust", href: "#trust" },
  { label: "Layanan", href: "#layanan" },
  { label: "Coverage", href: "#promo" },
  { label: "Tentang", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

const productLinks = [
  "Asuransi Mobil",
  "Asuransi Motor",
  "Asuransi Perjalanan",
  "Asuransi Hewan Peliharaan",
  "Asuransi Motor Listrik",
  "Asuransi Kecelakaan Diri",
];

const contactItems = [
  "Menara Anugrah Lantai 23, Unit A",
  "Kawasan Mega Kuningan, Jakarta Selatan",
  "Telepon: +62 813-7929-0494",
  "WhatsApp: +62 813-7929-0494",
  "abuaufa.nauka@gmail.com",
];

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white">
      {/* Marquee Brand Banner */}
      <div className="border-y border-[#2E7D6F]/8 py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 mx-8">
              <span className="text-lg font-bold font-[family-name:var(--font-montserrat)] tracking-[0.2em] text-white/[0.06]">
                JASA PROTEKSI INSURTECH
              </span>
              <Diamond className="w-2 h-2 text-[#2E7D6F]/20" />
              <span className="text-sm tracking-[0.3em] text-[#2E7D6F]/15 uppercase">
                Melindungi Setiap Langkah Hidupmu
              </span>
              <Diamond className="w-2 h-2 text-[#2E7D6F]/20" />
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-14">
          {/* Column 1 - Brand */}
          <div>
            <a href="#beranda" className="flex items-center gap-3 mb-7">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/logo-jasa-proteksi.webp"
                  alt="Jasa Proteksi Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-montserrat)] tracking-wider">JASA PROTEKSI</span>
              <Diamond className="w-3 h-3 text-[#2E7D6F]" />
            </a>
            <p className="text-white/30 text-sm leading-[1.7] mb-7">
              Platform asuransi online terpercaya di Indonesia. <span className="text-[#2E7D6F]">Melindungi Setiap Langkah Hidupmu.</span>
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-[#2E7D6F] hover:border-[#2E7D6F]/30 hover:bg-[#2E7D6F]/5 transition-all duration-800"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-sm font-semibold font-[family-name:var(--font-montserrat)] tracking-wider uppercase mb-7 text-[#2E7D6F]">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/30 text-sm hover:text-[#2E7D6F] transition-colors duration-800 hover:pl-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Produk */}
          <div>
            <h4 className="text-sm font-semibold font-[family-name:var(--font-montserrat)] tracking-wider uppercase mb-7 text-[#2E7D6F]">
              Produk
            </h4>
            <ul className="space-y-3.5">
              {productLinks.map((product) => (
                <li key={product}>
                  <span className="text-white/30 text-sm">{product}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h4 className="text-sm font-semibold font-[family-name:var(--font-montserrat)] tracking-wider uppercase mb-7 text-[#2E7D6F]">
              Newsletter
            </h4>
            <p className="text-white/30 text-sm mb-5 leading-relaxed">
              Subscribe dan dapatkan diskon 5% untuk polis pertamamu
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Email Anda"
                type="email"
                className="bg-white/[0.03] border-white/[0.06] focus:border-[#2E7D6F] h-10 text-sm rounded-md text-white placeholder:text-white/20 transition-colors duration-600"
              />
              <Button
                className="bg-[#2E7D6F] hover:bg-[#3A9B8A] text-[#0D0D0D] h-10 px-4 rounded-md flex-shrink-0 transition-colors duration-600"
                size="icon"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Contact */}
            <div className="mt-8">
              <h5 className="text-[10px] tracking-wider text-white/40 uppercase mb-4">Kontak</h5>
              {contactItems.map((item) => (
                <p key={item} className="text-white/30 text-sm leading-[1.7]">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2E7D6F]/12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            &copy; 2025 PT Solusiutama Tekno Broker Asuransi. All rights reserved.
          </p>
          <p className="text-[#2E7D6F]/30 text-xs">
            Melindungi Setiap Langkah Hidupmu
          </p>
        </div>
      </div>
    </footer>
  );
}
