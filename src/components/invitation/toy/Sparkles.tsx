"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

const SPARKLE_COLORS = ["#c9a44c", "#e6cf8f", "#f3e2b3"];
const SPARKLE_COUNT = 20;

interface SparkleStyle {
  id: number;
  size: number;
  left: number;
  riseDur: number;
  swayDur: number;
  delay: number;
  color: string;
  diamond: boolean;
}

/**
 * Ambient rising golden sparkle particles (small dots & diamonds that drift
 * upward). Generated on the client only (after mount) so the randomised
 * positions never cause an SSR hydration mismatch — same pattern as Petals.
 */
export default function Sparkles() {
  const [sparkles, setSparkles] = useState<SparkleStyle[]>([]);

  useEffect(() => {
    const generate = (): SparkleStyle[] =>
      Array.from({ length: SPARKLE_COUNT }, (_, id) => {
        const riseDur = 14 + Math.random() * 12;
        return {
          id,
          size: 5 + Math.random() * 9,
          left: Math.random() * 100,
          riseDur,
          swayDur: 4 + Math.random() * 3,
          delay: -Math.random() * riseDur,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          diamond: Math.random() > 0.45,
        };
      });
    // Defer to a frame so the randomised set is generated client-side only.
    const raf = requestAnimationFrame(() => setSparkles(generate()));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={styles.sparkles} aria-hidden="true">
      {sparkles.map((s) => (
        <svg
          key={s.id}
          viewBox="0 0 20 20"
          className={styles.sparkle}
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            left: `${s.left}vw`,
            animationDuration: `${s.riseDur}s, ${s.swayDur}s`,
            animationDelay: `${s.delay}s, 0s`,
          }}
        >
          {s.diamond ? (
            <path d="M10 0 L14 10 L10 20 L6 10 Z" fill={s.color} />
          ) : (
            <circle cx="10" cy="10" r="6" fill={s.color} />
          )}
        </svg>
      ))}
    </div>
  );
}
