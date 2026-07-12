"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Instagram } from "lucide-react";
import { motion } from "motion/react";

import { FlipFadeText } from "@/components/effects/flip-fade-text";
import { site, socialLinks } from "@/lib/constants";
import { images } from "@/lib/images";
import { scrollToId } from "@/lib/scroll";

const easeOut = [0.22, 1, 0.36, 1] as const;
const instagram = socialLinks[0];

/** Hero title cycles — flip-fade (Vengeance UI style) */
const heroTitleWords = [site.nameDisplay, "CAFÉ", "ORAN"] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay, ease: easeOut },
  }),
};

export function Hero() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex h-screen min-h-[640px] items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-amber-950">
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1 }}
          animate={reduceMotion ? undefined : { scale: 1.06 }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 14, ease: "linear", repeat: Infinity, repeatType: "reverse" }
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images.hero}
            alt="Maydi's warm café interior"
            className="h-full w-full object-cover opacity-60"
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/30 to-black/75" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center text-white">
        <motion.p
          custom={0.1}
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="mb-3 text-[10px] font-semibold tracking-[0.4em] text-amber-200 uppercase"
        >
          Oran, Algeria
        </motion.p>

        <motion.div
          custom={0.2}
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="bg-primary/90 mx-auto mb-7 h-px w-10"
          aria-hidden
        />

        <motion.h1
          custom={0.28}
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="font-display mb-6 leading-none"
        >
          <span className="sr-only">{site.nameDisplay}</span>
          <FlipFadeText
            words={[...heroTitleWords]}
            interval={3200}
            letterDuration={0.55}
            staggerDelay={0.06}
            exitStaggerDelay={0.04}
            reduceMotion={reduceMotion}
            className="min-h-[0.95em]"
            textClassName="font-display text-7xl md:text-[100px] font-bold tracking-[0.1em] text-white"
          />
        </motion.h1>

        <motion.p
          custom={0.42}
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="font-display mb-4 text-lg leading-relaxed font-light text-amber-100 italic md:text-xl"
        >
          &ldquo;{site.tagline}&rdquo;
        </motion.p>

        <motion.p
          custom={0.54}
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="mx-auto mb-11 max-w-sm text-sm leading-relaxed text-white/75"
        >
          {site.description}
        </motion.p>

        <motion.div
          custom={0.68}
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="flex flex-col items-center gap-5"
        >
          <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => scrollToId("menu")}
              className="bg-primary focus-visible:ring-primary w-full rounded-full px-9 py-3.5 text-[11px] font-semibold tracking-[0.12em] text-white uppercase shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-amber-500 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 focus-visible:outline-none active:scale-[0.99] sm:w-auto"
            >
              Explore the Menu
            </button>
            <button
              type="button"
              onClick={() => scrollToId("visit")}
              className="w-full rounded-full border border-white/50 bg-white/5 px-9 py-3.5 text-[11px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm transition-colors duration-200 hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none sm:w-auto"
            >
              Visit Us
            </button>
          </div>

          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase transition-colors duration-200 hover:text-amber-200 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            <Instagram size={14} strokeWidth={1.75} />
            Follow on Instagram
          </a>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollToId("menu")}
        aria-label="Scroll to menu"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 0.55 } : { opacity: 0.55, y: [0, 8, 0] }}
        transition={
          reduceMotion
            ? { duration: 0.4 }
            : {
                opacity: { duration: 0.8, delay: 1.1 },
                y: { repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: 1.1 },
              }
        }
        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full p-1 text-white/55 transition-colors hover:text-white/90 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
      >
        <ChevronDown size={22} />
      </motion.button>
    </section>
  );
}
