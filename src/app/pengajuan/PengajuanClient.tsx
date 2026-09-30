"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Car,
  CheckCircle2,
  CircleAlert,
  FileText,
  Loader2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/site/Button";
import { Container, Section } from "@/components/site/primitives";
import { buildWhatsAppLink, formatIDR } from "@/lib/format";
import { useSiteSettings } from "@/lib/ServerDataContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PhotoKey = "front" | "back" | "left" | "right";

type QuoteState = {
  vehicle?: {
    brand?: string;
    model?: string;
    year?: string;
    vehicleValue?: string;
  };
  region?: { plate?: string };
  protection?: { coverageType?: "AllRisk" | "TLO" };
  extension?: { addOns?: string[] };
  premium?: {
    totalPremium?: number;
    totalPremiumBeforeDiscount?: number;
    discountAmount?: number;
    adminFee?: number;
    partners?: Array<{
      name: string;
      estimatedPremium: number;
      adminFee?: number;
    }>;
  };
  selectedPartnerIndex?: number | null;
};

const PHOTO_LABELS: Record<PhotoKey, string> = {
  front: "Bagian Depan",
  back: "Bagian Belakang",
  left: "Sisi Kiri",
  right: "Sisi Kanan",
};

const PHOTO_GUIDES: Record<PhotoKey, { title: string; description: string; badge: string }> = {
  front: {
    title: "Contoh Foto Bagian Depan",
    description: "Ambil lurus dari depan. Pastikan seluruh badan mobil, lampu, bumper, dan kaca depan masuk frame.",
    badge: "DEPAN",
  },
  back: {
    title: "Contoh Foto Bagian Belakang",
    description: "Ambil lurus dari belakang. Pastikan bumper, lampu belakang, kaca, dan seluruh badan mobil terlihat.",
    badge: "BELAKANG",
  },
  left: {
    title: "Contoh Foto Sisi Kiri",
    description: "Ambil dari samping kiri dengan jarak cukup agar mobil terlihat utuh dari bumper depan sampai belakang.",
    badge: "KIRI",
  },
  right: {
    title: "Contoh Foto Sisi Kanan",
    description: "Ambil dari samping kanan dengan jarak cukup agar mobil terlihat utuh dan tidak terpotong.",
    badge: "KANAN",
  },
};

