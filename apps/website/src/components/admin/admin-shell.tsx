"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Images,
  LayoutDashboard,
  LogOut,
  QrCode,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/lib/constants";
import { images } from "@/lib/images";

const nav: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact: boolean;
}> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarDays, exact: false },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed, exact: false },
  { href: "/admin/gallery", label: "Gallery", icon: Images, exact: false },
  { href: "/admin/qr", label: "QR codes", icon: QrCode, exact: false },
  { href: "/admin/staff", label: "Staff", icon: Users, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname() || "/admin";
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const activeLabel =
    nav.find(({ href, exact }) => isActive(pathname, href, exact))?.label ?? "Admin";

  return (
    <SidebarProvider className="admin-surface bg-background min-h-svh">
      <Sidebar collapsible="icon" variant="sidebar">
        {/* Match top nav height (h-14) so header bars align across the layout */}
        <SidebarHeader className="border-sidebar-border h-14 justify-center border-b px-3">
          <div className="flex h-full items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images.logo} alt="" className="size-8 shrink-0 rounded-md object-contain" />
            <p className="font-display text-sidebar-foreground truncate text-base leading-none font-bold group-data-[collapsible=icon]:hidden">
              {site.name}
            </p>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="pt-2">
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map(({ href, label, icon: Icon, exact }) => {
                  const active = isActive(pathname, href, exact);
                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={label}
                        className={
                          active
                            ? "data-[active=true]:bg-sidebar-primary/15 data-[active=true]:text-sidebar-primary"
                            : undefined
                        }
                      >
                        <Link href={href}>
                          <Icon />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-sidebar-border border-t">
          <div className="text-sidebar-foreground/70 truncate px-2 py-1 text-xs group-data-[collapsible=icon]:hidden">
            {email}
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sign out"
                onClick={() => void signOut()}
                className="text-sidebar-foreground/80"
              >
                <LogOut />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="border-border/50 bg-background sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="text-foreground -ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <div className="flex min-w-0 flex-1 items-center">
            <span className="text-foreground truncate text-sm font-semibold">{activeLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="text-primary text-sm font-medium md:hidden"
          >
            Sign out
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
