import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { deriveMapLinks } from "@/lib/invitation/mapLinks";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { slug } = await params;

  const invitation = await db.invitation.findUnique({
    where: { slug, isActive: true },
    include: { musicTrack: true, template: true },
  });

  if (!invitation) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }

  return NextResponse.json(invitation);
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const { slug } = await params;

  try {
    const body = await req.json();
    const {
      eventType, groomName, brideName, eventDate, eventTime,
      venueName, venueAddress, yandexMapUrl, googleMapUrl,
      letterText, letterTextRu, cardNumber, cardHolder,
      templateSlug, musicTrackId, photoUrl, venuePhotoUrl,
    } = body;

    if (!brideName || !eventDate || !eventTime || !venueName || !venueAddress || !templateSlug) {
      return NextResponse.json({ error: "Majburiy maydonlar to'ldirilmagan" }, { status: 400 });
    }

    const template = await db.template.findFirst({
      where: { OR: [{ slug: templateSlug }, { id: templateSlug }] },
    });
    if (!template) {
      return NextResponse.json({ error: "Template topilmadi" }, { status: 400 });
    }

    const maps = deriveMapLinks(yandexMapUrl, googleMapUrl);

    const invitation = await db.invitation.update({
      where: { slug },
      data: {
        eventType,
        groomName: groomName || null,
        brideName,
        eventDate: new Date(eventDate),
        eventTime,
        venueName,
        venueAddress,
        yandexMapUrl: maps.yandexMapUrl,
        googleMapUrl: maps.googleMapUrl,
        letterText: letterText || "",
        letterTextRu: letterTextRu || "",
        cardNumber: cardNumber || null,
        cardHolder: cardHolder || null,
        photoUrl: photoUrl || null,
        venuePhotoUrl: venuePhotoUrl || null,
        templateId: template.id,
        musicTrackId: musicTrackId || null,
      },
    });

    return NextResponse.json({ slug: invitation.slug, id: invitation.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
