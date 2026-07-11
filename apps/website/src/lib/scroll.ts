/** Smooth-scroll to an element by id (SPA section anchors). */
export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
