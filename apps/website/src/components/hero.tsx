"use client";

import { motion } from "motion/react";
import { ChevronDown, Instagram } from "lucide-react";

import { site, socialLinks } from "@/lib/constants";
import { scrollToId } from "@/lib/scroll";

const instagram = socialLinks[0];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-amber-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero.jpg"
          alt="Maydi's warm café interior"
          className="w-full h-full object-cover opacity-55"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto"
      >
        <p className="text-[10px] tracking-[0.4em] uppercase mb-6 text-amber-200 font-semibold">
          Oran, Algeria
        </p>
        <h1 className="font-display text-7xl md:text-[100px] font-bold tracking-[0.1em] mb-6 leading-none">
          {site.nameDisplay}
        </h1>
        <p className="font-display text-lg md:text-xl italic text-amber-100 mb-4 font-light leading-relaxed">
          &ldquo;{site.tagline}&rdquo;
        </p>
        <p className="text-sm text-white/70 mb-12 leading-relaxed max-w-sm mx-auto">
          {site.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={() => scrollToId("menu")}
            className="bg-primary text-white px-9 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-amber-500 transition-colors duration-200 shadow-lg w-full sm:w-auto"
          >
            Explore the Menu
          </button>
          <button
            onClick={() => scrollToId("visit")}
            className="border border-white/40 text-white px-9 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-white/12 transition-colors duration-200 w-full sm:w-auto"
          >
            Visit Us
          </button>
          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-white/40 text-white px-9 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase hover:bg-white/12 transition-colors duration-200 w-full sm:w-auto"
          >
            <Instagram size={13} />
            Follow on Instagram
          </a>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
