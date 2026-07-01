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
import { workSchema } from "@/lib/validation/workSchema";

const WORK_IMAGE_LONG_EDGE = 1600;

export type WorkActionState = { error: string } | undefined;
export type ImageActionState = { error: string } | undefined;

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

function readWorkFormData(formData: FormData) {
  return workSchema.safeParse({
    title: formData.get("title") ?? "",
    summary: formData.get("summary") ?? "",
    content: formData.get("content") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    location: formData.get("location") ?? "",
    isPublished: formData.get("isPublished") === "on",
  });
}

export async function createWork(
  _prevState: WorkActionState,
  formData: FormData,
): Promise<WorkActionState> {
  await requireAdminUser();

  const parsed = readWorkFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const admin = createAdminClient();
  const { data: work, error } = await admin
    .from("works")
    .insert({
      title: parsed.data.title,
      summary: parsed.data.summary || null,
      content: parsed.data.content || null,
      category_id: parsed.data.categoryId,
      location: parsed.data.location || null,
      is_published: parsed.data.isPublished,
    })
    .select("id")
    .single();

  if (error || !work) {
    return { error: error?.message ?? "시공사례 등록에 실패했습니다." };
  }

  // 이미지 업로드 (선택, 실패해도 등록은 완료)
  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  for (const [index, file] of files.entries()) {
    const result = validateImageFile(file);
    if (!result.ok) continue;
    try {
      const { url } = await uploadOptimizedImage({
        bucket: "work-images",
        folder: work.id,
        file,
        longEdge: WORK_IMAGE_LONG_EDGE,
      });
      await admin.from("work_images").insert({
        work_id: work.id,
        url,
        is_main: index === 0,
        sort_order: index,
      });
    } catch {
      // 이미지 업로드 실패는 비치명적 — 편집 페이지에서 재업로드 가능
    }
  }

  revalidatePath("/admin/works");
  revalidatePath("/works");
  redirect("/admin/works?success=work");
}

export async function updateWork(
  workId: string,
  _prevState: WorkActionState,
  formData: FormData,
): Promise<WorkActionState> {
  await requireAdminUser();

  const parsed = readWorkFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("works")
    .update({
      title: parsed.data.title,
      summary: parsed.data.summary || null,
      content: parsed.data.content || null,
      category_id: parsed.data.categoryId,
      location: parsed.data.location || null,
      is_published: parsed.data.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", workId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/works");
  revalidatePath(`/admin/works/${workId}`);
  revalidatePath("/works");
  revalidatePath(`/works/${workId}`);
  return undefined;
}

export async function deleteWork(workId: string): Promise<void> {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: images } = await admin
    .from("work_images")
    .select("url")
    .eq("work_id", workId);

  for (const image of images ?? []) {
    await deleteStorageImageByUrl(image.url);
  }

  const { error } = await admin.from("works").delete().eq("id", workId);
  if (error) throw error;

  revalidatePath("/admin/works");
  revalidatePath("/works");
}

export async function togglePublish(workId: string, value: boolean): Promise<void> {
  await requireAdminUser();
  const admin = createAdminClient();

  const { error } = await admin
    .from("works")
    .update({ is_published: value, updated_at: new Date().toISOString() })
    .eq("id", workId);
  if (error) throw error;

  revalidatePath("/admin/works");
  revalidatePath("/works");
  revalidatePath(`/works/${workId}`);
}

export async function addWorkImages(
  workId: string,
  _prevState: ImageActionState,
  formData: FormData,
): Promise<ImageActionState> {
  await requireAdminUser();

  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    return { error: "업로드할 이미지를 선택해주세요." };
  }

  for (const file of files) {
    const result = validateImageFile(file);
    if (!result.ok) return { error: result.error };
  }

  const admin = createAdminClient();
  const { count } = await admin
    .from("work_images")
    .select("*", { count: "exact", head: true })
    .eq("work_id", workId);
  const existingCount = count ?? 0;

  for (const [index, file] of files.entries()) {
    const { url } = await uploadOptimizedImage({
      bucket: "work-images",
      folder: workId,
      file,
      longEdge: WORK_IMAGE_LONG_EDGE,
    });

    const { error } = await admin.from("work_images").insert({
      work_id: workId,
      url,
      is_main: existingCount === 0 && index === 0,
      sort_order: existingCount + index,
    });
    if (error) return { error: error.message };
  }

  revalidatePath(`/admin/works/${workId}`);
  revalidatePath(`/works/${workId}`);
  return undefined;
}

export async function deleteWorkImage(imageId: string, workId: string): Promise<void> {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: image } = await admin
    .from("work_images")
    .select("url")
    .eq("id", imageId)
    .maybeSingle();

  if (image) {
    await deleteStorageImageByUrl(image.url);
  }

  const { error } = await admin.from("work_images").delete().eq("id", imageId);
  if (error) throw error;

  revalidatePath(`/admin/works/${workId}`);
  revalidatePath(`/works/${workId}`);
}
