import { Telegraf } from "telegraf";
import type { Context } from "telegraf";
import type { Update } from "telegraf/types";
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

  // Callback query handler (inline tugmalar)
  bot.on("callback_query", async (ctx) => {
    const data = (ctx.callbackQuery as { data?: string }).data;
    if (!data) return;
    await ctx.answerCbQuery();

    const s = ctx.session;

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

    // Skip photo
    if (data === "skip_photo") {
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
      // Demo kutubxona (haqiqiysi DB dan keladi)
      const demoTracks = [
        { id: "1", title: "Muhabbat", artist: "Ozodbek Nazarbekov" },
        { id: "2", title: "Sevgim", artist: "Shaxriyor" },
        { id: "3", title: "Qalbim", artist: "Ulugbek Rahmatullayev" },
        { id: "4", title: "Seni sevaman", artist: "Jasur Umirov" },
      ];
      await ctx.replyWithMarkdown(MSG.musicLibrary, {
        reply_markup: KEYBOARDS.musicLibrary(demoTracks),
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
      s.step = "card_number";
      await ctx.replyWithMarkdown(MSG.cardNumber, {
        reply_markup: KEYBOARDS.cardChoice,
      });
      return;
    }

    // Music library track tanlash
    if (data.startsWith("track_")) {
      s.musicTrackId = data.replace("track_", "");
      s.step = "card_number";
      await ctx.reply("✅ Musiqa tanlandi!");
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
      s.step = "notes";
      await ctx.replyWithMarkdown(MSG.notes);
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
      s.step = "music_choice";
      await ctx.reply("✅ Rasm qabul qilindi!");
      await ctx.replyWithMarkdown(MSG.musicChoice, {
        reply_markup: KEYBOARDS.musicChoice,
      });
      return;
    }

    if (s.step === "payment_screenshot") {
      const photos = ctx.message.photo;
      s.paymentScreenshotFileId = photos[photos.length - 1].file_id;
      s.step = "done";

      // Admin ga xabar va buyurtmani DB ga saqlaymiz.
      await notifyAdmin(ctx, s);
      await savePaidOrder(ctx, s);

      // Taklifnoma admin tomonidan tayyorlanadi va link 24 soat ichida yuboriladi.
      await ctx.replyWithMarkdown(MSG.done);

      sessions.delete(ctx.chat.id);
    }
  });

  // Audio/document qabul qilish
  bot.on("audio", async (ctx) => {
    if (ctx.session.step !== "music_file") return;
    ctx.session.musicFileId = ctx.message.audio.file_id;
    ctx.session.step = "card_number";
    await ctx.reply("✅ Musiqa qabul qilindi!");
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
        s.groomName = text;
        s.step = "bride_name";
        await ctx.replyWithMarkdown(MSG.brideName(true));
        break;

      case "bride_name":
        s.brideName = text;
        s.step = "event_date";
        await ctx.replyWithMarkdown(MSG.eventDate);
        break;

      case "event_date":
        if (!isValidDate(text)) {
          await ctx.reply("❌ Format noto'g'ri. Misol: 15.06.2026");
          return;
        }
        s.eventDate = text;
        s.step = "event_time";
        await ctx.replyWithMarkdown(MSG.eventTime);
        break;

      case "event_time":
        if (!isValidTime(text)) {
          await ctx.reply("❌ Format noto'g'ri. Misol: 14:00");
          return;
        }
        s.eventTime = text;
        s.step = "venue_name";
        await ctx.replyWithMarkdown(MSG.venueName);
        break;

      case "venue_name":
        s.venueName = text;
        s.step = "venue_address";
        await ctx.replyWithMarkdown(MSG.venueAddress);
        break;

      case "venue_address":
        s.venueAddress = text;
        s.step = "yandex_link";
        await ctx.replyWithMarkdown(MSG.yandexLink);
        break;

      case "yandex_link":
        s.yandexLink = text;
        s.step = "google_link";
        await ctx.replyWithMarkdown(MSG.googleLink);
        break;

      case "google_link":
        s.googleLink = text;
        s.step = "photo";
        await ctx.replyWithMarkdown(MSG.photo, {
          reply_markup: KEYBOARDS.skipPhoto,
        });
        break;

      case "card_number":
        s.cardNumber = text;
        s.step = "card_holder";
        await ctx.replyWithMarkdown(MSG.cardHolder);
        break;

      case "card_holder":
        s.cardHolder = text.toUpperCase();
        s.step = "notes";
        await ctx.replyWithMarkdown(MSG.notes);
        break;

      case "notes":
        s.notes = text;
        await sendSummaryAndPayment(ctx);
        break;

      case "payment_screenshot":
        // Matn screenshot o'rniga keldi
        await ctx.reply(
          "📷 Iltimos, to'lov chekini *rasm sifatida* yuboring.",
          { parse_mode: "Markdown" }
        );
        break;

      default:
        await ctx.reply("Iltimos /start bosib qaytadan boshlang.");
    }
  });

  return bot;
}

