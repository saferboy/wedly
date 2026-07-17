"use client";

import { useEffect, useMemo, useState } from "react";
import type { InvitationData, Language } from "@/types/invitation";
import styles from "./styles.module.css";
import { tugilganKunFontVars } from "./fonts";
import { tugilganKunI18n, MONTHS } from "./i18n";
import LangToggle from "./LangToggle";
import Balloons from "./Balloons";
import Confetti from "./Confetti";
import MusicToggle from "./MusicToggle";
import IntroScene from "./IntroScene";
import HeroSection from "./HeroSection";
import InviteCard from "./InviteCard";
import CalendarSection from "./CalendarSection";
import CountdownSection from "./CountdownSection";
import LocationSection from "./LocationSection";
import FooterSection from "./FooterSection";

interface Props {
  data: InvitationData;
}

const FALLBACK_PHOTO = "/templates/birthday-hero.jpg";
/** Festive piano/lo-fi track that autoplays once the invitation is opened. */
const MUSIC_URL = "/music/piano-birthday.mp3";

/** Combine the ISO event date with the "HH:MM" time into a single Date. */
function buildEventDateTime(isoDate: string, time: string): Date {
  const date = new Date(isoDate);
  const [h, m] = time.split(":").map((n) => parseInt(n, 10));
  if (!Number.isNaN(h)) date.setHours(h, Number.isNaN(m) ? 0 : m, 0, 0);
  return date;
}

export default function TugilganKunTemplate({ data }: Props) {
  const [lang, setLang] = useState<Language>("uz");
  const [opened, setOpened] = useState(false);
  const [introGone, setIntroGone] = useState(false);

  const strings = tugilganKunI18n[lang];

  const eventDate = useMemo(() => new Date(data.eventDate), [data.eventDate]);
  const targetDateTime = useMemo(
    () => buildEventDateTime(data.eventDate, data.eventTime),
    [data.eventDate, data.eventTime]
  );

  const name = data.brideName;
  const photoUrl = data.photoUrl || FALLBACK_PHOTO;

  const dateLabel = `${eventDate.getDate()} ${MONTHS[lang][eventDate.getMonth()]} · ${eventDate.getFullYear()}`;

  const inviteText =
    lang === "uz"
      ? data.letterText?.trim() || strings.inviteText
      : data.letterTextRu?.trim() || strings.inviteText;

  const venue = [data.venueName, data.venueAddress].filter(Boolean).join(", ");

  // Lock page scroll while the intro overlay is showing.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = opened ? previous : "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [opened]);

  const handleOpen = () => {
    setOpened(true);
    // Remove the intro from the DOM once its fade-out transition completes.
    setTimeout(() => setIntroGone(true), 1200);
  };

  return (
    <div className={`${tugilganKunFontVars} ${styles.root}`}>
      <LangToggle lang={lang} onChange={setLang} />
      <Balloons />
      <Confetti active={opened} />
      <MusicToggle url={MUSIC_URL} started={opened} />

      {!introGone && (
        <IntroScene strings={strings} opened={opened} onOpen={handleOpen} />
      )}

      <div className={styles.scroller}>
        <main className={styles.main}>
          <HeroSection
            strings={strings}
            name={name}
            dateLabel={dateLabel}
            photoUrl={photoUrl}
            animate={opened}
          />
          <InviteCard strings={strings} text={inviteText} />
          <CalendarSection strings={strings} lang={lang} eventDate={eventDate} />
          <CountdownSection strings={strings} target={targetDateTime} />
          <LocationSection
            strings={strings}
            venue={venue}
            googleMapUrl={data.googleMapUrl}
            yandexMapUrl={data.yandexMapUrl}
          />
          <FooterSection strings={strings} name={name} />
        </main>
      </div>
    </div>
  );
}
