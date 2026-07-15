import styles from "./styles.module.css";

interface Props {
  side: "left" | "right";
}

/**
 * Decorative party cluster (a curling streamer, two balloons on strings and a
 * little gift box) that pops in when the hero card animates. Gradient ids are
 * namespaced per-side so the two instances don't collide.
 */
export default function PartyDecoration({ side }: Props) {
  const balloonA = `partyBalloonA-${side}`;
  const balloonB = `partyBalloonB-${side}`;
  const giftGrad = `partyGift-${side}`;

  return (
    <div className={`${styles.partyDeco} ${styles[side]}`}>
      <svg viewBox="0 0 300 240">
        <defs>
          <radialGradient id={balloonA} cx="50%" cy="40%" r="60%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#ffd0db" />
            <stop offset="55%" stopColor="#ff6b8a" />
            <stop offset="100%" stopColor="#e0466a" />
          </radialGradient>
          <radialGradient id={balloonB} cx="50%" cy="40%" r="60%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#d9fff4" />
            <stop offset="55%" stopColor="#3ecfb0" />
            <stop offset="100%" stopColor="#1fae91" />
          </radialGradient>
          <linearGradient id={giftGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd982" />
            <stop offset="100%" stopColor="#ffc94d" />
          </linearGradient>
        </defs>

        {/* Curling streamer */}
        <path
          className={styles.partyStreamer}
          d="M20,230 C70,190 40,150 90,130 C130,114 120,80 160,78"
          fill="none"
          stroke="#9b8cff"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Balloon strings */}
        <path
          className={styles.partyString}
          d="M120,120 C116,150 124,175 118,205"
          fill="none"
          stroke="#c9bfae"
          strokeWidth="1.5"
        />
        <path
          className={styles.partyString}
          d="M195,105 C191,140 199,170 193,205"
          fill="none"
          stroke="#c9bfae"
          strokeWidth="1.5"
        />

        {/* Balloon A */}
        <g className={`${styles.partyItem} ${styles.pBalloon1}`} style={{ transformOrigin: "120px 90px" }}>
          <ellipse cx="120" cy="88" rx="34" ry="42" fill={`url(#${balloonA})`} />
          <ellipse cx="108" cy="72" rx="9" ry="14" fill="#ffffff" opacity="0.35" />
          <path d="M114,128 L126,128 L120,138 Z" fill="#e0466a" />
        </g>

        {/* Balloon B */}
        <g className={`${styles.partyItem} ${styles.pBalloon2}`} style={{ transformOrigin: "195px 74px" }}>
          <ellipse cx="195" cy="72" rx="30" ry="38" fill={`url(#${balloonB})`} />
          <ellipse cx="184" cy="58" rx="8" ry="12" fill="#ffffff" opacity="0.35" />
          <path d="M190,108 L200,108 L195,117 Z" fill="#1fae91" />
        </g>

        {/* Gift box */}
        <g className={`${styles.partyItem} ${styles.pGift}`} style={{ transformOrigin: "150px 200px" }}>
          <rect x="118" y="188" width="64" height="46" rx="4" fill={`url(#${giftGrad})`} />
          <rect x="118" y="188" width="64" height="14" rx="4" fill="#ffb3c6" />
          <rect x="144" y="188" width="12" height="46" fill="#ff6b8a" />
          <path d="M150,188 C138,176 126,182 150,190 C174,182 162,176 150,188 Z" fill="#ff6b8a" />
        </g>
      </svg>
    </div>
  );
}
