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
  | "payment_screenshot"
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
  musicChoice?: "library" | "custom" | "none";
  musicTrackId?: string;
  musicFileId?: string;
  cardNumber?: string;
  cardHolder?: string;
  notes?: string;
  paymentScreenshotFileId?: string;
}

export const defaultSession = (): BotSession => ({ step: "start" });
