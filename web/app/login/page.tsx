import { getSupabaseCredentials } from "@/lib/supabase/credentials";
import { LoginClient } from "./LoginClient";

export default function LoginPage() {
  const creds = getSupabaseCredentials();
  return <LoginClient supabaseReady={!!creds} />;
}
