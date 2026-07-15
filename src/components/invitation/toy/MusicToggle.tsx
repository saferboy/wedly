"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

interface Props {
  url: string;
  /** Turns true once the invitation is opened — reveals the button and tries to autoplay. */
  started: boolean;
}

/**
 * Background music with a floating disc toggle. Mirrors the qizlar-bazmi
 * play/pause behaviour, including graceful handling of blocked autoplay.
 */
export default function MusicToggle({ url, started }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // Attempt autoplay when the invitation opens.
  useEffect(() => {
    if (!started) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [started]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const cls = [
    styles.audioToggle,
    started ? styles.visible : "",
    playing ? styles.musicPlaying : styles.musicPaused,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <audio ref={audioRef} loop preload="auto" src={url} />
      <button
        type="button"
        className={cls}
        aria-label="Musiqani boshqarish"
        onClick={toggle}
      >
        <svg className={styles.iconPlaying} viewBox="0 0 24 24">
          <path
            d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
            fill="#c9a44c"
          />
        </svg>
        <svg className={styles.iconPaused} viewBox="0 0 24 24">
          <path
            d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l6 6L21 21l-9-9V7l-8-4zm15.73 4h-4v4.73L19 14.73V7zM12 3v2.73L14 7.73V3h-2z"
            fill="#7a8a80"
          />
        </svg>
      </button>
    </>
  );
}
