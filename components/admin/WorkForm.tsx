"use client";

import { useActionState } from "react";
import {
  createWork,
  updateWork,
  type WorkActionState,
} from "@/app/admin/(protected)/works/actions";
import Button from "@/components/ui/Button";
import type { Category } from "@/types/category";
import type { Work } from "@/types/work";

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-neutral-200 px-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:outline-none md:text-base";
const TEXTAREA_CLASS = `${INPUT_CLASS} h-auto py-2.5`;

type WorkFormProps =
  | { mode: "create"; categories: Category[]; work?: undefined }
  | { mode: "edit"; categories: Category[]; work: Work };

export default function WorkForm({ mode, categories, work }: WorkFormProps) {
  const action =
    mode === "create" ? createWork : updateWork.bind(null, work.id);
  const [state, formAction, pending] = useActionState<WorkActionState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <p className="text-status-error text-[14px]">{state.error}</p>
      )}

      <Field label="제목">
        <input
          name="title"
          required
          defaultValue={work?.title}
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="간단설명">
        <input
          name="summary"
          defaultValue={work?.summary ?? ""}
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="작업설명 (줄바꿈으로 문단을 구분합니다)">
        <textarea
          name="content"
          rows={6}
          defaultValue={work?.content ?? ""}
          className={TEXTAREA_CLASS}
        />
      </Field>

      <Field label="카테고리">
        <select
          name="categoryId"
          defaultValue={work?.categoryId ?? "unclassified"}
          className={INPUT_CLASS}
        >
          {categories.map((category) => (
            <option key={category.slug} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="위치">
        <input
          name="location"
          defaultValue={work?.location ?? ""}
          className={INPUT_CLASS}
        />
      </Field>

      <label className="flex items-center gap-2 text-[14px] text-neutral-700">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={work?.isPublished ?? true}
        />
        공개
      </label>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "저장 중..." : mode === "create" ? "등록" : "저장"}
      </Button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[14px] font-medium text-neutral-800">
        {label}
      </label>
      {children}
    </div>
  );
}
