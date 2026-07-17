"use client";

import Image from "next/image";
import styles from "./styles.module.css";
import PartyDecoration from "./PartyDecoration";
import SectionDecor from "./SectionDecor";
import type { TugilganKunStrings } from "./i18n";

interface Props {
  strings: TugilganKunStrings;
  name: string;
  dateLabel: string;
  photoUrl: string;
  /** Triggers the party decoration pop-in once the invitation is opened. */
  animate: boolean;
}

export default function HeroSection({ strings, name, dateLabel, photoUrl, animate }: Props) {
  return (
    <section className={styles.hero}>
      <SectionDecor variant={0} />
      <div className={`${styles.heroCard} ${animate ? styles.animateParty : ""}`}>
        <div className={styles.eyebrow}>{strings.heroEyebrow}</div>
        <h1 className={styles.names}>{name}</h1>
        <div className={styles.and}>{strings.heroAnd}</div>

        <div className={styles.photoFrameContainer}>
          <PartyDecoration side="left" />
          <PartyDecoration side="right" />

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
