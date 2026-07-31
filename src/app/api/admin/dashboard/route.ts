import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export async function GET() {
  const start = Date.now();
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Run all independent queries in parallel
    const [
      totalLeads,
      leadsBaru,
      followupsToday,
      approvedLeads,
      leadsByStatus,
      recentLeads,
      totalSales,
      totalPartners,
    ] = await Promise.all([
      db.insuranceLead.count(),
      db.insuranceLead.count({
        where: { createdAt: { gte: today, lt: tomorrow } },
      }),
      db.leadFollowup.count({
        where: { followupDate: { gte: today, lt: tomorrow } },
      }),
      db.insuranceLead.count({ where: { status: "approved" } }),
      db.insuranceLead.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      db.insuranceLead.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { assignedSales: { select: { name: true } } },
      }),
      db.user.count({ where: { role: "sales", isActive: true } }),
      db.insurancePartner.count({ where: { status: "active" } }),
    ]);

    // Conversion rate (depends on totalLeads + approvedLeads from parallel results)
    const conversionRate = totalLeads > 0 ? ((approvedLeads / totalLeads) * 100).toFixed(1) : "0";

    // If sales user, show their assigned leads + unassigned leads
    if (session.user.role === "sales") {
      const salesWhere = {
        OR: [
          { assignedSalesId: session.user.id },
          { assignedSalesId: null },
        ],
      };

      const [
        salesLeadsCount,
        salesLeadsBaru,
        salesFollowupsToday,
        salesApprovedLeads,
        salesActiveLeads,
        salesLeadsByStatus,
        salesRecentLeads,
      ] = await Promise.all([
        db.insuranceLead.count({ where: salesWhere }),
        db.insuranceLead.count({
          where: { ...salesWhere, createdAt: { gte: today, lt: tomorrow } },
        }),
        db.leadFollowup.count({
          where: {
            salesId: session.user.id,
            followupDate: { gte: today, lt: tomorrow },
          },
        }),
        db.insuranceLead.count({ where: { ...salesWhere, status: "approved" } }),
        db.insuranceLead.count({
          where: {
            ...salesWhere,
            status: { in: ["baru", "dihubungi", "ragu_ragu", "negosiasi"] },
          },
        }),
        db.insuranceLead.groupBy({
          by: ["status"],
          where: salesWhere,
          _count: { status: true },
        }),
        db.insuranceLead.findMany({
          where: salesWhere,
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { assignedSales: { select: { name: true } } },
        }),
      ]);

      const salesConversionRate = salesLeadsCount > 0
        ? ((salesApprovedLeads / salesLeadsCount) * 100).toFixed(1)
        : "0";

      const elapsed = Date.now() - start;
      console.log(`[PERF] GET /api/admin/dashboard (sales): ${elapsed}ms`);

      return NextResponse.json({
        stats: {
          totalLeads: salesLeadsCount,
          leadsBaru: salesLeadsBaru,
          followupsToday: salesFollowupsToday,
          conversionRate: parseFloat(salesConversionRate),
          totalSales,
          totalPartners,
          activeLeads: salesActiveLeads,
        },
        leadsByStatus: salesLeadsByStatus.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
        recentLeads: salesRecentLeads.map((lead) => ({
          id: lead.id,
          customerName: lead.customerName,
          whatsappNumber: lead.whatsappNumber,
          vehicleBrand: lead.vehicleBrand,
          vehicleType: lead.vehicleType,
          coverageType: lead.coverageType,
          status: lead.status,
          assignedSales: lead.assignedSales?.name || null,
          createdAt: lead.createdAt,
        })),
      });
    }

    const elapsed = Date.now() - start;
    console.log(`[PERF] GET /api/admin/dashboard: ${elapsed}ms`);

    return NextResponse.json({
      stats: {
        totalLeads,
        leadsBaru,
        followupsToday,
        conversionRate: parseFloat(conversionRate),
        totalSales,
        totalPartners,
      },
      leadsByStatus: leadsByStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      recentLeads: recentLeads.map((lead) => ({
        id: lead.id,
        customerName: lead.customerName,
        whatsappNumber: lead.whatsappNumber,
        vehicleBrand: lead.vehicleBrand,
        vehicleType: lead.vehicleType,
        coverageType: lead.coverageType,
        status: lead.status,
        assignedSales: lead.assignedSales?.name || null,
        createdAt: lead.createdAt,
      })),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
