import styles from "./styles.module.css";

interface Props {
  /** When true, the line-art draws itself in and the windows light up. */
  drawn: boolean;
}

/**
 * Elegant single-line "to'yxona" (grand wedding-hall / palace) illustration —
 * a central onion dome flanked by two domed towers and a grand arched entrance.
 * Strokes draw in via animated `stroke-dashoffset`; windows and the doorway warm
 * up to a gold glow once the section is revealed. Rose/gold on-brand palette.
 */
export default function VenueSketch({ drawn }: Props) {
  return (
    <div className={`${styles.venueSketch} ${drawn ? styles.venueDrawn : ""}`} aria-hidden="true">
      <svg viewBox="0 0 260 200" fill="none">
        <defs>
          <linearGradient id="venueGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="100%" stopColor="#C8992C" />
          </linearGradient>
        </defs>

        {/* ground line */}
        <path className={styles.vLine} d="M16,182 H244" stroke="#c8992c" strokeWidth="1.6" strokeLinecap="round" />

        {/* left domed tower */}
        <path className={styles.vLine} d="M60,182 V126 H86 V182" stroke="#b9223a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path className={styles.vLine} d="M57,126 Q73,96 89,126" stroke="#b9223a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path className={styles.vLine} d="M73,98 V86" stroke="#c8992c" strokeWidth="1.6" strokeLinecap="round" />
        <circle className={styles.vDot} cx="73" cy="82" r="3.5" stroke="#c8992c" strokeWidth="1.6" style={{ transformOrigin: "73px 82px" }} />
        <rect className={styles.vWindow} x="66" y="140" width="14" height="26" rx="7" fill="url(#venueGlow)" />

        {/* right domed tower */}
        <path className={styles.vLine} d="M174,182 V126 H200 V182" stroke="#b9223a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path className={styles.vLine} d="M171,126 Q187,96 203,126" stroke="#b9223a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path className={styles.vLine} d="M187,98 V86" stroke="#c8992c" strokeWidth="1.6" strokeLinecap="round" />
        <circle className={styles.vDot} cx="187" cy="82" r="3.5" stroke="#c8992c" strokeWidth="1.6" style={{ transformOrigin: "187px 82px" }} />
        <rect className={styles.vWindow} x="180" y="140" width="14" height="26" rx="7" fill="url(#venueGlow)" />

        {/* central hall body */}
        <path className={styles.vLine} d="M88,182 V108 H172 V182" stroke="#b9223a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path className={styles.vLine} d="M84,108 H176" stroke="#c8992c" strokeWidth="1.6" strokeLinecap="round" />

        {/* grand central onion dome */}
        <path className={styles.vLine} d="M92,108 C92,72 112,48 130,48 C148,48 168,72 168,108" stroke="#b9223a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path className={styles.vLine} d="M97,108 H163" stroke="#c8992c" strokeWidth="1.6" strokeLinecap="round" />
        <path className={styles.vLine} d="M130,48 V32" stroke="#c8992c" strokeWidth="1.8" strokeLinecap="round" />
        <circle className={styles.vDot} cx="130" cy="27" r="4.5" stroke="#c8992c" strokeWidth="1.8" style={{ transformOrigin: "130px 27px" }} />

        {/* grand arched entrance */}
        <path
          className={styles.vLine}
          d="M116,182 V146 A14,14 0 0 1 144,146 V182"
          stroke="#b9223a"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path className={styles.vWindow} d="M116,182 V146 A14,14 0 0 1 144,146 V182 Z" fill="url(#venueGlow)" />

        {/* flanking arched windows */}
        <path className={styles.vWindow} d="M98,150 V132 A7,7 0 0 1 112,132 V150 Z" fill="url(#venueGlow)" />
        <path className={styles.vWindow} d="M148,150 V132 A7,7 0 0 1 162,132 V150 Z" fill="url(#venueGlow)" />
        <path className={styles.vLine} d="M98,150 V132 A7,7 0 0 1 112,132 V150" stroke="#c8992c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path className={styles.vLine} d="M148,150 V132 A7,7 0 0 1 162,132 V150" stroke="#c8992c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />

        {/* steps */}
        <path className={styles.vLine} d="M104,182 H156 M112,190 H148" stroke="#c8992c" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}
