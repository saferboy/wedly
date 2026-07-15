import styles from "./styles.module.css";
import type { ToyStrings } from "./i18n";

interface Props {
  strings: ToyStrings;
  /** Joined couple name, appended to the sign-off line. */
  name: string;
}

export default function FooterSection({ strings, name }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.script}>{strings.footTitle}</div>
      <p>{strings.footText}</p>
      <div className={styles.sign}>
        {strings.footSign}, {name}
      </div>
    </footer>
  );
}
