// 문의폼 첨부파일 1차 검증. 시공사례/사이트 이미지(lib/utils/image.ts)와 달리
// PDF도 허용한다 — ContactFormSection 기존 UI 문구("최대 5MB, JPG·PNG·PDF") 기준.
export const ALLOWED_ATTACHMENT_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

export type AttachmentValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateAttachmentFile(file: File): AttachmentValidationResult {
  if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
    return { ok: false, error: "첨부파일은 jpg/png/pdf 형식만 가능합니다." };
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return { ok: false, error: "첨부파일은 5MB를 초과할 수 없습니다." };
  }
  return { ok: true };
}
