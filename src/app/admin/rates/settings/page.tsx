"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Pencil, Settings } from "lucide-react";
import { toast } from "sonner";

interface RateSetting {
  id: string;
  key: string;
  label: string;
  value: number;
  unit: string;
  category: string;
  description: string | null;
  isActive: boolean;
}

const UNIT_LABELS: Record<string, { display: string; suffix: string }> = {
  rate: { display: "Rate", suffix: "%" },
  IDR: { display: "Rupiah", suffix: "Rp" },
  year: { display: "Tahun", suffix: "thn" },
  fraction: { display: "Fraksi", suffix: "" },
  multiplier: { display: "Pengali", suffix: "×" },
  percent: { display: "Persen", suffix: "%" },
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "Diskon & Pengali",
  fee: "Biaya Admin & Polis",
  loading: "Loading (Umur Kendaraan)",
  eligibility: "Kelayakan (Max Umur)",
  partner_modifier: "Modifier Partner",
};

const CATEGORY_ORDER = ["general", "fee", "loading", "eligibility", "partner_modifier"];

function formatValue(value: number, unit: string): string {
  const unitInfo = UNIT_LABELS[unit] || { display: unit, suffix: "" };
  if (unit === "IDR") {
    return `Rp ${value.toLocaleString("id-ID")}`;
  }
  if (unit === "rate" || unit === "percent") {
    return `${(value * 100).toFixed(2)}%`;
  }
  if (unit === "multiplier") {
    return `${value}×`;
  }
  return `${value} ${unitInfo.suffix}`;
}

export default function RateSettingsPage() {
  const [settings, setSettings] = useState<RateSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/rates/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch {
      toast.error("Gagal memuat pengaturan");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string) => {
    try {
      const res = await fetch("/api/admin/rates/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, value: parseFloat(editValue) }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditValue("");
        fetchSettings();
        toast.success("Pengaturan berhasil diperbarui");
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal memperbarui pengaturan");
      }
    } catch {
      toast.error("Gagal memperbarui pengaturan");
    }
  };

  const startEdit = (setting: RateSetting) => {
    setEditingId(setting.id);
    setEditValue(setting.value.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  // Group by category
  const groupedSettings = settings.reduce<Record<string, RateSetting[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan Rate</h1>
        <p className="text-slate-500 text-sm">Diskon, biaya admin, biaya polis, loading, dan pengaturan kelayakan</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400">Memuat data...</div>
      ) : (
        CATEGORY_ORDER.map((cat) => {
          const catSettings = groupedSettings[cat];
          if (!catSettings || catSettings.length === 0) return null;

          return (
            <Card key={cat}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-5 w-5 text-sky-500" />
                  {CATEGORY_LABELS[cat] || cat}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {catSettings.map((setting) => {
                  const unitInfo = UNIT_LABELS[setting.unit] || { display: setting.unit, suffix: "" };
                  const isEditing = editingId === setting.id;

                  return (
                    <div
                      key={setting.id}
                      className={`rounded-lg border border-slate-200 p-4 ${!setting.isActive ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Left side: label & description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-slate-700 text-sm">
                              {setting.label}
                            </p>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[10px] shrink-0">
                              {unitInfo.display}
                            </Badge>
                          </div>
                          {setting.description && (
                            <p className="text-xs text-slate-400 mb-2">{setting.description}</p>
                          )}

                          {/* Value display or edit */}
                          {isEditing ? (
                            <div className="flex items-center gap-2 mt-2">
                              <Input
                                type="number"
                                step="any"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-10 text-sm flex-1 min-w-0"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSave(setting.id)}
                                className="text-green-500 min-h-[44px] min-w-[44px] p-0 shrink-0"
                              >
                                <Check className="h-5 w-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelEdit}
                                className="text-red-500 min-h-[44px] min-w-[44px] p-0 shrink-0"
                              >
                                <X className="h-5 w-5" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className="font-mono text-lg font-semibold text-slate-800 cursor-pointer hover:text-sky-500"
                                onClick={() => startEdit(setting)}
                                title="Klik untuk edit"
                              >
                                {formatValue(setting.value, setting.unit)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEdit(setting)}
                                className="text-sky-500 min-h-[44px] min-w-[44px] p-0 shrink-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
