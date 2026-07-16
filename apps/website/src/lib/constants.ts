export const site = {
  name: "Maydi's",
  nameDisplay: "MAYDI'S",
  tagline: "Where every plate is a little work of art.",
  description:
    "A bright, garden-like café in the heart of Oran — for slow mornings, nourishing lunches, and golden afternoon breaks.",
  phone: "+213 541 45 30 73",
  phoneHref: "tel:+213541453073",
  /** Digits-only E.164 for wa.me links */
  whatsappHref: "https://wa.me/213541453073",
  /**
   * Stable production origin for absolute links (admin, WhatsApp).
   * Never use `VERCEL_URL` — it is a per-deploy host
   * (e.g. maydis-website-xxxxx-….vercel.app), not this alias.
   */
  productionOrigin: "https://maydis-website.vercel.app",
  addressLine1: "Hai Khemisiti, Cité 2000 Logements Belle Vue",
  addressLine2: "Oran 31000, Algeria",
  mapsUrl:
    "https://www.google.com/maps/place/Maydi's/@35.7205944,-0.5985259,17z/data=!4m6!3m5!1s0xd7e63770f48b90f:0x5e16e7269ba85e4!8m2!3d35.7205944!4d-0.5985259!16s%2Fg%2F11gmt_vj5_",
  mapEmbedUrl: "https://www.google.com/maps?q=35.7205944,-0.5985259&z=17&output=embed",
  guideUrl: "https://guide-oran.com/maydis-oran/",
  lat: 35.7205944,
  lng: -0.5985259,
} as const;

/**
 * Primary nav — text links first, then Menu + Reserve as CTAs.
 * Section links use `/#id` (scroll on home); page links are absolute paths.
 */
export const homeNavLinks = [
  { id: "hero", label: "Home", href: "/#hero" },
  { id: "gallery", label: "Gallery", href: "/#gallery" },
  { id: "about", label: "Our Story", href: "/#about" },
  { id: "visit", label: "Visit", href: "/#visit" },
  { id: "qr", label: "Share Our Menu", href: "/#qr" },
  { id: "menu", label: "Menu", href: "/menu" },
  { id: "reserve", label: "Reserve", href: "/reserve" },
] as const;

export type HomeNavLink = (typeof homeNavLinks)[number];
export type HomeNavId = HomeNavLink["id"];

export function getHomeNavLink(id: HomeNavId): HomeNavLink {
  return homeNavLinks.find((l) => l.id === id)!;
}

/** True when the link is a home section anchor (`/#…`). */
export function isSectionNavLink(link: HomeNavLink): boolean {
  return link.href.includes("#");
}

/** Nav list items (excludes Menu + Reserve CTAs). */
export const mainNavLinks = homeNavLinks.filter((l) => l.id !== "menu" && l.id !== "reserve");

/** Named page routes derived from homeNavLinks */
export const menuLink = getHomeNavLink("menu");
export const reserveLink = getHomeNavLink("reserve");

/** Home “latest on the menu” section copy */
export const latestMenuCopy = {
  label: "Just in",
  title: "Latest on the menu",
  description:
    "A few of our newest plates and seasonal favourites — the full list lives on the menu page.",
  cta: "View full menu",
  ctaHref: menuLink.href,
  empty: "New dishes are on the way — check back soon.",
} as const;

/** Full `/menu` page header + empty state */
export const menuPageCopy = {
  label: "Scan · Sip · Enjoy",
  title: menuLink.label,
  description: "Every dish, drink, and seasonal favourite — updated for your visit.",
  empty: "Menu coming soon.",
  emptyCategory: "No dishes in this category yet.",
} as const;

export const socialLinks = [
  {
    href: "https://www.instagram.com/maydiscakeshop/",
    label: "Instagram",
    handle: "@maydiscakeshop",
  },
  {
    href: "https://www.tiktok.com/@maydiscakeshop",
    label: "TikTok",
  },
  {
    href: "https://www.facebook.com/profile.php?id=100064395051518",
    label: "Facebook",
  },
] as const;

export const openingHours = [
  { day: "Mon – Fri", hours: "08:00 – 21:00" },
  { day: "Saturday", hours: "09:00 – 22:00" },
  { day: "Sunday", hours: "10:00 – 20:00" },
] as const;

/** Moments live in `data/gallery.ts` as `type: "video"` items (gallery section). */
