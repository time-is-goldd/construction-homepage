import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { COMPANY_NAME, REPRESENTATIVE_NAME } from "@/lib/constants";

// 고객 검수 피드백: 대표이사 사진 섹션을 제거하고, 40~60대 경영자가 읽기
// 편하도록 글자 크기와 줄간격/여백을 키운 텍스트 중심 레이아웃으로 변경.
// 실제 인사말 문구는 customer-assets에 제공되지 않아 placeholder 유지 중
// (대표이사명은 사업자등록증 기준 실명). 고객에게 문구 확인 후 교체 필요.
export default function CeoGreetingSection() {
  return (
    <Section tone="white">
      <SectionHeading>대표 인사말</SectionHeading>
      <div className="mx-auto mt-10 max-w-[720px]">
        <p className="text-[18px] leading-[1.9] text-neutral-700 md:text-[20px]">
          안녕하십니까. {COMPANY_NAME}을 찾아주신 모든 분들께 깊은 감사의
          말씀을 드립니다.
        </p>
        <p className="mt-7 text-[18px] leading-[1.9] text-neutral-700 md:text-[20px]">
          저희는 하도급 없는 직영 시공 시스템으로 돈사 신축부터 리모델링,
          액비탱크/순환시설, 내부시설까지 한 건의 현장도 소홀히 하지 않는다는
          원칙으로 시공을 이어왔습니다. 안전과 품질은 타협할 수 없는 기준이며,
          이 기준이 지금까지 저희를 신뢰해주신 농가 고객들과의 약속이라고
          믿습니다.
        </p>
        <p className="mt-7 text-[18px] leading-[1.9] text-neutral-700 md:text-[20px]">
          앞으로도 변하지 않는 기본기와 끊임없는 개선으로 더 나은 시공 결과를
          약속드리겠습니다. 감사합니다.
        </p>
        <p className="mt-10 text-right text-[18px] font-medium text-neutral-900 md:text-[20px]">
          대표이사 {REPRESENTATIVE_NAME}
        </p>
      </div>
    </Section>
  );
}
