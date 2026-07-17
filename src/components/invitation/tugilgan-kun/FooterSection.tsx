import styles from "./styles.module.css";
import SectionDecor from "./SectionDecor";
import type { TugilganKunStrings } from "./i18n";

interface Props {
  strings: TugilganKunStrings;
  /** Birthday celebrant name, appended to the sign-off line. */
  name: string;
}

export default function FooterSection({ strings, name }: Props) {
  return (
    <footer className={styles.footer}>
      <SectionDecor variant={5} />
      <div className={styles.script}>{strings.footTitle}</div>
      <p>{strings.footText}</p>
      <div className={styles.sign}>
        {strings.footSign}, {name}
      </div>
    </footer>
  );
}
