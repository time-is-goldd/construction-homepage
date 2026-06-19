"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { submitContactInquiry } from "@/app/(public)/contact/actions";
import Button from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics/gtag";
import { validateAttachmentFile } from "@/lib/utils/attachment";
import {
  INQUIRY_TYPE_OPTIONS,
  contactSchema,
  type ContactFormValues,
} from "@/lib/validation/contactSchema";

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-neutral-200 px-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:outline-none md:text-base";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      type: "" as ContactFormValues["type"],
      title: "",
      message: "",
      agreePrivacy: false as unknown as true,
    },
  });

  const [submitResult, setSubmitResult] = useState<
    { ok: true } | { ok: false; message: string } | null
  >(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setAttachmentFile(null);
      setAttachmentError(null);
      return;
    }
    const result = validateAttachmentFile(file);
    if (!result.ok) {
      setAttachmentError(result.error);
      setAttachmentFile(null);
      event.target.value = "";
      return;
    }
    setAttachmentError(null);
    setAttachmentFile(file);
  };

  // 허니팟은 react-hook-form에 register하지 않는다(register의 ref 콜백이 다른
  // 필드 입력 때마다 재실행되면서 이 입력의 DOM value를 빈 문자열로 되돌리는
  // 현상이 있었음). 대신 제출 이벤트의 실제 폼 엘리먼트에서 네이티브 FormData로
  // 직접 읽어 누락 없이 검사한다.
  const onSubmit: SubmitHandler<ContactFormValues> = async (values, event) => {
    setSubmitResult(null);

    const nativeFormData = event?.target
      ? new FormData(event.target as HTMLFormElement)
      : null;
    const honeypotValue = String(nativeFormData?.get("honeypot") ?? "");

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("phone", values.phone);
    formData.set("email", values.email);
    formData.set("type", values.type);
    formData.set("title", values.title ?? "");
    formData.set("message", values.message);
    formData.set("agreePrivacy", String(values.agreePrivacy));
    formData.set("honeypot", honeypotValue);
    if (attachmentFile) formData.set("attachment", attachmentFile);

    const result = await submitContactInquiry(undefined, formData);

    if (result?.ok) {
      setSubmitResult({ ok: true });
      trackEvent("generate_lead", { inquiry_type: values.type });
      reset();
      setAttachmentFile(null);
    } else {
      setSubmitResult({
        ok: false,
        message: result?.error ?? "문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4 md:gap-5" noValidate>
      {/* 허니팟: 사람에게는 숨겨져 있고 봇만 채우는 필드 (RHF 미등록, name으로만 식별) */}
      <input
        type="text"
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <Field label="이름" required error={errors.name?.message}>
          <input
            type="text"
            placeholder="홍길동"
            className={INPUT_CLASS}
            {...register("name")}
          />
        </Field>
        <Field label="연락처" required error={errors.phone?.message}>
          <input
            type="tel"
            placeholder="010-0000-0000"
            className={INPUT_CLASS}
            {...register("phone")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <Field label="이메일" required error={errors.email?.message}>
          <input
            type="email"
            placeholder="example@email.com"
            className={INPUT_CLASS}
            {...register("email")}
          />
        </Field>
        <Field label="문의 유형" required error={errors.type?.message}>
          <select className={INPUT_CLASS} defaultValue="" {...register("type")}>
            <option value="" disabled>
              선택해주세요
            </option>
            {INQUIRY_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="제목" error={errors.title?.message}>
        <input
          type="text"
          placeholder="문의 제목을 입력해주세요"
          className={INPUT_CLASS}
          {...register("title")}
        />
      </Field>

      <Field label="내용" required error={errors.message?.message}>
        <textarea
          rows={6}
          placeholder="문의 내용을 입력해주세요"
          className={`${INPUT_CLASS} h-auto resize-none py-3`}
          {...register("message")}
        />
      </Field>

      <Field label="첨부파일" hint="최대 5MB, JPG·PNG·PDF" error={attachmentError ?? undefined}>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleAttachmentChange}
          className="block w-full text-[14px] text-neutral-600 file:mr-4 file:rounded-lg file:border file:border-neutral-200 file:bg-white file:px-3 file:py-2 file:text-[14px] file:font-medium file:text-neutral-700 md:text-sm"
        />
      </Field>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-neutral-300"
          {...register("agreePrivacy")}
        />
        <label className="text-[14px] text-neutral-600 md:text-[15px]">
          개인정보 수집 및 이용에 동의합니다.{" "}
          <span className="text-status-error">*</span>
        </label>
      </div>
      {errors.agreePrivacy && (
        <p className="text-status-error text-[13px]">{errors.agreePrivacy.message}</p>
      )}

      {submitResult && (
        <p
          className={`text-[14px] ${submitResult.ok ? "text-status-done" : "text-status-error"}`}
        >
          {submitResult.ok
            ? "문의가 정상적으로 접수되었습니다. 빠르게 연락드리겠습니다."
            : submitResult.message}
        </p>
      )}

      <Button
        type="submit"
        variant="cta"
        size="lg"
        disabled={isSubmitting}
        className="w-full md:w-auto md:self-start"
      >
        {isSubmitting ? "전송 중..." : "문의 보내기"}
      </Button>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[14px] font-medium text-neutral-800 md:text-[15px]">
        {label} {required && <span className="text-status-error">*</span>}
      </label>
      {children}
      {hint && <p className="text-[13px] text-neutral-400">{hint}</p>}
      {error && <p className="text-status-error text-[13px]">{error}</p>}
    </div>
  );
}
