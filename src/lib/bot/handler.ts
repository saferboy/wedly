import { Telegraf } from "telegraf";
import type { Context } from "telegraf";
import type { Update } from "telegraf/types";
import type { Order, Template } from "@prisma/client";
import { MSG, KEYBOARDS } from "./messages";
import type { BotSession } from "./types";
import { defaultSession } from "./types";
import { eventTypeLabel } from "../eventType";
import { getTemplate } from "@/lib/templates";

interface SessionContext extends Context<Update> {
  session: BotSession;
}

// In-memory session store (keyinchalik Redis ga o'tkaziladi)
const sessions = new Map<number, BotSession>();

export function createBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN env yo'q");

  const bot = new Telegraf<SessionContext>(token);

  // Session middleware
  bot.use((ctx, next) => {
    const chatId = ctx.chat?.id;
    if (chatId) {
      if (!sessions.has(chatId)) sessions.set(chatId, defaultSession());
      ctx.session = sessions.get(chatId)!;
    }
    return next();
  });

  // /start komandasi
  bot.start(async (ctx) => {
    const chatId = ctx.chat?.id;
    const startParam = ctx.startPayload; // template_nikoh-classic

    if (chatId) {
      const s = defaultSession();
      if (startParam?.startsWith("template_")) {
        s.templateSlug = startParam.replace("template_", "");
      }
      sessions.set(chatId, s);
      ctx.session = s;
    }

    // Saytdagi wizard'dan kelgan buyurtma — to'lovga o'tamiz.
    if (startParam?.startsWith("order_")) {
      const ok = await startWebOrder(ctx, startParam.replace("order_", ""));
      if (ok) return;
    }

    await ctx.replyWithMarkdown(MSG.welcome);

    // Saytda template tanlangan bo'lsa — tadbir turini shundan aniqlab,
    // "tur" savolini o'tkazib yuboramiz va to'g'ridan-to'g'ri ismga o'tamiz.
    const preset = ctx.session.templateSlug
      ? getTemplate(ctx.session.templateSlug)
      : undefined;
    if (preset) {
      ctx.session.eventType = preset.eventType;
      await ctx.replyWithMarkdown(
        `✨ *${preset.name}* dizayni tanlandi — bu *${eventTypeLabel(preset.eventType)}* uchun.`
      );
      if (preset.eventType === "WEDDING") {
        ctx.session.step = "groom_name";
        await ctx.replyWithMarkdown(MSG.groomName);
      } else {
        ctx.session.step = "bride_name";
        await ctx.replyWithMarkdown(MSG.brideName(false));
      }
      return;
    }

    await ctx.replyWithMarkdown(MSG.chooseEventType, {
      reply_markup: KEYBOARDS.eventType,
    });
    ctx.session.step = "event_type";
  });

  // /skip komandasi
  bot.command("skip", async (ctx) => {
    await handleSkip(ctx);
  });

  // /restart komandasi
  bot.command("restart", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (chatId) sessions.set(chatId, defaultSession());
    await ctx.reply("♻️ Qaytadan boshlandi. /start bosing.");
  });

  // /tahrir komandasi — to'lovdan keyin, link kelguncha ma'lumotni tuzatish.
  bot.command("tahrir", async (ctx) => {
    await startPostPaidEdit(ctx);
  });

  // /fikr komandasi — istalgan vaqtda fikr-taklif qoldirish.
  bot.command("fikr", async (ctx) => {
    await startFeedback(ctx);
  });

  // Callback query handler (inline tugmalar)
  bot.on("callback_query", async (ctx) => {
    const data = (ctx.callbackQuery as { data?: string }).data;
    if (!data) return;
    await ctx.answerCbQuery();

    const s = ctx.session;

    // Admin: to'lovni tasdiqlab, taklifnomani yaratib, mijozga link yuborish
    // (admin panelidagi "To'lovni tasdiqlash va link yuborish" bilan bir xil).
    if (data.startsWith("approve_")) {
      await handleAdminApprove(ctx, data.replace("approve_", ""));
      return;
    }

    // Mijoz taklifnomani olgach "Fikr qoldirish" tugmasini bosdi — fikr
    // yozish rejimiga o'tamiz (matn keyingi xabarda keladi).
    if (data.startsWith("feedback_")) {
      s.feedbackOrderId = data.replace("feedback_", "") || undefined;
      s.step = "feedback";
      await ctx.replyWithMarkdown(MSG.feedbackPrompt);
      return;
    }

    // ── To'lovdan oldingi preview: tasdiqlash / tahrirlash ──
    if (data === "confirm_pay") {
      await ctx.replyWithMarkdown(MSG.paymentInfo("79 000 so'm"));
      s.step = "payment_screenshot";
      return;
    }

    if (data === "edit_menu") {
      await ctx.replyWithMarkdown(MSG.editWhat, {
        reply_markup: KEYBOARDS.editMenu({
          isWedding: s.eventType === "WEDDING",
          isPremium: isPremiumTemplate(s),
        }),
      });
      return;
    }

    if (data === "edit_back") {
      // To'lovdan keyingi rejimda preview yo'q — done holatiga qaytamiz.
      if (s.postPaid) {
        await ctx.replyWithMarkdown(MSG.done, {
          reply_markup: KEYBOARDS.postPaidEdit,
        });
        s.editing = false;
        s.step = "done";
        return;
      }
      await sendPreviewAndConfirm(ctx);
      return;
    }

    // ── To'lovdan keyingi tahrirlash ──
    if (data === "post_edit") {
      await startPostPaidEdit(ctx);
      return;
    }

    if (data === "post_edit_done") {
      s.postPaid = false;
      s.editing = false;
      await ctx.replyWithMarkdown(
        "✅ Tayyor! Taklifnoma linkini tez orada yuboramiz. 💛"
      );
      return;
    }

    if (data.startsWith("editf_")) {
      await startFieldEdit(ctx, data.replace("editf_", ""));
      return;
    }

    // Event type
    if (data.startsWith("event_")) {
      s.eventType = data.replace("event_", "") as
        | "WEDDING"
        | "BACHELORETTE"
        | "BIRTHDAY";
      s.step = s.eventType === "WEDDING" ? "groom_name" : "bride_name";
      const msg =
        s.eventType === "WEDDING" ? MSG.groomName : MSG.brideName(false);
      await ctx.replyWithMarkdown(msg);
      return;
    }

    // Rasm turi tanlash — tur belgilanadi, keyin rasm yuklanadi (step "photo").
    if (data === "photo_venue" || data === "photo_couple") {
      s.photoType = data === "photo_venue" ? "venue" : "couple";
      await ctx.replyWithMarkdown(MSG.photoUpload(s.photoType));
      return;
    }

    // Skip photo
    if (data === "skip_photo") {
      if (await maybeFinishEdit(ctx)) return;
      s.step = "music_choice";
      await ctx.replyWithMarkdown(MSG.musicChoice, {
        reply_markup: KEYBOARDS.musicChoice,
      });
      return;
    }

    // Music choice
    if (data === "music_library") {
      s.musicChoice = "library";
      s.step = "music_library";
      // Haqiqiy kutubxona — admin panelidan qo'shilgan musiqalar DB dan keladi.
      const { db } = await import("@/lib/db");
      const tracks = await db.musicTrack.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, artist: true },
        take: 30,
      });
      if (tracks.length === 0) {
        // Kutubxona bo'sh — mijozga o'z musiqasini yuklashni taklif qilamiz.
        await ctx.replyWithMarkdown(
          "🎵 Hozircha kutubxonada tayyor musiqa yo'q. O'z musiqangizni yuklashingiz mumkin.",
          { reply_markup: KEYBOARDS.musicChoice }
        );
        return;
      }
      await ctx.replyWithMarkdown(MSG.musicLibrary, {
        reply_markup: KEYBOARDS.musicLibrary(
          tracks.map((t) => ({ id: t.id, title: t.title, artist: t.artist ?? undefined }))
        ),
      });
      return;
    }

    if (data === "music_custom") {
      s.musicChoice = "custom";
      s.step = "music_file";
      await ctx.replyWithMarkdown(MSG.musicFile);
      return;
    }

    if (data === "music_none") {
      s.musicChoice = "none";
      s.musicTrackId = undefined;
      s.customMusicUrl = undefined;
      if (await maybeFinishEdit(ctx)) return;
      s.step = "card_number";
      await ctx.replyWithMarkdown(MSG.cardNumber, {
        reply_markup: KEYBOARDS.cardChoice,
      });
      return;
    }

    // Music library track tanlash
    if (data.startsWith("track_")) {
      s.musicChoice = "library";
      s.musicTrackId = data.replace("track_", "");
      s.customMusicUrl = undefined;
      await ctx.reply("✅ Musiqa tanlandi!");
      if (await maybeFinishEdit(ctx)) return;
      s.step = "card_number";
      await ctx.replyWithMarkdown(MSG.cardNumber, {
        reply_markup: KEYBOARDS.cardChoice,
      });
      return;
    }

    // Karta
    if (data === "card_yes") {
      s.step = "card_number";
      await ctx.replyWithMarkdown(MSG.cardNumberInput);
      return;
    }

    if (data === "card_no") {
      if (s.editing) {
        s.editing = false;
        s.cardNumber = undefined;
        s.cardHolder = undefined;
        await finishEdit(ctx);
        return;
      }
      await askNotesOrFinish(ctx);
      return;
    }
  });

  // Rasm qabul qilish (to'yxona rasmi yoki to'lov screenshoti — bosqichga qarab)
  bot.on("photo", async (ctx) => {
    const s = ctx.session;

    if (s.step === "photo") {
      const photos = ctx.message.photo;
      const largest = photos[photos.length - 1];
      s.photoFileId = largest.file_id;
      s.photoUrl = undefined; // yangi rasm — preview uchun qayta yuklanadi
      await ctx.reply("✅ Rasm qabul qilindi!");
      if (await maybeFinishEdit(ctx)) return;
      s.step = "music_choice";
      await ctx.replyWithMarkdown(MSG.musicChoice, {
        reply_markup: KEYBOARDS.musicChoice,
      });
      return;
    }

    if (s.step === "payment_screenshot") {
      const photos = ctx.message.photo;
      s.paymentScreenshotFileId = photos[photos.length - 1].file_id;
      s.step = "done";

      // Avval buyurtmani DB ga saqlaymiz (id kerak), so'ng admin'ga
      // tasdiqlash tugmasi bilan xabar yuboramiz.
      const orderId = await savePaidOrder(ctx, s);
      await notifyAdmin(ctx, s, orderId);

      // Taklifnoma admin tomonidan tayyorlanadi va link 24 soat ichida yuboriladi.
      // Sessiyani o'chirmaymiz — link kelguncha mijoz /tahrir yoki tugma orqali
      // ma'lumotni tuzatishi mumkin (tahrir DB'dan ham tiklanadi).
      await ctx.replyWithMarkdown(MSG.done, {
        reply_markup: KEYBOARDS.postPaidEdit,
      });
    }
  });

  // Audio/document qabul qilish
  bot.on("audio", async (ctx) => {
    if (ctx.session.step !== "music_file") return;
    ctx.session.musicFileId = ctx.message.audio.file_id;
    ctx.session.musicChoice = "custom";
    ctx.session.customMusicUrl = undefined; // yangi fayl — qayta yuklanadi
    await ctx.reply("✅ Musiqa qabul qilindi!");
    if (await maybeFinishEdit(ctx)) return;
    ctx.session.step = "card_number";
    await ctx.replyWithMarkdown(MSG.cardNumber, {
      reply_markup: KEYBOARDS.cardChoice,
    });
  });

  // Matn xabarlar
  bot.on("text", async (ctx) => {
    const text = ctx.message.text.trim();
    const s = ctx.session;

    if (text.startsWith("/")) return; // komanda — skip

    switch (s.step) {
      case "groom_name":
        // Faqat ism yetarli — familiya shart emas.
        if (!text) {
          await ctx.replyWithMarkdown(MSG.groomName);
          return;
        }
        s.groomName = text;
        if (await maybeFinishEdit(ctx)) return;
        s.step = "bride_name";
        await ctx.replyWithMarkdown(MSG.brideName(true));
        break;

      case "bride_name":
        if (!text) {
          await ctx.replyWithMarkdown(MSG.brideName(s.eventType === "WEDDING"));
          return;
        }
        s.brideName = text;
        if (await maybeFinishEdit(ctx)) return;
        s.step = "event_date";
        await ctx.replyWithMarkdown(MSG.eventDate);
        break;

      case "event_date": {
        const dateErr = validateEventDate(text);
        if (dateErr) {
          await ctx.reply(dateErr);
          return;
        }
        s.eventDate = text;
        if (await maybeFinishEdit(ctx)) return;
        s.step = "event_time";
        await ctx.replyWithMarkdown(MSG.eventTime);
        break;
      }

      case "event_time": {
        const timeErr = validateEventTime(text, s.eventDate);
        if (timeErr) {
          await ctx.reply(timeErr);
          return;
        }
        s.eventTime = text;
        if (await maybeFinishEdit(ctx)) return;
        s.step = "venue_name";
        await ctx.replyWithMarkdown(MSG.venueName);
        break;
      }

      case "venue_name":
        s.venueName = text;
        if (await maybeFinishEdit(ctx)) return;
        s.step = "venue_address";
        await ctx.replyWithMarkdown(MSG.venueAddress);
        break;

      case "venue_address":
        s.venueAddress = text;
        if (await maybeFinishEdit(ctx)) return;
        s.step = "yandex_link";
        await ctx.replyWithMarkdown(MSG.yandexLink);
        break;

      case "yandex_link":
        s.yandexLink = text;
        if (await maybeFinishEdit(ctx)) return;
        s.step = "google_link";
        await ctx.replyWithMarkdown(MSG.googleLink);
        break;

      case "google_link":
        s.googleLink = text;
        if (await maybeFinishEdit(ctx)) return;
        s.step = "photo";
        await ctx.replyWithMarkdown(MSG.photo, {
          reply_markup: KEYBOARDS.photoChoice,
        });
        break;

      case "card_number":
        s.cardNumber = text;
        s.step = "card_holder";
        await ctx.replyWithMarkdown(MSG.cardHolder);
        break;

      case "card_holder":
        s.cardHolder = text.toUpperCase();
        if (await maybeFinishEdit(ctx)) return;
        await askNotesOrFinish(ctx);
        break;

      case "notes":
        s.notes = text;
        s.editing = false;
        await finishEdit(ctx);
        break;

      case "feedback":
        await handleFeedbackText(ctx, text);
        break;

      case "preview":
        await ctx.reply("👆 Iltimos, yuqoridagi tugmalardan birini tanlang.");
        break;

      case "done":
        // Buyurtma qabul qilingan — matn kelsa oqimni qaytadan boshlamaymiz,
        // tuzatish uchun tugma/buyruqqa yo'naltiramiz.
        await ctx.replyWithMarkdown(
          "✅ Buyurtmangiz qabul qilingan. Xatoni tuzatish uchun /tahrir bosing yoki quyidagi tugmadan foydalaning.",
          { reply_markup: KEYBOARDS.postPaidEdit }
        );
        break;

      case "payment_screenshot":
        // Matn screenshot o'rniga keldi
        await ctx.reply(
          "📷 Iltimos, to'lov chekini *rasm sifatida* yuboring.",
          { parse_mode: "Markdown" }
        );
        break;

      default:
        // Sessiya boshlang'ich holatda (masalan tadbir tanlanmagan yoki
        // avvalgi buyurtma tugagan) — "dead-end" o'rniga oqimni muloyim
        // tiklaymiz: to'g'ridan-to'g'ri tadbir turini tanlashni so'raymiz.
        await ctx.replyWithMarkdown(MSG.chooseEventType, {
          reply_markup: KEYBOARDS.eventType,
        });
        s.step = "event_type";
    }
  });

  return bot;
}

