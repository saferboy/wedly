"use client";

import { useEffect, useMemo, useState } from "react";
import type { InvitationData, Language } from "@/types/invitation";
import styles from "./styles.module.css";
import { qizlarBazmiFontVars } from "./fonts";
import { qizlarBazmiI18n, MONTHS } from "./i18n";
import LangToggle from "./LangToggle";
import Petals from "./Petals";
import MusicToggle from "./MusicToggle";
import IntroScene from "./IntroScene";
import HeroSection from "./HeroSection";
import InviteCard from "./InviteCard";
import WishesSection from "./WishesSection";
import CalendarSection from "./CalendarSection";
import CountdownSection from "./CountdownSection";
import LocationSection from "./LocationSection";
import GiftSection from "./GiftSection";
import FooterSection from "./FooterSection";

interface Props {
  data: InvitationData;
}

const FALLBACK_PHOTO = "/templates/qizlar-hero.jpg";
const FALLBACK_MUSIC = "/music/qaynona.m4a";

/** Combine the ISO event date with the "HH:MM" time into a single Date. */
function buildEventDateTime(isoDate: string, time: string): Date {
  const date = new Date(isoDate);
  const [h, m] = time.split(":").map((n) => parseInt(n, 10));
  if (!Number.isNaN(h)) date.setHours(h, Number.isNaN(m) ? 0 : m, 0, 0);
  return date;
}

export default function QizlarBazmiTemplate({ data }: Props) {
  const [lang, setLang] = useState<Language>("uz");
  const [opened, setOpened] = useState(false);
  const [introGone, setIntroGone] = useState(false);

  const strings = qizlarBazmiI18n[lang];

  const eventDate = useMemo(() => new Date(data.eventDate), [data.eventDate]);
  const targetDateTime = useMemo(
    () => buildEventDateTime(data.eventDate, data.eventTime),
    [data.eventDate, data.eventTime]
  );

  const name = data.brideName;
  // Rasm turi: "venue" bo'lsa manzil bo'limida, aks holda hero qismida.
  const isVenuePhoto = data.photoType === "venue";
  const heroPhoto = data.photoUrl && !isVenuePhoto ? data.photoUrl : FALLBACK_PHOTO;
  const venuePhoto = data.photoUrl && isVenuePhoto ? data.photoUrl : null;
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
    <div className={`${qizlarBazmiFontVars} ${styles.root}`}>
      <LangToggle lang={lang} onChange={setLang} />
      <Petals />
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
            photoUrl={heroPhoto}
            animate={opened}
          />
          <InviteCard strings={strings} text={inviteText} />
          {data.notes?.trim() && (
            <WishesSection strings={strings} text={data.notes.trim()} />
          )}
          <CalendarSection strings={strings} lang={lang} eventDate={eventDate} />
          <CountdownSection strings={strings} target={targetDateTime} />
          <div className={styles.finale}>
            <LocationSection
              strings={strings}
              venue={venue}
              photoUrl={venuePhoto}
              googleMapUrl={data.googleMapUrl}
              yandexMapUrl={data.yandexMapUrl}
            />
            {data.cardNumber && (
              <GiftSection
                strings={strings}
                cardNumber={data.cardNumber}
                cardHolder={data.cardHolder}
              />
            )}
            <FooterSection strings={strings} name={name} />
          </div>
        </main>
      </div>
    </div>
  );
}
