"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle, ArrowUp } from "lucide-react";
import { Container } from "./primitives";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { buildWhatsAppLink } from "@/lib/format";
import { buildCalculatorUrl } from "@/lib/calculator-urls";

interface FooterLinkGroup {
  title: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}

const LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Layanan",
    links: [
      { label: "Cek Premi", href: "/#kalkulator" },
      { label: "All Risk", href: buildCalculatorUrl("all-risk") },
      { label: "TLO", href: buildCalculatorUrl("tlo") },
      { label: "Cara Kerja", href: "/#cara-kerja" },
    ],
  },
  {
    title: "Informasi",
    links: [
      { label: "Tentang Kami", href: "/tentang-kami" },
      { label: "Artikel", href: "/artikel" },
      { label: "FAQ", href: "/#faq" },
      { label: "Hubungi Kami", href: "/#kalkulator" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
      { label: "Syarat dan Ketentuan", href: "/syarat-ketentuan" },
      { label: "Simulasi", href: "/#disclaimer" },
    ],
  },
];

export function SiteFooter() {
  const { settings } = useSiteSettings();

  const whatsappLink = settings.whatsapp
    ? buildWhatsAppLink(settings.whatsapp, "Halo Jasa Proteksi, saya ingin bertanya tentang asuransi mobil.")
    : null;

  const scrollToTop = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer className="bg-[#0B1120] text-[#CBD5E1] mt-auto">
      {/* ── Main footer content ── */}
      <Container className="pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
          {/* Brand column — spans 5 cols */}
          <div className="lg:col-span-5">
            {/* Logo + brand */}
            <Link href="/" className="inline-flex items-center group" aria-label="Jasa Proteksi — Beranda">
              <Image
                src="/brand/jasa-proteksi-logo.png"
                alt="Jasa Proteksi"
                width={160}
                height={42}
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </Link>

            {/* Tagline */}
            <p className="mt-3 text-sm font-medium text-[#0F766E] italic tracking-wide">
              Smart people. Smart proteksi.
            </p>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed text-[#94A3B8] max-w-sm">
              Platform simulasi premi dan pengajuan asuransi mobil All Risk atau TLO secara online.
              Dapatkan estimasi otomatis berdasarkan data kendaraan dan wilayah penggunaan.
            </p>

            {/* Contact info */}
            <div className="mt-5 flex flex-col gap-2.5">
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-[#94A3B8] hover:text-white transition-colors"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-[#0F766E]" aria-hidden />
                  </span>
                  <span>{settings.whatsapp}</span>
                </a>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2.5 text-sm text-[#94A3B8] hover:text-white transition-colors"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center">
                    <Mail className="h-4 w-4 text-[#0F766E]" aria-hidden />
                  </span>
                  <span>{settings.email}</span>
                </a>
              )}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-2.5 text-sm text-[#94A3B8] hover:text-white transition-colors"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center">
                    <Phone className="h-4 w-4 text-[#0F766E]" aria-hidden />
                  </span>
                  <span>{settings.phone}</span>
                </a>
              )}
              {settings.address && (
                <p className="text-sm text-[#94A3B8] leading-relaxed mt-1">
                  {settings.address}
                </p>
              )}
            </div>
          </div>

          {/* Link groups — each spans ~2 cols */}
          {LINK_GROUPS.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F766E] mb-4">{group.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#94A3B8] hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-[#94A3B8] hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Back to top — spans 1 col */}
          <div className="lg:col-span-1 flex items-start justify-end">
            <button
              type="button"
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl bg-[#1E293B] hover:bg-[#0F766E] text-[#94A3B8] hover:text-white flex items-center justify-center transition-all shadow-lg hover:shadow-[#0F766E]/20"
              aria-label="Kembali ke atas"
            >
              <ArrowUp className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </Container>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#1E293B]">
        <Container className="py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Catatan */}
            <p className="text-xs text-[#64748B] leading-relaxed max-w-xl text-center sm:text-left">
              <strong className="text-[#94A3B8]">Catatan:</strong> Jasa Proteksi menyediakan
              simulasi awal dan bantuan proses pengajuan. Premi, manfaat, pengecualian, serta
              ketentuan akhir mengikuti quotation dan polis dari perusahaan asuransi terkait.
            </p>

            {/* Copyright + credit */}
            <div className="flex flex-col items-center sm:items-end gap-0.5 shrink-0">
              <p className="text-xs text-[#64748B]">
                © {new Date().getFullYear()} Jasa Proteksi — Smart People. Smart Proteksi
              </p>
              <p className="text-[11px] text-[#475569]">
                Designed &amp; Developed by{" "}
                <a
                  href="https://motion.nauka.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0F766E] font-medium hover:underline"
                >
                  Nauka Motion
                </a>
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
