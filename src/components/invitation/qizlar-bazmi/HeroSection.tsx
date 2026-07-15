"use client";

import Image from "next/image";
import styles from "./styles.module.css";
import PeonyDecoration from "./PeonyDecoration";
import type { QizlarBazmiStrings } from "./i18n";

interface Props {
  strings: QizlarBazmiStrings;
  name: string;
  dateLabel: string;
  photoUrl: string;
  /** Triggers the peony bloom animation once the invitation is opened. */
  animate: boolean;
}

export default function HeroSection({ strings, name, dateLabel, photoUrl, animate }: Props) {
  return (
    <section className={styles.hero}>
      <div className={`${styles.heroCard} ${animate ? styles.animateFlowers : ""}`}>
        <div className={styles.eyebrow}>{strings.heroEyebrow}</div>
        <h1 className={styles.names}>{name}</h1>
        <div className={styles.and}>{strings.heroAnd}</div>

        <div className={styles.photoFrameContainer}>
          <PeonyDecoration side="left" />
          <PeonyDecoration side="right" />

          <div className={styles.photoFrame}>
            <Image
              className={styles.heroImg}
              src={photoUrl}
              alt={name}
              fill
              sizes="(max-width: 520px) 75vw, 340px"
              priority
            />
          </div>
        </div>

        <div className={styles.datePill}>{dateLabel}</div>
      </div>
    </section>
  );
}