// Yordamchi funksiyalar

/** Tanlangan dizayn "premium" paketga tegishlimi. Tilaklar/izoh qadami faqat
 *  premium paket uchun ko'rsatiladi (oddiy paketda o'tkazib yuboriladi). */
function isPremiumTemplate(s: BotSession): boolean {
  return s.templateSlug
    ? getTemplate(s.templateSlug)?.packageSlug === "premium"
    : false;
}

/** Karta bosqichidan keyin: premium dizayn bo'lsa mijozdan tilaklar/izoh
 *  so'raymiz, aks holda to'g'ridan-to'g'ri xulosa va to'lovga o'tamiz. */
async function askNotesOrFinish(ctx: SessionContext) {
  if (isPremiumTemplate(ctx.session)) {
    ctx.session.step = "notes";
    await ctx.replyWithMarkdown(MSG.notes);
  } else {
    await sendPreviewAndConfirm(ctx);
  }
}

async function handleSkip(ctx: SessionContext) {
  const s = ctx.session;

  switch (s.step) {
    case "yandex_link":
      s.yandexLink = undefined;
      if (await maybeFinishEdit(ctx)) return;
      s.step = "google_link";
      await ctx.replyWithMarkdown(MSG.googleLink);
      break;

    case "google_link":
      s.googleLink = undefined;
      if (await maybeFinishEdit(ctx)) return;
      s.step = "photo";
      await ctx.replyWithMarkdown(MSG.photo, {
        reply_markup: KEYBOARDS.photoChoice,
      });
      break;

    case "notes":
      s.notes = undefined;
      s.editing = false;
      await finishEdit(ctx);
      break;

    default:
      await ctx.reply("Bu qadamni o'tkazib bo'lmaydi.");
  }
}

