"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import type { ToyStrings } from "./i18n";

interface Props {
  strings: ToyStrings;
  opened: boolean;
  onOpen: () => void;
}

/**
 * Opening scene: two interlocking wedding rings draw themselves in
 * (stroke-dashoffset) and gently settle together, with a soft gold shimmer.
 * Once they link, the invitation text and the "open" button fade in.
 */
export default function IntroScene({ strings, opened, onOpen }: Props) {
  const [linked, setLinked] = useState(false);

  // Rings finish drawing (~2.6s) → switch on the shimmer/settle loop.
  useEffect(() => {
    const timer = setTimeout(() => setLinked(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.intro} ${opened ? styles.opened : ""}`}>
      <div
        className={`${styles.ringsScene} ${linked ? styles.linked : ""}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="toyRingGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e6cf8f" />
              <stop offset="45%" stopColor="#c9a44c" />
              <stop offset="100%" stopColor="#9c7a2c" />
            </linearGradient>
            <linearGradient id="toyRingEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3a7d63" />
              <stop offset="55%" stopColor="#1f4d3d" />
              <stop offset="100%" stopColor="#0f2c22" />
            </linearGradient>
          </defs>

          {/* Left ring — gold */}
          <circle
            className={`${styles.ring} ${styles.ringLeft}`}
            cx="88"
            cy="70"
            r="42"
            fill="none"
            stroke="url(#toyRingGold)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Right ring — emerald */}
          <circle
            className={`${styles.ring} ${styles.ringRight}`}
            cx="132"
            cy="70"
            r="42"
            fill="none"
            stroke="url(#toyRingEmerald)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Little gem on the gold ring */}
          <path
            className={styles.ringGem}
            d="M88 20 L94 27 L88 34 L82 27 Z"
            fill="#f3e2b3"
            stroke="#c9a44c"
            strokeWidth="1"
          />

          {/* Travelling shimmer highlight */}
          <circle className={styles.ringShimmer} cx="88" cy="70" r="42" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className={styles.glyph}>&#10086;</div>
      <div className={styles.eyebrow}>{strings.introEyebrow}</div>
      <h1>{strings.introTitle}</h1>
      <p className={styles.sub}>{strings.introSub}</p>
      <button type="button" className={styles.openBtn} onClick={onOpen}>
        {strings.openBtn}
      </button>
    </div>
  );
}
