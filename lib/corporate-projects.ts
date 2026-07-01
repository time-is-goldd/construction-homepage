import { createClient } from "@/lib/supabase/server";
import type { CorporateProject } from "@/types/corporate-project";

type CorporateProjectRow = {
  id: string;
  title: string;
  image_url: string | null;
  summary: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

function mapProject(row: CorporateProjectRow): CorporateProject {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    summary: row.summary,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPublishedProjects(): Promise<CorporateProject[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("corporate_projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapProject);
  } catch (err) {
    console.error("[corporate-projects] listPublishedProjects error:", err);
    return [];
  }
}

export async function listAllProjects(): Promise<CorporateProject[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("corporate_projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapProject);
  } catch (err) {
    console.error("[corporate-projects] listAllProjects error:", err);
    return [];
  }
}

export async function getProjectById(
  id: string,
): Promise<CorporateProject | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("corporate_projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProject(data) : null;
  } catch (err) {
    console.error("[corporate-projects] getProjectById error:", err);
    return null;
  }
}