/** Tahrirlash rejimida bo'lsa: bayroqni tozalab, tegishli xulosaga qaytadi.
 *  `true` qaytarsa — chaqiruvchi keyingi (oddiy oqim) qadamni bajarmasligi kerak.
 *  To'lovdan keyingi (postPaid) rejimda preview/to'lov o'rniga order+taklifnomani
 *  darrov yangilaydi. */
async function maybeFinishEdit(ctx: SessionContext): Promise<boolean> {
  if (!ctx.session.editing) return false;
  ctx.session.editing = false;
  await finishEdit(ctx);
  return true;
}

/** Tahrir yakuni: to'lovdan keyingi rejimда order+taklifnomani yangilaydi,
 *  aks holда to'lovdan oldingi preview'ga qaytaradi. `editing` bayrog'ini
 *  o'zi tozalab qo'ygan chaqiruvchilar uchun ham ishlaydi. */
async function finishEdit(ctx: SessionContext) {
  if (ctx.session.postPaid) {
    await finishPostPaidEdit(ctx);
  } else {
    await sendPreviewAndConfirm(ctx);
  }
}

// Tahrirlanadigan maydonlarning ko'rinadigan nomlari (admin xabari uchun).
const FIELD_LABELS: Record<string, string> = {
  groom: "Kuyov ismi",
  bride: "Ism",
  date: "Sana",
  time: "Soat",
  venue_name: "To'yxona",
  venue_address: "Manzil",
  yandex: "Yandex xarita",
  google: "Google xarita",
  photo: "Rasm",
  music: "Musiqa",
  card: "Karta",
  notes: "Izoh",
};

