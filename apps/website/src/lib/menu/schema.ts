import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(500).optional().default(""),
  details: z.string().trim().max(4000).optional().default(""),
  price: z.string().trim().min(1, "Price is required").max(40),
  category: z.string().trim().min(1, "Category is required").max(80),
  image_url: z.string().trim().max(2000).optional().default(""),
  tags: z.array(z.string().trim().max(40)).max(20).optional().default([]),
  sort_order: z.coerce.number().int().min(0).max(9999).optional().default(0),
  available: z.boolean().optional().default(true),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;

export type MenuItemRow = MenuItemInput & {
  id: number;
  created_at?: string;
};
