"use client";

import { useActionState } from "react";
import {
  createPartner,
  updatePartner,
  type PartnerActionState,
} from "@/app/admin/(protected)/performance/partners/actions";
import ImageDropZone from "@/components/admin/ImageDropZone";
import Button from "@/components/ui/Button";
import type { Partner } from "@/types/partner";

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-neutral-200 px-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:outline-none md:text-base";

const TEXTAREA_CLASS =
  "w-full resize-y rounded-lg border border-neutral-200 px-3 py-2.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:outline-none md:text-base";

const SECTION_CLASS =
  "rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,28,48,0.08)] md:p-6";

type PartnerFormProps =
  | { mode: "create"; record?: undefined }
  | { mode: "edit"; record: Partner };

export default function PartnerForm({ mode, record }: PartnerFormProps) {
  const action =
    mode === "create" ? createPartner : updatePartner.bind(null, record.id);
  const [state, formAction, pending] = useActionState<
    PartnerActionState,
    FormData
  >(action, undefined);

  const achievementsText = record?.achievements.join("\n") ?? "";

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

        <div className={`flex flex-col gap-5 ${mode === "edit" ? "" : ""}`}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <Field label="기업명 *">
                <input
                  name="companyName"
                  required
                  defaultValue={record?.companyName ?? ""}
                  placeholder="돈돈팜 주식회사"
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="협력 시작 연도 *">
              <input
                name="startYear"
                type="number"
                required
                min={1900}
                max={2100}
                defaultValue={record?.startYear ?? new Date().getFullYear()}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="협력 종료 연도 (빈칸 = 현재 진행 중)">
              <input
                name="endYear"
                type="number"
                min={1900}
                max={2100}
                defaultValue={record?.endYear ?? ""}
                placeholder="빈칸이면 현재 진행 중"
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <Field label="주요 협력 실적 (한 줄에 하나씩)">
            <textarea
              name="achievements"
              rows={5}
              defaultValue={achievementsText}
              placeholder={
                "전국 7개 농장 돈사 신축 및 리모델링 공사\n지속적인 시설물 유지보수 및 기자재 공급 파트너"
              }
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

      {/* ── 로고 이미지 (추가 모드만) ── */}
      {mode === "create" && (
        <div className={SECTION_CLASS}>
          <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">
            기업 로고 <span className="text-[13px] font-normal text-neutral-500">(선택)</span>
          </h2>
          <ImageDropZone name="logo" />
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
