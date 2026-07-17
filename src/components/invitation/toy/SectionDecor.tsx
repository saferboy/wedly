import styles from "./styles.module.css";

/**
 * Decorative background flourishes for a section: four gold filigree corner
 * scrolls and a pair of botanical side sprigs. Rendered behind the content
 * (z-index below the section body) to fill the negative space elegantly.
 * All strokes/fills use `currentColor`, so the palette is driven purely by the
 * CSS `color` on each element — gold for the corners, leaf-green for the sprigs.
 */
function CornerFlourish({ className }: { className: string }) {
  return (
    <span className={`${styles.corner} ${className}`}>
      <svg className={styles.cornerInner} viewBox="0 0 100 100" fill="none" aria-hidden="true">
        {/* twin curving scrolls sweeping out from the corner */}
        <path
          d="M4 4 C 46 6, 70 22, 78 60"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M4 4 C 6 46, 22 70, 60 78"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* small leaf buds at the scroll tips */}
        <path d="M78 60 c 7 -3 14 -1 18 6 c -7 3 -14 1 -18 -6 Z" fill="currentColor" opacity="0.85" />
        <path d="M60 78 c -3 7 -1 14 6 18 c 3 -7 1 -14 -6 -18 Z" fill="currentColor" opacity="0.85" />
        {/* accent dots */}
        <circle cx="5" cy="5" r="3.2" fill="currentColor" />
        <circle cx="40" cy="20" r="1.8" fill="currentColor" opacity="0.8" />
        <circle cx="20" cy="40" r="1.8" fill="currentColor" opacity="0.8" />
      </svg>
    </span>
  );
}

function Sprig({ className }: { className: string }) {
  return (
    <span className={`${styles.sprig} ${className}`}>
      <svg className={styles.sprigInner} viewBox="0 0 60 120" fill="none" aria-hidden="true">
        {/* central stem */}
        <path
          d="M30 118 C 30 90, 30 60, 30 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* paired leaves climbing the stem */}
        {[100, 78, 56, 34].map((y, i) => (
          <g key={i}>
            <path
              d={`M30 ${y} C 44 ${y - 4}, 52 ${y - 14}, 50 ${y - 24} C 40 ${y - 20}, 32 ${y - 12}, 30 ${y}`}
              fill="currentColor"
              opacity="0.9"
            />
            <path
              d={`M30 ${y} C 16 ${y - 4}, 8 ${y - 14}, 10 ${y - 24} C 20 ${y - 20}, 28 ${y - 12}, 30 ${y}`}
              fill="currentColor"
              opacity="0.9"
            />
          </g>
        ))}
        {/* gold bud at the crown */}
        <circle cx="30" cy="8" r="4" fill="currentColor" />
      </svg>
    </span>
  );
}

export default function SectionDecor() {
  return (
    <div className={styles.sectionDecor} aria-hidden="true">
      <CornerFlourish className={styles.cornerTL} />
      <CornerFlourish className={styles.cornerTR} />
      <CornerFlourish className={styles.cornerBL} />
      <CornerFlourish className={styles.cornerBR} />
      <Sprig className={styles.sprigLeft} />
      <Sprig className={styles.sprigRight} />
    </div>
  );
}
