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

  photo: `📷 *Rasm qo'shmoqchimisiz?*\n\nAvval rasm turini tanlang, so'ng rasmni yuboring:\n\n🏛 *To'yxona rasmi* — manzil bo'limida ko'rinadi\n💑 *Kelin-kuyov rasmi* — asosiy (hero) qismda ko'rinadi\n\n_(Ixtiyoriy — o'tkazib yuborish uchun tugmani bosing)_`,

  photoUpload: (type: "couple" | "venue") =>
    type === "venue"
      ? `🏛 *To'yxona rasmini yuboring:*`
      : `💑 *Kelin-kuyov rasmini yuboring:*`,

  musicChoice: `🎵 *Fon musiqasini tanlang:*`,

  musicLibrary: `🎶 *Quyidagi musiqalardan birini tanlang:*`,

  musicFile: `🎵 *Audio faylni yuboring:*\n\n_MP3 format, maksimal 10MB_`,

  cardNumber: `💳 *To'yona karta raqami kerakmi?*\n\n_(Mehmonlar to'yona o'tkazishi uchun karta raqamingiz taklifnomada ko'rinadi)_`,

  cardNumberInput: `💳 *Karta raqamingizni kiriting:*\n\n_Misol: 8600 1234 5678 9012_`,

  cardHolder: `👤 *Karta egasining to'liq ismini kiriting:*\n\n_Misol: JASUR TOSHMATOV_`,

  notes: `📝 *Qo'shimcha xohish yoki izohlaringiz bo'lsa kiriting:*\n\n_(Ixtiyoriy — o'tkazib yuborish uchun /skip bosing)_`,

  paymentInfo: (amount: string) =>
    `✅ *Buyurtmangiz qabul qilindi!*\n\n💳 *To'lov ma'lumotlari:*\n\nSumma: *${amount}*\nKarta: \`8600 0000 0000 0000\`\nEgasi: ADMIN ADMINOV\n\n⚡ To'lovni amalga oshirgandan so'ng *chekni (screenshot)* yuboring.`,

  previewReady: (url: string) =>
    `👀 *Taklifnomangiz tayyor!*\n\nQuyidagi havola orqali qanday chiqqanini ko'ring:\n${url}\n\n_(Bu hali qoralama — to'lovdan oldingi ko'rinish.)_\n\nHammasi joyidami? Yoqmagan joyini tahrirlashingiz mumkin 👇`,

  editWhat: `✏️ *Nimani tahrirlamoqchisiz?*`,

  done: `🎉 *Rahmat!*\n\nSizning buyurtmangiz adminimizga yuborildi. *24 soat ichida* tayyor taklifnoma linkini bu yerga yuboramiz!\n\n_Xatoga yo'l qo'ygan bo'lsangiz, link kelgunga qadar quyidagi tugma yoki /tahrir orqali tuzatishingiz mumkin._`,

  // To'lovdan keyingi tahrirlash
  postEditMenu: `✏️ *Nimani tuzatmoqchisiz?*\n\n_Faqat tanlagan maydoningiz o'zgaradi, qolgani o'zgarishsiz qoladi._`,

  postEditDone: (label: string) =>
    `✅ *${label}* yangilandi!\n\nTaklifnomangiz avtomatik yangilandi. Yana biror joyni tuzatmoqchimisiz?`,

  // Link allaqachon yuborilgan — tahrirlash yopiq.
  postEditClosed: `🔒 Taklifnoma linki allaqachon tayyorlanib yuborilgan, shu sabab bot orqali tahrirlab bo'lmaydi.\n\nO'zgartirish kerak bo'lsa administrator bilan bog'laning.`,

  // Fikr-taklif: mijozdan matn so'raymiz.
  feedbackPrompt: `💬 *Fikr va takliflaringizni yozib qoldiring.*\n\nXizmatimiz haqidagi mulohazangiz biz uchun juda muhim. Bitta xabarda yozib yuboring 👇`,

  // Fikr qabul qilingach — rahmat.
  feedbackThanks: `🙏 *Fikringiz uchun rahmat!*\n\nMulohazangiz qabul qilindi va jamoamizga yetkazildi. Wedly'ni yanada yaxshilashda yordam berganingiz uchun tashakkur! 💛`,

  // Fikr qoldirish uchun buyurtma topilmadi (/fikr buyrug'i).
  feedbackNoOrder: `💬 *Fikr va takliflaringizni yozib qoldiring.*\n\nXizmatimiz haqidagi mulohazangizni bitta xabarda yozib yuboring 👇`,

  // Admin'ga: yangi fikr keldi.
  adminFeedback: (info: { name?: string; message: string; brideName?: string; groomName?: string }) =>
    `💬 <b>Yangi fikr-taklif!</b>\n\n` +
    (info.name ? `👤 Kimdan: ${escapeHtml(info.name)}\n` : "") +
    (info.brideName
      ? `📋 Buyurtma: ${escapeHtml(info.groomName ? `${info.groomName} & ${info.brideName}` : info.brideName)}\n`
      : "") +
    `\n${escapeHtml(info.message)}`,

  postEditNoOrder: `🤔 Tahrirlash uchun buyurtma topilmadi. Yangi buyurtma uchun /start bosing.`,

  // Admin'ga: mijoz to'lovdan keyin ma'lumotni o'zgartirdi.
  adminEdited: (info: { label: string; brideName?: string; groomName?: string; link?: string }) =>
    `⚠️ <b>Mijoz ma'lumotni o'zgartirdi</b>\n\n` +
    `👤 ${escapeHtml(info.groomName ? `${info.groomName} & ${info.brideName}` : info.brideName)}\n` +
    `✏️ O'zgargan: <b>${escapeHtml(info.label)}</b>\n` +
    (info.link ? `\n👁 Yangilangan taklifnoma: ${escapeHtml(info.link)}` : ""),

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
    `\n🎨 Shablon: ${escapeHtml(session.templateSlug || "tanlanmagan")}\n` +
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

  // Rasm turi: to'yxona yoki kelin-kuyov + o'tkazib yuborish.
  photoChoice: {
    inline_keyboard: [
      [
        { text: "🏛 To'yxona rasmi", callback_data: "photo_venue" },
        { text: "💑 Kelin-kuyov rasmi", callback_data: "photo_couple" },
      ],
      [{ text: "⏭ O'tkazib yuborish", callback_data: "skip_photo" }],
    ],
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

  // To'lovdan oldingi preview: tasdiqlash / tahrirlash / musiqa.
  previewConfirm: {
    inline_keyboard: [
      [{ text: "✅ Hammasi to'g'ri — to'lovga o'tish", callback_data: "confirm_pay" }],
      [{ text: "✏️ Ma'lumotni tahrirlash", callback_data: "edit_menu" }],
      [{ text: "🎵 Musiqani o'zgartirish", callback_data: "editf_music" }],
    ],
  },

  // Qaysi maydonni tahrirlash — tadbir turi/paketga qarab dinamik.
  editMenu: (opts: { isWedding: boolean; isPremium: boolean }) => ({
    inline_keyboard: [
      ...(opts.isWedding
        ? [[
            { text: "👨 Kuyov ismi", callback_data: "editf_groom" },
            { text: "👰 Kelin ismi", callback_data: "editf_bride" },
          ]]
        : [[{ text: "👰 Ism", callback_data: "editf_bride" }]]),
      [
        { text: "📅 Sana", callback_data: "editf_date" },
        { text: "⏰ Soat", callback_data: "editf_time" },
      ],
      [
        { text: "🏛 To'yxona", callback_data: "editf_venue_name" },
        { text: "📍 Manzil", callback_data: "editf_venue_address" },
      ],
      [
        { text: "🗺 Yandex", callback_data: "editf_yandex" },
        { text: "🗺 Google", callback_data: "editf_google" },
      ],
      [
        { text: "📷 Rasm", callback_data: "editf_photo" },
        { text: "🎵 Musiqa", callback_data: "editf_music" },
      ],
      [
        { text: "💳 Karta", callback_data: "editf_card" },
        ...(opts.isPremium
          ? [{ text: "📝 Izoh", callback_data: "editf_notes" }]
          : []),
      ],
      [{ text: "⬅️ Orqaga", callback_data: "edit_back" }],
    ],
  }),

  // To'lovdan keyin (done xabari) — link kelguncha tuzatish tugmasi.
  postPaidEdit: {
    inline_keyboard: [
      [{ text: "✏️ Ma'lumotni tuzatish", callback_data: "post_edit" }],
    ],
  },

  // Bitta maydon tahrirlangach — yana tuzatish yoki tugatish.
  postPaidEditMore: {
    inline_keyboard: [
      [{ text: "✏️ Yana tuzatish", callback_data: "post_edit" }],
      [{ text: "✅ Tugatdim", callback_data: "post_edit_done" }],
    ],
  },

  // Taklifnoma yetkazilgach — fikr-taklif qoldirish tugmasi. `orderId` fikrni
  // buyurtmaga biriktirish uchun callback ichida yuboriladi.
  feedback: (orderId: string) => ({
    inline_keyboard: [
      [{ text: "💬 Fikr va taklif qoldirish", callback_data: `feedback_${orderId}` }],
    ],
  }),
};
