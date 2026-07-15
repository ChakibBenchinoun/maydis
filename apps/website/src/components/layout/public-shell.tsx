"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { HashScroll } from "@/components/layout/hash-scroll";
import { Navbar } from "@/components/layout/navbar";

/**
 * Public chrome: nav always; footer on home (and other marketing pages),
 * hidden on focused product pages `/menu` and `/reserve`.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter =
    pathname === "/menu" ||
    pathname.startsWith("/menu/") ||
    pathname === "/reserve" ||
    pathname.startsWith("/reserve/");

  return (
    <div className="flex min-h-screen flex-col">
      <HashScroll />
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      {hideFooter ? null : <Footer />}
    </div>
  );
}
