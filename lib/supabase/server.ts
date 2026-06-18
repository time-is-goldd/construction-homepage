import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Component / Server Action에서 사용하는 Supabase 클라이언트.
 * 쿠키 기반 세션을 읽고, 가능한 경우 갱신된 세션 쿠키를 다시 기록한다.
 */
export async function createClient() {
  const cookieStore = await cookies();

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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component에서는 쿠키 쓰기가 불가능할 수 있다.
            // 이 경우 미들웨어가 세션 갱신을 대신 처리하므로 무시한다.
          }
        },
      },
    },
  );
}
