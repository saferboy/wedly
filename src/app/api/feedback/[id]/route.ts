import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

/** Fikrni o'qilgan/o'qilmagan qilib belgilash (faqat admin). */
export async function PATCH(req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const { id } = await params;
  const { isRead } = await req.json();

  await db.feedback.update({
    where: { id },
    data: { isRead: Boolean(isRead) },
  });

  return NextResponse.json({ ok: true });
}

/** Fikrni o'chirish (faqat admin). */
export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const { id } = await params;
  await db.feedback.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
