"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Instagram, Menu, X } from "lucide-react";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        mobileMenuOpen
          ? "bg-background border-b border-border/80"
          : solid
            ? "bg-background/96 backdrop-blur-md shadow-[0_1px_0_0_var(--border)] border-b border-border/80"
            : "bg-transparent"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: easeOut }}
        className={`max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between transition-[height] duration-500 ${
          solid ? "h-14" : "h-16"
        }`}
      >
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2.5 font-display text-xl font-bold tracking-[0.2em] text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images.logo}
            alt=""
            className={`rounded-full object-cover border border-border/40 bg-white shadow-sm transition-all duration-500 ${
              solid ? "w-8 h-8" : "w-9 h-9"
            }`}
          />
          <span className="hidden sm:inline">{site.nameDisplay}</span>
        </button>

        <div className="hidden md:flex items-center gap-5 lg:gap-7">
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
          className={`md:hidden relative w-10 h-10 inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
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
          className="md:hidden fixed inset-0 z-40 flex flex-col"
          style={{ backgroundColor: "var(--background)" }}
          aria-modal="true"
          role="dialog"
          aria-label="Navigation"
        >
          {/* Offset for fixed header */}
          <div className="h-14 shrink-0" aria-hidden />

          <div className="flex-1 flex flex-col justify-between overflow-y-auto px-8 pb-10 pt-6 bg-[var(--background)]">
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
                  className="block w-full text-left py-4 text-sm font-semibold tracking-[0.16em] uppercase text-foreground hover:text-primary transition-colors border-b border-border/50 focus-visible:outline-none focus-visible:text-primary"
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
                  className="block w-full text-left py-4 text-sm font-semibold tracking-[0.16em] uppercase text-foreground hover:text-primary transition-colors border-b border-border/50"
                >
                  {fullMenuLink.label}
                </Link>
              </motion.div>
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: easeOut }}
              className="pt-10 flex flex-col gap-3"
            >
              <Link
                href={reserveLink.href}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase shadow-sm hover:bg-amber-500 transition-colors"
              >
                {reserveLink.label}
              </Link>
              <a
                href={instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:border-primary hover:text-primary transition-colors"
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
