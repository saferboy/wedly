// Sayt tugmalari ochadigan bot — .env dagi token bilan MOS bo'lishi shart.
// NEXT_PUBLIC_ prefiksi bilan client komponentlarда ham o'qiladi.
export const TELEGRAM_BOT_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.replace(/^@/, "") ||
  "weddingly_bot";
