"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import {
  addWorkImages,
  deleteWorkImage,
  type ImageActionState,
} from "@/app/admin/(protected)/works/actions";
import Button from "@/components/ui/Button";
import { validateImageFile } from "@/lib/utils/image";
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
  const [clientError, setClientError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    for (const file of files) {
      const result = validateImageFile(file);
      if (!result.ok) {
        setClientError(result.error);
        event.target.value = "";
        return;
      }
    }
    setClientError(null);
  };

  return (
    <div className="flex flex-col gap-5">
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

      <form
        ref={formRef}
        action={(formData) => {
          setClientError(null);
          formAction(formData);
          formRef.current?.reset();
        }}
        className="flex flex-col gap-2 border-t border-neutral-200 pt-4"
      >
        <label className="text-[14px] font-medium text-neutral-800">
          이미지 추가 (jpg/png/webp, 장당 5MB 이하)
        </label>
        <input
          type="file"
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="text-[14px]"
        />
        {(clientError || state?.error) && (
          <p className="text-status-error text-[13px]">
            {clientError ?? state?.error}
          </p>
        )}
        <Button type="submit" size="sm" disabled={pending} className="self-start">
          {pending ? "업로드 중..." : "업로드"}
        </Button>
      </form>
    </div>
  );
}
