import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const tracks = await db.musicTrack.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
  });
  return NextResponse.json(tracks);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const { title, artist, fileUrl } = await req.json();

  if (!title || !fileUrl) {
    return NextResponse.json({ error: "Nom va URL majburiy" }, { status: 400 });
  }

  const track = await db.musicTrack.create({
    data: { title, artist: artist || null, fileUrl },
  });

  return NextResponse.json(track, { status: 201 });
}
