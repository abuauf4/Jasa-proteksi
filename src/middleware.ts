import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Role-based route protection:
 * - Admin: full access to all /admin/*
 * - Sales: only /admin (dashboard), /admin/leads, /admin/followups
 * - Unauthenticated: redirect to /admin/login
 */

// Routes that sales users CAN access
const SALES_ALLOWED_PREFIXES = [
  "/admin",
  "/admin/leads",
  "/admin/followups",
];

// Exact routes that sales can access (to distinguish /admin from /admin/something)
const SALES_ALLOWED_EXACT = [
  "/admin",
];

function isSalesAllowed(pathname: string): boolean {
  // Exact match for dashboard
  if (SALES_ALLOWED_EXACT.includes(pathname)) return true;

  // Prefix match for allowed sections
  // But we need to make sure /admin/leads doesn't match /admin/leads-management etc.
  // Since our routes are /admin/leads, /admin/leads/[id], /admin/followups
  return SALES_ALLOWED_PREFIXES.some(
    (prefix) => prefix !== "/admin" && pathname.startsWith(prefix)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Not logged in → redirect to login
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    const role = token.role as string;

    // Sales: only allow specific routes
    if (role === "sales" && !isSalesAllowed(pathname)) {
      // Redirect sales to dashboard if they try to access admin-only pages
      const dashboardUrl = new URL("/admin", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
