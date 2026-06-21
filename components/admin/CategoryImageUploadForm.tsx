"use client";

import { useActionState, useRef, useState } from "react";
import {
  uploadCategoryImage,
  type SiteImageActionState,
} from "@/app/admin/(protected)/images/actions";
import Button from "@/components/ui/Button";
import { validateImageFile } from "@/lib/utils/image";

export default function CategoryImageUploadForm({
  categorySlug,
  hasExisting,
}: {
  categorySlug: string;
  hasExisting: boolean;
}) {
  const action = uploadCategoryImage.bind(null, categorySlug);
  const [state, formAction, pending] = useActionState<
    SiteImageActionState,
    FormData
  >(action, undefined);
  const [clientError, setClientError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = validateImageFile(file);
    if (!result.ok) {
      setClientError(result.error);
      event.target.value = "";
      return;
    }
    setClientError(null);
  };

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setClientError(null);
        formAction(formData);
        formRef.current?.reset();
      }}
      className="flex flex-col gap-2"
    >
      <label className="text-[13px] font-medium text-neutral-700">
        {hasExisting ? "이미지 교체" : "이미지 업로드"} (jpg/png/webp, 5MB 이하)
      </label>
      <input
        type="file"
        name="image"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="text-[13px]"
      />
      {(clientError || state?.error) && (
        <p className="text-status-error text-[13px]">
          {clientError ?? state?.error}
        </p>
      )}
      <Button type="submit" size="sm" disabled={pending} className="self-start">
        {pending ? "업로드 중..." : hasExisting ? "교체" : "업로드"}
      </Button>
    </form>
  );
}
