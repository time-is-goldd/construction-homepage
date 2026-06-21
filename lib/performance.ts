import { createClient } from "@/lib/supabase/server";
import type { PerformanceRecord } from "@/types/performance";

type PerformanceRecordRow = {
  id: string;
  year: number;
  client_name: string;
  project_name: string;
  work_type: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function mapPerformanceRecord(row: PerformanceRecordRow): PerformanceRecord {
  return {
    id: row.id,
    year: row.year,
    clientName: row.client_name,
    projectName: row.project_name,
    workType: row.work_type,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPerformanceRecords(): Promise<PerformanceRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("performance_records")
    .select("*")
    .order("year", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPerformanceRecord);
}

export async function getPerformanceRecordById(
  id: string,
): Promise<PerformanceRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("performance_records")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPerformanceRecord(data) : null;
}
