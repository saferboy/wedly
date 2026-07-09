import { createClient } from "@supabase/supabase-js";

export const STORAGE_BUCKETS = {
  photos: "photos",
  music: "music",
} as const;

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars yo'q");
  return createClient(url, key);
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin env vars yo'q");
  return createClient(url, key);
}

export function getPublicUrl(bucket: string, path: string) {
  const client = getClient();
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function getSupabaseAdmin() {
  return getAdminClient();
}

export function getSupabase() {
  return getClient();
}
