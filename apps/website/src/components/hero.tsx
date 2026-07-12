"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Instagram } from "lucide-react";

import { site, socialLinks } from "@/lib/constants";
import { images } from "@/lib/images";
import { scrollToId } from "@/lib/scroll";

const easeOut = [0.22, 1, 0.36, 1] as const;
const instagram = socialLinks[0];

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
      className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden"
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
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/30 to-black/75" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      <div className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto">
        <motion.p
          custom={0.1}
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="text-[10px] tracking-[0.4em] uppercase mb-3 text-amber-200 font-semibold"
        >
          Oran, Algeria
        </motion.p>

        <motion.div
          custom={0.2}
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="w-10 h-px bg-primary/90 mx-auto mb-7"
          aria-hidden
        />

        <motion.h1
          custom={0.28}
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="font-display text-7xl md:text-[100px] font-bold tracking-[0.1em] mb-6 leading-none"
        >
          {site.nameDisplay}
        </motion.h1>

        <motion.p
          custom={0.42}
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="font-display text-lg md:text-xl italic text-amber-100 mb-4 font-light leading-relaxed"
        >
          &ldquo;{site.tagline}&rdquo;
        </motion.p>

        <motion.p
          custom={0.54}
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="text-sm text-white/75 mb-11 leading-relaxed max-w-sm mx-auto"
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
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center w-full sm:w-auto">
            <button
              type="button"
              onClick={() => scrollToId("menu")}
              className="bg-primary text-white px-9 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase shadow-lg hover:bg-amber-500 hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
            >
              Explore the Menu
            </button>
            <button
              type="button"
              onClick={() => scrollToId("visit")}
              className="border border-white/50 text-white px-9 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase backdrop-blur-sm bg-white/5 hover:bg-white/12 transition-colors duration-200 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Visit Us
            </button>
          </div>

          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-white/70 hover:text-amber-200 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm"
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
        animate={
          reduceMotion
            ? { opacity: 0.55 }
            : { opacity: 0.55, y: [0, 8, 0] }
        }
        transition={
          reduceMotion
            ? { duration: 0.4 }
            : {
                opacity: { duration: 0.8, delay: 1.1 },
                y: { repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: 1.1 },
              }
        }
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/55 hover:text-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full p-1"
      >
        <ChevronDown size={22} />
      </motion.button>
    </section>
  );
}
