"use client";

import { useActionState } from "react";
import { updateInquiryMemo } from "@/app/admin/(protected)/inquiries/actions";
import Button from "@/components/ui/Button";

export default function InquiryMemoForm({
  inquiryId,
  initialMemo,
}: {
  inquiryId: string;
  initialMemo: string;
}) {
  const action = async (_prev: { saved: boolean } | undefined, formData: FormData) => {
    await updateInquiryMemo(inquiryId, String(formData.get("memo") ?? ""));
    return { saved: true };
  };
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <textarea
        name="memo"
        rows={4}
        defaultValue={initialMemo}
        placeholder="내부 메모 (고객에게 노출되지 않습니다)"
        className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-[14px] text-neutral-900 focus:border-brand-700 focus:outline-none"
      />
      <Button type="submit" size="sm" disabled={pending} className="self-start">
        {pending ? "저장 중..." : "메모 저장"}
      </Button>
      {state?.saved && !pending && (
        <p className="text-status-done text-[13px]">저장되었습니다.</p>
      )}
    </form>
  );
}
