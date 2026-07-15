"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { formatPhoneDisplay, normalizeWhatsAppPhone } from "@/lib/phone";
import {
  RESERVATION_STATUSES,
  type ReservationRow,
  type ReservationStatus,
} from "@/lib/reservations/schema";

const statusLabel: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

function statusClass(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-accent/15 text-accent";
    case "cancelled":
      return "bg-destructive/10 text-destructive";
    case "completed":
      return "bg-secondary text-muted-foreground";
    default:
      return "bg-primary/15 text-primary";
  }
}

export function ReservationsTable({
  initialRows,
  initialStatus,
}: {
  initialRows: ReservationRow[];
  initialStatus: string;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState(initialStatus);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function changeFilter(next: string) {
    setFilter(next);
    setError(null);
    const qs = next && next !== "all" ? `?status=${encodeURIComponent(next)}` : "";
    const res = await fetch(`/api/admin/reservations${qs}`);
    const data = (await res.json()) as { rows?: ReservationRow[]; error?: string };
    if (!res.ok) {
      setError(data.error || "Failed to load");
      return;
    }
    setRows(data.rows ?? []);
    router.replace(
      next && next !== "all" ? `/admin/reservations?status=${next}` : "/admin/reservations",
    );
  }

  async function updateStatus(id: string, status: ReservationStatus) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as { row?: ReservationRow; error?: string };
      if (!res.ok) throw new Error(data.error || "Update failed");
      if (data.row) {
        setRows((prev) => prev.map((r) => (r.id === id ? data.row! : r)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Status
        </label>
        <select
          value={filter}
          onChange={(e) => void changeFilter(e.target.value)}
          className="border-border bg-secondary text-foreground rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          {RESERVATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s] ?? s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      )}

      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">No reservations found.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const e164 = normalizeWhatsAppPhone(r.phone);
            const waHref = e164 ? `https://wa.me/${e164}` : undefined;
            return (
              <li key={r.id} className="border-border/50 bg-card rounded-2xl border p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-foreground font-semibold">{r.name}</p>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {r.date} · {r.time} · {r.guests} guests
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {e164 ? formatPhoneDisplay(e164) : r.phone}
                      {r.email ? ` · ${r.email}` : ""}
                    </p>
                    {r.notes ? (
                      <p className="text-foreground/80 mt-2 text-sm leading-relaxed">{r.notes}</p>
                    ) : null}
                    <p className="text-muted-foreground mt-2 text-[11px]">
                      Ref {r.id.slice(0, 8)} · {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(r.status)}`}
                    >
                      {statusLabel[r.status] ?? r.status}
                    </span>
                    <select
                      disabled={busyId === r.id}
                      value={
                        RESERVATION_STATUSES.includes(r.status as ReservationStatus)
                          ? r.status
                          : "pending"
                      }
                      onChange={(e) => void updateStatus(r.id, e.target.value as ReservationStatus)}
                      className="border-border bg-secondary text-foreground rounded-lg border px-2 py-1.5 text-xs"
                    >
                      {RESERVATION_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          Set {statusLabel[s]}
                        </option>
                      ))}
                    </select>
                    {waHref ? (
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-xs font-semibold hover:underline"
                      >
                        WhatsApp guest
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