/** Preview menyusidan bitta maydonni tahrirlashni boshlaydi. */
async function startFieldEdit(ctx: SessionContext, field: string) {
  const s = ctx.session;
  s.editing = true;
  s.lastEditedLabel = FIELD_LABELS[field] ?? "Ma'lumot";

  switch (field) {
    case "groom":
      s.step = "groom_name";
      await ctx.replyWithMarkdown(MSG.groomName);
      break;
    case "bride":
      s.step = "bride_name";
      await ctx.replyWithMarkdown(MSG.brideName(s.eventType === "WEDDING"));
      break;
    case "date":
      s.step = "event_date";
      await ctx.replyWithMarkdown(MSG.eventDate);
      break;
    case "time":
      s.step = "event_time";
      await ctx.replyWithMarkdown(MSG.eventTime);
      break;
    case "venue_name":
      s.step = "venue_name";
      await ctx.replyWithMarkdown(MSG.venueName);
      break;
    case "venue_address":
      s.step = "venue_address";
      await ctx.replyWithMarkdown(MSG.venueAddress);
      break;
    case "yandex":
      s.step = "yandex_link";
      await ctx.replyWithMarkdown(MSG.yandexLink);
      break;
    case "google":
      s.step = "google_link";
      await ctx.replyWithMarkdown(MSG.googleLink);
      break;
    case "photo":
      s.step = "photo";
      await ctx.replyWithMarkdown(MSG.photo, {
        reply_markup: KEYBOARDS.photoChoice,
      });
      break;
    case "music":
      s.step = "music_choice";
      await ctx.replyWithMarkdown(MSG.musicChoice, {
        reply_markup: KEYBOARDS.musicChoice,
      });
      break;
    case "card":
      s.step = "card_number";
      await ctx.replyWithMarkdown(MSG.cardNumber, {
        reply_markup: KEYBOARDS.cardChoice,
      });
      break;
    case "notes":
      s.step = "notes";
      await ctx.replyWithMarkdown(MSG.notes);
      break;
    default:
      s.editing = false;
      await sendPreviewAndConfirm(ctx);
  }
}

/**
 * Funnel oxiri: draft buyurtmani saqlab (rasm/musiqa ham yuklanadi), mijozga
 * to'lovdan oldingi PREVIEW havolasini va tasdiqlash/tahrirlash tugmalarini
 * yuboradi. Dizayn tanlanmagan bo'lsa — eski xatti-harakat: to'g'ridan to'lov.
 */
async function sendPreviewAndConfirm(ctx: SessionContext) {
  const s = ctx.session;
  s.editing = false;

  const canPreview = await persistDraftOrder(ctx, s);

  // Xulosa
  const summary =
    `📋 *Buyurtma xulosasi:*\n\n` +
    `📌 Tur: ${eventTypeLabel(s.eventType ?? "")}\n` +
    (s.groomName ? `👨 Kuyov: ${s.groomName}\n` : "") +
    `👰 Kelin: ${s.brideName}\n` +
    `📅 Sana: ${s.eventDate} soat ${s.eventTime}\n` +
    `🏛 To'yxona: ${s.venueName}\n` +
    `📍 Manzil: ${s.venueAddress}\n` +
    `🎵 Musiqa: ${s.musicChoice === "library" ? "Kutubxonadan" : s.musicChoice === "custom" ? "O'z musiqam" : "Yo'q"}\n` +
    (s.cardNumber ? `💳 Karta: ${s.cardNumber}\n` : "") +
    (s.notes ? `📝 Izoh: ${s.notes}\n` : "");

  await ctx.replyWithMarkdown(summary);

  if (canPreview && s.orderId) {
    const { previewUrl } = await import("@/lib/invitation/preview");
    await ctx.replyWithMarkdown(MSG.previewReady(previewUrl(s.orderId)), {
      reply_markup: KEYBOARDS.previewConfirm,
    });
    s.step = "preview";
    return;
  }

  // Dizayn tanlanmagan (preview yasab bo'lmaydi) — to'g'ridan-to'g'ri to'lov.
  await ctx.replyWithMarkdown(MSG.paymentInfo("79 000 so'm"));
  s.step = "payment_screenshot";
}

/**
 * Sessiya ma'lumotidan draft `Order` (status PENDING) yaratadi yoki yangilaydi.
 * Har tahrirdan keyin chaqiriladi — shu bois preview doim eng so'nggi
 * ma'lumotni ko'rsatadi. Rasm va custom musiqa storage'ga shu yerda yuklanadi
 * (keshlangan: bir xil fayl qayta yuklanmaydi).
 * Preview yasash mumkin bo'lsa (dizayn biriktirilgan) `true` qaytaradi.
 */
