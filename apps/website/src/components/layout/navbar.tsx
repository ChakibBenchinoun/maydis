"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { isSectionNavLink, mainNavLinks, menuLink, reserveLink, site } from "@/lib/constants";
import { images } from "@/lib/images";
import { scrollToId } from "@/lib/scroll";

const easeOut = [0.22, 1, 0.36, 1] as const;
const mobileItemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
} as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);

  // Close mobile menu when the route changes (adjust state during render).
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMobileMenuOpen(false);
  }

  const solid = !isHome || navScrolled || mobileMenuOpen;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

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
      router.push(`/#${id}`);
    }
    setMobileMenuOpen(false);
  };

  const goHome = () => {
    if (isHome) {
      scrollToId("hero");
    } else {
      router.push("/");
    }
    setMobileMenuOpen(false);
  };

  const linkClass = `text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-sm ${
    solid
      ? "text-foreground hover:text-primary focus-visible:ring-offset-background"
      : "text-white/90 hover:text-white focus-visible:ring-white/70 focus-visible:ring-offset-transparent"
  }`;

  const menuClass = solid
    ? buttonClassName({ variant: "outline", size: "sm" })
    : buttonClassName({ variant: "outlineLight", size: "sm" });

  const reserveClass = solid
    ? buttonClassName({ variant: "primary", size: "sm" })
    : buttonClassName({ variant: "outlineLight", size: "sm" });

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
        <Container
          as={motion.div}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOut }}
          className={`flex items-center justify-between transition-[height] duration-500 ${
            solid ? "h-14" : "h-16"
          }`}
        >
          <button
            type="button"
            onClick={goHome}
            className="font-display text-primary focus-visible:ring-primary flex items-center gap-2.5 rounded-sm text-xl font-bold tracking-[0.2em] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
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
            {mainNavLinks.map((link, i) => {
              const motionProps = {
                initial: { opacity: 0, y: -6 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.45, delay: 0.08 + i * 0.04, ease: easeOut },
              } as const;

              if (isSectionNavLink(link)) {
                return (
                  <motion.button
                    key={link.id}
                    type="button"
                    onClick={() => goToSection(link.id)}
                    className={linkClass}
                    {...motionProps}
                  >
                    {link.label}
                  </motion.button>
                );
              }

              return (
                <motion.div key={link.id} {...motionProps}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28, ease: easeOut }}
              className="flex items-center gap-3 lg:gap-4"
            >
              <Link href={menuLink.href} className={menuClass}>
                {menuLink.label}
              </Link>
              <Link href={reserveLink.href} className={reserveClass}>
                {reserveLink.label}
              </Link>
            </motion.div>
          </div>

          <button
            type="button"
            className={`focus-visible:ring-primary relative inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-hidden md:hidden ${
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
        </Container>
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
                {mainNavLinks.map((link) => {
                  const itemClass =
                    "text-foreground hover:text-primary border-border/50 focus-visible:text-primary block w-full border-b py-4 text-left text-sm font-semibold tracking-[0.16em] uppercase transition-colors focus-visible:outline-hidden";

                  if (isSectionNavLink(link)) {
                    return (
                      <motion.button
                        key={link.id}
                        type="button"
                        onClick={() => goToSection(link.id)}
                        variants={mobileItemVariants}
                        className={itemClass}
                      >
                        {link.label}
                      </motion.button>
                    );
                  }

                  return (
                    <motion.div key={link.id} variants={mobileItemVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={itemClass}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: easeOut }}
                className="flex flex-col gap-3 pt-10"
              >
                <Link
                  href={menuLink.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={buttonClassName({ variant: "outline", fullWidth: true })}
                >
                  {menuLink.label}
                </Link>
                <Link
                  href={reserveLink.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={buttonClassName({ variant: "primary", fullWidth: true })}
                >
                  {reserveLink.label}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
