"use client";

import styles from "./styles.module.css";
import useReveal from "./useReveal";
import type { TugilganKunStrings } from "./i18n";

interface Props {
  strings: TugilganKunStrings;
  venue: string;
  googleMapUrl?: string | null;
  yandexMapUrl?: string | null;
}

const DEFAULT_GOOGLE = "https://www.google.com/maps/search/?api=1&query=Tashkent";
const DEFAULT_YANDEX = "https://yandex.com/maps/?text=Toshkent";

export default function LocationSection({ strings, venue, googleMapUrl, yandexMapUrl }: Props) {
  const { ref: eyebrowRef, revealed: eyebrowIn } = useReveal<HTMLDivElement>();
  const { ref: titleRef, revealed: titleIn } = useReveal<HTMLHeadingElement>();
  const { ref: venueRef, revealed: venueIn } = useReveal<HTMLParagraphElement>();
  const { ref: linksRef, revealed: linksIn } = useReveal<HTMLDivElement>();

  const google = googleMapUrl && googleMapUrl !== "#" ? googleMapUrl : DEFAULT_GOOGLE;
  const yandex = yandexMapUrl && yandexMapUrl !== "#" ? yandexMapUrl : DEFAULT_YANDEX;

  return (
    <section className={styles.location}>
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
