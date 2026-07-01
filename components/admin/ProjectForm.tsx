"use client";

import { useActionState } from "react";
import {
  createProject,
  updateProject,
  type ProjectActionState,
} from "@/app/admin/(protected)/performance/projects/actions";
import ImageDropZone from "@/components/admin/ImageDropZone";
import Button from "@/components/ui/Button";
import type { CorporateProject } from "@/types/corporate-project";

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-neutral-200 px-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:outline-none md:text-base";

const TEXTAREA_CLASS =
  "w-full resize-y rounded-lg border border-neutral-200 px-3 py-2.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:outline-none md:text-base";

const SECTION_CLASS =
  "rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,28,48,0.08)] md:p-6";

type ProjectFormProps =
  | { mode: "create"; record?: undefined }
  | { mode: "edit"; record: CorporateProject };

export default function ProjectForm({ mode, record }: ProjectFormProps) {
  const action =
    mode === "create"
      ? createProject
      : updateProject.bind(null, record.id);
  const [state, formAction, pending] = useActionState<
    ProjectActionState,
    FormData
  >(action, undefined);

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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <Field label="기업명 / 사례명 *">
                <input
                  name="title"
                  required
                  defaultValue={record?.title ?? ""}
                  placeholder="00농장 돈사 신축"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
            <Field label="표시 순서">
              <input
                name="sortOrder"
                type="number"
                defaultValue={record?.sortOrder ?? 0}
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <Field label="간단 설명">
            <textarea
              name="summary"
              rows={3}
              defaultValue={record?.summary ?? ""}
              placeholder="돈사 신축 공사 / 경상북도 경산시"
              className={TEXTAREA_CLASS}
            />
          </Field>

          <Field label="공개 여부">
            <select
              name="isPublished"
              defaultValue={record?.isPublished !== false ? "true" : "false"}
              className={INPUT_CLASS}
            >
              <option value="true">공개</option>
              <option value="false">비공개</option>
            </select>
          </Field>
        </div>
      </div>

      {/* ── 대표 이미지 (추가 모드만) ── */}
      {mode === "create" && (
        <div className={SECTION_CLASS}>
          <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">
            대표 이미지 <span className="text-[13px] font-normal text-neutral-500">(선택)</span>
          </h2>
          <ImageDropZone name="image" />
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
      <label className="text-[14px] font-medium text-neutral-800">{label}</label>
      {children}
    </div>
  );
}
