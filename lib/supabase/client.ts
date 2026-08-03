import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso em Client Components ("use client").
 * Cria uma instância nova a cada chamada — é leve, o @supabase/ssr
 * já cuida de reaproveitar a sessão via cookies.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
