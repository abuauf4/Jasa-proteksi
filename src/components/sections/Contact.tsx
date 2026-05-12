"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const contactInfo = [
  {
    icon: MapPin,
    title: "Alamat",
    detail: "Jl. Raya Protokol Halim PK, Jakarta Timur",
  },
  {
    icon: Phone,
    title: "Telepon",
    detail: "021-800123",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: "0812-3456-7890",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "info@misubishi.co.id",
  },
  {
    icon: Clock,
    title: "Jam Operasional",
    detail: "Senin - Sabtu 08:00 - 17:00",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
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
  };

  return (
    <SectionWrapper id="kontak" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-4">
            Hubungi Kami
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Kami siap membantu Anda. Hubungi kami atau isi form di bawah ini
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <AnimatedSection direction="left">
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-foreground mb-6">
                  Kirim Pesan
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        placeholder="Masukkan nama Anda"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@contoh.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">No. Telepon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="08xx-xxxx-xxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subjek</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Pilih subjek" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="test-drive">Booking Test Drive</SelectItem>
                          <SelectItem value="kredit">Simulasi Kredit</SelectItem>
                          <SelectItem value="trade-in">Trade-In</SelectItem>
                          <SelectItem value="servis">Servis & Perawatan</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea
                      id="message"
                      placeholder="Tulis pesan Anda di sini..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12"
                    disabled={submitted}
                  >
                    {submitted ? (
                      "Pesan Terkirim! ✓"
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection direction="right">
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <Card key={info.title} className="border-border/50 hover:border-accent/30 transition-colors duration-300">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold font-[family-name:var(--font-montserrat)] text-foreground text-sm">
                        {info.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mt-0.5">{info.detail}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Map placeholder */}
              <div className="mt-6 rounded-xl overflow-hidden border border-border/50">
                <div className="aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm font-medium">Peta Lokasi</p>
                    <p className="text-muted-foreground/60 text-xs">Jl. Raya Protokol Halim PK</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </SectionWrapper>
  );
}
