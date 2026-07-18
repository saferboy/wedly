import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { TEMPLATES } from "@/lib/templates";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      eventType, groomName, brideName, eventDate, eventTime,
      venueName, venueAddress, yandexMapUrl, googleMapUrl,
      letterText, letterTextRu, cardNumber, cardHolder,
      templateSlug, musicTrackId, slug, orderId,
    } = body;

    // Validatsiya
    if (!brideName || !eventDate || !eventTime || !venueName || !venueAddress || !templateSlug) {
      return NextResponse.json({ error: "Majburiy maydonlar to'ldirilmagan" }, { status: 400 });
    }

    // Template mavjudligini tekshirish (slug yoki id bo'yicha).
    const template = await db.template.findFirst({
      where: { OR: [{ slug: templateSlug }, { id: templateSlug }] },
    });
    if (!template) {
      return NextResponse.json({ error: "Template topilmadi" }, { status: 400 });
    }

    // Slug yaratish (agar berilmasa)
    let finalSlug = slug?.trim()
      ? slugify(slug)
      : slugify(`${groomName ?? ""}-${brideName}-${Date.now()}`);

    // Slug takrorlanmasligini tekshirish
    const existing = await db.invitation.findUnique({ where: { slug: finalSlug } });
    if (existing) finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;

    const invitation = await db.invitation.create({
      data: {
        slug: finalSlug,
        isActive: true,
        eventType,
        groomName: groomName || null,
        brideName,
        eventDate: new Date(eventDate),
        eventTime,
        venueName,
        venueAddress,
        yandexMapUrl: yandexMapUrl || null,
        googleMapUrl: googleMapUrl || null,
        letterText: letterText || "",
        letterTextRu: letterTextRu || "",
        cardNumber: cardNumber || null,
        cardHolder: cardHolder || null,
        templateId: template.id,
        musicTrackId: musicTrackId || null,
        orderId: orderId || null,
      },
    });

    // Buyurtma statusini yangilash
    if (orderId) {
      await db.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
      });
    }

    return NextResponse.json({ slug: finalSlug, id: invitation.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const invitations = await db.invitation.findMany({
    orderBy: { createdAt: "desc" },
    include: { template: true, musicTrack: true },
  });

  return NextResponse.json(invitations);
}
