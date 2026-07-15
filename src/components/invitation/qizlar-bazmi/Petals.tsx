"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

const PETAL_COLORS = ["#B9223A", "#F1D3C6"];
const PETAL_COUNT = 16;

interface PetalStyle {
  id: number;
  size: number;
  left: number;
  fallDur: number;
  swayDur: number;
  delay: number;
  color: string;
}

/**
 * Falling flower petals. Generated on the client only (after mount) so the
 * randomised positions never cause an SSR hydration mismatch.
 */
export default function Petals() {
  const [petals, setPetals] = useState<PetalStyle[]>([]);

  useEffect(() => {
    const generate = (): PetalStyle[] =>
      Array.from({ length: PETAL_COUNT }, (_, id) => {
        const fallDur = 18 + Math.random() * 14;
        return {
          id,
          size: 12 + Math.random() * 16,
          left: Math.random() * 100,
          fallDur,
          swayDur: 5 + Math.random() * 3,
          delay: -Math.random() * fallDur,
          color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        };
      });
    // Defer to a frame so the randomised set is generated client-side only.
    const raf = requestAnimationFrame(() => setPetals(generate()));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={styles.petals} aria-hidden="true">
      {petals.map((p) => (
        <svg
          key={p.id}
          viewBox="0 0 20 20"
          className={styles.petal}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}vw`,
            animationDuration: `${p.fallDur}s, ${p.swayDur}s`,
            animationDelay: `${p.delay}s, 0s`,
          }}
        >
          <path d="M10 0C14 4 20 6 10 20C0 6 6 4 10 0Z" fill={p.color} />
        </svg>
      ))}
    </div>
  );
}
