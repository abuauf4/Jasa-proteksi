"use client";

import { Diamond, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { trackWhatsAppClick } from "@/lib/analytics-events";

const quickLinks = [
  { labelKey: "nav.beranda", href: "#beranda" },
  { labelKey: "nav.produk", href: "#model" },
  { labelKey: "nav.partner", href: "#trust" },
  { labelKey: "nav.whyBroker", href: "#why-broker" },
  { labelKey: "nav.advisor", href: "#advisor" },
  { labelKey: "nav.trust", href: "#trust-legal" },
  { labelKey: "nav.kontak", href: "#kontak" },
];

const productLinks = [
  "Asuransi Mobil",
  "Asuransi Motor (Segera Hadir)",
  "Asuransi Perjalanan (Segera Hadir)",
  "Asuransi Motor Listrik (Segera Hadir)",
];

export default function Footer() {
  const { t } = useLanguage();
  const { settings, loading, ctaWhatsApp } = useSiteSettings();

  // Build dynamic contact items from site settings (only after loaded)
  const contactItems: { icon: typeof MapPin; text: string; href?: string; trackMethod?: string }[] = [];
  if (!loading) {
    if (settings.address) contactItems.push({ icon: MapPin, text: settings.address });
    if (settings.phone) contactItems.push({ icon: Phone, text: `+${settings.phone}` });
    if (ctaWhatsApp) contactItems.push({ icon: MessageCircle, text: `+${ctaWhatsApp}`, href: `https://wa.me/${ctaWhatsApp}`, trackMethod: "footer_wa" });
    if (settings.email) contactItems.push({ icon: Mail, text: settings.email, href: `mailto:${settings.email}` });
  }

  return (
    <footer className="bg-[#0F172A] text-[#94A3B8]">
      {/* Marquee Brand Banner */}
      <div className="border-y border-[#1E293B] py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 mx-8">
              <span className="text-lg font-bold  tracking-[0.2em] text-white/20">
                JASA PROTEKSI
              </span>
              <Diamond className="w-2 h-2 text-[#14B8A6]/50" />
              <span className="text-sm tracking-[0.3em] text-[#14B8A6]/50 uppercase">
                {t("footer.tagline")}
              </span>
              <Diamond className="w-2 h-2 text-[#14B8A6]/50" />
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer - 3 columns */}
      <div className="ds-container pt-10 sm:pt-20 lg:pt-24 pb-12 safe-px">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-14">
          {/* Column 1 - Brand + Contact */}
          <div className="min-w-0">
            <a href="#beranda" className="flex items-center gap-3 mb-7 min-w-0">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/logo-jasa-proteksi.webp"
                  alt="Jasa Proteksi Logo"
                  width={32}
                  height={32}
                  loading="lazy"
                  className="object-contain"
                />
              </div>
              <span className="text-sm sm:text-xl font-bold  tracking-wider text-white truncate">JASA PROTEKSI</span>
              <Diamond className="w-3 h-3 text-[#14B8A6]" />
            </a>
            <p className="text-[#64748B] text-sm leading-[1.7] mb-7">
              {t("footer.brandDesc")} <span className="text-[#14B8A6]">{t("footer.tagline")}</span>
            </p>

            {/* Dynamic Contact Info */}
            <div>
              <h5 className="text-[10px] tracking-wider text-[#64748B] uppercase mb-4">{t("footer.contactLabel")}</h5>
              <ul className="space-y-3">
                {contactItems.map((item, idx) => {
                  const Icon = item.icon;
                  const content = (
                    <span className="flex items-start gap-2.5 text-[#64748B] text-sm leading-[1.7] hover:text-[#14B8A6] transition-colors duration-300">
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#14B8A6]/60" />
                      <span>{item.text}</span>
                    </span>
                  );
                  return (
                    <li key={idx}>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith("https") ? "_blank" : undefined} rel={item.href.startsWith("https") ? "noopener noreferrer" : undefined} onClick={item.trackMethod ? () => trackWhatsAppClick({ method: item.trackMethod }) : undefined}>
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-sm font-semibold  tracking-wider uppercase mb-7 text-[#14B8A6]">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.labelKey}>
                  <a
                    href={link.href}
                    className="text-[#64748B] text-sm hover:text-[#14B8A6] transition-colors duration-300 hover:pl-1"
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Produk */}
          <div>
            <h4 className="text-sm font-semibold  tracking-wider uppercase mb-7 text-[#14B8A6]">
              {t("footer.products")}
            </h4>
            <ul className="space-y-3.5">
              {productLinks.map((product) => (
                <li key={product}>
                  <span className="text-[#64748B] text-sm">{product}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#020617]">
        <div className="ds-container py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-3 safe-px">
          <p className="text-[#64748B] text-xs text-center sm:text-left">
            {t("footer.copyright")}
          </p>
          <p className="text-[#475569] text-xs text-center sm:text-right">
            {t("footer.madeByPrefix")}{" "}
            <a
              href="https://motion.nauka.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#14B8A6] font-medium hover:underline"
            >
              Nauka Motion
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
