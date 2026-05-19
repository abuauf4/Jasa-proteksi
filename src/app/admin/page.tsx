"use client";

import { useState, useEffect } from "react";
import { Shield, Users, TrendingUp, AlertCircle, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalLeads: number;
  validLeads: number;
  rejectedLeads: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalLeads: 0,
    validLeads: 0,
    rejectedLeads: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, leadsRes] = await Promise.all([
          fetch("/api/products?active=false"),
          fetch("/api/leads?limit=1"),
        ]);
        const productsData = await productsRes.json();
        const leadsData = await leadsRes.json();
        setStats({
          totalProducts: productsData.products?.length || 0,
          totalLeads: leadsData.pagination?.total || 0,
          validLeads: 0,
          rejectedLeads: 0,
        });
        // Fetch valid/rejected counts
        const [validRes, rejectedRes] = await Promise.all([
          fetch("/api/leads?status=valid&limit=1"),
          fetch("/api/leads?status=rejected&limit=1"),
        ]);
        const validData = await validRes.json();
        const rejectedData = await rejectedRes.json();
        setStats((prev) => ({
          ...prev,
          validLeads: validData.pagination?.total || 0,
          rejectedLeads: rejectedData.pagination?.total || 0,
        }));
      } catch {
        console.error("Failed to fetch stats");
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Produk", value: stats.totalProducts, icon: Package, color: "#2E7D6F" },
    { label: "Total Leads", value: stats.totalLeads, icon: Users, color: "#3A9B8A" },
    { label: "Valid Leads", value: stats.validLeads, icon: Shield, color: "#2E7D6F" },
    { label: "Rejected Leads", value: stats.rejectedLeads, icon: AlertCircle, color: "#D97706" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-white/90 font-[family-name:var(--font-montserrat)] mb-2">
          Dashboard
        </h1>
        <p className="text-white/30 text-sm">Overview of your insurance platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 hover:border-[#2E7D6F]/20 transition-all duration-600"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className="w-5 h-5" style={{ color: card.color + "80" }} />
              <span className="text-[10px] tracking-wider text-white/20 uppercase">{card.label}</span>
            </div>
            <p className="text-3xl font-bold text-white/90 font-[family-name:var(--font-montserrat)]">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          href="/admin/products"
          className="group bg-white/[0.02] border border-white/[0.05] rounded-xl p-8 hover:border-[#2E7D6F]/20 transition-all duration-600 flex items-center justify-between"
        >
          <div>
            <h3 className="text-white/80 font-semibold font-[family-name:var(--font-montserrat)] mb-1">Kelola Produk</h3>
            <p className="text-white/30 text-xs">Tambah, edit, dan hapus produk asuransi</p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#2E7D6F] group-hover:translate-x-1 transition-all duration-500" />
        </Link>
        <Link
          href="/admin/leads"
          className="group bg-white/[0.02] border border-white/[0.05] rounded-xl p-8 hover:border-[#2E7D6F]/20 transition-all duration-600 flex items-center justify-between"
        >
          <div>
            <h3 className="text-white/80 font-semibold font-[family-name:var(--font-montserrat)] mb-1">Kelola Leads</h3>
            <p className="text-white/30 text-xs">Lihat dan filter penawaran customer</p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#2E7D6F] group-hover:translate-x-1 transition-all duration-500" />
        </Link>
      </div>
    </div>
  );
}
