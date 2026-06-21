"use client";

import { useActionState } from "react";
import {
  createPerformanceRecord,
  updatePerformanceRecord,
  type PerformanceActionState,
} from "@/app/admin/(protected)/performance/actions";
import Button from "@/components/ui/Button";
import type { PerformanceRecord } from "@/types/performance";

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-neutral-200 px-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:outline-none md:text-base";

type PerformanceFormProps =
  | { mode: "create"; record?: undefined }
  | { mode: "edit"; record: PerformanceRecord };

export default function PerformanceForm({ mode, record }: PerformanceFormProps) {
  const action =
    mode === "create"
      ? createPerformanceRecord
      : updatePerformanceRecord.bind(null, record.id);
  const [state, formAction, pending] = useActionState<
    PerformanceActionState,
    FormData
  >(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <p className="text-status-error text-[14px]">{state.error}</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="연도">
          <input
            name="year"
            type="number"
            required
            defaultValue={record?.year}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="공사유형">
          <input
            name="workType"
            required
            defaultValue={record?.workType ?? ""}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      <Field label="업체명">
        <input
          name="clientName"
          required
          defaultValue={record?.clientName ?? ""}
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="공사명">
        <input
          name="projectName"
          required
          defaultValue={record?.projectName ?? ""}
          className={INPUT_CLASS}
        />
      </Field>

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
