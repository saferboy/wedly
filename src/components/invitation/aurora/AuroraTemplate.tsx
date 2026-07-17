"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import type { InvitationData, Language } from "@/types/invitation";
import styles from "./styles.module.css";
import { auroraFontVars } from "./fonts";
import { auroraI18n, MONTHS } from "./i18n";
import useReveal from "./useReveal";

interface Props {
  data: InvitationData;
}

const FALLBACK_PHOTO = "/templates/aurora-hero.jpg";
const FALLBACK_MUSIC = "/music/kuyov-kelinchak.m4a";
/** Skip the track's quiet intro and loop from this offset (seconds). */
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

/** Ambient on-brand decoration that fills the negative space in a section:
 *  drifting rose-gold glows, a faint rotating watermark ring, and slow sparks. */
function SectionDeco({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`${styles.deco} ${dark ? styles.decoDark : ""}`} aria-hidden="true">
      <span className={styles.orbA} />
      <span className={styles.orbB} />
      <svg className={styles.ringDeco} viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="132" pathLength="1" />
        <circle cx="150" cy="150" r="100" pathLength="1" />
      </svg>
      <i className={`${styles.spark} ${styles.spark1}`} />
      <i className={`${styles.spark} ${styles.spark2}`} />
      <i className={`${styles.spark} ${styles.spark3}`} />
    </div>
  );
}

/** Ornamental divider: hairline · rose-gold gem · hairline. */
function Divider({ gold = false }: { gold?: boolean }) {
  return (
    <div className={styles.divider} aria-hidden="true">
      <span className={styles.divLine} />
      <svg className={`${styles.divGem} ${gold ? styles.gold : ""}`} viewBox="0 0 24 24">
        <path d="M12 2 L16.5 12 L12 22 L7.5 12 Z" />
      </svg>
      <span className={styles.divLine} />
    </div>
  );
}

export default function AuroraTemplate({ data }: Props) {
  const [lang, setLang] = useState<Language>("uz");
  const [opened, setOpened] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const s = auroraI18n[lang];

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
  const dateLine = `${eventDate.getDate()} ${capMonth} ${eventDate.getFullYear()}`;
  const bigDate = `${eventDate.getDate()} ${capMonth}`;
  const timeNote = `${weekday} · ${data.eventTime}`;

  const letter =
    (lang === "uz" ? data.letterText : data.letterTextRu)?.trim() || s.letterText;
  const venueAddr = data.venueAddress?.trim();
  const google = data.googleMapUrl && data.googleMapUrl !== "#" ? data.googleMapUrl : DEFAULT_GOOGLE;
  const yandex = data.yandexMapUrl && data.yandexMapUrl !== "#" ? data.yandexMapUrl : DEFAULT_YANDEX;

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

  // Start playback from MUSIC_START, skipping the quiet intro. Only seeks
  // forward when we're still before the start offset, so pause/resume keeps
  // its place instead of jumping back each time.
  const startPlayback = (audio: HTMLAudioElement) => {
    const begin = () => {
      if (audio.currentTime < MUSIC_START) {
        try {
          audio.currentTime = MUSIC_START;
        } catch {
          /* seeking before metadata is ready — handled on canplay below */
        }
      }
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };
    if (audio.readyState >= 1) {
      begin();
    } else {
      audio.addEventListener("loadedmetadata", begin, { once: true });
      audio.load();
    }
  };

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => setIntroGone(true), 1100);
    const audio = audioRef.current;
    if (audio) startPlayback(audio);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      startPlayback(audio);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  // Loop from MUSIC_START rather than the file start.
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
    <div className={`${auroraFontVars} ${styles.root}`}>
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
        <svg className={styles.iconPlaying} viewBox="0 0 24 24" fill="#a5675c">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
        <svg className={styles.iconPaused} viewBox="0 0 24 24" fill="#7c6f65">
          <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l6 6L21 21l-9-9V7l-8-4z" />
        </svg>
      </button>

      {!introGone && (
        <div className={`${styles.intro} ${opened ? styles.opened : ""}`}>
          <div className={styles.petals} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <svg className={styles.introArt} viewBox="0 0 120 120" aria-hidden="true">
            <circle className={styles.introRingA} cx="60" cy="60" r="46" pathLength="1" />
            <circle className={styles.introRingB} cx="60" cy="60" r="34" pathLength="1" />
            <path
              className={styles.introSpark}
              pathLength="1"
              d="M60 44 C61.5 54 66 58.5 76 60 C66 61.5 61.5 66 60 76 C58.5 66 54 61.5 44 60 C54 58.5 58.5 54 60 44 Z"
            />
            <circle className={styles.introGlow} cx="60" cy="60" r="2.4" />
          </svg>
          <div className={styles.eyebrow}>{s.introEyebrow}</div>
          <div className={styles.introNames} aria-label={names}>
            {names.split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`${styles.introChar} ${ch === "&" ? styles.amp : ""}`}
                style={{ animationDelay: `${0.5 + i * 0.045}s` }}
              >
                {ch === " " ? " " : ch}
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
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.orbit} aria-hidden="true" />
          <div className={styles.sun} aria-hidden="true" />
          <SectionDeco />
          <Reveal>
            <div className={styles.heroKicker}>{s.heroKicker}</div>
          </Reveal>
          {data.groomName && (
            <Reveal>
              <div className={styles.names}>{data.groomName}</div>
            </Reveal>
          )}
          <Reveal>
            <div className={styles.and}>{s.heroAnd}</div>
          </Reveal>
          <Reveal>
            <div className={styles.names}>{data.brideName}</div>
          </Reveal>
          <Reveal>
            <div className={styles.photoWrap}>
              <Image src={photoUrl} alt={names} width={300} height={360} priority />
            </div>
          </Reveal>
          <Reveal>
            <div className={styles.datePill}>{dateLine}</div>
          </Reveal>
        </section>

        {/* LETTER */}
        <section className={`${styles.letter} ${styles.tint}`}>
          <SectionDeco />
          <Reveal>
            <div className={styles.eyebrow}>{s.letterEyebrow}</div>
          </Reveal>
          <Reveal>
            <Divider />
          </Reveal>
          <Reveal>
            <h2 className={styles.h}>{s.letterTitle}</h2>
          </Reveal>
          <Reveal>
            <p className={styles.lead}>{letter}</p>
          </Reveal>
        </section>

        {/* DATE + COUNTDOWN */}
        <section>
          <SectionDeco />
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
        <section className={styles.tint}>
          <SectionDeco />
          <Reveal>
            <div className={styles.eyebrow}>{s.venueEyebrow}</div>
          </Reveal>
          <Reveal>
            <Divider />
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
            <SectionDeco />
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
          <SectionDeco dark />
          <Reveal>
            <div className={styles.footScript}>{s.footTitle}</div>
          </Reveal>
          <Reveal>
            <Divider gold />
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
