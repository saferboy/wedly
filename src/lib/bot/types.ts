export type BotStep =
  | "start"
  | "event_type"
  | "groom_name"
  | "bride_name"
  | "event_date"
  | "event_time"
  | "venue_name"
  | "venue_address"
  | "yandex_link"
  | "google_link"
  | "photo"
  | "music_choice"
  | "music_library"
  | "music_file"
  | "card_number"
  | "card_holder"
  | "notes"
  | "summary"
  | "preview"
  | "payment_screenshot"
  | "feedback"
  | "done";

export interface BotSession {
  step: BotStep;
  templateSlug?: string;
  orderId?: string; // Saytdan kelgan buyurtma (web) bilan bog'lash uchun
  eventType?: "WEDDING" | "BACHELORETTE" | "BIRTHDAY";
  groomName?: string;
  brideName?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  yandexLink?: string;
  googleLink?: string;
  photoFileId?: string;
  photoUrl?: string; // Storage'ga yuklangan rasm URL (preview uchun, keshlangan)
  photoType?: "couple" | "venue"; // Rasm turi: kelin-kuyov (hero) yoki to'yxona (manzil)
  musicChoice?: "library" | "custom" | "none";
  musicTrackId?: string;
  musicFileId?: string;
  customMusicUrl?: string; // Storage'ga yuklangan custom musiqa URL (keshlangan)
  cardNumber?: string;
  cardHolder?: string;
  notes?: string;
  editing?: boolean; // Bitta maydonni tahrirlash rejimi — tahrirdan keyin preview'ga qaytadi
  paymentScreenshotFileId?: string;

  // To'lovdan keyingi tahrirlash rejimi — check yuborilgach, link kelguncha
  // mijoz bitta maydonni o'zgartira oladi. Tahrir order + taklifnomani darrov
  // yangilaydi va admin xabardor qilinadi (preview/to'lov qaytadan so'ralmaydi).
  postPaid?: boolean;
  lastEditedLabel?: string; // Admin xabari uchun — oxirgi tahrirlangan maydon nomi

  // Fikr-taklif rejimi — mijoz taklifnomani olgach yoki /fikr orqali fikr
  // yozadi; matn `Feedback` jadvaliga (admin panel "Fikrlar") saqlanadi.
  feedbackOrderId?: string; // Fikr biriktiriladigan buyurtma id (bo'lsa)
}

export const defaultSession = (): BotSession => ({ step: "start" });
