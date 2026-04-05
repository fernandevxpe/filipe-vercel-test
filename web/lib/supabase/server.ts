import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseCredentials } from "@/lib/supabase/credentials";

export function createSupabaseServerClient(): SupabaseClient {
  const creds = getSupabaseCredentials();
  if (!creds) {
    throw new Error("Supabase: faltam URL e chave anon (NEXT_PUBLIC_* ou SUPABASE_URL / SUPABASE_ANON_KEY)");
  }
  const { url, key } = creds;
  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll: ((cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* Server Component / route sem mutação de cookies */
        }
      }) satisfies SetAllCookies,
    },
  });
}

export async function getSupabaseUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}
