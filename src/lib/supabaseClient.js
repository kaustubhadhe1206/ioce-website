import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

const BUCKET = 'videos';

/**
 * Resolves a filename in the `videos` bucket to a public URL.
 * Falls back to null (rendered as a poster-only section) until
 * VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set.
 */
export function getVideoUrl(filename) {
  if (!isSupabaseConfigured) return null;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data?.publicUrl ?? null;
}
