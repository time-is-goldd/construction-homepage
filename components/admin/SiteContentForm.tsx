"use client";

import { useActionState } from "react";
import {
  upsertSiteContent,
  type ContentActionState,
} from "@/app/admin/(protected)/content/actions";

type Props = {
  contentKey: string;
  currentValue: string;
  rows?: number;
  updatedAt?: string;
};

const TEXTAREA_CLASS =
  "w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:outline-none resize-y";

export default function SiteContentForm({
  contentKey,
  currentValue,
  rows = 5,
  updatedAt,
}: Props) {
  const boundAction = upsertSiteContent.bind(null, contentKey);
  const [state, formAction, pending] = useActionState<
    ContentActionState,
    FormData
  >(boundAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <textarea
        name="content"
        defaultValue={currentValue}
        rows={rows}
        className={TEXTAREA_CLASS}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="text-[12px]">
          {state && "ok" in state && (
            <span className="text-green-600">저장되었습니다.</span>
          )}
          {state && "error" in state && (
            <span className="text-red-600">{state.error}</span>
          )}
          {!state && updatedAt && (
            <span className="text-neutral-400">
              최종 수정:{" "}
              {new Date(updatedAt).toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-700 px-4 py-2 text-[14px] font-medium text-white hover:bg-brand-800 disabled:opacity-50"
        >
          {pending ? "저장 중…" : "저장"}
        </button>
      </div>
    </form>
  );
}
