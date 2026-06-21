import { z } from "zod";

// app/admin/(protected)/works/actions.ts의 createWork/updateWork에서 FormData를
// 서버측에서 재검증할 때 사용한다. categoryId는 "unclassified"(공사유형 확인중)를
// 선택할 수 있어 빈 문자열/특수값을 null로 변환해 허용한다.
export const workSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해주세요."),
  summary: z.string().trim().max(300, "간단설명은 300자 이내로 입력해주세요.").optional(),
  content: z.string().trim().optional(),
  categoryId: z
    .string()
    .trim()
    .transform((value) => (value === "" || value === "unclassified" ? null : value))
    .nullable(),
  location: z.string().trim().optional(),
  isPublished: z.boolean().default(true),
});

export type WorkFormValues = z.infer<typeof workSchema>;
