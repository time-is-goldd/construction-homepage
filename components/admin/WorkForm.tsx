"use client";

import { useActionState } from "react";
import {
  createWork,
  updateWork,
  type WorkActionState,
} from "@/app/admin/(protected)/works/actions";
import ImageDropZone from "@/components/admin/ImageDropZone";
import Button from "@/components/ui/Button";
import type { Category } from "@/types/category";
import type { Work } from "@/types/work";

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-neutral-200 px-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:outline-none md:text-base";
const TEXTAREA_CLASS = `${INPUT_CLASS} h-auto py-2.5`;

const SECTION_CLASS =
  "rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,28,48,0.08)] md:p-6";

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
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <p className="text-status-error text-[14px]">{state.error}</p>
      )}

      {/* ── 기본 정보 ── */}
      <div className={mode === "create" ? SECTION_CLASS : "flex flex-col gap-5"}>
        {mode === "create" && (
          <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">
            기본 정보
          </h2>
        )}

        <div className="flex flex-col gap-5">
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
              defaultValue={work?.categoryId ?? ""}
              className={INPUT_CLASS}
            >
              <option value="">카테고리 선택</option>
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
        </div>
      </div>

      {/* ── 시공 이미지 (추가 모드만) ── */}
      {mode === "create" && (
        <div className={SECTION_CLASS}>
          <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">
            시공 이미지{" "}
            <span className="text-[13px] font-normal text-neutral-500">
              (선택 · 여러 장 가능)
            </span>
          </h2>
          <ImageDropZone name="images" multiple />
        </div>
      )}

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
