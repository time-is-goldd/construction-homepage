import { z } from "zod";

export const partnerSchema = z.object({
  companyName: z.string().trim().min(1, "기업명을 입력해주세요."),
  startYear: z.coerce
    .number()
    .int()
    .min(1900, "시작 연도를 올바르게 입력해주세요.")
    .max(2100, "시작 연도를 올바르게 입력해주세요."),
  achievements: z.string().trim(),
  sortOrder: z.coerce.number().int(),
  isPublished: z.enum(["true", "false"]).transform((v) => v === "true"),
});

export type PartnerFormValues = z.infer<typeof partnerSchema>;
