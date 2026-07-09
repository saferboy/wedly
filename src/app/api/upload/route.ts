import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin, STORAGE_BUCKETS, getPublicUrl } from "@/lib/supabase";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;  // 5MB
const MAX_MUSIC_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as "photo" | "music" | null;
  const name = formData.get("name") as string | null;

  if (!file || !type) {
    return NextResponse.json({ error: "Fayl yoki tur yo'q" }, { status: 400 });
  }

  const maxSize = type === "photo" ? MAX_PHOTO_SIZE : MAX_MUSIC_SIZE;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `Fayl hajmi katta. Maksimal: ${maxSize / 1024 / 1024}MB` },
      { status: 400 }
    );
  }

  const bucket = type === "photo" ? STORAGE_BUCKETS.photos : STORAGE_BUCKETS.music;
  const ext = file.name.split(".").pop() ?? (type === "photo" ? "jpg" : "mp3");
  const fileName = name
    ? `${name.replace(/\s+/g, "-")}-${Date.now()}.${ext}`
    : `${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await getSupabaseAdmin().storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload xatosi:", error);
    return NextResponse.json({ error: "Yuklash xatosi" }, { status: 500 });
  }

  const publicUrl = getPublicUrl(bucket, fileName);
  return NextResponse.json({ url: publicUrl, fileName });
}
