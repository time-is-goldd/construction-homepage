import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { COMPANY_NAME, REPRESENTATIVE_NAME } from "@/lib/constants";

// TODO: 실제 대표 인사말 문구 및 사진은 customer-assets에 제공되지 않아 placeholder
// 유지 중(대표이사명은 사업자등록증 기준 실명으로 교체됨). 고객에게 문구 확인 후 교체 필요.
export default function CeoGreetingSection() {
  return (
    <Section tone="white">
      <SectionHeading>대표 인사말</SectionHeading>
      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
        <div className="flex aspect-[4/5] w-full items-center justify-center rounded-xl bg-neutral-100 md:w-1/3 md:flex-shrink-0">
          <span className="text-sm text-neutral-400">
            대표이사 사진 (placeholder)
          </span>
        </div>

        <div className="md:w-2/3">
          <p className="text-[15px] leading-[1.6] text-neutral-600 md:text-base">
            안녕하십니까. {COMPANY_NAME}을 찾아주신 모든 분들께 깊은 감사의
            말씀을 드립니다.
          </p>
          <p className="mt-4 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
            저희는 하도급 없는 직영 시공 시스템으로 돈사 신축부터 리모델링,
            순환시설, 환기공사까지 한 건의 현장도 소홀히 하지 않는다는 원칙으로
            시공을 이어왔습니다. 안전과 품질은 타협할 수 없는 기준이며, 이
            기준이 지금까지 저희를 신뢰해주신 농가 고객들과의 약속이라고
            믿습니다.
          </p>
          <p className="mt-4 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
            앞으로도 변하지 않는 기본기와 끊임없는 개선으로 더 나은 시공 결과를
            약속드리겠습니다. 감사합니다.
          </p>
          <p className="mt-6 text-right text-[15px] font-medium text-neutral-800 md:text-base">
            대표이사 {REPRESENTATIVE_NAME}
          </p>
        </div>
      </div>
    </Section>
  );
}
