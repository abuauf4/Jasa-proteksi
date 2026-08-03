"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  BarChart3,
  Share2,
  DollarSign,
  AlertTriangle,
  Loader2,
  Save,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// ─── Component ───

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // Contact
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsapp2, setWhatsapp2] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Integration
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [metaPixelId, setMetaPixelId] = useState("");
  const [gtmId, setGtmId] = useState("");
  const [adsenseId, setAdsenseId] = useState("");

  // Maintenance
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // ─── Fetch settings ───
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/site-settings");
      if (res.ok) {
        const data = await res.json();
        const map = data.map || {};
        setWhatsapp(map.whatsapp || "");
        setWhatsapp2(map.whatsapp2 || "");
        setPhone(map.phone || "");
        setEmail(map.email || "");
        setAddress(map.address || "");
        setGoogleAnalyticsId(map.googleAnalyticsId || "");
        setMetaPixelId(map.metaPixelId || "");
        setGtmId(map.gtmId || "");
        setAdsenseId(map.adsenseId || "");
        setMaintenanceMode(map.maintenanceMode === "true");
      }
    } catch {
      toast.error("Gagal memuat pengaturan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ─── Save section ───
  const saveSection = async (
    section: string,
    data: Record<string, string>
  ) => {
    setSaving((prev) => ({ ...prev, [section]: true }));
    try {
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success(`Pengaturan ${section} berhasil disimpan`);
      } else {
        toast.error(`Gagal menyimpan pengaturan ${section}`);
      }
    } catch {
      toast.error(`Gagal menyimpan pengaturan ${section}`);
    } finally {
      setSaving((prev) => ({ ...prev, [section]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="h-5 w-5 text-slate-500" />
          Pengaturan Website
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Kelola informasi kontak, integrasi, dan pengaturan lainnya
        </p>
      </div>

      <div className="grid gap-6">
        {/* ── Informasi Kontak ── */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Phone className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">
                  Informasi Kontak
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Nomor telepon, email, dan alamat
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-3 w-3" /> WhatsApp Utama
                </Label>
                <Input
                  id="whatsapp"
                  placeholder="6285282297399"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
                <p className="text-xs text-slate-400">
                  Format tanpa + atau 0 depan, contoh: 6285282297399
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp2" className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-3 w-3" /> WhatsApp Kedua
                </Label>
                <Input
                  id="whatsapp2"
                  placeholder="6281234567890"
                  value={whatsapp2}
                  onChange={(e) => setWhatsapp2(e.target.value)}
                />
                <p className="text-xs text-slate-400">
                  Nomor WhatsApp kedua (opsional). Muncul di tombol WhatsApp frontend.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3" /> Nomor Telepon
                </Label>
                <Input
                  id="phone"
                  placeholder="0211234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="settingsEmail" className="flex items-center gap-2 text-sm">
                <Mail className="h-3 w-3" /> Email
              </Label>
              <Input
                id="settingsEmail"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2 text-sm">
                <MapPin className="h-3 w-3" /> Alamat
              </Label>
              <Textarea
                id="address"
                placeholder="Masukkan alamat lengkap"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() =>
                  saveSection("Kontak", { whatsapp, whatsapp2, phone, email, address })
                }
                disabled={saving["Kontak"]}
                className="bg-[#14B8A6] hover:bg-[#0D9488] text-white"
              >
                {saving["Kontak"] ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan Kontak
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Integrasi ── */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-violet-100 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Integrasi</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Google Analytics & Meta Pixel untuk tracking
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="googleAnalyticsId"
                className="flex items-center gap-2 text-sm"
              >
                <BarChart3 className="h-3 w-3" /> Google Analytics ID
              </Label>
              <Input
                id="googleAnalyticsId"
                placeholder="G-XXXXXXXXXX"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              />
              <p className="text-xs text-slate-400">
                ID Measurement Google Analytics untuk melacak pengunjung website.
                Contoh: G-ABC123DEF4
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaPixelId" className="flex items-center gap-2 text-sm">
                <Share2 className="h-3 w-3" /> Meta Pixel ID
              </Label>
              <Input
                id="metaPixelId"
                placeholder="1234567890"
                value={metaPixelId}
                onChange={(e) => setMetaPixelId(e.target.value)}
              />
              <p className="text-xs text-slate-400">
                ID Meta (Facebook) Pixel untuk tracking iklan & retargeting di
                Facebook/Instagram.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gtmId" className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-3 w-3" /> Google Tag Manager ID
              </Label>
              <Input
                id="gtmId"
                placeholder="GTM-XXXXXXX"
                value={gtmId}
                onChange={(e) => setGtmId(e.target.value)}
              />
              <p className="text-xs text-slate-400">
                ID Google Tag Manager untuk mengelola semua tracking script (GA4, Meta Pixel, dll) dalam satu tempat. Jika diisi, GTM akan otomatis load GA4 & Meta Pixel.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adsenseId" className="flex items-center gap-2 text-sm">
                <DollarSign className="h-3 w-3" /> Google AdSense Publisher ID
              </Label>
              <Input
                id="adsenseId"
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                value={adsenseId}
                onChange={(e) => setAdsenseId(e.target.value)}
              />
              <p className="text-xs text-slate-400">
                Publisher ID Google AdSense untuk menampilkan iklan display di website.
                Contoh: ca-pub-1234567890123456. Kosongkan jika tidak menggunakan AdSense.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() =>
                  saveSection("Integrasi", { googleAnalyticsId, metaPixelId, gtmId, adsenseId })
                }
                disabled={saving["Integrasi"]}
                className="bg-[#14B8A6] hover:bg-[#0D9488] text-white"
              >
                {saving["Integrasi"] ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan Integrasi
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Mode Maintenance ── */}
        <Card
          className={`border-slate-200/80 shadow-sm ${
            maintenanceMode ? "border-amber-300 bg-amber-50/30" : ""
          }`}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                  maintenanceMode
                    ? "bg-amber-100"
                    : "bg-slate-100"
                }`}
              >
                <AlertTriangle
                  className={`h-4 w-4 ${
                    maintenanceMode ? "text-amber-600" : "text-slate-400"
                  }`}
                />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">
                  Mode Maintenance
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Kontrol ketersediaan website untuk pengunjung
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  {maintenanceMode
                    ? "Mode Maintenance AKTIF"
                    : "Mode Maintenance NONAKTIF"}
                </p>
                <p className="text-xs text-slate-500">
                  {maintenanceMode
                    ? "Website sedang tidak bisa diakses pengunjung"
                    : "Website normal dan bisa diakses pengunjung"}
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={(checked) => {
                  setMaintenanceMode(checked);
                  saveSection("Maintenance", {
                    maintenanceMode: String(checked),
                  });
                }}
              />
            </div>
            {maintenanceMode && (
              <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Perhatian!
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Mode maintenance aktif — website tidak bisa diakses pengunjung.
                    Hanya halaman admin yang tetap bisa diakses. Matikan jika sudah
                    selesai pemeliharaan.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
