import Link from "next/link";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { listReservations } from "@/lib/reservations/service";
import { getServiceRoleClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = getServiceRoleClient();
  let pending = 0;
  let confirmed = 0;
  let total = 0;

  if (supabase) {
    const { rows } = await listReservations(supabase, { status: "all", limit: 200 });
    total = rows.length;
    pending = rows.filter((r) => r.status === "pending").length;
    confirmed = rows.filter((r) => r.status === "confirmed").length;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-foreground text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Signed in as {admin.email}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Loaded bookings" value={total} />
        <Stat label="Pending" value={pending} />
        <Stat label="Confirmed" value={confirmed} />
      </div>

      <div className="border-border/50 bg-card rounded-2xl border p-5">
        <h2 className="font-display text-lg font-bold">Quick links</h2>
        <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
          <li>
            <Link href="/admin/reservations" className="text-primary font-semibold hover:underline">
              Manage reservations
            </Link>
            {" — "}
            update status, view guest details
          </li>
          <li>
            <Link href="/admin/staff" className="text-primary font-semibold hover:underline">
              Staff
            </Link>
            {" — "}
            owner can add colleagues (they do not go in env)
          </li>
          <li className="text-muted-foreground/70">Menu admin — coming soon</li>
          <li className="text-muted-foreground/70">Gallery admin — coming soon</li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-border/50 bg-card rounded-2xl border px-4 py-4">
      <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">{label}</p>
      <p className="font-display text-foreground mt-1 text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
