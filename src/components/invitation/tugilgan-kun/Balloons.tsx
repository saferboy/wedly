"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

const BALLOON_COLORS = ["#ff6b8a", "#ffc94d", "#3ecfb0", "#9b8cff", "#ff9bb3"];
const BALLOON_COUNT = 14;

interface BalloonStyle {
  id: number;
  size: number;
  left: number;
  riseDur: number;
  swayDur: number;
  delay: number;
  color: string;
}

/**
 * Ambient floating balloons that rise continuously up the screen. The random
 * set is generated on the client only (after mount) so the positions never
 * cause an SSR hydration mismatch — same pattern as the sibling Petals layer.
 */
export default function Balloons() {
  const [balloons, setBalloons] = useState<BalloonStyle[]>([]);

  useEffect(() => {
    const generate = (): BalloonStyle[] =>
      Array.from({ length: BALLOON_COUNT }, (_, id) => {
        const riseDur = 20 + Math.random() * 16;
        return {
          id,
          size: 34 + Math.random() * 30,
          left: Math.random() * 100,
          riseDur,
          swayDur: 4 + Math.random() * 3,
          delay: -Math.random() * riseDur,
          color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        };
      });
    // Defer to a frame so the randomised set is generated client-side only.
    const raf = requestAnimationFrame(() => setBalloons(generate()));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={styles.balloons} aria-hidden="true">
      {balloons.map((b) => (
        <span
          key={b.id}
          className={styles.balloonSway}
          style={{
            left: `${b.left}vw`,
            animationDuration: `${b.swayDur}s`,
          }}
        >
          <svg
            viewBox="0 0 40 62"
            className={styles.balloon}
            style={{
              width: `${b.size}px`,
              height: `${b.size * 1.55}px`,
              animationDuration: `${b.riseDur}s`,
              animationDelay: `${b.delay}s`,
            }}
          >
            {/* string */}
            <path
              d="M20 40 C16 46 24 50 20 60"
              fill="none"
              stroke={b.color}
              strokeWidth="1"
              opacity="0.55"
            />
            {/* body */}
            <ellipse cx="20" cy="20" rx="16" ry="20" fill={b.color} />
            {/* highlight */}
            <ellipse cx="14" cy="13" rx="4.5" ry="7" fill="#ffffff" opacity="0.4" />
            {/* knot */}
            <path d="M17 39 L23 39 L20 43 Z" fill={b.color} />
          </svg>
        </span>
      ))}
    </div>
  );
}
