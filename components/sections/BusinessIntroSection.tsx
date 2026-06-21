import Section from "@/components/ui/Section";
import { COMPANY_NAME } from "@/lib/constants";

export default function BusinessIntroSection() {
  return (
    <Section tone="white">
      <p className="text-[15px] leading-[1.6] text-neutral-600 md:text-base">
        {COMPANY_NAME}은 돈사 신축부터 리모델링, 액비탱크/순환시설, 내부시설까지
        양돈 농가에 필요한 시공을 한 번의 의뢰로 책임지는 축사 시공 전문 기업입니다.
      </p>
      <p className="mt-4 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
        하도급 없는 직영 시공 시스템과 돈사 전문 기술진을 바탕으로 일관된 품질
        기준을 적용하며, 농장 규모와 일정에 맞춘 최적의 시공 방식을 제안합니다.
      </p>
    </Section>
  );
}
