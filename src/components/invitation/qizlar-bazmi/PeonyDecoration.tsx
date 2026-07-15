import styles from "./styles.module.css";

interface Props {
  side: "left" | "right";
}

/**
 * Decorative peony branch (stem, leaves, bud and a detailed flower).
 * The gradient ids are namespaced per-side so the two instances on the
 * hero card don't collide.
 */
export default function PeonyDecoration({ side }: Props) {
  const gradId = `peonyGrad-${side}`;
  const goldId = `peonyGold-${side}`;

  return (
    <div className={`${styles.peonyDeco} ${styles[side]}`}>
      <svg viewBox="0 0 300 240">
        <defs>
          <radialGradient id={gradId} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#FFE5EC" />
            <stop offset="35%" stopColor="#FF8FA3" />
            <stop offset="70%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#800F2F" />
          </radialGradient>
          <radialGradient id={goldId} cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
            <stop offset="0%" stopColor="#FFF3E0" />
            <stop offset="50%" stopColor="#FFB74D" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>
        </defs>

        {/* Organic stem */}
        <path
          className={styles.peonyStem}
          d="M10,230 C80,180 150,150 250,140"
          fill="none"
          stroke="#4B6B45"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Back leaf clusters */}
        <path
          className={`${styles.peonyLeaf} ${styles.leaf1}`}
          d="M30,195 C6,190 -6,160 14,142 C24,162 34,178 30,195 Z"
          fill="#3D5837"
          style={{ transformOrigin: "30px 195px" }}
        />
        <path
          className={`${styles.peonyLeaf} ${styles.leaf3}`}
          d="M120,150 C95,120 100,80 130,85 C130,110 130,130 120,150 Z"
          fill="#3D5837"
          style={{ transformOrigin: "120px 150px" }}
        />

        {/* Detailed leaves with veins */}
        <g className={`${styles.peonyLeaf} ${styles.leaf2}`} style={{ transformOrigin: "180px 135px" }}>
          <path d="M180,135 C195,105 230,115 240,135 C215,160 195,150 180,135 Z" fill="#4B6B45" />
          <path
            d="M180,135 Q212,125 240,135 M200,131 Q205,121 210,121 M215,130 Q222,123 226,123"
            fill="none"
            stroke="#6F9967"
            strokeWidth="1.2"
          />
        </g>
        <g className={`${styles.peonyLeaf} ${styles.leaf4}`} style={{ transformOrigin: "150px 185px" }}>
          <path d="M150,185 C160,205 185,210 195,195 C185,180 160,180 150,185 Z" fill="#4B6B45" />
        </g>

        {/* Peony bud (outer g positions, inner g scales) */}
        <g transform="translate(80, 160)">
          <g className={styles.peonyBudGroup}>
            <path d="M-10,0 C-15,-22 -2,-28 0,-28 C2,-28 15,-22 10,0" fill="#4B6B45" />
            <path d="M-8,-2 C-14,-22 14,-22 8,-2 Z" fill={`url(#${gradId})`} />
            <path d="M-5,-4 C-10,-24 10,-24 5,-4 Z" fill={`url(#${gradId})`} transform="rotate(15)" />
            <path d="M-5,-4 C-10,-24 10,-24 5,-4 Z" fill={`url(#${gradId})`} transform="rotate(-15)" />
          </g>
        </g>

        {/* Big detailed peony flower (outer g positions, inner g scales) */}
        <g transform="translate(210, 130)">
          <g className={styles.peonyFlowerGroup}>
          <path
            d="M0,0 C-40,-50 40,-50 0,0 C-50,-40 -50,40 0,0 C40,50 -30,50 0,0 C50,-40 50,40 0,0"
            fill={`url(#${gradId})`}
            opacity="0.9"
          />
          <path
            d="M0,0 C-45,-25 -25,-45 0,0 C25,-45 45,-25 0,0 C45,25 25,45 0,0 C-25,45 -45,25 0,0"
            fill={`url(#${gradId})`}
            opacity="0.9"
            transform="rotate(22) scale(0.95)"
          />
          <path
            d="M0,0 C-35,-35 35,-35 0,0 C-35,35 35,35 0,0"
            fill={`url(#${gradId})`}
            transform="rotate(45) scale(0.85)"
          />
          <path
            d="M0,0 C-35,-35 35,-35 0,0 M0,0 C-35,35 35,35 0,0"
            fill={`url(#${gradId})`}
            transform="rotate(105) scale(0.85)"
          />
          <path
            d="M0,0 C-25,-25 25,-25 0,0 C-25,25 25,25 0,0"
            fill={`url(#${gradId})`}
            transform="rotate(15) scale(0.72)"
          />
          <path
            d="M0,0 C-25,-25 25,-25 0,0 C-25,25 25,25 0,0"
            fill={`url(#${gradId})`}
            transform="rotate(75) scale(0.72)"
          />
          <path
            d="M0,0 C-20,-20 20,-20 0,0"
            fill={`url(#${gradId})`}
            transform="rotate(135) scale(0.68)"
          />
          <path d="M-15,-5 C-22,-20 0,-28 0,-5" fill={`url(#${gradId})`} />
          <path d="M15,-5 C22,-20 0,-28 0,-5" fill={`url(#${gradId})`} transform="scale(-1,1)" />
          <path d="M-5,15 C-20,22 -28,0 -5,0" fill={`url(#${gradId})`} />
          <path d="M-5,15 C-20,22 -28,0 -5,0" fill={`url(#${gradId})`} transform="scale(1,-1)" />
          <circle cx="-4" cy="-4" r="5" fill={`url(#${goldId})`} />
          <circle cx="4" cy="4" r="5" fill={`url(#${goldId})`} />
          <circle cx="4" cy="-4" r="5" fill={`url(#${goldId})`} />
          <circle cx="-4" cy="4" r="5" fill={`url(#${goldId})`} />
          <circle cx="0" cy="0" r="10" fill="#FFA726" />
          <circle cx="0" cy="0" r="6" fill="#D84315" />
          <circle cx="-2" cy="-2" r="2" fill="#FFE082" />
          <circle cx="2" cy="2" r="2" fill="#FFE082" />
          </g>
        </g>
      </svg>
    </div>
  );
}
