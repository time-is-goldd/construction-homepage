"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { performanceSchema } from "@/lib/validation/performanceSchema";

export type PerformanceActionState = { error: string } | undefined;

// 미들웨어/레이아웃이 이미 /admin/* 접근을 보호하지만(ARCHITECTURE.md §4-3 defense in
// depth), Server Action은 별도 경로로 직접 호출될 수 있어 여기서도 세션을 검증한다.
async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }
}

function readPerformanceFormData(formData: FormData) {
  return performanceSchema.safeParse({
    year: formData.get("year") ?? "",
    clientName: formData.get("clientName") ?? "",
    projectName: formData.get("projectName") ?? "",
    workType: formData.get("workType") ?? "",
  });
}

export async function createPerformanceRecord(
  _prevState: PerformanceActionState,
  formData: FormData,
): Promise<PerformanceActionState> {
  await requireAdminUser();

  const parsed = readPerformanceFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("performance_records").insert({
    year: parsed.data.year,
    client_name: parsed.data.clientName,
    project_name: parsed.data.projectName,
    work_type: parsed.data.workType,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/performance");
  revalidatePath("/performance");
  redirect("/admin/performance");
}

export async function updatePerformanceRecord(
  recordId: string,
  _prevState: PerformanceActionState,
  formData: FormData,
): Promise<PerformanceActionState> {
  await requireAdminUser();

  const parsed = readPerformanceFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("performance_records")
    .update({
      year: parsed.data.year,
      client_name: parsed.data.clientName,
      project_name: parsed.data.projectName,
      work_type: parsed.data.workType,
      updated_at: new Date().toISOString(),
    })
    .eq("id", recordId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/performance");
  revalidatePath("/performance");
  redirect("/admin/performance");
}

export async function deletePerformanceRecord(recordId: string): Promise<void> {
  await requireAdminUser();
  const admin = createAdminClient();

  const { error } = await admin
    .from("performance_records")
    .delete()
    .eq("id", recordId);
  if (error) throw error;

  revalidatePath("/admin/performance");
  revalidatePath("/performance");
}
