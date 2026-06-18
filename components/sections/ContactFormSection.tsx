import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

// TODO: Phase 5에서 실제 제출(Server Action/Route Handler + Resend 발송 + 유효성 검사)을 구현.
// 이번 단계는 폼 UI/레이아웃만 구현하며 제출 버튼은 비기능 상태(type="button")로 둔다.

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-neutral-200 px-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-brand-700 focus:outline-none md:text-base";

const INQUIRY_TYPES = ["견적 문의", "제휴 문의", "AS 문의", "기타"];

export default function ContactFormSection() {
  return (
    <Section tone="white">
      <SectionHeading>문의하기</SectionHeading>
      <p className="mt-2 text-[15px] text-neutral-600 md:text-base">
        <span className="text-status-error">*</span> 표시는 필수 입력
        항목입니다.
      </p>

      <form className="mt-8 flex flex-col gap-4 md:gap-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <Field label="이름" htmlFor="name" required>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="홍길동"
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="연락처" htmlFor="phone" required>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="010-0000-0000"
              className={INPUT_CLASS}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <Field label="이메일" htmlFor="email" required>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="example@email.com"
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="문의 유형" htmlFor="inquiryType">
            <select
              id="inquiryType"
              name="inquiryType"
              defaultValue=""
              className={INPUT_CLASS}
            >
              <option value="" disabled>
                선택해주세요
              </option>
              {INQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="제목" htmlFor="subject">
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="문의 제목을 입력해주세요"
            className={INPUT_CLASS}
          />
        </Field>

        <Field label="내용" htmlFor="message" required>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="문의 내용을 입력해주세요"
            className={`${INPUT_CLASS} h-auto resize-none py-3`}
          />
        </Field>

        <Field
          label="첨부파일"
          htmlFor="attachment"
          hint="최대 5MB, JPG·PNG·PDF"
        >
          <input
            id="attachment"
            name="attachment"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="block w-full text-[14px] text-neutral-600 file:mr-4 file:rounded-lg file:border file:border-neutral-200 file:bg-white file:px-3 file:py-2 file:text-[14px] file:font-medium file:text-neutral-700 md:text-sm"
          />
        </Field>

        <div className="flex items-start gap-2">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-neutral-300"
          />
          <label
            htmlFor="agree"
            className="text-[14px] text-neutral-600 md:text-[15px]"
          >
            개인정보 수집 및 이용에 동의합니다.{" "}
            <span className="text-status-error">*</span>
          </label>
        </div>

        <Button
          type="button"
          variant="cta"
          size="lg"
          className="w-full md:w-auto md:self-start"
        >
          문의 보내기
        </Button>
      </form>
    </Section>
  );
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[14px] font-medium text-neutral-800 md:text-[15px]"
      >
        {label} {required && <span className="text-status-error">*</span>}
      </label>
      {children}
      {hint && <p className="text-[13px] text-neutral-400">{hint}</p>}
    </div>
  );
}
