import { createClient } from "@/lib/supabase/server";
import type { Inquiry, InquiryStatus, InquiryType } from "@/types/inquiry";

type InquiryRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: InquiryType;
  title: string | null;
  message: string;
  attachment_url: string | null;
  status: InquiryStatus;
  admin_memo: string | null;
  created_at: string;
};

function mapInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    type: row.type,
    title: row.title,
    message: row.message,
    attachmentUrl: row.attachment_url,
    status: row.status,
    adminMemo: row.admin_memo,
    createdAt: row.created_at,
  };
}

type ListInquiriesOptions = {
  status?: InquiryStatus;
  type?: InquiryType;
};

// /admin/inquiries 목록 조회. authenticated 세션의 쿠키 기반 클라이언트를 사용해
// RLS("admin read inquiries")에 그대로 의존한다 — service role은 공개 폼 제출
// 경로(app/(public)/contact/actions.ts)에서만 사용한다.
export async function listInquiries({
  status,
  type,
}: ListInquiriesOptions = {}): Promise<Inquiry[]> {
  const supabase = await createClient();
  let query = supabase.from("inquiries").select("*").order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapInquiry);
}

export async function getInquiryById(id: string): Promise<Inquiry | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapInquiry(data) : null;
}

export async function countInquiriesByStatus(): Promise<
  Record<InquiryStatus, number>
> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("inquiries").select("status");
  if (error) throw error;

  const counts: Record<InquiryStatus, number> = { new: 0, in_progress: 0, done: 0 };
  for (const row of data ?? []) {
    counts[row.status as InquiryStatus]++;
  }
  return counts;
}
