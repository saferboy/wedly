import type { Language } from "@/types/invitation";

export { MONTHS } from "../qizlar-bazmi/i18n";

export interface AuroraStrings {
  introEyebrow: string;
  introSub: string;
  openBtn: string;
  heroKicker: string;
  heroAnd: string;
  letterEyebrow: string;
  letterTitle: string;
  letterText: string;
  dateEyebrow: string;
  cdTitle: string;
  cdDays: string;
  cdHours: string;
  cdMin: string;
  cdSec: string;
  venueEyebrow: string;
  venueTitle: string;
  mapGoogle: string;
  mapYandex: string;
  giftEyebrow: string;
  giftNote: string;
  footTitle: string;
  footSign: string;
  weekdays: string[];
}

export const auroraI18n: Record<Language, AuroraStrings> = {
  uz: {
    introEyebrow: "Taklifnoma",
    introSub: "Eng nurli kunimizni siz bilan birga boshlashni orzu qilamiz",
    openBtn: "Ochish",
    heroKicker: "Nikoh to'yi",
    heroAnd: "birga bir umr",
    letterEyebrow: "Aziz mehmon",
    letterTitle: "Bir necha so'z",
    letterText:
      "Ikki qalb bir bo'layotgan ushbu yorug' kunda sizni yonimizda ko'rish biz uchun katta baxt. Kelib, sevgimizga guvoh bo'lishingizni chin dildan so'raymiz.",
    dateEyebrow: "Sana",
    cdTitle: "Bayramgacha",
    cdDays: "kun",
    cdHours: "soat",
    cdMin: "daqiqa",
    cdSec: "soniya",
    venueEyebrow: "Manzil",
    venueTitle: "Bizni qanday topasiz",
    mapGoogle: "Google Maps",
    mapYandex: "Yandex Xarita",
    giftEyebrow: "To'yona",
    giftNote: "Uzoqdagi mehmonlar uchun",
    footTitle: "Sizni kutamiz",
    footSign: "muhabbat bilan",
    weekdays: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
  },
  ru: {
    introEyebrow: "Приглашение",
    introSub: "Мечтаем встретить наш самый светлый день вместе с вами",
    openBtn: "Открыть",
    heroKicker: "Свадьба",
    heroAnd: "вместе навсегда",
    letterEyebrow: "Дорогой гость",
    letterTitle: "Несколько слов",
    letterText:
      "В этот светлый день, когда два сердца становятся одним, видеть вас рядом — большое счастье для нас. Будем искренне рады, если вы придёте и станете свидетелями нашей любви.",
    dateEyebrow: "Дата",
    cdTitle: "До праздника",
    cdDays: "дней",
    cdHours: "часов",
    cdMin: "минут",
    cdSec: "секунд",
    venueEyebrow: "Адрес",
    venueTitle: "Как нас найти",
    mapGoogle: "Google Карты",
    mapYandex: "Яндекс Карты",
    giftEyebrow: "Подарок",
    giftNote: "Для гостей издалека",
    footTitle: "Мы ждём вас",
    footSign: "с любовью",
    weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
  },
};
