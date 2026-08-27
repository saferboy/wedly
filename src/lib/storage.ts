import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Storage'ga saqlash. Vercel'ning serverless funksiyalari faylni
 * lokal diskka yozib bo'lmaydi (o'qishga mo'ljallangan, har chaqiriqda
 * yo'qoladi) — shuning uchun barcha yuklamalar (bot rasm/musiqa, admin
 * panel yuklashlari) shu orqali doimiy saqlanadi.
 */

export const STORAGE_BUCKETS = {
  photos: "photos",
  music: "music",
} as const;

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  wav: "audio/wav",
};

function guessContentType(objectPath: string): string {
  const ext = objectPath.split(".").pop()?.toLowerCase();
  return (ext && CONTENT_TYPES[ext]) || "application/octet-stream";
}

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase Storage sozlanmagan — NEXT_PUBLIC_SUPABASE_URL yoki SUPABASE_SERVICE_ROLE_KEY yo'q"
    );
  }
  return createClient(url, key);
}

/**
 * Buferni ko'rsatilgan bucket/ichki yo'lga saqlaydi va ochiq URL qaytaradi.
 * `objectPath` ichki papkalarni o'z ichiga olishi mumkin (masalan `telegram/x.jpg`).
 */
export async function saveFile(
  bucket: string,
  objectPath: string,
  data: Uint8Array | Buffer
): Promise<string> {
  const safePath = objectPath.replace(/^\/+/, "");
  const { error } = await supabaseAdmin()
    .storage.from(bucket)
    .upload(safePath, data, {
      contentType: guessContentType(safePath),
      upsert: true,
    });
  if (error) throw error;
  return getPublicUrl(bucket, safePath);
}

/**
 * Brauzerdan to'g'ridan-to'g'ri (Vercel funksiyasini chetlab o'tib) Supabase
 * Storage'ga yuklash uchun bir martalik imzolangan URL yaratadi. Vercel
 * serverless funksiyalarida so'rov tanasi hajmi ~4.5MB bilan cheklangan —
 * fayl avval serverga, keyin Storage'ga yuborilsa, haqiqiy musiqa/rasm
 * fayllari (odatda 3-8MB) shu chegaraga urilib, xatolik beradi. Imzolangan
 * URL bilan fayl to'g'ridan-to'g'ri Supabase'ga ketadi — bu chegara yo'q.
 */
export async function createSignedUploadUrl(bucket: string, objectPath: string) {
  const safePath = objectPath.replace(/^\/+/, "");
  const { data, error } = await supabaseAdmin()
    .storage.from(bucket)
    .createSignedUploadUrl(safePath, { upsert: true });
  if (error) throw error;
  return { path: data.path, token: data.token, publicUrl: getPublicUrl(bucket, safePath) };
}

/**
 * Saqlangan fayl uchun ochiq (brauzer) URL manzilini qaytaradi.
 */
export function getPublicUrl(bucket: string, objectPath: string): string {
  const safePath = objectPath.replace(/^\/+/, "");
  return supabaseAdmin().storage.from(bucket).getPublicUrl(safePath).data.publicUrl;
}

/**
 * Saqlangan faylni o'chiradi. Fayl topilmasa xatolikni yutadi.
 */
export async function deleteFile(bucket: string, objectPath: string): Promise<void> {
  const safePath = objectPath.replace(/^\/+/, "");
  try {
    await supabaseAdmin().storage.from(bucket).remove([safePath]);
  } catch {
    // fayl allaqachon yo'q — e'tiborsiz qoldiramiz
  }
}
