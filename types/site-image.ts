export type SiteImageType = "main_visual" | "logo" | "business_license";

export interface SiteImage {
  id: string;
  type: SiteImageType;
  url: string;
  alt: string | null;
  sortOrder: number;
  createdAt: string;
}
