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
const DEFAULT_GOOGLE = "https://www.google.com/maps/search/?api=1&query=Tashkent";
const DEFAULT_YANDEX = "https://yandex.com/maps/?text=Toshkent";

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

function Flourish() {
  return (
    <div className={styles.flourish} aria-hidden="true">
      <span className={styles.line} />
      <span className={styles.dot} />
      <span className={`${styles.dot} ${styles.fill}`} />
      <span className={styles.dot} />
      <span className={`${styles.line} ${styles.rev}`} />
    </div>
  );
}

/** A single five-petal flower rendered as an SVG group that blooms open. */
function Bud({ cx, cy, r, petal }: { cx: number; cy: number; r: number; petal: string }) {
  return (
    <g className={styles.bud}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={cx}
          cy={cy - r * 0.62}
          rx={r * 0.4}
          ry={r * 0.66}
          transform={`rotate(${a} ${cx} ${cy})`}
          fill={petal}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.3} fill="var(--gold)" />
    </g>
  );
}

/**
 * Cluster of small flowers ("to'p-to'p gullar") that bloom open with a
 * staggered scale/rotate once the hero is revealed. Purely decorative.
 */
function Flowers({ className }: { className?: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${styles.flowers} ${revealed ? styles.bloom : ""} ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100">
        <Bud cx={30} cy={70} r={20} petal="var(--garnet)" />
        <Bud cx={62} cy={78} r={15} petal="var(--gold-lt)" />
        <Bud cx={50} cy={44} r={13} petal="var(--garnet)" />
        <Bud cx={78} cy={54} r={11} petal="var(--gold-lt)" />
      </svg>
    </div>
  );
}

/**
 * Symmetric gold vine flourish that draws itself in on reveal. Placed
 * (absolutely) at the top/bottom of a section so its content is framed and
 * the screen fills elegantly instead of floating in empty space.
 */
function Sprig({ className }: { className?: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${styles.sprig} ${revealed ? styles.drawn : ""} ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 46" fill="none">
        <g stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round">
          <path className={styles.vine} pathLength={1} d="M120 23 C96 11 72 11 40 20" />
          <path className={styles.vine} pathLength={1} d="M120 23 C144 11 168 11 200 20" />
          <path className={styles.vine} pathLength={1} d="M120 23 C96 35 72 35 40 26" />
          <path className={styles.vine} pathLength={1} d="M120 23 C144 35 168 35 200 26" />
        </g>
        <g className={styles.leaf} fill="var(--gold)">
          <ellipse cx="80" cy="14" rx="7" ry="3" transform="rotate(-22 80 14)" />
          <ellipse cx="160" cy="14" rx="7" ry="3" transform="rotate(22 160 14)" />
          <ellipse cx="80" cy="32" rx="7" ry="3" transform="rotate(22 80 32)" />
          <ellipse cx="160" cy="32" rx="7" ry="3" transform="rotate(-22 160 32)" />
        </g>
        <g className={styles.berry}>
          <circle cx="120" cy="23" r="4.6" fill="var(--garnet)" />
          <circle cx="120" cy="23" r="1.7" fill="var(--gold-lt)" />
          <circle cx="40" cy="23" r="3" fill="var(--garnet)" />
          <circle cx="200" cy="23" r="3" fill="var(--garnet)" />
        </g>
      </svg>
    </div>
  );
}

