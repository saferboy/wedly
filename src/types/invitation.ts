export type EventType = "WEDDING" | "BACHELORETTE" | "BIRTHDAY";
export type Language = "uz" | "ru";

export interface InvitationMusic {
  fileUrl: string;
  title: string;
  artist?: string;
}

export interface InvitationData {
  id: string;
  slug: string;
  eventType: EventType;
  groomName?: string | null;
  brideName: string;
  eventDate: string; // ISO string
  eventTime: string; // "14:00"
  venueName: string;
  venueAddress: string;
  yandexMapUrl?: string | null;
  googleMapUrl?: string | null;
  letterText: string;
  letterTextRu: string;
  photoUrl?: string | null;
  musicTrack?: InvitationMusic | null;
  customMusicUrl?: string | null;
  cardNumber?: string | null;
  cardHolder?: string | null;
  template: {
    slug: string;
    name: string;
  };
}

export interface InvitationTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  fontFamily: string;
  envelopeBg: string;
}
