"use client";

import { useSession, SessionProvider } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";

// ─── Client-only mounting check (avoids useEffect + setState lint issue) ───

const emptySubscribe = () => () => {};
function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// ─── Admin Header ───

function AdminHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
    </header>
  );
}

// ─── Loading Spinner ───

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent mx-auto" />
        <p className="mt-2 text-sm text-slate-500">Memuat...</p>
      </div>
    </div>
  );
}

// ─── Unauthorized Screen (for sales trying to access admin pages) ───

function UnauthorizedScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Akses Ditolak</h2>
        <p className="mt-2 text-sm text-slate-500">
          Anda tidak memiliki akses ke halaman ini. Halaman ini hanya untuk admin.
        </p>
      </div>
    </div>
  );
}

// ─── Sales-accessible routes ───

const SALES_ALLOWED = ["/admin", "/admin/leads", "/admin/followups"];

function isSalesAllowed(pathname: string): boolean {
  return SALES_ALLOWED.some(
    (allowed) => pathname === allowed || pathname.startsWith(allowed + "/")
  );
}

// ─── Admin Guard ───

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useHasMounted();

  const isLoginPage = pathname === "/admin/login";
  const userRole = session?.user?.role || "admin";
  const isSalesOnAdminPage = userRole === "sales" && !isSalesAllowed(pathname);

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [status, router, isLoginPage]);

  // Redirect sales user trying to access admin-only page
  useEffect(() => {
    if (status === "authenticated" && isSalesOnAdminPage) {
      router.push("/admin");
    }
  }, [status, isSalesOnAdminPage, router]);

  // Always show login page even without session
  if (isLoginPage) {
    return <>{children}</>;
  }

  // During SSR / before client hydration completes, show minimal loading
  if (!mounted) {
    return <LoadingScreen />;
  }

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (!session) return null;

  // Show unauthorized screen briefly before redirect kicks in
  if (isSalesOnAdminPage) {
    return <UnauthorizedScreen />;
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 overflow-auto bg-slate-50 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// ─── Layout Root ───

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminGuard>{children}</AdminGuard>
      <Toaster />
    </SessionProvider>
  );
}
