import styles from "./styles.module.css";

/** A single elegant peony sprig drawn in rose/gold line-art. */
function Sprig() {
  return (
    <svg className={styles.sprigSvg} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      {/* curving stem */}
      <path
        d="M8,112 C34,96 44,70 46,44"
        stroke="#c8992c"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* leaves */}
      <path d="M24,86 C10,84 6,72 16,66 C22,74 26,80 24,86 Z" fill="#4b6b45" opacity="0.55" />
      <path d="M38,60 C30,48 34,36 44,38 C44,48 44,54 38,60 Z" fill="#4b6b45" opacity="0.55" />
      {/* peony blossom */}
      <g transform="translate(52,34)">
        <circle r="18" fill="#f1d3c6" opacity="0.5" />
        <path
          d="M0,0 C-13,-16 13,-16 0,0 C-16,-11 -16,11 0,0 C13,16 -13,16 0,0 C16,-11 16,11 0,0"
          fill="#b9223a"
          opacity="0.55"
        />
        <circle r="4" fill="#c8992c" />
      </g>
    </svg>
  );
}

/**
 * Symmetrical corner flourishes that softly fill a section's negative space.
 * Purely decorative and absolutely positioned, so they never affect the
 * one-viewport layout. They breathe gently (disabled under reduced motion).
 */
export default function Ornaments() {
  return (
    <div className={styles.ornaments} aria-hidden="true">
      <span className={`${styles.sprig} ${styles.sprigTL}`}>
        <Sprig />
      </span>
      <span className={`${styles.sprig} ${styles.sprigBR}`}>
        <Sprig />
      </span>
    </div>
  );
}

/** A slim gold flourish divider to sit under section titles. */
export function Flourish() {
  return (
    <svg className={styles.flourish} viewBox="0 0 160 24" fill="none" aria-hidden="true">
      <path
        d="M4,12 H60 M100,12 H156"
        stroke="#c8992c"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M60,12 C68,4 74,4 80,12 C86,20 92,20 100,12"
        stroke="#b9223a"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="80" cy="12" r="3" fill="#c8992c" />
      <circle cx="60" cy="12" r="2" fill="#b9223a" />
      <circle cx="100" cy="12" r="2" fill="#b9223a" />
    </svg>
  );
}
