"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import type { InvitationData, Language } from "@/types/invitation";
import styles from "./styles.module.css";
import { classicFontVars } from "./fonts";
import { classicI18n, MONTHS } from "./i18n";
import useReveal from "./useReveal";

interface Props {
  data: InvitationData;
}

const FALLBACK_PHOTO = "/templates/classic-hero.jpg";
const FALLBACK_MUSIC = "/music/kuyov-kelinchak.m4a";
/** Skip the intro of the track — start (and loop) from this offset in seconds. */
const MUSIC_START = 30;

function buildEventDateTime(isoDate: string, time: string): Date {
  const date = new Date(isoDate);
  const [h, m] = time.split(":").map((n) => parseInt(n, 10));
  if (!Number.isNaN(h)) date.setHours(h, Number.isNaN(m) ? 0 : m, 0, 0);
  return date;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Small wrapper that fades its children up once scrolled into view. */
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

/* ============================================================
   Ornaments — a small, cohesive "islimi + suzani" gold vocabulary.
   ============================================================ */

/** Islimi (vine-scroll) corner filigree. Placed at the four corners of a
 *  section's decorative page frame so the screen is framed like a printed leaf. */
function Islimi({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 70 70" fill="none" aria-hidden="true">
      <g stroke="var(--gold)" strokeWidth="1.3" strokeLinecap="round">
        <path d="M6 6 C32 8 42 22 42 44" />
        <path d="M6 6 C8 32 22 42 44 42" />
        <path d="M42 44 C42 31 34 25 26 31 C21 35 26 43 32 39" />
        <path d="M44 42 C31 42 25 34 31 26 C35 21 43 26 39 32" />
      </g>
      <circle cx="10" cy="10" r="2.4" fill="var(--garnet)" />
    </svg>
  );
}

/** The decorative gold double-rule "page" with islimi corners. Purely visual
 *  (absolutely positioned) — it never clips the content that scrolls above it. */
function PageFrame() {
  return (
    <div className={styles.frame} aria-hidden="true">
      <Islimi className={`${styles.corner} ${styles.cTL}`} />
      <Islimi className={`${styles.corner} ${styles.cTR}`} />
      <Islimi className={`${styles.corner} ${styles.cBL}`} />
      <Islimi className={`${styles.corner} ${styles.cBR}`} />
    </div>
  );
}

/** Interlocked wedding rings — the couple's mark. Used on the cover seal and as
 *  the footer sign-off. `currentColor` sets the metal tone for each context. */
function Rings({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 48" fill="none" aria-hidden="true">
      <circle cx="28" cy="27" r="15" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="44" cy="27" r="15" stroke="currentColor" strokeWidth="2.2" opacity="0.72" />
      <path d="M36 3 l3.2 5.4 -3.2 5.4 -3.2 -5.4 z" fill="currentColor" />
    </svg>
  );
}

/** Slim horizontal divider: gold rule — diamond trio — gold rule. */
function Flourish() {
  return (
    <div className={styles.flourish} aria-hidden="true">
      <span className={styles.fLine} />
      <svg className={styles.fMark} viewBox="0 0 34 12" fill="none">
        <path d="M17 0 l4.5 6 -4.5 6 -4.5 -6 z" fill="var(--garnet)" />
        <path d="M5 2 l3 4 -3 4 -3 -4 z" fill="var(--gold)" />
        <path d="M29 2 l3 4 -3 4 -3 -4 z" fill="var(--gold)" />
      </svg>
      <span className={`${styles.fLine} ${styles.rev}`} />
    </div>
  );
}

/** A gold palmette finial that crowns the hero arch. */
function Crest() {
  return (
    <svg className={styles.crest} viewBox="0 0 80 44" fill="none" aria-hidden="true">
      <g stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M40 42 V14" />
        <path d="M40 24 C29 24 23 16 21 6 C31 9 38 14 40 24" />
        <path d="M40 24 C51 24 57 16 59 6 C49 9 42 14 40 24" />
        <path d="M40 14 l5 -6 M40 14 l-5 -6" />
      </g>
      <circle cx="40" cy="8" r="3" fill="var(--garnet)" />
      <circle cx="21" cy="6" r="2.2" fill="var(--gold-lt)" />
      <circle cx="59" cy="6" r="2.2" fill="var(--gold-lt)" />
    </svg>
  );
}

/** Fine gold dust drifting down behind the hero. Purely decorative. */
function GoldDust() {
  return (
    <div className={styles.dust} aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

/** Animated chevron nudging the guest to keep scrolling. */
function ScrollHint() {
  return (
    <div className={styles.scrollHint} aria-hidden="true">
      <svg viewBox="0 0 24 14">
        <path
          d="M2 2l10 10L22 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * Venue visual: if the customer uploaded a photo, show it in a gold frame;
 * otherwise draw an elegant line-art to'yxona (wedding hall) that draws itself
 * in and gently lights up when the venue section reveals.
 */
function VenueScene({ photoUrl, alt }: { photoUrl?: string | null; alt: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  if (photoUrl) {
    return (
      <div ref={ref} className={`${styles.venuePhoto} ${revealed ? styles.inView : ""}`}>
        <div className={styles.venuePhotoFrame}>
          <Image src={photoUrl} alt={alt} width={420} height={300} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`${styles.house} ${revealed ? styles.drawn : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 168" fill="none">
        <circle className={styles.houseGlow} cx="120" cy="98" r="72" fill="var(--gold-lt)" />
        <g className={styles.windows} fill="var(--gold-lt)">
          <path d="M104 146 V108 A16 16 0 0 1 136 108 V146 Z" />
          <path d="M78 132 V112 A7 7 0 0 1 92 112 V132 Z" />
          <path d="M148 132 V112 A7 7 0 0 1 162 112 V132 Z" />
        </g>
        <g stroke="var(--garnet)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path className={styles.draw} pathLength={1} d="M20 146 H220" />
          <path className={styles.draw} pathLength={1} d="M64 146 V78 H176 V146" />
          <path className={styles.draw} pathLength={1} d="M84 78 A36 36 0 0 1 156 78" />
          <path className={styles.draw} pathLength={1} d="M120 42 V30" />
          <path className={styles.draw} pathLength={1} d="M44 146 V92 H60" />
          <path className={styles.draw} pathLength={1} d="M196 146 V92 H180" />
          <path className={styles.draw} pathLength={1} d="M44 92 A8 8 0 0 1 60 92" />
          <path className={styles.draw} pathLength={1} d="M180 92 A8 8 0 0 1 196 92" />
          <path className={styles.draw} pathLength={1} d="M52 146 H188 M60 154 H180" />
        </g>
        <g stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path className={styles.draw} pathLength={1} d="M104 146 V108 A16 16 0 0 1 136 108 V146" />
          <path className={styles.draw} pathLength={1} d="M78 132 V112 A7 7 0 0 1 92 112 V132 Z" />
          <path className={styles.draw} pathLength={1} d="M148 132 V112 A7 7 0 0 1 162 112 V132 Z" />
          <path className={styles.draw} pathLength={1} d="M120 30 l4 4 -4 4 -4 -4 z" />
        </g>
      </svg>
    </div>
  );
}

export default function ClassicTemplate({ data }: Props) {
  const [lang, setLang] = useState<Language>("uz");
  const [opened, setOpened] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const s = classicI18n[lang];

  const eventDate = useMemo(() => new Date(data.eventDate), [data.eventDate]);
  const target = useMemo(
    () => buildEventDateTime(data.eventDate, data.eventTime),
    [data.eventDate, data.eventTime]
  );

  const photoUrl = data.photoUrl || FALLBACK_PHOTO;
  const musicUrl = data.customMusicUrl ?? data.musicTrack?.fileUrl ?? FALLBACK_MUSIC;

  const monthName = MONTHS[lang][eventDate.getMonth()];
  const capMonth = monthName.charAt(0) + monthName.slice(1).toLowerCase();
  const weekday = s.weekdays[eventDate.getDay()];
  const dateBig = `${eventDate.getDate()} ${capMonth}`;
  const dateSub = `${weekday} · ${lang === "uz" ? "soat" : "в"} ${data.eventTime}`;
  const subline = `${eventDate.getDate()} ${capMonth} ${eventDate.getFullYear()} · ${data.eventTime}`;

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

  // Countdown — start null on the server, tick on the client (no hydration mismatch).
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

  // Lock body scroll while the intro is showing.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = opened ? prev : "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [opened]);

  // Start playback from MUSIC_START (skip the first 30s). Only seek forward
  // when we're still before the start point, so pause/resume stays natural.
  const startPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime < MUSIC_START) audio.currentTime = MUSIC_START;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => setIntroGone(true), 1100);
    startPlayback();
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      startPlayback();
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  // Loop from MUSIC_START instead of 0 (no native `loop`).
  const handleEnded = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = MUSIC_START;
    audio.play().catch(() => setPlaying(false));
  };

  const audioCls = [
    styles.audioToggle,
    opened ? styles.visible : "",
    playing ? styles.musicPlaying : styles.musicPaused,
  ]
    .filter(Boolean)
    .join(" ");

  const who = data.groomName ? `${data.groomName} & ${data.brideName}` : data.brideName;

  return (
    <div className={`${classicFontVars} ${styles.root}`}>
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

      <audio ref={audioRef} preload="auto" src={musicUrl} onEnded={handleEnded} />
      <button type="button" className={audioCls} aria-label="Musiqa" onClick={toggleMusic}>
        <svg className={styles.iconPlaying} viewBox="0 0 24 24" fill="#7e1620">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
        <svg className={styles.iconPaused} viewBox="0 0 24 24" fill="#6e5942">
          <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l6 6L21 21l-9-9V7l-8-4z" />
        </svg>
      </button>

      {!introGone && (
        <div className={`${styles.intro} ${opened ? styles.opened : ""}`}>
          <GoldDust />
          <div className={styles.introInner}>
            <div className={styles.introGlyph} aria-hidden="true">
              ❦
            </div>
            <p className={styles.introEyebrow}>{s.heroEyebrow}</p>
            <h1 className={styles.introTitle}>{s.introTitle}</h1>
            <svg className={styles.envelope} viewBox="0 0 100 72" fill="none" aria-hidden="true">
              <rect x="5" y="18" width="90" height="48" rx="4" fill="#fdf7e9" stroke="var(--gold)" strokeWidth="2" />
              <line x1="5" y1="65" x2="50" y2="42" stroke="var(--gold)" strokeWidth="1.4" opacity="0.5" />
              <line x1="95" y1="65" x2="50" y2="42" stroke="var(--gold)" strokeWidth="1.4" opacity="0.5" />
              <path d="M5 18 L50 48 L95 18" fill="#f6ecd4" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="50" cy="40" r="12" fill="var(--garnet)" />
              <circle cx="45.5" cy="40" r="4.4" fill="none" stroke="var(--gold-lt)" strokeWidth="1.5" />
              <circle cx="54.5" cy="40" r="4.4" fill="none" stroke="var(--gold-lt)" strokeWidth="1.5" opacity="0.8" />
            </svg>
            <p className={styles.introSub}>{s.introSub}</p>
            <button type="button" className={styles.openBtn} onClick={handleOpen}>
              {s.openBtn}
            </button>
          </div>
        </div>
      )}

      <div className={styles.scroller}>
        <main className={styles.main}>
          {/* HERO */}
          <section className={`${styles.panel} ${styles.hero}`}>
            <PageFrame />
            <GoldDust />
            <div className={styles.inner}>
              <Reveal>
                <p className={styles.eyebrow}>{s.heroEyebrow}</p>
              </Reveal>
              <Reveal className={styles.archWrap}>
                <div className={styles.arch}>
                  <Crest />
                  <Image src={photoUrl} alt={who} width={320} height={400} priority />
                </div>
              </Reveal>
              <Reveal>
                <div className={styles.coupleNames}>
                  {data.groomName && <h1 className={styles.names}>{data.groomName}</h1>}
                  <span className={styles.amp}>&amp;</span>
                  <h1 className={styles.names}>{data.brideName}</h1>
                </div>
              </Reveal>
              <Reveal>
                <p className={styles.kicker}>{s.heroKicker}</p>
              </Reveal>
              <Reveal>
                <p className={styles.subline}>{subline}</p>
              </Reveal>
            </div>
            <ScrollHint />
          </section>

          {/* LETTER */}
          <section className={styles.panel}>
            <PageFrame />
            <div className={styles.inner}>
              <Reveal>
                <p className={styles.eyebrow}>{s.letterEyebrow}</p>
              </Reveal>
              <Reveal>
                <Flourish />
              </Reveal>
              <Reveal>
                <div className={styles.letterCard}>
                  <span className={styles.quote} aria-hidden="true">
                    &ldquo;
                  </span>
                  <p>{letter}</p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* DATE + COUNTDOWN */}
          <section className={styles.panel}>
            <PageFrame />
            <div className={styles.inner}>
              <Reveal>
                <p className={styles.eyebrow}>{s.dateEyebrow}</p>
              </Reveal>
              <Reveal>
                <Flourish />
              </Reveal>
              <Reveal>
                <div className={styles.ribbon}>
                  <div className={styles.ribbonBig}>{dateBig}</div>
                  <div className={styles.ribbonYear}>{eventDate.getFullYear()}</div>
                </div>
              </Reveal>
              <Reveal>
                <p className={styles.ribbonSub}>{dateSub}</p>
              </Reveal>
              <Reveal>
                <div className={styles.count}>
                  {[
                    { n: cd.d, u: s.cdDays },
                    { n: cd.h, u: s.cdHours },
                    { n: cd.m, u: s.cdMin },
                    { n: cd.s, u: s.cdSec },
                  ].map((c, i) => (
                    <div key={i} className={styles.cell}>
                      <div className={styles.cellNum}>{pad(c.n)}</div>
                      <div className={styles.cellUnit}>{c.u}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* VENUE */}
          <section className={styles.panel}>
            <PageFrame />
            <div className={styles.inner}>
              <Reveal>
                <p className={styles.eyebrow}>{s.venueEyebrow}</p>
              </Reveal>
              <Reveal>
                <Flourish />
              </Reveal>
              <Reveal>
                <div className={styles.venueName}>{data.venueName}</div>
              </Reveal>
              {venueAddr && (
                <Reveal>
                  <div className={styles.venueAddr}>{venueAddr}</div>
                </Reveal>
              )}
              <VenueScene photoUrl={data.photoUrl} alt={data.venueName} />
              <Reveal>
                <div className={styles.maps}>
                  <a href={yandex} target="_blank" rel="noopener noreferrer">
                    {s.mapYandex}
                  </a>
                  <a href={google} target="_blank" rel="noopener noreferrer">
                    {s.mapGoogle}
                  </a>
                </div>
              </Reveal>
            </div>
          </section>

          {data.cardNumber && (
            /* GIFT */
            <section className={styles.panel}>
              <PageFrame />
              <div className={styles.inner}>
                <Reveal>
                  <p className={styles.eyebrow}>{s.giftEyebrow}</p>
                </Reveal>
                <Reveal>
                  <Flourish />
                </Reveal>
                <Reveal>
                  <div className={styles.gift}>
                    <svg className={styles.giftIcon} viewBox="0 0 24 22" aria-hidden="true">
                      <path
                        d="M12 20S3 14.5 3 8.2A4.2 4.2 0 0 1 12 5a4.2 4.2 0 0 1 9 3.2C21 14.5 12 20 12 20z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                    </svg>
                    <div className={styles.giftNote}>{s.giftNote}</div>
                    <div className={styles.giftNum}>{data.cardNumber}</div>
                    {data.cardHolder && (
                      <div className={styles.giftHolder}>{data.cardHolder}</div>
                    )}
                  </div>
                </Reveal>
              </div>
            </section>
          )}

          {/* FOOTER */}
          <section className={`${styles.panel} ${styles.foot}`}>
            <PageFrame />
            <div className={styles.inner}>
              <Reveal>
                <Rings className={styles.footRings} />
              </Reveal>
              <Reveal>
                <div className={styles.footMsg}>{s.footMsg}</div>
              </Reveal>
              <Reveal>
                <div className={styles.footWho}>
                  {who} · {eventDate.getFullYear()}
                </div>
              </Reveal>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
