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

import { site } from "@/lib/constants";

const nav: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact: boolean;
  disabled?: boolean;
}> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarDays, exact: false },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed, exact: false },
  { href: "/admin/gallery", label: "Gallery", icon: Images, exact: false },
  { href: "/admin/qr", label: "QR codes", icon: QrCode, exact: false },
  { href: "/admin/staff", label: "Staff", icon: Users, exact: false },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname() || "/admin";
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="bg-background flex min-h-screen flex-col md:flex-row">
      <aside className="border-border/60 bg-card w-full shrink-0 border-b md:flex md:w-56 md:flex-col md:border-r md:border-b-0">
        <div className="px-4 py-5">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.2em] uppercase">
            Staff
          </p>
          <p className="font-display text-foreground text-lg font-bold">{site.name}</p>
          <p className="text-muted-foreground mt-1 truncate text-xs" title={email}>
            {email}
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-1 md:flex-col md:overflow-visible md:pb-6">
          {nav.map(({ href, label, icon: Icon, exact, disabled }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            if (disabled) {
              return (
                <span
                  key={href}
                  className="text-muted-foreground/50 flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap"
                  title="Coming soon"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                  <span className="text-[10px]">soon</span>
                </span>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? "bg-primary/15 text-primary flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap"
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-border/50 hidden border-t px-2 py-3 md:block">
          <button
            type="button"
            onClick={() => void signOut()}
            className="text-muted-foreground hover:bg-secondary hover:text-foreground flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border/50 flex items-center justify-between border-b px-4 py-3 md:hidden">
          <span className="text-sm font-semibold">Admin</span>
          <button
            type="button"
            onClick={() => void signOut()}
            className="text-primary text-sm font-medium"
          >
            Sign out
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
