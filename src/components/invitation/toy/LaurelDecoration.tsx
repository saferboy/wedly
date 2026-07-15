import styles from "./styles.module.css";

interface Props {
  side: "left" | "right";
}

/**
 * Decorative laurel branch (curving stem, paired emerald leaves and a small
 * gold blossom). The gradient ids are namespaced per-side so the two instances
 * on the hero card don't collide. Draws in when the hero's `animateLaurel`
 * class is applied — analogous to PeonyDecoration in qizlar-bazmi.
 */
export default function LaurelDecoration({ side }: Props) {
  const leafId = `laurelLeaf-${side}`;
  const goldId = `laurelGold-${side}`;

  // Paired leaves distributed along the stem. Each entry mirrors above/below.
  const leaves = [
    { t: 30, y: 205, angUp: -55, angDn: 55, className: styles.leafA },
    { t: 78, y: 178, angUp: -50, angDn: 50, className: styles.leafB },
    { t: 128, y: 158, angUp: -46, angDn: 46, className: styles.leafC },
    { t: 178, y: 145, angUp: -40, angDn: 40, className: styles.leafD },
  ];

  return (
    <div className={`${styles.laurelDeco} ${styles[side]}`}>
      <svg viewBox="0 0 300 240">
        <defs>
          <linearGradient id={leafId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3a7d63" />
            <stop offset="60%" stopColor="#1f4d3d" />
            <stop offset="100%" stopColor="#0f2c22" />
          </linearGradient>
          <radialGradient id={goldId} cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
            <stop offset="0%" stopColor="#f7ecc8" />
            <stop offset="55%" stopColor="#c9a44c" />
            <stop offset="100%" stopColor="#8a6a24" />
          </radialGradient>
        </defs>

        {/* Organic curving stem */}
        <path
          className={styles.laurelStem}
          d="M10,230 C80,190 150,165 240,140"
          fill="none"
          stroke="#2f6b52"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Paired leaves along the stem */}
        {leaves.map((lf, i) => (
          <g key={i} className={`${styles.laurelLeaf} ${lf.className}`} style={{ transformOrigin: `${lf.t}px ${lf.y}px` }}>
            <g transform={`translate(${lf.t}, ${lf.y}) rotate(${lf.angUp})`}>
              <path d="M0,0 C10,-6 26,-6 34,0 C26,6 10,6 0,0 Z" fill={`url(#${leafId})`} />
              <path d="M2,0 H32" stroke="#6fae90" strokeWidth="1" opacity="0.6" />
            </g>
            <g transform={`translate(${lf.t}, ${lf.y}) rotate(${lf.angDn})`}>
              <path d="M0,0 C10,-6 26,-6 34,0 C26,6 10,6 0,0 Z" fill={`url(#${leafId})`} />
              <path d="M2,0 H32" stroke="#6fae90" strokeWidth="1" opacity="0.6" />
            </g>
          </g>
        ))}

        {/* Gold blossom at the tip (outer g positions, inner g scales) */}
        <g transform="translate(244, 132)">
          <g className={styles.laurelBloomGroup}>
            <circle cx="0" cy="-12" r="7" fill={`url(#${goldId})`} />
            <circle cx="11" cy="-4" r="7" fill={`url(#${goldId})`} />
            <circle cx="7" cy="10" r="7" fill={`url(#${goldId})`} />
            <circle cx="-7" cy="10" r="7" fill={`url(#${goldId})`} />
            <circle cx="-11" cy="-4" r="7" fill={`url(#${goldId})`} />
            <circle cx="0" cy="0" r="6" fill="#faf6ec" />
            <circle cx="0" cy="0" r="3" fill="#c9a44c" />
          </g>
        </g>
      </svg>
    </div>
  );
}