async function persistDraftOrder(ctx: SessionContext, s: BotSession): Promise<boolean> {
  try {
    const { db } = await import("@/lib/db");

    // Rasm — bir marta yuklab, URL'ni keshlaymiz.
    if (s.photoFileId && !s.photoUrl) {
      s.photoUrl = (await uploadTelegramPhoto(ctx, s.photoFileId)) ?? undefined;
    }
    // Custom musiqa — bir marta yuklab, URL'ni keshlaymiz.
    if (s.musicChoice === "custom" && s.musicFileId && !s.customMusicUrl) {
      s.customMusicUrl = (await uploadTelegramMusic(ctx, s.musicFileId)) ?? undefined;
    }

    const templateId = s.templateSlug
      ? (await db.template.findUnique({
          where: { slug: s.templateSlug },
          select: { id: true },
        }))?.id ?? null
      : null;

    const musicChoice =
      s.musicChoice === "library"
        ? `library:${s.musicTrackId}`
        : s.musicChoice ?? "none";

    const data = {
      eventType: s.eventType!,
      groomName: s.groomName ?? null,
      brideName: s.brideName!,
      eventDate: s.eventDate ? parseDate(s.eventDate) : null,
      eventTime: s.eventTime ?? null,
      venueName: s.venueName ?? null,
      venueAddress: s.venueAddress ?? null,
      yandexLink: s.yandexLink ?? null,
      googleLink: s.googleLink ?? null,
      photoUrl: s.photoUrl ?? null,
      photoType: s.photoType ?? "couple",
      musicChoice,
      customMusicUrl: s.customMusicUrl ?? null,
      cardNumber: s.cardNumber ?? null,
      cardHolder: s.cardHolder ?? null,
      notes: s.notes ?? null,
      templateId,
    };

    if (s.orderId) {
      await db.order.update({ where: { id: s.orderId }, data });
    } else {
      const created = await db.order.create({
        data: {
          ...data,
          telegramChatId: String(ctx.chat?.id),
          telegramUserId: ctx.from?.id ? String(ctx.from.id) : undefined,
          telegramUsername: ctx.from?.username,
          source: "telegram",
          status: "PENDING",
        },
      });
      s.orderId = created.id;
    }

    return Boolean(templateId);
  } catch (e) {
    console.error("Draft buyurtmani saqlash xatosi:", e);
    return false;
  }
}

async function notifyAdmin(
  ctx: SessionContext,
  s: BotSession,
  orderId?: string | null
) {
  const adminChatId = Number(process.env.TELEGRAM_ADMIN_CHAT_ID);
  if (!adminChatId) return;

  const msg = MSG.adminNotification({
    eventType: s.eventType,
    groomName: s.groomName,
    brideName: s.brideName,
    eventDate: s.eventDate,
    eventTime: s.eventTime,
    venueName: s.venueName,
    venueAddress: s.venueAddress,
    yandexLink: s.yandexLink,
    googleLink: s.googleLink,
    cardNumber: s.cardNumber,
    cardHolder: s.cardHolder,
    notes: s.notes,
    templateSlug: s.templateSlug,
    musicChoice: s.musicChoice,
  });

  // Real vaqtda avtomatik yaratilgan taklifnoma holatini ko'rsatamiz.
  let statusLine = "";
  let replyMarkup: { inline_keyboard: { text: string; callback_data: string }[][] } | undefined;

  if (orderId) {
    try {
      const { db } = await import("@/lib/db");
      const { invitationUrl } = await import("@/lib/invitation/generate");
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { invitation: true },
      });
      if (order?.invitation) {
        statusLine = `\n✅ <b>Taklifnoma avtomatik tayyorlandi.</b>\n👁 Ko'rish: ${invitationUrl(order.invitation.slug)}`;
      } else {
        statusLine = `\n⚠️ <b>Taklifnoma yaratilmadi</b> — dizayn tanlanmagan bo'lishi mumkin. Admin panelidan tekshiring.`;
      }
    } catch {
      /* status ko'rsatilmasa ham buyurtma xabari yuboriladi */
    }

    replyMarkup = {
      inline_keyboard: [
        [
          {
            text: "✅ To'lovni tasdiqlab, link yuborish",
            callback_data: `approve_${orderId}`,
          },
        ],
      ],
    };
  }

  await ctx.telegram.sendMessage(adminChatId, msg + statusLine, {
    parse_mode: "HTML",
    reply_markup: replyMarkup,
  });

  // Screenshot ni ham yuborish
  if (s.paymentScreenshotFileId) {
    await ctx.telegram.sendPhoto(adminChatId, s.paymentScreenshotFileId, {
      caption: `💳 To'lov cheki — ${s.brideName}${s.groomName ? " & " + s.groomName : ""}`,
    });
  }
}

/**
 * Admin inline tugmani bosganда: taklifnomani buyurtma ma'lumotidan avtomatik
 * yaratadi, buyurtmani COMPLETED qiladi va tayyor havolani mijozga yuboradi.
 * (Web admin panelidagi /api/orders/[id]/approve bilan bir xil mantiq.)
 */
async function handleAdminApprove(ctx: SessionContext, orderId: string) {
  // Faqat admin tasdiqlashi mumkin.
  const adminChatId = String(process.env.TELEGRAM_ADMIN_CHAT_ID ?? "");
  if (adminChatId && String(ctx.chat?.id) !== adminChatId) {
    await ctx.reply("⛔️ Bu amal faqat admin uchun.");
    return;
  }

  try {
    const { createInvitationFromOrder, invitationUrl } = await import(
      "@/lib/invitation/generate"
    );
    const { db } = await import("@/lib/db");

    const result = await createInvitationFromOrder(orderId);
    await db.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });

    const order = await db.order.findUnique({ where: { id: orderId } });
    const link = invitationUrl(result.slug);

    let sent = false;
    if (order?.telegramChatId) {
      await ctx.telegram.sendMessage(
        order.telegramChatId,
        `🎉 <b>Taklifnomangiz tayyor!</b>\n\n${link}\n\nHavolani mehmonlaringizga ulashing. Wedly'dan foydalanganingiz uchun rahmat! 💛`,
        { parse_mode: "HTML", reply_markup: KEYBOARDS.feedback(orderId) }
      );
      sent = true;
    }

    // Tugmani olib tashlaymiz (qayta bosilmasin).
    await ctx.editMessageReplyMarkup(undefined).catch(() => {});
    await ctx.reply(
      `✅ Tasdiqlandi.\n${sent ? "Havola mijozga yuborildi:" : "Havola tayyor (mijoz Telegram'i yo'q):"}\n${link}`
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "noma'lum xatolik";
    await ctx.reply(`✗ Xatolik: ${message}`);
  }
}

/**
 * To'lov kelgach buyurtmani DB ga saqlaydi (yoki saytdan kelgan bo'lsa yangilaydi)
 * va PAID holatiga o'tkazadi. Mijoz yuborgan rasmni ham Storage'ga yuklaydi.
 * Taklifnomaning o'zi admin tomonidan tayyorlanadi va linki 24 soat ichida yuboriladi.
 */
