export type SiteImageType =
  | "main_visual"
  | "logo"
  | "business_license"
  | "business_category";

export interface SiteImage {
  id: string;
  type: SiteImageType;
  url: string;
  alt: string | null;
  /** type이 "business_category"일 때만 사용. lib/constants.ts BUSINESS_CATEGORIES의 slug. */
  categorySlug: string | null;
  sortOrder: number;
  createdAt: string;
}
