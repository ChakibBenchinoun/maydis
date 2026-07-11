"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { X, Instagram } from "lucide-react";

import { navLinks, site, socialLinks } from "@/lib/constants";
import { scrollToId } from "@/lib/scroll";

const instagram = socialLinks[0];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // On inner pages (no hero), always use the solid nav style
  const solid = !isHome || navScrolled;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const goTo = (id: string) => {
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-background/96 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <button
          onClick={goHome}
          className="font-display text-xl font-bold tracking-[0.2em] text-primary"
        >
          {site.nameDisplay}
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => goTo(id)}
              className={`text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 hover:text-primary ${
                solid ? "text-foreground" : "text-white/90"
              }`}
            >
              {label}
            </button>
          ))}
          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 hover:text-primary ${
              solid ? "text-foreground" : "text-white/90"
            }`}
          >
            <Instagram size={13} />
            Instagram
          </a>
        </div>

        <button
          className={`md:hidden p-1 transition-colors ${solid ? "text-foreground" : "text-white"}`}
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? (
            <X size={22} />
          ) : (
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <rect width="22" height="2" rx="1" fill="currentColor" />
              <rect y="7" width="22" height="2" rx="1" fill="currentColor" />
              <rect y="14" width="22" height="2" rx="1" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-background/98 backdrop-blur-md border-b border-border px-6 pb-6 pt-2"
          >
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className="block w-full text-left py-3 text-[11px] font-semibold tracking-[0.14em] uppercase text-foreground hover:text-primary transition-colors border-b border-border/40 last:border-0"
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
