"use client";

import { useLayoutEffect } from "react";
import { setSupabaseBrowserCredentials } from "@/lib/supabase/browser";

/** Injeta URL/anon key lidas no servidor no cliente (evita bundle sem NEXT_PUBLIC na Vercel). */
export default function SupabaseRuntimeInit({ url, key }: { url: string; key: string }) {
  useLayoutEffect(() => {
    if (url && key) setSupabaseBrowserCredentials(url, key);
  }, [url, key]);
  return null;
}
