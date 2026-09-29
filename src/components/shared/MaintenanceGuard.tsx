"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * MaintenanceGuard — wraps public pages to check if maintenance mode is on.
 * If maintenance mode is active and user is not on admin/maintenance pages,
 * redirect to /maintenance.
 */
export default function MaintenanceGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Skip check for admin and maintenance pages
  const isSkipped =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/api");

  useEffect(() => {
    if (isSkipped) return;

    const checkMaintenance = async () => {
      try {
        const res = await fetch("/api/site-settings");
        if (res.ok) {
          const data = await res.json();
          const map = data.map || {};
          if (map.maintenanceMode === "true") {
            router.replace("/maintenance");
            return;
          }
        }
      } catch {
        // If check fails, show the page normally
      }
    };

    checkMaintenance();
  }, [pathname, router, isSkipped]);

  // Always render public content during SSR so crawlers receive the real page
  // (headings, copy, and internal links) in the initial HTML. The maintenance
  // check still runs client-side and redirects when maintenance mode is active.
  return <>{children}</>;
}
