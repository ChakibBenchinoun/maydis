"use client";

import { FileIcon, ImageIcon, Trash2, Upload, VideoIcon } from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment";

type Kind = "image" | "video" | "file";

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileNameFromUrl(url: string) {
  try {
    const path = url.split("?")[0] ?? url;
    const name = path.split("/").pop();
    return name && name.length > 0 ? decodeURIComponent(name) : "Uploaded file";
  } catch {
    return "Uploaded file";
  }
}

export type AdminMediaAttachmentProps = {
  /** Public URL after upload (or existing value). */
  url: string;
  /** Optional local file name while picking / uploading. */
  fileName?: string;
  /** Optional size label while uploading. */
  fileSize?: number;
  kind?: Kind;
  uploading?: boolean;
  error?: string | null;
  accept?: string;
  disabled?: boolean;
  emptyLabel?: string;
  emptyHint?: string;
  onFile: (file: File | null) => void;
  onClear?: () => void;
};

/**
 * Admin upload field built on shadcn Attachment — theme tokens, cream card, gold focus.
 */
export function AdminMediaAttachment({
  url,
  fileName,
  fileSize,
  kind = "image",
  uploading = false,
  error = null,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  disabled = false,
  emptyLabel = "Add media",
  emptyHint = "Click to upload",
  onFile,
  onClear,
}: AdminMediaAttachmentProps) {
  const hasUrl = Boolean(url.trim());
  const state = error ? "error" : uploading ? "uploading" : hasUrl ? "done" : "idle";
  const title = fileName || (hasUrl ? fileNameFromUrl(url) : emptyLabel) || emptyLabel;
  const description = error
    ? error
    : uploading
      ? fileSize
        ? `Uploading… ${formatBytes(fileSize)}`
        : "Uploading…"
      : hasUrl
        ? kind === "video"
          ? "Video ready"
          : "Ready"
        : emptyHint;

  const Icon = kind === "video" ? VideoIcon : kind === "file" ? FileIcon : ImageIcon;

  return (
    <div className="space-y-2">
      <Attachment state={state} size="default" orientation="horizontal" className="w-full max-w-md">
        <AttachmentMedia variant={hasUrl && kind === "image" && !error ? "image" : "icon"}>
          {hasUrl && kind === "image" && !error ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" />
          ) : (
            <Icon />
          )}
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{title}</AttachmentTitle>
          <AttachmentDescription>{description}</AttachmentDescription>
        </AttachmentContent>
        {(hasUrl || error) && onClear ? (
          <AttachmentActions>
            <AttachmentAction
              type="button"
              aria-label="Remove media"
              disabled={disabled || uploading}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClear();
              }}
            >
              <Trash2 />
            </AttachmentAction>
          </AttachmentActions>
        ) : (
          <AttachmentActions>
            <AttachmentAction
              type="button"
              aria-hidden
              tabIndex={-1}
              className="pointer-events-none"
            >
              <Upload />
            </AttachmentAction>
          </AttachmentActions>
        )}
        {!disabled ? (
          <AttachmentTrigger asChild>
            <label className="cursor-pointer">
              <span className="sr-only">Upload file</span>
              <input
                type="file"
                accept={accept}
                className="sr-only"
                disabled={disabled || uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  onFile(file);
                  e.target.value = "";
                }}
              />
            </label>
          </AttachmentTrigger>
        ) : null}
      </Attachment>
      {hasUrl && kind !== "image" ? (
        <p className="text-muted-foreground max-w-md truncate text-xs" title={url}>
          {url}
        </p>
      ) : null}
    </div>
  );
}
