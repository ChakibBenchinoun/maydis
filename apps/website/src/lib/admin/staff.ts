import type { SupabaseClient } from "@supabase/supabase-js";

export type StaffRole = "owner" | "staff";

export type StaffMember = {
  id: string;
  email: string;
  role: StaffRole;
  active: boolean;
  user_id: string | null;
  created_at: string;
  created_by: string | null;
};

/** Single bootstrap owner email (preferred). */
export function getOwnerBootstrapEmail(): string | null {
  const owner = process.env.OWNER_EMAIL?.trim().toLowerCase();
  if (owner) return owner;
  // Back-compat: first entry of ADMIN_EMAILS / ADMIN_EMAIL
  const legacy = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";
  const first = legacy
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)[0];
  return first ?? null;
}

export function isBootstrapOwnerEmail(email: string): boolean {
  const owner = getOwnerBootstrapEmail();
  if (!owner) return false;
  return email.trim().toLowerCase() === owner;
}

/**
 * Ensure bootstrap OWNER_EMAIL exists as an owner row (idempotent).
 * Call after a successful login by that email.
 */
export async function ensureBootstrapOwner(
  supabase: SupabaseClient,
  email: string,
  userId?: string,
): Promise<void> {
  if (!isBootstrapOwnerEmail(email)) return;
  const normalized = email.trim().toLowerCase();

  const { data: existing } = await supabase
    .from("staff_members")
    .select("id, role, active")
    .ilike("email", normalized)
    .maybeSingle();

  if (existing) {
    if (!existing.active || existing.role !== "owner") {
      await supabase
        .from("staff_members")
        .update({
          active: true,
          role: "owner",
          user_id: userId ?? null,
          email: normalized,
        })
        .eq("id", existing.id);
    } else if (userId) {
      await supabase.from("staff_members").update({ user_id: userId }).eq("id", existing.id);
    }
    return;
  }

  await supabase.from("staff_members").insert({
    email: normalized,
    role: "owner",
    active: true,
    user_id: userId ?? null,
    created_by: "system:OWNER_EMAIL",
  });
}

/** True if email may access /admin (active staff row or bootstrap owner). */
export async function isStaffEmail(
  supabase: SupabaseClient | null,
  email: string | undefined | null,
): Promise<boolean> {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();

  if (isBootstrapOwnerEmail(normalized)) return true;

  if (!supabase) {
    // Without DB, only bootstrap owner (or open in dev if no owner set)
    if (!getOwnerBootstrapEmail() && process.env.NODE_ENV !== "production") {
      return true;
    }
    return false;
  }

  const { data, error } = await supabase
    .from("staff_members")
    .select("id")
    .ilike("email", normalized)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    // Table missing / not migrated — fall back to bootstrap only
    console.warn("[staff] lookup failed", error.message);
    return isBootstrapOwnerEmail(normalized);
  }

  return Boolean(data);
}

export async function listStaff(
  supabase: SupabaseClient,
): Promise<{ rows: StaffMember[]; error?: string }> {
  const { data, error } = await supabase
    .from("staff_members")
    .select("id, email, role, active, user_id, created_at, created_by")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[staff] list failed", error);
    return { rows: [], error: "Could not load staff. Run migration 004_staff_members.sql." };
  }

  return { rows: (data ?? []) as StaffMember[] };
}

export async function getStaffByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<StaffMember | null> {
  const { data } = await supabase
    .from("staff_members")
    .select("id, email, role, active, user_id, created_at, created_by")
    .ilike("email", email.trim().toLowerCase())
    .maybeSingle();
  return (data as StaffMember) ?? null;
}

export async function addStaffMember(
  supabase: SupabaseClient,
  input: {
    email: string;
    role: StaffRole;
    createdBy: string;
    userId?: string;
  },
): Promise<{ row: StaffMember | null; error?: string }> {
  const email = input.email.trim().toLowerCase();
  const { data, error } = await supabase
    .from("staff_members")
    .insert({
      email,
      role: input.role,
      active: true,
      user_id: input.userId ?? null,
      created_by: input.createdBy,
    })
    .select("id, email, role, active, user_id, created_at, created_by")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { row: null, error: "That email is already on the staff list." };
    }
    console.error("[staff] insert failed", error);
    return { row: null, error: "Could not add staff member." };
  }

  return { row: data as StaffMember };
}

export async function deactivateStaffMember(
  supabase: SupabaseClient,
  id: string,
): Promise<{ error?: string }> {
  const { data: row } = await supabase
    .from("staff_members")
    .select("id, role, active")
    .eq("id", id)
    .maybeSingle();

  if (!row) return { error: "Staff member not found." };

  if (row.role === "owner") {
    const { count } = await supabase
      .from("staff_members")
      .select("id", { count: "exact", head: true })
      .eq("role", "owner")
      .eq("active", true);
    if ((count ?? 0) <= 1) {
      return { error: "Cannot remove the last owner." };
    }
  }

  const { error } = await supabase.from("staff_members").update({ active: false }).eq("id", id);

  if (error) {
    console.error("[staff] deactivate failed", error);
    return { error: "Could not remove staff member." };
  }
  return {};
}