function PhotoGuideIllustration({ photoKey }: { photoKey: PhotoKey }) {
  const isSide = photoKey === "left" || photoKey === "right";
  const isRear = photoKey === "back";
  const guide = PHOTO_GUIDES[photoKey];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#DDE5E8] bg-[#F8FAFC] p-4">
      <div className="absolute left-3 top-3 z-10 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#0F766E] shadow-sm">
        {guide.badge}
      </div>

      <svg
        viewBox="0 0 520 300"
        className="h-auto w-full"
        role="img"
        aria-label={guide.title}
      >
        <rect x="20" y="20" width="480" height="260" rx="26" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="10 10" />

        <path d="M52 78V50h28M440 50h28v28M52 222v28h28M468 222v28h-28"
          fill="none" stroke="#0F766E" strokeWidth="7" strokeLinecap="round" />

        {isSide ? (
          <>
            <path
              d="M102 193
                 C112 173 130 158 160 148
                 L205 101
                 C215 90 229 84 246 84
                 L327 84
                 C345 84 361 92 371 106
                 L402 148
                 C425 153 442 164 453 180
                 L463 198
                 L449 217
                 L107 217
                 L91 199
                 Z"
              fill="#EAF8F5"
              stroke="#0F766E"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path
              d="M216 103h106c13 0 23 5 30 14l22 30H184l32-44Z"
              fill="#DCEFF3"
              stroke="#0F766E"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d="M278 104v43" stroke="#0F766E" strokeWidth="4" />
            <path d="M379 148l-16 20" stroke="#0F766E" strokeWidth="4" />
            <path d="M172 151h215" stroke="#0F766E" strokeWidth="4" />
            <path d="M198 154v46M325 154v46" stroke="#94A3B8" strokeWidth="3" />
            <path d="M219 174h28M338 174h28" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
            <rect x="111" y="179" width="32" height="12" rx="6" fill="#F59E0B" />
            <rect x="411" y="179" width="28" height="12" rx="6" fill="#F59E0B" />
            <circle cx="171" cy="213" r="34" fill="#334155" />
            <circle cx="388" cy="213" r="34" fill="#334155" />
            <circle cx="171" cy="213" r="16" fill="#CBD5E1" />
            <circle cx="388" cy="213" r="16" fill="#CBD5E1" />
            <circle cx="171" cy="213" r="6" fill="#64748B" />
            <circle cx="388" cy="213" r="6" fill="#64748B" />
            <path d="M91 199h42M421 199h42" stroke="#0F766E" strokeWidth="5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path
              d="M157 212
                 L139 193
                 L151 127
                 C154 110 164 99 182 92
                 L211 80
                 H309
                 L338 92
                 C356 99 366 110 369 127
                 L381 193
                 L363 212
                 Z"
              fill="#EAF8F5"
              stroke="#0F766E"
              strokeWidth="6"
              strokeLinejoin="round"
            />

            <path
              d="M195 96h130
                 c10 0 18 7 20 17
                 l12 48H163l12-48
                 c2-10 10-17 20-17Z"
              fill="#DCEFF3"
              stroke="#0F766E"
              strokeWidth="4"
            />

            {!isRear ? (
              <>
                <path d="M176 164h168l17 19H159l17-19Z" fill="#DDF5F0" stroke="#0F766E" strokeWidth="4" />
                <path d="M183 174h48" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" />
                <path d="M289 174h48" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" />
                <rect x="223" y="185" width="74" height="18" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
                <path d="M252 98v62" stroke="#94A3B8" strokeWidth="3" />
                <path d="M166 126l-18-8M354 126l18-8" stroke="#0F766E" strokeWidth="5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M177 163h166l14 22H163l14-22Z" fill="#DDF5F0" stroke="#0F766E" strokeWidth="4" />
                <path d="M180 174h52" stroke="#DC2626" strokeWidth="13" strokeLinecap="round" />
                <path d="M288 174h52" stroke="#DC2626" strokeWidth="13" strokeLinecap="round" />
                <rect x="220" y="187" width="80" height="18" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
                <path d="M195 96h130" stroke="#94A3B8" strokeWidth="3" />
                <path d="M205 116h110" stroke="#94A3B8" strokeWidth="3" />
                <path d="M165 127l-17-7M355 127l17-7" stroke="#0F766E" strokeWidth="5" strokeLinecap="round" />
              </>
            )}

            <path d="M168 211h-18c-12 0-20-9-20-20v-15" stroke="#334155" strokeWidth="11" strokeLinecap="round" />
            <path d="M352 211h18c12 0 20-9 20-20v-15" stroke="#334155" strokeWidth="11" strokeLinecap="round" />
          </>
        )}

        <text x="260" y="258" textAnchor="middle" fontSize="16" fontWeight="700" fill="#475569">
          Seluruh mobil harus masuk frame
        </text>
      </svg>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-[#334155]">
        {label}{required ? <span className="text-[#DC2626]"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full min-h-12 rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10";

export default function PengajuanClient() {
  const router = useRouter();
  const { settings } = useSiteSettings();
  const [quote, setQuote] = React.useState<QuoteState | null>(null);
  const [loadingQuote, setLoadingQuote] = React.useState(true);
  const [uploadNow, setUploadNow] = React.useState(true);
  const [photos, setPhotos] = React.useState<Record<PhotoKey, File | null>>({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [form, setForm] = React.useState({
    customerName: "",
    birthDate: "",
    phoneNumber: "",
    whatsappNumber: "",
    email: "",
    address: "",
    engineNumber: "",
    chassisNumber: "",
    stnkName: "",
  });
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [whatsappLink, setWhatsappLink] = React.useState("");
  const [guidePhoto, setGuidePhoto] = React.useState<PhotoKey | null>(null);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem("jp_calc_state");
      if (!raw) {
        router.replace("/cek-premi");
        return;
      }
      const parsed = JSON.parse(raw) as QuoteState;
      if (!parsed.premium || !parsed.vehicle?.brand) {
        router.replace("/cek-premi");
        return;
      }
      setQuote(parsed);
    } catch {
      router.replace("/cek-premi");
    } finally {
      setLoadingQuote(false);
    }
  }, [router]);

  const selectedPartner =
    quote?.selectedPartnerIndex !== null &&
    quote?.selectedPartnerIndex !== undefined &&
    quote?.premium?.partners?.[quote.selectedPartnerIndex]
      ? quote.premium.partners[quote.selectedPartnerIndex]
      : quote?.premium?.partners?.[0];

  const estimatedPremium =
    selectedPartner?.estimatedPremium ?? quote?.premium?.totalPremium ?? 0;

  const setValue = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const uploadPhoto = async (key: PhotoKey, file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("slot", key);

    try {
      const response = await fetch("/api/applications/upload", {
        method: "POST",
        body: data,
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body.error || `Gagal upload ${PHOTO_LABELS[key]}.`);
      }
      return body.url as string;
    } catch (err) {
      if (err instanceof Error && err.message !== "Failed to fetch") throw err;
      throw new Error(`Upload ${PHOTO_LABELS[key]} gagal. Cek koneksi lalu coba lagi.`);
    }
  };

  const handleSubmit = async () => {
    if (!quote) return;

    if (!form.customerName.trim()) return setError("Nama pemegang polis wajib diisi.");
    if (!form.birthDate) return setError("Tanggal lahir wajib diisi.");
    if (!form.whatsappNumber.trim()) return setError("Nomor WhatsApp wajib diisi.");
    const cleanWhatsapp = form.whatsappNumber.replace(/[\s\-+]/g, "");
    if (!/^\d{10,15}$/.test(cleanWhatsapp)) {
      return setError("Nomor WhatsApp tidak valid.");
    }
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return setError("Email wajib diisi dengan format yang valid.");
    }
    if (!form.address.trim()) return setError("Alamat wajib diisi.");
    if (!form.engineNumber.trim()) return setError("Nomor mesin wajib diisi.");
    if (!form.chassisNumber.trim()) return setError("Nomor rangka wajib diisi.");

    if (uploadNow) {
      const missing = (Object.keys(PHOTO_LABELS) as PhotoKey[]).find((key) => !photos[key]);
      if (missing) return setError(`Foto ${PHOTO_LABELS[missing]} wajib diupload.`);
    }

    setError(null);
    setSubmitting(true);

    try {
      const photoUrls: Partial<Record<PhotoKey, string>> = {};
      if (uploadNow) {
        // Upload sequentially. Sending four large camera photos at once is fragile on mobile networks.
        for (const key of Object.keys(PHOTO_LABELS) as PhotoKey[]) {
          const file = photos[key];
          if (!file) continue;
          photoUrls[key] = await uploadPhoto(key, file);
        }
      }

      let productId: string | null = null;
      try {
        const productsResponse = await fetch("/api/products");
        if (productsResponse.ok) {
          const productsBody = await productsResponse.json();
          const product = (productsBody.products as Array<{ id: string; slug: string }> | undefined)
            ?.find((item) => item.slug === "asuransi-mobil");
          productId = product?.id ?? null;
        }
      } catch {
        // The lead endpoint still receives all quote data below.
      }

      const vehicle = quote.vehicle || {};
      const otr = parseInt(String(vehicle.vehicleValue || "").replace(/\D/g, ""), 10) || 0;
      const addOns = quote.extension?.addOns || [];
      const coverageType = quote.protection?.coverageType || "AllRisk";

      const notes = [
        "PENGAJUAN ASURANSI MOBIL",
        `Tanggal lahir: ${form.birthDate}`,
        `Telepon: ${form.phoneNumber.trim() || "-"}`,
        `Email: ${form.email.trim()}`,
        `Alamat: ${form.address.trim()}`,
        `No. mesin: ${form.engineNumber.trim()}`,
        `No. rangka: ${form.chassisNumber.trim()}`,
        `Nama STNK berbeda: ${form.stnkName.trim() || "-"}`,
        `Upload foto: ${uploadNow ? "Sekarang" : "Nanti"}`,
        ...(uploadNow
          ? (Object.keys(PHOTO_LABELS) as PhotoKey[]).map((key) => {
              const path = photoUrls[key];
              const url = path ? new URL(path, window.location.origin).toString() : "-";
              return `${PHOTO_LABELS[key]}: ${url}`;
            })
          : []),
      ].join("\n");

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          whatsappNumber: cleanWhatsapp,
          productId,
          notes,
          coverageType,
          vehicleBrand: vehicle.brand || null,
          vehicleType: vehicle.model || null,
          vehicleYear: vehicle.year || null,
          plateRegion: quote.region?.plate || null,
          vehiclePriceOtr: otr || null,
          addOns: addOns.length ? JSON.stringify(addOns) : null,
          estimatedPremium: estimatedPremium || null,
          originalPremium: quote.premium?.totalPremiumBeforeDiscount || null,
          discountAmount: quote.premium?.discountAmount || null,
          adminFee: selectedPartner?.adminFee ?? quote.premium?.adminFee ?? null,
          customerBudget: null,
          selectedPartner: selectedPartner?.name || null,
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || "Gagal mengirim pengajuan.");
      }

      const leadId = body?.lead?.id || "";
      try {
        sessionStorage.setItem(
          "jp_application_submitted",
          JSON.stringify({ leadId: leadId || null, submittedAt: Date.now() }),
        );
      } catch {
        // no-op
      }

      const vehicleName = [vehicle.brand, vehicle.model].filter(Boolean).join(" ");
      const coverageLabel = coverageType === "TLO" ? "TLO" : "All Risk";
      const whatsappMessage = [
        "Halo Jasa Proteksi, saya sudah mengirim pengajuan asuransi mobil melalui website.",
        "",
        `Nama: ${form.customerName.trim()}`,
        `Kendaraan: ${vehicleName || "-"}`,
        `Tahun: ${vehicle.year || "-"}`,
        `Wilayah: ${quote.region?.plate || "-"}`,
        `Perlindungan: ${coverageLabel}`,
        `Perusahaan: ${selectedPartner?.name || "-"}`,
        `Estimasi premi: ${formatIDR(estimatedPremium)}`,
        ...(leadId ? [`ID Pengajuan: ${leadId}`] : []),
        "",
        "Data lengkap dan foto kendaraan sudah tersimpan di sistem. Mohon dibantu proses berikutnya.",
      ].join("\n");

      const waLink = settings.whatsapp
        ? buildWhatsAppLink(settings.whatsapp, whatsappMessage)
        : "";
      setWhatsappLink(waLink);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Data is already safely stored in admin before WhatsApp opens.
      if (waLink) {
        window.location.href = waLink;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingQuote || !quote) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <SiteHeader />
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Memuat data pengajuan...
          </div>
        </main>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
        <SiteHeader />
        <main className="flex-1">
          <Section tone="soft" className="!pt-8 !pb-12">
            <Container className="max-w-xl">
              <div className="rounded-2xl border border-[#A7F3D0] bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5] text-[#0F766E]">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h1 className="text-xl font-bold text-[#0F172A]">Pengajuan berhasil dikirim</h1>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                  Data pengajuan sudah masuk ke sistem Jasa Proteksi. Tim kami akan menghubungi nomor WhatsApp yang Anda daftarkan untuk proses berikutnya.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  {whatsappLink ? (
                    <Button as="external" href={whatsappLink} variant="primary" size="lg" className="w-full">
                      Buka WhatsApp Lagi
                    </Button>
                  ) : null}
                  <Button as="link" href="/" variant="secondary" size="lg" className="w-full">
                    Kembali ke Beranda
                  </Button>
                </div>
              </div>
            </Container>
          </Section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <SiteHeader />
      <main className="flex-1">
        <Section tone="soft" className="!pt-5 !pb-12">
          <Container className="max-w-2xl min-w-0 overflow-x-hidden">
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E]"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke hasil premi
            </button>

            <div className="mb-4 rounded-2xl border border-[#A7F3D0] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                <ShieldCheck className="h-4 w-4 text-[#0F766E]" />
                Ringkasan Pilihan
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[#64748B]">Kendaraan</p>
                  <p className="font-semibold text-[#0F172A]">
                    {quote.vehicle?.brand} {quote.vehicle?.model}
                  </p>
                  <p className="text-xs text-[#64748B]">{quote.vehicle?.year}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Perusahaan</p>
                  <p className="font-semibold text-[#0F172A]">{selectedPartner?.name || "Pilihan simulasi"}</p>
                  <p className="text-xs text-[#64748B]">
                    {quote.protection?.coverageType === "TLO" ? "TLO" : "All Risk"}
                  </p>
                </div>
              </div>
              <div className="mt-3 border-t border-[#E2E8F0] pt-3">
                <p className="text-xs text-[#64748B]">Estimasi premi tahunan</p>
                <p className="text-xl font-extrabold text-[#0F766E]">{formatIDR(estimatedPremium)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <section className="min-w-0 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-[#0F766E]" />
                  <h1 className="text-lg font-bold text-[#0F172A]">Data Pemegang Polis</h1>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nama Lengkap" required>
                    <input className={inputClass} value={form.customerName} onChange={(e) => setValue("customerName", e.target.value)} placeholder="Nama sesuai identitas" />
                  </Field>
                  <Field label="Tanggal Lahir" required>
                    <input className={inputClass} type="date" value={form.birthDate} onChange={(e) => setValue("birthDate", e.target.value)} />
                  </Field>
                  <Field label="Nomor Telepon">
                    <input className={inputClass} inputMode="tel" value={form.phoneNumber} onChange={(e) => setValue("phoneNumber", e.target.value)} placeholder="Opsional" />
                  </Field>
                  <Field label="Nomor WhatsApp" required>
                    <input className={inputClass} inputMode="tel" value={form.whatsappNumber} onChange={(e) => setValue("whatsappNumber", e.target.value)} placeholder="08xxxxxxxxxx" />
                  </Field>
                  <Field label="Email" required>
                    <input className={inputClass} type="email" value={form.email} onChange={(e) => setValue("email", e.target.value)} placeholder="nama@email.com" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Alamat" required>
                      <textarea className={`${inputClass} min-h-24 resize-y`} value={form.address} onChange={(e) => setValue("address", e.target.value)} placeholder="Alamat lengkap pemegang polis" />
                    </Field>
                  </div>
                </div>
              </section>

              <section className="min-w-0 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Car className="h-5 w-5 text-[#0F766E]" />
                  <h2 className="text-lg font-bold text-[#0F172A]">Data Kendaraan</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nomor Mesin" required>
                    <input className={inputClass} value={form.engineNumber} onChange={(e) => setValue("engineNumber", e.target.value)} placeholder="Masukkan nomor mesin" />
                  </Field>
                  <Field label="Nomor Rangka" required>
                    <input className={inputClass} value={form.chassisNumber} onChange={(e) => setValue("chassisNumber", e.target.value)} placeholder="Masukkan nomor rangka" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Nama di STNK jika berbeda">
                      <input className={inputClass} value={form.stnkName} onChange={(e) => setValue("stnkName", e.target.value)} placeholder="Kosongkan jika sama dengan pemegang polis" />
                    </Field>
                  </div>
                </div>
              </section>

              <section className="min-w-0 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-[#0F766E]" />
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A]">Foto Kendaraan</h2>
                    <p className="text-xs text-[#64748B]">Maksimal 8 MB per foto. JPG, PNG, atau WebP.</p>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadNow(true)}
                    className={`rounded-xl border-2 p-3 text-sm font-semibold ${uploadNow ? "border-[#0F766E] bg-[#ECFDF5] text-[#0F766E]" : "border-[#E2E8F0] text-[#64748B]"}`}
                  >
                    Upload Sekarang
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadNow(false)}
                    className={`rounded-xl border-2 p-3 text-sm font-semibold ${!uploadNow ? "border-[#0F766E] bg-[#ECFDF5] text-[#0F766E]" : "border-[#E2E8F0] text-[#64748B]"}`}
                  >
                    Upload Nanti
                  </button>
                </div>

                {uploadNow && (
                  <div className="grid min-w-0 gap-3 md:grid-cols-2">
                    {(Object.keys(PHOTO_LABELS) as PhotoKey[]).map((key) => (
                      <div key={key} className="min-w-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-[#334155]">
                            {PHOTO_LABELS[key]} <span className="text-[#DC2626]">*</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setGuidePhoto(key)}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5] text-[#0F766E]"
                            aria-label={`Lihat contoh foto ${PHOTO_LABELS[key]}`}
                          >
                            <CircleAlert className="h-4 w-4" />
                          </button>
                        </div>
                        <label className="block cursor-pointer">
                          <div className="grid min-h-12 min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-dashed border-[#94A3B8] bg-white px-3">
                            <Camera className="h-4 w-4 shrink-0 text-[#64748B]" />
                            <span className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[#64748B]">
                              {photos[key]?.name || "Pilih foto"}
                            </span>
                            <span className="shrink-0 text-xs font-semibold text-[#0F766E]">Pilih</span>
                          </div>
                          <input
                            className="sr-only"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            capture="environment"
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              setPhotos((current) => ({ ...current, [key]: file }));
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {error && (
                <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#991B1B]">
                  {error}
                </div>
              )}

              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {submitting ? "Mengirim Pengajuan..." : "Kirim Pengajuan"}
              </Button>

              <p className="text-center text-xs leading-relaxed text-[#64748B]">
                Data ini digunakan untuk proses pengajuan dan verifikasi polis. Premi final tetap mengikuti quotation dan ketentuan perusahaan asuransi.
              </p>
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />

      <Dialog open={guidePhoto !== null} onOpenChange={(open) => { if (!open) setGuidePhoto(null); }}>
        <DialogContent className="max-w-md">
          {guidePhoto ? (
            <>
              <DialogHeader>
                <DialogTitle>{PHOTO_GUIDES[guidePhoto].title}</DialogTitle>
                <DialogDescription>{PHOTO_GUIDES[guidePhoto].description}</DialogDescription>
              </DialogHeader>
              <PhotoGuideIllustration photoKey={guidePhoto} />
              <div className="rounded-xl bg-[#ECFDF5] p-3 text-xs leading-relaxed text-[#115E59]">
                Tips: foto di tempat terang, kamera sejajar kendaraan, seluruh mobil masuk frame, dan hindari foto blur atau terlalu dekat.
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
