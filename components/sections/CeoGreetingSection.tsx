import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

// TODO: 실제 대표 인사말 문구 및 사진은 콘텐츠 확정 후 교체.
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
            안녕하십니까. 저희 회사를 찾아주신 모든 분들께 깊은 감사의 말씀을
            드립니다.
          </p>
          <p className="mt-4 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
            지난 28년간 공장·플랜트·리모델링·토목 분야에서 한 건의 현장도 소홀히
            하지 않는다는 원칙으로 시공을 이어왔습니다. 안전과 품질은 타협할 수
            없는 기준이며, 이 기준이 지금까지 저희를 신뢰해주신 고객들과의
            약속이라고 믿습니다.
          </p>
          <p className="mt-4 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
            앞으로도 변하지 않는 기본기와 끊임없는 개선으로 더 나은 시공 결과를
            약속드리겠습니다. 감사합니다.
          </p>
          <p className="mt-6 text-right text-[15px] font-medium text-neutral-800 md:text-base">
            대표이사 ○○○
          </p>
        </div>
      </div>
    </Section>
  );
}
