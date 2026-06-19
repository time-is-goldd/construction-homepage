// 관리자 이미지 업로드 1차 검증(클라이언트/서버 공통 기준).
// DEVELOPMENT_PLAN.md Phase4 완료조건: "5MB 초과 또는 비허용 포맷 업로드 시 에러 메시지로 거부".
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type ImageValidationResult = { ok: true } | { ok: false; error: string };

export function validateImageFile(file: File): ImageValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: `${file.name}: jpg/png/webp 형식만 업로드할 수 있습니다.` };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: `${file.name}: 5MB를 초과할 수 없습니다.` };
  }
  return { ok: true };
}
