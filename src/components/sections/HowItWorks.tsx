"use client";

import { MessageSquare, Search, GitCompare, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Ceritakan Kebutuhan",
    description:
      "Bagikan kebutuhan dan situasi Anda melalui konsultasi yang mudah dan tanpa tekanan.",
  },
  {
    icon: Search,
    number: "02",
    title: "Pelajari Pilihan Proteksi",
    description:
      "Kami membantu Anda memahami produk yang relevan dengan bahasa yang sederhana dan jelas.",
  },
  {
    icon: GitCompare,
    number: "03",
    title: "Bandingkan Manfaat",
    description:
      "Bandingkan manfaat, premi, dan ketentuan dari beberapa opsi secara objektif.",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Tentukan dengan Lebih Yakin",
    description:
      "Ambil keputusan dengan pemahaman yang lebih baik dan perasaan yang lebih tenang.",
  },
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="bg-[#F8FAFC] ds-section">
      <div className="ds-container">
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="ds-accent-line" />
          </div>
          <h2 className="ds-h2 text-[#172033] mb-4">Cara Kerja</h2>
          <p className="ds-body-lg text-[#64748B] max-w-xl mx-auto">
            Empat langkah sederhana untuk mendapatkan perlindungan yang tepat
            sesuai kebutuhan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative text-center">
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-[#DDE4EC]" />
                )}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-[#DDE4EC] mb-5 mx-auto">
                  <Icon className="w-7 h-7 text-[#0F766E]" />
                </div>
                <div className="text-sm font-bold text-[#DDE4EC] mb-2">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-[#172033] mb-2">
                  {step.title}
                </h3>
                <p className="ds-body text-[#64748B] max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
