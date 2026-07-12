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
      className={cn(
        "flex justify-center gap-[0.08em] text-4xl font-bold tracking-wider uppercase md:text-6xl",
        textClassName,
      )}
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

/**
 * Flip Fade Text — adapted from Vengeance UI
 * @see https://www.vengenceui.com/components/flip-fade-text
 * Uses `motion/react` (project stack) instead of framer-motion.
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
        <div
          className={cn(
            "flex justify-center gap-[0.08em] text-4xl font-bold tracking-wider uppercase md:text-6xl",
            textClassName,
          )}
        >
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
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative flex items-center justify-center" style={{ perspective: "1000px" }}>
        <AnimatePresence mode="wait">
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
  );
}
