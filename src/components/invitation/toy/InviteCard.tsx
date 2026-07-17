"use client";

import styles from "./styles.module.css";
import useReveal from "./useReveal";
import SectionDecor from "./SectionDecor";
import type { ToyStrings } from "./i18n";

interface Props {
  strings: ToyStrings;
  text: string;
}

export default function InviteCard({ strings, text }: Props) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <section className={styles.invite}>
      <SectionDecor />
      <div
        ref={ref}
        className={`${styles.inviteCard} ${styles.reveal} ${revealed ? styles.inView : ""}`}
      >
        <h2>{strings.inviteTitle}</h2>
        <div className={styles.divider}>
          <i>&#10086;</i>
        </div>
        <p>{text}</p>
      </div>
    </section>
  );
}
