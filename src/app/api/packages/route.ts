import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const packages = await db.package.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(packages);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const { name, slug, price, description, hasPdfExport, isFeatured, features } = await req.json();

  if (!name || !slug || price === undefined || price === null) {
    return NextResponse.json({ error: "Nomi, slug va narx majburiy" }, { status: 400 });
  }

  const pkg = await db.package.create({
    data: {
      name,
      slug,
      price: Number(price),
      description: description || null,
      hasPdfExport: !!hasPdfExport,
      isFeatured: !!isFeatured,
      features: Array.isArray(features) ? features : [],
    },
  });

  return NextResponse.json(pkg, { status: 201 });
}
