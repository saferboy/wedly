import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { STORAGE_BUCKETS, createSignedUploadUrl } from "@/lib/storage";

/**
 * Brauzerga imzolangan yuklash URL'ini beradi — o'zi faylni qabul qilmaydi
 * (shuning uchun Vercel'ning ~4.5MB so'rov chegarasiga urilmaydi). Brauzer
 * qaytgan token bilan faylni to'g'ridan-to'g'ri Supabase Storage'ga yuboradi.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });

  const { type, name, ext } = await req.json();

  const bucket =
    type === "photo" ? STORAGE_BUCKETS.photos : type === "music" ? STORAGE_BUCKETS.music : null;
  if (!bucket) {
    return NextResponse.json({ error: "Noto'g'ri fayl turi" }, { status: 400 });
  }

  const safeExt = String(ext || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 10) || (type === "photo" ? "jpg" : "mp3");
  const safeName =
    String(name || "fayl")
      .replace(/[^a-zA-Z0-9\-_. ]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "fayl";
  const fileName = `${safeName}-${Date.now()}.${safeExt}`;

  try {
    const { path, token, publicUrl } = await createSignedUploadUrl(bucket, fileName);
    return NextResponse.json({ bucket, path, token, publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Yuklash havolasini yaratib bo'lmadi" }, { status: 500 });
  }
}
