/**
 * Bright control surface — pure white + soft lift on cream page.
 * Shared by inputs, calendar, chips, guest stepper, progress track.
 *
 * `text-base` (16px) on fields prevents iOS Safari auto-zoom on focus.
 */
export const controlSurfaceClass =
  "bg-[#ffffff] border border-black/[0.06] shadow-[0_2px_8px_rgba(44,35,24,0.06),0_0_0_1px_rgba(255,255,255,0.8)_inset]";

/** Inputs — 16px minimum so mobile browsers don’t zoom on focus. */
export const fieldClass =
  "w-full px-3.5 py-3 bg-[#ffffff] border border-black/[0.06] rounded-xl text-base text-foreground placeholder:text-muted-foreground/45 shadow-[0_2px_8px_rgba(44,35,24,0.06),0_0_0_1px_rgba(255,255,255,0.8)_inset] focus:outline-hidden focus:border-primary focus:shadow-[0_2px_12px_rgba(200,147,58,0.12)] transition-colors";

export const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5";

export const errorClass = "text-destructive mt-1 text-xs";
