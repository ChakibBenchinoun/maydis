"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

function statusBadgeClass(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-accent/15 text-accent border-transparent";
    case "cancelled":
      return "bg-destructive/10 text-destructive border-transparent";
    case "completed":
      return "bg-secondary text-muted-foreground border-transparent";
    default:
      return "bg-primary/15 text-primary border-transparent";
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

  async function changeFilter(next: string) {
    setFilter(next);
    const qs = next && next !== "all" ? `?status=${encodeURIComponent(next)}` : "";
    const res = await fetch(`/api/admin/reservations${qs}`);
    const data = (await res.json()) as { rows?: ReservationRow[]; error?: string };
    if (!res.ok) {
      toast.error(data.error || "Failed to load reservations");
      return;
    }
    setRows(data.rows ?? []);
    router.replace(
      next && next !== "all" ? `/admin/reservations?status=${next}` : "/admin/reservations",
    );
  }

  async function updateStatus(id: string, status: ReservationStatus) {
    setBusyId(id);
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
        toast.success(`Marked ${statusLabel[status] ?? status}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Label
          htmlFor="reservation-status-filter"
          className="text-muted-foreground text-xs uppercase"
        >
          Status
        </Label>
        <select
          id="reservation-status-filter"
          value={filter}
          onChange={(e) => void changeFilter(e.target.value)}
          className="border-border bg-secondary text-foreground focus:border-primary rounded-lg border px-3 py-2 text-sm focus:outline-hidden"
        >
          <option value="all">All</option>
          {RESERVATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s] ?? s}
            </option>
          ))}
        </select>
        <Badge variant="secondary" className="tabular-nums">
          {rows.length} shown
        </Badge>
      </div>

      {rows.length === 0 ? (
        <Card className="py-10">
          <CardContent className="text-muted-foreground text-center text-sm">
            No reservations found for this filter.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const e164 = normalizeWhatsAppPhone(r.phone);
            const waHref = e164 ? `https://wa.me/${e164}` : undefined;
            const eventLabel = r.event_name?.trim() || null;
            return (
              <li key={r.id}>
                <Card className="gap-3 py-4">
                  <CardHeader className="px-4 pb-0 sm:px-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <CardTitle className="text-base font-semibold">{r.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {r.date} · {r.time} · {r.guests} guests
                        </CardDescription>
                      </div>
                      <Badge className={statusBadgeClass(r.status)}>
                        {statusLabel[r.status] ?? r.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 sm:px-5">
                    {eventLabel ? (
                      <p className="text-foreground text-sm">
                        <span className="text-muted-foreground">Event: </span>
                        {eventLabel}
                      </p>
                    ) : null}
                    <p className="text-muted-foreground text-sm">
                      {e164 ? formatPhoneDisplay(e164) : r.phone}
                      {r.email ? ` · ${r.email}` : ""}
                    </p>
                    {r.notes ? (
                      <p className="text-foreground/80 text-sm leading-relaxed">{r.notes}</p>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <select
                        disabled={busyId === r.id}
                        value={
                          RESERVATION_STATUSES.includes(r.status as ReservationStatus)
                            ? r.status
                            : "pending"
                        }
                        onChange={(e) =>
                          void updateStatus(r.id, e.target.value as ReservationStatus)
                        }
                        className="border-border bg-secondary text-foreground rounded-lg border px-2 py-1.5 text-xs disabled:opacity-60"
                        aria-label={`Update status for ${r.name}`}
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
                      <span className="text-muted-foreground ml-auto text-[11px]">
                        Ref {r.id.slice(0, 8)} · {new Date(r.created_at).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
