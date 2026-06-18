import type { Category } from "./category";

export interface WorkImage {
  id: string;
  workId: string;
  url: string;
  alt: string | null;
  isMain: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Work {
  id: string;
  categoryId: string | null;
  category?: Category | null;
  title: string;
  summary: string | null;
  content: string | null;
  clientName: string | null;
  isClientHidden: boolean;
  scale: string | null;
  period: string | null;
  location: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  images?: WorkImage[];
}
