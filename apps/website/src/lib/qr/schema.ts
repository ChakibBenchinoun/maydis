import { z } from "zod";

/**
 * Hard limit for *active* QR targets on the public site.
 * Raising this requires a developer change (product + code), not only admin UI.
 */
export const MAX_ACTIVE_QR_TARGETS = 5;

export const QR_ACTIVE_LIMIT_MESSAGE =
  `At most ${MAX_ACTIVE_QR_TARGETS} active QR codes are allowed. Contact a developer to add more.`;

const hexColor = z
  .string()
  .trim()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Use a hex color like #2C2318");

export const qrTargetSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(40),
  target_url: z.string().trim().min(1, "URL is required").max(2000),
  /** QR dark module color only — centre logo is brand-fixed (not editable). */
  dark_color: hexColor.optional().default("#2C2318"),
  sort_order: z.coerce.number().int().min(0).max(9999).optional().default(0),
  active: z.boolean().optional().default(true),
});

export type QrTargetInput = z.infer<typeof qrTargetSchema>;

export type QrTargetRow = {
  id: string;
  label: string;
  target_url: string;
  dark_color: string;
  sort_order: number;
  active: boolean;
  created_at?: string;
};

/** Public UI target (logo always site brand). */
export type QrTarget = {
  id: string;
  label: string;
  targetUrl: string;
  darkColor: string;
};
