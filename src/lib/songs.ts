import type { EventType } from "@/types/invitation";

/**
 * Saytdagi buyurtma formasi uchun tayyor qo'shiqlar katalogi.
 *
 * Yangi qo'shiq qo'shish uchun:
 *   1. Audio faylni `public/music/` papkasiga tashlang (mp3 / m4a).
 *   2. Shu ro'yxatga bitta yozuv qo'shing (`url` — `/music/<fayl>` ko'rinishida).
 *   3. Kerak bo'lsa `events` orqali qaysi tadbirlarga mosligini belgilang
 *      (bo'sh qoldirilса — barcha tadbirlarга chiqadi).
 */
export interface Song {
  id: string;
  title: string;
  sub: string;
  url: string;
  events?: EventType[];
}

export const SONGS: Song[] = [
  {
    id: "karnai",
    title: "An'anaviy — Karnay navosi",
    sub: "Milliy, tantanavor uslub",
    url: "/templates/invitation1/Traditional Uzbek Music Karnai Solo.m4a",
    // events belgilanmagan — barcha tadbir turlariga chiqadi.
  },
];

/** Berilgan tadbir turiga mos qo'shiqlar. */
export function songsFor(eventType: EventType): Song[] {
  return SONGS.filter((s) => !s.events || s.events.includes(eventType));
}

/** Katalogdan id bo'yicha qo'shiqni topish (xulosa/preview uchun). */
export function findSong(id: string): Song | undefined {
  return SONGS.find((s) => s.id === id);
}
