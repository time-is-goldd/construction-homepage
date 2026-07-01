"use client";

import { deletePartner } from "@/app/admin/(protected)/performance/partners/actions";

export default function DeletePartnerButton({
  partnerId,
}: {
  partnerId: string;
}) {
  return (
    <form action={() => deletePartner(partnerId)}>
      <button
        type="submit"
        className="text-status-error font-medium hover:underline"
        onClick={(event) => {
          if (!confirm("이 파트너 기업을 삭제할까요?")) {
            event.preventDefault();
          }
        }}
      >
        삭제
      </button>
    </form>
  );
}
