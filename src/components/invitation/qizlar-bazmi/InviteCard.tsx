"use client";

import styles from "./styles.module.css";
import useReveal from "./useReveal";
import type { QizlarBazmiStrings } from "./i18n";

interface Props {
  strings: QizlarBazmiStrings;
  text: string;
}

export default function InviteCard({ strings, text }: Props) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <section className={styles.invite}>
      <div
        ref={ref}
        className={`${styles.inviteCard} ${styles.reveal} ${revealed ? styles.inView : ""}`}
      >
        <h2>{strings.inviteTitle}</h2>
        <p>{text}</p>
      </div>
    </section>
  );
}
