/**
 * Credenciais Supabase em runtime (Node, Edge, rotas).
 * Aceita NEXT_PUBLIC_* (típico local / build) ou SUPABASE_URL + SUPABASE_ANON_KEY
 * (na Vercel podem estar disponíveis sem depender só do que foi embutido no bundle cliente).
 */
export function getSupabaseCredentials(): { url: string; key: string } | null {
  const url =
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)?.trim() || "";
  const key =
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)?.trim() || "";
  if (!url || !key) return null;
  return { url, key };
}
