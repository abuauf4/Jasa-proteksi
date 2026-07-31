"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Phone,
  TrendingUp,
  ClipboardList,
  Building2,
  Calculator,
  Settings,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ─── Types ───

interface DashboardStats {
  totalLeads: number;
  leadsBaru: number;
  followupsToday: number;
  conversionRate: number;
  totalSales: number;
  totalPartners: number;
}

interface RecentLead {
  id: string;
  customerName: string;
  whatsappNumber: string;
  vehicleBrand: string | null;
  vehicleType: string | null;
  coverageType: string | null;
  status: string;
  assignedSales: string | null;
  createdAt: string;
}

// ─── Status Config ───

const statusConfig: Record<string, { label: string; color: string }> = {
  baru: { label: "Baru", color: "bg-blue-100 text-blue-700" },
  dihubungi: { label: "Dihubungi", color: "bg-yellow-100 text-yellow-700" },
  ragu_ragu: { label: "Ragu-ragu", color: "bg-orange-100 text-orange-700" },
  negosiasi: { label: "Negosiasi", color: "bg-purple-100 text-purple-700" },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700" },
  lost: { label: "Lost", color: "bg-red-100 text-red-700" },
  expired: { label: "Expired", color: "bg-slate-100 text-slate-600" },
};

// ─── Animation Variants ───

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

// ─── Helpers ───

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

// ─── Stat Card Data ───

const statCards = [
  {
    title: "Total Leads",
    key: "totalLeads" as const,
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100",
    suffix: "",
  },
  {
    title: "Lead Baru Hari Ini",
    key: "leadsBaru" as const,
    icon: UserPlus,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    suffix: "",
  },
  {
    title: "Follow-up Hari Ini",
    key: "followupsToday" as const,
    icon: Phone,
    color: "text-purple-600",
    bg: "bg-purple-100",
    suffix: "",
  },
  {
    title: "Tingkat Konversi",
    key: "conversionRate" as const,
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-100",
    suffix: "%",
  },
];

// ─── Quick Action Data ───

const quickActions = [
  {
    label: "Lihat Leads",
    href: "/admin/leads",
    icon: ClipboardList,
    color: "text-blue-600",
    bg: "bg-blue-50 hover:bg-blue-100 border-blue-200",
  },
  {
    label: "Kelola Partner",
    href: "/admin/partners",
    icon: Building2,
    color: "text-emerald-600",
    bg: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
  },
  {
    label: "Rate & Biaya",
    href: "/admin/rates/motor",
    icon: Calculator,
    color: "text-purple-600",
    bg: "bg-purple-50 hover:bg-purple-100 border-purple-200",
  },
  {
    label: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
    color: "text-slate-600",
    bg: "bg-slate-50 hover:bg-slate-100 border-slate-200",
  },
];

// ─── Component ───

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentLeads(data.recentLeads);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading State ───

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 sm:p-6">
                <div className="h-20 bg-slate-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="lg:col-span-2 animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="h-64 bg-slate-200 rounded" />
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="h-64 bg-slate-200 rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Dashboard ───

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Selamat datang, {session?.user?.name || "Admin"} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Berikut ringkasan data asuransi Anda hari ini.
        </p>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {statCards.map((stat) => (
          <motion.div key={stat.key} variants={item}>
            <Card className="border-slate-200/80 shadow-sm">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-slate-500 truncate">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-3xl font-bold text-slate-800 mt-1">
                      {stats
                        ? stat.key === "conversionRate"
                          ? `${stats[stat.key]}${stat.suffix}`
                          : formatNumber(stats[stat.key])
                        : "—"}
                    </p>
                  </div>
                  <div
                    className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}
                  >
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Lead Terbaru + Aksi Cepat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Lead Terbaru */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="lg:col-span-2"
        >
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg">
                    Lead Terbaru
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    10 lead terakhir yang masuk
                  </CardDescription>
                </div>
                <Clock className="h-4 w-4 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent>
              {recentLeads.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-400">Belum ada leads</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href="/admin/leads">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Lihat Halaman Leads
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-1 max-h-[420px] overflow-y-auto">
                  {recentLeads.map((lead) => {
                    const config = statusConfig[lead.status] || {
                      label: lead.status,
                      color: "bg-slate-100 text-slate-600",
                    };
                    const vehicleInfo = [lead.vehicleBrand, lead.vehicleType]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <Link
                        key={lead.id}
                        href={`/admin/leads/${lead.id}`}
                        className="flex items-center justify-between py-2.5 px-2 sm:px-3 rounded-lg hover:bg-slate-50 transition-colors gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {lead.customerName}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {vehicleInfo || "—"}
                            {lead.coverageType ? ` · ${lead.coverageType}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            className={`${config.color} text-[10px] sm:text-xs px-1.5 sm:px-2 py-0`}
                            variant="secondary"
                          >
                            {config.label}
                          </Badge>
                          <span className="text-[10px] sm:text-xs text-slate-400 w-16 sm:w-20 text-right">
                            {timeAgo(lead.createdAt)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-1"
                    asChild
                  >
                    <Link href="/admin/leads">
                      Lihat Semua Lead
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Aksi Cepat */}
        <motion.div variants={item} initial="hidden" animate="show">
          <Card className="border-slate-200/80 shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Aksi Cepat</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Akses cepat ke halaman penting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.href} href={action.href}>
                    <div
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${action.bg}`}
                    >
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                      <span className="text-xs sm:text-sm font-medium text-slate-700 text-center leading-tight">
                        {action.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
