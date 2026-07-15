import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind conflict resolution.
 * Later utilities win (e.g. `cn("mb-2.5", "mb-0")` → `"mb-0"`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
