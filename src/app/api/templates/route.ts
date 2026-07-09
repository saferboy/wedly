import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const templates = await db.template.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(templates);
}
