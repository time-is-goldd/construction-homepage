import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Component에서 사용하는 Supabase 클라이언트.
 * 로그인 폼, 관리자 이미지 업로드 등 브라우저에서 직접 호출이 필요한 곳에서 사용한다.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
