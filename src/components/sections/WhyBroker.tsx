"use client";

import {
  GitCompareArrows,
  Headphones,
  MessageSquareText,
  FileCheck,
  Eye,
  Handshake,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const brokerKeys = [
  "compare",
  "advisor",
  "simpleLang",
  "personal",
  "claimAssist",
  "transparent",
];

const brokerIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  compare: GitCompareArrows,
  advisor: Headphones,
  simpleLang: MessageSquareText,
  personal: Handshake,
  claimAssist: FileCheck,
  transparent: Eye,
};

export default function WhyBroker() {
  const { t } = useLanguage();

  return (
    <section id="why-broker" className="bg-[#EEF3F8] ds-section">
      <div className="ds-container">
        <SectionHeader
          label={t("whyBroker.label")}
          heading={t("whyBroker.heading")}
          subheading={t("whyBroker.subheading")}
          accent="primary"
          headingColor="text-[#172033]"
          subheadingColor="text-[#64748B]"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {brokerKeys.map((key) => {
            const Icon = brokerIcons[key];
            return (
              <div
                key={key}
                className="ds-card group hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#0F766E]" />
                </div>
                <h3 className="text-lg font-semibold text-[#172033] mb-2">
                  {t(`whyBroker.items.${key}.title`)}
                </h3>
                <p className="ds-body text-[#64748B]">
                  {t(`whyBroker.items.${key}.desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
