import { NextRequest, NextResponse } from "next/server";
import { createBot } from "@/lib/bot/handler";

let bot: ReturnType<typeof createBot> | null = null;

function getBot() {
  if (!bot) bot = createBot();
  return bot;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const b = getBot();
    await b.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook xatosi:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Webhook sozlash uchun GET endpoint
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const b = getBot();
    await b.telegram.setWebhook(`${appUrl}/api/telegram/webhook`);
    return NextResponse.json({ ok: true, message: "Webhook o'rnatildi" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
