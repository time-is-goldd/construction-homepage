import type { InquiryStatus } from "@/types/inquiry";

// DESIGN_SYSTEM.md 1-3 시맨틱 컬러(관리자 화면 상태 표시 전용).
const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "신규",
  in_progress: "처리중",
  done: "완료",
};

const STATUS_CLASS: Record<InquiryStatus, string> = {
  new: "bg-status-new/10 text-status-new",
  in_progress: "bg-status-progress/10 text-status-progress",
  done: "bg-status-done/10 text-status-done",
};

export default function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[12px] font-medium ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
