import styles from "./styles.module.css";
import { Flourish } from "./Ornaments";
import type { QizlarBazmiStrings } from "./i18n";

interface Props {
  strings: QizlarBazmiStrings;
  /** Bride / celebrant name, appended to the sign-off line. */
  name: string;
}

export default function FooterSection({ strings, name }: Props) {
  return (
    <footer className={styles.footer}>
      {/* Scalloped gold curtain edge that pulls up over the venue section */}
      <div className={styles.curtainEdge} aria-hidden="true">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path
            d="M0,40 V18 Q60,0 120,18 T240,18 T360,18 T480,18 T600,18 T720,18 T840,18 T960,18 T1080,18 T1200,18 V40 Z"
            fill="var(--crimson-deep)"
          />
          <path
            d="M0,18 Q60,0 120,18 T240,18 T360,18 T480,18 T600,18 T720,18 T840,18 T960,18 T1080,18 T1200,18"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className={styles.footerInner}>
        <div className={styles.footGlyph} aria-hidden="true">❀</div>
        <div className={styles.script}>{strings.footTitle}</div>
        <Flourish />
        <p>{strings.footText}</p>
        <div className={styles.sign}>
          {strings.footSign}, {name}
        </div>
      </div>
    </footer>
  );
}
