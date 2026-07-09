import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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
  const { slug } = await params;
  const body = await req.json();

  const invitation = await db.invitation.update({
    where: { slug },
    data: body,
  });

  return NextResponse.json(invitation);
}
