import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service Role 권한으로 동작하는 Supabase 클라이언트 (RLS 우회).
 *
 * 주의: Route Handler 등 서버 전용 코드에서만 사용한다.
 * `SUPABASE_SERVICE_ROLE_KEY`는 `NEXT_PUBLIC_` 접두사가 없어 브라우저로 전달되지 않으며,
 * 절대 Client Component나 클라이언트로 내려가는 코드에서 import하지 않는다.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
