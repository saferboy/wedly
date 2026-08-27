import { supabaseBrowser } from "./supabaseBrowser";

const MAX_SIZE: Record<"photo" | "music", number> = {
  photo: 8 * 1024 * 1024, // 8MB
  music: 15 * 1024 * 1024, // 15MB
};

/**
 * Faylni Supabase Storage'ga to'g'ridan-to'g'ri (Vercel funksiyasini
 * chetlab o'tib) yuklaydi: server imzolangan URL beradi, fayl esa
 * brauzerdan bevosita Storage'ga ketadi — hajm chegarasi yo'q.
 */
export async function uploadFile(
  type: "photo" | "music",
  name: string,
  file: File
): Promise<string> {
  const max = MAX_SIZE[type];
  if (file.size > max) {
    throw new Error(`Fayl hajmi katta. Maksimal: ${Math.round(max / 1024 / 1024)}MB`);
  }

  const ext = file.name.split(".").pop() ?? "";
  const signRes = await fetch("/api/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, name, ext }),
  });
  const signData = await signRes.json();
  if (!signRes.ok) throw new Error(signData.error ?? "Yuklash xatosi");

  const { error } = await supabaseBrowser()
    .storage.from(signData.bucket)
    .uploadToSignedUrl(signData.path, signData.token, file, {
      contentType: file.type || undefined,
    });
  if (error) throw new Error(error.message || "Yuklash xatosi");

  return signData.publicUrl as string;
}
