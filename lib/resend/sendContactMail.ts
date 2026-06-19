import { Resend } from "resend";
import { INQUIRY_TYPE_OPTIONS } from "@/lib/validation/contactSchema";
import type { InquiryType } from "@/types/inquiry";

// 도메인 인증 전 단계라 Resend 테스트 발신 도메인을 사용한다. 실제 도메인을
// 인증하면 이 주소만 교체하면 된다(TECH_STACK.md/ARCHITECTURE.md 기준).
const FROM_ADDRESS = "대화시스템 홈페이지 <onboarding@resend.dev>";

type ContactMailInput = {
  name: string;
  phone: string;
  email: string;
  type: InquiryType;
  title?: string | null;
  message: string;
};

export type SendContactMailResult = { ok: true } | { ok: false; error: string };

// ARCHITECTURE.md §5-1: inquiries INSERT(저장)는 이 함수 호출 전에 이미 끝나 있어야
// 한다 — 메일 발송 실패가 저장 성공 여부에 영향을 주지 않도록 호출 측에서 보장한다.
export async function sendContactMail(
  inquiry: ContactMailInput,
): Promise<SendContactMailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const receiver = process.env.CONTACT_RECEIVER_EMAIL;

  if (!apiKey || !receiver) {
    return {
      ok: false,
      error: "RESEND_API_KEY 또는 CONTACT_RECEIVER_EMAIL이 설정되지 않았습니다.",
    };
  }

  const typeLabel =
    INQUIRY_TYPE_OPTIONS.find((option) => option.value === inquiry.type)
      ?.label ?? inquiry.type;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: receiver,
      replyTo: inquiry.email,
      subject: `[홈페이지 문의] ${typeLabel}/${inquiry.name}`,
      html: `
        <h2>새 문의가 접수되었습니다</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          <tr><td><b>이름</b></td><td>${escapeHtml(inquiry.name)}</td></tr>
          <tr><td><b>연락처</b></td><td>${escapeHtml(inquiry.phone)}</td></tr>
          <tr><td><b>이메일</b></td><td>${escapeHtml(inquiry.email)}</td></tr>
          <tr><td><b>유형</b></td><td>${escapeHtml(typeLabel)}</td></tr>
          <tr><td><b>제목</b></td><td>${escapeHtml(inquiry.title ?? "-")}</td></tr>
        </table>
        <p><b>내용</b></p>
        <p>${escapeHtml(inquiry.message).replace(/\n/g, "<br/>")}</p>
        <p style="color:#888;font-size:13px">관리자 화면(/admin/inquiries)에서 전체 내역을 확인할 수 있습니다.</p>
      `,
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "메일 발송 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
