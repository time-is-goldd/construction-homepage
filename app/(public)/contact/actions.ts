"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { uploadInquiryAttachment } from "@/lib/storage/upload-attachment";
import { validateAttachmentFile } from "@/lib/utils/attachment";
import { contactSchema } from "@/lib/validation/contactSchema";
import { sendContactMail } from "@/lib/resend/sendContactMail";

export type ContactActionState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }
  | undefined;

// ARCHITECTURE.md §5-1 처리 순서를 Server Action으로 구현한다(공개 폼이지만
// inquiries 테이블에는 INSERT 정책이 없어 service role 키로만 쓰기 가능 — §4-4).
export async function submitContactInquiry(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  // 1. 허니팟: 채워져 있으면 스팸으로 간주하고 봇에게 들키지 않도록 성공으로 위장한다.
  const honeypot = formData.get("honeypot");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { ok: true };
  }

  // 2. zod 서버 재검증 (클라이언트는 react-hook-form + 동일 스키마로 1차 검증)
  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    type: formData.get("type") ?? "",
    title: formData.get("title") ?? "",
    message: formData.get("message") ?? "",
    agreePrivacy: formData.get("agreePrivacy") === "true",
    honeypot: "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      ok: false,
      error: "입력값을 다시 확인해주세요.",
      fieldErrors,
    };
  }

  const attachment = formData.get("attachment");
  let attachmentFile: File | null = null;
  if (attachment instanceof File && attachment.size > 0) {
    const result = validateAttachmentFile(attachment);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    attachmentFile = attachment;
  }

  const { name, phone, email, type, title, message } = parsed.data;

  // 3. inquiries 테이블에 우선 저장 (메일 발송 성공 여부와 무관하게 보장)
  const admin = createAdminClient();
  const { data: inquiry, error: insertError } = await admin
    .from("inquiries")
    .insert({
      name,
      phone,
      email,
      type,
      title: title || null,
      message,
    })
    .select("id")
    .single();

  if (insertError || !inquiry) {
    return {
      ok: false,
      error: "문의 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
    };
  }

  // 4. 첨부파일이 있으면 업로드 후 URL(경로) 기록 — 비공개 버킷이라 관리자 화면에서
  // 열람 시점에 서명 URL을 새로 발급한다(createSignedAttachmentUrl).
  if (attachmentFile) {
    try {
      const { path } = await uploadInquiryAttachment(inquiry.id, attachmentFile);
      await admin.from("inquiries").update({ attachment_url: path }).eq("id", inquiry.id);
    } catch (err) {
      console.error("첨부파일 업로드 실패:", err);
      // 첨부파일 업로드 실패는 문의 저장 자체를 무효화하지 않는다.
    }
  }

  // 5. 회사 메일 발송(실패해도 위 저장 결과는 유지, 실패 로그만 남긴다)
  const mailResult = await sendContactMail({ name, phone, email, type, title, message });
  if (!mailResult.ok) {
    console.error("문의 알림 메일 발송 실패:", mailResult.error);
  }

  return { ok: true };
}
