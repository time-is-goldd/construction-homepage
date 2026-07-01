"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import {
  deleteProjectImage,
  uploadProjectImage,
  type ProjectActionState,
} from "@/app/admin/(protected)/performance/projects/actions";
import ImageDropZone from "@/components/admin/ImageDropZone";
import Button from "@/components/ui/Button";

type ProjectImageUploadProps = {
  projectId: string;
  currentImageUrl: string | null;
};

export default function ProjectImageUpload({
  projectId,
  currentImageUrl,
}: ProjectImageUploadProps) {
  const uploadAction = uploadProjectImage.bind(null, projectId);
  const [state, formAction, pending] = useActionState<
    ProjectActionState,
    FormData
  >(uploadAction, undefined);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="flex flex-col gap-5">
      {/* 현재 이미지 */}
      {currentImageUrl ? (
        <div className="flex flex-col gap-3">
          <p className="text-[14px] font-medium text-neutral-700">현재 이미지</p>
          <div className="relative overflow-hidden rounded-xl border border-neutral-200">
            <Image
              src={currentImageUrl}
              alt="현재 대표 이미지"
              width={480}
              height={270}
              className="aspect-video w-full object-cover"
            />
            <form
              action={async () => deleteProjectImage(projectId)}
              className="absolute top-2 right-2"
            >
              <button
                type="submit"
                className="bg-status-error/90 rounded-md px-2 py-1 text-[12px] font-medium text-white hover:bg-status-error"
                onClick={(e) => {
                  if (!confirm("이미지를 삭제할까요?")) e.preventDefault();
                }}
              >
                삭제
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-[14px] text-neutral-500">
          등록된 이미지가 없습니다.
        </p>
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
          name="image"
          label={currentImageUrl ? "이미지 교체" : "이미지 업로드"}
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
