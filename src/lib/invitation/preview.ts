import { db } from "@/lib/db";
import { deriveMapLinks } from "./mapLinks";
import type { InvitationData, EventType } from "@/types/invitation";
import type { Order, Template } from "@prisma/client";

type OrderWithTemplate = Order & { template: Template | null };

/**
 * Draft buyurtma (`Order`, hali to'lanmagan) ma'lumotidan `InvitationData`
 * quradi — to'lovdan oldingi preview uchun. Bu yerda hech qanday `Invitation`
 * yozuvi yaratilmaydi; render `/i/[slug]` bilan bir xil `InvitationWrapper` orqali.
 *
 * Musiqa/xarita mantiqasi `createInvitationFromOrder` (generate.ts) bilan mos.
 */
export async function buildPreviewData(
  order: OrderWithTemplate
): Promise<InvitationData | null> {
  if (!order.template) return null;

  // Musiqa: "library:<trackId>" bo'lsa DB'dan topamiz, "custom" bo'lsa
  // buyurtmadagi yuklangan URL, aks holda musiqa yo'q.
  let musicTrack: InvitationData["musicTrack"] = null;
  if (order.musicChoice?.startsWith("library:")) {
    const trackId = order.musicChoice.split(":")[1];
    if (trackId) {
      const track = await db.musicTrack.findUnique({ where: { id: trackId } });
      if (track) {
        musicTrack = {
          fileUrl: track.fileUrl,
          title: track.title,
          artist: track.artist ?? undefined,
        };
      }
    }
  }

  const { yandexMapUrl, googleMapUrl } = deriveMapLinks(
    order.yandexLink,
    order.googleLink
  );

  return {
    id: order.id,
    slug: `preview-${order.id}`,
    eventType: order.eventType as EventType,
    groomName: order.groomName,
    brideName: order.brideName,
    // Draft bo'lsa sana hali bo'lmasligi mumkin — preview qulashini oldini olamiz.
    eventDate: (order.eventDate ?? new Date()).toISOString(),
    eventTime: order.eventTime ?? "",
    venueName: order.venueName ?? "",
    venueAddress: order.venueAddress ?? "",
    yandexMapUrl,
    googleMapUrl,
    letterText: order.letterText ?? "",
    letterTextRu: order.letterTextRu ?? "",
    notes: order.notes,
    photoUrl: order.photoUrl,
    photoType: (order.photoType as "couple" | "venue" | null) ?? "couple",
    musicTrack,
    customMusicUrl:
      order.musicChoice === "custom" ? order.customMusicUrl : null,
    cardNumber: order.cardNumber,
    cardHolder: order.cardHolder,
    template: {
      slug: order.template.slug,
      name: order.template.name,
    },
  };
}

/** Preview (to'lovdan oldingi) havolasini quradi — `invitationUrl` kabi.
 *  Havola boshqa qurilmada ochilgani uchun `NEXT_PUBLIC_APP_URL` prod/tunnel
 *  manziliga sozlangan bo'lishi kerak (`localhost` faqat shu kompyuterda). */
export function previewUrl(orderId: string): string {
  const base = (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    ""
  ).replace(/\/$/, "");
  return `${base}/preview/${orderId}`;
}
