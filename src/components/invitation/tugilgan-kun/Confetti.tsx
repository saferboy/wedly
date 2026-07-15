"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

const CONFETTI_COLORS = ["#ff6b8a", "#ffc94d", "#3ecfb0", "#9b8cff", "#ff9bb3", "#7ee0cd"];
const CONFETTI_COUNT = 60;

interface Piece {
  id: number;
  left: number;
  size: number;
  fallDur: number;
  delay: number;
  rotate: number;
  color: string;
  round: boolean;
}

interface Props {
  /** Fires the burst once the invitation is opened. */
  active: boolean;
}

/**
 * One-shot confetti burst that rains down when the invitation opens. Positions
 * are generated on the client only (after `active` flips) to avoid any SSR
 * hydration mismatch.
 */
export default function Confetti({ active }: Props) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) return;
    const generate = (): Piece[] =>
      Array.from({ length: CONFETTI_COUNT }, (_, id) => ({
        id,
        left: Math.random() * 100,
        size: 7 + Math.random() * 8,
        fallDur: 2.6 + Math.random() * 2.4,
        delay: Math.random() * 1.2,
        rotate: Math.random() * 360,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        round: Math.random() > 0.55,
      }));
    const raf = requestAnimationFrame(() => setPieces(generate()));
    return () => cancelAnimationFrame(raf);
  }, [active]);

  if (!active) return null;

  return (
    <div className={styles.confetti} aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={styles.confettiPiece}
          style={{
            left: `${p.left}vw`,
            width: `${p.size}px`,
            height: `${p.size * (p.round ? 1 : 1.6)}px`,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animationDuration: `${p.fallDur}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
