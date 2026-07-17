import type { Language } from "@/types/invitation";

// Reuse the shared month name tables.
export { MONTHS } from "../qizlar-bazmi/i18n";

export interface ClassicStrings {
  sealOpen: string;
  heroEyebrow: string;
  heroKicker: string;
  familyLabel: string;
  letterEyebrow: string;
  letterText: string;
  dateEyebrow: string;
  cdDays: string;
  cdHours: string;
  cdMin: string;
  cdSec: string;
  venueEyebrow: string;
  mapYandex: string;
  mapGoogle: string;
  giftEyebrow: string;
  giftNote: string;
  footMsg: string;
  weekdays: string[];
}

export const classicI18n: Record<Language, ClassicStrings> = {
  uz: {
    sealOpen: "Ochish uchun bosing",
    heroEyebrow: "Taklifnoma",
    heroKicker: "Nikoh to'yi",
    familyLabel: "oilasi",
    letterEyebrow: "Hurmatli mehmon",
    letterText:
      "Sizni farzandlarimizning nikoh to'yi marosimiga chin dildan taklif etamiz. Ushbu quvonchli kunni Siz bilan birga nishonlash biz uchun katta sharaf. Kelib, yosh kelin-kuyovga oq yo'l tilab, dasturxonimizni bezashingizni so'rab qolamiz.",
    dateEyebrow: "Bazm sanasi",
    cdDays: "Kun",
    cdHours: "Soat",
    cdMin: "Daqiqa",
    cdSec: "Soniya",
    venueEyebrow: "Manzil",
    mapYandex: "Yandex xarita",
    mapGoogle: "Google xarita",
    giftEyebrow: "To'yona",
    giftNote: "Uzoqdagi mehmonlar uchun karta raqami",
    footMsg: "Sizni kutamiz",
    weekdays: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
  },
  ru: {
    sealOpen: "Нажмите, чтобы открыть",
    heroEyebrow: "Приглашение",
    heroKicker: "Свадьба",
    familyLabel: "семья",
    letterEyebrow: "Дорогой гость",
    letterText:
      "Мы от всего сердца приглашаем Вас на свадебное торжество наших детей. Разделить этот радостный день вместе с Вами — большая честь для нас. Будем искренне рады видеть Вас и разделить нашу радость.",
    dateEyebrow: "Дата торжества",
    cdDays: "Дней",
    cdHours: "Часов",
    cdMin: "Минут",
    cdSec: "Секунд",
    venueEyebrow: "Адрес",
    mapYandex: "Яндекс карта",
    mapGoogle: "Google карта",
    giftEyebrow: "Подарок",
    giftNote: "Номер карты для гостей издалека",
    footMsg: "Мы ждём Вас",
    weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
  },
};
