import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

// One-time script: Delete JPadmin and reassign to Bagas (admin only)
export async function DELETE() {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const jpAdmin = await db.user.findUnique({ where: { username: "JPadmin" } });
    const bagas = await db.user.findUnique({ where: { username: "Bagas" } });

    if (!jpAdmin) {
      return NextResponse.json({ message: "JPadmin not found — already deleted" });
    }

    if (bagas) {
      const leads = await db.insuranceLead.updateMany({
        where: { assignedSalesId: jpAdmin.id },
        data: { assignedSalesId: bagas.id },
      });
      const followups = await db.leadFollowup.updateMany({
        where: { salesId: jpAdmin.id },
        data: { salesId: bagas.id },
      });
      const articles = await db.article.updateMany({
        where: { authorId: jpAdmin.id },
        data: { authorId: bagas.id },
      });
      await db.user.delete({ where: { id: jpAdmin.id } });

      return NextResponse.json({
        success: true,
        message: "JPadmin deleted, data reassigned to Bagas",
        reassigned: { leads: leads.count, followups: followups.count, articles: articles.count },
      });
    } else {
      await db.user.delete({ where: { id: jpAdmin.id } });
      return NextResponse.json({
        success: true,
        message: "JPadmin deleted (Bagas not found, relations set to null)",
      });
    }
  } catch (error) {
    console.error("Delete JPadmin error:", error);
    return NextResponse.json({ error: "Failed to delete JPadmin" }, { status: 500 });
  }
}
