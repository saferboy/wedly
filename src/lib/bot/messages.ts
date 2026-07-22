import { eventTypeLabel } from "../eventType";

/**
 * HTML parse_mode uchun maxsus belgilarni ekranlaydi. Foydalanuvchi kiritgan
 * ismlar/manzillar va URL'lardagi `_` `*` kabi belgilar HTML'da oddiy matn
 * bo'lgani uchun Markdown'dagi "entity" xatolari yuzaga kelmaydi.
 */
const escapeHtml = (v?: string) =>
  (v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const MSG = {
  welcome: `🌹 *Wedly botiga xush kelibsiz!*

Men sizga to'y yoki qiz bazmi uchun chiroyli onlayn taklifnoma yaratishga yordam beraman.

Jarayon oddiy:
1️⃣ Ma'lumotlarni kiriting
2️⃣ To'lovni amalga oshiring
3️⃣ 24 soat ichida tayyor link oling

Boshlaylikmi?`,

  chooseEventType: `📋 *Tadbir turini tanlang:*`,

  groomName: `👨 *Kuyovning ismini kiriting:*\n\n_Familiya shart emas. Misol: Jasur yoki Jasur Toshmatov_`,

  brideName: (isWedding: boolean) =>
    isWedding
      ? `👰 *Kelinning ismini kiriting:*\n\n_Familiya shart emas. Misol: Nilufar yoki Nilufar Karimova_`
      : `👰 *Ismingizni kiriting:*\n\n_Familiya shart emas. Misol: Malika yoki Malika Yusupova_`,

  eventDate: `📅 *To'y sanasini kiriting:*\n\n_Format: KK.OO.YYYY\nMisol: 15.06.2026_`,

  eventTime: `⏰ *Soatini kiriting:*\n\n_Misol: 14:00_`,

  venueName: `🏛 *To'yxona nomini kiriting:*\n\n_Misol: Oq Saroy Restaurant_`,

  venueAddress: `📍 *To'yxona manzilini kiriting:*\n\n_Misol: S. Ayniy ko'chasi, 60, Toshkent_`,

  yandexLink: `🗺 *Yandex xaritasi linkini kiriting:*\n\n_(Ixtiyoriy — o'tkazib yuborish uchun /skip bosing)_`,

  googleLink: `🗺 *Google Maps linkini kiriting:*\n\n_(Ixtiyoriy — o'tkazib yuborish uchun /skip bosing)_`,

  photo: `📷 *To'yxona yoki kelin rasmini yuboring:*\n\n_(Ixtiyoriy — o'tkazib yuborish uchun tugmani bosing)_`,

  musicChoice: `🎵 *Fon musiqasini tanlang:*`,

  musicLibrary: `🎶 *Quyidagi musiqalardan birini tanlang:*`,

  musicFile: `🎵 *Audio faylni yuboring:*\n\n_MP3 format, maksimal 10MB_`,

  cardNumber: `💳 *To'yona karta raqami kerakmi?*\n\n_(Mehmonlar to'yona o'tkazishi uchun karta raqamingiz taklifnomada ko'rinadi)_`,

  cardNumberInput: `💳 *Karta raqamingizni kiriting:*\n\n_Misol: 8600 1234 5678 9012_`,

  cardHolder: `👤 *Karta egasining to'liq ismini kiriting:*\n\n_Misol: JASUR TOSHMATOV_`,

  notes: `📝 *Qo'shimcha xohish yoki izohlaringiz bo'lsa kiriting:*\n\n_(Ixtiyoriy — o'tkazib yuborish uchun /skip bosing)_`,

  paymentInfo: (amount: string) =>
    `✅ *Buyurtmangiz qabul qilindi!*\n\n💳 *To'lov ma'lumotlari:*\n\nSumma: *${amount}*\nKarta: \`8600 0000 0000 0000\`\nEgasi: ADMIN ADMINOV\n\n⚡ To'lovni amalga oshirgandan so'ng *chekni (screenshot)* yuboring.`,

  done: `🎉 *Rahmat!*\n\nSizning buyurtmangiz adminimizga yuborildi. *24 soat ichida* tayyor taklifnoma linkini bu yerga yuboramiz!`,

  // HTML parse_mode — URL'lardagi `_` va boshqa belgilar xatoga sabab bo'lmasin.
  adminNotification: (session: Record<string, string | undefined>) =>
    `🔔 <b>Yangi buyurtma!</b>\n\n` +
    `📋 Tur: ${escapeHtml(eventTypeLabel(session.eventType ?? ""))}\n` +
    (session.groomName ? `👨 Kuyov: ${escapeHtml(session.groomName)}\n` : "") +
    `👰 Kelin: ${escapeHtml(session.brideName)}\n` +
    `📅 Sana: ${escapeHtml(session.eventDate)} soat ${escapeHtml(session.eventTime)}\n` +
    `🏛 To'yxona: ${escapeHtml(session.venueName)}\n` +
    `📍 Manzil: ${escapeHtml(session.venueAddress)}\n` +
    (session.yandexLink ? `🗺 Yandex: ${escapeHtml(session.yandexLink)}\n` : "") +
    (session.googleLink ? `🗺 Google: ${escapeHtml(session.googleLink)}\n` : "") +
    (session.cardNumber ? `💳 Karta: ${escapeHtml(session.cardNumber)} (${escapeHtml(session.cardHolder)})\n` : "") +
    (session.notes ? `📝 Izoh: ${escapeHtml(session.notes)}\n` : "") +
    `\n🎨 Template: ${escapeHtml(session.templateSlug || "tanlanmagan")}\n` +
    `🎵 Musiqa: ${escapeHtml(session.musicChoice || "yo'q")}`,
};

export const KEYBOARDS = {
  eventType: {
    inline_keyboard: [
      [
        { text: "💍 To'y", callback_data: "event_WEDDING" },
        { text: "🌸 Qiz bazmi", callback_data: "event_BACHELORETTE" },
      ],
      [{ text: "🎈 Tug'ilgan kun", callback_data: "event_BIRTHDAY" }],
    ],
  },

  skipPhoto: {
    inline_keyboard: [[{ text: "⏭ O'tkazib yuborish", callback_data: "skip_photo" }]],
  },

  musicChoice: {
    inline_keyboard: [
      [{ text: "🎵 Kutubxonadan tanlash", callback_data: "music_library" }],
      [{ text: "📤 O'z musiqamni yuklash", callback_data: "music_custom" }],
      [{ text: "🔇 Musiqa kerak emas", callback_data: "music_none" }],
    ],
  },

  cardChoice: {
    inline_keyboard: [
      [{ text: "✅ Ha, karta raqamim bo'lsin", callback_data: "card_yes" }],
      [{ text: "❌ Kerak emas", callback_data: "card_no" }],
    ],
  },

  musicLibrary: (tracks: Array<{ id: string; title: string; artist?: string }>) => ({
    inline_keyboard: [
      ...tracks.map((t) => [
        {
          text: `🎵 ${t.title}${t.artist ? ` — ${t.artist}` : ""}`,
          callback_data: `track_${t.id}`,
        },
      ]),
      [{ text: "📤 O'zimniki yuklayman", callback_data: "music_custom" }],
    ],
  }),
};
