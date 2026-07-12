"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Minimal class merge (no clsx dependency). */
function cn(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

export interface FlipFadeTextProps {
  /** Words to cycle through with flip-fade animation */
  words?: string[];
  /** Interval between word changes (ms) */
  interval?: number;
  /** Container classes */
  className?: string;
  /** Text row classes */
  textClassName?: string;
  /** Duration per letter (seconds) */
  letterDuration?: number;
  /** Stagger between letters on enter (seconds) */
  staggerDelay?: number;
  /** Stagger between letters on exit (seconds) */
  exitStaggerDelay?: number;
  /** Skip 3D flip; show static first word */
  reduceMotion?: boolean;
}

const defaultWords = ["LOADING", "COMPUTING", "SEARCHING", "RETRIEVING", "ASSEMBLING"];

const letterRowClass =
  "flex justify-center gap-[0.08em] text-4xl font-bold tracking-wider uppercase md:text-6xl";

const Letter = memo(function Letter({
  char,
  letterDuration,
}: {
  char: string;
  letterDuration: number;
}) {
  return (
    <motion.span
      style={{ transformStyle: "preserve-3d" }}
      variants={{
        initial: {
          rotateX: 90,
          y: 20,
          opacity: 0,
          filter: "blur(8px)",
        },
        animate: {
          rotateX: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            duration: letterDuration,
            ease: [0.2, 0.65, 0.3, 0.9],
          },
        },
        exit: {
          rotateX: -90,
          y: -20,
          opacity: 0,
          filter: "blur(8px)",
          transition: {
            duration: letterDuration * 0.67,
            ease: "easeIn",
          },
        },
      }}
      className="inline-block"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
});

const Word = memo(function Word({
  text,
  staggerDelay,
  exitStaggerDelay,
  letterDuration,
  textClassName,
}: {
  text: string;
  staggerDelay: number;
  exitStaggerDelay: number;
  letterDuration: number;
  textClassName?: string;
}) {
  const letters = useMemo(() => text.split(""), [text]);

  return (
    <motion.div
      className={cn(letterRowClass, textClassName)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 1 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
        exit: {
          opacity: 1,
          transition: {
            staggerChildren: exitStaggerDelay,
          },
        },
      }}
    >
      {letters.map((char, i) => (
        <Letter key={`${char}-${i}`} char={char} letterDuration={letterDuration} />
      ))}
    </motion.div>
  );
});

/** Invisible row used only to lock width/height to the longest word. */
function WordSizer({ text, textClassName }: { text: string; textClassName?: string }) {
  return (
    <div className={cn(letterRowClass, "invisible select-none", textClassName)} aria-hidden>
      {text.split("").map((char, i) => (
        <span key={`${char}-${i}`} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}

/**
 * Flip Fade Text — adapted from Vengeance UI
 * @see https://www.vengenceui.com/components/flip-fade-text
 * Uses `motion/react` (project stack) instead of framer-motion.
 *
 * Layout is fixed to the widest word so cycling does not shift surrounding content
 * (important with production font loading).
 */
export function FlipFadeText({
  words = defaultWords,
  interval = 2500,
  className,
  textClassName,
  letterDuration = 0.6,
  staggerDelay = 0.1,
  exitStaggerDelay = 0.05,
  reduceMotion = false,
}: FlipFadeTextProps) {
  const [index, setIndex] = useState(0);

  const updateIndex = useCallback(() => {
    setIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  useEffect(() => {
    if (reduceMotion || words.length <= 1) return;
    const timer = setInterval(updateIndex, interval);
    return () => clearInterval(timer);
  }, [updateIndex, interval, reduceMotion, words.length]);

  const currentWord = useMemo(() => words[index] ?? words[0] ?? "", [words, index]);

  if (reduceMotion) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className={cn(letterRowClass, textClassName)}>
          {(words[0] ?? "").split("").map((char, i) => (
            <span key={`${char}-${i}`} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative mx-auto w-full overflow-hidden", className)}
      style={{ perspective: "1000px" }}
    >
      {/*
        Grid stack: every word is laid out invisibly in the same cell so the box
        is always as wide/tall as the largest word (stable in prod with webfonts).
      */}
      <div className="grid w-full place-items-center">
        {words.map((w) => (
          <div key={`size-${w}`} className="col-start-1 row-start-1" aria-hidden>
            <WordSizer text={w} textClassName={textClassName} />
          </div>
        ))}

        <div className="col-start-1 row-start-1 flex w-full items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <Word
              key={currentWord}
              text={currentWord}
              staggerDelay={staggerDelay}
              exitStaggerDelay={exitStaggerDelay}
              letterDuration={letterDuration}
              textClassName={textClassName}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
