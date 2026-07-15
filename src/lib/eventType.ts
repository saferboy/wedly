import type { EventType } from "@/types/invitation";

/** O'zbekcha ko'rinadigan tadbir turi nomi (emojisiz). */
export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  WEDDING: "To'y",
  BACHELORETTE: "Qiz bazmi",
  BIRTHDAY: "Tug'ilgan kun",
};

/** Ro'yxatlar / filtrlar uchun emoji bilan. */
export const EVENT_TYPE_LABEL_EMOJI: Record<EventType, string> = {
  WEDDING: "💍 To'y",
  BACHELORETTE: "🌸 Qiz bazmi",
  BIRTHDAY: "🎈 Tug'ilgan kun",
};

/** Ruscha nom. */
export const EVENT_TYPE_LABEL_RU: Record<EventType, string> = {
  WEDDING: "Свадьба",
  BACHELORETTE: "Девичник",
  BIRTHDAY: "День рождения",
};

export function eventTypeLabel(type: string): string {
  return EVENT_TYPE_LABEL[type as EventType] ?? type;
}

export function eventTypeLabelEmoji(type: string): string {
  return EVENT_TYPE_LABEL_EMOJI[type as EventType] ?? type;
}

/** Barcha tadbir turlari — tanlov ro'yxatlari uchun tartibda. */
export const EVENT_TYPES: EventType[] = ["WEDDING", "BACHELORETTE", "BIRTHDAY"];
