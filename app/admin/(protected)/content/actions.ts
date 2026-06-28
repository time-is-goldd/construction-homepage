"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_KEY_DEFS } from "@/lib/content-keys";

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");
}

export type ContentActionState = { ok: true } | { error: string } | undefined;

export async function upsertSiteContent(
  key: string,
  _prevState: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  await requireAdminUser();

  // 허용된 키인지 검증 (임의 key 삽입 방지)
  const def = CONTENT_KEY_DEFS.find((d) => d.key === key);
  if (!def) return { error: "허용되지 않은 콘텐츠 키입니다." };

  const content = String(formData.get("content") ?? "").trim();

  const admin = createAdminClient();
  const { error } = await admin.from("site_contents").upsert(
    {
      key,
      title: def.title,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) return { error: error.message };

  // 해당 콘텐츠가 등장하는 페이지 캐시를 무효화한다.
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/business");
  revalidatePath("/admin/content");

  return { ok: true };
}
