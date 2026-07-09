// Botni lokalda test qilish uchun: webhook o'rniga long-polling ishlatadi.
// Production webhook'ga tegmaydi (ishga tushganda vaqtincha o'chiradi,
// to'xtaganda hech narsa tiklamaydi — sinovdan keyin webhook qayta o'rnatiladi).
import "dotenv/config";
import { createBot } from "../src/lib/bot/handler";

async function main() {
  const bot = createBot();

  bot.catch((err, ctx) => {
    console.error(`Bot xatosi [${ctx.updateType}]:`, err);
  });

  await bot.telegram.deleteWebhook();
  console.log("Webhook o'chirildi, polling boshlandi...");

  await bot.launch();
  console.log("Bot ishga tushdi. To'xtatish uchun Ctrl+C.");
}

main().catch((err) => {
  console.error("Bot ishga tushmadi:", err);
  process.exit(1);
});

process.once("SIGINT", () => process.exit(0));
process.once("SIGTERM", () => process.exit(0));
