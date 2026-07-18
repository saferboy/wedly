import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createInvitationFromOrder, invitationUrl } from "@/lib/invitation/generate";
import { sendTelegramMessage, invitationReadyMessage } from "@/lib/telegram";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Admin to'lov chekini tekshirgach chaqiriladi:
 *  1. Buyurtma ma'lumotidan taklifnomani AVTOMATIK yaratadi
 *  2. Buyurtmani COMPLETED holatiga o'tkazadi
 *  3. Tayyor havolani mijozga Telegram orqali yuboradi
 */
export async function POST(_req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const { id } = await params;

  try {
    // 1. Avtomatik generatsiya (idempotent).
    const result = await createInvitationFromOrder(id);

    const order = await db.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: "Buyurtma topilmadi" }, { status: 404 });

    // 2. Holatni yangilash.
    if (order.status !== "COMPLETED") {
      await db.order.update({ where: { id }, data: { status: "COMPLETED" } });
    }

    // 3. Havolani mijozga yuborish.
    const link = invitationUrl(result.slug);
    let sent = false;
    if (order.telegramChatId) {
      sent = await sendTelegramMessage(order.telegramChatId, invitationReadyMessage(link));
    }

    return NextResponse.json({
      slug: result.slug,
      link,
      created: result.created,
      sent,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server xatosi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
