"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  deleteStorageImageByUrl,
  uploadOptimizedImage,
} from "@/lib/storage/upload-image";
import { validateImageFile } from "@/lib/utils/image";
import { partnerSchema } from "@/lib/validation/partnerSchema";

export type PartnerActionState = { error: string } | undefined;

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");
}

function readPartnerFormData(formData: FormData) {
  const endYearRaw = (formData.get("endYear") as string | null) ?? "";
  const endYear =
    endYearRaw.trim() !== "" ? parseInt(endYearRaw.trim(), 10) : null;

  const achievementsRaw = (formData.get("achievements") as string) ?? "";
  const achievements = achievementsRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const parsed = partnerSchema.safeParse({
    companyName: formData.get("companyName") ?? "",
    startYear: formData.get("startYear") ?? "",
    achievements: achievementsRaw,
    sortOrder: formData.get("sortOrder") ?? "0",
    isPublished: formData.get("isPublished") ?? "true",
  });

  return { parsed, endYear, achievements };
}

export async function createPartner(
  _prevState: PartnerActionState,
  formData: FormData,
): Promise<PartnerActionState> {
  await requireAdminUser();

  const { parsed, endYear, achievements } = readPartnerFormData(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.",
    };
  }

  const admin = createAdminClient();
  const { data: partner, error } = await admin
    .from("partners")
    .insert({
      company_name: parsed.data.companyName,
      start_year: parsed.data.startYear,
      end_year: endYear,
      achievements,
      sort_order: parsed.data.sortOrder,
      is_published: parsed.data.isPublished,
    })
    .select("id")
    .single();

  if (error || !partner) {
    return { error: error?.message ?? "파트너 등록에 실패했습니다." };
  }

  // 로고 업로드 (선택, 실패해도 등록은 완료)
  const logoFile = formData.get("logo") as File | null;
  if (logoFile && logoFile.size > 0) {
    const validation = validateImageFile(logoFile);
    if (validation.ok) {
      try {
        const { url } = await uploadOptimizedImage({
          bucket: "site-images",
          folder: `partners/${partner.id}`,
          file: logoFile,
          longEdge: 400,
          quality: 85,
        });
        await admin
          .from("partners")
          .update({ logo_url: url })
          .eq("id", partner.id);
      } catch {
        // 로고 업로드 실패는 비치명적 — 편집 페이지에서 재업로드 가능
      }
    }
  }

  revalidatePath("/admin/performance");
  revalidatePath("/performance");
  redirect("/admin/performance?success=partner");
}

export async function updatePartner(
  partnerId: string,
  _prevState: PartnerActionState,
  formData: FormData,
): Promise<PartnerActionState> {
  await requireAdminUser();

  const { parsed, endYear, achievements } = readPartnerFormData(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.",
    };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("partners")
    .update({
      company_name: parsed.data.companyName,
      start_year: parsed.data.startYear,
      end_year: endYear,
      achievements,
      sort_order: parsed.data.sortOrder,
      is_published: parsed.data.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", partnerId);

  if (error) return { error: error.message };

  revalidatePath("/admin/performance");
  revalidatePath(`/admin/performance/partners/${partnerId}`);
  revalidatePath("/performance");
  return undefined;
}

export async function uploadPartnerLogo(
  partnerId: string,
  _prevState: PartnerActionState,
  formData: FormData,
): Promise<PartnerActionState> {
  await requireAdminUser();

  const file = formData.get("logo") as File | null;
  if (!file || file.size === 0) {
    return { error: "업로드할 이미지를 선택해주세요." };
  }

  const validation = validateImageFile(file);
  if (!validation.ok) return { error: validation.error };

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("partners")
    .select("logo_url")
    .eq("id", partnerId)
    .maybeSingle();
  if (existing?.logo_url) {
    await deleteStorageImageByUrl(existing.logo_url).catch(() => {});
  }

  const { url } = await uploadOptimizedImage({
    bucket: "site-images",
    folder: `partners/${partnerId}`,
    file,
    longEdge: 400,
    quality: 85,
  });

  const { error } = await admin
    .from("partners")
    .update({ logo_url: url, updated_at: new Date().toISOString() })
    .eq("id", partnerId);

  if (error) return { error: error.message };

  revalidatePath("/admin/performance");
  revalidatePath(`/admin/performance/partners/${partnerId}`);
  revalidatePath("/performance");
}

export async function deletePartnerLogo(partnerId: string): Promise<void> {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: partner } = await admin
    .from("partners")
    .select("logo_url")
    .eq("id", partnerId)
    .maybeSingle();

  if (partner?.logo_url) {
    await deleteStorageImageByUrl(partner.logo_url).catch(() => {});
  }

  const { error } = await admin
    .from("partners")
    .update({ logo_url: null, updated_at: new Date().toISOString() })
    .eq("id", partnerId);

  if (error) throw error;

  revalidatePath("/admin/performance");
  revalidatePath(`/admin/performance/partners/${partnerId}`);
  revalidatePath("/performance");
}

export async function deletePartner(partnerId: string): Promise<void> {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: partner } = await admin
    .from("partners")
    .select("logo_url")
    .eq("id", partnerId)
    .maybeSingle();
  if (partner?.logo_url) {
    await deleteStorageImageByUrl(partner.logo_url).catch(() => {});
  }

  const { error } = await admin.from("partners").delete().eq("id", partnerId);
  if (error) throw error;

  revalidatePath("/admin/performance");
  revalidatePath("/performance");
}
