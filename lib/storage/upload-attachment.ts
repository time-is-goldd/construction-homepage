import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

// ARCHITECTURE.md §7-1 inquiry-attachments 경로 규칙: {inquiry_id}/{uuid}-{filename}.
// 비공개 버킷이므로 service role로만 업로드/서명 URL 발급이 가능하다.
const BUCKET = "inquiry-attachments" as const;

export async function uploadInquiryAttachment(
  inquiryId: string,
  file: File,
): Promise<{ path: string }> {
  const path = `${inquiryId}/${randomUUID()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
  });
  if (error) throw error;

  return { path };
}

export async function createSignedAttachmentUrl(
  path: string,
  expiresInSeconds = 600,
): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data) return null;
  return data.signedUrl;
}
