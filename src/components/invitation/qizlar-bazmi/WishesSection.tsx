"use client";

import styles from "./styles.module.css";
import useReveal from "./useReveal";
import Ornaments from "./Ornaments";
import type { QizlarBazmiStrings } from "./i18n";

interface Props {
  strings: QizlarBazmiStrings;
  text: string;
}

/** Mijozning qo'shimcha tilagi/izohi — faqat kiritilgan bo'lsa ko'rsatiladi. */
export default function WishesSection({ strings, text }: Props) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <section className={styles.invite}>
      <Ornaments />
      <div
        ref={ref}
        className={`${styles.inviteCard} ${styles.reveal} ${revealed ? styles.inView : ""}`}
      >
        <h2>{strings.wishesTitle}</h2>
        <p>{text}</p>
      </div>
    </section>
  );
}
