import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

/**
 * Lokal fayl tizimida saqlash. Fayllar `public/uploads/<bucket>/...` ostida
 * saqlanadi va Next.js ularni statik ravishda `/uploads/<bucket>/...` sifatida
 * uzatadi. Supabase Storage o'rniga ishlatiladi (lokal ishlab chiqish uchun).
 */

export const STORAGE_BUCKETS = {
  photos: "photos",
  music: "music",
} as const;

// public/uploads — Next.js `public` papkasidan xizmat qiladi.
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

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
  const fullPath = path.join(UPLOAD_ROOT, bucket, safePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, data);
  return getPublicUrl(bucket, safePath);
}

/**
 * Saqlangan fayl uchun ochiq (brauzer) URL manzilini qaytaradi.
 */
export function getPublicUrl(bucket: string, objectPath: string): string {
  const safePath = objectPath.replace(/^\/+/, "").split(path.sep).join("/");
  return `/uploads/${bucket}/${safePath}`;
}

/**
 * Saqlangan faylni o'chiradi. Fayl topilmasa xatolikni yutadi.
 */
export async function deleteFile(bucket: string, objectPath: string): Promise<void> {
  const safePath = objectPath.replace(/^\/+/, "");
  const fullPath = path.join(UPLOAD_ROOT, bucket, safePath);
  try {
    await unlink(fullPath);
  } catch {
    // fayl allaqachon yo'q — e'tiborsiz qoldiramiz
  }
}
