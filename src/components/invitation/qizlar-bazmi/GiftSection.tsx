"use client";

import styles from "./styles.module.css";
import useReveal from "./useReveal";
import Ornaments from "./Ornaments";
import type { QizlarBazmiStrings } from "./i18n";

interface Props {
  strings: QizlarBazmiStrings;
  cardNumber: string;
  cardHolder?: string | null;
}

/** Sovg'a (karta) bo'limi — faqat mijoz karta raqamini kiritgan bo'lsa
 *  ko'rsatiladi. Tanlangan dizaynda bunday bo'lim bo'lmasa ham qo'shiladi. */
export default function GiftSection({ strings, cardNumber, cardHolder }: Props) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <section className={styles.invite}>
      <Ornaments />
      <div
        ref={ref}
        className={`${styles.inviteCard} ${styles.reveal} ${revealed ? styles.inView : ""}`}
      >
        <h2>{strings.giftTitle}</h2>
        <p>{strings.giftNote}</p>
        <div className={styles.giftBox}>
          <span className={styles.giftNum}>{cardNumber}</span>
          {cardHolder && <span className={styles.giftHolder}>{cardHolder}</span>}
        </div>
      </div>
    </section>
  );
}
