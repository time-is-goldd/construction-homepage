import { z } from "zod";

export const INQUIRY_TYPE_OPTIONS = [
  { value: "quote", label: "견적 문의" },
  { value: "partnership", label: "제휴 문의" },
  { value: "as", label: "AS 문의" },
  { value: "etc", label: "기타" },
] as const;

const PHONE_REGEX = /^[0-9-+\s]{8,20}$/;

// ContactForm.tsx(react-hook-form)에서 클라이언트 검증에, app/(public)/contact/actions.ts
// 에서 서버 재검증에 동일하게 사용한다(ARCHITECTURE.md §5-1 처리 순서 2번).
export const contactSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요."),
  phone: z
    .string()
    .trim()
    .min(1, "연락처를 입력해주세요.")
    .regex(PHONE_REGEX, "올바른 연락처 형식이 아닙니다."),
  email: z.string().trim().min(1, "이메일을 입력해주세요.").email("올바른 이메일 형식이 아닙니다."),
  type: z.enum(["quote", "partnership", "as", "etc"], {
    message: "문의 유형을 선택해주세요.",
  }),
  title: z.string().trim().max(200, "제목은 200자 이내로 입력해주세요.").optional(),
  message: z.string().trim().min(1, "문의 내용을 입력해주세요."),
  agreePrivacy: z.literal(true, {
    message: "개인정보 수집 및 이용에 동의해주세요.",
  }),
  // 봇 방지용 허니팟 — 사람 눈에는 보이지 않는 필드. 값이 채워져 있으면
  // app/(public)/contact/actions.ts에서 zod 검증 전에 먼저 걸러내 스팸으로
  // 간주하고 조용히 성공 응답으로 위장한다(ARCHITECTURE.md §5-1).
  honeypot: z.string().optional(),
});

// react-hook-form의 zodResolver는 입력(파싱 전) 형태를 기준으로 타입을 추론하므로
// z.output이 아닌 z.input을 사용한다(.optional() 필드가 출력측에서 달라지는 것을 방지).
export type ContactFormValues = z.input<typeof contactSchema>;
