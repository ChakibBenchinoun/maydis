import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Login page uses a nested layout without shell — see admin/login/layout
  // This layout wraps all /admin/* except we need login outside shell.
  // Next applies parent layout to login too; login layout will be full-bleed
  // and we skip shell when not authenticated by redirecting… but login must work.
  // Solution: check path via headers is fragile. Use two route groups instead.
  // For simplicity: requireAdmin only on pages that need it; layout always shells if admin.

  const admin = await requireAdmin();
  if (!admin) {
    // Login page is under /admin/login — middleware handles unauthenticated redirect.
    // When requireAdmin fails on login page (no session), don't redirect loop:
    // children for login render without shell via segment layout override.
    return <>{children}</>;
  }

  return <AdminShell email={admin.email}>{children}</AdminShell>;
}
