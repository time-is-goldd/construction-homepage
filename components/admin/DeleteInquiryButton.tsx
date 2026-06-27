"use client";

import { useTransition } from "react";
import { deleteInquiry } from "@/app/admin/(protected)/inquiries/actions";

type Props = {
  inquiryId: string;
};

export default function DeleteInquiryButton({ inquiryId }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?\n삭제된 문의는 복구할 수 없습니다.")) return;
    startTransition(() => {
      deleteInquiry(inquiryId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-lg border border-red-200 px-4 py-2 text-[14px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? "삭제 중..." : "문의 삭제"}
    </button>
  );
}
