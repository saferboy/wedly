import type { Language } from "@/types/invitation";

// Reuse the month name tables from the qizlar-bazmi template.
export { MONTHS, MONTHS_CAPTION } from "../qizlar-bazmi/i18n";

export interface ToyStrings {
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

export const toyI18n: Record<Language, ToyStrings> = {
  uz: {
    introEyebrow: "Taklifnoma",
    introTitle: "Nikoh to'yimizga taklif",
    introSub:
      "Hayotimizdagi eng baxtli kun — nikoh to'yimizni aynan siz bilan birga nishonlashni orzu qilamiz",
    openBtn: "Ochish",
    heroEyebrow: "Nikoh to'yi",
    heroAnd: "Sizni taklif qilamiz",
    inviteTitle: "Aziz mehmon!",
    inviteText:
      "Ikki qalb bir umrga birlashayotgan ushbu muborak kunda — nikoh to'yimizda siz bilan birga bo'lishni chin dildan orzu qilamiz. Kelib, baxtimizga sherik bo'lishingizni astoydil kutamiz.",
    calEyebrow: "Sanani belgilang",
    calTitle: "Muborak kun",
    cdEyebrow: "Orqaga sanoq",
    cdTitle: "To'yimizgacha qoldi",
    cdDays: "kun",
    cdHours: "soat",
    cdMin: "daqiqa",
    cdSec: "soniya",
    locEyebrow: "Manzil",
    locTitle: "Bizni qanday topasiz",
    locGoogle: "Google Maps",
    locYandex: "Yandex Xarita",
    footTitle: "Sizni kutib qolamiz!",
    footText: "Kelishingiz biz uchun eng katta baxt bo'ladi",
    footSign: "Hurmat bilan",
    monthShort: "",
    dows: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
  },
  ru: {
    introEyebrow: "Приглашение",
    introTitle: "Приглашение на нашу свадьбу",
    introSub:
      "Самый счастливый день в нашей жизни — свадьбу — мы мечтаем встретить именно с вами",
    openBtn: "Открыть",
    heroEyebrow: "Свадьба",
    heroAnd: "Приглашаем вас",
    inviteTitle: "Дорогой гость!",
    inviteText:
      "В этот благословенный день, когда два сердца соединяются навсегда — на нашей свадьбе — мы искренне желаем видеть вас рядом. Будем счастливы разделить с вами эту радость.",
    calEyebrow: "Отметьте дату",
    calTitle: "Благословенный день",
    cdEyebrow: "Обратный отсчёт",
    cdTitle: "До свадьбы осталось",
    cdDays: "дней",
    cdHours: "часов",
    cdMin: "минут",
    cdSec: "секунд",
    locEyebrow: "Адрес",
    locTitle: "Как нас найти",
    locGoogle: "Google Карты",
    locYandex: "Яндекс Карты",
    footTitle: "Мы ждём вас!",
    footText: "Ваше присутствие — величайшее счастье для нас",
    footSign: "С уважением",
    monthShort: "",
    dows: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  },
};
