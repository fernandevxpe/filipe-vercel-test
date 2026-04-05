import { getSupabaseCredentials } from "@/lib/supabase/credentials";

export function isSupabaseConfigured(): boolean {
  return getSupabaseCredentials() !== null;
}

/** Com Supabase configurado na Vercel, o progresso só persiste com login. */
export function useCloudProgress(): boolean {
  return isSupabaseConfigured();
}
