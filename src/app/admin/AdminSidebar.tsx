"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Package,
  Car,
  Shield,
  ShieldCheck,
  Percent,
  Settings,
  Newspaper,
  Image,
  UsersRound,
  Calculator,
  ChevronRight,
  LogOut,
  UserCircle,
  Palette,
  Search,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// ─── Navigation Data ───

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Which roles can see this item. Empty = all roles. */
  roles?: string[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
  /** If set, the whole group is only visible to these roles */
  roles?: string[];
}

interface NavGroupWithSub {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems: NavItem[];
  roles?: string[];
}

const mainMenu: NavGroup = {
  label: "Menu Utama",
  items: [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Leads", href: "/admin/leads", icon: Users },
    { title: "Follow-up", href: "/admin/followups", icon: UserCheck },
  ],
};

const bisnisMenu: NavGroup = {
  label: "Bisnis",
  roles: ["admin"],
  items: [
    { title: "Partner", href: "/admin/partners", icon: Building2 },
    { title: "Produk", href: "/admin/products", icon: Package },
  ],
};

const rateMenu: NavGroupWithSub = {
  label: "Rate & Biaya",
  icon: Calculator,
  roles: ["admin"],
  subItems: [
    { title: "Rate Dasar Motor", href: "/admin/rates/motor", icon: Car },
    { title: "Rate Addon", href: "/admin/rates/addon", icon: Shield },
    { title: "Rate Loading", href: "/admin/rates/loading", icon: Percent },
    { title: "Rate TPL", href: "/admin/rates/tpl", icon: ShieldCheck },
    { title: "Pengaturan Rate", href: "/admin/rates/settings", icon: Settings },
  ],
};

const kontenMenu: NavGroup = {
  label: "Konten",
  roles: ["admin"],
  items: [
    { title: "Artikel", href: "/admin/articles", icon: Newspaper },
    { title: "Media", href: "/admin/media", icon: Image },
    { title: "Hero & Branding", href: "/admin/branding", icon: Palette },
    { title: "SEO", href: "/admin/seo", icon: Search },
  ],
};

const sistemMenu: NavGroup = {
  label: "Sistem",
  roles: ["admin"],
  items: [
    { title: "Pengaturan Web", href: "/admin/settings", icon: Settings },
    { title: "Pengguna", href: "/admin/users", icon: UsersRound },
  ],
};

// ─── Component ───

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const userRole = session?.user?.role || "admin";

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const isRateActive = pathname.startsWith("/admin/rates");

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = session?.user?.name || "Admin";

  // Role-based role label
  const roleLabel = userRole === "admin" ? "Admin" : "Sales";

  /** Check if a group/item is visible for the current user's role */
  const isVisible = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true;
    return roles.includes(userRole);
  };

  const renderNavGroup = (group: NavGroup) => {
    if (!isVisible(group.roles)) return null;

    const visibleItems = group.items.filter((item) =>
      isVisible(item.roles)
    );

    if (visibleItems.length === 0) return null;

    return (
      <SidebarGroup key={group.label}>
        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {visibleItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={item.title}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* ─── Header: Logo ─── */}
      <SidebarHeader className="px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sky-500 text-white">
                  <span className="text-sm font-bold">JP</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-slate-800">
                    Jasa Proteksi
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Admin Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ─── Content: Navigation ─── */}
      <SidebarContent>
        {/* Menu Utama — visible to all roles */}
        {renderNavGroup(mainMenu)}

        {/* Bisnis — admin only */}
        {renderNavGroup(bisnisMenu)}

        {/* Rate & Biaya — admin only, Collapsible */}
        {isVisible(rateMenu.roles) && (
          <SidebarGroup>
            <SidebarGroupLabel>Rate & Biaya</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible
                  defaultOpen={isRateActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip="Rate & Biaya">
                        <rateMenu.icon />
                        <span>Rate & Biaya</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {rateMenu.subItems
                          .filter((item) => isVisible(item.roles))
                          .map((item) => (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(item.href)}
                              >
                                <Link href={item.href}>
                                  <item.icon />
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Konten — admin only */}
        {renderNavGroup(kontenMenu)}

        {/* Sistem — admin only */}
        {renderNavGroup(sistemMenu)}
      </SidebarContent>

      {/* ─── Footer: User ─── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-slate-200 text-slate-600 text-xs">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {roleLabel}
                    </span>
                  </div>
                  <ChevronRight className="ml-auto size-4 rotate-90" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
