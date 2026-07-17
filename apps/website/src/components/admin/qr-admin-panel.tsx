"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { MAX_ACTIVE_QR_TARGETS, QR_ACTIVE_LIMIT_MESSAGE, type QrTargetRow } from "@/lib/qr/schema";

const FIELD =
  "border-border bg-secondary focus:border-primary w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-hidden";
const LABEL = "text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase";

type FormState = {
  label: string;
  target_url: string;
  dark_color: string;
  sort_order: string;
  active: boolean;
};

const emptyForm = (): FormState => ({
  label: "",
  target_url: "/menu",
  dark_color: "#2C2318",
  sort_order: "0",
  active: true,
});

function rowToForm(row: QrTargetRow): FormState {
  return {
    label: row.label,
    target_url: row.target_url,
    dark_color: row.dark_color || "#2C2318",
    sort_order: String(row.sort_order ?? 0),
    active: row.active,
  };
}

function formToPayload(form: FormState) {
  return {
    label: form.label.trim(),
    target_url: form.target_url.trim(),
    dark_color: form.dark_color.trim() || "#2C2318",
    sort_order: Number(form.sort_order) || 0,
    active: form.active,
  };
}

export function QrAdminPanel({ initialRows }: { initialRows: QrTargetRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeCount = useMemo(() => rows.filter((r) => r.active).length, [rows]);

  function openCreate() {
    setCreating(true);
    setEditingId(null);
    setForm({
      ...emptyForm(),
      // If already at cap, default new rows to inactive
      active: activeCount < MAX_ACTIVE_QR_TARGETS,
      sort_order: String(rows.length),
    });
    setError(null);
  }

  function openEdit(row: QrTargetRow) {
    setCreating(false);
    setEditingId(row.id);
    setForm(rowToForm(row));
    setError(null);
  }

  function closeForm() {
    setCreating(false);
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = formToPayload(form);
    try {
      if (creating) {
        const res = await fetch("/api/admin/qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string; row?: QrTargetRow };
        if (!res.ok) throw new Error(data.error || "Could not create");
        if (data.row) setRows((prev) => [...prev, data.row!].sort(sortRows));
      } else if (editingId) {
        const res = await fetch(`/api/admin/qr/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string; row?: QrTargetRow };
        if (!res.ok) throw new Error(data.error || "Could not update");
        if (data.row) {
          setRows((prev) =>
            prev.map((r) => (r.id === data.row!.id ? data.row! : r)).sort(sortRows),
          );
        }
      }
      closeForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this QR target?")) return;
    setError(null);
    const res = await fetch(`/api/admin/qr/${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Could not delete");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) closeForm();
    router.refresh();
  }

  async function toggleActive(row: QrTargetRow) {
    setError(null);
    const next = !row.active;
    if (next && activeCount >= MAX_ACTIVE_QR_TARGETS) {
      setError(QR_ACTIVE_LIMIT_MESSAGE);
      return;
    }
    const res = await fetch(`/api/admin/qr/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: next }),
    });
    const data = (await res.json()) as { error?: string; row?: QrTargetRow };
    if (!res.ok) {
      setError(data.error || "Could not update");
      return;
    }
    if (data.row) {
      setRows((prev) => prev.map((r) => (r.id === data.row!.id ? data.row! : r)));
    }
    router.refresh();
  }

  const showForm = creating || editingId != null;

  return (
    <div className="space-y-6">
      <div className="bg-secondary/60 text-muted-foreground rounded-xl px-4 py-3 text-sm">
        <p>
          <span className="text-foreground font-semibold">
            {activeCount}/{MAX_ACTIVE_QR_TARGETS}
          </span>{" "}
          active QR codes. Centre logo is the brand logo (not editable). You can change the{" "}
          <span className="text-foreground font-medium">dark module color</span> only.
        </p>
        {activeCount >= MAX_ACTIVE_QR_TARGETS ? (
          <p className="text-foreground mt-1.5 text-xs font-medium">{QR_ACTIVE_LIMIT_MESSAGE}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={openCreate}
          className="bg-primary text-primary-foreground inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add QR target
        </button>
      </div>

      {error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">{error}</p>
      ) : null}

      {showForm ? (
        <form
          onSubmit={(e) => void onSubmit(e)}
          className="border-border/50 bg-card space-y-4 rounded-2xl border p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold">
              {creating ? "New QR target" : "Edit QR target"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-1.5"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Label *</label>
              <input
                required
                className={FIELD}
                placeholder="Menu"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              />
            </div>
            <div>
              <label className={LABEL}>Sort order</label>
              <input
                type="number"
                min={0}
                className={FIELD}
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Target URL or path *</label>
              <input
                required
                className={FIELD}
                placeholder="/menu or https://…"
                value={form.target_url}
                onChange={(e) => setForm((f) => ({ ...f, target_url: e.target.value }))}
              />
            </div>
            <div>
              <label className={LABEL}>QR dark color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="border-border h-10 w-12 cursor-pointer rounded-lg border bg-transparent p-1"
                  value={/^#[0-9A-Fa-f]{6}$/.test(form.dark_color) ? form.dark_color : "#2C2318"}
                  onChange={(e) => setForm((f) => ({ ...f, dark_color: e.target.value }))}
                  aria-label="Pick color"
                />
                <input
                  className={FIELD}
                  value={form.dark_color}
                  onChange={(e) => setForm((f) => ({ ...f, dark_color: e.target.value }))}
                  placeholder="#2C2318"
                />
              </div>
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 pb-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="accent-primary size-4"
                />
                Active on public site
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground cursor-pointer rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Saving…" : creating ? "Create" : "Save"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="border-border cursor-pointer rounded-full border px-5 py-2 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <ul className="space-y-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className="border-border/50 bg-card flex gap-3 rounded-2xl border p-3 shadow-sm sm:p-4"
          >
            <div
              className="border-border h-12 w-12 shrink-0 rounded-xl border"
              style={{ backgroundColor: row.dark_color || "#2C2318" }}
              title={row.dark_color}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-foreground font-semibold">{row.label}</p>
                  <p className="text-muted-foreground truncate text-xs">{row.target_url}</p>
                  {!row.active ? (
                    <p className="text-destructive mt-0.5 text-xs font-semibold">Inactive</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer rounded-lg p-2"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void onDelete(row.id)}
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg p-2"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={row.active}
                  onChange={() => void toggleActive(row)}
                  className="accent-primary size-3.5"
                />
                Active
              </label>
            </div>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="text-muted-foreground py-8 text-center text-sm">No QR targets yet.</li>
        ) : null}
      </ul>
    </div>
  );
}

function sortRows(a: QrTargetRow, b: QrTargetRow) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0);
}
