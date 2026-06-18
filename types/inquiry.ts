export type InquiryType = "quote" | "partnership" | "as" | "etc";

export type InquiryStatus = "new" | "in_progress" | "done";

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: InquiryType;
  title: string | null;
  message: string;
  attachmentUrl: string | null;
  status: InquiryStatus;
  adminMemo: string | null;
  createdAt: string;
}
