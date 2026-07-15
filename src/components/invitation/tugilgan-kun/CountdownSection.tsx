"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import useReveal from "./useReveal";
import type { TugilganKunStrings } from "./i18n";

interface Props {
  strings: TugilganKunStrings;
  target: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diffToParts(target: Date): TimeLeft {
  let diff = target.getTime() - Date.now();
  if (diff < 0) diff = 0;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function CountdownSection({ strings, target }: Props) {
  const { ref: eyebrowRef, revealed: eyebrowIn } = useReveal<HTMLDivElement>();
  const { ref: titleRef, revealed: titleIn } = useReveal<HTMLHeadingElement>();
  const { ref: timerRef, revealed: timerIn } = useReveal<HTMLDivElement>();

  // Start at zeros on the server, then tick on the client (avoids hydration mismatch).
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => setTime(diffToParts(target));
    const raf = requestAnimationFrame(tick); // first paint on the client
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [target]);

  const boxes = [
    { value: time.days, label: strings.cdDays },
    { value: time.hours, label: strings.cdHours },
    { value: time.minutes, label: strings.cdMin },
    { value: time.seconds, label: strings.cdSec },
  ];

  return (
    <section className={styles.countdown}>
      <div
        ref={eyebrowRef}
        className={`${styles.eyebrow} ${styles.reveal} ${eyebrowIn ? styles.inView : ""}`}
      >
        {strings.cdEyebrow}
      </div>
      <h2 ref={titleRef} className={`${styles.reveal} ${titleIn ? styles.inView : ""}`}>
        {strings.cdTitle}
      </h2>
      <div
        ref={timerRef}
        className={`${styles.timer} ${styles.reveal} ${timerIn ? styles.inView : ""}`}
      >
        {boxes.map((box, i) => (
          <div key={i} className={styles.box}>
            <div className={styles.num}>{pad(box.value)}</div>
            <div className={styles.lab}>{box.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
