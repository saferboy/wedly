import type { Language } from "@/types/invitation";

export { MONTHS } from "../qizlar-bazmi/i18n";

export interface ModernStrings {
  introEyebrow: string;
  introSub: string;
  openBtn: string;
  heroKicker: string;
  scrollHint: string;
  letterEyebrow: string;
  letterText: string;
  dateEyebrow: string;
  cdTitle: string;
  cdDays: string;
  cdHours: string;
  cdMin: string;
  cdSec: string;
  venueEyebrow: string;
  mapGoogle: string;
  mapYandex: string;
  giftEyebrow: string;
  giftNote: string;
  footTitle: string;
  footSign: string;
  weekdays: string[];
}

export const modernI18n: Record<Language, ModernStrings> = {
  uz: {
    introEyebrow: "Taklifnoma",
    introSub: "Bir umrlik voqeaning boshlanishiga sizni taklif qilamiz",
    openBtn: "Ochish",
    heroKicker: "Nikoh to'yi",
    scrollHint: "pastga suring",
    letterEyebrow: "Taklif",
    letterText:
      "Eng muhim kunimizda yonimizda bo'lishingizni istaymiz. Sizning ishtirokingiz bu bayramni yanada yorqin va unutilmas qiladi.",
    dateEyebrow: "Sana",
    cdTitle: "Tantanagacha",
    cdDays: "kun",
    cdHours: "soat",
    cdMin: "daqiqa",
    cdSec: "soniya",
    venueEyebrow: "Manzil",
    mapGoogle: "Google Maps",
    mapYandex: "Yandex Xarita",
    giftEyebrow: "To'yona",
    giftNote: "Uzoqdagi mehmonlar uchun",
    footTitle: "Sizni kutamiz",
    footSign: "hurmat bilan",
    weekdays: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
  },
  ru: {
    introEyebrow: "Приглашение",
    introSub: "Приглашаем вас к началу истории длиною в жизнь",
    openBtn: "Открыть",
    heroKicker: "Свадьба",
    scrollHint: "листайте вниз",
    letterEyebrow: "Приглашение",
    letterText:
      "Мы хотим, чтобы в самый важный для нас день вы были рядом. Ваше присутствие сделает этот праздник ещё ярче и незабываемее.",
    dateEyebrow: "Дата",
    cdTitle: "До торжества",
    cdDays: "дней",
    cdHours: "часов",
    cdMin: "минут",
    cdSec: "секунд",
    venueEyebrow: "Адрес",
    mapGoogle: "Google Карты",
    mapYandex: "Яндекс Карты",
    giftEyebrow: "Подарок",
    giftNote: "Для гостей издалека",
    footTitle: "Мы ждём вас",
    footSign: "с уважением",
    weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
  },
};