async function savePaidOrder(ctx: SessionContext, s: BotSession): Promise<string | null> {
  try {
    const { db } = await import("@/lib/db");

    // Mijoz yuborgan rasmlarni (bo'lsa) Storage'ga yuklaymiz — best-effort.
    // Draft (preview) bosqichida allaqachon yuklangan bo'lsa keshdan olamiz.
    let photoUrl: string | null = s.photoUrl ?? null;
    if (!photoUrl && s.photoFileId) photoUrl = await uploadTelegramPhoto(ctx, s.photoFileId);

    // To'lov chekini ham saqlaymiz — admin panelida ko'rinishi uchun.
    let paymentScreenshotUrl: string | null = null;
    if (s.paymentScreenshotFileId)
      paymentScreenshotUrl = await uploadTelegramPhoto(ctx, s.paymentScreenshotFileId);

    // Saytdan kelgan buyurtma bo'lsa — mavjud yozuvni PAID ga o'tkazamiz.
    if (s.orderId) {
      await db.order.update({
        where: { id: s.orderId },
        data: {
          status: "PAID",
          telegramChatId: String(ctx.chat?.id),
          telegramUserId: ctx.from?.id ? String(ctx.from.id) : undefined,
          telegramUsername: ctx.from?.username,
          ...(photoUrl ? { photoUrl } : {}),
          ...(s.photoType ? { photoType: s.photoType } : {}),
          ...(paymentScreenshotUrl ? { paymentScreenshotUrl } : {}),
        },
      });
      // Taklifnomani darrov, real vaqtda avtomatik yaratamiz.
      await autoGenerateInvitation(s.orderId);
      return s.orderId;
    }

    const templateId = s.templateSlug
      ? (await db.template.findUnique({ where: { slug: s.templateSlug } }))?.id
      : undefined;

    const created = await db.order.create({
      data: {
        telegramChatId: String(ctx.chat?.id),
        telegramUserId: ctx.from?.id ? String(ctx.from.id) : undefined,
        telegramUsername: ctx.from?.username,
        eventType: s.eventType!,
        groomName: s.groomName,
        brideName: s.brideName!,
        eventDate: s.eventDate ? parseDate(s.eventDate) : undefined,
        eventTime: s.eventTime,
        venueName: s.venueName,
        venueAddress: s.venueAddress,
        yandexLink: s.yandexLink,
        googleLink: s.googleLink,
        photoUrl,
        photoType: s.photoType ?? "couple",
        musicChoice:
          s.musicChoice === "library" ? `library:${s.musicTrackId}` : s.musicChoice ?? "none",
        cardNumber: s.cardNumber,
        cardHolder: s.cardHolder,
        notes: s.notes,
        templateId,
        paymentScreenshotUrl,
        status: "PAID",
      },
    });
    // Taklifnomani darrov, real vaqtda avtomatik yaratamiz.
    await autoGenerateInvitation(created.id);
    return created.id;
  } catch (e) {
    console.error("Buyurtmani saqlash xatosi:", e);
    return null;
  }
}

/**
 * Buyurtma ma'lumotidan taklifnomani DARHOL avtomatik yaratadi (idempotent).
 * Xatolik (masalan dizayn tanlanmagan) buyurtma saqlanishini to'xtatmaydi —
 * admin keyinroq panelдан to'g'rilashi mumkin.
 */
async function autoGenerateInvitation(orderId: string): Promise<void> {
  try {
    const { createInvitationFromOrder } = await import("@/lib/invitation/generate");
    await createInvitationFromOrder(orderId);
  } catch (e) {
    console.error(
      "Avtomatik generatsiya bajarilmadi:",
      e instanceof Error ? e.message : e
    );
  }
}

/**
 * Telegram rasmini Supabase Storage'ga yuklab, ochiq URL qaytaradi.
 * Har qanday xatolikda `null` qaytaradi — bu taklifnoma yaratishni to'xtatmaydi
 * (template o'zining zaxira rasmini ko'rsatadi).
 */
async function uploadTelegramPhoto(ctx: SessionContext, fileId: string): Promise<string | null> {
  try {
    const fileLink = await ctx.telegram.getFileLink(fileId);
    const res = await fetch(fileLink.toString());
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());

    const { saveFile, STORAGE_BUCKETS } = await import("../storage");
    const objectPath = `telegram/${fileId}.jpg`;
    return await saveFile(STORAGE_BUCKETS.photos, objectPath, buffer);
  } catch (e) {
    console.error("Rasm yuklash xatosi:", e);
    return null;
  }
}

/**
 * Mijoz yuborgan audio (custom musiqa) faylini Storage'ga yuklab, ochiq URL
 * qaytaradi. Xatolikda `null` — bu preview/taklifnomani to'xtatmaydi.
 */
async function uploadTelegramMusic(ctx: SessionContext, fileId: string): Promise<string | null> {
  try {
    const fileLink = await ctx.telegram.getFileLink(fileId);
    const res = await fetch(fileLink.toString());
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());

    const { saveFile, STORAGE_BUCKETS } = await import("../storage");
    const objectPath = `telegram/${fileId}.mp3`;
    return await saveFile(STORAGE_BUCKETS.music, objectPath, buffer);
  } catch (e) {
    console.error("Musiqa yuklash xatosi:", e);
    return null;
  }
}

/**
 * Saytdagi `/buyurtma` wizard'i yaratgan buyurtmani Telegram foydalanuvchisiga
 * bog'laydi va to'lov bosqichiga o'tkazadi. Buyurtma topilmasa `false` qaytaradi.
 */
async function startWebOrder(ctx: SessionContext, orderId: string): Promise<boolean> {
  try {
    const { db } = await import("@/lib/db");
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { template: true },
    });
    if (!order) return false;

    // Telegram identifikatorlarini biriktiramiz.
    await db.order.update({
      where: { id: order.id },
      data: {
        telegramChatId: String(ctx.chat?.id),
        telegramUserId: ctx.from?.id ? String(ctx.from.id) : undefined,
        telegramUsername: ctx.from?.username,
      },
    });

    const s = ctx.session;
    hydrateSessionFromOrder(s, order);

    const recap =
      `🎉 *Buyurtmangiz topildi!*\n\n` +
      `📌 Tur: ${eventTypeLabel(order.eventType)}\n` +
      (order.groomName ? `👨 Kuyov: ${order.groomName}\n` : "") +
      `👰 Ism: ${order.brideName}\n` +
      (order.eventDate ? `📅 Sana: ${s.eventDate} soat ${order.eventTime ?? ""}\n` : "") +
      (order.venueName ? `🏛 Manzil: ${order.venueName}\n` : "") +
      `\nEndi to'lovni amalga oshiramiz.`;

    await ctx.replyWithMarkdown(recap);
    await ctx.replyWithMarkdown(MSG.paymentInfo("79 000 so'm"));
    s.step = "payment_screenshot";
    return true;
  } catch (e) {
    console.error("Web buyurtmani ochish xatosi:", e);
    return false;
  }
}

