"use client";

import { useEffect, useMemo, useState } from "react";
import type { InvitationData, Language } from "@/types/invitation";
import styles from "./styles.module.css";
import { toyFontVars } from "./fonts";
import { toyI18n, MONTHS } from "./i18n";
import LangToggle from "./LangToggle";
import Sparkles from "./Sparkles";
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

const FALLBACK_PHOTO = "/templates/toy-hero.jpg";
const FALLBACK_MUSIC = encodeURI("/templates/invitation1/Traditional Uzbek Music Karnai Solo.m4a");

/** Combine the ISO event date with the "HH:MM" time into a single Date. */
function buildEventDateTime(isoDate: string, time: string): Date {
  const date = new Date(isoDate);
  const [h, m] = time.split(":").map((n) => parseInt(n, 10));
  if (!Number.isNaN(h)) date.setHours(h, Number.isNaN(m) ? 0 : m, 0, 0);
  return date;
}

export default function ToyTemplate({ data }: Props) {
  const [lang, setLang] = useState<Language>("uz");
  const [opened, setOpened] = useState(false);
  const [introGone, setIntroGone] = useState(false);

  const strings = toyI18n[lang];

  const eventDate = useMemo(() => new Date(data.eventDate), [data.eventDate]);
  const targetDateTime = useMemo(
    () => buildEventDateTime(data.eventDate, data.eventTime),
    [data.eventDate, data.eventTime]
  );

  // Wedding shows both names joined; groomName may be null → just the bride.
  const name = data.groomName ? `${data.groomName} & ${data.brideName}` : data.brideName;
  const photoUrl = data.photoUrl || FALLBACK_PHOTO;
  const musicUrl = data.customMusicUrl ?? data.musicTrack?.fileUrl ?? FALLBACK_MUSIC;

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
    <div className={`${toyFontVars} ${styles.root}`}>
      <LangToggle lang={lang} onChange={setLang} />
      <Sparkles />
      <MusicToggle url={musicUrl} started={opened} />

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
