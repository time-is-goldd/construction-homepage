"use client";

import { deleteWork } from "@/app/admin/(protected)/works/actions";

export default function DeleteWorkButton({ workId }: { workId: string }) {
  return (
    <form action={() => deleteWork(workId)}>
      <button
        type="submit"
        className="text-status-error font-medium hover:underline"
        onClick={(event) => {
          if (!confirm("이 시공사례를 삭제할까요? 갤러리 이미지도 함께 삭제됩니다.")) {
            event.preventDefault();
          }
        }}
      >
        삭제
      </button>
    </form>
  );
}
