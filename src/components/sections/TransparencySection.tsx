"use client";

import { Eye, Users, FileText, Shield, Headphones } from "lucide-react";

const items = [
  {
    icon: Users,
    title: "Peran Jasa Proteksi",
    description:
      "Kami adalah platform perbandingan asuransi kendaraan yang membantu Anda menemukan produk perlindungan yang sesuai dari berbagai perusahaan asuransi terkemuka di Indonesia. Kami tidak menjual produk kami sendiri — kami membantu Anda memilih yang terbaik.",
  },
  {
    icon: FileText,
    title: "Cara Rekomendasi Diberikan",
    description:
      "Rekomendasi kami berdasarkan analisis kebutuhan Anda, bukan berdasarkan komisi tertinggi. Kami membandingkan manfaat, premi, dan ketentuan secara objektif agar Anda bisa mengambil keputusan yang tepat.",
  },
  {
    icon: Eye,
    title: "Biaya Konsultasi",
    description:
      "Konsultasi awal bersama kami sepenuhnya gratis dan tanpa kewajiban membeli. Anda berhak mengetahui semua informasi yang Anda butuhkan sebelum mengambil keputusan apapun.",
  },
  {
    icon: Shield,
    title: "Penerbit Polis",
    description:
      "Polis asuransi diterbitkan langsung oleh perusahaan asuransi mitra, bukan oleh Jasa Proteksi. Anda mendapatkan polis resmi langsung dari penyedia asuransi pilihan Anda.",
  },
  {
    icon: Headphones,
    title: "Bantuan Setelah Pembelian",
    description:
      "Kami tetap mendampingi Anda setelah polis terbit. Mulai dari pertanyaan tentang polis, perubahan data, hingga bantuan proses klaim — tim kami siap membantu kapan saja.",
  },
];

export default function TransparencySection() {
  return (
    <section id="transparansi" className="bg-white ds-section">
      <div className="ds-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <div className="flex items-center gap-3 mb-4">
              <div className="ds-accent-line" />
            </div>
            <h2 className="ds-h2 text-[#172033] mb-4">Transparansi Kami</h2>
            <p className="ds-body-lg text-[#64748B] max-w-md">
              Kami percaya bahwa keputusan terbaik dimulai dari informasi yang
              jelas. Berikut hal yang perlu Anda ketahui tentang Jasa Proteksi
              dan cara kami bekerja.
            </p>
          </div>

          <div className="space-y-5">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="ds-card flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#0F766E]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#172033] mb-1.5">
                      {item.title}
                    </h3>
                    <p className="ds-body text-[#64748B]">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
