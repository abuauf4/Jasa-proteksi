"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

const emptySubscribe = () => () => {};
function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

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
  const mounted = useHasMounted();
  const [checked, setChecked] = useState(false);

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
      setChecked(true);
    };

    checkMaintenance();
  }, [pathname, router, isSkipped]);

  // Don't render until check is complete (for non-admin pages)
  if (!mounted) return null;
  if (isSkipped) return <>{children}</>;
  if (!checked) return null;

  return <>{children}</>;
}
