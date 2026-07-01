import { z } from "zod";

export const corporateProjectSchema = z.object({
  title: z.string().trim().min(1, "기업(사례) 이름을 입력해주세요."),
  summary: z.string().trim(),
  sortOrder: z.coerce.number().int(),
  isPublished: z
    .enum(["true", "false"])
    .transform((v) => v === "true"),
});

export type CorporateProjectFormValues = z.infer<typeof corporateProjectSchema>;
