import Section from "@/components/ui/Section";

// TODO: 실제 사업분야 개요 문구는 콘텐츠 확정 후 교체.
export default function BusinessIntroSection() {
  return (
    <Section tone="white">
      <p className="text-[15px] leading-[1.6] text-neutral-600 md:text-base">
        저희는 공장·플랜트 시공부터 리모델링, 토목공사, 준공 이후 유지보수까지
        한 번의 의뢰로 전 과정을 책임지는 시공 전문 기업입니다.
      </p>
      <p className="mt-4 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
        각 분야별 전담 인력과 보유 장비를 바탕으로 일관된 품질 기준을 적용하며,
        현장 규모와 일정에 맞춘 최적의 시공 방식을 제안합니다.
      </p>
    </Section>
  );
}
