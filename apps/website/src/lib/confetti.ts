import confetti from "canvas-confetti";

/** Maydi brand: gold primary, green accent, cream */
const COLORS = ["#c8933a", "#6b9b67", "#faf7f2", "#e8c97a", "#8fbc8b"];

/**
 * Short celebration burst for successful event request.
 * No-ops under prefers-reduced-motion.
 */
export function fireReserveConfetti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const defaults = {
    colors: COLORS,
    disableForReducedMotion: true,
  };

  // Center burst
  void confetti({
    ...defaults,
    particleCount: 90,
    spread: 70,
    startVelocity: 38,
    origin: { x: 0.5, y: 0.55 },
  });

  // Side bursts (slightly delayed)
  window.setTimeout(() => {
    void confetti({
      ...defaults,
      particleCount: 45,
      angle: 60,
      spread: 55,
      origin: { x: 0.15, y: 0.65 },
    });
    void confetti({
      ...defaults,
      particleCount: 45,
      angle: 120,
      spread: 55,
      origin: { x: 0.85, y: 0.65 },
    });
  }, 120);
}
