"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { trackEvent } from "@/lib/conversion";

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  value: string;
  href?: string;
}

export default function Contact() {
  const { t } = useLanguage();
  const { settings, loading: settingsLoading } = useSiteSettings();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Build contact info from site settings (no more hardcoded fallbacks)
  const contactInfo: ContactInfo[] = [];
  if (!settingsLoading) {
    if (settings.address) {
      contactInfo.push({ icon: MapPin, labelKey: "address", value: settings.address });
    }
    if (settings.phone) {
      contactInfo.push({ icon: Phone, labelKey: "phone", value: `+${settings.phone}` });
    }
    if (settings.whatsapp) {
      contactInfo.push({
        icon: MessageCircle,
        labelKey: "whatsapp",
        value: `+${settings.whatsapp}`,
        href: `https://wa.me/${settings.whatsapp}`,
      });
    }
    if (settings.whatsapp2) {
      contactInfo.push({
        icon: MessageCircle,
        labelKey: "whatsapp2",
        value: `+${settings.whatsapp2}`,
        href: `https://wa.me/${settings.whatsapp2}`,
      });
    }
    if (settings.email) {
      contactInfo.push({ icon: Mail, labelKey: "email", value: settings.email, href: `mailto:${settings.email}` });
    }
    contactInfo.push({ icon: Clock, labelKey: "hours", value: "Senin-Jumat: 10.00-17.00 WIB" });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        // 🔔 Track conversion event
        trackEvent("contact", { method: "form", form: "contact_form" });

        setSubmitted(true);
        setFormState({ name: "", email: "", phone: "", subject: "", message: "" });

        // Redirect to thank-you page after brief delay
        setTimeout(() => {
          window.location.href = "/terima-kasih";
        }, 800);
      } else {
        alert("Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch {
      alert("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="kontak" className="bg-[#F0FDFA]">
      <div className="ds-container safe-px">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-14 lg:mb-20">
          <div className="flex justify-center mb-5 sm:mb-6">
            <div className="ds-accent-line" />
          </div>
          <span className="ds-label text-[#0D9488]">{t("contact.label")}</span>
          <TextReveal
            text={t("contact.heading")}
            as="h2"
            className="ds-h2 font-bold  mt-5 sm:mt-6 text-[#0F172A]"
            delay={0.1}
            staggerDelay={0.05}
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20">
          {/* Left - Form */}
          <AnimatedSection direction="left">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 p-5 sm:p-8 lg:p-10 rounded-2xl border border-[#0D9488]/10 bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Input
                    placeholder={t("contact.form.name")}
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    required
                    minLength={2}
                    className="bg-white border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488] h-12 rounded-lg transition-colors duration-300"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder={t("contact.form.email")}
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    required
                    className="bg-white border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488] h-12 rounded-lg transition-colors duration-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Input
                    type="tel"
                    placeholder={t("contact.form.phone")}
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    pattern="[0-9+\-\s]{7,15}"
                    className="bg-white border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488] h-12 rounded-lg transition-colors duration-300"
                  />
                </div>
                <div>
                  <Input
                    placeholder={t("contact.form.subject")}
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="bg-white border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488] h-12 rounded-lg transition-colors duration-300"
                  />
                </div>
              </div>
              <Textarea
                placeholder={t("contact.form.message")}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                rows={5}
                required
                className="bg-white border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488] rounded-lg resize-none transition-colors duration-300"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 disabled:cursor-not-allowed text-white h-12 rounded-lg font-semibold tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
              >
                {submitting ? "Mengirim..." : submitted ? t("contact.form.sent") : t("contact.form.submit")}
                {!submitted && !submitting && <Send className="w-4 h-4" />}
              </button>
            </form>
          </AnimatedSection>

          {/* Right - Contact Info */}
          <AnimatedSection direction="right" delay={0.15}>
            <div className="space-y-7">
              {contactInfo.map((info, i) => {
                const content = (
                  <div
                    key={info.labelKey}
                    className="flex items-start gap-5 group"
                    style={{
                      opacity: 0,
                      transform: "translateX(16px)",
                      animation: `fadeSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.08}s forwards`,
                    }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#0D9488]/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0D9488]/[0.15] transition-colors duration-300">
                      <info.icon className="w-5 h-5 text-[#0D9488]" />
                    </div>
                    <div>
                      <p className="text-xs tracking-wider text-[#94A3B8] uppercase mb-1">{t(`contact.info.${info.labelKey}`)}</p>
                      <p className="font-medium text-sm text-[#0F172A]">{info.value}</p>
                    </div>
                  </div>
                );

                // Make WhatsApp/email clickable
                if (info.href) {
                  return (
                    <a
                      key={info.labelKey}
                      href={info.href}
                      target={info.href.startsWith("http") ? "_blank" : undefined}
                      rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block"
                      style={{
                        opacity: 0,
                        transform: "translateX(16px)",
                        animation: `fadeSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.08}s forwards`,
                      }}
                    >
                      <div className="flex items-start gap-5 group">
                        <div className="w-10 h-10 rounded-lg bg-[#0D9488]/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0D9488]/[0.15] transition-colors duration-300">
                          <info.icon className="w-5 h-5 text-[#0D9488]" />
                        </div>
                        <div>
                          <p className="text-xs tracking-wider text-[#94A3B8] uppercase mb-1">{t(`contact.info.${info.labelKey}`)}</p>
                          <p className="font-medium text-sm text-[#0F172A] hover:text-[#0D9488] transition-colors">{info.value}</p>
                        </div>
                      </div>
                    </a>
                  );
                }

                return content;
              })}
            </div>

            {/* Decorative line */}
            <div className="section-divider mt-12" />
          </AnimatedSection>
        </div>
      </div>
    </SectionWrapper>
  );
}
