import { createClient } from "@/lib/supabase/server";
import type { SiteImage, SiteImageType } from "@/types/site-image";

type SiteImageRow = {
  id: string;
  type: SiteImageType;
  url: string;
  alt: string | null;
  category_slug: string | null;
  sort_order: number;
  created_at: string;
};

function mapSiteImage(row: SiteImageRow): SiteImage {
  return {
    id: row.id,
    type: row.type,
    url: row.url,
    alt: row.alt,
    categorySlug: row.category_slug,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export async function listSiteImages(type: SiteImageType): Promise<SiteImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_images")
    .select("*")
    .eq("type", type)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapSiteImage);
}

// 사업분야(슬러그)별 대표 이미지를 1장씩 매핑한다. 아직 업로드되지 않은
// 사업분야는 키가 존재하지 않으므로 호출 측에서 placeholder로 대체한다.
export async function getCategoryImageMap(): Promise<Record<string, SiteImage>> {
  const images = await listSiteImages("business_category");
  const map: Record<string, SiteImage> = {};
  for (const image of images) {
    if (image.categorySlug) map[image.categorySlug] = image;
  }
  return map;
}
