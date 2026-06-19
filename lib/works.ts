import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/category";
import type { Work, WorkImage } from "@/types/work";

// works/page.tsx, works/[id]/page.tsx에서 공사유형이 확인되지 않은 시공사례를
// 필터링/표시하기 위한 UI 전용 가상 카테고리. categories 테이블에는 존재하지
// 않으며 category_id가 null인 work을 가리킨다.
export const UNCLASSIFIED_CATEGORY: Category = {
  id: "unclassified",
  name: "공사유형 확인중",
  slug: "unclassified",
  sortOrder: 999,
  createdAt: "",
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
};

type WorkImageRow = {
  id: string;
  work_id: string;
  url: string;
  alt: string | null;
  is_main: boolean;
  sort_order: number;
  created_at: string;
};

type WorkRow = {
  id: string;
  category_id: string | null;
  category: CategoryRow | null;
  title: string;
  summary: string | null;
  content: string | null;
  client_name: string | null;
  is_client_hidden: boolean;
  scale: string | null;
  period: string | null;
  location: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  images: WorkImageRow[];
};

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function mapWorkImage(row: WorkImageRow): WorkImage {
  return {
    id: row.id,
    workId: row.work_id,
    url: row.url,
    alt: row.alt,
    isMain: row.is_main,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function mapWork(row: WorkRow): Work {
  return {
    id: row.id,
    categoryId: row.category_id,
    category: row.category ? mapCategory(row.category) : UNCLASSIFIED_CATEGORY,
    title: row.title,
    summary: row.summary,
    content: row.content,
    clientName: row.client_name,
    isClientHidden: row.is_client_hidden,
    scale: row.scale,
    period: row.period,
    location: row.location,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    images: [...(row.images ?? [])]
      .sort((a, b) => (a.sort_order - b.sort_order) || a.id.localeCompare(b.id))
      .map(mapWorkImage),
  };
}

const WORK_SELECT = "*, category:categories(*), images:work_images(*)";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapCategory);
}

export async function getCategoriesWithUnclassified(): Promise<Category[]> {
  return [...(await getCategories()), UNCLASSIFIED_CATEGORY];
}

type ListWorksOptions = {
  publishedOnly?: boolean;
};

export async function listWorks({
  publishedOnly = false,
}: ListWorksOptions = {}): Promise<Work[]> {
  const supabase = await createClient();
  let query = supabase
    .from("works")
    .select(WORK_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (publishedOnly) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => mapWork(row as unknown as WorkRow));
}

type GetWorkOptions = {
  publishedOnly?: boolean;
};

export async function getWorkById(
  id: string,
  { publishedOnly = false }: GetWorkOptions = {},
): Promise<Work | null> {
  const supabase = await createClient();
  let query = supabase.from("works").select(WORK_SELECT).eq("id", id);

  if (publishedOnly) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data ? mapWork(data as unknown as WorkRow) : null;
}
