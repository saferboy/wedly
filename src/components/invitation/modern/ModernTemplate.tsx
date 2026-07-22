"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import type { InvitationData, Language } from "@/types/invitation";
import styles from "./styles.module.css";
import { modernFontVars } from "./fonts";
import { modernI18n, MONTHS } from "./i18n";
import useReveal from "./useReveal";

interface Props {
  data: InvitationData;
}

const FALLBACK_PHOTO = "/templates/modern-hero.jpg";
const FALLBACK_MUSIC = "/music/another-love.m4a";

function buildEventDateTime(isoDate: string, time: string): Date {
  const date = new Date(isoDate);
  const [h, m] = time.split(":").map((n) => parseInt(n, 10));
  if (!Number.isNaN(h)) date.setHours(h, Number.isNaN(m) ? 0 : m, 0, 0);
  return date;
}

const pad = (n: number) => String(n).padStart(2, "0");

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${revealed ? styles.inView : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export default function ModernTemplate({ data }: Props) {
  const [lang, setLang] = useState<Language>("uz");
  const [opened, setOpened] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const s = modernI18n[lang];

  const eventDate = useMemo(() => new Date(data.eventDate), [data.eventDate]);
  const target = useMemo(
    () => buildEventDateTime(data.eventDate, data.eventTime),
    [data.eventDate, data.eventTime]
  );

  const names = data.groomName ? `${data.groomName} & ${data.brideName}` : data.brideName;
  const photoUrl = data.photoUrl || FALLBACK_PHOTO;
  const musicUrl = data.customMusicUrl ?? data.musicTrack?.fileUrl ?? FALLBACK_MUSIC;

  const monthName = MONTHS[lang][eventDate.getMonth()];
  const capMonth = monthName.charAt(0) + monthName.slice(1).toLowerCase();
  const weekday = s.weekdays[eventDate.getDay()];
  const heroDate = `${eventDate.getDate()} · ${capMonth} · ${eventDate.getFullYear()}`;
  const bigDate = `${eventDate.getDate()} ${capMonth}`;
  const timeNote = `${weekday} · ${data.eventTime}`;

  const letter =
    (lang === "uz" ? data.letterText : data.letterTextRu)?.trim() || s.letterText;
  const venueAddr = data.venueAddress?.trim();
  // Without an explicit map link, search the real venue so the map app opens
  // the actual location (and can navigate there via GPS).
  const mapQuery = encodeURIComponent(
    [data.venueName, data.venueAddress].filter(Boolean).join(", ").trim() || "Toshkent"
  );
  const google =
    data.googleMapUrl && data.googleMapUrl !== "#"
      ? data.googleMapUrl
      : `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const yandex =
    data.yandexMapUrl && data.yandexMapUrl !== "#"
      ? data.yandexMapUrl
      : `https://yandex.com/maps/?text=${mapQuery}`;

  useEffect(() => {
    if (!opened) return;
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [opened]);

  const remaining = Math.max(0, target.getTime() - (now ?? target.getTime()));
  const cd = {
    d: Math.floor(remaining / 86400000),
    h: Math.floor((remaining / 3600000) % 24),
    m: Math.floor((remaining / 60000) % 60),
    s: Math.floor((remaining / 1000) % 60),
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = opened ? prev : "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [opened]);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => setIntroGone(true), 1100);
    const audio = audioRef.current;
    if (audio) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const audioCls = [
    styles.audioToggle,
    opened ? styles.visible : "",
    playing ? styles.musicPlaying : styles.musicPaused,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${modernFontVars} ${styles.root}`}>
      <div className={styles.langToggle}>
        <button
          type="button"
          className={lang === "uz" ? styles.active : undefined}
          onClick={() => setLang("uz")}
        >
          UZ
        </button>
        <button
          type="button"
          className={lang === "ru" ? styles.active : undefined}
          onClick={() => setLang("ru")}
        >
          RU
        </button>
      </div>

      <audio ref={audioRef} loop preload="auto" src={musicUrl} />
      <button type="button" className={audioCls} aria-label="Musiqa" onClick={toggleMusic}>
        <svg className={styles.iconPlaying} viewBox="0 0 24 24" fill="#e3ce9a">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
        <svg className={styles.iconPaused} viewBox="0 0 24 24" fill="#a79e95">
          <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l6 6L21 21l-9-9V7l-8-4z" />
        </svg>
      </button>

      {!introGone && (
        <div className={`${styles.intro} ${opened ? styles.opened : ""}`}>
          <div className={styles.embers} aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
          {/* Two interlocking wedding rings that draw themselves and glint */}
          <svg
            className={styles.introRings}
            viewBox="0 0 180 116"
            fill="none"
            aria-hidden="true"
          >
            <circle className={styles.ringHalo} cx="70" cy="62" r="36" />
            <circle className={styles.ringHalo} cx="110" cy="62" r="36" />
            <circle className={styles.ringL} cx="70" cy="62" r="36" />
            <circle className={styles.ringR} cx="110" cy="62" r="36" />
            <path
              className={styles.ringSpark}
              d="M90 6 l2.6 7 7 2.6 -7 2.6 -2.6 7 -2.6 -7 -7 -2.6 7 -2.6 z"
            />
          </svg>
          <div className={styles.eyebrow}>{s.introEyebrow}</div>
          <div className={styles.introNames}>
            {names.split(" ").map((w, i) => (
              <span key={`${w}-${i}`} className={styles.word}>
                {w}
              </span>
            ))}
          </div>
          <p className={styles.introSub}>{s.introSub}</p>
          <button type="button" className={styles.openBtn} onClick={handleOpen}>
            {s.openBtn}
          </button>
        </div>
      )}

      <div className={styles.scroller}>
        {/* HERO — full-bleed frameless photo */}
        <section className={styles.hero}>
          <div className={styles.heroPhoto} aria-hidden="true">
            <Image src={photoUrl} alt={names} fill sizes="100vw" priority />
          </div>
          <div className={styles.heroInner}>
            <Reveal>
              <div className={styles.heroKicker}>{s.heroKicker}</div>
            </Reveal>
            {data.groomName && (
              <Reveal>
                <div className={styles.names}>{data.groomName}</div>
              </Reveal>
            )}
            <Reveal>
              <div className={styles.and}>&amp;</div>
            </Reveal>
            <Reveal>
              <div className={styles.names}>{data.brideName}</div>
            </Reveal>
            <Reveal>
              <div className={styles.heroDate}>{heroDate}</div>
            </Reveal>
          </div>
          <div className={styles.scrollHint} aria-hidden="true">
            <span />
            {s.scrollHint}
          </div>
        </section>

        {/* LETTER */}
        <section className={styles.letter}>
          <Reveal>
            <div className={styles.eyebrow}>{s.letterEyebrow}</div>
          </Reveal>
          <Reveal>
            <div className={styles.rule} />
          </Reveal>
          <Reveal>
            <p className={styles.lead}>{letter}</p>
          </Reveal>
        </section>

        {/* DATE + COUNTDOWN */}
        <section>
          <Reveal>
            <div className={styles.eyebrow}>{s.dateEyebrow}</div>
          </Reveal>
          <Reveal>
            <div className={styles.bigDate}>{bigDate}</div>
          </Reveal>
          <Reveal>
            <div className={styles.timeNote}>{timeNote}</div>
          </Reveal>
          <Reveal>
            <div className={styles.timer}>
              {[
                { n: cd.d, u: s.cdDays },
                { n: cd.h, u: s.cdHours },
                { n: cd.m, u: s.cdMin },
                { n: cd.s, u: s.cdSec },
              ].map((c, i) => (
                <div key={i} className={styles.box}>
                  <div className={styles.num}>{pad(c.n)}</div>
                  <div className={styles.lab}>{c.u}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* VENUE */}
        <section className={styles.venue}>
          <Reveal>
            <div className={styles.eyebrow}>{s.venueEyebrow}</div>
          </Reveal>
          <Reveal>
            <div className={styles.rule} />
          </Reveal>
          <Reveal>
            <div className={styles.venueName}>{data.venueName}</div>
          </Reveal>
          {venueAddr && (
            <Reveal>
              <p className={styles.venueAddr}>{venueAddr}</p>
            </Reveal>
          )}
          <Reveal>
            <div className={styles.maps}>
              <a href={google} target="_blank" rel="noopener noreferrer">
                {s.mapGoogle}
              </a>
              <a className={styles.alt} href={yandex} target="_blank" rel="noopener noreferrer">
                {s.mapYandex}
              </a>
            </div>
          </Reveal>
        </section>

        {/* GIFT */}
        {data.cardNumber && (
          <section>
            <Reveal>
              <div className={styles.eyebrow}>{s.giftEyebrow}</div>
            </Reveal>
            <Reveal>
              <div className={styles.giftNote}>{s.giftNote}</div>
            </Reveal>
            <Reveal>
              <div className={styles.cardNum}>{data.cardNumber}</div>
            </Reveal>
            {data.cardHolder && (
              <Reveal>
                <div className={styles.cardHolder}>{data.cardHolder}</div>
              </Reveal>
            )}
          </section>
        )}

        {/* FOOTER */}
        <section className={styles.footer}>
          <Reveal>
            <div className={styles.footScript}>{s.footTitle}</div>
          </Reveal>
          <Reveal>
            <div className={styles.rule} />
          </Reveal>
          <Reveal>
            <div className={styles.footSign}>
              {s.footSign} · {names} · {eventDate.getFullYear()}
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