/** A few gold petals drifting down behind the hero. Purely decorative. */
function Petals() {
  return (
    <div className={styles.petals} aria-hidden="true">
      {Array.from({ length: 7 }).map((_, i) => (
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
      <div
        ref={ref}
        className={`${styles.venuePhoto} ${revealed ? styles.inView : ""}`}
      >
        <div className={styles.venuePhotoFrame}>
          <Image src={photoUrl} alt={alt} width={420} height={300} />
        </div>
        <Flowers className={styles.flowersLeft} />
        <Flowers className={styles.flowersRight} />
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
        {/* lit windows (fade in after the outline is drawn) */}
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

  const initials = useMemo(() => {
    const g = data.groomName?.trim()?.[0] ?? "";
    const b = data.brideName?.trim()?.[0] ?? "";
    return [g, b].filter(Boolean).join("&") || "❦";
  }, [data.groomName, data.brideName]);

  const photoUrl = data.photoUrl || FALLBACK_PHOTO;
  const musicUrl = data.customMusicUrl ?? data.musicTrack?.fileUrl ?? FALLBACK_MUSIC;

  const monthName = MONTHS[lang][eventDate.getMonth()];
  const capMonth = monthName.charAt(0) + monthName.slice(1).toLowerCase();
  const weekday = s.weekdays[eventDate.getDay()];
  const dateBig = `${weekday}, ${eventDate.getDate()} ${capMonth}`;
  const dateSub = `${lang === "uz" ? "Kechki soat" : "Вечер, в"} ${data.eventTime}${lang === "uz" ? " dan" : ""}`;
  const subline = `${eventDate.getDate()} ${capMonth} ${eventDate.getFullYear()} · ${weekday} · ${data.eventTime}`;

  const letter =
    (lang === "uz" ? data.letterText : data.letterTextRu)?.trim() || s.letterText;

  const venueAddr = data.venueAddress?.trim();
  const google = data.googleMapUrl && data.googleMapUrl !== "#" ? data.googleMapUrl : DEFAULT_GOOGLE;
  const yandex = data.yandexMapUrl && data.yandexMapUrl !== "#" ? data.yandexMapUrl : DEFAULT_YANDEX;

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
          <button type="button" className={styles.introSeal} onClick={handleOpen}>
            <span>{initials}</span>
          </button>
          <div className={styles.introHint}>{s.sealOpen}</div>
        </div>
      )}

      <div className={styles.scroller}>
        <main className={styles.main}>
          {/* HERO */}
          <section className={styles.hero}>
            <Petals />
            <div className={styles.card}>
              <Reveal>
                <div className={styles.seal}>
                  <span>{initials}</span>
                </div>
              </Reveal>
              <Reveal>
                <p className={styles.eyebrow}>{s.heroEyebrow}</p>
              </Reveal>
              <Reveal>
                <p className={styles.kicker}>{s.heroKicker}</p>
              </Reveal>
              {data.groomName && (
                <Reveal>
                  <h1 className={styles.names}>{data.groomName}</h1>
                </Reveal>
              )}
              <Reveal>
                <div className={styles.amp}>&amp;</div>
              </Reveal>
              <Reveal>
                <h1 className={styles.names}>{data.brideName}</h1>
              </Reveal>
              <Reveal>
                <div className={styles.arch}>
                  <Image
                    src={photoUrl}
                    alt={data.brideName}
                    width={300}
                    height={340}
                    priority
                  />
                  <Flowers className={styles.flowersLeft} />
                  <Flowers className={styles.flowersRight} />
                </div>
              </Reveal>
              <Reveal>
                <p className={styles.subline}>{subline}</p>
              </Reveal>
            </div>
            <ScrollHint />
          </section>

          {/* LETTER */}
          <section className={styles.letter}>
            <div className={styles.card}>
              <Sprig className={styles.ornTop} />
              <Reveal>
                <p className={`${styles.eyebrow} ${styles.center}`}>{s.letterEyebrow}</p>
              </Reveal>
              <div className={`${styles.gap} ${styles.sm}`} />
              <Reveal>
                <div className={styles.letterCard}>
                  <span className={styles.quote} aria-hidden="true">
                    &ldquo;
                  </span>
                  <p>{letter}</p>
                </div>
              </Reveal>
              <Reveal>
                <Flourish />
              </Reveal>
              <Sprig className={styles.ornBottom} />
            </div>
          </section>

          {/* DATE + COUNTDOWN */}
          <section>
            <div className={styles.card}>
              <Sprig className={styles.ornTop} />
              <Reveal>
                <p className={`${styles.eyebrow} ${styles.center}`}>{s.dateEyebrow}</p>
              </Reveal>
              <div className={`${styles.gap} ${styles.sm}`} />
              <Reveal>
                <div className={styles.detail}>
                  <div className={styles.big}>{dateBig}</div>
                  <div className={styles.sm}>{dateSub}</div>
                </div>
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
                      <div className={styles.num}>{pad(c.n)}</div>
                      <div className={styles.unit}>{c.u}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Sprig className={styles.ornBottom} />
            </div>
          </section>

          {/* VENUE */}
          <section className={styles.venue}>
            <div className={styles.card}>
              <Sprig className={styles.ornTop} />
              <Reveal>
                <p className={styles.eyebrow}>{s.venueEyebrow}</p>
              </Reveal>
              <div className={`${styles.gap} ${styles.sm}`} />
              <Reveal>
                <div className={styles.name}>{data.venueName}</div>
              </Reveal>
              {venueAddr && (
                <Reveal>
                  <div className={styles.addr}>{venueAddr}</div>
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
              <Sprig className={styles.ornBottom} />
            </div>
          </section>

          {data.cardNumber && (
            /* GIFT */
            <section>
              <div className={styles.card}>
                <Sprig className={styles.ornTop} />
                <Reveal>
                  <p className={`${styles.eyebrow} ${styles.center}`}>{s.giftEyebrow}</p>
                </Reveal>
                <div className={`${styles.gap} ${styles.sm}`} />
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
                    <div className={styles.sm}>{s.giftNote}</div>
                    <div className={styles.num}>{data.cardNumber}</div>
                    {data.cardHolder && <div className={styles.holder}>{data.cardHolder}</div>}
                  </div>
                </Reveal>
                <Sprig className={styles.ornBottom} />
              </div>
            </section>
          )}

          {/* FOOTER */}
          <section className={styles.foot}>
            <div className={styles.card}>
              <Sprig className={styles.ornTop} />
              <Reveal>
                <svg
                  className={styles.monogram}
                  viewBox="0 0 120 60"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10 40 Q30 10 60 30 Q90 50 110 20" strokeWidth="1.4" opacity="0.7" />
                  <circle cx="60" cy="30" r="4" fill="currentColor" stroke="none" />
                  <path d="M40 44 L60 30 L80 44" strokeWidth="1.2" opacity="0.5" />
                </svg>
              </Reveal>
              <Reveal>
                <div className={styles.msg}>{s.footMsg}</div>
              </Reveal>
              <Reveal>
                <div className={styles.who}>
                  {data.groomName ? `${data.groomName} & ${data.brideName}` : data.brideName} ·{" "}
                  {eventDate.getFullYear()}
                </div>
              </Reveal>
              <Sprig className={styles.ornBottom} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
