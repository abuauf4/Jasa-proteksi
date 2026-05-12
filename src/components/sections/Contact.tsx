"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionWrapper from "@/components/shared/SectionWrapper";
import AnimatedSection from "@/components/shared/AnimatedSection";

const contactInfo = [
  { icon: MapPin, label: "Alamat", value: "Jl. Raya Protokol No. 88, Jakarta Selatan" },
  { icon: Phone, label: "Telepon", value: "+62 21 8888 7777" },
  { icon: MessageCircle, label: "WhatsApp", value: "+62 812 3456 7890" },
  { icon: Mail, label: "Email", value: "info@misubishi-showroom.co.id" },
  { icon: Clock, label: "Jam Operasional", value: "Sen-Sab: 08.00 - 17.00 WIB" },
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
          <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] mt-4">
            Hubungi Kami
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Form */}
          <AnimatedSection direction="left">
            <form onSubmit={handleSubmit} className="space-y-5">
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
              <Button
                type="submit"
                className="w-full bg-[#1a1a2e] hover:bg-[#c9a84c] text-white hover:text-[#00001f] h-12 rounded-lg font-semibold tracking-wider transition-all duration-300"
              >
                {submitted ? "Terkirim!" : "Kirim Pesan"}
                {!submitted && <Send className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </AnimatedSection>

          {/* Right - Contact Info */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9a84c]/20 transition-colors duration-300">
                    <info.icon className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                  <div>
                    <p className="text-xs tracking-wider text-muted-foreground uppercase mb-1">{info.label}</p>
                    <p className="font-medium text-sm">{info.value}</p>
                  </div>
                </div>
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
