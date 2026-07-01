export interface Partner {
  id: string;
  companyName: string;
  label: string | null;
  startYear: number;
  endYear: number | null;
  description: string | null;
  achievements: string[];
  logoUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
