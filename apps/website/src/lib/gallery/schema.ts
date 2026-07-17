import { z } from "zod";

export const GALLERY_TYPES = ["photo", "video"] as const;
export type GalleryItemType = (typeof GALLERY_TYPES)[number];

export const galleryItemSchema = z
  .object({
    type: z.enum(GALLERY_TYPES),
    image_url: z.string().trim().min(1, "Image is required").max(2000),
    video_url: z.string().trim().max(2000).nullable().optional(),
    alt: z.string().trim().min(1, "Alt text is required").max(200),
    title: z.string().trim().max(120).nullable().optional(),
    description: z.string().trim().max(500).nullable().optional(),
    sort_order: z.coerce.number().int().min(0).max(9999).optional().default(0),
    published: z.boolean().optional().default(true),
  })
  .superRefine((v, ctx) => {
    if (v.type === "video" && !v.video_url?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["video_url"],
        message: "Video URL is required for video items",
      });
    }
  });

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;

export type GalleryItemRow = GalleryItemInput & {
  id: string;
  created_at?: string;
};

/** UI shape used by gallery marquee / modal. */
export type GalleryItem = {
  id: string;
  type: GalleryItemType;
  image: string;
  alt: string;
  videoSrc?: string;
  title?: string;
  description?: string;
};
