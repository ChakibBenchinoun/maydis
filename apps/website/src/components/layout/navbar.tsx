"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { homeNavLinks, pageLinks, site, socialLinks } from "@/lib/constants";
import { images } from "@/lib/images";
import { scrollToId } from "@/lib/scroll";

const easeOut = [0.22, 1, 0.36, 1] as const;
const instagram = socialLinks[0];
const fullMenuLink = pageLinks.find((l) => l.href === "/menu") ?? pageLinks[0];
const reserveLink = pageLinks.find((l) => l.href === "/reserve") ?? pageLinks[1];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const solid = !isHome || navScrolled || mobileMenuOpen;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  const goToSection = (id: string) => {
    if (isHome) {
      scrollToId(id);
    } else {
      window.location.href = `/#${id}`;
    }
    setMobileMenuOpen(false);
  };

  const goHome = () => {
    if (isHome) {
      scrollToId("hero");
    } else {
      window.location.href = "/";
    }
    setMobileMenuOpen(false);
  };

  const linkClass = `text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-sm ${
    solid
      ? "text-foreground hover:text-primary focus-visible:ring-offset-background"
      : "text-white/90 hover:text-white focus-visible:ring-white/70 focus-visible:ring-offset-transparent"
  }`;

  const iconBtnClass = `inline-flex items-center justify-center p-2 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
    solid
      ? "text-foreground hover:text-primary hover:bg-secondary/80 focus-visible:ring-offset-background"
      : "text-white/90 hover:text-white hover:bg-white/10 focus-visible:ring-white/70 focus-visible:ring-offset-transparent"
  }`;

  const reserveClass = solid
    ? "inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase shadow-sm hover:bg-amber-500 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    : "inline-flex items-center justify-center border border-white/50 text-white px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase backdrop-blur-sm hover:bg-white/12 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          mobileMenuOpen
            ? "bg-background border-border/80 border-b"
            : solid
              ? "bg-background/96 border-border/80 border-b shadow-[0_1px_0_0_var(--border)] backdrop-blur-md"
              : "bg-transparent"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOut }}
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-[height] duration-500 md:px-10 ${
            solid ? "h-14" : "h-16"
          }`}
        >
          <button
            type="button"
            onClick={goHome}
            className="font-display text-primary focus-visible:ring-primary flex items-center gap-2.5 rounded-sm text-xl font-bold tracking-[0.2em] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.logo}
              alt=""
              className={`border-border/40 rounded-full border bg-white object-cover shadow-sm transition-all duration-500 ${
                solid ? "h-8 w-8" : "h-9 w-9"
              }`}
            />
            <span className="hidden sm:inline">{site.nameDisplay}</span>
          </button>

          <div className="hidden items-center gap-5 md:flex lg:gap-7">
            {homeNavLinks.map(({ id, label }, i) => (
              <motion.button
                key={id}
                type="button"
                onClick={() => goToSection(id)}
                className={linkClass}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.04, ease: easeOut }}
              >
                {label}
              </motion.button>
            ))}

            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28, ease: easeOut }}
              className="flex items-center gap-4 lg:gap-5"
            >
              <Link href={fullMenuLink.href} className={linkClass}>
                {fullMenuLink.label}
              </Link>

              <Link href={reserveLink.href} className={reserveClass}>
                {reserveLink.label}
              </Link>

              <a
                href={instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className={iconBtnClass}
              >
                <Instagram size={16} strokeWidth={1.75} />
              </a>
            </motion.div>
          </div>

          <button
            type="button"
            className={`focus-visible:ring-primary relative inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none md:hidden ${
              solid ? "text-foreground" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: easeOut }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: easeOut }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </nav>

      {/* Outside <nav>: backdrop-filter on the bar traps fixed children and made this look transparent */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: easeOut }}
            className="fixed inset-0 z-40 flex flex-col md:hidden"
            style={{ backgroundColor: "var(--background)" }}
            aria-modal="true"
            role="dialog"
            aria-label="Navigation"
          >
            {/* Offset for fixed header */}
            <div className="h-14 shrink-0" aria-hidden />

            <div className="flex flex-1 flex-col justify-between overflow-y-auto bg-[var(--background)] px-8 pt-6 pb-10">
              <motion.nav
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
                  },
                }}
                className="flex flex-col"
              >
                {homeNavLinks.map(({ id, label }) => (
                  <motion.button
                    key={id}
                    type="button"
                    onClick={() => goToSection(id)}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.35, ease: easeOut },
                      },
                    }}
                    className="text-foreground hover:text-primary border-border/50 focus-visible:text-primary block w-full border-b py-4 text-left text-sm font-semibold tracking-[0.16em] uppercase transition-colors focus-visible:outline-none"
                  >
                    {label}
                  </motion.button>
                ))}

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.35, ease: easeOut },
                    },
                  }}
                >
                  <Link
                    href={fullMenuLink.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-foreground hover:text-primary border-border/50 block w-full border-b py-4 text-left text-sm font-semibold tracking-[0.16em] uppercase transition-colors"
                  >
                    {fullMenuLink.label}
                  </Link>
                </motion.div>
              </motion.nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: easeOut }}
                className="flex flex-col gap-3 pt-10"
              >
                <Link
                  href={reserveLink.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[11px] font-semibold tracking-[0.12em] uppercase shadow-sm transition-colors hover:bg-amber-500"
                >
                  {reserveLink.label}
                </Link>
                <a
                  href={instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-border text-foreground hover:border-primary hover:text-primary inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors"
                >
                  <Instagram size={14} />
                  Instagram
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
