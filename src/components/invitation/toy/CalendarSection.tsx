"use client";

import styles from "./styles.module.css";
import useReveal from "./useReveal";
import SectionDecor from "./SectionDecor";
import { MONTHS_CAPTION, type ToyStrings } from "./i18n";
import type { Language } from "@/types/invitation";

interface Props {
  strings: ToyStrings;
  lang: Language;
  eventDate: Date;
}

export default function CalendarSection({ strings, lang, eventDate }: Props) {
  const { ref: eyebrowRef, revealed: eyebrowIn } = useReveal<HTMLDivElement>();
  const { ref: titleRef, revealed: titleIn } = useReveal<HTMLHeadingElement>();
  const { ref: wrapRef, revealed: wrapIn } = useReveal<HTMLDivElement>();

  const year = eventDate.getFullYear();
  const month = eventDate.getMonth();
  const markedDay = eventDate.getDate();

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const offset = (firstDay + 6) % 7; // shift so Monday is first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const caption = `${MONTHS_CAPTION[lang][month]} ${year}`;

  return (
    <section className={styles.calendar}>
      <SectionDecor />
      <div
        ref={eyebrowRef}
        className={`${styles.eyebrow} ${styles.reveal} ${eyebrowIn ? styles.inView : ""}`}
      >
        {strings.calEyebrow}
      </div>
      <h2 ref={titleRef} className={`${styles.reveal} ${titleIn ? styles.inView : ""}`}>
        {strings.calTitle}
      </h2>
      <div className={styles.divider}>
        <i>&#10086;</i>
      </div>
      <div
        ref={wrapRef}
        className={`${styles.calWrap} ${styles.reveal} ${wrapIn ? styles.inView : ""}`}
      >
        <div className={styles.calMonth}>{caption}</div>
        <div className={styles.calGrid}>
          {strings.dows.map((d) => (
            <div key={d} className={styles.dow}>
              {d}
            </div>
          ))}
          {cells.map((day, i) =>
            day === null ? (
              <div key={`e${i}`} className={`${styles.day} ${styles.empty}`} />
            ) : (
              <div
                key={day}
                className={`${styles.day} ${day === markedDay ? styles.marked : ""}`}
              >
                {day}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
