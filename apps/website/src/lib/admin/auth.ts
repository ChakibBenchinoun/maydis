import {
  ensureBootstrapOwner,
  getOwnerBootstrapEmail,
  getStaffByEmail,
  isStaffEmail,
  type StaffRole,
} from "@/lib/admin/staff";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { getServiceRoleClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
  role: StaffRole;
};

/**
 * Require a signed-in staff user (DB staff_members or bootstrap OWNER_EMAIL).
 */
export async function requireAdmin(): Promise<AdminUser | null> {
  const auth = await createAuthServerClient();
  if (!auth) return null;

  const {
    data: { user },
  } = await auth.auth.getUser();

  if (!user?.email) return null;

  const service = getServiceRoleClient();
  const email = user.email.trim().toLowerCase();

  // Seed owner row on first login when OWNER_EMAIL matches
  if (service && getOwnerBootstrapEmail()) {
    await ensureBootstrapOwner(service, email, user.id);
  }

  const allowed = await isStaffEmail(service, email);
  if (!allowed) return null;

  let role: StaffRole = "staff";
  if (service) {
    const row = await getStaffByEmail(service, email);
    if (row?.role === "owner") role = "owner";
    else if (getOwnerBootstrapEmail() === email) role = "owner";
  } else if (getOwnerBootstrapEmail() === email) {
    role = "owner";
  }

  return { id: user.id, email, role };
}

/** @deprecated Use requireAdmin — kept for login route messaging */
export function getAdminEmailAllowlist(): string[] {
  const owner = getOwnerBootstrapEmail();
  return owner ? [owner] : [];
}
