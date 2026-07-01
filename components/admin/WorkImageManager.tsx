"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import {
  addWorkImages,
  deleteWorkImage,
  type ImageActionState,
} from "@/app/admin/(protected)/works/actions";
import ImageDropZone from "@/components/admin/ImageDropZone";
import Button from "@/components/ui/Button";
import type { WorkImage } from "@/types/work";

type WorkImageManagerProps = {
  workId: string;
  images: WorkImage[];
};

export default function WorkImageManager({
  workId,
  images,
}: WorkImageManagerProps) {
  const uploadAction = addWorkImages.bind(null, workId);
  const [state, formAction, pending] = useActionState<
    ImageActionState,
    FormData
  >(uploadAction, undefined);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="flex flex-col gap-5">
      {/* 기존 이미지 그리드 */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-video overflow-hidden rounded-lg border border-neutral-200"
            >
              <Image
                src={image.url}
                alt={image.alt ?? ""}
                fill
                sizes="200px"
                className="object-cover"
              />
              <form
                action={async () => {
                  await deleteWorkImage(image.id, workId);
                }}
                className="absolute top-1.5 right-1.5"
              >
                <button
                  type="submit"
                  className="bg-status-error/90 rounded-md px-2 py-1 text-[12px] font-medium text-white hover:bg-status-error"
                  onClick={(event) => {
                    if (!confirm("이 이미지를 삭제할까요?")) {
                      event.preventDefault();
                    }
                  }}
                >
                  삭제
                </button>
              </form>
              {image.isMain && (
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-brand-700 px-2 py-0.5 text-[11px] text-white">
                  대표
                </span>
              )}
            </div>
          ))}
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
          name="images"
          multiple
          label="이미지 추가 (jpg/png/webp, 5MB 이하)"
        />
        {state?.error && (
          <p className="text-status-error text-[13px]">{state.error}</p>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={pending}
          className="self-start"
        >
          {pending ? "업로드 중..." : "업로드"}
        </Button>
      </form>
    </div>
  );
}
