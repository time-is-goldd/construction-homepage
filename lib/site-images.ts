import { createClient } from "@/lib/supabase/server";
import type { SiteImage, SiteImageType } from "@/types/site-image";

type SiteImageRow = {
  id: string;
  type: SiteImageType;
  url: string;
  alt: string | null;
  sort_order: number;
  created_at: string;
};

function mapSiteImage(row: SiteImageRow): SiteImage {
  return {
    id: row.id,
    type: row.type,
    url: row.url,
    alt: row.alt,
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
