"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, Mail, MessageCircle } from "lucide-react";
import { Container } from "./primitives";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { buildWhatsAppLink } from "@/lib/format";

interface FooterLinkGroup {
  title: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}

const LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Layanan",
    links: [
      { label: "Cek Premi", href: "/#kalkulator" },
      { label: "All Risk", href: "/asuransi-mobil-all-risk" },
      { label: "TLO", href: "/asuransi-mobil-tlo" },
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
      { label: "Disclaimer Simulasi", href: "/#disclaimer" },
    ],
  },
];

export function SiteFooter() {
  const { settings } = useSiteSettings();

  const whatsappLink = settings.whatsapp
    ? buildWhatsAppLink(settings.whatsapp, "Halo Jasa Proteksi, saya ingin bertanya tentang asuransi mobil.")
    : null;

  return (
    <footer className="bg-[#0F172A] text-[#E2E8F0] mt-auto">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-white" aria-hidden />
              </span>
              <span className="text-base font-bold text-white">Jasa Proteksi</span>
            </Link>
            <p className="text-sm leading-relaxed text-[#94A3B8] max-w-sm">
              Platform simulasi premi dan pengajuan asuransi mobil All Risk atau TLO secara online.
              Dapatkan estimasi otomatis berdasarkan data kendaraan dan wilayah penggunaan.
            </p>

            {/* Contact info */}
            <div className="mt-5 flex flex-col gap-2">
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  <span>WhatsApp: {settings.whatsapp}</span>
                </a>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  <span>{settings.email}</span>
                </a>
              )}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  <span>{settings.phone}</span>
                </a>
              )}
              {settings.address && (
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {settings.address}
                </p>
              )}
            </div>
          </div>

          {/* Link groups */}
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white mb-3">{group.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#94A3B8] hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-[#94A3B8] hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-8 border-t border-[#1E293B]">
          <p className="text-xs text-[#94A3B8] leading-relaxed max-w-3xl">
            <strong className="text-white">Disclaimer:</strong> Jasa Proteksi menyediakan
            simulasi awal dan bantuan proses pengajuan. Premi, manfaat, pengecualian, serta
            ketentuan akhir mengikuti quotation dan polis dari perusahaan asuransi terkait.
          </p>
          <p className="mt-4 text-xs text-[#64748B]">
            © {new Date().getFullYear()} Jasa Proteksi. Semua hak dilindungi.
          </p>
        </div>
      </Container>
    </footer>
  );
}
