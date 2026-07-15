import type { Language } from "@/types/invitation";

export interface QizlarBazmiStrings {
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

export const qizlarBazmiI18n: Record<Language, QizlarBazmiStrings> = {
  uz: {
    introEyebrow: "Taklifnoma",
    introTitle: "Sizga taklifnoma bor",
    introSub:
      "Hayotimizdagi eng yorqin kunlardan biri — qizlar bazmiga sizni taklif qilishdan mamnunmiz",
    openBtn: "Ochish",
    heroEyebrow: "Qizlar bazmi",
    heroAnd: "S I Z N I  K U T M O Q D A",
    inviteTitle: "Aziz mehmon!",
    inviteText:
      "Hayotimizdagi eng totli va his-tuyg'ularga to'la lahzalardan birini — qizlar bazmini aynan siz bilan birga nishonlashni orzu qilamiz. Kelib, quvonchimizga sherik bo'lishingizni astoydil kutamiz.",
    calEyebrow: "Sanani belgilang",
    calTitle: "Muhim kun",
    cdEyebrow: "Orqaga sanoq",
    cdTitle: "Tadbirgacha qoldi",
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
    introTitle: "У вас есть приглашение",
    introSub:
      "Один из самых ярких дней в нашей жизни — приглашаем вас на девичник",
    openBtn: "Открыть",
    heroEyebrow: "Девичник",
    heroAnd: "М Ы  Ж Д Ё М  В А С",
    inviteTitle: "Дорогой гость!",
    inviteText:
      "Один из самых тёплых и трогательных моментов нашей жизни — девичник — мы хотим отметить именно с вами. Будем искренне рады разделить с вами эту радость.",
    calEyebrow: "Отметьте дату",
    calTitle: "Важный день",
    cdEyebrow: "Обратный отсчёт",
    cdTitle: "До события осталось",
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

// Full month names for the date pill / calendar heading
export const MONTHS: Record<Language, string[]> = {
  uz: [
    "YANVAR",
    "FEVRAL",
    "MART",
    "APREL",
    "MAY",
    "IYUN",
    "IYUL",
    "AVGUST",
    "SENTABR",
    "OKTABR",
    "NOYABR",
    "DEKABR",
  ],
  ru: [
    "ЯНВАРЯ",
    "ФЕВРАЛЯ",
    "МАРТА",
    "АПРЕЛЯ",
    "МАЯ",
    "ИЮНЯ",
    "ИЮЛЯ",
    "АВГУСТА",
    "СЕНТЯБРЯ",
    "ОКТЯБРЯ",
    "НОЯБРЯ",
    "ДЕКАБРЯ",
  ],
};

// Month names in nominative case for the calendar caption ("Avgust 2026")
export const MONTHS_CAPTION: Record<Language, string[]> = {
  uz: [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ],
  ru: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
};
