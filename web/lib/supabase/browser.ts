"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
let boundUrl: string | null = null;
let boundKey: string | null = null;

/** Chamado pelo layout (servidor → props) antes de AuthNav/login usarem o cliente. */
export function setSupabaseBrowserCredentials(url: string, key: string) {
  const u = url.trim();
  const k = key.trim();
  if (!u || !k) return;
  if (u === boundUrl && k === boundKey && client) return;
  boundUrl = u;
  boundKey = k;
  client = null;
}

export function getSupabaseBrowserClient(): SupabaseClient {
  const url =
    boundUrl || (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.trim()) || "";
  const key =
    boundKey ||
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim()) ||
    "";
  if (!url || !key) {
    throw new Error("Supabase browser: credenciais em falta");
  }
  if (!client) {
    client = createBrowserClient(url, key);
  }
  return client;
}
