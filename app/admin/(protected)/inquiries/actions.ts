"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { InquiryStatus } from "@/types/inquiry";

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }
  return supabase;
}

// inquiries는 RLS상 authenticated만 update 가능 — 쿠키 기반 서버 클라이언트를
// 그대로 사용하면(서비스 role 불필요) RLS가 자연스럽게 권한을 검증해준다.
export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<void> {
  const supabase = await requireAdminUser();
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin");
}

export async function updateInquiryMemo(id: string, memo: string): Promise<void> {
  const supabase = await requireAdminUser();
  const { error } = await supabase
    .from("inquiries")
    .update({ admin_memo: memo || null })
    .eq("id", id);
  if (error) throw error;

  revalidatePath(`/admin/inquiries/${id}`);
}
