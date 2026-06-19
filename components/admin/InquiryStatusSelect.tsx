"use client";

import { useState, useTransition } from "react";
import { updateInquiryStatus } from "@/app/admin/(protected)/inquiries/actions";
import type { InquiryStatus } from "@/types/inquiry";

const OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: "new", label: "신규" },
  { value: "in_progress", label: "처리중" },
  { value: "done", label: "완료" },
];

export default function InquiryStatusSelect({
  inquiryId,
  status,
}: {
  inquiryId: string;
  status: InquiryStatus;
}) {
  const [current, setCurrent] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={current}
      disabled={pending}
      onChange={(event) => {
        const next = event.target.value as InquiryStatus;
        setCurrent(next);
        startTransition(async () => {
          await updateInquiryStatus(inquiryId, next);
        });
      }}
      className="h-10 rounded-lg border border-neutral-200 px-3 text-[14px] text-neutral-900 focus:border-brand-700 focus:outline-none"
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
