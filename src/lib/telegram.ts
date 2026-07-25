/**
 * Telegram Bot API'ga to'g'ridan-to'g'ri xabar yuborish (ishlab turgan bot
 * jarayonidan mustaqil — Next.js server/route ichidan chaqirish uchun).
 */
const TELEGRAM_API = "https://api.telegram.org";

interface SendOptions {
  parseMode?: "Markdown" | "HTML";
  disablePreview?: boolean;
  /** Inline klaviatura (masalan "Fikr qoldirish" tugmasi). */
  replyMarkup?: { inline_keyboard: { text: string; callback_data: string }[][] };
}

export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  opts: SendOptions = {}
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("sendTelegramMessage: TELEGRAM_BOT_TOKEN env yo'q");
    return false;
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: opts.parseMode ?? "Markdown",
        disable_web_page_preview: opts.disablePreview ?? false,
        ...(opts.replyMarkup ? { reply_markup: opts.replyMarkup } : {}),
      }),
    });

    if (!res.ok) {
      console.error("sendTelegramMessage xato:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("sendTelegramMessage istisno:", e);
    return false;
  }
}

/** Fikr-taklif formasi havolasi. Boshqa qurilmada ochilgani uchun
 *  `NEXT_PUBLIC_APP_URL` prod manziliga sozlangan bo'lishi kerak. */
export function feedbackUrl(orderId?: string | null): string {
  const base = (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    ""
  ).replace(/\/$/, "");
  return orderId ? `${base}/fikr?ref=${orderId}` : `${base}/fikr`;
}

/** Mijozga tayyor taklifnoma havolasini yuborish uchun tayyor xabar. Fikr-taklif
 *  endi bot ichida "Fikr qoldirish" tugmasi orqali olinadi (web havola emas). */
export function invitationReadyMessage(link: string): string {
  return (
    `🎉 *Taklifnomangiz tayyor!*\n\n` +
    `Quyidagi havola orqali ko'rishingiz va mehmonlaringizga ulashishingiz mumkin:\n\n` +
    `${link}\n\n` +
    `Wedly'dan foydalanganingiz uchun rahmat! 💛`
  );
}
