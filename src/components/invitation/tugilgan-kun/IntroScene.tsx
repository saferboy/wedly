"use client";

import styles from "./styles.module.css";
import type { TugilganKunStrings } from "./i18n";

interface Props {
  strings: TugilganKunStrings;
  opened: boolean;
  onOpen: () => void;
}

const CLUSTER = [
  { cx: 60, cy: 96, rx: 30, ry: 38, color: "#ff6b8a", hi: "#ffd0db", delay: "0s" },
  { cx: 150, cy: 66, rx: 34, ry: 43, color: "#ffc94d", hi: "#fff0c9", delay: "0.25s" },
  { cx: 240, cy: 96, rx: 30, ry: 38, color: "#3ecfb0", hi: "#d9fff4", delay: "0.5s" },
  { cx: 108, cy: 128, rx: 26, ry: 33, color: "#9b8cff", hi: "#e6e1ff", delay: "0.15s" },
  { cx: 196, cy: 128, rx: 26, ry: 33, color: "#ff9bb3", hi: "#ffe3ea", delay: "0.4s" },
];

/**
 * Opening scene: a cluster of balloons floats up to reveal the greeting, with a
 * little birthday cake whose candle flame flickers. The greeting text and the
 * "open" button then fade in.
 */
export default function IntroScene({ strings, opened, onOpen }: Props) {
  return (
    <div className={`${styles.intro} ${opened ? styles.opened : ""}`}>
      {/* Floating balloon cluster */}
      <div className={styles.introDeco} aria-hidden="true">
        <svg className={styles.introBalloons} viewBox="0 0 300 220">
          {CLUSTER.map((b, i) => (
            <g
              key={i}
              className={styles.introBalloon}
              style={{ animationDelay: b.delay, transformOrigin: `${b.cx}px ${b.cy}px` }}
            >
              <path
                d={`M${b.cx} ${b.cy + b.ry} C${b.cx - 5} ${b.cy + b.ry + 26} ${b.cx + 7} ${
                  b.cy + b.ry + 44
                } ${b.cx} ${b.cy + b.ry + 70}`}
                fill="none"
                stroke={b.color}
                strokeWidth="1.2"
                opacity="0.5"
              />
              <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.color} />
              <ellipse cx={b.cx - b.rx * 0.35} cy={b.cy - b.ry * 0.35} rx={b.rx * 0.28} ry={b.ry * 0.32} fill={b.hi} opacity="0.5" />
              <path d={`M${b.cx - 5} ${b.cy + b.ry} L${b.cx + 5} ${b.cy + b.ry} L${b.cx} ${b.cy + b.ry + 8} Z`} fill={b.color} />
            </g>
          ))}
        </svg>

        <svg className={styles.introCake} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          {/* candle flame */}
          <ellipse className={styles.cakeFlame} cx="60" cy="20" rx="5" ry="9" fill="#ffc94d" />
          <ellipse cx="60" cy="22" rx="2.4" ry="5" fill="#ff8a5c" />
          {/* candle */}
          <rect x="57" y="28" width="6" height="18" rx="2" fill="#9b8cff" />
          {/* frosting */}
          <path d="M18,58 Q30,44 42,58 Q54,44 66,58 Q78,44 90,58 Q100,50 102,66 L18,66 Z" fill="#ff9bb3" />
          <rect x="18" y="62" width="84" height="14" rx="4" fill="#fff3f6" />
          {/* cake body */}
          <rect x="14" y="74" width="92" height="34" rx="8" fill="#ff6b8a" />
          <circle cx="34" cy="90" r="3.5" fill="#ffc94d" />
          <circle cx="60" cy="96" r="3.5" fill="#3ecfb0" />
          <circle cx="86" cy="90" r="3.5" fill="#ffc94d" />
          {/* plate */}
          <ellipse cx="60" cy="110" rx="54" ry="7" fill="#ffe0b3" />
        </svg>
      </div>

      <div className={styles.glyph}>🎉</div>
      <div className={styles.eyebrow}>{strings.introEyebrow}</div>
      <h1>{strings.introTitle}</h1>
      <p className={styles.sub}>{strings.introSub}</p>
      <button type="button" className={styles.openBtn} onClick={onOpen}>
        {strings.openBtn}
      </button>
    </div>
  );
}
