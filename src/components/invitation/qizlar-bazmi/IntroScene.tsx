"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import type { QizlarBazmiStrings } from "./i18n";

interface Props {
  strings: QizlarBazmiStrings;
  opened: boolean;
  onOpen: () => void;
}

/**
 * Opening scene: a paper plane flies across and drops a sealed envelope,
 * after which the invitation text and the "open" button fade in.
 */
export default function IntroScene({ strings, opened, onOpen }: Props) {
  const [landed, setLanded] = useState(false);

  // Envelope finishes its drop (2s delay + 1.6s) → switch to the floating loop.
  useEffect(() => {
    const timer = setTimeout(() => setLanded(true), 3650);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.intro} ${opened ? styles.opened : ""}`}>
      {/* Plane + envelope scene */}
      <div className={styles.planeScene} aria-hidden="true">
        <svg className={styles.planeTrail} viewBox="0 0 600 4" preserveAspectRatio="none">
          <line
            x1="0"
            y1="2"
            x2="600"
            y2="2"
            stroke="#C8992C"
            strokeWidth="2"
            strokeDasharray="10 8"
            opacity="0.5"
          />
        </svg>

        <svg className={styles.plane} viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M8,20 Q30,8 72,20 Q30,32 8,20 Z" fill="#fff" stroke="#C8992C" strokeWidth="1.5" />
          <ellipse cx="62" cy="20" rx="10" ry="7" fill="#B9223A" opacity="0.9" />
          <ellipse cx="64" cy="20" rx="7" ry="5" fill="#FFE8CC" opacity="0.6" />
          <path d="M30,20 Q40,4 55,8 Q46,16 30,20 Z" fill="#C8992C" opacity="0.9" />
          <path d="M30,20 Q40,36 55,32 Q46,24 30,20 Z" fill="#C8992C" opacity="0.9" />
          <path d="M10,20 Q14,10 22,12 Q18,18 10,20 Z" fill="#B9223A" />
          <path d="M10,20 Q14,30 22,28 Q18,22 10,20 Z" fill="#B9223A" />
          <circle cx="50" cy="18" r="3" fill="#A8C9E4" opacity="0.8" />
          <circle cx="42" cy="18" r="3" fill="#A8C9E4" opacity="0.8" />
          <rect x="35" y="25" width="14" height="5" rx="2.5" fill="#888" opacity="0.7" />
        </svg>

        <svg
          className={`${styles.envelope} ${landed ? styles.landed : ""}`}
          viewBox="0 0 80 56"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="10" width="76" height="44" rx="4" fill="#FBF4E8" stroke="#C8992C" strokeWidth="2" />
          <circle cx="40" cy="32" r="10" fill="#B9223A" />
          <text x="40" y="37" textAnchor="middle" fontSize="11" fill="#FFE082" fontFamily="serif">
            ❀
          </text>
          <path d="M2,10 L40,34 L78,10 Z" fill="#F3E8D4" stroke="#C8992C" strokeWidth="2" />
          <line x1="2" y1="54" x2="40" y2="32" stroke="#C8992C" strokeWidth="1.5" opacity="0.5" />
          <line x1="78" y1="54" x2="40" y2="32" stroke="#C8992C" strokeWidth="1.5" opacity="0.5" />
          <line x1="15" y1="38" x2="28" y2="38" stroke="#C8992C" strokeWidth="1.2" opacity="0.4" />
          <line x1="52" y1="38" x2="65" y2="38" stroke="#C8992C" strokeWidth="1.2" opacity="0.4" />
        </svg>
      </div>

      <div className={styles.glyph}>❀</div>
      <div className={styles.eyebrow}>{strings.introEyebrow}</div>
      <h1>{strings.introTitle}</h1>
      <p className={styles.sub}>{strings.introSub}</p>
      <button type="button" className={styles.openBtn} onClick={onOpen}>
        {strings.openBtn}
      </button>
    </div>
  );
}
