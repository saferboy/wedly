import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { deriveMapLinks } from "./mapLinks";

export interface GenerateResult {
  slug: string;
  invitationId: string;
  /** true — yangi yaratildi, false — allaqachon mavjud edi (idempotent). */
  created: boolean;
}

/**
 * Buyurtma (Telegram botdan yoki saytdan kelgan) ma'lumotlaridan taklifnomani
 * AVTOMATIK yaratadi. Qo'lda forma to'ldirish shart emas.
 *
 * Idempotent: buyurtmaga allaqachon taklifnoma bog'langan bo'lsa, mavjudini
 * qaytaradi (ikki marta chaqirilsa dublikat yaratmaydi).
 */
export async function createInvitationFromOrder(
  orderId: string
): Promise<GenerateResult> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { invitation: true, template: true },
  });

  if (!order) throw new Error("Buyurtma topilmadi");

  // Allaqachon yaratilgan — mavjudini qaytaramiz.
  if (order.invitation) {
    return {
      slug: order.invitation.slug,
      invitationId: order.invitation.id,
      created: false,
    };
  }

  // Majburiy ma'lumotlarni tekshirish (buyurtma to'liq bo'lishi kerak).
  if (!order.templateId || !order.template) {
    throw new Error("Buyurtmada dizayn (template) tanlanmagan");
  }
  if (!order.eventDate) throw new Error("Buyurtmada sana ko'rsatilmagan");
  if (!order.eventTime) throw new Error("Buyurtmada soat ko'rsatilmagan");
  if (!order.venueName || !order.venueAddress) {
    throw new Error("Buyurtmada to'yxona ma'lumoti to'liq emas");
  }

  // Noyob slug — ismlarni "-" bilan faqat mavjud bo'lganda birlashtiramiz
  // (aks holda "-aysha" kabi boshida chiziqcha chiqadi).
  let slug =
    slugify([order.groomName, order.brideName].filter(Boolean).join(" ")) ||
    slugify(order.brideName) ||
    `taklif-${order.id.slice(-6)}`;
  if (await db.invitation.findUnique({ where: { slug } })) {
    slug = `${slug}-${order.id.slice(-4)}`;
  }

  // Musiqa: "library:<trackId>" bo'lsa va DB'da mavjud bo'lsa bog'laymiz.
  let musicTrackId: string | null = null;
  if (order.musicChoice?.startsWith("library:")) {
    const trackId = order.musicChoice.split(":")[1];
    if (trackId) {
      const track = await db.musicTrack.findUnique({ where: { id: trackId } });
      if (track) musicTrackId = track.id;
    }
  }

  // Mijoz faqat bittasini tashlasa, ikkinchisini koordinatadan avtomatik yasaymiz.
  const { yandexMapUrl, googleMapUrl } = deriveMapLinks(
    order.yandexLink,
    order.googleLink
  );

  const invitation = await db.invitation.create({
    data: {
      slug,
      isActive: true,
      eventType: order.eventType,
      groomName: order.groomName,
      brideName: order.brideName,
      eventDate: order.eventDate,
      eventTime: order.eventTime,
      venueName: order.venueName,
      venueAddress: order.venueAddress,
      yandexMapUrl,
      googleMapUrl,
      letterText: order.letterText ?? "",
      letterTextRu: order.letterTextRu ?? "",
      photoUrl: order.photoUrl,
      musicTrackId,
      customMusicUrl: order.customMusicUrl,
      cardNumber: order.cardNumber,
      cardHolder: order.cardHolder,
      templateId: order.templateId,
      orderId: order.id,
    },
  });

  return { slug, invitationId: invitation.id, created: true };
}

/** Taklifnoma to'liq (public) havolasini quradi.
 *  Havola boshqa qurilmalarga ulashilgani uchun DOIM internetdan ochiladigan
 *  manzil bo'lishi kerak — `NEXT_PUBLIC_APP_URL` ni shunga qarab sozlang:
 *    • prod: https://wedly.uz
 *    • lokal test (boshqa qurilmalar uchun): tunnel URL (cloudflared/ngrok)
 *  `localhost` faqat shu kompyuterда ochiladi, ulashib bo'lmaydi. */
export function invitationUrl(slug: string): string {
  const base = (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    ""
  ).replace(/\/$/, "");
  return `${base}/i/${slug}`;
}
