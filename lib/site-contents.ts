import { createClient } from "@/lib/supabase/server";
import type { SiteContent } from "@/types/site-content";

type SiteContentRow = {
  key: string;
  title: string;
  content: string;
  updated_at: string;
};

function mapRow(row: SiteContentRow): SiteContent {
  return {
    key: row.key,
    title: row.title,
    content: row.content,
    updatedAt: row.updated_at,
  };
}

// 단일 키 조회. DB에 없으면 null 반환 → 호출 측에서 fallback 적용.
export async function getSiteContent(key: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_contents")
    .select("content")
    .eq("key", key)
    .maybeSingle();
  return data?.content ?? null;
}

// 여러 키를 한 번의 쿼리로 조회 (N+1 방지).
export async function getMultipleSiteContents(
  keys: string[],
): Promise<Record<string, string>> {
  if (keys.length === 0) return {};
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_contents")
    .select("key, content")
    .in("key", keys);

  const result: Record<string, string> = {};
  for (const row of data ?? []) {
    result[row.key] = row.content;
  }
  return result;
}

// 관리자 전용: 모든 콘텐츠 행 조회 (updatedAt 포함).
// site_contents 마이그레이션이 아직 적용되지 않은 환경에서도 크래시하지 않도록
// 에러 시 빈 배열을 반환한다.
export async function listAllSiteContents(): Promise<SiteContent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_contents")
    .select("*")
    .order("key");
  if (error) {
    console.error("[site_contents] listAllSiteContents:", error.message);
    return [];
  }
  return (data ?? []).map((row) => mapRow(row as SiteContentRow));
}
