"use client";

import type { Language } from "@/types/invitation";
import styles from "./styles.module.css";

interface Props {
  lang: Language;
  onChange: (lang: Language) => void;
}

export default function LangToggle({ lang, onChange }: Props) {
  return (
    <div className={styles.langToggle}>
      <button
        type="button"
        className={lang === "uz" ? styles.active : undefined}
        onClick={() => onChange("uz")}
      >
        UZ
      </button>
      <button
        type="button"
        className={lang === "ru" ? styles.active : undefined}
        onClick={() => onChange("ru")}
      >
        RU
      </button>
    </div>
  );
}
