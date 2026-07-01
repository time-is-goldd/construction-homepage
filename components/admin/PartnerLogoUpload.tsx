"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import {
  deletePartnerLogo,
  uploadPartnerLogo,
  type PartnerActionState,
} from "@/app/admin/(protected)/performance/partners/actions";
import ImageDropZone from "@/components/admin/ImageDropZone";
import Button from "@/components/ui/Button";

type PartnerLogoUploadProps = {
  partnerId: string;
  currentLogoUrl: string | null;
};

export default function PartnerLogoUpload({
  partnerId,
  currentLogoUrl,
}: PartnerLogoUploadProps) {
  const uploadAction = uploadPartnerLogo.bind(null, partnerId);
  const [state, formAction, pending] = useActionState<
    PartnerActionState,
    FormData
  >(uploadAction, undefined);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="flex flex-col gap-5">
      {/* 현재 로고 */}
      {currentLogoUrl ? (
        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-medium text-neutral-700">현재 로고</p>
          <div className="relative inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <Image
              src={currentLogoUrl}
              alt="현재 로고"
              width={220}
              height={110}
              className="max-h-20 w-auto object-contain"
            />
            <form
              action={async () => deletePartnerLogo(partnerId)}
              className="absolute top-2 right-2"
            >
              <button
                type="submit"
                className="bg-status-error/90 rounded-md px-2 py-1 text-[12px] font-medium text-white hover:bg-status-error"
                onClick={(e) => {
                  if (!confirm("로고를 삭제할까요?")) e.preventDefault();
                }}
              >
                삭제
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-[14px] text-neutral-500">등록된 로고가 없습니다.</p>
      )}

      {/* 업로드 폼 */}
      <form
        action={(formData) => {
          formAction(formData);
          setResetKey((k) => k + 1);
        }}
        className="flex flex-col gap-3 border-t border-neutral-200 pt-5"
      >
        <ImageDropZone
          key={resetKey}
          name="logo"
          label={currentLogoUrl ? "로고 교체" : "로고 업로드"}
        />
        {state?.error && (
          <p className="text-status-error text-[13px]">{state.error}</p>
        )}
        <Button type="submit" size="sm" disabled={pending} className="self-start">
          {pending ? "업로드 중..." : "업로드"}
        </Button>
      </form>
    </div>
  );
}
