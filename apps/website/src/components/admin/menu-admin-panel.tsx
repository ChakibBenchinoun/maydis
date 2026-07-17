"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { AdminMediaAttachment } from "@/components/admin/admin-media-attachment";
import type { MenuItemRow } from "@/lib/menu/schema";

const FIELD =
  "border-border bg-secondary focus:border-primary w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-hidden";
const LABEL = "text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase";

type FormState = {
  name: string;
  description: string;
  details: string;
  price: string;
  category: string;
  image_url: string;
  tags: string;
  sort_order: string;
  available: boolean;
};

const emptyForm = (): FormState => ({
  name: "",
  description: "",
  details: "",
  price: "",
  category: "Brunch",
  image_url: "",
  tags: "",
  sort_order: "0",
  available: true,
});

function rowToForm(row: MenuItemRow): FormState {
  return {
    name: row.name,
    description: row.description ?? "",
    details: row.details ?? "",
    price: row.price,
    category: row.category,
    image_url: row.image_url ?? "",
    tags: (row.tags ?? []).join(", "),
    sort_order: String(row.sort_order ?? 0),
    available: row.available ?? true,
  };
}

function formToPayload(form: FormState) {
  const tags = form.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    details: form.details.trim(),
    price: form.price.trim(),
    category: form.category.trim(),
    image_url: form.image_url.trim(),
    tags,
    sort_order: Number(form.sort_order) || 0,
    available: form.available,
  };
}

export function MenuAdminPanel({ initialRows }: { initialRows: MenuItemRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) if (r.category) set.add(r.category);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const visible = useMemo(() => {
    if (filter === "all") return rows;
    if (filter === "hidden") return rows.filter((r) => !r.available);
    return rows.filter((r) => r.category === filter);
  }, [rows, filter]);

  function openCreate() {
    setCreating(true);
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
  }

  function openEdit(row: MenuItemRow) {
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

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/menu/upload", { method: "POST", body });
      const data = (await res.json()) as { error?: string; publicUrl?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (data.publicUrl) {
        setForm((f) => ({ ...f, image_url: data.publicUrl! }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = formToPayload(form);
    try {
      if (creating) {
        const res = await fetch("/api/admin/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string; row?: MenuItemRow };
        if (!res.ok) throw new Error(data.error || "Could not create");
        if (data.row) setRows((prev) => [...prev, data.row!].sort(sortRows));
      } else if (editingId != null) {
        const res = await fetch(`/api/admin/menu/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string; row?: MenuItemRow };
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

  async function onDelete(id: number) {
    if (!confirm("Delete this dish permanently? Prefer unchecking Available to hide it instead.")) {
      return;
    }
    setError(null);
    const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Could not delete");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) closeForm();
    router.refresh();
  }

  async function toggleAvailable(row: MenuItemRow) {
    setError(null);
    const res = await fetch(`/api/admin/menu/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !row.available }),
    });
    const data = (await res.json()) as { error?: string; row?: MenuItemRow };
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
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={openCreate}
          className="bg-primary text-primary-foreground inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add dish
        </button>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`${FIELD} w-auto min-w-[9rem]`}
          aria-label="Filter menu"
        >
          <option value="all">All ({rows.length})</option>
          <option value="hidden">Hidden only</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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
              {creating ? "New dish" : `Edit #${editingId}`}
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
            <div className="sm:col-span-2">
              <label className={LABEL}>Name *</label>
              <input
                required
                className={FIELD}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className={LABEL}>Price *</label>
              <input
                required
                className={FIELD}
                placeholder="950 DA"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </div>
            <div>
              <label className={LABEL}>Category *</label>
              <input
                required
                className={FIELD}
                list="menu-categories"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
              <datalist id="menu-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
                <option value="Brunch" />
                <option value="Toasts & Croissants" />
                <option value="Salads & Bowls" />
                <option value="Desserts & Cakes" />
                <option value="Beverages" />
              </datalist>
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Short description</label>
              <input
                className={FIELD}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Details (modal)</label>
              <textarea
                rows={3}
                className={FIELD}
                value={form.details}
                onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Image</label>
              <AdminMediaAttachment
                url={form.image_url}
                kind="image"
                uploading={uploading}
                emptyLabel="Dish photo"
                emptyHint="Click to upload JPEG, PNG, WebP, or GIF"
                onFile={(file) => void onUpload(file)}
                onClear={() => setForm((f) => ({ ...f, image_url: "" }))}
              />
              <input
                className={`${FIELD} mt-2`}
                placeholder="Or paste URL /images/…"
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              />
            </div>
            <div>
              <label className={LABEL}>Tags (comma-separated)</label>
              <input
                className={FIELD}
                placeholder="Bestseller, Vegetarian"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
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
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                  className="accent-primary size-4"
                />
                Available on public menu
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground cursor-pointer rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Saving…" : creating ? "Create dish" : "Save changes"}
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
        {visible.map((row) => (
          <li
            key={row.id}
            className="border-border/50 bg-card flex gap-3 rounded-2xl border p-3 shadow-sm sm:p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row.image_url || "/images/gallery-01.jpg"}
              alt=""
              className="bg-secondary h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-foreground truncate font-semibold">{row.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {row.category} · {row.price}
                    {!row.available ? (
                      <span className="text-destructive ml-2 font-semibold">Hidden</span>
                    ) : null}
                  </p>
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
              {row.description ? (
                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{row.description}</p>
              ) : null}
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={Boolean(row.available)}
                  onChange={() => void toggleAvailable(row)}
                  className="accent-primary size-3.5"
                />
                Available
              </label>
            </div>
          </li>
        ))}
        {visible.length === 0 ? (
          <li className="text-muted-foreground py-8 text-center text-sm">
            No dishes in this filter.
          </li>
        ) : null}
      </ul>
    </div>
  );
}

function sortRows(a: MenuItemRow, b: MenuItemRow) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id;
}
