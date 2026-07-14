"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import type { StaffMember, StaffRole } from "@/lib/admin/staff";

export function StaffPanel({
  initialRows,
  me,
}: {
  initialRows: StaffMember[];
  me: { email: string; role: StaffRole };
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("staff");
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isOwner = me.role === "owner";

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!isOwner) return;
    setError(null);
    setNote(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = (await res.json()) as {
        error?: string;
        row?: StaffMember;
        note?: string;
      };
      if (!res.ok) throw new Error(data.error || "Could not add staff");
      if (data.row) setRows((prev) => [...prev, data.row!]);
      setNote(data.note ?? "Staff added.");
      setEmail("");
      setPassword("");
      setRole("staff");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function onRemove(id: string) {
    if (!isOwner) return;
    if (!confirm("Remove this person from staff access?")) return;
    setError(null);
    const res = await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Could not remove");
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, active: false } : r)));
    router.refresh();
  }

  const active = rows.filter((r) => r.active);
  const inactive = rows.filter((r) => !r.active);

  return (
    <div className="space-y-8">
      {!isOwner && (
        <p className="bg-secondary text-muted-foreground rounded-xl px-4 py-3 text-sm">
          Only the owner can add or remove staff. You are signed in as staff.
        </p>
      )}

      {isOwner && (
        <form
          onSubmit={onAdd}
          className="border-border/50 bg-card space-y-4 rounded-2xl border p-5 shadow-sm"
        >
          <h2 className="font-display text-lg font-bold">Add staff</h2>
          <p className="text-muted-foreground text-sm">
            Creates a login and grants admin access. Share the email and temporary password with
            them securely.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border bg-secondary focus:border-primary w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none"
                placeholder="colleague@example.com"
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Temporary password
              </label>
              <input
                type="text"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border bg-secondary focus:border-primary w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="border-border bg-secondary w-full rounded-lg border px-3.5 py-2.5 text-sm"
              >
                <option value="staff">Staff</option>
                <option value="owner">Owner</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Adding…" : "Add staff member"}
          </button>
        </form>
      )}

      {error && (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      )}
      {note && (
        <p className="bg-accent/15 text-accent rounded-lg px-3 py-2 text-sm font-medium">{note}</p>
      )}

      <div>
        <h2 className="font-display text-lg font-bold">Team</h2>
        <ul className="mt-3 space-y-2">
          {active.map((r) => (
            <li
              key={r.id}
              className="border-border/50 bg-card flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3"
            >
              <div>
                <p className="text-foreground text-sm font-semibold">
                  {r.email}
                  {r.email === me.email ? (
                    <span className="text-muted-foreground ml-2 text-xs font-normal">(you)</span>
                  ) : null}
                </p>
                <p className="text-muted-foreground text-xs capitalize">{r.role}</p>
              </div>
              {isOwner && r.email !== me.email && (
                <button
                  type="button"
                  onClick={() => void onRemove(r.id)}
                  className="text-destructive text-xs font-semibold hover:underline"
                >
                  Remove access
                </button>
              )}
            </li>
          ))}
          {active.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No staff rows yet. Sign in once as OWNER_EMAIL to seed the owner, or add people above
              after migration 004.
            </p>
          )}
        </ul>
      </div>

      {inactive.length > 0 && (
        <div>
          <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Removed
          </h3>
          <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
            {inactive.map((r) => (
              <li key={r.id}>
                {r.email} · {r.role}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
