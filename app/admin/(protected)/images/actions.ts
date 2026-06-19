"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  deleteStorageImageByUrl,
  uploadOptimizedImage,
} from "@/lib/storage/upload-image";
import { validateImageFile } from "@/lib/utils/image";
import type { SiteImageType } from "@/types/site-image";

// IMAGE_OPTIMIZATION_PLAN.md §1 기준 타입별 긴 변 제한.
// main_visual은 풀블리드 배경이라 1920px까지 허용(보유 해상도가 작으면 업스케일 없이 그대로 유지).
const LONG_EDGE_BY_TYPE: Record<SiteImageType, number> = {
  main_visual: 1920,
  logo: 720,
  business_license: 1600,
};

export type SiteImageActionState = { error: string } | undefined;

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }
}

export async function uploadSiteImage(
  type: SiteImageType,
  _prevState: SiteImageActionState,
  formData: FormData,
): Promise<SiteImageActionState> {
  await requireAdminUser();

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "업로드할 이미지를 선택해주세요." };
  }

  const result = validateImageFile(file);
  if (!result.ok) return { error: result.error };

  const admin = createAdminClient();
  const { count } = await admin
    .from("site_images")
    .select("*", { count: "exact", head: true })
    .eq("type", type);

  const { url } = await uploadOptimizedImage({
    bucket: "site-images",
    folder: type,
    file,
    longEdge: LONG_EDGE_BY_TYPE[type],
  });

  const { error } = await admin.from("site_images").insert({
    type,
    url,
    sort_order: count ?? 0,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/images");
  revalidatePath("/");
  return undefined;
}

export async function deleteSiteImage(imageId: string): Promise<void> {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: image } = await admin
    .from("site_images")
    .select("url")
    .eq("id", imageId)
    .maybeSingle();

  if (image) {
    await deleteStorageImageByUrl(image.url);
  }

  const { error } = await admin.from("site_images").delete().eq("id", imageId);
  if (error) throw error;

  revalidatePath("/admin/images");
  revalidatePath("/");
}
