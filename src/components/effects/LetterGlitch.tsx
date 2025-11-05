"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type LetterGlitchProps = {
  text: string;
  start?: boolean; // trigger animation
  speed?: number; // smaller = faster, default 20ms tick
  settleDuration?: number; // total duration target in ms
  className?: string;
  onComplete?: () => void;
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$%#&*+=?".split("");

export const LetterGlitch: React.FC<LetterGlitchProps> = ({
  text,
  start = false,
  speed = 18,
  settleDuration = 600,
  className,
  onComplete,
}) => {
  const target = useMemo(() => text.split("") as string[], [text]);
  const [display, setDisplay] = useState<string[]>(() => target.map((c) => (c === " " ? " " : "")));
  const settledRef = useRef<boolean[]>(new Array(target.length).fill(false));
  const doneRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // reset when text changes or start toggles off
    if (!start) {
      setDisplay(target.map((c) => (c === " " ? " " : "")));
      settledRef.current = new Array(target.length).fill(false);
      doneRef.current = false;
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // if start is true, begin glitching
    settledRef.current = new Array(target.length).fill(false);
    doneRef.current = false;
    startTimeRef.current = performance.now();

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = window.setInterval(() => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / settleDuration);

      const next: string[] = [...display];
      let allSettled = true;

      for (let i = 0; i < target.length; i++) {
        const isSpace = target[i] === " ";
        if (isSpace) {
          next[i] = " ";
          settledRef.current[i] = true;
          continue;
        }
        if (!settledRef.current[i]) {
          allSettled = false;
          // Increasing chance to settle as progress increases
          const settleChance = progress * (0.5 + 0.5 * (i / Math.max(1, target.length - 1)));
          if (Math.random() < settleChance) {
            settledRef.current[i] = true;
            next[i] = target[i];
          } else {
            next[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        } else {
          next[i] = target[i];
        }
      }

      setDisplay(next);

      if (allSettled) {
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        if (!doneRef.current) {
          doneRef.current = true;
          onComplete?.();
        }
      }
    }, Math.max(10, speed));

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, start, speed, settleDuration]);

  return (
    <span className={className} aria-label={text} style={{ display: "inline-block" }}>
      {display.map((c, idx) => (
        <span key={idx} aria-hidden="true">{c}</span>
      ))}
    </span>
  );
};

export default LetterGlitch;
