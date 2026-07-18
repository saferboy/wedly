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
 * Opening scene: a sealed invitation with a rose-gold floral wax seal
 * rises gently into view and floats, after which the invitation text and
 * the "open" button fade in.
 */
export default function IntroScene({ strings, opened, onOpen }: Props) {
  const [landed, setLanded] = useState(false);

  // Envelope finishes rising into place (0.3s delay + 1.4s) → floating loop.
  useEffect(() => {
    const timer = setTimeout(() => setLanded(true), 1750);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.intro} ${opened ? styles.opened : ""}`}>
      <div className={styles.glyph}>❀</div>
      <div className={styles.eyebrow}>{strings.introEyebrow}</div>
      <h1>{strings.introTitle}</h1>

      {/* Muhrlangan konvert — sarlavha ostida, qiya va tebranib turadi */}
      <svg
        className={`${styles.envelope} ${landed ? styles.landed : ""}`}
        viewBox="0 0 80 56"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
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

      <p className={styles.sub}>{strings.introSub}</p>
      <button type="button" className={styles.openBtn} onClick={onOpen}>
        {strings.openBtn}
      </button>
    </div>
  );
}
