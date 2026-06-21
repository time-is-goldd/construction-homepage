import { z } from "zod";

// app/admin/(protected)/performance/actions.ts의 createPerformanceRecord/
// updatePerformanceRecord에서 FormData를 서버측에서 재검증할 때 사용한다.
export const performanceSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(1900, "연도를 올바르게 입력해주세요.")
    .max(2100, "연도를 올바르게 입력해주세요."),
  clientName: z.string().trim().min(1, "업체명을 입력해주세요."),
  projectName: z.string().trim().min(1, "공사명을 입력해주세요."),
  workType: z.string().trim().min(1, "공사유형을 입력해주세요."),
});

export type PerformanceFormValues = z.infer<typeof performanceSchema>;
