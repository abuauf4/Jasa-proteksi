"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Car,
  CheckCircle2,
  FileText,
  Loader2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/site/Button";
import { Container, Section } from "@/components/site/primitives";
import { formatIDR } from "@/lib/format";

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

    const response = await fetch("/api/applications/upload", {
      method: "POST",
      body: data,
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.error || `Gagal upload ${PHOTO_LABELS[key]}.`);
    }
    return body.url as string;
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
        const uploaded = await Promise.all(
          (Object.keys(PHOTO_LABELS) as PhotoKey[]).map(async (key) => {
            const file = photos[key];
            if (!file) return [key, ""] as const;
            const url = await uploadPhoto(key, file);
            return [key, url] as const;
          }),
        );
        for (const [key, url] of uploaded) photoUrls[key] = url;
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
          ? (Object.keys(PHOTO_LABELS) as PhotoKey[]).map(
              (key) => `${PHOTO_LABELS[key]}: ${photoUrls[key] || "-"}`,
            )
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

      try {
        sessionStorage.setItem(
          "jp_application_submitted",
          JSON.stringify({ leadId: body?.lead?.id || null, submittedAt: Date.now() }),
        );
      } catch {
        // no-op
      }
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
                <div className="mt-5">
                  <Button as="link" href="/" variant="primary" size="lg" className="w-full">
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
          <Container className="max-w-2xl">
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
              <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
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

              <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
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

              <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
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
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(Object.keys(PHOTO_LABELS) as PhotoKey[]).map((key) => (
                      <label key={key} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                        <span className="mb-2 block text-sm font-semibold text-[#334155]">
                          {PHOTO_LABELS[key]} <span className="text-[#DC2626]">*</span>
                        </span>
                        <div className="flex min-h-12 items-center gap-2 rounded-lg border border-dashed border-[#94A3B8] bg-white px-3">
                          <Camera className="h-4 w-4 text-[#64748B]" />
                          <span className="min-w-0 flex-1 truncate text-xs text-[#64748B]">
                            {photos[key]?.name || "Pilih foto"}
                          </span>
                          <span className="text-xs font-semibold text-[#0F766E]">Pilih</span>
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
    </div>
  );
}
