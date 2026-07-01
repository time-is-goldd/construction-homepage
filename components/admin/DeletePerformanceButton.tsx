"use client";

import { deletePerformanceRecord } from "@/app/admin/(protected)/performance/actions";

export default function DeletePerformanceButton({
  recordId,
}: {
  recordId: string;
}) {
  return (
    <form action={() => deletePerformanceRecord(recordId)}>
      <button
        type="submit"
        className="text-status-error font-medium hover:underline"
        onClick={(event) => {
          if (!confirm("이 시공 실적을 삭제할까요?")) {
            event.preventDefault();
          }
        }}
      >
        삭제
      </button>
    </form>
  );
}
