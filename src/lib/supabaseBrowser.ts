import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | null = null;

/** Brauzer tomoni uchun ochiq (anon) kalit bilan Supabase klienti — faqat
 *  imzolangan yuklash URL'lariga fayl yuborish uchun ishlatiladi. */
export function supabaseBrowser() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