// Yordamchi funksiyalar
async function handleSkip(ctx: SessionContext) {
  const s = ctx.session;

  switch (s.step) {
    case "yandex_link":
      s.step = "google_link";
      await ctx.replyWithMarkdown(MSG.googleLink);
      break;

    case "google_link":
      s.step = "photo";
      await ctx.replyWithMarkdown(MSG.photo, {
        reply_markup: KEYBOARDS.skipPhoto,
      });
      break;

    case "notes":
      await sendSummaryAndPayment(ctx);
      break;

    default:
      await ctx.reply("Bu qadamni o'tkazib bo'lmaydi.");
  }
}

async function sendSummaryAndPayment(ctx: SessionContext) {
  const s = ctx.session;
  const amount = "79 000 so'm";

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
  await ctx.replyWithMarkdown(MSG.paymentInfo(amount));
  ctx.session.step = "payment_screenshot";
}

async function notifyAdmin(ctx: SessionContext, s: BotSession) {
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

  await ctx.telegram.sendMessage(adminChatId, msg, { parse_mode: "Markdown" });

  // Screenshot ni ham yuborish
  if (s.paymentScreenshotFileId) {
    await ctx.telegram.sendPhoto(adminChatId, s.paymentScreenshotFileId, {
      caption: `💳 To'lov cheki — ${s.brideName}${s.groomName ? " & " + s.groomName : ""}`,
    });
  }
}

/**
 * To'lov kelgach buyurtmani DB ga saqlaydi (yoki saytdan kelgan bo'lsa yangilaydi)
 * va PAID holatiga o'tkazadi. Mijoz yuborgan rasmni ham Storage'ga yuklaydi.
 * Taklifnomaning o'zi admin tomonidan tayyorlanadi va linki 24 soat ichida yuboriladi.
 */
async function savePaidOrder(ctx: SessionContext, s: BotSession): Promise<void> {
  try {
    const { db } = await import("@/lib/db");

    // Mijoz yuborgan rasmni (bo'lsa) Storage'ga yuklaymiz — best-effort.
    let photoUrl: string | null = null;
    if (s.photoFileId) photoUrl = await uploadTelegramPhoto(ctx, s.photoFileId);

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
        },
      });
      return;
    }

    const templateId = s.templateSlug
      ? (await db.template.findUnique({ where: { slug: s.templateSlug } }))?.id
      : undefined;

    await db.order.create({
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
        musicChoice:
          s.musicChoice === "library" ? `library:${s.musicTrackId}` : s.musicChoice ?? "none",
        cardNumber: s.cardNumber,
        cardHolder: s.cardHolder,
        notes: s.notes,
        templateId,
        status: "PAID",
      },
    });
  } catch (e) {
    console.error("Buyurtmani saqlash xatosi:", e);
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

    const { getSupabaseAdmin, STORAGE_BUCKETS } = await import("@/lib/supabase");
    const admin = getSupabaseAdmin();
    const path = `telegram/${fileId}.jpg`;
    const { error } = await admin.storage
      .from(STORAGE_BUCKETS.photos)
      .upload(path, buffer, { contentType: "image/jpeg", upsert: true });
    if (error) return null;

    const { data } = admin.storage.from(STORAGE_BUCKETS.photos).getPublicUrl(path);
    return data.publicUrl;
  } catch (e) {
    console.error("Rasm yuklash xatosi:", e);
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
    s.musicChoice = (order.musicChoice?.split(":")[0] as typeof s.musicChoice) ?? "none";

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

function isValidDate(text: string) {
  return /^\d{2}\.\d{2}\.\d{4}$/.test(text);
}

function isValidTime(text: string) {
  return /^\d{1,2}:\d{2}$/.test(text);
}

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split(".").map(Number);
  return new Date(year, month - 1, day);
}
