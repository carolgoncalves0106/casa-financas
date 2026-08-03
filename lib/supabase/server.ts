import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para uso em Server Components, Route Handlers e Server
 * Actions. Lê/grava a sessão nos cookies da requisição.
 *
 * Em Server Components puros, `setAll` pode falhar silenciosamente (Next.js
 * não deixa escrever cookies fora de Server Actions/Route Handlers) — o
 * try/catch abaixo é o padrão recomendado pelo próprio Supabase, e não
 * atrapalha porque o middleware já cuida de manter a sessão atualizada.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado a partir de um Server Component — pode ser ignorado
            // porque o middleware.ts já renova a sessão a cada requisição.
          }
        },
      },
    }
  );
}
