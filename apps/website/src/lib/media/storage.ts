import type { SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "media" as const;

export type MediaFolder = "menu" | "gallery" | "gallery/video" | "qr";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

const IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const VIDEO_MIME = new Set(["video/mp4", "video/webm", "video/quicktime"]);

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "video/mp4":
      return "mp4";
    case "video/webm":
      return "webm";
    case "video/quicktime":
      return "mov";
    default:
      return "bin";
  }
}

export function publicMediaUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return path;
  return `${base}/storage/v1/object/public/${MEDIA_BUCKET}/${path.replace(/^\//, "")}`;
}

/**
 * Upload bytes to the public `media` bucket (service-role client).
 * Admin UIs will call this via API routes — not from the browser with the service key.
 */
export async function uploadMedia(
  supabase: SupabaseClient,
  options: {
    folder: MediaFolder;
    data: ArrayBuffer | Blob | File;
    contentType: string;
    /** Optional filename stem; uuid used if omitted. */
    name?: string;
  },
): Promise<{ path: string; publicUrl: string } | { error: string }> {
  const mime = options.contentType.toLowerCase();
  const isVideo = VIDEO_MIME.has(mime);
  const isImage = IMAGE_MIME.has(mime);
  if (!isVideo && !isImage) {
    return { error: "Unsupported file type. Use JPEG, PNG, WebP, GIF, MP4, or WebM." };
  }

  const size =
    typeof (options.data as { size?: number }).size === "number"
      ? (options.data as { size: number }).size
      : options.data instanceof ArrayBuffer
        ? options.data.byteLength
        : 0;

  const max = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (size > max) {
    return {
      error: isVideo ? "Video must be under 100 MB." : "Image must be under 10 MB.",
    };
  }

  const id =
    options.name?.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) ||
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`);
  const path = `${options.folder}/${id}.${extFromMime(mime)}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, options.data, {
    contentType: mime,
    upsert: false,
  });

  if (error) {
    console.error("[media] upload failed", error);
    return { error: error.message || "Upload failed." };
  }

  return { path, publicUrl: publicMediaUrl(path) };
}

export async function deleteMedia(
  supabase: SupabaseClient,
  path: string,
): Promise<{ ok: boolean; error?: string }> {
  const clean = path.replace(/^\//, "");
  // Only delete objects inside our bucket paths (not arbitrary URLs)
  if (!clean || clean.includes("..")) {
    return { ok: false, error: "Invalid path." };
  }

  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([clean]);
  if (error) {
    console.error("[media] delete failed", error);
    return { ok: false, error: error.message || "Delete failed." };
  }
  return { ok: true };
}
