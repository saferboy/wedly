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
  const [pressed, setPressed] = useState(false);

  // Envelope finishes rising into place (0.3s delay + 1.4s) → floating loop.
  useEffect(() => {
    const timer = setTimeout(() => setLanded(true), 1750);
    return () => clearTimeout(timer);
  }, []);

  // Bosilganda muhr "bosiladi", so'ng taklifnoma ochiladi.
  const handleOpen = () => {
    if (pressed) return;
    setPressed(true);
    setTimeout(onOpen, 560);
  };

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

      {/* "Ochish" tugmasi — haqiqiy mum muhr; bosilganda bosilib ochiladi */}
      <button
        type="button"
        className={`${styles.openBtn} ${pressed ? styles.pressing : ""}`}
        onClick={handleOpen}
        aria-label={strings.openBtn}
      >
        <svg
          className={styles.sealSvg}
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="qbWaxFill" cx="40%" cy="34%" r="72%">
              <stop offset="0%" stopColor="#e15568" />
              <stop offset="48%" stopColor="#c0293f" />
              <stop offset="100%" stopColor="#911b2d" />
            </radialGradient>
            <radialGradient id="qbWaxDisc" cx="50%" cy="42%" r="62%">
              <stop offset="0%" stopColor="#a81f34" />
              <stop offset="100%" stopColor="#bb2540" />
            </radialGradient>
            <filter id="qbWaxRough" x="-25%" y="-25%" width="150%" height="150%">
              <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="2" seed="9" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* mum tanasi — notekis organik chekka */}
          <g filter="url(#qbWaxRough)">
            <circle cx="60" cy="60" r="50" fill="url(#qbWaxFill)" />
          </g>

          {/* ko'tarilgan gardish */}
          <circle cx="60" cy="60" r="45" fill="none" stroke="#911b2d" strokeWidth="3.5" opacity="0.55" />
          <circle cx="60" cy="60" r="45" fill="none" stroke="#ef8090" strokeWidth="1.2" opacity="0.4" />

          {/* botiq ichki disk */}
          <circle cx="60" cy="60" r="34" fill="url(#qbWaxDisc)" />
          <circle cx="60" cy="60" r="34" fill="none" stroke="#911b2d" strokeWidth="1.5" opacity="0.5" />

          {/* o'yilgan aylana yozuv */}
          <path id="qbArcTop" d="M19 60 A41 41 0 0 1 101 60" fill="none" />
          <text className={styles.sealText} textAnchor="middle" fill="#e8be55">
            <textPath href="#qbArcTop" startOffset="50%">
              {strings.openBtn.toUpperCase()}
            </textPath>
          </text>
          <text
            x="60"
            y="103"
            textAnchor="middle"
            fontSize="8"
            fill="#e8be55"
            dominantBaseline="central"
          >
            ✦
          </text>

          {/* markaziy bo'rtma ❀ emblema */}
          <g className={styles.sealEmblem} fontFamily="Georgia, 'Times New Roman', serif" fontSize="30">
            <text x="60.9" y="61.7" textAnchor="middle" dominantBaseline="central" fill="#7d1728">
              ❀
            </text>
            <text x="59.1" y="60.2" textAnchor="middle" dominantBaseline="central" fill="#f0929f">
              ❀
            </text>
            <text x="60" y="61" textAnchor="middle" dominantBaseline="central" fill="#cf3a4e">
              ❀
            </text>
          </g>

          {/* mum yaltirog'i */}
          <ellipse
            className={styles.sealGloss}
            cx="45"
            cy="42"
            rx="22"
            ry="13"
            fill="#ffd9de"
            opacity="0.18"
            transform="rotate(-24 45 42)"
          />
        </svg>
      </button>
    </div>
  );
}
