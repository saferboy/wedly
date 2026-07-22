/**
 * Yandex va Google xarita havolalari o'rtasida koordinata asosida
 * avtomatik konvertatsiya.
 *
 * Muhim: Yandex `ll=` parametri **uzunlik,kenglik** (lon,lat) tartibida,
 * Google esa **kenglik,uzunlik** (lat,lng) tartibida ishlaydi.
 */

export interface Coords {
  lat: number;
  lon: number;
}

const NUM = "(-?\\d+(?:\\.\\d+)?)";

function validCoords(lat: number, lon: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180
  );
}

/** Yandex havolasidan koordinata ajratadi (`ll=<lon>,<lat>`). */
export function extractYandexCoords(url?: string | null): Coords | null {
  if (!url) return null;
  // Vergul URL-encoded bo'lishi mumkin (%2C).
  const m = url.match(new RegExp(`[?&]ll=${NUM}(?:,|%2C)${NUM}`, "i"));
  if (!m) return null;
  const lon = parseFloat(m[1]);
  const lat = parseFloat(m[2]);
  return validCoords(lat, lon) ? { lat, lon } : null;
}

/** Google havolasidan koordinata ajratadi (bir necha formatni sinaydi). */
export function extractGoogleCoords(url?: string | null): Coords | null {
  if (!url) return null;
  const patterns = [
    new RegExp(`@${NUM},${NUM}`), // .../@lat,lng,15z
    new RegExp(`[?&](?:q|query|ll)=${NUM}(?:,|%2C)${NUM}`, "i"), // ?q= / query= / ll=
    new RegExp(`!3d${NUM}!4d${NUM}`), // ...!3dlat!4dlng
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) {
      const lat = parseFloat(m[1]);
      const lon = parseFloat(m[2]);
      if (validCoords(lat, lon)) return { lat, lon };
    }
  }
  return null;
}

export function buildGoogleLink({ lat, lon }: Coords): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

export function buildYandexLink({ lat, lon }: Coords): string {
  // ll — markaz, pt — nuqta (marker). Ikkalasi ham lon,lat tartibida.
  return `https://yandex.com/maps/?ll=${lon},${lat}&z=17&pt=${lon},${lat}`;
}

/**
 * Yandex/Google havolalarini o'zaro to'ldiradi:
 *   • faqat Yandex berilsa  → koordinatadan Google yasaydi
 *   • faqat Google berilsa  → koordinatadan Yandex yasaydi
 * Koordinata topilmasa (masalan qisqartirilgan havola) yoki ikkalasi ham
 * berilgan bo'lsa — o'zgartirmaydi.
 */
export function deriveMapLinks(
  yandex?: string | null,
  google?: string | null
): { yandexMapUrl: string | null; googleMapUrl: string | null } {
  let yandexMapUrl = yandex?.trim() || null;
  let googleMapUrl = google?.trim() || null;

  if (yandexMapUrl && !googleMapUrl) {
    const c = extractYandexCoords(yandexMapUrl);
    if (c) googleMapUrl = buildGoogleLink(c);
  } else if (googleMapUrl && !yandexMapUrl) {
    const c = extractGoogleCoords(googleMapUrl);
    if (c) yandexMapUrl = buildYandexLink(c);
  }

  return { yandexMapUrl, googleMapUrl };
}
