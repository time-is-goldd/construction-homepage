import { createClient } from "@/lib/supabase/server";
import type { Partner } from "@/types/partner";

type PartnerRow = {
  id: string;
  company_name: string;
  label: string | null;
  start_year: number;
  end_year: number | null;
  description: string | null;
  achievements: unknown;
  logo_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

function mapPartner(row: PartnerRow): Partner {
  return {
    id: row.id,
    companyName: row.company_name,
    label: row.label,
    startYear: row.start_year,
    endYear: row.end_year,
    description: row.description,
    achievements: Array.isArray(row.achievements)
      ? (row.achievements as string[])
      : [],
    logoUrl: row.logo_url,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// 공개 페이지용 — 에러 시 빈 배열 반환(마이그레이션 전 graceful degradation)
export async function listPublishedPartners(): Promise<Partner[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapPartner);
  } catch (err) {
    console.error("[partners] listPublishedPartners error:", err);
    return [];
  }
}

// 관리자용 — 비공개 포함 전체 (테이블 미존재 시 빈 배열 반환)
export async function listAllPartners(): Promise<Partner[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapPartner);
  } catch (err) {
    console.error("[partners] listAllPartners error:", err);
    return [];
  }
}

export async function getPartnerById(id: string): Promise<Partner | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapPartner(data) : null;
  } catch (err) {
    console.error("[partners] getPartnerById error:", err);
    return null;
  }
}
