"use client";

import { useActionState, useRef, useState } from "react";
import {
  uploadSiteImage,
  type SiteImageActionState,
} from "@/app/admin/(protected)/images/actions";
import Button from "@/components/ui/Button";
import { validateImageFile } from "@/lib/utils/image";
import type { SiteImageType } from "@/types/site-image";

export default function SiteImageUploadForm({ type }: { type: SiteImageType }) {
  const action = uploadSiteImage.bind(null, type);
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
      className="flex flex-col gap-2 border-t border-neutral-200 pt-4"
    >
      <label className="text-[14px] font-medium text-neutral-800">
        이미지 추가 (jpg/png/webp, 5MB 이하)
      </label>
      <input
        type="file"
        name="image"
        accept="image/jpeg,image/png,image/webp"
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
  );
}
