"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TextReveal from "@/components/shared/TextReveal";
import MagneticButton from "@/components/shared/MagneticButton";
import SpotlightCard from "@/components/shared/SpotlightCard";

const contactInfo = [
  { icon: MapPin, label: "Alamat", value: "Menara Anugrah Lantai 23, Unit A, Kantor Taman E 3.3, Jl. DR Ide Anak Agung Gde Agung Lot 8.6, Kawasan Mega Kuningan, Jakarta Selatan 12950" },
  { icon: Phone, label: "Telepon", value: "+6221 5088-6381" },
  { icon: MessageCircle, label: "WhatsApp", value: "+62 877-6686-0381" },
  { icon: Mail, label: "Email", value: "cs@jasaproteksi.id" },
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
    <SectionWrapper id="kontak">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="gold-line" />
          </div>
          <span className="text-xs tracking-[0.3em] text-[#c9a84c] uppercase font-medium">Contact</span>
          <TextReveal
            text="Hubungi Kami"
            as="h2"
            className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] mt-4"
            delay={0.1}
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Form */}
          <AnimatedSection direction="left">
            <SpotlightCard className="rounded-xl" spotlightColor="rgba(201, 168, 76, 0.04)">
              <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-xl border border-border bg-card/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Input
                      placeholder="Nama Lengkap"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      required
                      className="bg-background border-border focus:border-[#c9a84c] h-12 rounded-lg"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      required
                      className="bg-background border-border focus:border-[#c9a84c] h-12 rounded-lg"
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
                      className="bg-background border-border focus:border-[#c9a84c] h-12 rounded-lg"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Subjek"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="bg-background border-border focus:border-[#c9a84c] h-12 rounded-lg"
                    />
                  </div>
                </div>
                <Textarea
                  placeholder="Pesan Anda..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  rows={5}
                  required
                  className="bg-background border-border focus:border-[#c9a84c] rounded-lg resize-none"
                />
                <MagneticButton
                  as="button"
                  onClick={handleSubmit as unknown as () => void}
                  className="w-full bg-[#1a1a2e] hover:bg-[#c9a84c] text-white hover:text-[#00001f] h-12 rounded-lg font-semibold tracking-wider transition-all duration-300 shine-button"
                  strength={0.15}
                >
                  {submitted ? "Terkirim!" : "Kirim Pesan"}
                  {!submitted && <Send className="w-4 h-4 ml-2 inline" />}
                </MagneticButton>
              </form>
            </SpotlightCard>
          </AnimatedSection>

          {/* Right - Contact Info */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="space-y-6">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.label}
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9a84c]/20 transition-colors duration-300">
                    <info.icon className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                  <div>
                    <p className="text-xs tracking-wider text-muted-foreground uppercase mb-1">{info.label}</p>
                    <p className="font-medium text-sm">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Decorative gold line */}
            <div className="gold-line mt-10" />
          </AnimatedSection>
        </div>
      </div>
    </SectionWrapper>
  );
}
