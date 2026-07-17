"use client";

import type { CSSProperties } from "react";
import styles from "./styles.module.css";

interface Accent {
  emoji: string;
  /** Position + size, applied inline (top/left/right/bottom in %, fontSize in px). */
  pos: CSSProperties;
  dur: number;
  delay: number;
  /** Sparkle accents twinkle instead of float. */
  twinkle?: boolean;
}

/**
 * Festive accents (balloons, confetti, gifts, sparkles) tucked into the edges of
 * a section to fill the negative space around the centred content. Rendered
 * behind the content (z-index below the card) and purely decorative. Each
 * `variant` places a different, hand-tuned cluster so no two screens repeat.
 * Motion is subtle and is neutralised by the reduced-motion rule in the stylesheet.
 */
const VARIANTS: Accent[][] = [
  // 0 — Hero
  [
    { emoji: "🎈", pos: { top: "7%", left: "6%", fontSize: 42 }, dur: 6, delay: 0 },
    { emoji: "🎉", pos: { top: "13%", right: "7%", fontSize: 36 }, dur: 5.5, delay: 0.6 },
    { emoji: "🎁", pos: { bottom: "9%", left: "8%", fontSize: 34 }, dur: 6.5, delay: 0.3 },
    { emoji: "🥳", pos: { bottom: "13%", right: "7%", fontSize: 38 }, dur: 5, delay: 1 },
    { emoji: "✨", pos: { top: "42%", left: "3%", fontSize: 24 }, dur: 3.6, delay: 0.2, twinkle: true },
    { emoji: "✨", pos: { bottom: "38%", right: "4%", fontSize: 22 }, dur: 4.2, delay: 1.1, twinkle: true },
  ],
  // 1 — Invitation
  [
    { emoji: "🎂", pos: { top: "9%", left: "8%", fontSize: 38 }, dur: 6.2, delay: 0.2 },
    { emoji: "🎀", pos: { top: "15%", right: "9%", fontSize: 30 }, dur: 5.4, delay: 0.9 },
    { emoji: "🎊", pos: { bottom: "10%", left: "9%", fontSize: 34 }, dur: 6.6, delay: 0.5 },
    { emoji: "🎈", pos: { bottom: "13%", right: "8%", fontSize: 40 }, dur: 5.8, delay: 1.2 },
    { emoji: "✨", pos: { top: "45%", left: "4%", fontSize: 22 }, dur: 3.8, delay: 0.4, twinkle: true },
    { emoji: "⭐", pos: { bottom: "40%", right: "5%", fontSize: 22 }, dur: 4.4, delay: 0.9, twinkle: true },
  ],
  // 2 — Calendar
  [
    { emoji: "🎈", pos: { top: "10%", left: "7%", fontSize: 38 }, dur: 6, delay: 0.3 },
    { emoji: "🎉", pos: { top: "12%", right: "8%", fontSize: 36 }, dur: 5.6, delay: 0.8 },
    { emoji: "🎁", pos: { bottom: "12%", right: "8%", fontSize: 34 }, dur: 6.4, delay: 0.4 },
    { emoji: "🎊", pos: { bottom: "14%", left: "9%", fontSize: 32 }, dur: 5.2, delay: 1.1 },
    { emoji: "🌟", pos: { top: "44%", right: "4%", fontSize: 22 }, dur: 4, delay: 0.5, twinkle: true },
    { emoji: "💫", pos: { top: "42%", left: "4%", fontSize: 22 }, dur: 3.6, delay: 1, twinkle: true },
  ],
  // 3 — Countdown
  [
    { emoji: "🥳", pos: { top: "10%", left: "8%", fontSize: 38 }, dur: 6.1, delay: 0.2 },
    { emoji: "🎊", pos: { top: "12%", right: "7%", fontSize: 36 }, dur: 5.5, delay: 0.7 },
    { emoji: "🎈", pos: { bottom: "12%", left: "8%", fontSize: 40 }, dur: 6.7, delay: 0.5 },
    { emoji: "🎁", pos: { bottom: "10%", right: "9%", fontSize: 34 }, dur: 5.3, delay: 1.2 },
    { emoji: "✨", pos: { top: "45%", left: "4%", fontSize: 22 }, dur: 3.7, delay: 0.3, twinkle: true },
    { emoji: "✨", pos: { top: "43%", right: "4%", fontSize: 22 }, dur: 4.3, delay: 0.9, twinkle: true },
  ],
  // 4 — Location
  [
    { emoji: "🎈", pos: { top: "9%", left: "7%", fontSize: 40 }, dur: 6.3, delay: 0.2 },
    { emoji: "🎉", pos: { top: "13%", right: "8%", fontSize: 36 }, dur: 5.7, delay: 0.8 },
    { emoji: "🍰", pos: { bottom: "12%", left: "9%", fontSize: 34 }, dur: 6.5, delay: 0.4 },
    { emoji: "🎀", pos: { bottom: "14%", right: "8%", fontSize: 30 }, dur: 5.1, delay: 1.1 },
    { emoji: "🌟", pos: { top: "42%", left: "4%", fontSize: 22 }, dur: 4.1, delay: 0.5, twinkle: true },
    { emoji: "✨", pos: { bottom: "40%", right: "5%", fontSize: 22 }, dur: 3.9, delay: 1, twinkle: true },
  ],
  // 5 — Footer
  [
    { emoji: "🎉", pos: { top: "12%", left: "10%", fontSize: 40 }, dur: 6, delay: 0.2 },
    { emoji: "🎊", pos: { top: "14%", right: "10%", fontSize: 38 }, dur: 5.6, delay: 0.8 },
    { emoji: "🎈", pos: { bottom: "16%", left: "12%", fontSize: 42 }, dur: 6.6, delay: 0.5 },
    { emoji: "🥳", pos: { bottom: "18%", right: "11%", fontSize: 40 }, dur: 5.2, delay: 1.2 },
    { emoji: "✨", pos: { top: "44%", left: "6%", fontSize: 24 }, dur: 3.8, delay: 0.3, twinkle: true },
    { emoji: "✨", pos: { top: "42%", right: "6%", fontSize: 24 }, dur: 4.2, delay: 0.9, twinkle: true },
  ],
];

interface Props {
  variant: number;
}

export default function SectionDecor({ variant }: Props) {
  const accents = VARIANTS[variant % VARIANTS.length];

  return (
    <div className={styles.sectionDecor} aria-hidden="true">
      {accents.map((a, i) => (
        <span
          key={i}
          className={`${styles.decorItem} ${a.twinkle ? styles.decorTwinkle : ""}`}
          style={
            {
              ...a.pos,
              "--dur": `${a.dur}s`,
              "--delay": `${a.delay}s`,
            } as CSSProperties
          }
        >
          {a.emoji}
        </span>
      ))}
    </div>
  );
}
