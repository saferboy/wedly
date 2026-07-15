import type { Language } from "@/types/invitation";

// Reuse the shared month tables from the sibling template.
export { MONTHS, MONTHS_CAPTION } from "../qizlar-bazmi/i18n";

export interface TugilganKunStrings {
  introEyebrow: string;
  introTitle: string;
  introSub: string;
  openBtn: string;
  heroEyebrow: string;
  heroAnd: string;
  inviteTitle: string;
  inviteText: string;
  calEyebrow: string;
  calTitle: string;
  cdEyebrow: string;
  cdTitle: string;
  cdDays: string;
  cdHours: string;
  cdMin: string;
  cdSec: string;
  locEyebrow: string;
  locTitle: string;
  locGoogle: string;
  locYandex: string;
  footTitle: string;
  footText: string;
  footSign: string;
  monthShort: string;
  dows: string[];
}

export const tugilganKunI18n: Record<Language, TugilganKunStrings> = {
  uz: {
    introEyebrow: "Taklifnoma",
    introTitle: "Tug'ilgan kun bazmi",
    introSub:
      "Eng quvonchli kunimizni — tug'ilgan kun bazmini birga nishonlashga sizni taklif qilamiz",
    openBtn: "Ochish",
    heroEyebrow: "Tug'ilgan kun",
    heroAnd: "S I Z N I  K U T A M I Z",
    inviteTitle: "Aziz mehmon!",
    inviteText:
      "Hayotimizdagi eng shirin va quvonchli kunlardan birini — tug'ilgan kunni aynan siz bilan birga nishonlashni istaymiz. Kelib, bayramimizga fayz va quvonch ulashishingizni astoydil kutamiz.",
    calEyebrow: "Sanani belgilang",
    calTitle: "Muhim kun",
    cdEyebrow: "Orqaga sanoq",
    cdTitle: "Bayramgacha qoldi",
    cdDays: "kun",
    cdHours: "soat",
    cdMin: "daqiqa",
    cdSec: "soniya",
    locEyebrow: "Manzil",
    locTitle: "Bizni qanday topasiz",
    locGoogle: "Google Maps",
    locYandex: "Yandex Xarita",
    footTitle: "Sizni kutib qolamiz!",
    footText: "Kelishingiz biz uchun eng katta sovg'a bo'ladi",
    footSign: "Hurmat bilan",
    monthShort: "",
    dows: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
  },
  ru: {
    introEyebrow: "Приглашение",
    introTitle: "День рождения",
    introSub:
      "Приглашаем вас вместе отметить наш самый радостный день — день рождения",
    openBtn: "Открыть",
    heroEyebrow: "День рождения",
    heroAnd: "М Ы  Ж Д Ё М  В А С",
    inviteTitle: "Дорогой гость!",
    inviteText:
      "Один из самых тёплых и радостных дней нашей жизни — день рождения — мы хотим отметить именно с вами. Будем искренне рады разделить с вами эту радость и праздничное настроение.",
    calEyebrow: "Отметьте дату",
    calTitle: "Важный день",
    cdEyebrow: "Обратный отсчёт",
    cdTitle: "До праздника осталось",
    cdDays: "дней",
    cdHours: "часов",
    cdMin: "минут",
    cdSec: "секунд",
    locEyebrow: "Адрес",
    locTitle: "Как нас найти",
    locGoogle: "Google Карты",
    locYandex: "Яндекс Карты",
    footTitle: "Мы ждём вас!",
    footText: "Ваше присутствие — лучший подарок для нас",
    footSign: "С уважением",
    monthShort: "",
    dows: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  },
};
