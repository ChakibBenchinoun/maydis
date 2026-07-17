"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { AdminMediaAttachment } from "@/components/admin/admin-media-attachment";
import type { GalleryItemRow, GalleryItemType } from "@/lib/gallery/schema";

const FIELD =
  "border-border bg-secondary focus:border-primary w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-hidden";
const LABEL = "text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase";

type FormState = {
  type: GalleryItemType;
  image_url: string;
  video_url: string;
  alt: string;
  title: string;
  description: string;
  sort_order: string;
  published: boolean;
};

const emptyForm = (): FormState => ({
  type: "photo",
  image_url: "",
  video_url: "",
  alt: "",
  title: "",
  description: "",
  sort_order: "0",
  published: true,
});

function rowToForm(row: GalleryItemRow): FormState {
  return {
    type: row.type,
    image_url: row.image_url ?? "",
    video_url: row.video_url ?? "",
    alt: row.alt ?? "",
    title: row.title ?? "",
    description: row.description ?? "",
    sort_order: String(row.sort_order ?? 0),
    published: row.published ?? true,
  };
}

function formToPayload(form: FormState) {
  return {
    type: form.type,
    image_url: form.image_url.trim(),
    video_url: form.type === "video" ? form.video_url.trim() || null : null,
    alt: form.alt.trim(),
    title: form.title.trim() || null,
    description: form.description.trim() || null,
    sort_order: Number(form.sort_order) || 0,
    published: form.published,
  };
}

export function GalleryAdminPanel({ initialRows }: { initialRows: GalleryItemRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState<"all" | "photo" | "video" | "hidden">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const visible = useMemo(() => {
    if (filter === "all") return rows;
    if (filter === "hidden") return rows.filter((r) => !r.published);
    return rows.filter((r) => r.type === filter);
  }, [rows, filter]);

  function openCreate() {
    setCreating(true);
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
  }

  function openEdit(row: GalleryItemRow) {
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

  async function onUpload(file: File | null, kind: "image" | "video") {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("kind", kind);
      const res = await fetch("/api/admin/gallery/upload", { method: "POST", body });
      const data = (await res.json()) as { error?: string; publicUrl?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (data.publicUrl) {
        if (kind === "video") {
          setForm((f) => ({ ...f, video_url: data.publicUrl!, type: "video" }));
        } else {
          setForm((f) => ({ ...f, image_url: data.publicUrl! }));
        }
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
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string; row?: GalleryItemRow };
        if (!res.ok) throw new Error(data.error || "Could not create");
        if (data.row) setRows((prev) => [...prev, data.row!].sort(sortRows));
      } else if (editingId) {
        const res = await fetch(`/api/admin/gallery/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string; row?: GalleryItemRow };
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
    if (!confirm("Delete this gallery item permanently?")) return;
    setError(null);
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Could not delete");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) closeForm();
    router.refresh();
  }

  async function togglePublished(row: GalleryItemRow) {
    setError(null);
    const res = await fetch(`/api/admin/gallery/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !row.published }),
    });
    const data = (await res.json()) as { error?: string; row?: GalleryItemRow };
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
          Add item
        </button>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className={`${FIELD} w-auto min-w-[9rem]`}
          aria-label="Filter gallery"
        >
          <option value="all">All ({rows.length})</option>
          <option value="photo">Photos</option>
          <option value="video">Videos</option>
          <option value="hidden">Unpublished</option>
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
              {creating ? "New gallery item" : "Edit item"}
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
              <label className={LABEL}>Type *</label>
              <select
                className={FIELD}
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value as GalleryItemType }))
                }
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
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
              <label className={LABEL}>Alt text *</label>
              <input
                required
                className={FIELD}
                value={form.alt}
                onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
              />
            </div>
            <div>
              <label className={LABEL}>Title</label>
              <input
                className={FIELD}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className={LABEL}>Description</label>
              <input
                className={FIELD}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Image / poster *</label>
              <AdminMediaAttachment
                url={form.image_url}
                kind="image"
                uploading={uploading}
                emptyLabel="Photo or poster"
                emptyHint="Click to upload image"
                onFile={(file) => void onUpload(file, "image")}
                onClear={() => setForm((f) => ({ ...f, image_url: "" }))}
              />
              <input
                required
                className={`${FIELD} mt-2`}
                placeholder="Or paste image URL"
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              />
            </div>
            {form.type === "video" ? (
              <div className="sm:col-span-2">
                <label className={LABEL}>Video file *</label>
                <AdminMediaAttachment
                  url={form.video_url}
                  kind="video"
                  uploading={uploading}
                  accept="video/mp4,video/webm,video/quicktime"
                  emptyLabel="Video file"
                  emptyHint="MP4, WebM, or MOV"
                  onFile={(file) => void onUpload(file, "video")}
                  onClear={() => setForm((f) => ({ ...f, video_url: "" }))}
                />
                <input
                  required
                  className={`${FIELD} mt-2`}
                  placeholder="Or paste video URL"
                  value={form.video_url}
                  onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                />
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  className="accent-primary size-4"
                />
                Published on public site
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
                  <p className="text-foreground truncate font-semibold">{row.title || row.alt}</p>
                  <p className="text-muted-foreground text-xs">
                    {row.type}
                    {!row.published ? (
                      <span className="text-destructive ml-2 font-semibold">Unpublished</span>
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
                  checked={Boolean(row.published)}
                  onChange={() => void togglePublished(row)}
                  className="accent-primary size-3.5"
                />
                Published
              </label>
            </div>
          </li>
        ))}
        {visible.length === 0 ? (
          <li className="text-muted-foreground py-8 text-center text-sm">
            No items in this filter.
          </li>
        ) : null}
      </ul>
    </div>
  );
}

function sortRows(a: GalleryItemRow, b: GalleryItemRow) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0);
}
