"use client";

import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";

interface Props {
  url: string;
}

export default function MusicPlayer({ url }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.5;
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={url} preload="none" />
      <button
        onClick={toggle}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-[var(--accent,#C9A84C)] text-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
        aria-label={playing ? "Musiqani o'chirish" : "Musiqani yoqish"}
      >
        {playing ? <Music size={18} /> : <VolumeX size={18} />}
      </button>
    </>
  );
}
