import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const { id } = await params;
  const { name, slug, price, description, hasPdfExport, isFeatured, isActive, features, templateIds } =
    await req.json();

  const pkg = await db.package.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(price !== undefined && { price: Number(price) }),
      ...(description !== undefined && { description: description || null }),
      ...(hasPdfExport !== undefined && { hasPdfExport: !!hasPdfExport }),
      ...(isFeatured !== undefined && { isFeatured: !!isFeatured }),
      ...(isActive !== undefined && { isActive: !!isActive }),
      ...(Array.isArray(features) && { features }),
    },
  });

  if (Array.isArray(templateIds)) {
    await db.template.updateMany({
      where: { packageId: id, id: { notIn: templateIds } },
      data: { packageId: null },
    });
    if (templateIds.length > 0) {
      await db.template.updateMany({
        where: { id: { in: templateIds } },
        data: { packageId: id },
      });
    }
  }

  return NextResponse.json(pkg);
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const { id } = await params;
  await db.package.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
