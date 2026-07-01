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
import { corporateProjectSchema } from "@/lib/validation/corporateProjectSchema";

export type ProjectActionState = { error: string } | undefined;

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");
}

function readProjectFormData(formData: FormData) {
  return corporateProjectSchema.safeParse({
    title: formData.get("title") ?? "",
    summary: formData.get("summary") ?? "",
    sortOrder: formData.get("sortOrder") ?? "0",
    isPublished: formData.get("isPublished") ?? "true",
  });
}

export async function createProject(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  await requireAdminUser();

  const parsed = readProjectFormData(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.",
    };
  }

  const admin = createAdminClient();
  const { data: project, error } = await admin
    .from("corporate_projects")
    .insert({
      title: parsed.data.title,
      summary: parsed.data.summary || null,
      sort_order: parsed.data.sortOrder,
      is_published: parsed.data.isPublished,
    })
    .select("id")
    .single();

  if (error || !project) {
    return { error: error?.message ?? "등록에 실패했습니다." };
  }

  // 이미지 업로드 (선택, 실패해도 등록은 완료)
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const validation = validateImageFile(imageFile);
    if (validation.ok) {
      try {
        const { url } = await uploadOptimizedImage({
          bucket: "site-images",
          folder: `projects/${project.id}`,
          file: imageFile,
          longEdge: 900,
          quality: 82,
        });
        await admin
          .from("corporate_projects")
          .update({ image_url: url })
          .eq("id", project.id);
      } catch {
        // 이미지 업로드 실패는 비치명적 — 편집 페이지에서 재업로드 가능
      }
    }
  }

  revalidatePath("/admin/performance");
  revalidatePath("/performance");
  redirect("/admin/performance?success=project");
}

export async function updateProject(
  projectId: string,
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  await requireAdminUser();

  const parsed = readProjectFormData(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.",
    };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("corporate_projects")
    .update({
      title: parsed.data.title,
      summary: parsed.data.summary || null,
      sort_order: parsed.data.sortOrder,
      is_published: parsed.data.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  if (error) return { error: error.message };

  revalidatePath("/admin/performance");
  revalidatePath(`/admin/performance/projects/${projectId}`);
  revalidatePath("/performance");
  return undefined;
}

export async function uploadProjectImage(
  projectId: string,
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  await requireAdminUser();

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) {
    return { error: "업로드할 이미지를 선택해주세요." };
  }

  const validation = validateImageFile(file);
  if (!validation.ok) return { error: validation.error };

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("corporate_projects")
    .select("image_url")
    .eq("id", projectId)
    .maybeSingle();
  if (existing?.image_url) {
    await deleteStorageImageByUrl(existing.image_url).catch(() => {});
  }

  const { url } = await uploadOptimizedImage({
    bucket: "site-images",
    folder: `projects/${projectId}`,
    file,
    longEdge: 900,
    quality: 82,
  });

  const { error } = await admin
    .from("corporate_projects")
    .update({ image_url: url, updated_at: new Date().toISOString() })
    .eq("id", projectId);

  if (error) return { error: error.message };

  revalidatePath("/admin/performance");
  revalidatePath(`/admin/performance/projects/${projectId}`);
  revalidatePath("/performance");
}

export async function deleteProjectImage(projectId: string): Promise<void> {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: project } = await admin
    .from("corporate_projects")
    .select("image_url")
    .eq("id", projectId)
    .maybeSingle();

  if (project?.image_url) {
    await deleteStorageImageByUrl(project.image_url).catch(() => {});
  }

  const { error } = await admin
    .from("corporate_projects")
    .update({ image_url: null, updated_at: new Date().toISOString() })
    .eq("id", projectId);

  if (error) throw error;

  revalidatePath("/admin/performance");
  revalidatePath(`/admin/performance/projects/${projectId}`);
  revalidatePath("/performance");
}

export async function deleteProject(projectId: string): Promise<void> {
  await requireAdminUser();
  const admin = createAdminClient();

  const { data: project } = await admin
    .from("corporate_projects")
    .select("image_url")
    .eq("id", projectId)
    .maybeSingle();
  if (project?.image_url) {
    await deleteStorageImageByUrl(project.image_url).catch(() => {});
  }

  const { error } = await admin
    .from("corporate_projects")
    .delete()
    .eq("id", projectId);
  if (error) throw error;

  revalidatePath("/admin/performance");
  revalidatePath("/performance");
}
