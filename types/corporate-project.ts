export interface CorporateProject {
  id: string;
  title: string;
  imageUrl: string | null;
  summary: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
