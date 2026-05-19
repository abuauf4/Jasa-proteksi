"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";

const contactInfo = [
  { icon: MapPin, label: "Alamat", value: "Menara Anugrah Lantai 23, Unit A, Kantor Taman E 3.3, Jl. DR Ide Anak Agung Gde Agung Lot 8.6, Kawasan Mega Kuningan, Jakarta Selatan 12950" },
  { icon: Phone, label: "Telepon", value: "+62 813-7929-0494" },
  { icon: MessageCircle, label: "WhatsApp", value: "+62 813-7929-0494" },
  { icon: Mail, label: "Email", value: "abuaufa.nauka@gmail.com" },
  { icon: Clock, label: "Jam Layanan", value: "Senin-Jumat: 10.00-17.00 WIB" },
];

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <SectionWrapper id="kontak" className="bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-24">
          <div className="flex justify-center mb-6">
            <div className="accent-line" />
          </div>
          <span className="text-[11px] tracking-[0.35em] text-[#2E7D6F] uppercase font-medium">Contact</span>
          <TextReveal
            text="Hubungi Kami"
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] mt-6 text-[#0D0D0D] leading-[1.1]"
            delay={0.1}
            staggerDelay={0.05}
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28">
          {/* Left - Form */}
          <AnimatedSection direction="left">
            <form onSubmit={handleSubmit} className="space-y-5 p-8 sm:p-10 rounded-xl border border-gray-100 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Input
                    placeholder="Nama Lengkap"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    required
                    className="bg-[#F5F5F0] border-gray-100 focus:border-[#2E7D6F] h-12 rounded-lg transition-colors duration-500"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    required
                    className="bg-[#F5F5F0] border-gray-100 focus:border-[#2E7D6F] h-12 rounded-lg transition-colors duration-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Input
                    type="tel"
                    placeholder="No. Telepon"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="bg-[#F5F5F0] border-gray-100 focus:border-[#2E7D6F] h-12 rounded-lg transition-colors duration-500"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Subjek"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="bg-[#F5F5F0] border-gray-100 focus:border-[#2E7D6F] h-12 rounded-lg transition-colors duration-500"
                  />
                </div>
              </div>
              <Textarea
                placeholder="Pesan Anda..."
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                rows={5}
                required
                className="bg-[#F5F5F0] border-gray-100 focus:border-[#2E7D6F] rounded-lg resize-none transition-colors duration-500"
              />
              <button
                type="submit"
                className="w-full bg-[#0D0D0D] hover:bg-[#2E7D6F] text-white h-12 rounded-lg font-semibold tracking-wider transition-all duration-800 flex items-center justify-center gap-2"
              >
                {submitted ? "Terkirim!" : "Kirim Pesan"}
                {!submitted && <Send className="w-4 h-4" />}
              </button>
            </form>
          </AnimatedSection>

          {/* Right - Contact Info */}
          <AnimatedSection direction="right" delay={0.15}>
            <div className="space-y-7">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.label}
                  className="flex items-start gap-5 group"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#2E7D6F]/[0.07] flex items-center justify-center flex-shrink-0 group-hover:bg-[#2E7D6F]/[0.12] transition-colors duration-800">
                    <info.icon className="w-5 h-5 text-[#2E7D6F]" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-wider text-gray-300 uppercase mb-1">{info.label}</p>
                    <p className="font-medium text-sm text-[#0D0D0D]">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Decorative emerald line */}
            <div className="h-px w-full bg-gradient-to-r from-[#2E7D6F]/50 via-[#2E7D6F]/15 to-transparent mt-12" />
          </AnimatedSection>
        </div>
      </div>
    </SectionWrapper>
  );
}