/**
 * To'lovdan keyingi tahrirlashni boshlaydi (tugma yoki /tahrir). Order'ni
 * sessiyadan yoki DB'dan (chat bo'yicha eng so'nggi PAID/PROCESSING) topib,
 * sessiyani to'ldiradi va tahrirlash menyusini ko'rsatadi. Link yuborilgan
 * (COMPLETED) buyurtma uchun tahrirlash yopiq.
 */
async function startPostPaidEdit(ctx: SessionContext) {
  const s = ctx.session;
  const chatId = ctx.chat?.id;

  try {
    const { db } = await import("@/lib/db");

    // Avval sessiyadagi order, aks holda shu chatning so'nggi tahrirlanadigan
    // buyurtmasi (bot restart bo'lsa ham DB'dan tiklaymiz).
    let order = s.orderId
      ? await db.order.findUnique({
          where: { id: s.orderId },
          include: { template: true },
        })
      : null;
    if (!order && chatId) {
      order = await db.order.findFirst({
        where: {
          telegramChatId: String(chatId),
          status: { in: ["PAID", "PROCESSING"] },
        },
        orderBy: { createdAt: "desc" },
        include: { template: true },
      });
    }

    if (!order) {
      // Link allaqachon yuborilgan (COMPLETED) buyurtma bo'lsa — "yopiq" deymiz.
      const completed = chatId
        ? await db.order.findFirst({
            where: { telegramChatId: String(chatId), status: "COMPLETED" },
          })
        : null;
      await ctx.replyWithMarkdown(
        completed ? MSG.postEditClosed : MSG.postEditNoOrder
      );
      return;
    }

    if (order.status === "COMPLETED" || order.status === "CANCELLED") {
      await ctx.replyWithMarkdown(MSG.postEditClosed);
      return;
    }

    hydrateSessionFromOrder(s, order);
    s.postPaid = true;
    s.editing = false;
    s.step = "done";

    await ctx.replyWithMarkdown(MSG.postEditMenu, {
      reply_markup: KEYBOARDS.editMenu({
        isWedding: s.eventType === "WEDDING",
        isPremium: isPremiumTemplate(s),
      }),
    });
  } catch (e) {
    console.error("Tahrirlashni boshlash xatosi:", e);
    await ctx.reply("✗ Xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
  }
}

/**
 * To'lovdan keyingi bitta maydon tahriri yakuni: order'ni yangilaydi,
 * taklifnomani darrov yangilaydi va admin'ni xabardor qiladi. Preview/to'lov
 * qayta so'ralmaydi.
 */
async function finishPostPaidEdit(ctx: SessionContext) {
  const s = ctx.session;
  s.editing = false;
  const label = s.lastEditedLabel ?? "Ma'lumot";

  // 1. Order'ni yangilaymiz (orderId mavjud — update yo'li).
  await persistDraftOrder(ctx, s);

  // 2. Taklifnomani darrov yangilaymiz (slug/havola o'zgarmaydi).
  if (s.orderId) {
    try {
      const { updateInvitationFromOrder } = await import(
        "@/lib/invitation/generate"
      );
      await updateInvitationFromOrder(s.orderId);
    } catch (e) {
      console.error("Taklifnoma yangilash xatosi:", e);
    }
    // 3. Admin'ni xabardor qilamiz.
    await notifyAdminEdited(ctx, s, label);
  }

  s.step = "done";
  await ctx.replyWithMarkdown(MSG.postEditDone(label), {
    reply_markup: KEYBOARDS.postPaidEditMore,
  });
}

/** Admin'ga mijoz to'lovdan keyin ma'lumotni o'zgartirganini xabar qiladi. */
async function notifyAdminEdited(
  ctx: SessionContext,
  s: BotSession,
  label: string
) {
  const adminChatId = Number(process.env.TELEGRAM_ADMIN_CHAT_ID);
  if (!adminChatId) return;

  try {
    let link: string | undefined;
    if (s.orderId) {
      const { db } = await import("@/lib/db");
      const { invitationUrl } = await import("@/lib/invitation/generate");
      const inv = await db.invitation.findUnique({
        where: { orderId: s.orderId },
        select: { slug: true },
      });
      if (inv) link = invitationUrl(inv.slug);
    }
    await ctx.telegram.sendMessage(
      adminChatId,
      MSG.adminEdited({
        label,
        brideName: s.brideName,
        groomName: s.groomName,
        link,
      }),
      { parse_mode: "HTML" }
    );
  } catch (e) {
    console.error("Admin xabar (tahrir) xatosi:", e);
  }
}

/**
 * Fikr-taklif rejimini boshlaydi (/fikr buyrug'i). Shu chatning eng so'nggi
 * buyurtmasini topib fikrga biriktiradi (bo'lsa), so'ng matn so'raydi.
 */
async function startFeedback(ctx: SessionContext) {
  const s = ctx.session;
  const chatId = ctx.chat?.id;

  let orderId: string | undefined;
  try {
    if (chatId) {
      const { db } = await import("@/lib/db");
      const order = await db.order.findFirst({
        where: { telegramChatId: String(chatId) },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      orderId = order?.id;
    }
  } catch (e) {
    console.error("Fikr uchun buyurtma topish xatosi:", e);
  }

  s.feedbackOrderId = orderId;
  s.step = "feedback";
  await ctx.replyWithMarkdown(orderId ? MSG.feedbackPrompt : MSG.feedbackNoOrder);
}

/**
 * Mijoz yozgan fikr-taklif matnini `Feedback` jadvaliga saqlaydi (admin
 * panel "Fikrlar" bo'limida ko'rinadi) va admin'ni xabardor qiladi.
 */
async function handleFeedbackText(ctx: SessionContext, text: string) {
  const s = ctx.session;

  const message = text.trim();
  if (!message) {
    await ctx.reply("✍️ Iltimos, fikringizni matn ko'rinishida yozing.");
    return;
  }
  if (message.length > 2000) {
    await ctx.reply("❌ Fikr juda uzun (maksimal 2000 belgi). Iltimos, qisqartiring.");
    return;
  }

  // Fikr yozgan foydalanuvchi nomi — Telegram profilidan.
  const displayName =
    [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(" ") ||
    undefined;
  const username = ctx.from?.username ? `@${ctx.from.username}` : undefined;
  const name = [displayName, username].filter(Boolean).join(" ") || null;

  try {
    const { db } = await import("@/lib/db");

    // orderId'ni faqat mavjud bo'lsa biriktiramiz (FK xatosining oldini olamiz).
    let orderId: string | null = null;
    let brideName: string | undefined;
    let groomName: string | undefined;
    if (s.feedbackOrderId) {
      const order = await db.order.findUnique({
        where: { id: s.feedbackOrderId },
        select: { id: true, brideName: true, groomName: true },
      });
      if (order) {
        orderId = order.id;
        brideName = order.brideName;
        groomName = order.groomName ?? undefined;
      }
    }

    await db.feedback.create({
      data: { name, message, orderId },
    });

    // Admin'ni xabardor qilamiz (best-effort).
    const adminChatId = Number(process.env.TELEGRAM_ADMIN_CHAT_ID);
    if (adminChatId) {
      await ctx.telegram
        .sendMessage(
          adminChatId,
          MSG.adminFeedback({ name: name ?? undefined, message, brideName, groomName }),
          { parse_mode: "HTML" }
        )
        .catch(() => {});
    }

    await ctx.replyWithMarkdown(MSG.feedbackThanks);
  } catch (e) {
    console.error("Fikr saqlash xatosi:", e);
    await ctx.reply("✗ Fikrni saqlashda xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
    return;
  }

  // Fikr rejimidan chiqamiz.
  s.feedbackOrderId = undefined;
  s.step = "done";
}

/** Buyurtma yozuvidan sessiyani to'ldiradi (web order ochish va to'lovdan
 *  keyingi tahrirlash uchun umumiy). */
function hydrateSessionFromOrder(
  s: BotSession,
  order: Order & { template: Template | null }
) {
  s.orderId = order.id;
  s.eventType = order.eventType;
  s.groomName = order.groomName ?? undefined;
  s.brideName = order.brideName;
  s.eventDate = order.eventDate
    ? `${String(order.eventDate.getDate()).padStart(2, "0")}.${String(
        order.eventDate.getMonth() + 1
      ).padStart(2, "0")}.${order.eventDate.getFullYear()}`
    : undefined;
  s.eventTime = order.eventTime ?? undefined;
  s.venueName = order.venueName ?? undefined;
  s.venueAddress = order.venueAddress ?? undefined;
  s.yandexLink = order.yandexLink ?? undefined;
  s.googleLink = order.googleLink ?? undefined;
  s.cardNumber = order.cardNumber ?? undefined;
  s.cardHolder = order.cardHolder ?? undefined;
  s.notes = order.notes ?? undefined;
  s.templateSlug = order.template?.slug;
  s.musicChoice =
    (order.musicChoice?.split(":")[0] as BotSession["musicChoice"]) ?? "none";
  s.musicTrackId = order.musicChoice?.startsWith("library:")
    ? order.musicChoice.split(":")[1]
    : undefined;
  // Yuklangan rasm/musiqa URL'larini keshdan olamiz — qayta yuklanmaydi.
  s.photoUrl = order.photoUrl ?? undefined;
  s.photoType = (order.photoType as BotSession["photoType"]) ?? "couple";
  s.customMusicUrl = order.customMusicUrl ?? undefined;
}

/**
 * Tadbir sanasini tekshiradi: format (KK.OO.YYYY), haqiqiy kalendar sanasi
 * (masalan 31.02 rad etiladi) va o'tmaganligi (bugundan oldin bo'lmasligi).
 * Xatolik bo'lsa foydalanuvchiga ko'rsatiladigan xabar matnini, aks holda
 * `null` qaytaradi.
 */
function validateEventDate(text: string): string | null {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(text)) {
    return "❌ Format noto'g'ri. Misol: 15.06.2026";
  }

  const [day, month, year] = text.split(".").map(Number);
  const d = new Date(year, month - 1, day);

  // Haqiqiy sana emasmi (masalan 31.02.2026 → JS avtomatik "surib" yuboradi).
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    return "❌ Bunday sana mavjud emas. Iltimos, to'g'ri sana kiriting. Misol: 15.06.2026";
  }

  // Bugungi kundan oldin bo'lmasligi kerak (bugun ruxsat etiladi).
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) {
    return "❌ O'tgan sanani kiritib bo'lmaydi. Bugungi yoki kelajakdagi sanani kiriting.";
  }

  return null;
}

/**
 * Tadbir vaqtini tekshiradi: format (SS:DD), soat/daqiqa oralig'i (00:00–23:59)
 * va tanlangan sana BUGUN bo'lsa — o'tib ketmaganligi. Kelajakdagi sanalar uchun
 * istalgan soat ruxsat etiladi. `dateStr` — "KK.OO.YYYY" ko'rinishida (allaqachon
 * tekshirilgan sana). Xatolik matnini yoki `null` qaytaradi.
 */
function validateEventTime(text: string, dateStr?: string): string | null {
  if (!/^\d{1,2}:\d{2}$/.test(text)) {
    return "❌ Format noto'g'ri. Misol: 14:00";
  }

  const [hour, minute] = text.split(":").map(Number);
  if (hour > 23 || minute > 59) {
    return "❌ Bunday vaqt mavjud emas. Soatni 00:00–23:59 oralig'ida kiriting. Misol: 14:00";
  }

  // Tadbir bugungi kunga belgilangan bo'lsa — o'tib ketgan soatni rad etamiz.
  if (dateStr && /^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split(".").map(Number);
    const now = new Date();
    const isToday =
      year === now.getFullYear() &&
      month - 1 === now.getMonth() &&
      day === now.getDate();
    if (isToday) {
      const eventTime = new Date(year, month - 1, day, hour, minute);
      if (eventTime < now) {
        return "❌ Bu vaqt allaqachon o'tib ketgan. Bugungi tadbir uchun hozirgi vaqtdan keyingi soatni kiriting yoki boshqa sanani tanlang.";
      }
    }
  }

  return null;
}

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split(".").map(Number);
  return new Date(year, month - 1, day);
}
