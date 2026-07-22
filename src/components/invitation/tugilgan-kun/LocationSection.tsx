"use client";

import styles from "./styles.module.css";
import useReveal from "./useReveal";
import SectionDecor from "./SectionDecor";
import type { TugilganKunStrings } from "./i18n";

interface Props {
  strings: TugilganKunStrings;
  venue: string;
  googleMapUrl?: string | null;
  yandexMapUrl?: string | null;
}

export default function LocationSection({ strings, venue, googleMapUrl, yandexMapUrl }: Props) {
  const { ref: eyebrowRef, revealed: eyebrowIn } = useReveal<HTMLDivElement>();
  const { ref: titleRef, revealed: titleIn } = useReveal<HTMLHeadingElement>();
  const { ref: venueRef, revealed: venueIn } = useReveal<HTMLParagraphElement>();
  const { ref: linksRef, revealed: linksIn } = useReveal<HTMLDivElement>();

  // Without an explicit map link, search for the actual venue address so the
  // map app opens the real location (and can navigate there via GPS).
  const query = encodeURIComponent(venue?.trim() || "Toshkent");
  const google =
    googleMapUrl && googleMapUrl !== "#"
      ? googleMapUrl
      : `https://www.google.com/maps/search/?api=1&query=${query}`;
  const yandex =
    yandexMapUrl && yandexMapUrl !== "#"
      ? yandexMapUrl
      : `https://yandex.com/maps/?text=${query}`;

  return (
    <section className={styles.location}>
      <SectionDecor variant={4} />
      <div
        ref={eyebrowRef}
        className={`${styles.eyebrow} ${styles.reveal} ${eyebrowIn ? styles.inView : ""}`}
      >
        {strings.locEyebrow}
      </div>
      <h2 ref={titleRef} className={`${styles.reveal} ${titleIn ? styles.inView : ""}`}>
        {strings.locTitle}
      </h2>
      <p
        ref={venueRef}
        className={`${styles.venue} ${styles.reveal} ${venueIn ? styles.inView : ""}`}
      >
        {venue}
      </p>
      <div
        ref={linksRef}
        className={`${styles.mapLinks} ${styles.reveal} ${linksIn ? styles.inView : ""}`}
      >
        <a href={google} target="_blank" rel="noopener noreferrer">
          {strings.locGoogle}
        </a>
        <a className={styles.alt} href={yandex} target="_blank" rel="noopener noreferrer">
          {strings.locYandex}
        </a>
      </div>
    </section>
  );
}
