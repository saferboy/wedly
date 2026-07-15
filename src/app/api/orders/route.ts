import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTemplate } from "@/lib/templates";

/**
 * Ochiq (public) buyurtma endpointi — sayt orqali `/buyurtma` wizard'idan
 * keladigan ma'lumotlarni Order sifatida saqlaydi (status: PENDING).
 * To'lov keyin Telegram bot orqali `?start=order_<id>` deep-link bilan yakunlanadi.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventType,
      groomName,
      brideName,
      eventDate,
      eventTime,
      familyName,
      language,
      venueName,
      venueAddress,
      yandexLink,
      googleLink,
      letterText,
      letterTextRu,
      musicChoice,
      customMusicUrl,
      cardNumber,
      cardHolder,
      notes,
      templateSlug,
    } = body ?? {};

    // Validatsiya
    if (!eventType || !["WEDDING", "BACHELORETTE", "BIRTHDAY"].includes(eventType)) {
      return NextResponse.json({ error: "Tadbir turi noto'g'ri" }, { status: 400 });
    }
    if (!brideName?.trim()) {
      return NextResponse.json({ error: "Ism kiritilmagan" }, { status: 400 });
    }
    if (!eventDate || !eventTime?.trim()) {
      return NextResponse.json({ error: "Sana va vaqt kiritilmagan" }, { status: 400 });
    }

    // Template (ixtiyoriy — tanlangan bo'lsa bog'laymiz)
    let templateId: string | undefined;
    if (templateSlug && getTemplate(templateSlug)) {
      const tpl = await db.template.findUnique({ where: { slug: templateSlug } });
      templateId = tpl?.id;
    }

    const parsedDate = new Date(eventDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Sana formati noto'g'ri" }, { status: 400 });
    }

    const order = await db.order.create({
      data: {
        telegramChatId: "web",
        source: "web",
        eventType,
        groomName: groomName?.trim() || null,
        brideName: brideName.trim(),
        eventDate: parsedDate,
        eventTime: eventTime.trim(),
        familyName: familyName?.trim() || null,
        language: language === "ru" ? "ru" : "uz",
        venueName: venueName?.trim() || null,
        venueAddress: venueAddress?.trim() || null,
        yandexLink: yandexLink?.trim() || null,
        googleLink: googleLink?.trim() || null,
        letterText: letterText?.trim() || null,
        letterTextRu: letterTextRu?.trim() || null,
        musicChoice: musicChoice || "none",
        customMusicUrl: customMusicUrl?.trim() || null,
        cardNumber: cardNumber?.trim() || null,
        cardHolder: cardHolder?.trim() || null,
        notes: notes?.trim() || null,
        templateId,
        status: "PENDING",
      },
    });

    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error("Order yaratish xatosi:", err);

    // Ma'lumotlar bazasiga ulanib bo'lmagan holatni alohida aniqlaymiz.
    const raw = err instanceof Error ? err.message : String(err);
    const isDbDown = /reach database|P1001|ECONNREFUSED|ENOTFOUND|Can't reach|connection|Initialization/i.test(
      raw
    );

    if (isDbDown) {
      return NextResponse.json(
        {
          error:
            "Ma'lumotlar bazasiga ulanib bo'lmadi. Iltimos birozdan so'ng qayta urinib ko'ring yoki Telegram orqali murojaat qiling.",
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
