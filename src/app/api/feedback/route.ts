import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Ochiq (public) fikr-taklif endpointi — taklifnoma linki bilan yuborilgan
 * `/fikr` formasidan keladi. Autentifikatsiya talab qilinmaydi (mijoz login
 * qilmaydi). Fikr admin panelidagi "Fikrlar" bo'limida ko'rinadi.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, message, ref } = body ?? {};

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Fikr matni bo'sh bo'lmasligi kerak" },
        { status: 400 }
      );
    }
    if (message.trim().length > 2000) {
      return NextResponse.json(
        { error: "Fikr juda uzun (maksimal 2000 belgi)" },
        { status: 400 }
      );
    }

    // `ref` — buyurtma id. Mavjud bo'lsagina biriktiramiz (noto'g'ri id kelsa
    // fikr baribir saqlanadi, shunchaki buyurtmasiz).
    let orderId: string | null = null;
    if (typeof ref === "string" && ref.trim()) {
      const order = await db.order.findUnique({
        where: { id: ref.trim() },
        select: { id: true },
      });
      orderId = order?.id ?? null;
    }

    await db.feedback.create({
      data: {
        name: name?.trim() || null,
        phone: phone?.trim() || null,
        message: message.trim(),
        orderId,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Fikr saqlash xatosi:", err);

    const raw = err instanceof Error ? err.message : String(err);
    const isDbDown =
      /reach database|P1001|ECONNREFUSED|ENOTFOUND|Can't reach|connection|Initialization/i.test(
        raw
      );
    if (isDbDown) {
      return NextResponse.json(
        {
          error:
            "Ma'lumotlar bazasiga ulanib bo'lmadi. Iltimos birozdan so'ng qayta urinib ko'ring.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Server xatosi. Iltimos qaytadan urinib ko'ring." },
      { status: 500 }
    );
  }
}
